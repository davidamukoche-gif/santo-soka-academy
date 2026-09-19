import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import { z } from 'zod';
import { appendAudit } from './audit.js';
import { closePool, createShareToken, hashShareToken, pool, query, runMigrations, sha256, withTransaction, canonicalJson } from './db.js';
import { documentInputSchema, signatureSchema, statusSchema, type DocumentInput } from './validation.js';

const app = express();
const port = Number(process.env.API_PORT ?? 4000);
const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()).filter(Boolean) ?? ['http://localhost:5173'];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '1mb' }));

const actor = (req: Request) => ({ type: req.header('x-actor-type') === 'CLIENT' ? 'CLIENT' as const : 'USER' as const, id: req.header('x-actor-id') ?? null });
const asyncRoute = (handler: (req: Request, res: Response) => Promise<void>) => (req: Request, res: Response, next: NextFunction) => handler(req, res).catch(next);
const asDocumentResponse = (row: Record<string, unknown>) => ({
  id: row.id,
  workspaceId: row.workspace_id,
  clientId: row.client_id,
  documentNumber: row.document_number,
  kind: row.kind,
  status: row.status,
  version: row.version,
  issueDate: row.issue_date,
  dueDate: row.due_date,
  currency: row.currency,
  paymentTerms: row.payment_terms,
  subtotal: Number(row.subtotal),
  discount: Number(row.discount),
  taxRate: Number(row.tax_rate),
  tax: Number(row.tax),
  total: Number(row.total),
  notes: row.notes,
  terms: row.terms,
  lockedAt: row.locked_at,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

async function loadDocument(id: string) {
  const result = await query<Record<string, unknown>>('SELECT * FROM documents WHERE id = $1', [id]);
  return result.rows[0];
}

async function loadItems(documentId: string) {
  const result = await query<Record<string, unknown>>(
    `SELECT id, position, name, description, quantity, unit_price AS "unitPrice", line_total AS "lineTotal"
     FROM document_items WHERE document_id = $1 ORDER BY position`,
    [documentId],
  );
  return result.rows.map((item) => ({ ...item, quantity: Number(item.quantity), unitPrice: Number(item.unitPrice), lineTotal: Number(item.lineTotal) }));
}

function calculateTotals(input: DocumentInput) {
  const subtotal = input.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const tax = Math.max(0, (subtotal - input.discount) * input.taxRate / 100);
  return { subtotal, tax, total: subtotal - input.discount + tax };
}

app.get('/health', asyncRoute(async (_req, res) => {
  await query('SELECT 1');
  res.json({ ok: true, service: 'papertrail-api', database: 'connected' });
}));

app.post('/api/workspaces', asyncRoute(async (req, res) => {
  const body = z.object({ name: z.string().min(1).max(200) }).parse(req.body);
  const result = await query('INSERT INTO workspaces (name) VALUES ($1) RETURNING id, name, created_at AS "createdAt"', [body.name]);
  res.status(201).json(result.rows[0]);
}));

app.post('/api/clients', asyncRoute(async (req, res) => {
  const body = z.object({ workspaceId: z.string().uuid(), name: z.string().min(1), company: z.string().optional(), email: z.string().email(), phone: z.string().optional(), address: z.string().optional() }).parse(req.body);
  const result = await query(
    `INSERT INTO clients (workspace_id, name, company, email, phone, address)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, workspace_id AS "workspaceId", name, company, email, phone, address, created_at AS "createdAt"`,
    [body.workspaceId, body.name, body.company ?? null, body.email, body.phone ?? null, body.address ?? null],
  );
  res.status(201).json(result.rows[0]);
}));

app.get('/api/documents', asyncRoute(async (req, res) => {
  const workspaceId = z.string().uuid().parse(req.query.workspaceId);
  const status = req.query.status ? z.string().parse(req.query.status) : null;
  const result = await query<Record<string, unknown>>(
    `SELECT * FROM documents WHERE workspace_id = $1 AND ($2::text IS NULL OR status = $2) ORDER BY created_at DESC LIMIT 100`,
    [workspaceId, status],
  );
  res.json(result.rows.map(asDocumentResponse));
}));

app.post('/api/documents', asyncRoute(async (req, res) => {
  const input = documentInputSchema.parse(req.body);
  const totals = calculateTotals(input);
  const token = createShareToken();
  const result = await withTransaction(async (client) => {
    const sequence = await client.query<{ next_number: number }>(
      `SELECT COALESCE(MAX((regexp_match(document_number, '(\\d+)$'))[1]::int), 0) + 1 AS next_number
       FROM documents WHERE workspace_id = $1 AND kind = $2`,
      [input.workspaceId, input.kind],
    );
    const prefix = input.kind === 'INVOICE' ? 'INV' : 'QUO';
    const documentNumber = `${prefix}-${new Date().getUTCFullYear()}-${String(sequence.rows[0].next_number).padStart(3, '0')}`;
    const document = await client.query<Record<string, unknown>>(
      `INSERT INTO documents
       (workspace_id, client_id, document_number, kind, issue_date, due_date, currency, payment_terms, subtotal, discount, tax_rate, tax, total, notes, terms, share_token_hash)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
       RETURNING *`,
      [input.workspaceId, input.clientId, documentNumber, input.kind, input.issueDate ?? new Date(), input.dueDate ?? null, input.currency.toUpperCase(), input.paymentTerms ?? null, totals.subtotal, input.discount, input.taxRate, totals.tax, totals.total, input.notes ?? null, input.terms ?? null, hashShareToken(token)],
    );
    const row = document.rows[0];
    for (const [position, item] of input.items.entries()) {
      await client.query(
        `INSERT INTO document_items (document_id, position, name, description, quantity, unit_price, line_total)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [row.id, position, item.name, item.description, item.quantity, item.unitPrice, item.quantity * item.unitPrice],
      );
    }
    await appendAudit(client, { workspaceId: input.workspaceId, documentId: String(row.id), eventType: 'DOCUMENT_CREATED', actorType: 'USER', actorId: actor(req).id, metadata: { documentNumber, kind: input.kind, version: 1 } });
    return { row, shareToken: token };
  });
  res.status(201).json({ document: asDocumentResponse(result.row), shareToken: result.shareToken, shareUrl: `/sign/${result.shareToken}` });
}));

app.get('/api/documents/:id', asyncRoute(async (req, res) => {
  const document = await loadDocument(req.params.id);
  if (!document) { res.status(404).json({ error: 'Document not found' }); return; }
  res.json({ document: asDocumentResponse(document), items: await loadItems(req.params.id) });
}));

app.get('/api/sign/:token', asyncRoute(async (req, res) => {
  const result = await query<Record<string, unknown>>(
    `SELECT d.*, c.name AS client_name, c.company AS client_company, c.email AS client_email
     FROM documents d JOIN clients c ON c.id = d.client_id WHERE d.share_token_hash = $1`,
    [hashShareToken(req.params.token)],
  );
  const document = result.rows[0];
  if (!document) { res.status(404).json({ error: 'Share link is invalid or expired' }); return; }
  await withTransaction(async (client) => {
    await appendAudit(client, { workspaceId: String(document.workspace_id), documentId: String(document.id), eventType: 'CLIENT_OPENED', actorType: 'CLIENT', metadata: { userAgent: req.get('user-agent') ?? null } });
    if (document.status === 'SENT') { await client.query('UPDATE documents SET status = \'VIEWED\' WHERE id = $1', [document.id]); document.status = 'VIEWED'; }
  });
  res.json({ document: { ...asDocumentResponse(document), client: { name: document.client_name, company: document.client_company, email: document.client_email } }, items: await loadItems(String(document.id)) });
}));

app.patch('/api/documents/:id/status', asyncRoute(async (req, res) => {
  const body = statusSchema.parse(req.body);
  const document = await loadDocument(req.params.id);
  if (!document) { res.status(404).json({ error: 'Document not found' }); return; }
  if (document.locked_at) { res.status(409).json({ error: 'Signed documents are locked. Create a new version instead.' }); return; }
  const updated = await withTransaction(async (client) => {
    const row = await client.query<Record<string, unknown>>('UPDATE documents SET status = $1 WHERE id = $2 RETURNING *', [body.status, req.params.id]);
    await appendAudit(client, { workspaceId: String(document.workspace_id), documentId: req.params.id, eventType: `DOCUMENT_${body.status}`, actorType: actor(req).type, actorId: actor(req).id });
    return row.rows[0];
  });
  res.json(asDocumentResponse(updated));
}));

app.post('/api/documents/:id/versions', asyncRoute(async (req, res) => {
  const input = documentInputSchema.omit({ workspaceId: true, clientId: true, kind: true }).parse(req.body);
  const current = await loadDocument(req.params.id);
  if (!current) { res.status(404).json({ error: 'Document not found' }); return; }
  const totals = calculateTotals({ ...input, workspaceId: String(current.workspace_id), clientId: String(current.client_id), kind: String(current.kind) as 'INVOICE' | 'QUOTATION' });
  const version = Number(current.version) + 1;
  const updated = await withTransaction(async (client) => {
    const snapshot = { document: asDocumentResponse(current), items: await loadItems(req.params.id) };
    await client.query('INSERT INTO document_versions (document_id, version, snapshot, content_hash) VALUES ($1,$2,$3,$4)', [req.params.id, current.version, snapshot, sha256(canonicalJson(snapshot))]);
    const row = await client.query<Record<string, unknown>>(
      `UPDATE documents SET version=$1, status='DRAFT', locked_at=NULL, due_date=$2, currency=$3, payment_terms=$4, subtotal=$5, discount=$6, tax_rate=$7, tax=$8, total=$9, notes=$10, terms=$11 WHERE id=$12 RETURNING *`,
      [version, input.dueDate ?? null, input.currency.toUpperCase(), input.paymentTerms ?? null, totals.subtotal, input.discount, input.taxRate, totals.tax, totals.total, input.notes ?? null, input.terms ?? null, req.params.id],
    );
    await client.query('DELETE FROM document_items WHERE document_id = $1', [req.params.id]);
    for (const [position, item] of input.items.entries()) await client.query('INSERT INTO document_items (document_id, position, name, description, quantity, unit_price, line_total) VALUES ($1,$2,$3,$4,$5,$6,$7)', [req.params.id, position, item.name, item.description, item.quantity, item.unitPrice, item.quantity * item.unitPrice]);
    await appendAudit(client, { workspaceId: String(current.workspace_id), documentId: req.params.id, eventType: 'DOCUMENT_VERSION_CREATED', actorType: actor(req).type, actorId: actor(req).id, metadata: { previousVersion: current.version, version } });
    return row.rows[0];
  });
  res.status(201).json({ document: asDocumentResponse(updated), items: await loadItems(req.params.id) });
}));

app.post('/api/documents/:id/sign', asyncRoute(async (req, res) => {
  const signature = signatureSchema.parse(req.body);
  const current = await loadDocument(req.params.id);
  if (!current) { res.status(404).json({ error: 'Document not found' }); return; }
  if (current.locked_at || current.status === 'SIGNED') { res.status(409).json({ error: 'Document version is already signed' }); return; }
  const signed = await withTransaction(async (client) => {
    const snapshot = { document: asDocumentResponse(current), items: await loadItems(req.params.id) };
    const documentHash = sha256(canonicalJson({ snapshot, signature: { signerName: signature.signerName, signerEmail: signature.signerEmail ?? null, signatureText: signature.signatureText ?? null } }));
    const row = await client.query<Record<string, unknown>>('UPDATE documents SET status=\'SIGNED\', locked_at=now() WHERE id=$1 RETURNING *', [req.params.id]);
    await client.query('INSERT INTO signatures (document_id, document_version, signer_name, signer_email, signature_text, ip_address, user_agent, document_hash) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [req.params.id, current.version, signature.signerName, signature.signerEmail ?? null, signature.signatureText ?? null, req.ip, req.get('user-agent') ?? null, documentHash]);
    await appendAudit(client, { workspaceId: String(current.workspace_id), documentId: req.params.id, eventType: 'SIGNATURE_APPLIED', actorType: 'CLIENT', actorId: signature.signerEmail ?? signature.signerName, metadata: { version: current.version, documentHash } });
    return { row: row.rows[0], documentHash };
  });
  res.status(201).json({ document: asDocumentResponse(signed.row), signature: { documentHash: signed.documentHash, status: 'SIGNED' } });
}));

app.get('/api/documents/:id/audit', asyncRoute(async (req, res) => {
  const result = await query<Record<string, unknown>>(
    `SELECT id, event_type AS "eventType", actor_type AS "actorType", actor_id AS "actorId", metadata, previous_hash AS "previousHash", event_hash AS "eventHash", occurred_at AS "occurredAt" FROM audit_events WHERE document_id = $1 ORDER BY id ASC`,
    [req.params.id],
  );
  res.json(result.rows);
}));

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof z.ZodError) { res.status(400).json({ error: 'Validation failed', details: error.flatten() }); return; }
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  await runMigrations();
  const server = app.listen(port, '0.0.0.0', () => console.log(`Papertrail API listening on http://localhost:${port}`));
  const shutdown = async () => { server.close(); await closePool(); process.exit(0); };
  process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown);
}

if (process.env.NODE_ENV !== 'test') start().catch((error) => { console.error(error); process.exit(1); });

export { app };

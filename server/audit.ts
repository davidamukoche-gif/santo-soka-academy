import type { PoolClient } from 'pg';
import { canonicalJson, sha256 } from './db.js';

type AuditInput = {
  workspaceId: string;
  documentId?: string | null;
  eventType: string;
  actorType: 'USER' | 'CLIENT' | 'SYSTEM';
  actorId?: string | null;
  metadata?: Record<string, unknown>;
};

export async function appendAudit(client: PoolClient, input: AuditInput) {
  const previous = await client.query<{ event_hash: string }>(
    'SELECT event_hash FROM audit_events WHERE workspace_id = $1 ORDER BY id DESC LIMIT 1 FOR UPDATE',
    [input.workspaceId],
  );
  const previousHash = previous.rows[0]?.event_hash ?? null;
  const occurredAt = new Date().toISOString();
  const metadata = input.metadata ?? {};
  const eventHash = sha256(canonicalJson({
    workspaceId: input.workspaceId,
    documentId: input.documentId ?? null,
    eventType: input.eventType,
    actorType: input.actorType,
    actorId: input.actorId ?? null,
    metadata,
    previousHash,
    occurredAt,
  }));
  const result = await client.query(
    `INSERT INTO audit_events
      (workspace_id, document_id, event_type, actor_type, actor_id, metadata, previous_hash, event_hash, occurred_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING id, occurred_at AS "occurredAt", event_hash AS "eventHash"`,
    [input.workspaceId, input.documentId ?? null, input.eventType, input.actorType, input.actorId ?? null, metadata, previousHash, eventHash, occurredAt],
  );
  return result.rows[0];
}

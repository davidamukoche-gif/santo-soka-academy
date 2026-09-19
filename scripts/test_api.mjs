const api = 'http://127.0.0.1:4000';
const request = async (path, options = {}) => {
  const response = await fetch(`${api}${path}`, { headers: { 'content-type': 'application/json', ...(options.headers ?? {}) }, ...options });
  const body = await response.json().catch(() => ({}));
  if (!response.ok && !options.expectStatus?.includes(response.status)) throw new Error(`${options.method ?? 'GET'} ${path} -> ${response.status} ${JSON.stringify(body)}`);
  return { status: response.status, body };
};
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const workspace = await request('/api/workspaces', { method: 'POST', body: JSON.stringify({ name: `Integration workspace ${Date.now()}` }) });
const client = await request('/api/clients', { method: 'POST', body: JSON.stringify({ workspaceId: workspace.body.id, name: 'John Kamau', company: 'Nairobi Green Co.', email: 'john@example.com' }) });
const created = await request('/api/documents', {
  method: 'POST',
  body: JSON.stringify({ workspaceId: workspace.body.id, clientId: client.body.id, kind: 'INVOICE', currency: 'KES', discount: 1000, taxRate: 16, items: [{ name: 'Website build', description: 'Marketing site', quantity: 1, unitPrice: 100000 }] }),
});
assert(created.body.document.total === 114840, `expected total 114840, got ${created.body.document.total}`);
await request(`/api/documents/${created.body.document.id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'SENT' }) });
const shared = await request(`/api/sign/${created.body.shareToken}`);
assert(shared.body.document.status === 'VIEWED', 'share view should mark document as viewed');
const signed = await request(`/api/documents/${created.body.document.id}/sign`, { method: 'POST', body: JSON.stringify({ signerName: 'John Kamau', signerEmail: 'john@example.com', signatureText: 'John Kamau' }) });
assert(signed.body.signature.status === 'SIGNED', 'signature should lock the document');
const lockedStatus = await request(`/api/documents/${created.body.document.id}/status`, { method: 'PATCH', expectStatus: [409], body: JSON.stringify({ status: 'PAID' }) });
assert(lockedStatus.status === 409, 'locked document should reject status changes');
const version = await request(`/api/documents/${created.body.document.id}/versions`, { method: 'POST', body: JSON.stringify({ currency: 'KES', discount: 0, taxRate: 16, items: [{ name: 'Website build v2', description: 'Updated scope', quantity: 1, unitPrice: 120000 }] }) });
assert(version.body.document.version === 2 && version.body.document.status === 'DRAFT', 'new version should be editable');
const audit = await request(`/api/documents/${created.body.document.id}/audit`);
assert(audit.body.length >= 5, `expected audit history, got ${audit.body.length}`);
for (let i = 1; i < audit.body.length; i++) assert(audit.body[i].previousHash === audit.body[i - 1].eventHash, 'audit hash chain is broken');
console.log(JSON.stringify({ ok: true, workspaceId: workspace.body.id, documentId: created.body.document.id, signedHash: signed.body.signature.documentHash, auditEvents: audit.body.length, finalVersion: version.body.document.version }, null, 2));

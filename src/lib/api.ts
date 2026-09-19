export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export type PersistedInvoiceInput = {
  workspaceId: string;
  clientId: string;
  kind: 'INVOICE' | 'QUOTATION';
  currency: string;
  discount: number;
  taxRate: number;
  items: Array<{ name: string; description: string; quantity: number; unitPrice: number }>;
  notes?: string;
  terms?: string;
};

export const apiIsConfigured = Boolean(API_BASE_URL);

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_BASE_URL) throw new Error('VITE_API_BASE_URL is not configured');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error ?? `API request failed (${response.status})`);
  return body as T;
}

export async function getOrCreateDemoContext() {
  const saved = localStorage.getItem('papertrail-demo-context');
  if (saved) return JSON.parse(saved) as { workspaceId: string; clientId: string };
  const workspace = await apiRequest<{ id: string }>('/api/workspaces', { method: 'POST', body: JSON.stringify({ name: 'Amukoche Labs' }) });
  const client = await apiRequest<{ id: string }>('/api/clients', {
    method: 'POST',
    body: JSON.stringify({ workspaceId: workspace.id, name: 'Nairobi Green Co.', email: 'hello@nairobigreen.co.ke', company: 'Nairobi Green Co.' }),
  });
  const context = { workspaceId: workspace.id, clientId: client.id };
  localStorage.setItem('papertrail-demo-context', JSON.stringify(context));
  return context;
}

export async function persistInvoice(input: Omit<PersistedInvoiceInput, 'workspaceId' | 'clientId'>) {
  const context = await getOrCreateDemoContext();
  return apiRequest<{ document: { id: string; documentNumber: string; total: number }; shareToken: string; shareUrl: string }>('/api/documents', {
    method: 'POST',
    body: JSON.stringify({ ...input, ...context }),
  });
}

# Papertrail API

This API persists invoices, quotations, document versions, signatures, and append-only audit events in PostgreSQL. It is intentionally separate from the GitHub Pages frontend because Pages can only host static assets.

## Local setup

```bash
cp .env.example .env
docker compose up -d postgres
pnpm install
pnpm run db:migrate
pnpm run api:dev
```

The API listens on `http://localhost:4000`. Health check: `GET /health`.

## Core routes

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/workspaces` | Create a workspace |
| POST | `/api/clients` | Create a client |
| GET | `/api/documents?workspaceId=...` | List documents, optionally filtered by status |
| POST | `/api/documents` | Create an invoice or quotation and return a one-time share token |
| GET | `/api/documents/:id` | Load a document and its line items |
| GET | `/api/sign/:token` | Public client review endpoint; records `CLIENT_OPENED` |
| PATCH | `/api/documents/:id/status` | Mark sent, approved, rejected, changes requested, or paid |
| POST | `/api/documents/:id/versions` | Create a new editable version after a signed version is locked |
| POST | `/api/documents/:id/sign` | Sign the current document version and lock it |
| GET | `/api/documents/:id/audit` | Read the ordered audit trail |

## Security model

Share links store only a SHA-256 hash of the random token. Signing runs in a transaction, computes a SHA-256 document hash from the exact document snapshot and signature payload, inserts the signature record, locks the document version, and appends a `SIGNATURE_APPLIED` audit event. Audit rows form a per-workspace hash chain through `previous_hash` and `event_hash`.

The API rejects status changes on locked documents. Changes after signing must go through the version route, which snapshots the signed version in `document_versions`, increments the version, resets the editable status to `DRAFT`, and appends `DOCUMENT_VERSION_CREATED`.

Before production, add authenticated workspace authorization middleware, rate limiting on share/sign routes, CSRF protection if cookie auth is used, an encrypted PDF/object-storage layer, key management for signature verification, and a background job for email reminders.

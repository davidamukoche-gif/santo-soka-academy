import { Pool, type PoolClient, type QueryResultRow } from 'pg';
import { createHash, randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  max: Number(process.env.DB_POOL_SIZE ?? 10),
});

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, values: unknown[] = []) {
  return pool.query<T>(text, values);
}

export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export const canonicalJson = (value: unknown) => JSON.stringify(value, Object.keys(value as object).sort());
export const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');
export const createShareToken = () => randomBytes(32).toString('base64url');
export const hashShareToken = (token: string) => sha256(token);

export async function runMigrations() {
  const schemaPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'schema.sql');
  await query(await readFile(schemaPath, 'utf8'));
}

export async function closePool() {
  await pool.end();
}

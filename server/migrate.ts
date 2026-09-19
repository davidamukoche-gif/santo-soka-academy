import 'dotenv/config';
import { closePool, runMigrations } from './db.js';

try {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  await runMigrations();
  console.log('Database schema is up to date.');
} finally {
  await closePool();
}

import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { env } from '../config/env.js';
import * as schema from './schema.js';

/** Crea la carpeta contenedora cuando usamos un archivo SQLite local. */
function ensureLocalDatabaseDirectory(url: string): void {
  const isRemote = url.includes('://') && !url.startsWith('file:');
  if (isRemote || url === ':memory:') return;

  const filePath = url.replace(/^file:/, '');
  if (filePath) {
    mkdirSync(dirname(filePath), { recursive: true });
  }
}

ensureLocalDatabaseDirectory(env.DATABASE_URL);

export const sqliteClient = createClient({ url: env.DATABASE_URL });

export const db = drizzle(sqliteClient, { schema });

export type Database = typeof db;

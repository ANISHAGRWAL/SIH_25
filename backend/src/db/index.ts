// db/index.ts

import { Pool } from 'pg';

import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { config } from 'dotenv';

config();

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, {
  schema,
  logger: true,
});

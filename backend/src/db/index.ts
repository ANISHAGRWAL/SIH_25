// db/index.ts

import { Pool } from '@neondatabase/serverless';

import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '../db/schema';
import { config } from 'dotenv';

config();

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, {
  schema,
  logger: true,
});

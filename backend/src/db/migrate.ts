import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import config from '../../drizzle.config';
import { db } from '../db';

async function main() {
  await migrate(db, { migrationsFolder: config.out! });
}

main();

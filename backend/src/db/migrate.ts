import { migrate } from 'drizzle-orm/node-postgres/migrator';
import config from '../../drizzle.config';
import { db } from '../db';

async function main() {
  await migrate(db, { migrationsFolder: config.out! });
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed', err);
  process.exit(1);
});

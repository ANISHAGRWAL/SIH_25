import { migrate } from "drizzle-orm/neon-http/migrator";
import config from "../../drizzle.config";
import { db } from "../db";

async function main() {
  await migrate(db, { migrationsFolder: config.out! });
}

main();

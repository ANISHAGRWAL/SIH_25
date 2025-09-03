// db/index.ts

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../db/schema";
import { config } from "dotenv";

config();

export const connection = neon(process.env.DATABASE_URL as string);

export const db = drizzle(connection, {
  schema,
  logger: true,
});

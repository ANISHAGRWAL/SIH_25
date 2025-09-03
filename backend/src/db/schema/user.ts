import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const RoleEnum = pgEnum("role", ["student", "admin"]);

export const user = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: RoleEnum("role").default("student").notNull(),
});

export type IRole = (typeof RoleEnum.enumValues)[number];
export type IUser = typeof user.$inferSelect;
export type INewUser = typeof user.$inferInsert;

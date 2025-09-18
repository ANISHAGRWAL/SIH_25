import {
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const otp = pgTable('otp', {
  email: varchar('email').notNull().primaryKey(),
  code: integer('code').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: false }).notNull(),
  isVerified: boolean('is_verified').notNull().default(false),
});

export type IOtp = typeof otp.$inferSelect;
export type INewOtp = typeof otp.$inferInsert;

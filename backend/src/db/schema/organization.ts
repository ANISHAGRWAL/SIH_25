import { relations, sql } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { user } from './user';

export const organization = pgTable('organization', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const organizationRelations = relations(organization, ({ many }) => ({
  users: many(user),
}));

export type IOrganization = typeof organization.$inferSelect;
export type INewOrganization = typeof organization.$inferInsert;

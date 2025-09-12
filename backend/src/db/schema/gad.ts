import { relations, sql } from 'drizzle-orm';
import {
  foreignKey,
  integer,
  pgTable,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { user } from './user';
import { organization } from './organization';

export const gad = pgTable(
  'gad',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    studentId: uuid('student_id').notNull(),
    score: integer('score').notNull(),
    organizationId: uuid('organization_id').notNull(),
    takenOn: timestamp('taken_on', { withTimezone: false })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.studentId],
      foreignColumns: [user.id],
      name: 'fk_gad_user',
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organization.id],
      name: 'fk_gad_organization',
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
  ],
);

export const gadRelations = relations(gad, ({ one }) => ({
  student: one(user, {
    fields: [gad.studentId],
    references: [user.id],
  }),
  organization: one(organization),
}));

export type IGad = typeof gad.$inferSelect;
export type INewGad = typeof gad.$inferInsert;

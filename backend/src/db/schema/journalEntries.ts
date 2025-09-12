import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  foreignKey,
  integer,
  doublePrecision,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { user } from './user'; // Assuming user schema is defined

export const journalEntries = pgTable(
  'journal_entries',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    studentId: uuid('student_id').notNull(),
    content: text('content').notNull(),
    mood_disturbance: doublePrecision('mood_disturbance'),
    sleep_disruption: doublePrecision('sleep_disruption'),
    appetite_issues: doublePrecision('appetite_issues'),
    academic_disengagement: doublePrecision('academic_disengagement'),
    social_withdrawal: doublePrecision('social_withdrawal'),
    date: timestamp('taken_on', { withTimezone: false }).notNull().defaultNow(),
    organizationId: uuid('organization_id').notNull(),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    foreignKey({
      columns: [table.studentId],
      foreignColumns: [user.id],
      name: 'fk_journal_entries_user',
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
  ],
);

export const journalEntriesRelations = relations(journalEntries, ({ one }) => ({
  student: one(user, {
    fields: [journalEntries.studentId],
    references: [user.id],
  }),
}));

export type IJournalEntry = typeof journalEntries.$inferSelect;
export type INewJournalEntry = typeof journalEntries.$inferInsert;

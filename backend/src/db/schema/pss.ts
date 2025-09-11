import { relations, sql } from 'drizzle-orm';
import {
  foreignKey,
  integer,
  pgTable,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { user } from './user';

export const pss = pgTable(
  'pss',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    studentId: uuid('student_id').notNull(),
    score: integer('score').notNull(),
    takenOn: timestamp('taken_on', { withTimezone: false })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.studentId],
      foreignColumns: [user.id],
      name: 'fk_pss_user',
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
  ],
);

export const pssRelations = relations(pss, ({ one }) => ({
  student: one(user),
}));

export type IPss = typeof pss.$inferSelect;
export type INewPss = typeof pss.$inferInsert;

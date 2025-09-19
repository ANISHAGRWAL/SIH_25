import { sql } from 'drizzle-orm';
import { foreignKey, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from './user';

export const chatSessions = pgTable(
  'chat_sessions',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    studentId: uuid('student_id').notNull(),
    volunteerId: uuid('volunteer_id').notNull(),
    startedAt: timestamp('started_at').default(sql`CURRENT_TIMESTAMP`),
    endedAt: timestamp('ended_at'),
  },
  (table) => [
    foreignKey({
      columns: [table.studentId],
      foreignColumns: [user.id],
      name: 'fk_chatSessions_user',
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    foreignKey({
      columns: [table.volunteerId],
      foreignColumns: [user.id],
      name: 'fk_chatSessions_volunteer_user',
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
  ],
);

export type IChatSessions = typeof chatSessions.$inferSelect;
export type INewChatSessions = typeof chatSessions.$inferInsert;

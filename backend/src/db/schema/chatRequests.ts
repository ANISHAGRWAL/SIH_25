import { relations, sql } from 'drizzle-orm';
import {
  foreignKey,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { user } from './user';

export const ChatStatusEnum = pgEnum('status', [
  'pending',
  'accepted',
  'cancelled',
]);

export const chatRequests = pgTable(
  'chat_requests',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    studentId: uuid('student_id').notNull(),
    status: ChatStatusEnum('status').default('pending').notNull(),
    organizationId: uuid('organization_id').notNull(),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    foreignKey({
      columns: [table.studentId],
      foreignColumns: [user.id],
      name: 'fk_chatRequests_user',
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
  ],
);

export const chatRequestRelations = relations(chatRequests, ({ one }) => ({
  student: one(user, {
    fields: [chatRequests.studentId],
    references: [user.id],
  }),
}));

export type IChatRequestStatus = (typeof ChatStatusEnum.enumValues)[number];
export type IChatRequests = typeof chatRequests.$inferSelect;
export type INewChatRequests = typeof chatRequests.$inferInsert;

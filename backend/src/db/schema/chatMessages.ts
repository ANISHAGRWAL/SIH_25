import { sql } from 'drizzle-orm';
import {
  foreignKey,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { user } from './user';
import { chatSessions } from './chatSessions';

export const chatMessages = pgTable(
  'chat_messages',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    chatSessionId: uuid('chat_session_id').notNull(),
    senderId: uuid('sender_id').notNull(),
    message: text('message').notNull(),
    sentAt: timestamp('sent_at').default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    foreignKey({
      columns: [table.chatSessionId],
      foreignColumns: [chatSessions.id],
      name: 'fk_chatMessages_chatSessions',
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    foreignKey({
      columns: [table.senderId],
      foreignColumns: [user.id],
      name: 'fk_chatMessages_user',
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
  ],
);

export type IMessage = typeof chatMessages.$inferSelect;
export type INewMessage = typeof chatMessages.$inferInsert;

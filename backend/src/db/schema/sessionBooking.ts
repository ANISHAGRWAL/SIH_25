// enums.ts (or in same file)
import { date, pgEnum, time } from 'drizzle-orm/pg-core';
import { pgTable, uuid, timestamp, text } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { user } from './user';
import { relations } from 'drizzle-orm';

export const SessionModeEnum = pgEnum('session_mode', ['virtual', 'physical']);
export const UrgencyEnum = pgEnum('urgency', ['routine', 'priority', 'urgent']);
export const SessionTypeEnum = pgEnum('session_type', [
  'individual-counseling',
  'crisis-support',
  'academic-stress',
  'anxiety-depression',
  'relationship-issues',
  'career-guidance',
  'trauma-support',
  'group-therapy',
  'other',
]);
export const statusEnum = pgEnum('status', [
  'pending',
  'approved',
  'completed',
  'cancelled',
  'rejected',
]);

export const sessionBooking = pgTable('session_bookings', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  studentId: uuid('student_id').notNull(),
  sessionType: SessionTypeEnum('session_type').notNull(),
  reason: text('reason').notNull(),
  mode: SessionModeEnum('mode').notNull(),
  urgency: UrgencyEnum('urgency').notNull(),
  preferredDate: date('preferred_date').notNull(),
  preferredTime: time('preferred_time').notNull(),
  additionalNotes: text('additional_notes'),
  status: text('status').default('pending'),
  organizationId: uuid('organization_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const sessionBookingRelations = relations(sessionBooking, ({ one }) => ({
  user: one(user, {
    fields: [sessionBooking.studentId],
    references: [user.id],
  }),
}));

export type ISessionBooking = typeof sessionBooking.$inferSelect;
export type INewSessionBooking = typeof sessionBooking.$inferInsert;
export type ISessionMode = (typeof SessionModeEnum.enumValues)[number];
export type IUrgency = (typeof UrgencyEnum.enumValues)[number];
export type ISessionType = (typeof SessionTypeEnum.enumValues)[number];
export type IStatus = (typeof statusEnum.enumValues)[number];

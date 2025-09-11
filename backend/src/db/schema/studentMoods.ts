import { relations, sql } from 'drizzle-orm';
import {
  pgEnum,
  pgTable,
  serial,
  varchar,
  timestamp,
  doublePrecision,
  check,
  foreignKey,
  uuid,
} from 'drizzle-orm/pg-core';
import { user } from './user';
import { organization } from './organization';

// Enum definition
export const MoodEnum = pgEnum('mood', [
  'happy',
  'sad',
  'angry',
  'surprised',
  'disgusted',
  'fearful',
  'neutral',
]);

export const studentMoods = pgTable(
  'student_moods',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    studentId: uuid('student_id').notNull(),
    date: timestamp('date', { withTimezone: false }).defaultNow(),
    mood: MoodEnum('mood').notNull(),
    moodScore: doublePrecision('mood_score').default(0),
    organizationId: uuid('organization_id').notNull(),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    foreignKey({
      columns: [table.studentId],
      foreignColumns: [user.id],
      name: 'fk_student_moods_user',
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
    check(
      'mood_score_range',
      sql`${table.moodScore} >= 0 AND ${table.moodScore} <= 1`,
    ),
  ],
);

export const studentMoodsRelations = relations(studentMoods, ({ one }) => ({
  student: one(user),
}));

export type IMood = (typeof MoodEnum.enumValues)[number];
export type IStudentMood = typeof studentMoods.$inferSelect;
export type INewStudentMood = typeof studentMoods.$inferInsert;

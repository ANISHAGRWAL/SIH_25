import { pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { studentMoods } from './studentMoods';

export const RoleEnum = pgEnum('role', ['student', 'admin']);
export const GenderEnum = pgEnum('gender', ['male', 'female']);

export const user = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: RoleEnum('role').default('student').notNull(),
  organization: varchar('organization', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  contact: varchar('contact', { length: 20 }).notNull(),
  idProofUrl: varchar('id_proof_url', { length: 255 }).notNull(),
  city: varchar('city', { length: 100 }),
  age: varchar('age', { length: 3 }),
  gender: GenderEnum('gender'),
  yearOfStudy: varchar('year_of_study', { length: 10 }),
  department: varchar('department', { length: 100 }),
  emergencyContact: varchar('emergency_contact', { length: 20 }),
  emergencyContactPerson: varchar('emergency_contact_person', { length: 100 }),
  bio: varchar('bio', { length: 500 }),
  degree: varchar('degree', { length: 100 }),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const userRelations = relations(user, ({ many }) => ({
  moods: many(studentMoods, { relationName: 'student_moods' }),
}));

export type IRole = (typeof RoleEnum.enumValues)[number];
export type IUser = typeof user.$inferSelect;
export type INewUser = typeof user.$inferInsert;

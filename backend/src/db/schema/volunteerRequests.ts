import { sql } from 'drizzle-orm';
import { foreignKey, pgTable, uuid } from 'drizzle-orm/pg-core';
import { user } from './user';
import { organization } from './organization';

export const volunteerRequests = pgTable(
  'volunteer_requests',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    studentId: uuid('student_id').notNull(),
    organizationId: uuid('organization_id').notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.studentId],
      foreignColumns: [user.id],
      name: 'fk_volunteerRequests_user',
    }),
    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organization.id],
      name: 'fk_volunteerRequests_organization',
    }),
  ],
);

export const IVolunteerRequest = typeof volunteerRequests.$inferSelect;
export const INewVolunteerRequest = typeof volunteerRequests.$inferInsert;

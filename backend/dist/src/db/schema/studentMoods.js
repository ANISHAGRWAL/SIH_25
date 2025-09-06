"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentMoodsRelations = exports.studentMoods = exports.MoodEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const user_1 = require("./user");
// Enum definition
exports.MoodEnum = (0, pg_core_1.pgEnum)('mood', [
    'happy',
    'sad',
    'angry',
    'surprised',
    'disgusted',
    'fearful',
    'neutral',
]);
exports.studentMoods = (0, pg_core_1.pgTable)('student_moods', {
    id: (0, pg_core_1.uuid)('id')
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    studentId: (0, pg_core_1.uuid)('student_id').notNull(),
    date: (0, pg_core_1.timestamp)('date', { withTimezone: false }).defaultNow(),
    mood: (0, exports.MoodEnum)('mood').notNull(),
    moodScore: (0, pg_core_1.doublePrecision)('mood_score').default(0),
    createdAt: (0, pg_core_1.timestamp)('created_at').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    updatedAt: (0, pg_core_1.timestamp)('updated_at')
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
}, (table) => [
    (0, pg_core_1.foreignKey)({
        columns: [table.studentId],
        foreignColumns: [user_1.user.id],
        name: 'fk_student_moods_user',
    })
        .onDelete('cascade')
        .onUpdate('cascade'),
    (0, pg_core_1.check)('mood_score_range', (0, drizzle_orm_1.sql) `${table.moodScore} >= 0 AND ${table.moodScore} <= 1`),
]);
exports.studentMoodsRelations = (0, drizzle_orm_1.relations)(exports.studentMoods, ({ one }) => ({
    student: one(user_1.user),
}));

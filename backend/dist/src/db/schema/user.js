"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = exports.RoleEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.RoleEnum = (0, pg_core_1.pgEnum)("role", ["student", "admin"]);
exports.user = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id")
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    password: (0, pg_core_1.varchar)("password", { length: 255 }).notNull(),
    role: (0, exports.RoleEnum)("role").default("student").notNull(),
});

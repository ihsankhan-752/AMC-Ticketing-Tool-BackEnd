import { varchar, uuid, pgTable, text } from "drizzle-orm/pg-core";
import { userRoleEnum } from "./enums.js";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  role: userRoleEnum().notNull().default("user"),
  salt: text().notNull(),
  password: text().notNull(),
});

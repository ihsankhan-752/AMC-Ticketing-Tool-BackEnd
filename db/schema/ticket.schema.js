import { pgTable, varchar, uuid, timestamp } from "drizzle-orm/pg-core";
import {
  ticketPriorityEnum,
  ticketStatusEnum,
  ticketTypeEnum,
} from "./enums.js";

import { usersTable } from "./user.schema.js";

export const ticketsTable = pgTable("tickets", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .notNull()
    .references(() => usersTable.id),
  title: varchar({ length: 255 }).notNull(),
  content: varchar({ length: 255 }).notNull(),
  type: ticketTypeEnum().notNull(),
  status: ticketStatusEnum().notNull().default("open"),
  priority: ticketPriorityEnum().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

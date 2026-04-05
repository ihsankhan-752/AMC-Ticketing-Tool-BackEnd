import { uuid, text, pgTable, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./user.schema.js";
import { ticketsTable } from "./ticket.schema.js";

export const commentsTable = pgTable("comments", {
  id: uuid().primaryKey().defaultRandom(),

  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),

  ticketId: uuid("ticket_id")
    .notNull()
    .references(() => ticketsTable.id, { onDelete: "cascade" }),

  comment: text().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

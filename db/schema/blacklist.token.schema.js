import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const blackListTokenTable = pgTable("blacklist_tokens", {
  token: text("token").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

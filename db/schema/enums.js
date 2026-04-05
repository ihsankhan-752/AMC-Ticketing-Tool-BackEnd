import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const ticketTypeEnum = pgEnum("ticket_type", [
  "bug",
  "feature",
  "question",
]);

export const ticketStatusEnum = pgEnum("ticket_status", [
  "open",
  "inProgress",
  "closed",
  "resolved",
]);

export const ticketPriorityEnum = pgEnum("ticket_priority", [
  "low",
  "high",
  "critical",
]);

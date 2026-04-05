import db from "../db/index.js";
import { commentsTable } from "../db/schema/comment.schema.js";
import { ticketsTable } from "../db/schema/ticket.schema.js";
import { eq } from "drizzle-orm";
import { usersTable } from "../db/schema/user.schema.js";

export const addComment = async (req, res) => {
  const ticketId = req.params.id;
  const { comment } = req.body;
  const userId = req.user.id;
  const role = req.user.role;

  if (!comment) {
    return res.status(404).json({ error: "Comment should not be empty" });
  }

  const [ticket] = await db
    .select({ userId: ticketsTable.userId })
    .from(ticketsTable)
    .where(eq(ticketsTable.id, ticketId));

  if (!ticket) {
    return res.status(400).json({ error: "No Ticket found" });
  }

  if (ticket.userId !== userId && role != "admin") {
    return res.status(403).json({ error: " You are not authorized" });
  }

  const [newComment] = await db
    .insert(commentsTable)
    .values({ ticketId, userId, comment })
    .returning({ id: commentsTable.id });

  return res.status(201).json({ message: "Comment Added", id: newComment.id });
};

export const getComments = async (req, res) => {
  const ticketId = req.params.id;

  const comments = await db
    .select({
      id: commentsTable.id,
      comment: commentsTable.comment,
      createdAt: commentsTable.createdAt,

      username: usersTable.name,
      userId: usersTable.id,
      role: usersTable.role,
    })
    .from(commentsTable)
    .leftJoin(usersTable, eq(commentsTable.userId, usersTable.id))
    .where(eq(commentsTable.ticketId, ticketId));

  return res.status(200).json({ comments });
};

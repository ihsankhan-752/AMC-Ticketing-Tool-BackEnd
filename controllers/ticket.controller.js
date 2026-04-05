import { and, eq } from "drizzle-orm";
import db from "../db/index.js";
import { ticketsTable } from "../db/schema/ticket.schema.js";

export const createNewTicket = async (req, res) => {
  try {
    const { title, content, type, priority } = req.body;

    if (!title || !content || !type || !priority) {
      return res.status(400).json({ error: "All Field are required" });
    }

    await db.insert(ticketsTable).values({
      title,
      content,
      userId: req.user.id,
      type,
      priority,
    });

    return res.status(201).json({ message: "Ticket Created" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to created ticket" });
  }
};

export const getAllTicket = async (req, res) => {
  try {
    const userId = req.user.id;

    const tickets = await db
      .select({
        id: ticketsTable.id,
        userId: ticketsTable.userId,
        title: ticketsTable.title,
        content: ticketsTable.content,
        type: ticketsTable.type,
        priority: ticketsTable.priority,
        status: ticketsTable.status,
        createdAt: ticketsTable.createdAt,
      })
      .from(ticketsTable)
      .where(eq(ticketsTable.userId, userId));

    return res.status(200).json(tickets);
  } catch (error) {
    return res.status(500).json({ error: "Failed to get tickets" });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const userId = req.user.id;
    const ticketId = req.params.id;

    const [result] = await db
      .delete(ticketsTable)
      .where(
        and(eq(ticketsTable.id, ticketId), eq(ticketsTable.userId, userId)),
      )
      .returning({ id: ticketsTable.id });

    if (!result) {
      return res
        .status(404)
        .json({ error: "Ticket not found or not authorized" });
    }

    return res.status(200).json({ message: "Ticket Deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to deleteTicket ticket" });
  }
};

export const deleteTicketByAdmin = async (req, res) => {
  try {
    const ticketId = req.params.id;

    const [result] = await db
      .delete(ticketsTable)
      .where(eq(ticketsTable.id, ticketId))
      .returning({ id: ticketsTable.id });

    if (!result) {
      return res
        .status(404)
        .json({ error: "Ticket not found or not authorized" });
    }

    return res.status(200).json({ message: "Ticket Deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to deleteTicket ticket" });
  }
};

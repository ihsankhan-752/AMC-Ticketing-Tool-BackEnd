import db from "../db/index.js";
import { usersTable } from "../db/schema/user.schema.js";
import { and, eq } from "drizzle-orm";
import { createHmac, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";

import { ticketsTable } from "../db/schema/ticket.schema.js";




export const adminSignUp = async (req, res) => {
  const { email, name, password } = req.body;

  const [existingAdmin] = await db
    .select({ email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (existingAdmin) {
    return res.status(403).json({ error: `This Email ${email} already exist` });
  }

  const salt = randomBytes(256).toString("hex");

  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  await db.insert(usersTable).values({
    email,
    name,
    password: hashedPassword,
    salt,
    role: "admin",
  });

  return res.status(201).json({ message: "Account Created Successfully" });
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const [existingAdmin] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      name: usersTable.name,
      salt: usersTable.salt,
      password: usersTable.password,
      role: usersTable.role,
    })
    .from(usersTable)
    .where(and(eq(usersTable.email, email), eq(usersTable.role, "admin")));

  if (!existingAdmin) {
    return res.status(403).json({ error: `This Email ${email} did not exist` });
  }

  const salt = existingAdmin.salt;
  const hashedPassword = existingAdmin.password;

  const newHashed = createHmac("sha256", salt).update(password).digest("hex");

  if (newHashed !== hashedPassword) {
    return res.status(403).json({ error: "Incorrect password" });
  }

  const payload = {
    id: existingAdmin.id,
    email: existingAdmin.email,
    name: existingAdmin.name,
    role: existingAdmin.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

  return res.status(201).json({
    message: "Logged in Successfully",
    token: token,
    role: existingAdmin.role,
  });
};

export const getAllTickets = async (req, res) => {
  try {
    const tickets = await db
      .select({
        id: ticketsTable.id,
        title: ticketsTable.title,
        content: ticketsTable.content,
        type: ticketsTable.type,
        status: ticketsTable.status,
        priority: ticketsTable.priority,
        createdAt: ticketsTable.createdAt,
        userId: ticketsTable.userId,
        username: usersTable.name,
      })
      .from(ticketsTable)
      .leftJoin(usersTable, eq(ticketsTable.userId, usersTable.id));

    return res.status(200).json(tickets);
  } catch (e) {
    return res.status(500).json({ error: "Failed to get tickets" });
  }
};

export const updateTicketStatus = async (req, res) => {
  try {
    const ticketId = req.params.id;

    const { status } = req.body;

    const [ticket] = await db
      .select({ id: ticketsTable.id })
      .from(ticketsTable)
      .where(eq(ticketsTable.id, ticketId));

    if (!ticket) {
      return res.status(403).json({ error: "No Ticket Found" });
    }

    await db
      .update(ticketsTable)
      .set({ status })
      .where(eq(ticketsTable.id, ticketId));

    return res.status(200).json({ message: "Ticket Status Updated" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update status" });
  }
};

export const updateTicketType = async (req, res) => {
  try {
    const ticketId = req.params.id;

    const { type } = req.body;

    const [ticket] = await db
      .select({ id: ticketsTable.id })
      .from(ticketsTable)
      .where(eq(ticketsTable.id, ticketId));

    if (!ticket) {
      return res.status(404).json({ error: "No Ticket Found" });
    }

    await db
      .update(ticketsTable)
      .set({ type })
      .where(eq(ticketsTable.id, ticketId));

    return res.status(200).json({ message: "Ticket Type Updated", type });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update Type" });
  }
};

export const updateTicketPriority = async (req, res) => {
  try {
    const ticketId = req.params.id;

    const { priority } = req.body;

    const [ticket] = await db
      .select({ id: ticketsTable.id })
      .from(ticketsTable)
      .where(eq(ticketsTable.id, ticketId));

    if (!ticket) {
      return res.status(404).json({ error: "No Ticket Found" });
    }

    await db
      .update(ticketsTable)
      .set({ priority })
      .where(eq(ticketsTable.id, ticketId));

    return res
      .status(200)
      .json({ message: "Ticket priority Updated", priority });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update priority" });
  }
};

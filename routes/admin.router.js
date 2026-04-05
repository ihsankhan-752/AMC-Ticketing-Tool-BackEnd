import express from "express";

import {
  adminLogin,
  adminSignUp,
  updateTicketPriority,
  updateTicketStatus,
  updateTicketType,
  getAllTickets,
} from "../controllers/admin.controller.js";

import { deleteTicketByAdmin } from "../controllers/ticket.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post("/signup", adminSignUp);

router.post("/login", adminLogin);

router.get("/tickets", authMiddleware, adminMiddleware, getAllTickets);

router.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  deleteTicketByAdmin,
);

router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateTicketStatus,
);

router.patch("/:id/type", authMiddleware, adminMiddleware, updateTicketType);

router.patch(
  "/:id/priority",
  authMiddleware,
  adminMiddleware,
  updateTicketPriority,
);

export default router;

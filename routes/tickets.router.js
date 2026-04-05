import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createNewTicket,
  getAllTicket,
  deleteTicket,
} from "../controllers/ticket.controller.js";

const router = express.Router();

router.post("/create", authMiddleware, createNewTicket);
router.get("/", authMiddleware, getAllTicket);

router.delete("/delete/:id", authMiddleware, deleteTicket);

export default router;

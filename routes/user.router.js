import express from "express";

import {
  userSignUp,
  userLogin,
  getCurrentLoggedInUser,
  logOut,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", userSignUp);

router.post("/login", userLogin);

router.get("/", authMiddleware, getCurrentLoggedInUser);

router.post("/logout", authMiddleware, logOut);

export default router;

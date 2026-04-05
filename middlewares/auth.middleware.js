import jwt from "jsonwebtoken";
import { blackListTokenTable } from "../db/schema/blacklist.token.schema.js";
import db from "../db/index.js";
import { eq } from "drizzle-orm";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization Header" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Invalid Authorization Format" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token Missing" });
  }

  const [blacklisted] = await db
    .select()
    .from(blackListTokenTable)
    .where(eq(blackListTokenTable.token, token));

  if (blacklisted) {
    return res.status(401).json({
      error: "Token has been logged out",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (err) {
    return res.status(401).json({
      error: "Invalid or expired token",
      details: err.message,
    });
  }
};

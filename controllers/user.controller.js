import db from "../db/index.js";
import { usersTable } from "../db/schema/user.schema.js";
import { eq, and } from "drizzle-orm";
import { createHmac, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import { blackListTokenTable } from "../db/schema/blacklist.token.schema.js";

export const userSignUp = async (req, res) => {
  const { email, name, password } = req.body;

  const [existingUser] = await db
    .select({ email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (existingUser) {
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
  });

  return res.status(201).json({ message: "Account Created Successfully" });
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  const [existingUser] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      name: usersTable.name,
      salt: usersTable.salt,
      password: usersTable.password,
      role: usersTable.role,
    })
    .from(usersTable)
    .where(and(eq(usersTable.email, email), eq(usersTable.role, "user")));

  if (!existingUser) {
    return res.status(403).json({ error: `This Email ${email} did not exist` });
  }

  const salt = existingUser.salt;
  const hashedPassword = existingUser.password;

  const newHashed = createHmac("sha256", salt).update(password).digest("hex");

  if (newHashed !== hashedPassword) {
    return res.status(403).json({ error: "Incorrect password" });
  }

  const payload = {
    id: existingUser.id,
    email: existingUser.email,
    name: existingUser.name,
    role: existingUser.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

  return res.status(201).json({
    message: "Logged in Successfully",
    token: token,
  });
};

export const getCurrentLoggedInUser = async (req, res) => {
  try {
    const [user] = await db
      .select({
        email: usersTable.email,
        name: usersTable.name,
      })
      .from(usersTable)
      .where(eq(usersTable.id, req.user.id));

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went Wrong" });
  }
};

export const logOut = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(400).json({ success: false, message: "User LogOut" });
    }

    await db.insert(blackListTokenTable).values({ token });

    return res
      .status(200)
      .json({ success: true, message: "User LogOut Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

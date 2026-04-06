import express from "express";
const app = express();
const PORT = process.env.PORT ?? 8000;

import userRouter from "./routes/user.router.js";
import ticketRouter from "./routes/tickets.router.js";
import adminRouter from "./routes/admin.router.js";
import commentRouter from "./routes/comment.router.js";

app.use(express.json());

app.get("/api/health", (req, res) => {
  return res.status(200).json({ message: "Production Level Done" });
});



app.use("/user", userRouter);
app.use("/tickets", ticketRouter);
app.use("/admin", adminRouter);
app.use("/comments", commentRouter);

app.listen(PORT, (req, res) => {
  console.log(`Server is Up and Running on PORT: ${PORT}`);
});

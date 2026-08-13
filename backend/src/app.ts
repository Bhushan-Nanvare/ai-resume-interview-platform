import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.routes";
import { authMiddleware } from "./shared/authMiddleware";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);

app.get("/api/protected-test", authMiddleware, (req, res) => {
  res.json({ success: true, message: "You are authenticated" });
});

export default app;
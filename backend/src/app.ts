import express from "express";
import applicationRoutes from "./modules/applications/applications.routes";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import { authMiddleware } from "./shared/authMiddleware";
import resumeRoutes from "./modules/resumes/resumes.routes";
import jobRoutes from "./modules/jobs/jobs.routes";
import interviewRoutes from "./modules/interviews/interviews.routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/interviews", interviewRoutes);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));


app.use("/api/auth", authRoutes);

app.get("/api/protected-test", authMiddleware, (req, res) => {
  res.json({ success: true, message: "You are authenticated" });
});

app.use("/api/resumes", resumeRoutes);

export default app;
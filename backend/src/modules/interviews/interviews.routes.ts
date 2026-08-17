import { Router } from "express";
import { authMiddleware, requireRole } from "../../shared/authMiddleware";
import { startHandler, answerHandler, getSessionHandler } from "./interviews.controller";

const router = Router();

router.post("/start", authMiddleware, requireRole("CANDIDATE"), startHandler);
router.post("/:sessionId/answer", authMiddleware, requireRole("CANDIDATE"), answerHandler);
router.get("/:sessionId", authMiddleware, requireRole("CANDIDATE"), getSessionHandler);

export default router;
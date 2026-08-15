import { Router } from "express";
import { authMiddleware, requireRole } from "../../shared/authMiddleware";
import { applyHandler, listMineHandler, listApplicantsHandler } from "./applications.controller";

const router = Router();

router.post("/", authMiddleware, requireRole("CANDIDATE"), applyHandler);
router.get("/mine", authMiddleware, requireRole("CANDIDATE"), listMineHandler);
router.get("/job/:jobId", authMiddleware, requireRole("RECRUITER"), listApplicantsHandler);

export default router;
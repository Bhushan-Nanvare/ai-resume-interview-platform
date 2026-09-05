import { Router } from "express";
import { authMiddleware, requireRole } from "../../shared/authMiddleware";
import { applyHandler, listMineHandler, listApplicantsHandler } from "./applications.controller";
import { applyHandler, listMineHandler, listApplicantsHandler, updateStatusHandler } from "./applications.controller";
const router = Router();

router.post("/", authMiddleware, requireRole("CANDIDATE"), applyHandler);
router.get("/mine", authMiddleware, requireRole("CANDIDATE"), listMineHandler);
router.get("/job/:jobId", authMiddleware, requireRole("RECRUITER"), listApplicantsHandler);
router.patch("/:id/status", authMiddleware, requireRole("RECRUITER"), updateStatusHandler);

export default router;
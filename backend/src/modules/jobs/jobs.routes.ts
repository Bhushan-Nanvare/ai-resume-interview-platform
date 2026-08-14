import { Router } from "express";
import { authMiddleware, requireRole } from "../../shared/authMiddleware";
import { createHandler, listMineHandler, listAllHandler, getOneHandler } from "./jobs.controller";

const router = Router();

router.post("/", authMiddleware, requireRole("RECRUITER"), createHandler);
router.get("/mine", authMiddleware, requireRole("RECRUITER"), listMineHandler);
router.get("/", listAllHandler);          // public — candidates browse jobs, no login required
router.get("/:id", getOneHandler);         // public — view one job's details

export default router;
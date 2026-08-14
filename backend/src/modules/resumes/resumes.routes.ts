import { Router } from "express";
import multer from "multer";
import { authMiddleware, requireRole } from "../../shared/authMiddleware";
import { uploadHandler, listHandler } from "./resumes.controller";

const upload = multer({ dest: "uploads/resumes/" });
const router = Router();

router.post("/upload", authMiddleware, requireRole("CANDIDATE"), upload.single("resume"), uploadHandler);
router.get("/mine", authMiddleware, requireRole("CANDIDATE"), listHandler);

export default router;
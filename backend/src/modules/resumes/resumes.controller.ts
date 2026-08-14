import { Response } from "express";
import { AuthRequest } from "../../shared/authMiddleware";
import * as resumeService from "./resumes.service";

export async function uploadHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.file) throw new Error("No file uploaded");
    const resume = await resumeService.uploadResume(req.user!.userId, req.file);
    res.status(201).json({ success: true, data: resume });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
}

export async function listHandler(req: AuthRequest, res: Response) {
  try {
    const resumes = await resumeService.listMyResumes(req.user!.userId);
    res.json({ success: true, data: resumes });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
}
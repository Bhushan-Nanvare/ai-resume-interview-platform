import { Response } from "express";
import { z } from "zod";
import { AuthRequest } from "../../shared/authMiddleware";
import * as applicationsService from "./applications.service";

const applySchema = z.object({
  jobId: z.string().uuid(),
  resumeId: z.string().uuid(),
});

export async function applyHandler(req: AuthRequest, res: Response) {
  try {
    const { jobId, resumeId } = applySchema.parse(req.body);
    const application = await applicationsService.applyToJob(req.user!.userId, jobId, resumeId);
    res.status(201).json({ success: true, data: application });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
}

export async function listMineHandler(req: AuthRequest, res: Response) {
  try {
    const applications = await applicationsService.listMyApplications(req.user!.userId);
    res.json({ success: true, data: applications });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
}

export async function listApplicantsHandler(req: AuthRequest, res: Response) {
  try {
    const applicants = await applicationsService.listApplicantsForJob(req.user!.userId, req.params.jobId);
    res.json({ success: true, data: applicants });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
}
const statusSchema = z.object({ status: z.enum(["SHORTLISTED", "REJECTED"]) });

export async function updateStatusHandler(req: AuthRequest, res: Response) {
  try {
    const { status } = statusSchema.parse(req.body);
    const application = await applicationsService.updateApplicationStatus(req.user!.userId, req.params.id, status);
    res.json({ success: true, data: application });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
}
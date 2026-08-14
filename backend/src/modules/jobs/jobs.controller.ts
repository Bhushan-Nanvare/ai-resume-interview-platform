import { Response } from "express";
import { z } from "zod";
import { AuthRequest } from "../../shared/authMiddleware";
import * as jobsService from "./jobs.service";

const createJobSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export async function createHandler(req: AuthRequest, res: Response) {
  try {
    const { title, description } = createJobSchema.parse(req.body);
    const job = await jobsService.createJob(req.user!.userId, title, description);
    res.status(201).json({ success: true, data: job });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
}

export async function listMineHandler(req: AuthRequest, res: Response) {
  try {
    const jobs = await jobsService.listMyJobs(req.user!.userId);
    res.json({ success: true, data: jobs });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
}

export async function listAllHandler(_req: AuthRequest, res: Response) {
  const jobs = await jobsService.listAllOpenJobs();
  res.json({ success: true, data: jobs });
}

export async function getOneHandler(req: AuthRequest, res: Response) {
  try {
    const job = await jobsService.getJobById(req.params.id);
    res.json({ success: true, data: job });
  } catch (err: any) {
    res.status(404).json({ success: false, error: err.message });
  }
}
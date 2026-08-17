import { Response } from "express";
import { z } from "zod";
import { AuthRequest } from "../../shared/authMiddleware";
import * as interviewsService from "./interviews.service";

const startSchema = z.object({ applicationId: z.string().uuid() });
const answerSchema = z.object({ questionId: z.string().uuid(), answerText: z.string().min(1) });

export async function startHandler(req: AuthRequest, res: Response) {
  try {
    const { applicationId } = startSchema.parse(req.body);
    const result = await interviewsService.startInterview(req.user!.userId, applicationId);
    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
}

export async function answerHandler(req: AuthRequest, res: Response) {
  try {
    const { questionId, answerText } = answerSchema.parse(req.body);
    const result = await interviewsService.submitAnswer(req.user!.userId, req.params.sessionId, questionId, answerText);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
}

export async function getSessionHandler(req: AuthRequest, res: Response) {
  try {
    const session = await interviewsService.getSession(req.user!.userId, req.params.sessionId);
    res.json({ success: true, data: session });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
}
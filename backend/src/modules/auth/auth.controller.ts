import { Request, Response } from "express";
import { z } from "zod";
import * as authService from "./auth.service";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["CANDIDATE", "RECRUITER"]),
  name: z.string().min(1),
});

export async function signupHandler(req: Request, res: Response) {
  try {
    const { email, password, role, name } = signupSchema.parse(req.body);
    const token = await authService.signup(email, password, role, name);
    res.status(201).json({ success: true, data: { token } });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
}

export async function loginHandler(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    res.status(200).json({ success: true, data: { token } });
  } catch (err: any) {
    res.status(401).json({ success: false, error: err.message });
  }
}
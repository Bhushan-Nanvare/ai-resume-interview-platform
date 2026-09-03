import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Do NOT use a module-level const for JWT_SECRET — it gets captured before dotenv runs.
// Always read process.env at call time.
const getJwtSecret = () => process.env.JWT_SECRET || "dev_secret_change_this";

export interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    console.warn("[auth] No token provided. Authorization header:", header);
    return res.status(401).json({ success: false, error: "No token provided" });
  }

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as { userId: string; role: string };
    req.user = decoded;
    next();
  } catch (err: any) {
    console.warn("[auth] JWT verification failed:", err.message, "| Secret prefix:", getJwtSecret().slice(0, 6));
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}

export function requireRole(role: "CANDIDATE" | "RECRUITER") {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ success: false, error: "Forbidden" });
    }
    next();
  };
}
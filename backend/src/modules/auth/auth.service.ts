import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../shared/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_this";

export async function signup(email: string, password: string, role: "CANDIDATE" | "RECRUITER", name: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already registered");

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role,
      ...(role === "CANDIDATE"
        ? { candidate: { create: { fullName: name } } }
        : { recruiter: { create: { companyName: name } } }),
    },
  });

  return signToken(user.id, user.role);
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");

  return signToken(user.id, user.role);
}

function signToken(userId: string, role: string) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
}
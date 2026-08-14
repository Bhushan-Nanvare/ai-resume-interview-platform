import { prisma } from "../../shared/prisma";

export async function createJob(userId: string, title: string, description: string) {
  const recruiter = await prisma.recruiter.findUnique({ where: { userId } });
  if (!recruiter) throw new Error("Recruiter profile not found");

  return prisma.jobPosting.create({
    data: { recruiterId: recruiter.id, title, description },
  });
}

export async function listMyJobs(userId: string) {
  const recruiter = await prisma.recruiter.findUnique({ where: { userId } });
  if (!recruiter) throw new Error("Recruiter profile not found");

  return prisma.jobPosting.findMany({ where: { recruiterId: recruiter.id } });
}

export async function listAllOpenJobs() {
  return prisma.jobPosting.findMany({ where: { status: "OPEN" } });
}

export async function getJobById(jobId: string) {
  const job = await prisma.jobPosting.findUnique({ where: { id: jobId } });
  if (!job) throw new Error("Job not found");
  return job;
}
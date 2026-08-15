import { prisma } from "../../shared/prisma";

export async function applyToJob(userId: string, jobId: string, resumeId: string) {
  const candidate = await prisma.candidate.findUnique({ where: { userId } });
  if (!candidate) throw new Error("Candidate profile not found");

  const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
  if (!resume || resume.candidateId !== candidate.id) {
    throw new Error("Resume not found or doesn't belong to you");
  }

  const existing = await prisma.application.findUnique({
    where: { candidateId_jobId: { candidateId: candidate.id, jobId } },
  });
  if (existing) throw new Error("You've already applied to this job");

  return prisma.application.create({
    data: { candidateId: candidate.id, jobId, resumeId },
  });
}

export async function listMyApplications(userId: string) {
  const candidate = await prisma.candidate.findUnique({ where: { userId } });
  if (!candidate) throw new Error("Candidate profile not found");

  return prisma.application.findMany({
    where: { candidateId: candidate.id },
    include: { jobPosting: true },
  });
}

export async function listApplicantsForJob(userId: string, jobId: string) {
  const recruiter = await prisma.recruiter.findUnique({ where: { userId } });
  if (!recruiter) throw new Error("Recruiter profile not found");

  const job = await prisma.jobPosting.findUnique({ where: { id: jobId } });
  if (!job || job.recruiterId !== recruiter.id) {
    throw new Error("Job not found or doesn't belong to you");
  }

  return prisma.application.findMany({
    where: { jobId },
    include: { candidate: true, resume: true },
  });
}
import { prisma } from "../../shared/prisma";
import { generateNextQuestion, evaluateAnswer, generateFinalReport, transcribeAudio } from "../../shared/embeddings";
import fs from "fs";

const TOTAL_QUESTIONS = 5;

export async function startInterview(userId: string, applicationId: string) {
  const candidate = await prisma.candidate.findUnique({ where: { userId } });
  if (!candidate) throw new Error("Candidate profile not found");

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { resume: true, jobPosting: true, skillGaps: true },
  });
  if (!application || application.candidateId !== candidate.id) {
    throw new Error("Application not found or doesn't belong to you");
  }

  const existing = await prisma.interviewSession.findUnique({ where: { applicationId } });
  if (existing) throw new Error("Interview already started for this application");

  const session = await prisma.interviewSession.create({
    data: { applicationId, status: "IN_PROGRESS", startedAt: new Date() },
  });

  const questionText = await generateNextQuestion({
    resumeText: application.resume.parsedText || "",
    jobDescription: application.jobPosting.description,
    skillGaps: application.skillGaps.map((g) => g.missingSkill),
    previousQA: [],
    difficulty: "medium",
  });

  const question = await prisma.interviewQuestion.create({
    data: { sessionId: session.id, questionText, difficulty: "medium", orderIndex: 1 },
  });

  return { session, question };
}

export async function submitAnswer(userId: string, sessionId: string, questionId: string, answerText: string) {
  const candidate = await prisma.candidate.findUnique({ where: { userId } });
  if (!candidate) throw new Error("Candidate profile not found");

  const session = await prisma.interviewSession.findUnique({
    where: { id: sessionId },
    include: {
      application: { include: { resume: true, jobPosting: true, skillGaps: true } },
      questions: { include: { answer: true } },
    },
  });
  if (!session || session.application.candidateId !== candidate.id) {
    throw new Error("Session not found or doesn't belong to you");
  }
  if (session.status !== "IN_PROGRESS") throw new Error("This interview session is not active");

  const question = session.questions.find((q) => q.id === questionId);
  if (!question) throw new Error("Question not found in this session");
  if (question.answer) throw new Error("This question has already been answered");

  const { score, feedback } = await evaluateAnswer(question.questionText, answerText);
  await prisma.interviewAnswer.create({ data: { questionId, answerText, score } });

  const answeredCount = session.questions.filter((q) => q.answer).length + 1;
  const qaHistory = await buildQAHistory(session.id);

  if (answeredCount >= TOTAL_QUESTIONS) {
    const { summary, recommendation } = await generateFinalReport({
      jobDescription: session.application.jobPosting.description,
      qaHistory,
    });

    await prisma.report.create({ data: { sessionId: session.id, summary, recommendation } });
    await prisma.interviewSession.update({
      where: { id: session.id },
      data: { status: "COMPLETED", endedAt: new Date() },
    });

    return { done: true, score, feedback };
  }

  const nextDifficulty = score >= 7 ? "hard" : score <= 4 ? "easy" : "medium";

  const nextQuestionText = await generateNextQuestion({
    resumeText: session.application.resume.parsedText || "",
    jobDescription: session.application.jobPosting.description,
    skillGaps: session.application.skillGaps.map((g) => g.missingSkill),
    previousQA: qaHistory,
    difficulty: nextDifficulty,
  });

  const nextQuestion = await prisma.interviewQuestion.create({
    data: { sessionId: session.id, questionText: nextQuestionText, difficulty: nextDifficulty, orderIndex: answeredCount + 1 },
  });

  return { done: false, score, feedback, nextQuestion };
}

async function buildQAHistory(sessionId: string) {
  const questions = await prisma.interviewQuestion.findMany({
    where: { sessionId },
    include: { answer: true },
    orderBy: { orderIndex: "asc" },
  });

  return questions
    .filter((q) => q.answer)
    .map((q) => ({ question: q.questionText, answer: q.answer!.answerText, score: q.answer!.score || 0 }));
}

export async function getSession(userId: string, sessionId: string) {
  const candidate = await prisma.candidate.findUnique({ where: { userId } });
  if (!candidate) throw new Error("Candidate profile not found");

  const session = await prisma.interviewSession.findUnique({
    where: { id: sessionId },
    include: {
      application: true,
      questions: { include: { answer: true }, orderBy: { orderIndex: "asc" } },
      report: true,
      proctoringEvents: true,
    },
  });
  if (!session || session.application.candidateId !== candidate.id) {
    throw new Error("Session not found or doesn't belong to you");
  }
  return session;
}

export async function submitAudioAnswer(userId: string, sessionId: string, questionId: string, filePath: string, mimeType: string) {
  const audioBuffer = fs.readFileSync(filePath);
  const transcript = await transcribeAudio(audioBuffer, mimeType);
  return submitAnswer(userId, sessionId, questionId, transcript);
}
export async function logProctoringEvent(userId: string, sessionId: string, eventType: string) {
  const candidate = await prisma.candidate.findUnique({ where: { userId } });
  if (!candidate) throw new Error("Candidate profile not found");

  const session = await prisma.interviewSession.findUnique({
    where: { id: sessionId },
    include: { application: true },
  });
  if (!session || session.application.candidateId !== candidate.id) {
    throw new Error("Session not found or doesn't belong to you");
  }

  return prisma.proctoringEvent.create({ data: { sessionId, eventType } });
}
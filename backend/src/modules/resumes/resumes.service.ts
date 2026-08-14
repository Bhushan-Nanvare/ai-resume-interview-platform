import { PDFParse } from "pdf-parse";
import fs from "fs";
import { prisma } from "../../shared/prisma";

export async function uploadResume(userId: string, file: Express.Multer.File) {
  const candidate = await prisma.candidate.findUnique({ where: { userId } });
  if (!candidate) throw new Error("Candidate profile not found");

  const dataBuffer = fs.readFileSync(file.path);
  const parser = new PDFParse({ data: dataBuffer });
  const result = await parser.getText();
  await parser.destroy();

  const resume = await prisma.resume.create({
    data: {
      candidateId: candidate.id,
      fileUrl: file.path,
      parsedText: result.text,
    },
  });

  return resume;
}
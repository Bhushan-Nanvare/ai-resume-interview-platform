import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateEmbedding(text: string): Promise<number[]> {
  const result = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text.slice(0, 8000),
  });
  return result.embeddings![0].values!;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function generateSkillGaps(resumeText: string, jobDescription: string): Promise<{ skill: string; importance: string }[]> {
  const prompt = `Compare this candidate's resume against the job description below. List the specific skills, technologies, or qualifications mentioned in the job description that are missing or weak in the resume.

Resume:
${resumeText.slice(0, 4000)}

Job Description:
${jobDescription}

Respond with ONLY a JSON array, no other text, in this exact format:
[{"skill": "Docker", "importance": "high"}, {"skill": "GraphQL", "importance": "medium"}]

Use "high", "medium", or "low" for importance. If there are no meaningful gaps, respond with an empty array [].`;

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = result.text ?? "[]";
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}
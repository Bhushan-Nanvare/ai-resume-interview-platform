import api from "./axiosClient";

export async function startInterview(applicationId: string) {
  const res = await api.post("/interviews/start", { applicationId });
  return res.data.data;
}

export async function submitAnswer(sessionId: string, questionId: string, answerText: string) {
  const res = await api.post(`/interviews/${sessionId}/answer`, { questionId, answerText });
  return res.data.data;
}

export async function getSession(sessionId: string) {
  const res = await api.get(`/interviews/${sessionId}`);
  return res.data.data;
}
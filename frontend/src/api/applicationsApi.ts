import api from "./axiosClient";

export async function applyToJob(jobId: string, resumeId: string) {
  const res = await api.post("/applications", { jobId, resumeId });
  return res.data.data;
}
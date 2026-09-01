import api from "./axiosClient";

export async function listJobs() {
  const res = await api.get("/jobs");
  return res.data.data;
}

export async function createJob(title: string, description: string) {
  const res = await api.post("/jobs", { title, description });
  return res.data.data;
}

export async function listMyJobs() {
  const res = await api.get("/jobs/mine");
  return res.data.data;
}
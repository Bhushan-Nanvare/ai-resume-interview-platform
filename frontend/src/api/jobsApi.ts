import api from "./axiosClient";

export async function listJobs() {
  const res = await api.get("/jobs");
  return res.data.data;
}
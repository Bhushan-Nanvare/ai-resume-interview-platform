import api from "./axiosClient";

export async function uploadResume(file: File) {
  const formData = new FormData();
  formData.append("resume", file);
  const res = await api.post("/resumes/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}

export async function listMyResumes() {
  const res = await api.get("/resumes/mine");
  return res.data.data;
}
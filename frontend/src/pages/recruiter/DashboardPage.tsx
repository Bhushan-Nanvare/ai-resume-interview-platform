import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createJob, listMyJobs } from "../../api/jobsApi";
import Navbar from "../../components/common/Navbar";

interface Job { id: string; title: string; description: string; status: string; }

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => { loadJobs(); }, []);

  async function loadJobs() {
    try {
      setJobs(await listMyJobs());
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load jobs");
    }
  }

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    setPosting(true);
    setError("");
    try {
      await createJob(title, description);
      setTitle("");
      setDescription("");
      await loadJobs();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to post job");
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6">Post a job</h1>

        <form onSubmit={handlePost} className="bg-white p-5 rounded border space-y-3 mb-8">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Job title"
            className="w-full border rounded px-3 py-2 text-sm" required />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Job description"
            className="w-full border rounded px-3 py-2 text-sm h-24" required />
          <button type="submit" disabled={posting} className="bg-slate-900 text-white text-sm px-4 py-2 rounded">
            {posting ? "Posting..." : "Post job"}
          </button>
        </form>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <h2 className="text-lg font-semibold text-slate-900 mb-3">Your postings</h2>
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white p-4 rounded border flex justify-between items-center">
              <div>
                <p className="font-medium text-slate-900">{job.title}</p>
                <p className="text-xs text-slate-500">{job.status}</p>
              </div>
              <button onClick={() => navigate(`/recruiter/jobs/${job.id}/applicants`)} className="text-sm text-slate-600 hover:text-slate-900">
                View applicants →
              </button>
            </div>
          ))}
          {jobs.length === 0 && <p className="text-sm text-slate-400">No jobs posted yet.</p>}
        </div>
      </div>
    </div>
  );
}
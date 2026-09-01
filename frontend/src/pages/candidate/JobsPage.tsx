import { useState, useEffect } from "react";
import { listJobs } from "../../api/jobsApi";
import { listMyResumes } from "../../api/resumeApi";
import { applyToJob } from "../../api/applicationsApi";
import Navbar from "../../components/common/Navbar";

interface Job { id: string; title: string; description: string; }
interface Resume { id: string; }
interface ApplyResult { matchScore: number; skillGaps?: { missingSkill: string; importance: string }[]; }

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState("");
  const [results, setResults] = useState<Record<string, ApplyResult | "error" | "applying">>({});
  const [error, setError] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const [jobsData, resumesData] = await Promise.all([listJobs(), listMyResumes()]);
      setJobs(jobsData);
      setResumes(resumesData);
      if (resumesData.length > 0) setSelectedResume(resumesData[0].id);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load jobs");
    }
  }

  async function handleApply(jobId: string) {
    if (!selectedResume) { setError("Upload a resume first before applying."); return; }
    setResults((prev) => ({ ...prev, [jobId]: "applying" }));
    try {
      const application = await applyToJob(jobId, selectedResume);
      setResults((prev) => ({ ...prev, [jobId]: application }));
    } catch (err: any) {
      setResults((prev) => ({ ...prev, [jobId]: "error" }));
      setError(err.response?.data?.error || "Apply failed");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Open positions</h1>

        {resumes.length > 1 && (
          <div className="mb-6">
            <label className="text-sm text-slate-600">Applying with resume:</label>
            <select value={selectedResume} onChange={(e) => setSelectedResume(e.target.value)} className="ml-2 border rounded px-2 py-1 text-sm">
              {resumes.map((r) => <option key={r.id} value={r.id}>{r.id.slice(0, 8)}</option>)}
            </select>
          </div>
        )}
        {resumes.length === 0 && <p className="text-sm text-amber-600 mb-6">Upload a resume from your dashboard before applying.</p>}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="space-y-4">
          {jobs.map((job) => {
            const result = results[job.id];
            return (
              <div key={job.id} className="bg-white p-5 rounded border">
                <h2 className="font-medium text-slate-900">{job.title}</h2>
                <p className="text-sm text-slate-500 mt-1">{job.description}</p>
                {!result && (
                  <button onClick={() => handleApply(job.id)} className="mt-3 bg-slate-900 text-white text-sm px-4 py-1.5 rounded">Apply</button>
                )}
                {result === "applying" && <p className="text-sm text-slate-400 mt-3">Applying...</p>}
                {result === "error" && <p className="text-sm text-red-600 mt-3">Application failed.</p>}
                {result && typeof result === "object" && (
                  <div className="mt-3 bg-slate-50 p-3 rounded">
                    <p className="text-sm font-medium text-slate-900">Match score: {result.matchScore}%</p>
                    {result.skillGaps && result.skillGaps.length > 0 && (
                      <ul className="mt-2 text-xs text-slate-600 space-y-1">
                        {result.skillGaps.map((g, i) => <li key={i}>• {g.missingSkill} <span className="text-slate-400">({g.importance})</span></li>)}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {jobs.length === 0 && <p className="text-sm text-slate-400">No open positions right now.</p>}
        </div>
      </div>
    </div>
  );
}
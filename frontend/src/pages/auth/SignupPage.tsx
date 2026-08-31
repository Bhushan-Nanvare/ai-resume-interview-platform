import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosClient";
import { useAuthStore } from "../../store/authStore";
import { decodeToken } from "../../utils/decodeToken";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"CANDIDATE" | "RECRUITER">("CANDIDATE");
  const [error, setError] = useState("");
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/signup", { email, password, role, name });
      const token = res.data.data.token;
      const decoded = decodeToken(token);
      setAuth(token, decoded.role);
      navigate(decoded.role === "CANDIDATE" ? "/candidate/dashboard" : "/recruiter/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Signup failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">Create your account</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button type="button" onClick={() => setRole("CANDIDATE")}
            className={`flex-1 py-2 rounded text-sm ${role === "CANDIDATE" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>
            Candidate
          </button>
          <button type="button" onClick={() => setRole("RECRUITER")}
            className={`flex-1 py-2 rounded text-sm ${role === "RECRUITER" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>
            Recruiter
          </button>
        </div>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={role === "CANDIDATE" ? "Full name" : "Company name"}
          className="w-full border rounded px-3 py-2 text-sm" required />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email"
          className="w-full border rounded px-3 py-2 text-sm" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password"
          className="w-full border rounded px-3 py-2 text-sm" required />
        <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded text-sm font-medium">
          Sign up
        </button>
      </form>
    </div>
  );
}
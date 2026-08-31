import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosClient";
import { useAuthStore } from "../../store/authStore";
import { decodeToken } from "../../utils/decodeToken";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.data.token;
      const decoded = decodeToken(token);
      setAuth(token, decoded.role);
      navigate(decoded.role === "CANDIDATE" ? "/candidate/dashboard" : "/recruiter/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">Log in</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email"
          className="w-full border rounded px-3 py-2 text-sm" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password"
          className="w-full border rounded px-3 py-2 text-sm" required />
        <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded text-sm font-medium">
          Log in
        </button>
      </form>
    </div>
  );
}
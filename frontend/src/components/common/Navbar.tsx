import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function Navbar() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <span className="font-semibold text-slate-900">HireMind AI</span>
      <button onClick={() => { logout(); navigate("/login"); }} className="text-sm text-slate-500 hover:text-slate-900">
        Log out
      </button>
    </nav>
  );
}
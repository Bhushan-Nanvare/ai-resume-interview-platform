import { create } from "zustand";

interface AuthState {
  token: string | null;
  role: "CANDIDATE" | "RECRUITER" | null;
  setAuth: (token: string, role: "CANDIDATE" | "RECRUITER") => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  setAuth: (token, role) => set({ token, role }),
  logout: () => set({ token: null, role: null }),
}));
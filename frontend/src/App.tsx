import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import CandidateDashboard from "./pages/candidate/DashboardPage";
import RecruiterDashboard from "./pages/recruiter/DashboardPage";
import JobsPage from "./pages/candidate/JobsPage";
import ApplicantsPage from "./pages/recruiter/ApplicantsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/candidate/jobs" element={<JobsPage />} />
        <Route path="/recruiter/jobs/:jobId/applicants" element={<ApplicantsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
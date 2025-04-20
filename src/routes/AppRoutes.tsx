import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

// Public pages
import Login from "../pages/Login";
import Register from "../pages/register";
import VerifyEmail from "../pages/verifyEmail";

// Protected pages
import Dashboard from "../pages/Dashboard";
import CVUpload from "../pages/CVUpload";
import CandidateList from "../pages/CandidateList";
import CandidateDetail from "../pages/CandidateDetail";
import InterviewSchedule from "../pages/InterviewSchedule";
import BackgroundCheck from "../pages/BackgroundCheck";
import SectionCustomization from "../pages/SectionCustomization";
import Collaboration from "../pages/Collaboration";

const AppRoutes: React.FC = () => {
  const token = useAppSelector((state) => state.user.token);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<VerifyEmail />} />

      {/* Protected Routes */}
      {token ? (
        <>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<CVUpload />} />
          <Route path="/candidates" element={<CandidateList />} />
          <Route path="/candidates/:id" element={<CandidateDetail />} />
          <Route path="/schedule" element={<InterviewSchedule />} />
          <Route path="/background" element={<BackgroundCheck />} />
          <Route path="/custom-sections" element={<SectionCustomization />} />
          <Route path="/collaboration" element={<Collaboration />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;

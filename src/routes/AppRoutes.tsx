import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import Login from '../pages/Login'
import Register from '../pages/register'
import VerifyLink from '../pages/VerifyLink'
import VerifyOtp from '../pages/VeifyOtp'
import LayoutComponent from '../components/Layout'
import Dashboard from '../pages/Dashboard'
import CVUpload from '../pages/CVUpload'
import CandidateList from '../pages/CandidateList'
import CandidateDetail from '../pages/CandidateDetail'
import InterviewSchedule from '../pages/InterviewSchedule'
import Assessment from '../pages/Assessment'
import Offer from '../pages/Offer'
import SectionCustomization from '../pages/SectionCustomization'
// import Collaboration from '../pages/Collaboration'
import InterviewList from '../pages/InterviewList'

const AppRoutes: React.FC = () => {
  const token = useAppSelector(s => s.user.token)

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-link" element={<VerifyLink />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      {token ? (
        <Route element={<LayoutComponent />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<CVUpload />} />
          <Route path="/candidates" element={<CandidateList />} />
          <Route path="/candidates/:id" element={<CandidateDetail />} />
          <Route path="/schedule" element={<InterviewSchedule />} />
          <Route path="/interviews" element={<InterviewList />} />
          <Route path="/assessments" element={<Assessment />} />
          <Route path="/offers" element={<Offer />} />
          <Route path="/custom-sections" element={<SectionCustomization />} />
          {/* <Route path="/collaboration" element={<Collaboration />} /> */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  )
}

export default AppRoutes

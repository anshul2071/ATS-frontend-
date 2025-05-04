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
import Home from '../pages/Home'
import InterviewList from '../pages/InterviewList'
import ResetPassword from '../pages/ResetPassword'
import Settings from '../pages/Settings'

const AppRoutes: React.FC = () => {
  const token = useAppSelector((state) => state.user.token)

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={token ? <Navigate to="/dashboard" replace /> : <Home />}
      />
      <Route
        path="/login"
        element={token ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={token ? <Navigate to="/dashboard" replace /> : <Register />}
      />
      <Route path="/verify-link" element={<VerifyLink />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      

      {/* Protected Routes */}
      {token && (
        <Route element={<LayoutComponent />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<CVUpload />} />
          <Route path="/candidates" element={<CandidateList />} />
          <Route path="/candidates/:id" element={<CandidateDetail />} />
          <Route path="/schedule" element={<InterviewSchedule />} />
          <Route path="/interviews" element={<InterviewList />} />
          <Route path="/assessments" element={<Assessment />} />
          <Route path="/offers" element={<Offer />} />
          <Route path='/settings' element={<Settings />}/>
          <Route path="/custom-sections" element={<SectionCustomization />} />
        </Route>
      )}

      {/* Catch-all route */}
      <Route
        path="*"
        element={<Navigate to={token ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  )
}

export default AppRoutes

// src/routes/AppRoutes.tsx

import React from 'react'
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/register'
import VerifyLink from '../pages/VerifyLink'
import VerifyOtp from '../pages/VeifyOtp'
import ResetPassword from '../pages/ResetPassword'

import LayoutComponent from '../components/Layout'
import Dashboard from '../pages/Dashboard'
import CVUpload from '../pages/CVUpload'
import CandidateList from '../pages/CandidateList'
import CandidateDetail from '../pages/CandidateDetail'
import InterviewSchedule from '../pages/InterviewSchedule'
import InterviewList from '../pages/InterviewList'
import InterviewCalendar from '../pages/InterviewCalendar'
import Profile from '../pages/Profile'

import OfferPage from '../pages/OfferPage'
import AssessmentPage from '../pages/AssessmentPage'

function RequireAuth() {
  const token = useAppSelector(state => state.user.token)
  const location = useLocation()
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <Outlet />
}

function RedirectIfAuth({ children }: { children: JSX.Element }) {
  const token = useAppSelector(state => state.user.token)
  return token ? <Navigate to="/dashboard" replace /> : children
}

const AppRoutes: React.FC = () => {
  const isAuthed = useAppSelector(state => !!state.user.token)

  return (
    <Routes>
      <Route path="/" element={<RedirectIfAuth><Home /></RedirectIfAuth>} />
      <Route path="/login" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
      <Route path="/register" element={<RedirectIfAuth><Register /></RedirectIfAuth>} />
      <Route path="/verify-link" element={<VerifyLink />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<RequireAuth />}>
        <Route element={<LayoutComponent />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<CVUpload />} />
          <Route path="/candidates" element={<CandidateList />} />
          <Route path="/candidates/:id" element={<CandidateDetail />} />
          <Route path="/schedule" element={<InterviewSchedule />} />
          <Route path="/calendar" element={<InterviewCalendar />} />
          <Route path="/interviews" element={<InterviewList />} />
          <Route path="/assessments" element={<AssessmentPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/offers" element={<OfferPage />} />
        </Route>
      </Route>

      <Route
        path="*"
        element={
          isAuthed
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/login" replace />
        }
      />
    </Routes>
  )
}

export default AppRoutes

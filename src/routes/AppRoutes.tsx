// src/routes/AppRoutes.tsx
import React from 'react'
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'
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
import Assessment from '../pages/Assessment'
import Offer from '../pages/Offer'
import SectionCustomization from '../pages/SectionCustomization'
import InterviewCalendar from '../pages/InterviewCalendar'
import Profile from '../pages/Profile'

/**
 * If there's no token in the Redux store, redirect to /login.
 */
function RequireAuth() {
  const token = useAppSelector((state) => state.user.token)
  const location = useLocation()

  if (!token) {
    // remember where we were trying to go
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

/**
 * If a user is already logged in, don't let them visit /, /login or /register.
 */
function RedirectIfAuth({ children }: { children: JSX.Element }) {
  const token = useAppSelector((state) => state.user.token)
  return token ? <Navigate to="/dashboard" replace /> : children
}

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public landing, login and registration pages */}
      <Route
        path="/"
        element={
          <RedirectIfAuth>
            <Home />
          </RedirectIfAuth>
        }
      />
      <Route
        path="/login"
        element={
          <RedirectIfAuth>
            <Login />
          </RedirectIfAuth>
        }
      />
      <Route
        path="/register"
        element={
          <RedirectIfAuth>
            <Register />
          </RedirectIfAuth>
        }
      />

      {/* Verification & Reset (public) */}
      <Route path="/verify-link" element={<VerifyLink />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* All protected routes go inside RequireAuth */}
      <Route element={<RequireAuth />}>
        <Route element={<LayoutComponent />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<CVUpload />} />
          <Route path="/candidates" element={<CandidateList />} />
          <Route path="/candidates/:id" element={<CandidateDetail />} />
          <Route path="/schedule" element={<InterviewSchedule />} />
          <Route path="/caledar" element = {<InterviewCalendar/>}/>
          <Route path="/interviews" element={<InterviewList />} />
          <Route path="/assessments" element={<Assessment />} />
          <Route path="/offers" element={<Offer />} />
          <Route path="/custom-sections" element={<SectionCustomization />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Catch‑all: redirect based on auth state */}
      <Route
        path="*"
        element={
          useAppSelector((state) => state.user.token) ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  )
}

export default AppRoutes

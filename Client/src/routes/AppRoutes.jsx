import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Project from '../pages/Project'
import VerifyEmail from '../pages/VerifyEmail'
import Subscription from '../pages/Subscription'
import ForgetPassword from '../pages/ForgotPassword'
import LoginGuard from '../components/LoginGuard'
import ProtectedRoute from '../components/ProtectedRoute'
import Cookies from 'js-cookie';
import EmailVerificationGuard from '../components/EmailVerificationGuard'
import SubscriptionGuard from '../components/SubscriptionGuard'

function AppRoutes() {
  return (
    <Routes>
        {/* Public routes */}
        <Route path="/login" element={
            <LoginGuard>
                <Login />
            </LoginGuard>
        } />
        <Route path="/register" element={
            <LoginGuard>
                <Register />
            </LoginGuard>
        } />
        <Route path='/forgot-password' element={
            <LoginGuard>
                <ForgetPassword />
            </LoginGuard>
        } />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected routes */}
        <Route path="/" element={
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
        } />
        <Route path="/project" element={
            <ProtectedRoute>
                <Project />
            </ProtectedRoute>
        } />
        <Route path="/subscription" element={<Subscription />} />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
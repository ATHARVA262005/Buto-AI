import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Project from '../pages/Project'
import UserAuth from '../auth/UserAuth'
import SubscriptionGuard from '../auth/SubscriptionGuard'
import VerifyEmail from '../pages/VerifyEmail'
import Subscription from '../pages/Subscription'
import ForgetPassword from '../pages/ForgotPassword'

function AppRoutes() {
  return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/forgot-password' element={<ForgetPassword />} />
        <Route 
            path="/verify-email" 
            element={
                localStorage.getItem('pendingVerification') ? 
                <VerifyEmail /> : 
                <Navigate to="/register" replace />
            } 
        />
        <Route path="/" element={<UserAuth><Home /></UserAuth>} />
        <Route 
            path="/subscription" 
            element={
                <UserAuth>
                    <SubscriptionGuard>
                        <Subscription />
                    </SubscriptionGuard>
                </UserAuth>
            } 
        />
        <Route path="/project" element={<UserAuth><Project /></UserAuth>} />
    </Routes>
  )
}

export default AppRoutes
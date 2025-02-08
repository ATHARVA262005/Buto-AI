import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Project from '../pages/Project'
import UserAuth from '../auth/UserAuth'
import VerifyEmail from '../pages/VerifyEmail'

function AppRoutes() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<UserAuth><Home /></UserAuth>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/project" element={<UserAuth><Project /></UserAuth>} />
            <Route path="/verify-email/" element={<VerifyEmail />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
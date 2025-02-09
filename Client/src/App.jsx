import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { UserProvider } from './context/user.context'
import AppRoutes from './routes/AppRoutes'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <UserProvider>
      <Router>
        <ScrollToTop />
        <Toaster position="top-right" />
        <AppRoutes />
      </Router>
    </UserProvider>
  )
}

export default App
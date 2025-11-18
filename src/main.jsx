import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import Test from './Test'
import CasinoDetail from './pages/CasinoDetail'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Auth from './pages/Auth'
import { AuthProvider, useAuth } from './context/AuthContext'
import './index.css'

function PrivateRoute({ children }) {
  const { token } = useAuth()
  if (!token) {
    return <Navigate to="/auth" replace />
  }
  return children
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/test" element={<Test />} />
          <Route path="/casino/:slug" element={<CasinoDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

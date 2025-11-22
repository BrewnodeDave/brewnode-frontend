import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Brewfather from './pages/Brewfather'
import ProcessControl from './pages/ProcessControl'
import SensorControl from './pages/SensorControl'
import Simulator from './pages/Simulator'
import Login from './pages/Login'
import { isAuthenticated } from './services/api'

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/brewfather" element={
          <ProtectedRoute>
            <Layout>
              <Brewfather />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/process" element={
          <ProtectedRoute>
            <Layout>
              <ProcessControl />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/sensors" element={
          <ProtectedRoute>
            <Layout>
              <SensorControl />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/simulator" element={
          <ProtectedRoute>
            <Layout>
              <Simulator />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App
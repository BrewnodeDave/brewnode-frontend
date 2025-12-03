import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Brewfather from './pages/Brewfather'
import ProcessControl from './pages/ProcessControl'
import SensorControl from './pages/SensorControl'
import Simulator from './pages/Simulator'
import Login from './pages/Login'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <Layout>
            <Dashboard />
          </Layout>
        } />
        <Route path="/brewfather" element={
          <Layout>
            <Brewfather />
          </Layout>
        } />
        <Route path="/process" element={
          <Layout>
            <ProcessControl />
          </Layout>
        } />
        <Route path="/sensors" element={
          <Layout>
            <SensorControl />
          </Layout>
        } />
        <Route path="/simulator" element={
          <Layout>
            <Simulator />
          </Layout>
        } />
      </Routes>
    </div>
  )
}

export default App
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Activity, 
  Beaker, 
  Gauge, 
  Settings, 
  Play,
  LogOut,
  BarChart3,
  Menu,
  X
} from 'lucide-react'
import { clearAuth } from '../services/api'

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Brewfather', href: '/brewfather', icon: Beaker },
  { name: 'Process Control', href: '/process', icon: Play },
  { name: 'Sensor Control', href: '/sensors', icon: Gauge },
  { name: 'Simulator', href: '/simulator', icon: Settings },
]

const Layout = ({ children }) => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    clearAuth()
    window.location.href = '/login'
  }

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-20 px-6 bg-brewery-600">
          <div className="flex items-center">
            <Activity className="w-10 h-10 text-white mr-3" />
            <h1 className="text-2xl font-bold text-white">Brewnode</h1>
          </div>
          {/* Mobile close button */}
          <button
            onClick={closeSidebar}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <X className="w-8 h-8" />
          </button>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={closeSidebar}
                className={`flex items-center px-4 py-3 text-base font-medium rounded-md transition-colors ${isActive ? 'bg-brewery-100 text-brewery-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <Icon className="w-6 h-6 mr-4 flex-shrink-0" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="px-2 py-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-6 h-6 mr-4 flex-shrink-0" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-8 h-8" />
            </button>
            <div className="flex items-center">
              <Activity className="w-8 h-8 mr-3 text-brewery-600" />
              <h1 className="text-xl font-semibold text-gray-900">Brewnode</h1>
            </div>
            <div className="w-8" /> {/* Spacer for centering */}
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 lg:px-8 py-6 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
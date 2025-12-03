import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Beaker, 
  Gauge, 
  Settings, 
  Play,
  LogOut,
  BarChart3,
  Menu,
  X,
  Lock
} from 'lucide-react'
import { clearAuth, isAuthenticated } from '../services/api'

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
  const [authState, setAuthState] = useState(isAuthenticated())

  // Update auth state when location changes
  useEffect(() => {
    setAuthState(isAuthenticated())
  }, [location])

  // Filter navigation based on authentication
  const filteredNavigation = navigation.filter(item => {
    if (item.name === 'Brewfather') {
      return authState
    }
    return true
  })

  const handleLogout = () => {
    clearAuth()
    setAuthState(false)
    window.location.href = '/login'
  }

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-60 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-24 px-6 bg-gradient-to-r from-brewery-500 to-brewery-600">
          <div className="flex items-center">
            <img src="/logo-40x40.png" alt="Brewnode" className="w-14 h-14 mr-4 drop-shadow-lg" />
            <h1 className="text-3xl font-black text-white drop-shadow-md">Brewnode</h1>
          </div>
          {/* Mobile close button */}
          <button
            onClick={closeSidebar}
            className="lg:hidden text-white hover:text-gray-100 p-3 rounded-xl hover:bg-white/20 transition-colors"
          >
            <X className="w-14 h-14" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={closeSidebar}
                className={`flex items-center px-5 py-4 text-lg font-bold rounded-xl transition-all shadow-md ${isActive ? 'bg-brewery-100 text-brewery-900 scale-105' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:scale-105'}`}
              >
                <Icon className="w-8 h-8 mr-4 flex-shrink-0" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="px-5 py-8 border-t-4 border-gray-200">
          {authState ? (
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-7 py-6 text-xl font-bold text-gray-600 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all shadow-md hover:scale-105"
            >
              <LogOut className="w-10 h-10 mr-6 flex-shrink-0" />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center w-full px-7 py-6 text-xl font-bold text-gray-600 rounded-2xl hover:bg-brewery-50 hover:text-brewery-600 transition-all shadow-md hover:scale-105"
            >
              <Lock className="w-10 h-10 mr-6 flex-shrink-0" />
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-white shadow-lg border-b-4 border-brewery-200">
          <div className="flex items-center justify-between px-8 py-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900 p-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-12 h-12" />
            </button>
            <div className="flex items-center">
              <img src="/logo-40x40.png" alt="Brewnode" className="w-12 h-12 mr-4" />
              <h1 className="text-3xl font-black text-gray-900">Brewnode</h1>
            </div>
            <div className="w-16" /> {/* Spacer for centering */}
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
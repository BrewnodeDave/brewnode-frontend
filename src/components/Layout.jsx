import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Activity, 
  Beaker, 
  Gauge, 
  Settings, 
  Play,
  LogOut,
  BarChart3
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

  const handleLogout = () => {
    clearAuth()
    window.location.href = '/login'
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex flex-col w-64 bg-white shadow-lg">
        <div className="flex items-center justify-center h-16 px-4 bg-brewery-600">
          <Activity className="w-8 h-8 text-white mr-2" />
          <h1 className="text-xl font-bold text-white">Brewnode</h1>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${isActive
                    ? 'bg-brewery-100 text-brewery-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="px-2 py-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { setAuth } from '../services/api'

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Set auth credentials
      setAuth(credentials.username, credentials.password)
      
      // Test authentication by making a simple API call
      const response = await fetch('/sensorStatus?name=All', {
        headers: {
          'Authorization': `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`
        }
      })

      if (response.ok) {
        navigate('/')
      } else {
        setError('Invalid username or password')
        setAuth(null, null)
      }
    } catch (err) {
      setError('Connection error. Please check if the server is running.')
      setAuth(null, null)
    } finally {
      setLoading(false)
    }
  }

  const handleSkipLogin = () => {
    // Clear any existing auth
    setAuth(null, null)
    // Navigate to dashboard without authentication
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brewery-50 to-brewery-100 py-10 px-6 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-10">
        <div>
          <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-2xl bg-white shadow-2xl">
            <img src="/logo-40x40.png" alt="Brewnode" className="h-16 w-16" />
          </div>
          <h2 className="mt-8 text-center text-3xl sm:text-4xl font-black text-gray-900">
            Sign in to Brewnode
          </h2>
          <p className="mt-4 text-center text-xl font-bold text-gray-700">
            Enter your credentials to continue
          </p>
        </div>
        
        <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border-4 border-red-300 text-red-800 px-8 py-6 rounded-2xl text-xl font-bold shadow-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-xl font-bold text-gray-900 mb-3">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none relative block w-full px-5 py-4 border-3 border-gray-300 placeholder-gray-500 text-gray-900 text-xl rounded-xl focus:outline-none focus:ring-4 focus:ring-brewery-400 focus:border-brewery-500 shadow-md"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              />
            </div>
            
            <div className="relative">
              <label htmlFor="password" className="block text-xl font-bold text-gray-900 mb-3">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="appearance-none relative block w-full px-5 py-4 pr-14 border-3 border-gray-300 placeholder-gray-500 text-gray-900 text-xl rounded-xl focus:outline-none focus:ring-4 focus:ring-brewery-400 focus:border-brewery-500 shadow-md"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 pr-5 pb-5 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-10 w-10 text-gray-500" />
                ) : (
                  <Eye className="h-10 w-10 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-5 px-6 border-3 border-transparent text-xl font-black rounded-xl text-white bg-brewery-600 hover:bg-brewery-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-brewery-500 disabled:opacity-50 disabled:cursor-not-allowed active:bg-brewery-800 transition-all shadow-xl hover:scale-105"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
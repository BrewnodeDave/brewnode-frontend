import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Eye, EyeOff } from 'lucide-react'
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
      const response = await fetch('/api/sensorStatus?name=All', {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-6 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-brewery-100">
            <Activity className="h-12 w-12 text-brewery-600" />
          </div>
          <h2 className="mt-8 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            Sign in to Brewnode
          </h2>
          <p className="mt-4 text-center text-base text-gray-600">
            Enter your Brewfather credentials to continue
          </p>
        </div>
        
        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-base">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 text-lg rounded-lg focus:outline-none focus:ring-brewery-500 focus:border-brewery-500 focus:z-10"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              />
            </div>
            
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="appearance-none relative block w-full px-4 py-4 pr-14 border border-gray-300 placeholder-gray-500 text-gray-900 text-lg rounded-lg focus:outline-none focus:ring-brewery-500 focus:border-brewery-500 focus:z-10"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-6 w-6 text-gray-400" />
                ) : (
                  <Eye className="h-6 w-6 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-lg font-semibold rounded-lg text-white bg-brewery-600 hover:bg-brewery-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brewery-500 disabled:opacity-50 disabled:cursor-not-allowed active:bg-brewery-800 transition-colors"
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
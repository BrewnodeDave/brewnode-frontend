import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auth state management - persist in sessionStorage so it survives navigation
let authCredentials = null

// Restore from sessionStorage on module load
const stored = sessionStorage.getItem('brewnode_auth')
if (stored) {
  try {
    authCredentials = JSON.parse(stored)
    api.defaults.auth = authCredentials
  } catch {
    sessionStorage.removeItem('brewnode_auth')
  }
}

export const setAuth = (username, password) => {
  if (!username && !password) {
    authCredentials = null
    delete api.defaults.auth
    sessionStorage.removeItem('brewnode_auth')
    return
  }
  authCredentials = { username, password }
  api.defaults.auth = authCredentials
  sessionStorage.setItem('brewnode_auth', JSON.stringify(authCredentials))
}

export const clearAuth = () => {
  authCredentials = null
  delete api.defaults.auth
  sessionStorage.removeItem('brewnode_auth')
}

export const isAuthenticated = () => !!authCredentials?.username

// Request interceptor for auth
api.interceptors.request.use(
  (config) => {
    if (authCredentials) {
      config.auth = authCredentials
    }
    // Debug logging
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      params: config.params,
      data: config.data,
      fullURL: `${config.baseURL}${config.url}${config.params ? '?' + new URLSearchParams(config.params).toString() : ''}`
    })
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    })
    return response
  },
  (error) => {
    console.log('API Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      responseData: error.response?.data,
      message: error.message
    })
    if (error.response?.status === 401) {
      clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
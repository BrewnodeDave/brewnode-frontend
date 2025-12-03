import axios from 'axios'

// Determine the base URL based on environment
const getBaseURL = () => {
  // In development, Vite proxy handles routing, so use empty baseURL
  if (import.meta.env.DEV) {
    return ''
  }
  
  // In production, connect directly to the backend server on port 8080
  // Use the same hostname but change the port
  const { protocol, hostname } = window.location
  return `${protocol}//${hostname}:8080`
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auth state management
let authCredentials = null

export const setAuth = (username, password) => {
  if (username === null || password === null) {
    authCredentials = null
    delete api.defaults.auth
  } else {
    authCredentials = { username, password }
    api.defaults.auth = authCredentials
  }
}

export const clearAuth = () => {
  authCredentials = null
  delete api.defaults.auth
}

export const isAuthenticated = () => !!authCredentials

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
    // Only redirect to login if we get 401 AND we were actually authenticated
    if (error.response?.status === 401 && authCredentials) {
      clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
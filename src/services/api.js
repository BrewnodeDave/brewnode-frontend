import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${window.location.protocol}//${window.location.hostname}:8080`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auth state management
let authCredentials = null

export const setAuth = (username, password) => {
  authCredentials = { username, password }
  api.defaults.auth = authCredentials
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
    if (error.response?.status === 401) {
      clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
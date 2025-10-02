// src/config/index.ts

// Application Configuration
export const APP_CONFIG = {
  title: import.meta.env.VITE_APP_TITLE || 'EraJob',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  debugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true'
}

// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://eba-jobs.getxoxo.space',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  endpoints: {
    // Authentication endpoints
    auth: {
      login: '/v1/users/login',
      signup: '/v1/users/signup',
      refresh: '/v1/users/refesh',
      me: '/v1/users/me',
      delete: '/v1/users/account'
    },
    // Client endpoints
    client: {
      login: '/v1/clients/login',
      me: '/v1/clients/me'
    },
    // Agent endpoints
    agent: {
      login: '/v1/agents/login',
      me: '/v1/agents/me'
    },
    // Jobs endpoints
    jobs: {
      base: '/v1/jobss',
      create: '/v1/jobss/',
      me: '/v1/jobss/me',
      clientCreated: (start: number, stop: number) => `/v1/jobss/client/created/${start}/${stop}`,
      agentAvailable: (start: number, stop: number) => `/v1/jobss/agent/available/${start}/${stop}`,
      adminList: (start: number, stop: number) => `/v1/jobss/admin/${start}/${stop}`
    },
    // Users endpoints
    users: {
      list: (start: number, stop: number) => `/v1/users/${start}/${stop}`,
      me: '/v1/users/me'
    }
  }
}

// Storage Configuration
export const STORAGE_CONFIG = {
  tokenKey: import.meta.env.VITE_TOKEN_STORAGE_KEY || 'erajob_auth_token',
  userKey: import.meta.env.VITE_USER_STORAGE_KEY || 'erajob_user_data'
}

// Debug utility
export const debugLog = (message: string, data?: any) => {
  if (APP_CONFIG.debugMode) {
    console.log(`[EraJob Debug] ${message}`, data || '')
  }
}

// Error handling utility
export const handleApiError = (error: any) => {
  if (APP_CONFIG.debugMode) {
    console.error('[EraJob API Error]', error)
  }
  
  // Extract error message from different error formats
  if (error.response?.data?.detail) {
    return error.response.data.detail
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  
  if (error.message) {
    return error.message
  }
  
  return 'An unexpected error occurred'
}

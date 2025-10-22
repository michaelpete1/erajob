// src/services/api.ts

import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse, ServiceResponse, Job, AdminCredentials, AdminAuthResponse } from '../types/api' // Import ApiResponse, Job, AdminCredentials, AdminAuthResponse

// API Configuration
const API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL || '/api'
const API_VERSION = '/v1'

// Create axios instance with interceptors
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ---- Robust 401 handling with role-aware refresh ----
let isRefreshing = false
let refreshPromise: Promise<string> | null = null
const refreshSubscribers: Array<(token: string) => void> = []

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb)
}

function onRefreshed(token: string) {
  while (refreshSubscribers.length) {
    const cb = refreshSubscribers.shift()
    if (cb) cb(token)
  }
}

function logoutAndRedirect() {
  try {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('userInfo')
  } catch {}
  window.location.href = '/sign-in'
}

async function performTokenRefresh(): Promise<string> {
  const role = (localStorage.getItem('userRole') || '').toLowerCase()
  const refreshToken = localStorage.getItem('refresh_token')
  const expiredAccess = localStorage.getItem('access_token')

  if (!refreshToken || !expiredAccess) {
    throw new Error('No tokens available for refresh')
  }

  const refreshPath = role === 'admin' ? `${API_VERSION}/admins/refresh` : `${API_VERSION}/users/refresh`

  const resp = await api.post(
    refreshPath,
    { refresh_token: refreshToken },
    { headers: { Authorization: `Bearer ${expiredAccess}` } }
  )

  const newAccess = resp.data?.data?.access_token
  const newRefresh = resp.data?.data?.refresh_token
  if (!newAccess) throw new Error('No access token in refresh response')

  try {
    localStorage.setItem('access_token', newAccess)
    if (newRefresh) localStorage.setItem('refresh_token', newRefresh)
  } catch {}

  return newAccess
}

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const status = error?.response?.status
    const originalRequest = error?.config || {}

    // Only handle 401s
    if (status !== 401) {
      return Promise.reject(error)
    }

    // Do not attempt to refresh if the 401 came from refresh endpoint itself
    const rawUrl: string = (originalRequest.url || '') as string
    const url = rawUrl.split('?')[0].replace(/\/$/, '') // strip query and trailing slash
    if (url.includes('/admins/refresh') || url.includes('/users/refresh')) {
      // If a manual refresh call fails, do NOT log the user out here.
      // Let callers handle the error. The automatic refresh logic below
      // will perform logout if its own refresh attempt fails.
      return Promise.reject(error)
    }

    // Prevent infinite retry loops on the same request
    if (originalRequest.__isRetryRequest) {
      logoutAndRedirect()
      return Promise.reject(error)
    }

    // If a refresh is already in progress, queue this request until it completes
    if (isRefreshing && refreshPromise) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((token: string) => {
          try {
            originalRequest.__isRetryRequest = true
            originalRequest.headers = {
              ...(originalRequest.headers || {}),
              Authorization: `Bearer ${token}`,
            }
            resolve(api(originalRequest))
          } catch (e) {
            reject(e)
          }
        })
      })
    }

    // Start a new refresh flow
    isRefreshing = true
    refreshPromise = performTokenRefresh()

    try {
      const newToken = await refreshPromise
      onRefreshed(newToken)
      originalRequest.__isRetryRequest = true
      originalRequest.headers = {
        ...(originalRequest.headers || {}),
        Authorization: `Bearer ${newToken}`,
      }
      return api(originalRequest)
    } catch (refreshErr) {
      logoutAndRedirect()
      return Promise.reject(refreshErr)
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  }
)

// Export axios instance for direct usage
export { api }

// Simplified API functions using axios directly
export const apiService = {
  // Authentication endpoints
  async signUp(userData: any): Promise<ServiceResponse<any>> { // Use ServiceResponse<any>
    try {
      const response = await api.post(`${API_VERSION}/users/signup`, userData)
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      // Normalize FastAPI validation errors (detail can be an array of objects)
      const detail = error?.response?.data?.detail
      let message = 'Signup failed'
      if (Array.isArray(detail)) {
        try {
          const msgs = detail
            .map((d: any) => (typeof d?.msg === 'string' ? d.msg : 'Validation error'))
            .filter(Boolean)
          if (msgs.length > 0) {
            message = msgs.join('; ')
          }
        } catch (_) {
          // fallback to generic message
        }
      } else if (typeof detail === 'string') {
        message = detail
      }
      return {
        success: false,
        error: message // Use message property
      }
    }
  },

  async login(credentials: { email: string; password: string }, userType: 'client' | 'agent' | 'admin'): Promise<ServiceResponse<any>> { // Use ApiResponse<any>
    // Helper to persist tokens/role consistently
    const persistAuth = (data: any, fallbackRole: 'client' | 'agent' | 'admin') => {
      if (data?.data?.access_token) {
        try {
          localStorage.setItem('access_token', data.data.access_token)
          localStorage.setItem('refresh_token', data.data.refresh_token || '')
        } catch {}
      }
      // Detect role from response, fallback to requested role
      const roleObj = data?.data?.role || data?.role
      const detectedRole = roleObj?.client ? 'client' : roleObj?.agent ? 'agent' : roleObj?.admin ? 'admin' : fallbackRole
      try { localStorage.setItem('userRole', detectedRole) } catch {}
    }

    // First attempt: role-specific endpoint
    try {
      let endpoint = `${API_VERSION}/users/login`
      if (userType === 'client') endpoint = `${API_VERSION}/clients/login`
      else if (userType === 'agent') endpoint = `${API_VERSION}/agents/login`
      else if (userType === 'admin') endpoint = `${API_VERSION}/admins/login`

      const response = await api.post(endpoint, credentials)
      persistAuth(response.data, userType)
      return { success: true, data: response.data }
    } catch (primaryErr: any) {
      // Fallback: generic users login (handles cases where role record not yet created)
      try {
        const fallbackResp = await api.post(`${API_VERSION}/users/login`, credentials)
        persistAuth(fallbackResp.data, userType)
        return { success: true, data: fallbackResp.data }
      } catch (fallbackErr: any) {
        const detail = fallbackErr?.response?.data?.detail || primaryErr?.response?.data?.detail || 'Login failed'
        return { success: false, error: typeof detail === 'string' ? detail : 'Login failed' } // Use message property
      }
    }
  },

  async refreshToken(): Promise<ServiceResponse<any>> { // Use ApiResponse<any>
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await api.post(`${API_VERSION}/users/refresh`, {
        refresh_token: refreshToken
      })

      // Update stored tokens
      if (response.data?.data?.access_token) {
        localStorage.setItem('access_token', response.data.data.access_token)
        localStorage.setItem('refresh_token', response.data.data.refresh_token || '')
      }

      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Token refresh failed' // Use message property
      }
    }
  },

  // Jobs endpoints
  async getJobs(params?: { start?: number; stop?: number }): Promise<ServiceResponse<Job[]>> { // Use ApiResponse<Job[]>
    try {
      const { start = 0, stop = 100 } = params || {}
      const response = await api.get(`${API_VERSION}/jobss/admin/`, {
        params: {
          start,
          stop
        }
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch jobs' // Use message property
      }
    }
  },

  async getJobById(jobId: string): Promise<ServiceResponse<Job>> { // Use ApiResponse<Job>
    try {
      const response = await api.get(`${API_VERSION}/jobss/me?id=${jobId}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch job' // Use message property
      }
    }
  },

  async createJob(jobData: any): Promise<ServiceResponse<Job>> { // Use ApiResponse<Job>
    try {
      const response = await api.post(`${API_VERSION}/jobss/`, jobData)
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to create job' // Use message property
      }
    }
  },
  async approveJob(
    jobId: string, 
    approvalData: { 
      approved: boolean; 
      feedback?: string;
      reason?: string;
    }
  ): Promise<ServiceResponse<{ // Use ApiResponse
    jobId: string;
    status: 'approved' | 'rejected' | 'pending';
    updatedAt: string;
  }>> {
    try {
      const response = await api.post(
        `${API_VERSION}/jobs/approve/${jobId}`, 
        approvalData
      );

      return {
        success: true,
        data: response.data,
        message: approvalData.approved
          ? 'Job approved successfully'
          : 'Job rejected successfully'
      };
    } catch (error: any) {
      console.error('Job approval error:', error);
      
      // Handle different types of errors
      let errorMessage = 'Failed to process job approval';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data?.detail || 
                      error.response.data?.message || 
                      `Server responded with status ${error.response.status}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response received from server. Please check your connection.';
      }

      return {
        success: false,
        error: errorMessage
      }
    }
  },

  // User profile endpoints
  async getCurrentUser(): Promise<ServiceResponse<any>> { // Use ApiResponse<any>
    try {
      const response = await api.get(`${API_VERSION}/users/me`)
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch user profile' // Use message property
      }
    }
  },

  // Client profile endpoint
  async getClientProfile(): Promise<ServiceResponse<any>> { // Use ApiResponse<any>
    try {
      const response = await api.get(`${API_VERSION}/clients/me`)
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch client profile' // Use message property
      }
    }
  },

  async getClientJobs(params?: { start?: number; stop?: number }): Promise<ServiceResponse<Job[]>> { // Use ApiResponse<Job[]>
    try {
      const response = await api.get(`${API_VERSION}/jobss/client/created/`, {
        params: {
          start: params?.start ?? 0,
          stop: params?.stop ?? 100
        }
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch client jobs' // Use message property
      }
    }
  },

  async getAgentAvailableJobs(params?: { start?: number; stop?: number }): Promise<ServiceResponse<Job[]>> { // Use ApiResponse<Job[]>
    try {
      const response = await api.get(`${API_VERSION}/jobss/agent/available/${params?.start || 0}/${params?.stop || 100}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch available jobs' // Use message property
      }
    }
  },

  // Alerts/Notifications endpoints
  async getAlerts(userType: 'client' | 'agent' | 'admin'): Promise<ServiceResponse<any>> { // Use ApiResponse<any>
    try {
      const endpoint = userType === 'client' ? 'client' : userType === 'agent' ? 'agent' : 'admin'
      const response = await api.get(`${API_VERSION}/alertss/${endpoint}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch alerts' // Use message property
      }
    }
  },

  async getAlertById(alertId: string, userType: 'client' | 'agent' | 'admin'): Promise<ServiceResponse<any>> { // Use ApiResponse<any>
    try {
      const endpoint = userType === 'client' ? 'client' : userType === 'agent' ? 'agent' : 'admin'
      const response = await api.get(`${API_VERSION}/alertss/${endpoint}/me?id=${alertId}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch alert' // Use message property
      }
    }
  },

  // Users listing endpoints (admin only)
  async getUsers(userType: 'clients' | 'agents', params?: { start?: number; stop?: number }): Promise<ServiceResponse<any>> { // Use ApiResponse<any>
    try {
      const response = await api.get(`${API_VERSION}/${userType}/${params?.start || 0}/${params?.stop || 100}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch users' // Use message property
      }
    }
  },

  // Admin-only: list all users (raw), useful for approvals page
  async listUsers(start = 0, stop = 100): Promise<ServiceResponse<any>> { // Use ApiResponse<any>
    try {
      const response = await api.get(`${API_VERSION}/users/${start}/${stop}`)
      return { success: true, data: response.data }
    } catch (error: any) {
      const detail = error?.response?.data?.detail
      return { success: false, error: typeof detail === 'string' ? detail : 'Failed to list users' } // Use message property
    }
  },

  /**
   * Approve a user account
   * @param userId - The ID of the user to approve
   * @returns Promise with the approval result
   */
  async approveUser(userId: string): Promise<ServiceResponse<any>> { // Use ApiResponse<any>
    try {
      const response = await api.patch(`${API_VERSION}/users/${userId}/approve`, {})
      return {
        success: true,
        data: response.data,
        message: 'User approved successfully'
      }
    } catch (error: any) {
      console.error('User approval error:', error)
      
      let errorMessage = 'Failed to approve user'
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      return {
        success: false,
        error: errorMessage
      }
    }
  },

  /**
   * Reject a user account
   * @param userId - The ID of the user to reject
   * @param reason - Optional reason for rejection
   * @returns Promise with the rejection result
   */
  async rejectUser(userId: string, reason?: string): Promise<ServiceResponse<any>> { // Use ApiResponse<any>
    try {
      const response = await api.patch(`${API_VERSION}/users/${userId}/reject`, { reason })
      return {
        success: true,
        data: response.data,
        message: 'User rejected successfully'
      }
    } catch (error: any) {
      console.error('User rejection error:', error)
      
      let errorMessage = 'Failed to reject user'
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      return {
        success: false,
        error: errorMessage
      }
    }
  },

  // Admin authentication
  async adminLogin(credentials: AdminCredentials): Promise<ServiceResponse<AdminAuthResponse>> { // Use ApiResponse<AdminAuthResponse>
    try {
      const response = await api.post<AdminAuthResponse>(
        `${API_VERSION}/admins/login`,
        credentials
      )

      // Normalize possible API response shapes (top-level vs nested under data)
      const payload: any = (response as any).data?.data ?? (response as any).data
      const accessToken = payload?.access_token
      const refreshToken = payload?.refresh_token
      const user = payload?.user ?? payload?.data ?? null

      // Store tokens and user info
      if (accessToken) {
        try {
          localStorage.setItem('access_token', accessToken)
          localStorage.setItem('refresh_token', refreshToken || '')
          if (user) localStorage.setItem('userInfo', JSON.stringify(user))
          localStorage.setItem('userRole', 'admin')
        } catch {}
      }

      return {
        success: true,
        data: (response as any).data,
        message: 'Admin login successful'
      }
    } catch (error: any) {
      console.error('Admin login error:', error)
      
      let errorMessage = 'Failed to log in as admin'
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      return {
        success: false,
        error: errorMessage
      }
    }
  }
}

export default api

// Export axios for direct usage if needed
export { axios }

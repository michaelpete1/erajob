import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from 'axios'

// Base URL for the API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://eba-jobs.getxoxo.space'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('user-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: try role-aware token refresh once on 401. Do NOT logout on non-401 errors.
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as any
    const status = error.response?.status

    if (status === 401) {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        return Promise.reject(error)
      }

      if (!originalRequest._retry) {
        originalRequest._retry = true
        let shouldLogout = false
        try {
          const role = localStorage.getItem('userRole') || ''

          // Attempt appropriate refresh
          let refreshed = null as null | AxiosResponse
          // Prefer role; fallback to request URL inference
          const isAdminRequest = role === 'admin' || (originalRequest?.url?.toString()?.includes('/v1/admins/'))
          const expiredAccess = localStorage.getItem('access_token') || ''
          const authHeader = expiredAccess ? { Authorization: `Bearer ${expiredAccess}` } : {}
          if (isAdminRequest) {
            refreshed = await apiClient.post('/v1/admins/refresh', { refresh_token: refreshToken }, { headers: { ...authHeader } })
          } else {
            // default to users refresh for client/agent flows
            refreshed = await apiClient.post('/v1/users/refresh', { refresh_token: refreshToken }, { headers: { ...authHeader } })
          }

          const data = refreshed?.data?.data
          const newAccess = data?.access_token
          const newRefresh = data?.refresh_token
          if (!newAccess) throw new Error('Refresh did not return access token')

          localStorage.setItem('access_token', newAccess)
          if (newRefresh) {
            localStorage.setItem('refresh_token', newRefresh)
          } else {
            localStorage.removeItem('refresh_token')
          }

          // Update auth header and retry
          originalRequest.headers = originalRequest.headers || {}
          originalRequest.headers['Authorization'] = `Bearer ${newAccess}`
          return apiClient(originalRequest)
        } catch (refreshErr) {
          const refreshStatus = axios.isAxiosError(refreshErr) ? refreshErr.response?.status : undefined
          shouldLogout = refreshStatus === 401 || refreshStatus === 403
        } finally {
          if (shouldLogout) {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('user-token')
            localStorage.removeItem('userInfo')
            localStorage.removeItem('userRole')
            const isAdminPath = window.location.pathname.startsWith('/admin')
            const target = isAdminPath ? '/admin/sign-in' : '/sign-in'
            if (window.location.pathname !== target) {
              window.location.href = target
            }
          }
        }
      }
      return Promise.reject(error)
    }

    // For non-401 errors (e.g., 403 Forbidden), do not clear auth; bubble error up
    return Promise.reject(error)
  }
)

// Import types from centralized location
import type {
  EJApiResponse,
  UserBase,
  UserLogin,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UserRefresh,
  UserOut,
  JobTimeline,
  JobCategories,
  Skills,
  JobsBase,
  JobsOut,
  AlertsOut,
  ValidationError,
  HTTPValidationError,
  ServiceResponse
} from '../types/api/openapi'

// API Service class
class ApiService {
  private async executeWithResilience<T>(action: () => Promise<ServiceResponse<T>>): Promise<ServiceResponse<T>> {
    const maxAttempts = 2

    if (typeof navigator !== 'undefined' && navigator && 'onLine' in navigator && !navigator.onLine) {
      return { success: false, error: 'You appear to be offline. Please check your internet connection.' }
    }

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        return await action()
      } catch (err) {
        const axiosError = err as AxiosError
        const message = axiosError?.message ?? ''
        const isNetworkError =
          axiosError?.code === 'ERR_NETWORK' ||
          axiosError?.code === 'ECONNABORTED' ||
          message === 'Network Error' ||
          message.toLowerCase().includes('timeout')

        if (!isNetworkError || attempt === maxAttempts - 1) {
          const responseData = axiosError?.response?.data as { detail?: string } | undefined
          const friendlyMessage = responseData?.detail || axiosError?.message || 'Request failed'
          return { success: false, error: friendlyMessage }
        }

        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    return { success: false, error: 'Request failed' }
  }

  // Health endpoints
  async checkHealth(): Promise<ServiceResponse<null>> {
    try {
      const response = await apiClient.get<EJApiResponse<null>>('/health')
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Health check failed' }
    }
  }

  async getRoot(): Promise<ServiceResponse<null>> {
    try {
      const response = await apiClient.get<EJApiResponse<null>>('/')
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Root endpoint failed' }
    }
  }

  // Authentication endpoints
  async signup(userData: UserBase): Promise<ServiceResponse<UserOut>> {
    try {
      const response = await apiClient.post<EJApiResponse<UserOut>>('/v1/users/signup', userData)
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Signup failed' }
    }
  }

  async login(credentials: UserLogin): Promise<ServiceResponse<UserOut>> {
    try {
      const response = await apiClient.post<EJApiResponse<UserOut>>('/v1/users/login', credentials)
      if (response.data.data?.access_token) {
        localStorage.setItem('access_token', response.data.data.access_token)
        if (response.data.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.data.refresh_token)
        } else {
          localStorage.removeItem('refresh_token')
        }
      }
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Login failed' }
    }
  }

  async refreshToken(refreshData: UserRefresh): Promise<ServiceResponse<UserOut>> {
    try {
      const response = await apiClient.post<EJApiResponse<UserOut>>('/v1/users/refresh', refreshData)
      if (response.data.data?.access_token) {
        localStorage.setItem('access_token', response.data.data.access_token)
        if (response.data.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.data.refresh_token)
        } else {
          localStorage.removeItem('refresh_token')
        }
      }
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Token refresh failed' }
    }
  }

  // Admin token refresh
  async adminRefreshToken(refreshData: UserRefresh): Promise<ServiceResponse<UserOut>> {
    try {
      const response = await apiClient.post<EJApiResponse<UserOut>>('/v1/admins/refresh', refreshData)
      if (response.data.data?.access_token) {
        localStorage.setItem('access_token', response.data.data.access_token)
        if (response.data.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.data.refresh_token)
        } else {
          localStorage.removeItem('refresh_token')
        }
      }
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Admin token refresh failed' }
    }
  }

  async getCurrentUser(): Promise<ServiceResponse<UserOut>> {
    try {
      const response = await apiClient.get<EJApiResponse<UserOut>>('/v1/users/me')
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to get user' }
    }
  }

  async listUsers(start: number, stop: number): Promise<ServiceResponse<UserOut[]>> {
    try {
      const response = await apiClient.get<EJApiResponse<UserOut[]>>('/v1/users', {
        params: {
          start,
          stop
        }
      })
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to list users' }
    }
  }

  async deleteAccount(): Promise<ServiceResponse<null>> {
    try {
      const response = await apiClient.delete<EJApiResponse<null>>('/v1/users/account')
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to delete account' }
    }
  }

  async forgotPassword(request: ForgotPasswordRequest): Promise<ServiceResponse<{ message: string }>> {
    try {
      const response = await apiClient.post<EJApiResponse<{ message: string }>>('/v1/users/forgot-password', request)
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Forgot password failed' }
    }
  }

  async resetPassword(request: ResetPasswordRequest): Promise<ServiceResponse<{ message: string }>> {
    try {
      const response = await apiClient.post<EJApiResponse<{ message: string }>>('/v1/users/reset-password', request)
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Reset password failed' }
    }
  }

  // Admin endpoints
  async adminLogin(credentials: UserLogin): Promise<ServiceResponse<UserOut>> {
    try {
      const response = await apiClient.post<EJApiResponse<UserOut>>('/v1/admins/login', credentials)
      if (response.data.data?.access_token) {
        localStorage.setItem('access_token', response.data.data.access_token)
        if (response.data.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.data.refresh_token)
        } else {
          localStorage.removeItem('refresh_token')
        }
        localStorage.setItem('userRole', 'admin')
      }
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Admin login failed' }
    }
  }

  async getCurrentAdmin(): Promise<ServiceResponse<UserOut>> {
    try {
      const response = await apiClient.get<EJApiResponse<UserOut>>('/v1/admins/me')
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to get admin' }
    }
  }

  async updateAdminProfile(adminData: any): Promise<ServiceResponse<UserOut>> {
    try {
      const response = await apiClient.put<EJApiResponse<UserOut>>('/v1/admins/me', adminData)
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to update admin profile' }
    }
  }

  // Agent endpoints
  async agentLogin(credentials: UserLogin): Promise<ServiceResponse<UserOut>> {
    return this.executeWithResilience(async () => {
      const response = await apiClient.post<EJApiResponse<UserOut>>('/v1/agents/login', credentials)
      if (response.data.data?.access_token) {
        localStorage.setItem('access_token', response.data.data.access_token)
        if (response.data.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.data.refresh_token)
        } else {
          localStorage.removeItem('refresh_token')
        }
        localStorage.setItem('userRole', 'agent')
      }
      return { success: true, data: response.data.data }
    })
  }

  async getCurrentAgent(): Promise<ServiceResponse<UserOut>> {
    try {
      const response = await apiClient.get<EJApiResponse<UserOut>>('/v1/agents/me')
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to get agent' }
    }
  }

  async updateAgentProfile(agentData: any): Promise<ServiceResponse<UserOut>> {
    try {
      const response = await apiClient.put<EJApiResponse<UserOut>>('/v1/agents/me', agentData)
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to update agent profile' }
    }
  }

  // Client endpoints
  async clientLogin(credentials: UserLogin): Promise<ServiceResponse<UserOut>> {
    return this.executeWithResilience(async () => {
      const response = await apiClient.post<EJApiResponse<UserOut>>('/v1/clients/login', credentials)
      if (response.data.data?.access_token) {
        localStorage.setItem('access_token', response.data.data.access_token)
        if (response.data.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.data.refresh_token)
        } else {
          localStorage.removeItem('refresh_token')
        }
        localStorage.setItem('userRole', 'client')
      }
      return { success: true, data: response.data.data }
    })
  }

  async getCurrentClient(): Promise<ServiceResponse<UserOut>> {
    try {
      const response = await apiClient.get<EJApiResponse<UserOut>>('/v1/clients/me')
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to get client' }
    }
  }

  async updateClientProfile(clientData: any): Promise<ServiceResponse<UserOut>> {
    try {
      const response = await apiClient.put<EJApiResponse<UserOut>>('/v1/clients/me', clientData)
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to update client profile' }
    }
  }

  // Jobs endpoints
  async createJob(jobData: JobsBase): Promise<ServiceResponse<JobsOut>> {
    try {
      const response = await apiClient.post<EJApiResponse<JobsOut>>('/v1/jobss/', jobData)
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to create job' }
    }
  }

  async getJob(id: string): Promise<ServiceResponse<JobsOut>> {
    try {
      const response = await apiClient.get<EJApiResponse<JobsOut>>('/v1/jobss/me', { params: { id } })
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to get job' }
    }
  }

  async getMyJobs(): Promise<ServiceResponse<JobsOut>> {
    try {
      const response = await apiClient.get<EJApiResponse<JobsOut>>('/v1/jobss/me')
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to get my jobs' }
    }
  }

  async listAdminJobs(start: number, stop: number): Promise<ServiceResponse<JobsOut[]>> {
    try {
      const response = await apiClient.get<EJApiResponse<JobsOut[]>>('/v1/jobss/admin/', {
        params: { start, stop }
      })
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to list admin jobs' }
    }
  }

  async listClientJobs(start: number, stop: number): Promise<ServiceResponse<JobsOut[]>> {
    try {
      const response = await apiClient.get<EJApiResponse<JobsOut[]>>('/v1/jobss/client/created/', {
        params: { start, stop }
      })
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to list client jobs' }
    }
  }

  async listAgentAvailableJobs(start: number, stop: number): Promise<ServiceResponse<JobsOut[]>> {
    try {
      const response = await apiClient.get<EJApiResponse<JobsOut[]>>('/v1/jobss/agent/available/', {
        params: { start, stop }
      })
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to list available jobs' }
    }
  }

  async updateJob(jobId: string, updates: Partial<JobsBase> & Record<string, any> = {}): Promise<ServiceResponse<JobsOut>> {
    try {
      const response = await apiClient.patch<EJApiResponse<JobsOut>>(`/v1/jobss/${jobId}`, updates)
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to update job' }
    }
  }

  async deleteJob(jobId: string): Promise<ServiceResponse<null>> {
    try {
      const response = await apiClient.delete<EJApiResponse<null>>(`/v1/jobss/${jobId}`)
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to delete job' }
    }
  }

  // Alerts endpoints
  async getAlerts(userType: 'client' | 'agent' | 'admin'): Promise<ServiceResponse<AlertsOut[]>> {
    try {
      const response = await apiClient.get<EJApiResponse<AlertsOut[]>>(`/v1/alertss/${userType}`)
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to get alerts' }
    }
  }

  async getAlert(id: string, userType: 'client' | 'agent' | 'admin'): Promise<ServiceResponse<AlertsOut>> {
    try {
      const response = await apiClient.get<EJApiResponse<AlertsOut>>(`/v1/alertss/${userType}/me`, { params: { id } })
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to get alert' }
    }
  }

  // User approval endpoints (admin only)
  async approveUser(userId: string): Promise<ServiceResponse<null>> {
    try {
      const response = await apiClient.patch<EJApiResponse<null>>(`/v1/users/${userId}/approve`, {})
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to approve user' }
    }
  }

  async rejectUser(userId: string, reason?: string): Promise<ServiceResponse<null>> {
    try {
      const response = await apiClient.post<EJApiResponse<null>>(`/v1/users/reject/${userId}`, { reason })
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to reject user' }
    }
  }

  // Job approval endpoints (admin only)
  async approveJob(
    jobId: string,
    options?: { adminApproved?: boolean; chargesPercent?: number; taxPercent?: number }
  ): Promise<ServiceResponse<null>> {
    try {
      const body = {
        admin_approved: options?.adminApproved ?? true,
        break_down: {
          Charges: options?.chargesPercent ?? 10,
          Tax: options?.taxPercent ?? 7,
        },
      }
      const response = await apiClient.post<EJApiResponse<null>>(`/v1/jobss/approve/${jobId}`, body)
      return { success: true, data: response.data.data }
    } catch (error: any) {
      const detail = error?.response?.data
      if (detail) {
        console.error('Approve job API error detail:', detail)
      }
      return { success: false, error: detail?.detail || detail?.message || 'Failed to approve job' }
    }
  }

  async rejectJob(jobId: string, reason?: string): Promise<ServiceResponse<null>> {
    try {
      const response = await apiClient.post<EJApiResponse<null>>(`/v1/jobss/reject/${jobId}`, {
        admin_approved: false,
        rejection_reason: reason || 'No reason provided'
      })
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to reject job' }
    }
  }
}

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Response handler utility
export function handleApiResponse<T>(response: ServiceResponse<T>): T {
  if (response.success) {
    return response.data as T
  } else {
    throw new ApiError(response.error || 'API request failed')
  }
}

// API object structure for composable compatibility
export const api = {
  user: {
    signup: (userData: UserBase) => apiService.signup(userData),
    login: (credentials: UserLogin) => apiService.login(credentials),
    refreshToken: (refreshData: UserRefresh) => apiService.refreshToken(refreshData),
    getCurrentUser: () => apiService.getCurrentUser(),
    listUsers: (start: number, stop: number) => apiService.listUsers(start, stop),
    deleteAccount: () => apiService.deleteAccount(),
    forgotPassword: (request: ForgotPasswordRequest) => apiService.forgotPassword(request),
    resetPassword: (request: ResetPasswordRequest) => apiService.resetPassword(request),
    approveUser: (userId: string) => apiService.approveUser(userId),
    rejectUser: (userId: string, reason?: string) => apiService.rejectUser(userId, reason)
  },
  admin: {
    login: (credentials: UserLogin) => apiService.adminLogin(credentials),
    getCurrentUser: () => apiService.getCurrentAdmin(),
    updateProfile: (adminData: any) => apiService.updateAdminProfile(adminData)
  },
  agent: {
    login: (credentials: UserLogin) => apiService.agentLogin(credentials),
    getCurrentUser: () => apiService.getCurrentAgent(),
    updateProfile: (agentData: any) => apiService.updateAgentProfile(agentData)
  },
  client: {
    login: (credentials: UserLogin) => apiService.clientLogin(credentials),
    getCurrentUser: () => apiService.getCurrentClient(),
    updateProfile: (clientData: any) => apiService.updateClientProfile(clientData)
  },
  jobs: {
    createJob: (jobData: JobsBase) => apiService.createJob(jobData),
    getJob: (id: string) => apiService.getJob(id),
    getMyJobs: () => apiService.getMyJobs(),
    listAdminJobs: (start: number, stop: number) => apiService.listAdminJobs(start, stop),
    listClientJobs: (start: number, stop: number) => apiService.listClientJobs(start, stop),
    listAgentAvailableJobs: (start: number, stop: number) => apiService.listAgentAvailableJobs(start, stop),
    approveJob: (jobId: string) => apiService.approveJob(jobId),
    rejectJob: (jobId: string, reason?: string) => apiService.rejectJob(jobId, reason),
    updateJob: (jobId: string, updates: Partial<JobsBase> & Record<string, any>) => apiService.updateJob(jobId, updates),
    deleteJob: (jobId: string) => apiService.deleteJob(jobId)
  },
  alerts: {
    getAlerts: (userType: 'client' | 'agent' | 'admin') => apiService.getAlerts(userType),
    getAlert: (id: string, userType: 'client' | 'agent' | 'admin') => apiService.getAlert(id, userType)
  },
  health: {
    check: () => apiService.checkHealth()
  },
  auth: {
    storeAuthData: (userData: UserOut) => {
      if (userData.access_token) {
        localStorage.setItem('access_token', userData.access_token)
        if (userData.refresh_token) {
          localStorage.setItem('refresh_token', userData.refresh_token)
        } else {
          localStorage.removeItem('refresh_token')
        }
        localStorage.setItem('userInfo', JSON.stringify(userData))
        localStorage.setItem('userRole', String(userData.role) || 'client')
      }
    },
    clearAuthData: () => {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user-token')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('userRole')
    }
  }
}

// Export singleton instance
export const apiService = new ApiService()

// Export axios instance for direct use if needed
export { apiClient }

// Re-export types for convenience
export type {
  EJApiResponse,
  UserBase,
  UserLogin,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UserRefresh,
  UserOut,
  JobTimeline,
  JobCategories,
  Skills,
  JobsBase,
  JobsOut,
  AlertsOut,
  ValidationError,
  HTTPValidationError,
  ServiceResponse
} from '../types/api/openapi'

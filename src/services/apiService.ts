import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from 'axios'
import type {
  EJApiResponse,
  UserBase,
  UserLogin,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UserRefresh,
  JobsBase,
  JobsOut,
  AlertsOut,
  ServiceResponse,
  UserOut
} from '../types/api/openapi'

// Interface for API login response
interface LoginResponse {
  status_code: number;
  detail: string;
  data: {
    success: boolean;
    user: UserOut;
    token: string;
  };
}

// Base URL for the API
const API_BASE_URL = import.meta.env.DEV
  ? '/api'  // Uses the proxy in development
  : import.meta.env.VITE_API_BASE_URL ?? 'https://eba-jobs.getxoxo.space'

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token and log requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('user-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log request details
    console.group('API Request')
    console.log('URL:', config.url)
    console.log('Method:', config.method?.toUpperCase())
    console.log('Headers:', config.headers)
    if (config.data) {
      console.log('Request Data:', config.data)
    }
    console.groupEnd()
    
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor with logging and token refresh logic
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses
    console.group('API Response')
    console.log('URL:', response.config.url)
    console.log('Status:', response.status)
    console.log('Data:', response.data)
    console.log('Headers:', response.headers)
    console.groupEnd()
    return response
  },
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

          // Determine refresh endpoint
          const isAdminRequest = role === 'admin' || (originalRequest?.url?.toString()?.includes('/v1/admins/'))
          const expiredAccess = localStorage.getItem('access_token') || ''
          const authHeader = expiredAccess ? { Authorization: `Bearer ${expiredAccess}` } : {}

          const refreshEndpoint = isAdminRequest ? '/v1/admins/refresh' : '/v1/users/refresh'
          const refreshed = await apiClient.post(refreshEndpoint, { refresh_token: refreshToken }, { headers: { ...authHeader } })

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

          // Update auth header and retry original request
          originalRequest.headers = originalRequest.headers || {}
          originalRequest.headers['Authorization'] = `Bearer ${newAccess}`
          return apiClient(originalRequest)
        } catch (refreshErr) {
          const refreshStatus = axios.isAxiosError(refreshErr) ? refreshErr.response?.status : undefined
          shouldLogout = refreshStatus === 401 || refreshStatus === 403 || refreshStatus === 422 
        } finally {
          if (shouldLogout) {
            localStorage.clear() // Clear all auth/user related data
            
            const isAdminPath = window.location.pathname.startsWith('/admin')
            const target = isAdminPath ? '/admin/sign-in' : '/sign-in'
            
            if (!window.location.pathname.includes('/sign-in')) {
              window.location.href = target
            }
          }
        }
      }
      return Promise.reject(error)
    }

    // For non-401 errors (e.g., 403 Forbidden, 422 Validation), bubble error up
    return Promise.reject(error)
  }
)

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

  // --- Utility Methods ---
  private isSuccessfulStatus(status?: number | null) {
    return status === 200 || status === 201 || status === 0
  }

  private ensureArray<T>(data: T | T[] | null | undefined): T[] {
    if (!data) return []
    return Array.isArray(data) ? data : [data]
  }

  // Store authentication data in localStorage (centralized logic)
  private storeAuthData(authData: { accessToken: string; refreshToken: string; user: UserOut }): void {
    if (!authData || !authData.user) {
      throw new Error('Invalid auth data: user information is required');
    }

    const { user } = authData;
    
    localStorage.setItem('access_token', authData.accessToken);
    
    if (authData.refreshToken) {
      localStorage.setItem('refresh_token', authData.refreshToken);
    } else {
      localStorage.removeItem('refresh_token');
    }
    
    // Store user info (remove tokens to avoid duplication)
    const { access_token, refresh_token, ...userInfo } = user
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    
    if (user.id) {
      localStorage.setItem('userId', String(user.id));
    } else {
      localStorage.removeItem('userId');
    }
    
    let userRole = 'client'; // Default role
    if (user.role) {
      userRole = typeof user.role === 'string' 
        ? user.role 
        : (user.role as any)?.name || 'client'; // Assuming role object has a 'name' field
    }
    
    localStorage.setItem('userRole', userRole);
  }

  // --- Health Endpoints ---
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

  // --- User/General Auth Endpoints ---
  async signup(userData: UserBase): Promise<ServiceResponse<UserOut>> {
    try {
      const response = await apiClient.post<EJApiResponse<UserOut>>('/v1/users/signup', userData)
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Signup failed' }
    }
  }

  // This is a generic login used by the agent/clientLogin wrappers below.
  async login(credentials: UserLogin): Promise<ServiceResponse<UserOut>> {
    try {
      const response = await apiClient.post<EJApiResponse<UserOut>>('/v1/users/login', credentials)

      const user: UserOut = response.data.data! // Trusting the API structure here

      if (user.access_token) {
        this.storeAuthData({
          accessToken: user.access_token,
          refreshToken: user.refresh_token || '',
          user
        })
      }
      return { success: true, data: user }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Login failed' }
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
      const response = await apiClient.get<EJApiResponse<UserOut[]>>('/v1/users/', {
        params: { start, stop }
      })
      if (this.isSuccessfulStatus(response.data.status_code)) {
        return { success: true, data: this.ensureArray(response.data.data) }
      }
      return { success: false, error: response.data.detail || 'Failed to list users' }
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

  // --- Admin Endpoints ---
  async adminLogin(credentials: UserLogin): Promise<ServiceResponse<UserOut>> {
    try {
      const response = await apiClient.post<EJApiResponse<UserOut>>('/v1/admins/login', credentials)
      const user: UserOut = response.data.data!

      if (user.access_token) {
        this.storeAuthData({
          accessToken: user.access_token,
          refreshToken: user.refresh_token || '',
          // FIX FOR TS2322
          user: { ...user, role: { name: 'admin', description: 'Administrator user' } as any } 
        })
      }
      return { success: true, data: user }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Admin login failed' }
    }
  }

  async adminRefreshToken(refreshData: UserRefresh): Promise<ServiceResponse<UserOut>> {
    try {
      const response = await apiClient.post<EJApiResponse<UserOut>>('/v1/admins/refresh', refreshData)
      const user: UserOut = response.data.data!
      if (user.access_token) {
        localStorage.setItem('access_token', user.access_token)
        if (user.refresh_token) {
          localStorage.setItem('refresh_token', user.refresh_token)
        } else {
          localStorage.removeItem('refresh_token')
        }
      }
      return { success: true, data: user }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Admin token refresh failed' }
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

  // --- Agent Endpoints ---
  async agentLogin(credentials: UserLogin): Promise<ServiceResponse<UserOut>> {
    return this.executeWithResilience(async () => {
      const response = await apiClient.post<EJApiResponse<UserOut>>('/v1/agents/login', credentials)
      const user: UserOut = response.data.data!

      if (user.access_token) {
        this.storeAuthData({
          accessToken: user.access_token,
          refreshToken: user.refresh_token || '',
          // FIX FOR TS2322
          user: { ...user, role: { name: 'agent', description: 'Agent user' } as any } 
        })
      }
      return { success: true, data: user }
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
      return { success: false, error: error.message || 'Failed to update agent profile' }
    }
  }

  // --- Client Endpoints ---
  async clientLogin(credentials: UserLogin): Promise<ServiceResponse<UserOut>> {
    return this.executeWithResilience(async () => {
      type ClientLoginResponse = {
        status_code: number;
        data: UserOut;
        detail: string;
      };

      const response = await apiClient.post<ClientLoginResponse>('/v1/clients/login', credentials)

      if (response.data.status_code >= 400) {
        return { success: false, error: response.data.detail || 'Login failed' }
      }

      const userData = response.data.data

      if (!userData || !userData.access_token) {
        console.error('Invalid login response format:', response.data)
        return { success: false, error: 'Invalid response format from server' }
      }

      const user: UserOut = {
        ...userData,
        role: { name: 'client', description: 'Client user' } as any
      }

      this.storeAuthData({
        accessToken: userData.access_token,
        refreshToken: userData.refresh_token || '',
        user
      })

      return { success: true, data: user }
    })
  }

  async getCurrentClient(): Promise<ServiceResponse<UserOut>> {
    try {
      interface ClientResponse {
        status_code: number;
        detail: string;
        data: UserOut;
      }
      
      // Note: Headers are already handled by the Request Interceptor
      const response = await apiClient.get<ClientResponse>('/v1/clients/me')

      if (response.data.status_code === 200) {
        const userData = response.data.data;
        
        // Reconstruct UserOut with current tokens
        const user: UserOut = {
          ...userData,
          access_token: localStorage.getItem('access_token') || undefined,
          refresh_token: localStorage.getItem('refresh_token') || undefined
        };

        // Re-store info to refresh local data
        this.storeAuthData({
          accessToken: user.access_token || '',
          refreshToken: user.refresh_token || '',
          user: user
        });
        
        return { success: true, data: user };
      } else {
        throw new Error(response.data.detail || 'Failed to fetch client data');
      }
    } catch (error) {
      // Logout is handled by the response interceptor for 401s
      return {
        success: false,
        error: axios.isAxiosError(error) 
          ? error.response?.data?.detail || error.message 
          : error instanceof Error 
            ? error.message 
            : 'Failed to fetch client data'
      };
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

  async sendClientResetToken(email: string): Promise<ServiceResponse<{ reset_token: string }>> {
    try {
      const response = await apiClient.post<EJApiResponse<{ reset_token: string }>>('/v1/clients/get-reset-token', { email })
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to generate reset token' }
    }
  }

  async resetClientPassword(payload: { reset_token: string; otp: string; new_password: string }): Promise<ServiceResponse<UserOut>> {
    try {
      const response = await apiClient.patch<EJApiResponse<UserOut>>('/v1/clients/reset-password', payload)
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to reset password' }
    }
  }

  // --- Jobs Endpoints ---
  async createJob(jobData: JobsBase): Promise<ServiceResponse<JobsOut>> {
    try {
      const response = await apiClient.post<EJApiResponse<JobsOut>>('/v1/jobs/', jobData)
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to create job' }
    }
  }

  async getJob(id: string): Promise<ServiceResponse<JobsOut>> {
    try {
      const response = await apiClient.get<EJApiResponse<JobsOut>>('/v1/jobs/me', { params: { id } })
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to get job' }
    }
  }

  async getMyJobs(): Promise<ServiceResponse<JobsOut>> {
    try {
      const response = await apiClient.get<EJApiResponse<JobsOut>>('/v1/jobs/me')
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to get my jobs' }
    }
  }

  async listAdminJobs(start: number, stop: number): Promise<ServiceResponse<JobsOut[]>> {
    try {
      const response = await apiClient.get<EJApiResponse<JobsOut[]>>('/v1/jobs/admin/', {
        params: { start, stop }
      })
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to list admin jobs' }
    }
  }

  async listClientJobs(start: number, stop: number): Promise<ServiceResponse<JobsOut[]>> {
    try {
      const response = await apiClient.get<EJApiResponse<JobsOut[]>>('/v1/jobs/client/created/', {
        params: { start, stop }
      })
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to list client jobs' }
    }
  }

  async listAgentAvailableJobs(start: number, stop: number): Promise<ServiceResponse<JobsOut[]>> {
    try {
      const response = await apiClient.get<EJApiResponse<JobsOut[]>>('/v1/jobs/agent/available/', {
        params: { start, stop }
      })
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to list available jobs' }
    }
  }

  async updateJob(jobId: string, updates: Partial<JobsBase> & Record<string, any> = {}): Promise<ServiceResponse<JobsOut>> {
    try {
      const response = await apiClient.patch<EJApiResponse<JobsOut>>(`/v1/jobs/${jobId}`, updates)
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to update job' }
    }
  }

  async deleteJob(jobId: string): Promise<ServiceResponse<null>> {
    try {
      const response = await apiClient.delete<EJApiResponse<null>>(`/v1/jobs/${jobId}`)
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to delete job' }
    }
  }

  // --- Alerts Endpoints ---
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

  // --- Approval Endpoints (Admin Only) ---
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
      const payload = {
        rejection_reason: reason?.trim() || 'No reason provided'
      }
      const response = await apiClient.patch<EJApiResponse<null>>(`/v1/users/${userId}/reject`, payload)
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to reject user' }
    }
  }

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
      const response = await apiClient.post<EJApiResponse<null>>(`/v1/jobs/approve/${jobId}`, body)
      return { success: true, data: response.data.data }
    } catch (error: any) {
      const detail = error?.response?.data
      return { success: false, error: detail?.detail || detail?.message || 'Failed to approve job' }
    }
  }

  async rejectJob(jobId: string, reason?: string): Promise<ServiceResponse<null>> {
    try {
      const response = await apiClient.post<EJApiResponse<null>>(`/v1/jobs/reject/${jobId}`, {
        admin_approved: false,
        rejection_reason: reason || 'No reason provided'
      })
      return { success: true, data: response.data.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Failed to reject job' }
    }
  }
}

// Instantiate the service class
const apiService = new ApiService()

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
    updateProfile: (adminData: any) => apiService.updateAdminProfile(adminData),
    refreshToken: (refreshData: UserRefresh) => apiService.adminRefreshToken(refreshData)
  },
  agent: {
    login: (credentials: UserLogin) => apiService.agentLogin(credentials),
    getCurrentUser: () => apiService.getCurrentAgent(),
    updateProfile: (agentData: any) => apiService.updateAgentProfile(agentData)
  },
  client: {
    login: (credentials: UserLogin) => apiService.clientLogin(credentials),
    getCurrentUser: () => apiService.getCurrentClient(),
    updateProfile: (clientData: any) => apiService.updateClientProfile(clientData),
    sendResetToken: (email: string) => apiService.sendClientResetToken(email),
    resetPassword: (payload: { reset_token: string; otp: string; new_password: string }) => 
      apiService.resetClientPassword(payload)
  },
  jobs: {
    createJob: (jobData: JobsBase) => apiService.createJob(jobData),
    getJob: (id: string) => apiService.getJob(id),
    getMyJobs: () => apiService.getMyJobs(),
    listAdminJobs: (start: number, stop: number) => apiService.listAdminJobs(start, stop),
    listClientJobs: (start: number, stop: number) => apiService.listClientJobs(start, stop),
    listAgentAvailableJobs: (start: number, stop: number) => apiService.listAgentAvailableJobs(start, stop),
    approveJob: (jobId: string, options?: { adminApproved?: boolean; chargesPercent?: number; taxPercent?: number }) =>
      apiService.approveJob(jobId, options),
    rejectJob: (jobId: string, reason?: string) => apiService.rejectJob(jobId, reason),
    updateJob: (jobId: string, updates: Partial<JobsBase> & Record<string, any>) =>
      apiService.updateJob(jobId, updates),
    deleteJob: (jobId: string) => apiService.deleteJob(jobId)
  },
  alerts: {
    getAlerts: (userType: 'client' | 'agent' | 'admin') => apiService.getAlerts(userType),
    getAlert: (id: string, userType: 'client' | 'agent' | 'admin') => apiService.getAlert(id, userType)
  },
  auth: {
    logout: (redirectPath?: string) => {
      try {
        // Store current path for potential redirect back after login
        const currentPath = window.location.pathname;
        if (currentPath !== '/sign-in' && currentPath !== '/sign-up') {
          sessionStorage.setItem('preLogoutPath', currentPath);
        }

        // Clear all auth-related localStorage items
        const authItems = [
          'access_token',
          'refresh_token',
          'user-token',
          'userInfo',
          'userRole',
          'userId',
          'selectedProject',
          'selectedClientProject'
        ]
        
        authItems.forEach(item => localStorage.removeItem(item))
        
        // Clear any ongoing requests by creating a new axios instance
        // This effectively cancels all pending requests
        if (apiClient) {
          try {
            // Create a new axios instance with the same config
            const newInstance = axios.create(apiClient.defaults);
            
            // Manually copy over request interceptors
            const requestInterceptors = (apiClient.interceptors as any).handlers || [];
            requestInterceptors.forEach((handler: any) => {
              if (handler && handler.fulfilled) {
                newInstance.interceptors.request.use(
                  handler.fulfilled,
                  handler.rejected
                );
              }
            });
            
            // Manually copy over response interceptors
            const responseInterceptors = (apiClient.interceptors.response as any).handlers || [];
            responseInterceptors.forEach((handler: any) => {
              if (handler && handler.fulfilled) {
                newInstance.interceptors.response.use(
                  handler.fulfilled,
                  handler.rejected
                );
              }
            });
            
            // Update any references to use the new instance
            Object.assign(apiClient, newInstance);
            
          } catch (error) {
            console.warn('Error while cleaning up axios instance:', error);
            // Fallback to clearing localStorage and redirecting
            localStorage.clear();
            if (redirectPath) {
              window.location.href = redirectPath;
            }
          }
        }
        
        // Redirect to login page
        if (redirectPath && window.location.pathname !== redirectPath) {
          window.location.href = redirectPath
        }
        
        // Notify user of successful logout
        if (typeof window !== 'undefined') {
          // Use a more reliable way to show toast if available
          const toast = (window as any).toast || (window as any).$toast;
          if (toast && typeof toast.success === 'function') {
            toast.success('You have been successfully logged out');
          }
        }
        
      } catch (error) {
        console.error('Error during logout:', error)
        // Even if there's an error, we should still try to clear storage and redirect
        localStorage.clear()
        if (redirectPath) {
          window.location.href = redirectPath
        }
        throw error
      }
    }
  }
}

// Export the instantiated service as both default and named export
export { apiService };
export default apiService;
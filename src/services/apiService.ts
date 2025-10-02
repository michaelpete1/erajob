// src/services/apiService.ts
import { apiClient } from './api'

// Type definitions based on OpenAPI schema
export interface UserBase {
  email: string
  password: string
  role: 'client' | 'agent'
}

export interface UserLogin {
  email: string
  password: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  new_password: string
}

export interface UserRefresh {
  refresh_token: string
}

export interface UserOut {
  email: string
  password: string
  role: Record<string, any>
  id?: string | null
  date_created?: number | null
  last_updated?: number | null
  refresh_token?: string | null
  access_token?: string | null
}

export interface JobTimeline {
  start_date: number
  deadline: number
}

export type JobCategories = 
  | 'Web Devlopment'
  | 'Mobile Development'
  | 'UI/UX Design'
  | 'Content Writing'
  | 'Digital Marketing'
  | 'Data Analysis'
  | 'Other'

export type Skills = 
  | 'Web Devlopment'
  | 'Mobile Development'
  | 'UI/UX Design'
  | 'Content Writing'
  | 'Digital Marketing'
  | 'Data Analysis'
  | 'Other'

export interface JobsBase {
  project_title: string
  category: JobCategories
  budget: number
  description: string
  requirement: string
  skills_needed: Skills
  timeline: JobTimeline
}

export interface JobsOut extends JobsBase {
  id?: string | null
  date_created?: number | null
  last_updated?: number | null
}

export interface APIResponse<T> {
  status_code: number
  data: T | null
  detail: string
}

export interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface HTTPValidationError {
  detail: ValidationError[]
}

// Health and Root endpoints
export const healthApi = {
  checkHealth: async (): Promise<APIResponse<null>> => {
    const response = await apiClient.get<APIResponse<null>>('/health')
    return response.data
  },

  getRoot: async (): Promise<APIResponse<null>> => {
    const response = await apiClient.get<APIResponse<null>>('/')
    return response.data
  }
}

// User Authentication APIs
export const userApi = {
  // User signup
  signup: async (userData: UserBase): Promise<APIResponse<UserOut>> => {
    const response = await apiClient.post<APIResponse<UserOut>>('/v1/users/signup', userData)
    return response.data
  },

  // User login
  login: async (credentials: UserLogin): Promise<APIResponse<UserOut>> => {
    const response = await apiClient.post<APIResponse<UserOut>>('/v1/users/login', credentials)
    return response.data
  },

  // Refresh user tokens
  refreshToken: async (refreshData: UserRefresh): Promise<APIResponse<UserOut>> => {
    const response = await apiClient.post<APIResponse<UserOut>>('/v1/users/refesh', refreshData)
    return response.data
  },

  // Get current user info
  getCurrentUser: async (): Promise<APIResponse<UserOut>> => {
    const response = await apiClient.get<APIResponse<UserOut>>('/v1/users/me')
    return response.data
  },

  // List users (paginated)
  listUsers: async (start: number, stop: number): Promise<APIResponse<UserOut[]>> => {
    const response = await apiClient.get<APIResponse<UserOut[]>>(`/v1/users/${start}/${stop}`)
    return response.data
  },

  // Delete user account
  deleteAccount: async (): Promise<APIResponse<null>> => {
    const response = await apiClient.delete<APIResponse<null>>('/v1/users/account')
    return response.data
  },

  // Forgot password
  forgotPassword: async (request: ForgotPasswordRequest): Promise<APIResponse<{ message: string }>> => {
    const response = await apiClient.post<APIResponse<{ message: string }>>('/v1/users/forgot-password', request)
    return response.data
  },

  // Reset password
  resetPassword: async (request: ResetPasswordRequest): Promise<APIResponse<{ message: string }>> => {
    const response = await apiClient.post<APIResponse<{ message: string }>>('/v1/users/reset-password', request)
    return response.data
  }
}

// Agent-specific APIs
export const agentApi = {
  // Agent login
  login: async (credentials: UserLogin): Promise<APIResponse<UserOut>> => {
    const response = await apiClient.post<APIResponse<UserOut>>('/v1/agents/login', credentials)
    return response.data
  },

  // Get current agent info
  getCurrentAgent: async (): Promise<APIResponse<UserOut>> => {
    const response = await apiClient.get<APIResponse<UserOut>>('/v1/agents/me')
    return response.data
  },

  // Update agent profile
  updateAgentProfile: async (agentData: any): Promise<APIResponse<UserOut>> => {
    const response = await apiClient.put<APIResponse<UserOut>>('/v1/agents/me', agentData)
    return response.data
  }
}

// Client-specific APIs
export const clientApi = {
  // Client login
  login: async (credentials: UserLogin): Promise<APIResponse<UserOut>> => {
    const response = await apiClient.post<APIResponse<UserOut>>('/v1/clients/login', credentials)
    return response.data
  },

  // Get current client info
  getCurrentClient: async (): Promise<APIResponse<UserOut>> => {
    const response = await apiClient.get<APIResponse<UserOut>>('/v1/clients/me')
    return response.data
  },

  // Update client profile
  updateClientProfile: async (clientData: any): Promise<APIResponse<UserOut>> => {
    const response = await apiClient.put<APIResponse<UserOut>>('/v1/clients/me', clientData)
    return response.data
  }
}

// Jobs-specific APIs
export const jobsApi = {
  // Create new job (requires client token)
  createJob: async (jobData: JobsBase): Promise<APIResponse<JobsOut>> => {
    const response = await apiClient.post<APIResponse<JobsOut>>('/v1/jobs/', jobData)
    return response.data
  },

  // Get specific job (requires admin token)
  getJob: async (id: string): Promise<APIResponse<JobsOut>> => {
    const response = await apiClient.get<APIResponse<JobsOut>>('/v1/jobs/me', {
      params: { id }
    })
    return response.data
  },

  // Get current user's jobs (requires admin token)
  getMyJobs: async (): Promise<APIResponse<JobsOut>> => {
    const response = await apiClient.get<APIResponse<JobsOut>>('/v1/jobs/me')
    return response.data
  },

  // List jobs admin can see (requires admin token)
  listAdminJobs: async (start: number, stop: number): Promise<APIResponse<JobsOut[]>> => {
    const response = await apiClient.get<APIResponse<JobsOut[]>>(`/v1/jobs/admin/${start}/${stop}`)
    return response.data
  },

  // List jobs client created (requires client token)
  listClientJobs: async (start: number, stop: number): Promise<APIResponse<JobsOut[]>> => {
    const response = await apiClient.get<APIResponse<JobsOut[]>>(`/v1/jobs/client/${start}/${stop}`)
    return response.data
  },

  // List jobs agent qualifies for (requires agent token)
  listAgentAvailableJobs: async (start: number, stop: number): Promise<APIResponse<JobsOut[]>> => {
    const response = await apiClient.get<APIResponse<JobsOut[]>>(`/v1/jobs/agent/available/${start}/${stop}`)
    return response.data
  }
}

// Error handling utilities
export class ApiError extends Error {
  public statusCode?: number
  public data?: any

  constructor(
    message: string,
    statusCode?: number,
    data?: any
  ) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.data = data
  }
}

// Response wrapper for better error handling
export async function handleApiResponse<T>(apiCall: Promise<APIResponse<T>>): Promise<T> {
  try {
    const response = await apiCall
    if (response.status_code >= 200 && response.status_code < 300) {
      if (response.data === null) {
        throw new ApiError('API returned null data', response.status_code)
      }
      return response.data
    } else {
      throw new ApiError(response.detail || 'API request failed', response.status_code, response.data)
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    if (error instanceof Error) {
      throw new ApiError(error.message)
    }
    throw new ApiError('Unknown API error occurred')
  }
}

// Authentication state management
export class AuthManager {
  private static instance: AuthManager

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager()
    }
    return AuthManager.instance
  }

  // Store authentication data
  storeAuthData(userData: UserOut): void {
    if (userData.access_token) {
      localStorage.setItem('erajob_auth_token', userData.access_token)
    }
    if (userData.refresh_token) {
      localStorage.setItem('refresh_token', userData.refresh_token)
    }
    if (userData.role) {
      localStorage.setItem('userRole', JSON.stringify(userData.role))
    }
    if (userData.id) {
      localStorage.setItem('userId', userData.id)
    }
  }

  // Clear authentication data
  clearAuthData(): void {
    localStorage.removeItem('erajob_auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('erajob_auth_token')
  }

  // Get current user role
  getUserRole(): string | null {
    const roleData = localStorage.getItem('userRole')
    if (roleData) {
      try {
        const role = JSON.parse(roleData)
        return typeof role === 'string' ? role : role.type || role
      } catch {
        return roleData
      }
    }
    return null
  }

  // Get user ID
  getUserId(): string | null {
    return localStorage.getItem('userId')
  }
}

export const authManager = AuthManager.getInstance()

// Export all APIs for easy import
export const api = {
  health: healthApi,
  user: userApi,
  agent: agentApi,
  client: clientApi,
  jobs: jobsApi,
  auth: authManager,
  handleResponse: handleApiResponse,
  ApiError
}

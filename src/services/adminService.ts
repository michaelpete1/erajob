import apiClient from './apiClient'
import type { EJApiResponse, UserOut } from '../types/api'

// Admin login payload
interface AdminLoginData {
  email: string
  password: string
}

// Admin auth response
interface AdminAuthResponse {
  access_token: string
  refresh_token: string
  user: UserOut
}

// Token refresh payload
interface TokenRefreshData {
  refreshToken: string
}

// User list response
interface UserListResponse {
  users: UserOut[]
  total: number
  start: number
  stop: number
}

// User approval/rejection payload
interface UserApprovalData {
  admin_approved: boolean
  rejection_reason?: string
}

// Service response wrapper
interface ServiceResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Admin login function
export const adminLogin = async (credentials: AdminLoginData): Promise<ServiceResponse<AdminAuthResponse>> => {
  try {
    const response = await apiClient.post<EJApiResponse<AdminAuthResponse>>('/v1/admins/login', credentials)

    if (response.data.status_code === 0 || response.data.status_code === 200) {
      const data = response.data.data

      if (data) {
        // Store tokens in localStorage
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token)
        }
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token)
        }
        localStorage.setItem('userRole', 'admin')
        localStorage.setItem('userInfo', JSON.stringify(data))

        return {
          success: true,
          data: data,
          message: response.data.detail || 'Login successful'
        }
      } else {
        return {
          success: false,
          error: 'Invalid response data'
        }
      }
    } else {
      return {
        success: false,
        error: response.data.detail || 'Login failed'
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'Login failed'
    }
  }
}

// Admin token refresh function
export const adminRefreshToken = async (refreshData: TokenRefreshData): Promise<ServiceResponse<AdminAuthResponse>> => {
  try {
    // Get the expired access token for authorization header
    const expiredToken = localStorage.getItem('access_token')
    const headers = expiredToken ? { Authorization: `Bearer ${expiredToken}` } : {}

    const response = await apiClient.post<EJApiResponse<AdminAuthResponse>>('/v1/admins/refresh', refreshData, { headers })

    if (response.data.status_code === 0 || response.data.status_code === 200) {
      const data = response.data.data

      if (data) {
        // Update tokens in localStorage
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token)
        }
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token)
        } else {
          localStorage.removeItem('refresh_token')
        }

        return {
          success: true,
          data: data,
          message: response.data.detail || 'Token refresh successful'
        }
      } else {
        return {
          success: false,
          error: 'Invalid response data'
        }
      }
    } else {
      return {
        success: false,
        error: response.data.detail || 'Token refresh failed'
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'Token refresh failed'
    }
  }
}

// Get paginated list of users (admin only)
export const getUsersList = async (start: number = 0, stop: number = 100): Promise<ServiceResponse<UserListResponse>> => {
  try {
    const response = await apiClient.get<EJApiResponse<UserOut[]>>(`/v1/users/?start=${start}&stop=${stop}`)

    if (response.data.status_code === 0 || response.data.status_code === 200) {
      const data = response.data.data

      if (Array.isArray(data)) {
        const userListResponse: UserListResponse = {
          users: data,
          total: data.length,
          start: start,
          stop: stop
        }
        return {
          success: true,
          data: userListResponse,
          message: response.data.detail || 'Users retrieved successfully'
        }
      } else {
        return {
          success: false,
          error: 'Invalid response data'
        }
      }
    } else {
      return {
        success: false,
        error: response.data.detail || 'Failed to retrieve users'
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'Failed to retrieve users'
    }
  }
}

// Approve a user (admin only)
export const approveUser = async (userId: string): Promise<ServiceResponse<UserOut>> => {
  try {
    const response = await apiClient.patch<EJApiResponse<UserOut>>(`/v1/users/${userId}/approve`)

    if (response.data.status_code === 0 || response.data.status_code === 200) {
      const data = response.data.data

      if (data) {
        return {
          success: true,
          data: data,
          message: response.data.detail || 'User approved successfully'
        }
      } else {
        return {
          success: false,
          error: 'Invalid response data'
        }
      }
    } else {
      return {
        success: false,
        error: response.data.detail || 'Failed to approve user'
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'Failed to approve user'
    }
  }
}

// Reject a user (admin only)
export const rejectUser = async (userId: string, rejectionReason: string): Promise<ServiceResponse<UserOut>> => {
  try {
    const payload: UserApprovalData = {
      admin_approved: false,
      rejection_reason: rejectionReason
    }

    const response = await apiClient.patch<EJApiResponse<UserOut>>(`/v1/users/${userId}/reject`, payload)

    if (response.data.status_code === 0 || response.data.status_code === 200) {
      const data = response.data.data

      if (data) {
        return {
          success: true,
          data: data,
          message: response.data.detail || 'User rejected successfully'
        }
      } else {
        return {
          success: false,
          error: 'Invalid response data'
        }
      }
    } else {
      return {
        success: false,
        error: response.data.detail || 'Failed to reject user'
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'Failed to reject user'
    }
  }
}

// Export default object for consistency with other services
export default {
  adminLogin,
  adminRefreshToken,
  getUsersList,
  approveUser,
  rejectUser
}

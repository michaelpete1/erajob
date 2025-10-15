// src/services/usersService.ts

import apiClient from './api'
import type {
  UserOut,
  ApiResponse,
  PaginationParams,
  UserFilters,
  ServiceResponse
} from '../types/api'

export class UsersService {
  private static instance: UsersService

  private constructor() {}

  public static getInstance(): UsersService {
    if (!UsersService.instance) {
      UsersService.instance = new UsersService()
    }
    return UsersService.instance
  }

  /**
   * Get all users (Admin only)
   */
  async getAllUsers(params?: PaginationParams & UserFilters): Promise<ServiceResponse<UserOut[]>> {
    try {
      const { start = 0, stop = 10 } = params || {}
      const response = await apiClient.get<ApiResponse<UserOut[]>>(
        `/v1/users/${start}/${stop}`
      )

      if (response.data.status_code === 200) {
        const users = response.data.data || []

        return {
          success: true,
          data: users,
          message: `Retrieved ${users.length} users`
        }
      } else {
        throw new Error(response.data.detail || 'Failed to fetch users')
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to fetch users'
      }
    }
  }

  /**
   * Get current user profile (works for all roles)
   */
  async getCurrentUser(): Promise<ServiceResponse<UserOut>> {
    try {
      const response = await apiClient.get<ApiResponse<UserOut>>('/v1/users/me')

      if (response.data.status_code === 200) {
        const user = response.data.data

        return {
          success: true,
          data: user,
          message: 'User profile retrieved successfully'
        }
      } else {
        throw new Error(response.data.detail || 'Failed to fetch user profile')
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to fetch user profile'
      }
    }
  }

  /**
   * Get agents (Client only endpoint)
   */
  async getAgents(): Promise<ServiceResponse<UserOut>> {
    try {
      const response = await apiClient.get<ApiResponse<UserOut>>('/v1/agents/me')

      if (response.data.status_code === 200) {
        const agents = response.data.data

        return {
          success: true,
          data: agents,
          message: 'Agents retrieved successfully'
        }
      } else {
        throw new Error(response.data.detail || 'Failed to fetch agents')
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to fetch agents'
      }
    }
  }

  /**
   * Get clients (Agent only endpoint)
   */
  async getClients(): Promise<ServiceResponse<UserOut>> {
    try {
      const response = await apiClient.get<ApiResponse<UserOut>>('/v1/clients/me')

      if (response.data.status_code === 200) {
        const clients = response.data.data

        return {
          success: true,
          data: clients,
          message: 'Clients retrieved successfully'
        }
      } else {
        throw new Error(response.data.detail || 'Failed to fetch clients')
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to fetch clients'
      }
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userData: Partial<UserOut>): Promise<ServiceResponse<UserOut>> {
    try {
      const response = await apiClient.put<ApiResponse<UserOut>>('/v1/users/me', userData)

      if (response.data.status_code === 200) {
        const updatedUser = response.data.data

        return {
          success: true,
          data: updatedUser,
          message: 'Profile updated successfully'
        }
      } else {
        throw new Error(response.data.detail || 'Failed to update profile')
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to update profile'
      }
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<ServiceResponse<void>> {
    try {
      await apiClient.delete('/v1/users/account')

      return {
        success: true,
        message: 'Account deleted successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to delete account'
      }
    }
  }

  /**
   * Search users with filters
   */
  async searchUsers(filters: UserFilters, params?: PaginationParams): Promise<ServiceResponse<UserOut[]>> {
    try {
      // First get all users, then filter (since there's no search endpoint)
      const allUsersResponse = await this.getAllUsers({ start: 0, stop: 1000 })

      if (!allUsersResponse.success || !allUsersResponse.data) {
        return {
          success: false,
          error: 'Failed to fetch users for search'
        }
      }

      let filteredUsers = [...allUsersResponse.data]

      if (filters.role) {
        filteredUsers = filteredUsers.filter(user => 
          Object.values(user.role).some(value => value === filters.role)
        )
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredUsers = filteredUsers.filter(user =>
          user.email.toLowerCase().includes(searchLower)
        )
      }

      const { start = 0, stop = 10 } = params || {}
      const paginatedUsers = filteredUsers.slice(start, stop)

      return {
        success: true,
        data: paginatedUsers,
        message: `Found ${filteredUsers.length} users matching criteria`
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to search users'
      }
    }
  }

  /**
   * Get user by ID (if needed for specific user details)
   */
  async getUserById(userId: string): Promise<ServiceResponse<UserOut>> {
    try {
      // This would typically be a specific endpoint like /v1/users/{userId}
      // For now, we'll use the search functionality
      const searchResponse = await this.searchUsers({ search: userId }, { start: 0, stop: 1 })

      if (searchResponse.success && searchResponse.data && searchResponse.data.length > 0) {
        return {
          success: true,
          data: searchResponse.data[0],
          message: 'User found'
        }
      } else {
        return {
          success: false,
          error: 'User not found'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch user'
      }
    }
  }
}

// Export singleton instance
export const usersService = UsersService.getInstance()

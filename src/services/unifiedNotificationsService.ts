import { apiClient } from './apiService'
import type { ServiceResponse, ApiResponse } from '../types/api'
import type { AlertOut } from '../types/api'

export type UserRole = 'client' | 'agent' | 'admin'

export interface NotificationFilters {
  type?: string
  read?: boolean
  priority?: string
}

export interface NotificationResponse {
  alerts: AlertOut[]
  total_number_of_unread?: number
}

/**
 * Unified Notification Service for all user roles
 * Handles API calls to role-specific alert endpoints
 */
class UnifiedNotificationsService {
  /**
   * Get all alerts for a specific role
   */
  async getAlerts(role: UserRole, filters?: NotificationFilters): Promise<ServiceResponse<NotificationResponse>> {
    try {
      const response = await apiClient.get<ApiResponse<NotificationResponse>>(`/v1/alertss/${role}`, {
        params: filters,
        timeout: 15000
      })

      if (response.data.status_code === 200 || response.data.status_code === 0) {
        return {
          success: true,
          data: response.data.data,
          message: `Retrieved alerts for ${role}`
        }
      } else {
        return {
          success: false,
          error: (response.data as any).detail || 'Failed to fetch alerts'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Network error'
      }
    }
  }

  /**
   * Get unread alerts and auto-mark them as read
   */
  async getUnreadAlerts(role: UserRole): Promise<ServiceResponse<NotificationResponse>> {
    try {
      const response = await apiClient.get<ApiResponse<NotificationResponse>>(`/v1/alertss/${role}/read`, {
        timeout: 15000
      })

      if (response.data.status_code === 200 || response.data.status_code === 0) {
        return {
          success: true,
          data: response.data.data,
          message: `Retrieved unread alerts for ${role}`
        }
      } else {
        return {
          success: false,
          error: (response.data as any).detail || 'Failed to fetch unread alerts'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Network error'
      }
    }
  }

  /**
   * Mark a specific alert as read
   */
  async markAsRead(role: UserRole, alertId: string): Promise<ServiceResponse<void>> {
    try {
      const response = await apiClient.put<ApiResponse<void>>(`/v1/alertss/${role}/${alertId}/read`)

      if (response.data.status_code === 200 || response.data.status_code === 0) {
        return {
          success: true,
          message: 'Alert marked as read'
        }
      } else {
        return {
          success: false,
          error: (response.data as any).detail || 'Failed to mark alert as read'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Network error'
      }
    }
  }

  /**
   * Delete a specific alert
   */
  async deleteAlert(role: UserRole, alertId: string): Promise<ServiceResponse<void>> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/v1/alertss/${role}/${alertId}`)

      if (response.data.status_code === 200 || response.data.status_code === 0) {
        return {
          success: true,
          message: 'Alert deleted'
        }
      } else {
        return {
          success: false,
          error: (response.data as any).detail || 'Failed to delete alert'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Network error'
      }
    }
  }

  /**
   * Handle alert action (like clicking on action buttons)
   */
  async handleAlertAction(role: UserRole, alertId: string, action: string): Promise<ServiceResponse<any>> {
    try {
      const response = await apiClient.post<ApiResponse<any>>(`/v1/alertss/${role}/${alertId}/action`, {
        action
      })

      if (response.data.status_code === 200 || response.data.status_code === 0) {
        return {
          success: true,
          data: response.data.data,
          message: 'Alert action handled'
        }
      } else {
        return {
          success: false,
          error: (response.data as any).detail || 'Failed to handle alert action'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Network error'
      }
    }
  }
}

// Export singleton instance
export const unifiedNotificationsService = new UnifiedNotificationsService()

// src/services/notificationsService.ts

import apiClient from './api'
import type {
  NotificationOut,
  NotificationBase,
  NotificationState,
  NotificationFilters,
  PaginationParams,
  ServiceResponse,
  ApiResponse
} from '../types/api'

export class NotificationsService {
  private static instance: NotificationsService
  private notificationState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    pagination: {
      start: 0,
      stop: 10,
      hasMore: true
    }
  }

  private constructor() {}

  public static getInstance(): NotificationsService {
    if (!NotificationsService.instance) {
      NotificationsService.instance = new NotificationsService()
    }
    return NotificationsService.instance
  }

  /**
   * Get current notifications state
   */
  getNotificationState(): NotificationState {
    return { ...this.notificationState }
  }

  /**
   * Get notifications for current user (role-aware via /v1/alertss/{role})
   */
  async getNotifications(params?: PaginationParams & NotificationFilters): Promise<ServiceResponse<NotificationOut[]>> {
    this.notificationState.loading = true
    this.notificationState.error = null

    // Detect role from storage or URL path
    const storedRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null
    const pathRole = typeof window !== 'undefined' ? (window.location.pathname.split('/')[1] || '') : ''
    const role = (storedRole === 'client' || storedRole === 'agent' || storedRole === 'admin')
      ? storedRole
      : (pathRole === 'client' || pathRole === 'agent' || pathRole === 'admin' ? pathRole : 'client')

    try {
      // According to OpenAPI, alerts list does not paginate; we ignore start/stop
      const response = await apiClient.get<ApiResponse<NotificationOut[]>>(`/v1/alertss/${role}`)

      if (response.data.status_code === 200) {
        const notifications = (response.data.data as any[]) || []

        // Update pagination state (treat whole list as single page)
        this.notificationState.pagination = {
          start: 0,
          stop: notifications.length,
          hasMore: false
        }

        // Update notifications list
        this.notificationState.notifications = notifications as any

        // Update unread count (map missing flag to false)
        this.notificationState.unreadCount = (notifications as any[]).filter((n: any) => !n.is_read).length

        this.notificationState.loading = false

        return {
          success: true,
          data: notifications as any,
          message: `Retrieved ${notifications.length} notifications`
        }
      } else {
        throw new Error((response.data as any).detail || 'Failed to fetch notifications')
      }
    } catch (error: any) {
      this.notificationState.loading = false
      this.notificationState.error = error?.response?.data?.detail || error?.message || 'Failed to fetch notifications'

      return {
        success: false,
        error: this.notificationState.error || undefined
      }
    }
  }

  /**
   * Get a single notification by id via /v1/alertss/{role}/me?id=...
   */
  async getNotificationById(id: string): Promise<ServiceResponse<NotificationOut>> {
    try {
      const storedRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null
      const pathRole = typeof window !== 'undefined' ? (window.location.pathname.split('/')[1] || '') : ''
      const role = (storedRole === 'client' || storedRole === 'agent' || storedRole === 'admin')
        ? storedRole
        : (pathRole === 'client' || pathRole === 'agent' || pathRole === 'admin' ? pathRole : 'client')

      const response = await apiClient.get<ApiResponse<NotificationOut>>(`/v1/alertss/${role}/me`, {
        params: { id }
      })

      if (response.data.status_code === 200) {
        return { success: true, data: response.data.data as any }
      }
      throw new Error((response.data as any).detail || 'Failed to fetch notification')
    } catch (error: any) {
      return { success: false, error: error?.response?.data?.detail || error?.message || 'Failed to fetch notification' }
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<ServiceResponse<void>> {
    // No mark-read endpoint in spec; update locally
    const notification = this.notificationState.notifications.find(n => (n as any).id === notificationId)
    if (notification) {
      ;(notification as any).is_read = true
      this.notificationState.unreadCount = Math.max(0, this.notificationState.unreadCount - 1)
    }
    return { success: true, message: 'Notification marked as read (local)' }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<ServiceResponse<void>> {
    // No mark-all endpoint in spec; update locally
    this.notificationState.notifications.forEach((n: any) => { n.is_read = true })
    this.notificationState.unreadCount = 0
    return { success: true, message: 'All notifications marked as read (local)' }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<ServiceResponse<void>> {
    // No delete endpoint in spec; update locally
    const idx = this.notificationState.notifications.findIndex((n: any) => n.id === notificationId)
    if (idx !== -1) {
      const wasUnread = !(this.notificationState.notifications[idx] as any).is_read
      this.notificationState.notifications.splice(idx, 1)
      if (wasUnread) this.notificationState.unreadCount = Math.max(0, this.notificationState.unreadCount - 1)
    }
    return { success: true, message: 'Notification deleted (local)' }
  }

  /**
   * Handle notification action (like clicking "Review", "Approve", etc.)
   */
  async handleNotificationAction(notificationId: string, action: string): Promise<ServiceResponse<any>> {
    // No action endpoint in spec; treat as mark-read locally
    const notification = this.notificationState.notifications.find((n: any) => n.id === notificationId)
    if (notification && !((notification as any).is_read)) {
      ;(notification as any).is_read = true
      this.notificationState.unreadCount = Math.max(0, this.notificationState.unreadCount - 1)
    }
    return { success: true, message: `Action "${action}" handled locally` }
  }

  /**
   * Reset notifications state
   */
  resetState(): void {
    this.notificationState = {
      notifications: [],
      unreadCount: 0,
      loading: false,
      error: null,
      pagination: {
        start: 0,
        stop: 10,
        hasMore: true
      }
    }
  }
}

// Export singleton instance
export const notificationsService = NotificationsService.getInstance()

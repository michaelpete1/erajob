// src/services/alertsService.ts

import apiClient from './api'
import type {
  AlertOut,
  AlertState,
  AlertFilters,
  PaginationParams,
  ServiceResponse,
  ApiResponse
} from '../types/api'

export class AlertsService {
  private static instance: AlertsService
  private notificationState: AlertState = {
    alerts: [],
    unreadCount: 0,
    totalUnread: 0,
    loading: false,
    error: null,
    pagination: {
      start: 0,
      stop: 10,
      hasMore: true
    }
  }

  private constructor() {}

  public static getInstance(): AlertsService {
    if (!AlertsService.instance) {
      AlertsService.instance = new AlertsService()
    }
    return AlertsService.instance
  }

  /**
   * Get current notifications state
   */
  getNotificationState(): AlertState {
    return { ...this.notificationState }
  }

  /**
   * Get notifications for current user (role-aware via /v1/alertss/{role})
   */
  async getAlerts(params?: PaginationParams & AlertFilters): Promise<ServiceResponse<{ alerts: AlertOut[]; totalUnread: number }>> {
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
      const response = await apiClient.get<ApiResponse<{ alerts: AlertOut[]; total_number_of_unread?: number }>>(`/v1/alertss/${role}`)

      if (response.data.status_code === 200) {
        const payload = (response.data.data as any) || {}
        const alerts = Array.isArray(payload.alerts) ? payload.alerts : []
        const totalUnread = typeof payload.total_number_of_unread === 'number' ? payload.total_number_of_unread : undefined

        // Update pagination state (treat whole list as single page)
        this.notificationState.pagination = {
          start: 0,
          stop: alerts.length,
          hasMore: false
        }

        // Update alerts list
        this.notificationState.alerts = alerts as any

        // Update unread count using payload value when available
        if (typeof totalUnread === 'number') {
          this.notificationState.unreadCount = totalUnread
          this.notificationState.totalUnread = totalUnread
        } else {
          const computedUnread = (alerts as any[]).filter((alert: any) => !alert.is_read).length
          this.notificationState.unreadCount = computedUnread
          this.notificationState.totalUnread = computedUnread
        }

        this.notificationState.loading = false

        return {
          success: true,
          data: {
            alerts: alerts as any,
            totalUnread: this.notificationState.unreadCount
          },
          message: `Retrieved ${alerts.length} alerts`
        }
      } else {
        throw new Error((response.data as any).detail || 'Failed to fetch alerts')
      }
    } catch (error: any) {
      this.notificationState.loading = false
      const message = error?.response?.data?.detail || error?.message || 'Failed to fetch alerts'
      this.notificationState.error = message

      if (typeof window !== 'undefined') {
        console.error('[AlertsService] getAlerts error:', message)
      }

      // Degrade gracefully: return empty alerts so UI can continue rendering
      this.notificationState.alerts = []
      this.notificationState.unreadCount = 0
      this.notificationState.totalUnread = 0
      this.notificationState.pagination = {
        start: 0,
        stop: 0,
        hasMore: false
      }

      return {
        success: true,
        data: {
          alerts: [],
          totalUnread: 0
        },
        message
      }
    }
  }

  /**
   * Get a single notification by id via /v1/alertss/{role}/me?id=...
   */
  async getAlertById(id: string): Promise<ServiceResponse<AlertOut>> {
    try {
      const storedRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null
      const pathRole = typeof window !== 'undefined' ? (window.location.pathname.split('/')[1] || '') : ''
      const role = (storedRole === 'client' || storedRole === 'agent' || storedRole === 'admin')
        ? storedRole
        : (pathRole === 'client' || pathRole === 'agent' || pathRole === 'admin' ? pathRole : 'client')

      const response = await apiClient.get<ApiResponse<AlertOut>>(`/v1/alertss/${role}/me`, {
        params: { id }
      })

      if (response.data.status_code === 200) {
        return { success: true, data: response.data.data as any }
      }
      throw new Error((response.data as any).detail || 'Failed to fetch alert')
    } catch (error: any) {
      const message = error?.response?.data?.detail || error?.message || 'Failed to fetch alert'
      if (typeof window !== 'undefined') {
        console.error('[AlertsService] getAlertById error:', message)
      }
      return { success: false, error: message }
    }
  }

  /**
   * Mark alert as read
   */
  async markAsRead(alertId: string): Promise<ServiceResponse<void>> {
    // No mark-read endpoint in spec; update locally
    const alert = this.notificationState.alerts.find(n => (n as any).id === alertId)
    if (alert) {
      ;(alert as any).is_read = true
      this.notificationState.unreadCount = Math.max(0, this.notificationState.unreadCount - 1)
      return { success: true, message: 'Alert marked as read (local)' }
    }
    const message = 'Alert not found'
    if (typeof window !== 'undefined') {
      console.warn('[AlertsService] markAsRead:', message, alertId)
    }
    return { success: false, error: message }
  }

  /**
   * Mark all alerts as read
   */
  async markAllAsRead(): Promise<ServiceResponse<void>> {
    // No mark-all endpoint in spec; update locally
    try {
      this.notificationState.alerts.forEach((n: any) => { n.is_read = true })
      this.notificationState.unreadCount = 0
      return { success: true, message: 'All alerts marked as read (local)' }
    } catch (error: any) {
      const message = error?.message || 'Failed to mark all alerts as read'
      if (typeof window !== 'undefined') {
        console.error('[AlertsService] markAllAsRead error:', message)
      }
      return { success: false, error: message }
    }
  }

  /**
   * Delete alert
   */
  async deleteAlert(alertId: string): Promise<ServiceResponse<void>> {
    // No delete endpoint in spec; update locally
    try {
      const idx = this.notificationState.alerts.findIndex((n: any) => n.id === alertId)
      if (idx !== -1) {
        const wasUnread = !(this.notificationState.alerts[idx] as any).is_read
        this.notificationState.alerts.splice(idx, 1)
        if (wasUnread) this.notificationState.unreadCount = Math.max(0, this.notificationState.unreadCount - 1)
        return { success: true, message: 'Alert deleted (local)' }
      }
      const message = 'Alert not found'
      if (typeof window !== 'undefined') {
        console.warn('[AlertsService] deleteAlert:', message, alertId)
      }
      return { success: false, error: message }
    } catch (error: any) {
      const message = error?.message || 'Failed to delete alert'
      if (typeof window !== 'undefined') {
        console.error('[AlertsService] deleteAlert error:', message)
      }
      return { success: false, error: message }
    }
  }

  /**
   * Handle alert action (like clicking "Review", "Approve", etc.)
   */
  async handleAlertAction(alertId: string, action: string): Promise<ServiceResponse<any>> {
    // No action endpoint in spec; treat as mark-read locally
    try {
      const alert = this.notificationState.alerts.find((n: any) => (n as any).id === alertId)
      if (alert) {
        if (!((alert as any).is_read)) {
          ;(alert as any).is_read = true
          this.notificationState.unreadCount = Math.max(0, this.notificationState.unreadCount - 1)
        }
        return { success: true, message: `Action "${action}" handled locally` }
      }

      const message = 'Alert not found'
      if (typeof window !== 'undefined') {
        console.warn('[AlertsService] handleAlertAction:', message, { alertId, action })
      }
      return { success: false, error: message }
    } catch (error: any) {
      const message = error?.message || 'Failed to handle alert action'
      if (typeof window !== 'undefined') {
        console.error('[AlertsService] handleAlertAction error:', message)
      }
      return { success: false, error: message }
    }
  }

  /**
   * Reset alerts state
   */
  resetState(): void {
    this.notificationState = {
      alerts: [],
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
export const alertsService = AlertsService.getInstance()
export const notificationsService = alertsService

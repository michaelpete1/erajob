import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { unifiedNotificationsService, type UserRole } from '../services/unifiedNotificationsService'
import type { AlertState, AlertFilters, PaginationParams, AlertOut } from '../types/api'

export function useAlerts(userRole?: UserRole) {
  const router = useRouter()
  const alertState = ref<AlertState>({
    alerts: [],
    unreadCount: 0,
    loading: false,
    error: null,
    pagination: {
      start: 0,
      stop: 10,
      hasMore: true
    }
  })

  const alerts = computed(() => alertState.value.alerts || [])
  const unreadCount = computed(() => alertState.value.unreadCount)
  const loading = computed(() => alertState.value.loading)
  const error = computed(() => alertState.value.error)
  const hasMore = computed(() => alertState.value.pagination.hasMore)

  // Get user role from localStorage if not provided
  const getUserRole = (): UserRole => {
    if (userRole) return userRole
    const storedRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null
    const pathRole = typeof window !== 'undefined' ? (window.location.pathname.split('/')[1] || '') : ''
    return (storedRole === 'client' || storedRole === 'agent' || storedRole === 'admin')
      ? storedRole
      : (pathRole === 'client' || pathRole === 'agent' || pathRole === 'admin' ? pathRole : 'client') as UserRole
  }

  const getAlerts = async (params?: PaginationParams & AlertFilters) => {
    alertState.value.loading = true
    alertState.value.error = null

    const role = getUserRole()
    const result = await unifiedNotificationsService.getAlerts(role, params)

    if (result.success && result.data) {
      const alerts = Array.isArray(result.data.alerts) ? result.data.alerts : []
      const unreadTotal = result.data.total_number_of_unread || alerts.filter((alert: any) => !alert?.is_read).length

      alertState.value.alerts = alerts as any
      alertState.value.pagination = {
        start: params?.start || 0,
        stop: params?.stop || alerts.length,
        hasMore: false
      }
      alertState.value.unreadCount = unreadTotal
      alertState.value.error = null
    } else {
      alertState.value.error = result.error || 'Failed to fetch alerts'
    }

    alertState.value.loading = false
    return result
  }

  const getUnreadAlerts = async () => {
    alertState.value.loading = true
    alertState.value.error = null

    const role = getUserRole()
    const result = await unifiedNotificationsService.getUnreadAlerts(role)

    if (result.success && result.data) {
      const alerts = Array.isArray(result.data.alerts) ? result.data.alerts : []
      const unreadTotal = result.data.total_number_of_unread || 0

      alertState.value.alerts = alerts as any
      alertState.value.unreadCount = unreadTotal
      alertState.value.error = null
    } else {
      alertState.value.error = result.error || 'Failed to fetch unread alerts'
    }

    alertState.value.loading = false
    return result
  }

  const markAsRead = async (alertId: string) => {
    const role = getUserRole()
    const result = await unifiedNotificationsService.markAsRead(role, alertId)

    if (result.success) {
      const alert = alertState.value.alerts.find((a: any) => a.id === alertId)
      if (alert && !alert.is_read) {
        alert.is_read = true
        alertState.value.unreadCount = Math.max(0, alertState.value.unreadCount - 1)
      }
    }

    return result
  }

  const markAllAsRead = async () => {
    // For mark all, we use the getUnreadAlerts endpoint which auto-marks as read
    const result = await getUnreadAlerts()

    if (result.success) {
      // All alerts are now marked as read
      alertState.value.unreadCount = 0
    }

    return result
  }

  const deleteAlert = async (alertId: string) => {
    const role = getUserRole()
    const result = await unifiedNotificationsService.deleteAlert(role, alertId)

    if (result.success) {
      const index = alertState.value.alerts.findIndex((a: any) => a.id === alertId)
      if (index !== -1) {
        const wasUnread = !alertState.value.alerts[index]?.is_read
        alertState.value.alerts.splice(index, 1)
        if (wasUnread) {
          alertState.value.unreadCount = Math.max(0, alertState.value.unreadCount - 1)
        }
      }
    }

    return result
  }

  const handleAlertAction = async (alertId: string, action: string) => {
    const role = getUserRole()
    const alert = alertState.value.alerts.find((a: any) => a.id === alertId)

    if (role === 'admin') {
      const normalized = String(action || '').trim().toLowerCase()
      const jobId = (alert as any)?.job_id
      const agentId = (alert as any)?.agent_id
      if (normalized === 'client' && jobId) {
        router.push(`/admin/propose/${jobId}`)
      } else if (normalized === 'agent' && agentId) {
        router.push(`/admin/memo/${agentId}`)
      }
    }

    const result = await unifiedNotificationsService.handleAlertAction(role, alertId, action)

    if (result.success) {
      if (alert && !alert.is_read) {
        alert.is_read = true
        alertState.value.unreadCount = Math.max(0, alertState.value.unreadCount - 1)
      }
    }

    return result
  }

  const resetAlerts = () => {
    alertState.value.alerts = []
    alertState.value.unreadCount = 0
    alertState.value.pagination = {
      start: 0,
      stop: 10,
      hasMore: true
    }
    alertState.value.error = null
  }

  const clearError = () => {
    alertState.value.error = null
  }

  onMounted(() => {
    // Initialize with empty state - data will be loaded when needed
    resetAlerts()
  })

  return {
    alerts,
    unreadCount,
    loading,
    error,
    hasMore,
    getAlerts,
    getUnreadAlerts,
    markAsRead,
    markAllAsRead,
    deleteAlert,
    handleAlertAction,
    resetAlerts,
    clearError
  }
}

export const useNotifications = useAlerts

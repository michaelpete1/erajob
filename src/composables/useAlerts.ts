import { ref, computed, onMounted } from 'vue'
import { alertsService } from '../services'
import type { AlertState, AlertFilters, PaginationParams } from '../types/api'

export function useAlerts() {
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

  const getAlerts = async (params?: PaginationParams & AlertFilters) => {
    const result = await alertsService.getAlerts(params)

    if (result.success && result.data) {
      alertState.value.alerts = result.data
      alertState.value.pagination = {
        start: params?.start || 0,
        stop: params?.stop || result.data.length,
        hasMore: false
      }
      alertState.value.unreadCount = result.data.filter((alert: any) => !alert?.is_read).length
      alertState.value.error = null
    } else {
      alertState.value.error = result.error || 'Failed to fetch alerts'
    }

    return result
  }

  const markAsRead = async (alertId: string) => {
    const result = await alertsService.markAsRead(alertId)

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
    const result = await alertsService.markAllAsRead()

    if (result.success) {
      alertState.value.alerts.forEach((alert: any) => {
        alert.is_read = true
      })
      alertState.value.unreadCount = 0
    }

    return result
  }

  const deleteAlert = async (alertId: string) => {
    const result = await alertsService.deleteAlert(alertId)

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
    const result = await alertsService.handleAlertAction(alertId, action)

    if (result.success) {
      const alert = alertState.value.alerts.find((a: any) => a.id === alertId)
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
    const currentState = alertsService.getNotificationState()
    alertState.value = currentState
  })

  return {
    alerts,
    unreadCount,
    loading,
    error,
    hasMore,
    getAlerts,
    markAsRead,
    markAllAsRead,
    deleteAlert,
    handleAlertAction,
    resetAlerts,
    clearError
  }
}

export const useNotifications = useAlerts

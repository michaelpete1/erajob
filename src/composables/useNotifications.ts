// src/composables/useNotifications.ts

import { ref, computed, onMounted } from 'vue'
import { notificationsService } from '../services'
import type {
  NotificationState,
  NotificationFilters,
  PaginationParams
} from '../types/api'

export function useNotifications() {
  const notificationState = ref<NotificationState>({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    pagination: {
      start: 0,
      stop: 10,
      hasMore: true
    }
  })

  // Computed properties
  const notifications = computed(() => notificationState.value.notifications)
  const unreadCount = computed(() => notificationState.value.unreadCount)
  const loading = computed(() => notificationState.value.loading)
  const error = computed(() => notificationState.value.error)
  const hasMore = computed(() => notificationState.value.pagination.hasMore)

  // Get notifications with optional filters
  const getNotifications = async (params?: PaginationParams & NotificationFilters) => {
    const result = await notificationsService.getNotifications(params)

    if (result.success && result.data) {
      notificationState.value.notifications = result.data
      notificationState.value.pagination = {
        start: params?.start || 0,
        stop: params?.stop || 10,
        hasMore: result.data.length === (params?.stop || 10) - (params?.start || 0)
      }
      notificationState.value.unreadCount = result.data.filter((n: any) => !n.is_read).length
    } else {
      notificationState.value.error = result.error || 'Failed to fetch notifications'
    }

    return result
  }

  // Mark single notification as read
  const markAsRead = async (notificationId: string) => {
    const result = await notificationsService.markAsRead(notificationId)

    if (result.success) {
      // Update local state
      const notification = notificationState.value.notifications.find((n: any) => n.id === notificationId)
      if (notification) {
        notification.is_read = true
        notificationState.value.unreadCount = Math.max(0, notificationState.value.unreadCount - 1)
      }
    }

    return result
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    const result = await notificationsService.markAllAsRead()

    if (result.success) {
      // Update local state
      notificationState.value.notifications.forEach((notification: any) => {
        notification.is_read = true
      })
      notificationState.value.unreadCount = 0
    }

    return result
  }

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    const result = await notificationsService.deleteNotification(notificationId)

    if (result.success) {
      // Update local state
      const notificationIndex = notificationState.value.notifications.findIndex((n: any) => n.id === notificationId)
      if (notificationIndex !== -1) {
        const notification = notificationState.value.notifications[notificationIndex]
        if (!notification.is_read) {
          notificationState.value.unreadCount = Math.max(0, notificationState.value.unreadCount - 1)
        }
        notificationState.value.notifications.splice(notificationIndex, 1)
      }
    }

    return result
  }

  // Handle notification action
  const handleNotificationAction = async (notificationId: string, action: string) => {
    const result = await notificationsService.handleNotificationAction(notificationId, action)

    if (result.success) {
      // Update local state if needed (mark as read after action)
      const notification = notificationState.value.notifications.find((n: any) => n.id === notificationId)
      if (notification && !notification.is_read) {
        notification.is_read = true
        notificationState.value.unreadCount = Math.max(0, notificationState.value.unreadCount - 1)
      }
    }

    return result
  }

  // Reset state
  const resetNotifications = () => {
    notificationState.value.notifications = []
    notificationState.value.unreadCount = 0
    notificationState.value.pagination = {
      start: 0,
      stop: 10,
      hasMore: true
    }
    notificationState.value.error = null
  }

  const clearError = () => {
    notificationState.value.error = null
  }

  // Initialize state on mount
  onMounted(() => {
    const currentState = notificationsService.getNotificationState()
    notificationState.value = currentState
  })

  return {
    // State
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,

    // Actions
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    handleNotificationAction,
    resetNotifications,
    clearError
  }
}

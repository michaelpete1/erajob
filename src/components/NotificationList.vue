<template>
  <div class="flex-1 overflow-y-auto">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      <span class="ml-3 text-gray-600">Loading notifications...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-12 px-4">
      <div class="text-red-500 mb-2">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-1">Failed to load notifications</h3>
      <p class="text-gray-600 text-center mb-4">{{ error }}</p>
      <button
        @click="onRetry"
        class="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
      >
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredAlerts.length === 0" class="flex flex-col items-center justify-center py-12 px-4">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5-5V12a3 3 0 00-6 0v5H9m6 0v5a3 3 0 01-6 0v-5m6 0H9" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-1">No notifications found</h3>
      <p class="text-gray-600 text-center">
        {{ activeFilter === 'all' ? 'You have no notifications at the moment.' : `No ${activeFilter} notifications found.` }}
      </p>
    </div>

    <!-- Notifications List -->
    <div v-else class="divide-y divide-gray-100">
      <NotificationCard
        v-for="alert in filteredAlerts"
        :key="alert.id || alert.alert_title || Math.random()"
        :alert="alert"
        :on-mark-as-read="handleMarkAsRead"
        :on-delete="handleDelete"
        :on-action="handleAction"
      />
    </div>

    <!-- Load More Button -->
    <div v-if="hasMore && !loading" class="flex justify-center py-6">
      <button
        @click="onLoadMore"
        class="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
      >
        Load More
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NotificationCard from './NotificationCard.vue'
import type { AlertOut } from '../types/api'

interface Props {
  alerts: AlertOut[]
  loading: boolean
  error: string | null
  activeFilter: string
  hasMore: boolean
  onMarkAsRead?: (alertId: string) => void
  onDelete?: (alertId: string) => void
  onAction?: (alertId: string, action: string) => void
  onRetry?: () => void
  onLoadMore?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  onMarkAsRead: () => {},
  onDelete: () => {},
  onAction: () => {},
  onRetry: () => {},
  onLoadMore: () => {}
})

const filteredAlerts = computed(() => {
  if (!props.alerts) return []

  let filtered = [...props.alerts]

  // Apply filter
  if (props.activeFilter !== 'all') {
    if (props.activeFilter === 'unread') {
      filtered = filtered.filter(alert => !(alert as any).is_read)
    } else {
      filtered = filtered.filter(alert => alert.alert_type === props.activeFilter)
    }
  }

  return filtered
})

const handleMarkAsRead = (alertId: string) => {
  props.onMarkAsRead(alertId)
}

const handleDelete = (alertId: string) => {
  props.onDelete(alertId)
}

const handleAction = (alertId: string, action: string) => {
  props.onAction(alertId, action)
}
</script>

<style scoped>
/* Additional styles if needed */
</style>

<template>
  <div
    :class="[
      'bg-white rounded-lg shadow-sm border-l-4 p-4 mb-3 transition-all duration-200 hover:shadow-md',
      isRead ? 'border-gray-200' : 'border-teal-500 bg-teal-50/30',
      'cursor-pointer'
    ]"
    @click="handleCardClick"
  >
    <!-- Header with title and timestamp -->
    <div class="flex items-start justify-between mb-2">
      <h3 :class="[
        'font-semibold text-sm leading-tight',
        isRead ? 'text-gray-800' : 'text-gray-900'
      ]">
        {{ alert.alert_title || 'Notification' }}
      </h3>
      <div class="flex items-center gap-2 ml-2">
        <span class="text-xs text-gray-500 whitespace-nowrap">
          {{ formatTime(alert.date_created) }}
        </span>
        <button
          v-if="!isRead"
          @click.stop="markAsRead"
          class="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0"
          title="Mark as read"
        ></button>
      </div>
    </div>

    <!-- Description -->
    <p class="text-sm text-gray-600 mb-3 leading-relaxed">
      {{ alert.alert_description || 'No description available' }}
    </p>

    <!-- Priority indicator -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span
          :class="[
            'px-2 py-1 text-xs font-medium rounded-full',
            getPriorityClasses(alert.priority)
          ]"
        >
          {{ alert.priority || 'normal' }}
        </span>
        <span
          :class="[
            'px-2 py-1 text-xs font-medium rounded-full',
            getTypeClasses(alert.alert_type)
          ]"
        >
          {{ alert.alert_type || 'info' }}
        </span>
      </div>

      <!-- Action buttons -->
      <div class="flex items-center gap-2" v-if="hasActions">
        <button
          v-if="alert.alert_primary_action"
          @click.stop="handleAction(alert.alert_primary_action)"
          class="px-3 py-1 text-xs bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
        >
          {{ alert.alert_primary_action }}
        </button>
        <button
          v-if="alert.alert_secondary_action"
          @click.stop="handleAction(alert.alert_secondary_action)"
          class="px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          {{ alert.alert_secondary_action }}
        </button>
        <button
          @click.stop="deleteNotification"
          class="p-1 text-gray-400 hover:text-red-500 transition-colors"
          title="Delete notification"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AlertOut } from '../types/api'

interface Props {
  alert: AlertOut
  onMarkAsRead?: (alertId: string) => void
  onDelete?: (alertId: string) => void
  onAction?: (alertId: string, action: string) => void
}

const props = defineProps<Props>()

const isRead = computed(() => (props.alert as any).is_read || false)

const hasActions = computed(() => {
  return props.alert.alert_primary_action || props.alert.alert_secondary_action
})

const getPriorityClasses = (priority?: string) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'low':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getTypeClasses = (type?: string) => {
  switch (type?.toLowerCase()) {
    case 'success':
      return 'bg-green-100 text-green-800'
    case 'warning':
      return 'bg-yellow-100 text-yellow-800'
    case 'error':
      return 'bg-red-100 text-red-800'
    case 'info':
    default:
      return 'bg-blue-100 text-blue-800'
  }
}

const formatTime = (timestamp?: number | null) => {
  if (!timestamp) return 'Unknown time'

  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  if (diffHours < 1) {
    const diffMins = Math.floor(diffMs / (1000 * 60))
    return diffMins <= 1 ? 'Just now' : `${diffMins}m ago`
  } else if (diffHours < 24) {
    return `${Math.floor(diffHours)}h ago`
  } else if (diffDays < 7) {
    return `${Math.floor(diffDays)}d ago`
  } else {
    return date.toLocaleDateString()
  }
}

const handleCardClick = () => {
  if (!isRead.value && props.onMarkAsRead) {
    props.onMarkAsRead(props.alert.id || '')
  }
}

const markAsRead = () => {
  if (props.onMarkAsRead) {
    props.onMarkAsRead(props.alert.id || '')
  }
}

const deleteNotification = () => {
  if (props.onDelete) {
    props.onDelete(props.alert.id || '')
  }
}

const handleAction = (action: string) => {
  if (props.onAction) {
    props.onAction(props.alert.id || '', action)
  }
}
</script>

<style scoped>
/* Additional styles if needed */
</style>

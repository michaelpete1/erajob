<template>
  <div class="min-h-screen bg-gray-50 font-sans antialiased text-gray-800">
    <!-- Header -->
    <header class="bg-teal-500 text-white px-4 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between shadow-md sticky top-0 z-30 backdrop-blur-sm bg-opacity-95">
      <div class="flex items-center">
        <button @click="$router.back()" class="p-2 -ml-2 sm:p-2 sm:-ml-2 md:p-2.5 md:-ml-2.5 rounded-full hover:bg-white hover:bg-opacity-10 active:bg-opacity-20 transition-all duration-200 touch-manipulation" aria-label="Go back">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <h1 class="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight ml-1 sm:ml-2">Alerts</h1>
      </div>
      <div class="flex items-center gap-2 sm:gap-3">
        <button @click="handleMarkAllAsRead" class="p-2 -mr-2 sm:p-2 sm:-mr-2 md:p-2.5 md:-mr-2.5 rounded-full hover:bg-white hover:bg-opacity-10 active:bg-opacity-20 transition-all duration-200 touch-manipulation" aria-label="Mark all as read">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </button>
        <button class="p-2 -mr-2 sm:p-2 sm:-mr-2 md:p-2.5 md:-mr-2.5 rounded-full hover:bg-white hover:bg-opacity-10 active:bg-opacity-20 transition-all duration-200 touch-manipulation" aria-label="Settings">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </button>
        <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90"></div>
      </div>
    </header>

    <!-- Filter and Sort Bar -->
    <NotificationFilters
      :filters="filters"
      :initial-filter="activeFilter"
      :initial-sort="sortBy"
      :on-filter-change="handleFilterChange"
      :on-sort-change="handleSortChange"
      :on-search="handleSearch"
    />

    <!-- Notifications List -->
    <NotificationList
      :alerts="filteredAlerts"
      :loading="loading"
      :error="error"
      :active-filter="activeFilter"
      :has-more="hasMore"
      :on-mark-as-read="handleMarkAsRead"
      :on-delete="handleDelete"
      :on-action="handleAction"
      :on-retry="handleRetry"
      :on-load-more="handleLoadMore"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAlerts } from '../../composables/useAlerts'
import NotificationFilters from '../../components/NotificationFilters.vue'
import NotificationList from '../../components/NotificationList.vue'
import type { AlertOut } from '../../types/api'

// Composables
const {
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
  handleAlertAction
} = useAlerts('client')

// Reactive state
const activeFilter = ref('all')
const sortBy = ref('newest')
const searchQuery = ref('')

// Filters configuration
const filters = ref([
  { id: 'all', name: 'All', count: 0 },
  { id: 'priority', name: 'Priority', count: 0 },
  { id: 'unread', name: 'Unread', count: 0 },
  { id: 'project', name: 'Projects', count: 0 },
  { id: 'agent', name: 'Agents', count: 0 }
])

// Computed filtered alerts
const filteredAlerts = computed(() => {
  if (!alerts.value) return []

  let filtered = [...alerts.value]

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(alert =>
      alert.alert_title?.toLowerCase().includes(query) ||
      alert.alert_description?.toLowerCase().includes(query)
    )
  }

  // Apply type filter
  if (activeFilter.value !== 'all') {
    if (activeFilter.value === 'unread') {
      filtered = filtered.filter(alert => !(alert as any).is_read)
    } else if (activeFilter.value === 'priority') {
      filtered = filtered.filter(alert => alert.priority === 'high' || alert.alert_type === 'priority')
    } else if (activeFilter.value === 'project') {
      filtered = filtered.filter(alert => alert.alert_type === 'project' || alert.alert_type === 'job')
    } else if (activeFilter.value === 'agent') {
      filtered = filtered.filter(alert => alert.alert_type === 'agent' || alert.alert_type === 'proposal')
    }
  }

  // Apply sorting
  filtered.sort((a, b) => {
    if (sortBy.value === 'oldest') {
      return (a.date_created || 0) - (b.date_created || 0)
    } else if (sortBy.value === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 3
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 3
      return aPriority - bPriority
    } else { // newest
      return (b.date_created || 0) - (a.date_created || 0)
    }
  })

  return filtered
})

// Update filter counts
const updateFilterCounts = () => {
  const allCount = alerts.value?.length || 0
  const priorityCount = alerts.value?.filter(n => n.priority === 'high' || n.alert_type === 'priority').length || 0
  const unreadCount = alerts.value?.filter(n => !(n as any).is_read).length || 0
  const projectCount = alerts.value?.filter(n => n.alert_type === 'project' || n.alert_type === 'job').length || 0
  const agentCount = alerts.value?.filter(n => n.alert_type === 'agent' || n.alert_type === 'proposal').length || 0

  filters.value = [
    { id: 'all', name: 'All', count: allCount },
    { id: 'priority', name: 'Priority', count: priorityCount },
    { id: 'unread', name: 'Unread', count: unreadCount },
    { id: 'project', name: 'Projects', count: projectCount },
    { id: 'agent', name: 'Agents', count: agentCount }
  ]
}

// Event handlers
const handleFilterChange = (filterId: string) => {
  activeFilter.value = filterId
}

const handleSortChange = (sort: string) => {
  sortBy.value = sort
}

const handleSearch = (query: string) => {
  searchQuery.value = query
}

const handleMarkAsRead = async (alertId: string) => {
  await markAsRead(alertId)
  updateFilterCounts()
}

const handleMarkAllAsRead = async () => {
  await markAllAsRead()
  updateFilterCounts()
}

const handleDelete = async (alertId: string) => {
  await deleteAlert(alertId)
  updateFilterCounts()
}

const handleAction = async (alertId: string, action: string) => {
  const result = await handleAlertAction(alertId, action)
  if (result.success) {
    updateFilterCounts()
    // Handle specific client actions
    if (action === 'View' || action === 'Review') {
      // Navigate to project details or agent profile
      console.log('Navigating to details...')
    }
  }
}

const handleRetry = () => {
  getAlerts()
}

const handleLoadMore = () => {
  // Implement pagination if needed
  console.log('Load more notifications')
}

// Initialize
onMounted(async () => {
  await getAlerts()
  updateFilterCounts()
})

// Watch for changes
watch([alerts, activeFilter, sortBy], () => {
  updateFilterCounts()
})
</script>

<style scoped>
/* Component-specific styles if needed */
</style>

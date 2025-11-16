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
      <div class="flex items-center gap-2 sm:gap-3"></div>
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
      :show-actions="false"
      :show-meta="false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
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
  { id: 'unread', name: 'Unread', count: 0 },
  { id: 'read', name: 'Read', count: 0 }
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

  if (activeFilter.value !== 'all') {
    if (activeFilter.value === 'unread') {
      filtered = filtered.filter(alert => !(alert as any).is_read)
    } else if (activeFilter.value === 'read') {
      filtered = filtered.filter(alert => Boolean((alert as any).is_read))
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
  const unreadTotal = alerts.value?.filter(n => !(n as any).is_read).length || 0
  const readTotal = alerts.value?.filter(n => Boolean((n as any).is_read)).length || 0

  filters.value = [
    { id: 'all', name: 'All', count: allCount },
    { id: 'unread', name: 'Unread', count: unreadTotal },
    { id: 'read', name: 'Read', count: readTotal }
  ]
}

// Event handlers
const handleFilterChange = async (filterId: string) => {
  activeFilter.value = filterId
  if (filterId === 'all') {
    await getAlerts()
  }
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
  const toast = useToast()
  toast.success('Marked as read')
}

const handleMarkAllAsRead = async () => {
  await markAllAsRead()
  updateFilterCounts()
  const toast = useToast()
  toast.success('All unread alerts marked as read')
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

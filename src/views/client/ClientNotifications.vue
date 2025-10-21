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
    <div class="bg-white shadow-sm px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button 
            v-for="filter in filters" 
            :key="filter.id"
            @click="activeFilter = filter.id"
            :class="[
              'px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-medium whitespace-nowrap transition-all duration-200 touch-manipulation',
              activeFilter === filter.id 
                ? 'bg-teal-500 text-white shadow-sm' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
            ]"
          >
            {{ filter.name }}
            <span v-if="filter.count" class="ml-1 text-xs sm:text-sm">({{ filter.count }})</span>
          </button>
        </div>
        
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 whitespace-nowrap">Sort by:</label>
          <select 
            v-model="sortBy" 
            class="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>
    </div>

    <main class="px-3 sm:px-4 md:px-6 py-4 sm:py-6 pb-24 sm:pb-28 max-w-4xl mx-auto">
      

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>

      <!-- Error State -->
      <div v-if="error && !loading" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-700 font-medium">{{ error }}</p>
        </div>
      </div>

      <!-- Alerts Content (only show when not loading and no error) -->
      <div v-if="!loading && !error">
        <!-- Alerts List -->
        <div v-if="filteredAlerts.length > 0">
          <div v-for="alert in filteredAlerts" :key="alert.id" class="mb-4 sm:mb-6">
            <!-- Priority Notification -->
            <section
              v-if="alert.type === 'priority'"
              class="bg-red-50 border-l-4 border-red-500 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm"
            >
              <div class="flex items-start gap-3 sm:gap-4">
                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-400 flex items-center justify-center flex-shrink-0">
                  <span class="text-white text-lg sm:text-xl">🔥</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1 sm:mb-2">
                    <p class="text-xs sm:text-sm text-red-600 font-semibold">{{ alert.timeDisplay }}</p>
                    <button @click="handleRemoveAlert(alert.id)" class="text-gray-400 hover:text-gray-600 p-1 -mr-1">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                  <p class="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">{{ alert.title }}</p>
                  <p class="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">{{ alert.description }}</p>
                  <div class="flex flex-wrap gap-2 sm:gap-3">
                    <button
                      v-for="action in alert.actions"
                      :key="action"
                      @click="handleAlertActionClick(alert.id, action)"
                      :class="[
                        'px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 touch-manipulation',
                        action === 'Review' ? 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700' : 'border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                      ]"
                    >
                      {{ action }}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <!-- Project Update Notification -->
            <section
              v-else-if="alert.type === 'project'"
              class="bg-blue-50 border-l-4 border-blue-500 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm"
            >
              <div class="flex items-start gap-3 sm:gap-4">
                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0">
                  <span class="text-white text-lg sm:text-xl">📋</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1 sm:mb-2">
                    <p class="text-xs sm:text-sm text-blue-600 font-semibold">{{ alert.timeDisplay }}</p>
                    <button @click="handleRemoveAlert(alert.id)" class="text-gray-400 hover:text-gray-600 p-1 -mr-1">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                  <p class="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">{{ alert.title }}</p>
                  <p class="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">{{ alert.description }}</p>
                  <div class="flex flex-wrap gap-2 sm:gap-3">
                    <button
                      v-for="action in alert.actions"
                      :key="action"
                      @click="handleAlertActionClick(alert.id, action)"
                      class="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-blue-600 active:bg-blue-700 transition-all duration-200 touch-manipulation"
                    >
                      {{ action }}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <!-- Agent Response Notification -->
            <section
              v-else-if="alert.type === 'agent'"
              class="bg-green-50 border-l-4 border-green-500 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm"
            >
              <div class="flex items-start gap-3 sm:gap-4">
                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                  <span class="text-white text-lg sm:text-xl">👤</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1 sm:mb-2">
                    <p class="text-xs sm:text-sm text-green-600 font-semibold">{{ alert.timeDisplay }}</p>
                    <button @click="handleRemoveAlert(alert.id)" class="text-gray-400 hover:text-gray-600 p-1 -mr-1">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                  <p class="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">{{ alert.title }}</p>
                  <p class="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">{{ alert.description }}</p>
                  <div class="flex flex-wrap gap-2 sm:gap-3">
                    <button
                      v-for="action in alert.actions"
                      :key="action"
                      @click="handleAlertActionClick(alert.id, action)"
                      class="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-500 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-green-600 active:bg-green-700 transition-all duration-200 touch-manipulation"
                    >
                      {{ action }}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <!-- General Notification -->
            <section
              v-else
              class="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm"
            >
              <div class="flex items-start gap-3 sm:gap-4">
                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  <span class="text-white text-lg sm:text-xl">📢</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1 sm:mb-2">
                    <p class="text-xs sm:text-sm text-gray-500 font-semibold">{{ alert.timeDisplay }}</p>
                    <button @click="handleRemoveAlert(alert.id)" class="text-gray-400 hover:text-gray-600 p-1 -mr-1">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                  <p class="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">{{ alert.title }}</p>
                  <p class="text-sm sm:text-base text-gray-700">{{ alert.description }}</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12 sm:py-16">
          <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gray-200 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
          </div>
          <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">No alerts</h3>
          <p class="text-sm sm:text-base text-gray-500 max-w-md mx-auto">You're all caught up! Check back later for new updates about your projects and agents.</p>
        </div>
      </div>
      
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAlerts } from '../../composables/useAlerts'

interface AlertDisplay {
  id: string
  type: 'priority' | 'project' | 'agent' | 'general'
  title: string
  description: string
  created_at: number
  read: boolean
  actions: string[]
  timeDisplay: string
}

// Filter and sort state
const activeFilter = ref('all')
const sortBy = ref('newest')

const {
  alerts,
  loading,
  error,
  getAlerts,
  markAsRead,
  markAllAsRead,
  deleteAlert,
  handleAlertAction
} = useAlerts()

const mapAlertToDisplay = (alert: any): AlertDisplay => {
  const priority = String(alert?.priority || '').toLowerCase()
  const alertType = String(alert?.alert_type || '').toLowerCase()

  let type: AlertDisplay['type'] = 'general'
  if (priority.includes('high')) {
    type = 'priority'
  } else if (alertType.includes('project')) {
    type = 'project'
  } else if (alertType.includes('agent')) {
    type = 'agent'
  }

  const createdAtRaw = alert?.date_created ?? alert?.last_updated ?? null
  let createdAt = Date.now()
  if (typeof createdAtRaw === 'number') {
    createdAt = createdAtRaw > 1_000_000_000_000 ? createdAtRaw : createdAtRaw * 1000
  } else if (typeof createdAtRaw === 'string') {
    const parsed = Date.parse(createdAtRaw)
    if (!Number.isNaN(parsed)) {
      createdAt = parsed
    }
  }

  const actions = [alert?.alert_primary_action, alert?.alert_secondary_action]
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)

  const date = new Date(createdAt)
  const timeDisplay = date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return {
    id: String(alert?.id || crypto.randomUUID()),
    type,
    title: alert?.alert_title || 'Alert',
    description: alert?.alert_description || '',
    created_at: createdAt,
    read: Boolean(alert?.is_read),
    actions,
    timeDisplay
  }
}

const notifications = computed<AlertDisplay[]>(() => alerts.value.map(mapAlertToDisplay))

// Filters
const filters = ref([
  { id: 'all', name: 'All', count: 0 },
  { id: 'priority', name: 'Priority', count: 0 },
  { id: 'project', name: 'Projects', count: 0 },
  { id: 'agent', name: 'Agents', count: 0 },
  { id: 'general', name: 'General', count: 0 }
])

// Update filter counts based on notifications data
const updateFilterCounts = () => {
  if (notifications.value.length === 0) {
    filters.value.forEach(filter => { filter.count = 0 })
    return
  }

  const counts = {
    all: notifications.value.length,
    priority: notifications.value.filter(n => n.type === 'priority').length,
    project: notifications.value.filter(n => n.type === 'project').length,
    agent: notifications.value.filter(n => n.type === 'agent').length,
    general: notifications.value.filter(n => n.type === 'general').length
  }

  filters.value.forEach(filter => {
    filter.count = counts[filter.id as keyof typeof counts] || 0
  })
}

// Computed filtered notifications
const filteredAlerts = computed(() => {
  if (notifications.value.length === 0) return []

  let filtered = [...notifications.value]

  // Apply filter
  if (activeFilter.value !== 'all') {
    filtered = filtered.filter(notification => notification.type === activeFilter.value)
  }

  // Apply sorting
  filtered.sort((a, b) => {
    if (sortBy.value === 'newest') {
      return b.created_at - a.created_at
    } else if (sortBy.value === 'oldest') {
      return a.created_at - b.created_at
    } else if (sortBy.value === 'priority') {
      const priorityOrder = { priority: 0, project: 1, agent: 2, general: 3 }
      return priorityOrder[a.type] - priorityOrder[b.type]
    }
    return 0
  })

  return filtered
})

// Methods
const handleMarkAllAsRead = async () => {
  const result = await markAllAsRead()
  if (result.success) updateFilterCounts()
}

const handleRemoveAlert = async (id: string) => {
  const result = await deleteAlert(id)
  if (result.success) updateFilterCounts()
}

const handleAlertActionClick = async (alertId: string, action: string) => {
  const result = await handleAlertAction(alertId, action)
  if (result.success) updateFilterCounts()
}

// Load alerts on mount
onMounted(async () => {
  try {
    await getAlerts()
    updateFilterCounts()
  } catch (error) {
    console.error('Error loading alerts:', error)
  }
})

// Watch for alerts changes to update filter counts
watch(notifications, updateFilterCounts, { immediate: true })
</script>

<style scoped>
/* Component-specific styles if needed */
</style>

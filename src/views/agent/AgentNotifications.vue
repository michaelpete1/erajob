<template>
  <div class="min-h-screen bg-gray-50 font-sans antialiased text-gray-800">
    <!-- Header -->
    <header class="bg-brand-teal text-white px-4 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between shadow-md sticky top-0 z-30 backdrop-blur-sm bg-opacity-95">
      <div class="flex items-center">
        <button @click="$router.back()" class="p-2 -ml-2 sm:p-2 sm:-ml-2 md:p-2.5 md:-ml-2.5 rounded-full hover:bg-white hover:bg-opacity-10 active:bg-opacity-20 transition-all duration-200 touch-manipulation" aria-label="Go back">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <h1 class="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight ml-1 sm:ml-2">Agent Alerts</h1>
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
                ? 'bg-brand-teal text-white shadow-sm' 
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
            class="px-3 py-1.5 sm:px-4 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-brand-teal bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Priority First</option>
          </select>
        </div>
      </div>
    </div>

    <main class="px-3 sm:px-4 md:px-6 py-4 sm:py-6 pb-24 sm:pb-28 max-w-4xl mx-auto">
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
                <span class="text-white text-lg sm:text-xl">⚠️</span>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-base sm:text-lg font-semibold text-red-800">{{ alert.title }}</h3>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs text-red-600">{{ alert.timeDisplay }}</span>
                    <button 
                      @click="handleRemoveAlert(alert.id)"
                      class="p-1 rounded-full hover:bg-red-100 transition-colors"
                      aria-label="Remove alert"
                    >
                      <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <p class="text-sm sm:text-base text-red-700 mb-3">{{ alert.description }}</p>
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-for="action in alert.actions" 
                    :key="action"
                    @click="handleAlertActionClick(alert.id, action)"
                    class="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    {{ action }}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- Success Notification -->
          <section 
            v-else-if="alert.type === 'success'" 
            class="bg-green-50 border-l-4 border-green-500 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm"
          >
            <div class="flex items-start gap-3 sm:gap-4">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                <span class="text-white text-lg sm:text-xl">✅</span>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-base sm:text-lg font-semibold text-green-800">{{ alert.title }}</h3>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-green-600">{{ alert.timeDisplay }}</span>
                    <button 
                      @click="handleRemoveAlert(alert.id)"
                      class="p-1 rounded-full hover:bg-green-100 transition-colors"
                      aria-label="Remove alert"
                    >
                      <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <p class="text-sm sm:text-base text-green-700 mb-3">{{ alert.description }}</p>
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-for="action in alert.actions" 
                    :key="action"
                    @click="handleAlertActionClick(alert.id, action)"
                    class="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {{ action }}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- Info Notification -->
          <section 
            v-else-if="alert.type === 'info'" 
            class="bg-blue-50 border-l-4 border-blue-500 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm"
          >
            <div class="flex items-start gap-3 sm:gap-4">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0">
                <span class="text-white text-lg sm:text-xl">ℹ️</span>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-base sm:text-lg font-semibold text-blue-800">{{ alert.title }}</h3>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-blue-600">{{ alert.timeDisplay }}</span>
                    <button 
                      @click="handleRemoveAlert(alert.id)"
                      class="p-1 rounded-full hover:bg-blue-100 transition-colors"
                      aria-label="Remove notification"
                    >
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <p class="text-sm sm:text-base text-blue-700 mb-3">{{ alert.description }}</p>
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-for="action in alert.actions" 
                    :key="action"
                    @click="handleAlertActionClick(alert.id, action)"
                    class="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {{ action }}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- Default Notification -->
          <section 
            v-else 
            class="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="flex items-start gap-3 sm:gap-4">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-teal flex items-center justify-center flex-shrink-0">
                <span class="text-white text-lg sm:text-xl">👤</span>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-base sm:text-lg font-semibold text-gray-800">{{ alert.title }}</h3>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-gray-500">{{ alert.timeDisplay }}</span>
                    <button 
                      @click="handleRemoveAlert(alert.id)"
                      class="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Remove notification"
                    >
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <p class="text-sm sm:text-base text-gray-700 mb-3">{{ alert.description }}</p>
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-for="action in alert.actions" 
                    :key="action"
                    @click="handleAlertActionClick(alert.id, action)"
                    class="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {{ action }}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 sm:py-16">
        <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gray-200 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
        </div>
        <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No Alerts</h3>
        <p class="text-sm sm:text-base text-gray-600 max-w-md mx-auto">You're all caught up! Check back later for new alerts about your projects and opportunities.</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAlerts } from '../../composables/useAlerts'

// Reactive data
const activeFilter = ref('all')
const sortBy = ref('newest')

interface AlertDisplay {
  id: string
  type: 'priority' | 'success' | 'info' | 'general'
  title: string
  description: string
  createdAt: number
  timeDisplay: string
  actions: string[]
  read: boolean
}

const {
  alerts,
  loading,
  error,
  getAlerts,
  markAsRead: markAlertAsRead,
  markAllAsRead: markAllAlertsAsRead,
  deleteAlert,
  handleAlertAction
} = useAlerts()

const mapAlertToDisplay = (alert: any): AlertDisplay => {
  const priority = String(alert?.priority || '').toLowerCase()
  const alertType = String(alert?.alert_type || '').toLowerCase()

  let type: AlertDisplay['type'] = 'general'
  if (priority.includes('high')) {
    type = 'priority'
  } else if (alertType.includes('success') || alertType.includes('approved') || alertType.includes('completed')) {
    type = 'success'
  } else if (alertType.includes('info') || alertType.includes('update')) {
    type = 'info'
  }

  const createdRaw = alert?.date_created ?? alert?.last_updated ?? Date.now()
  let createdAt = Date.now()
  if (typeof createdRaw === 'number') {
    createdAt = createdRaw > 1_000_000_000_000 ? createdRaw : createdRaw * 1000
  } else if (typeof createdRaw === 'string') {
    const parsed = Date.parse(createdRaw)
    if (!Number.isNaN(parsed)) createdAt = parsed
  }

  const timeDisplay = new Date(createdAt).toLocaleString()
  const actions = [alert?.alert_primary_action, alert?.alert_secondary_action]
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)

  return {
    id: String(alert?.id || crypto.randomUUID()),
    type,
    title: alert?.alert_title || 'Alert',
    description: alert?.alert_description || '',
    createdAt,
    timeDisplay,
    actions,
    read: Boolean(alert?.is_read)
  }
}

const notifications = computed<AlertDisplay[]>(() => alerts.value.map(mapAlertToDisplay))

const filters = ref([
  { id: 'all', name: 'All', count: 0 },
  { id: 'priority', name: 'Priority', count: 0 },
  { id: 'success', name: 'Success', count: 0 },
  { id: 'info', name: 'Info', count: 0 },
  { id: 'unread', name: 'Unread', count: 0 }
])

// Computed properties
const filteredAlerts = computed(() => {
  let filtered = [...notifications.value]

  // Apply filter
  if (activeFilter.value !== 'all') {
    if (activeFilter.value === 'unread') {
      filtered = filtered.filter(n => !n.read)
    } else {
      filtered = filtered.filter(n => n.type === activeFilter.value)
    }
  }

  // Apply sorting
  filtered.sort((a, b) => {
    if (sortBy.value === 'oldest') {
      return a.createdAt - b.createdAt
    } else if (sortBy.value === 'priority') {
      const priorityOrder = { priority: 0, success: 1, info: 2, default: 3 }
      return priorityOrder[a.type] - priorityOrder[b.type]
    } else { // newest
      return b.createdAt - a.createdAt
    }
  })

  return filtered
})

// Methods
const updateFilterCounts = () => {
  const list = notifications.value
  filters.value.forEach(filter => {
    if (filter.id === 'all') {
      filter.count = list.length
    } else if (filter.id === 'unread') {
      filter.count = list.filter(n => !n.read).length
    } else {
      filter.count = list.filter(n => n.type === filter.id).length
    }
  })
}

const handleMarkAllAsRead = async () => {
  const result = await markAllAlertsAsRead()
  if (result.success) updateFilterCounts()
}

const handleRemoveAlert = async (id: string) => {
  try {
    const result = await deleteAlert(id)
    if (result.success) updateFilterCounts()
  } catch (error) {
    console.error('Error deleting alert:', error)
  }
}

const handleAlertActionClick = async (alertId: string, action: string) => {
  const result = await handleAlertAction(alertId, action)
  if (result.success) updateFilterCounts()
}

// Load alerts on mount
onMounted(async () => {
  await getAlerts()
  updateFilterCounts()
})

watch(notifications, updateFilterCounts)

</script>

<style scoped>
/* Custom animations and transitions */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .text-xs { font-size: 0.75rem; }
  .text-sm { font-size: 0.875rem; }
  .text-base { font-size: 1rem; }
  .text-lg { font-size: 1.125rem; }
  .text-xl { font-size: 1.25rem; }
  .text-2xl { font-size: 1.5rem; }
}

/* Touch-friendly buttons */
.touch-manipulation {
  touch-action: manipulation;
}

/* Smooth transitions for all interactive elements */
button, .router-link-active {
  transition: all 0.2s ease;
}
</style>

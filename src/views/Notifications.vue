<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header similar to Projects header -->
    <header class="bg-brand-teal text-white px-4 py-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
      <div class="flex items-center gap-3">
        <button @click="$router.back()" aria-label="Back" class="p-1 text-white/95 hover:text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-lg font-semibold">Notifications</h1>
      </div>
      <div class="flex items-center gap-3">
        <button @click="markAllAsRead" class="p-1 text-white/95 hover:text-white" aria-label="Mark all as read">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button class="p-1 text-white/95 hover:text-white" aria-label="Settings">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <div class="w-9 h-9 rounded-full bg-white/90" />
      </div>
    </header>

    <!-- Filter and Sort Controls -->
    <div class="bg-white shadow-sm px-4 py-3 border-b">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <!-- Filter Tabs -->
        <div class="flex gap-2 overflow-x-auto">
          <button 
            v-for="filter in filters" 
            :key="filter.id"
            @click="activeFilter = filter.id"
            :class="[
              'px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              activeFilter === filter.id 
                ? 'bg-brand-teal text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ filter.name }}
            <span v-if="filter.count" class="ml-1 text-xs">({{ filter.count }})</span>
          </button>
        </div>
        
        <!-- Sort Dropdown -->
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">Sort by:</label>
          <select 
            v-model="sortBy" 
            class="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>
    </div>

  <main class="p-4 max-w-2xl mx-auto pb-24">
      <!-- Today's Notifications -->
      <div v-if="filteredNotifications.length > 0">
        <div v-for="notification in filteredNotifications" :key="notification.id" class="mb-4">
          <!-- Priority Notification -->
          <section 
            v-if="notification.type === 'priority'" 
            class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-sm"
          >
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-red-400 flex items-center justify-center flex-shrink-0">
                <span class="text-white text-xl">🔥</span>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <p class="text-xs text-red-600 font-semibold">{{ notification.time }}</p>
                  <button @click="removeNotification(notification.id)" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p class="font-semibold text-gray-900 mt-1">{{ notification.title }}</p>
                <p class="text-sm text-gray-700 mt-2">{{ notification.description }}</p>
                <div class="mt-3 flex gap-2">
                  <button 
                    v-for="action in notification.actions" 
                    :key="action"
                    @click="handleNotificationAction(notification.id, action)"
                    :class="[
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      action === 'Accept' ? 'bg-red-500 text-white hover:bg-red-600' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    ]"
                  >
                    {{ action }}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- Success Notification -->
          <section 
            v-else-if="notification.type === 'success'" 
            class="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 shadow-sm"
          >
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                <span class="text-white text-xl">✅</span>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <p class="text-xs text-green-600 font-semibold">{{ notification.time }}</p>
                  <button @click="removeNotification(notification.id)" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p class="font-semibold text-gray-900 mt-1">{{ notification.title }}</p>
                <p class="text-sm text-gray-700 mt-2">{{ notification.description }}</p>
                <div class="mt-3 flex gap-2">
                  <button 
                    v-for="action in notification.actions" 
                    :key="action"
                    @click="handleNotificationAction(notification.id, action)"
                    class="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    {{ action }}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- Info Notification -->
          <section 
            v-else-if="notification.type === 'info'" 
            class="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 shadow-sm"
          >
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0">
                <span class="text-white text-xl">ℹ️</span>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <p class="text-xs text-blue-600 font-semibold">{{ notification.time }}</p>
                  <button @click="removeNotification(notification.id)" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p class="font-semibold text-gray-900 mt-1">{{ notification.title }}</p>
                <p class="text-sm text-gray-700 mt-2">{{ notification.description }}</p>
                <div class="mt-3 flex gap-2">
                  <button 
                    v-for="action in notification.actions" 
                    :key="action"
                    @click="handleNotificationAction(notification.id, action)"
                    class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                  >
                    {{ action }}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- Warning Notification -->
          <section 
            v-else-if="notification.type === 'warning'" 
            class="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 shadow-sm"
          >
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                <span class="text-white text-xl">⚠️</span>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <p class="text-xs text-yellow-600 font-semibold">{{ notification.time }}</p>
                  <button @click="removeNotification(notification.id)" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p class="font-semibold text-gray-900 mt-1">{{ notification.title }}</p>
                <p class="text-sm text-gray-700 mt-2">{{ notification.description }}</p>
                <div class="mt-3 flex gap-2">
                  <button 
                    v-for="action in notification.actions" 
                    :key="action"
                    @click="handleNotificationAction(notification.id, action)"
                    class="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
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
            class="bg-white rounded-lg p-4 shadow-sm border"
          >
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-teal-400 flex-shrink-0" />
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <p class="text-xs text-gray-500">{{ notification.time }}</p>
                  <button @click="removeNotification(notification.id)" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p class="font-semibold text-gray-900 mt-1">{{ notification.title }}</p>
                <p class="text-sm text-gray-700 mt-2">{{ notification.description }}</p>
                <div v-if="notification.actions && notification.actions.length > 0" class="mt-3 flex gap-2">
                  <button 
                    v-for="action in notification.actions" 
                    :key="action"
                    @click="handleNotificationAction(notification.id, action)"
                    :class="[
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      action === 'Accept' ? 'bg-brand-teal text-white hover:bg-teal-600' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    ]"
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
      <div v-else class="text-center py-12">
        <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
        <p class="text-gray-500">You're all caught up! Check back later for updates.</p>
      </div>
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BottomNav from '../components/BottomNav.vue'

// Notification type interface
interface Notification {
  id: string
  type: 'priority' | 'success' | 'info' | 'warning' | 'default'
  category: 'job' | 'payment' | 'rating' | 'system' | 'message'
  title: string
  description: string
  time: string
  actions?: string[]
  priority: 'high' | 'medium' | 'low'
  read: boolean
}

// Filter interface
interface Filter {
  id: string
  name: string
  count?: number
}

// Reactive data
const activeFilter = ref<string>('all')
const sortBy = ref<string>('newest')
const notifications = ref<Notification[]>([
  {
    id: '1',
    type: 'priority',
    category: 'job',
    title: 'Urgent: Website Redesign Project',
    description: 'Alex Carter awarded your $750 bid for Website Redesign with a 7 day deadline. This requires immediate attention.',
    time: 'Today at 07:43',
    actions: ['Accept', 'Reject'],
    priority: 'high',
    read: false
  },
  {
    id: '2',
    type: 'success',
    category: 'payment',
    title: 'Payment Received',
    description: 'Emma Davis released a $250 milestone payment for Business Website Design.',
    time: 'Today at 06:24',
    actions: ['View Details'],
    priority: 'medium',
    read: false
  },
  {
    id: '3',
    type: 'info',
    category: 'rating',
    title: 'New Rating Received',
    description: 'Mike Turner has rated your entry for E-Commerce Site with 5 stars.',
    time: 'Yesterday at 15:30',
    actions: ['View Rating'],
    priority: 'low',
    read: true
  },
  {
    id: '4',
    type: 'warning',
    category: 'system',
    title: 'Profile Incomplete',
    description: 'Your profile is 85% complete. Add your portfolio to increase visibility.',
    time: '2 days ago',
    actions: ['Complete Profile'],
    priority: 'medium',
    read: false
  },
  {
    id: '5',
    type: 'default',
    category: 'message',
    title: 'New Message from Client',
    description: 'Sarah Johnson sent you a message regarding the Mobile App project.',
    time: '3 days ago',
    actions: ['Reply', 'View Project'],
    priority: 'low',
    read: true
  },
  {
    id: '6',
    type: 'success',
    category: 'job',
    title: 'Project Completed',
    description: 'Logo Design project has been marked as completed by the client.',
    time: '1 week ago',
    actions: ['Leave Review'],
    priority: 'medium',
    read: true
  }
])

// Filters
const filters = ref<Filter[]>([
  { id: 'all', name: 'All', count: notifications.value.length },
  { id: 'unread', name: 'Unread', count: notifications.value.filter(n => !n.read).length },
  { id: 'job', name: 'Jobs', count: notifications.value.filter(n => n.category === 'job').length },
  { id: 'payment', name: 'Payments', count: notifications.value.filter(n => n.category === 'payment').length },
  { id: 'rating', name: 'Ratings', count: notifications.value.filter(n => n.category === 'rating').length },
  { id: 'system', name: 'System', count: notifications.value.filter(n => n.category === 'system').length }
])

// Computed property for filtered and sorted notifications
const filteredNotifications = computed(() => {
  let filtered = notifications.value
  
  // Apply filter
  if (activeFilter.value === 'unread') {
    filtered = filtered.filter(n => !n.read)
  } else if (activeFilter.value !== 'all') {
    filtered = filtered.filter(n => n.category === activeFilter.value)
  }
  
  // Apply sorting
  filtered = [...filtered]
  if (sortBy.value === 'newest') {
    filtered.sort((a, b) => {
      // Simple time-based sorting (in real app, use proper date parsing)
      const timeA = a.time.toLowerCase().includes('today') ? 0 : 
                   a.time.toLowerCase().includes('yesterday') ? 1 : 2
      const timeB = b.time.toLowerCase().includes('today') ? 0 : 
                   b.time.toLowerCase().includes('yesterday') ? 1 : 2
      return timeA - timeB
    })
  } else if (sortBy.value === 'oldest') {
    filtered.sort((a, b) => {
      const timeA = a.time.toLowerCase().includes('today') ? 0 : 
                   a.time.toLowerCase().includes('yesterday') ? 1 : 2
      const timeB = b.time.toLowerCase().includes('today') ? 0 : 
                   b.time.toLowerCase().includes('yesterday') ? 1 : 2
      return timeB - timeA
    })
  } else if (sortBy.value === 'priority') {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  }
  
  return filtered
})

// Methods
const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true
  })
  updateFilterCounts()
}

const removeNotification = (id: string) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
    updateFilterCounts()
  }
}

const handleNotificationAction = (notificationId: string, action: string) => {
  const notification = notifications.value.find(n => n.id === notificationId)
  if (notification) {
    // Mark as read when action is taken
    notification.read = true
    updateFilterCounts()
    
    // Handle different actions
    switch (action) {
      case 'Accept':
        console.log('Accepting job:', notification.title)
        // Show success message and navigate to projects
        alert(`✅ Project accepted! You can now start working on: ${notification.title}`)
        // Remove the notification after acceptance
        setTimeout(() => {
          removeNotification(notificationId)
        }, 1000)
        break
      case 'Reject':
        console.log('Rejecting job:', notification.title)
        // Show confirmation and remove notification
        if (confirm(`Are you sure you want to reject: ${notification.title}?`)) {
          removeNotification(notificationId)
          alert('❌ Project rejected successfully.')
        }
        break
      case 'View Details':
        console.log('Viewing details for:', notification.title)
        // Navigate to payment details
        alert(`💰 Payment details for: ${notification.title}\nAmount: $250\nStatus: Completed\nDate: ${notification.time}`)
        break
      case 'View Rating':
        console.log('Viewing rating for:', notification.title)
        // Navigate to rating details
        alert(`⭐ Rating Details for: ${notification.title}\nRating: 5 stars\nClient: Mike Turner\nFeedback: Excellent work!`)
        break
      case 'Complete Profile':
        console.log('Completing profile')
        // Navigate to profile settings
        alert('📝 Redirecting to profile settings to complete your profile...')
        break
      case 'Reply':
        console.log('Replying to message for:', notification.title)
        // Navigate to messages
        alert('💬 Opening message conversation with Sarah Johnson...')
        break
      case 'View Project':
        console.log('Viewing project for:', notification.title)
        // Navigate to project
        alert('📱 Opening Mobile App project details...')
        break
      case 'Leave Review':
        console.log('Leaving review for:', notification.title)
        // Navigate to review page
        alert('⭐ Opening review page for Logo Design project...')
        break
      default:
        console.log('Action:', action, 'for notification:', notification.title)
    }
  }
}

const updateFilterCounts = () => {
  filters.value = [
    { id: 'all', name: 'All', count: notifications.value.length },
    { id: 'unread', name: 'Unread', count: notifications.value.filter(n => !n.read).length },
    { id: 'job', name: 'Jobs', count: notifications.value.filter(n => n.category === 'job').length },
    { id: 'payment', name: 'Payments', count: notifications.value.filter(n => n.category === 'payment').length },
    { id: 'rating', name: 'Ratings', count: notifications.value.filter(n => n.category === 'rating').length },
    { id: 'system', name: 'System', count: notifications.value.filter(n => n.category === 'system').length }
  ]
}
</script>

<style scoped>
/* Page uses white background; keep header teal in theme */
</style>

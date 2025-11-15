<template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 overflow-hidden">
    <div class="absolute top-0 right-0 h-24 w-24 sm:h-32 sm:w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow"></div>
    <div class="absolute bottom-0 left-0 h-20 w-20 sm:h-24 sm:w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse"></div>
    <div class="absolute top-1/2 left-1/2 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float"></div>
    
    <div class="absolute top-16 left-16 sm:top-20 sm:left-20 w-2 h-2 bg-white/20 rounded-full animate-float-delayed-1"></div>
    <div class="absolute top-32 right-24 sm:top-40 sm:right-32 w-1 h-1 bg-white/30 rounded-full animate-float-delayed-2"></div>
    <div class="absolute bottom-24 left-32 sm:bottom-32 sm:left-40 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-delayed-3"></div>
    <div class="absolute bottom-16 right-16 sm:bottom-20 sm:right-20 w-2.5 h-2.5 bg-white/15 rounded-full animate-float-delayed-4"></div>

    <div class="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-24">
      <header class="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 w-[90%] sm:w-[92%] max-w-3xl bg-brand-teal text-white rounded-xl px-3 sm:px-4 py-2 sm:py-3 z-50 shadow-md flex items-center justify-between">
        <div class="flex items-center gap-2 sm:gap-3">
          <button @click="goToJobApproval" aria-label="Back to Job Offers" class="p-1 text-white/95 hover:text-white">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-sm sm:text-base font-semibold display-font">Admin Notifications</h1>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <button @click="markAllAsRead" class="p-1 text-white/95 hover:text-white" aria-label="Mark all as read">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/90" />
        </div>
      </header>

      

      <main>
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12 sm:py-16">
          <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-white/30 backdrop-blur-sm rounded-full animate-pulse" />
          <h3 class="text-lg sm:text-xl font-semibold text-white mb-2">Loading notifications...</h3>
        </div>
        <!-- Verification Queue -->
        <div class="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm p-3 sm:p-4 mb-4" v-if="verificationAlerts.length">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-sm sm:text-base font-semibold text-gray-800">Accounts awaiting verification</h2>
            <button @click="goToUserApprovals" class="text-xs sm:text-sm text-brand-teal hover:underline">Open Approvals</button>
          </div>
          <div v-for="a in verificationAlerts" :key="a.id" class="mb-3 last:mb-0">
            <div class="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3">
              <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0 text-white">👤</div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-blue-800 truncate">{{ a.title || 'New account requires verification' }}</p>
                  <p class="text-xs text-blue-700 truncate">{{ a.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Jobs awaiting approval -->
        <div class="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm p-3 sm:p-4 mb-4" v-if="jobApprovalAlerts.length">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-sm sm:text-base font-semibold text-gray-800">Jobs awaiting approval</h2>
            <button @click="goToJobApproval" class="text-xs sm:text-sm text-brand-teal hover:underline">Open Job Review</button>
          </div>
          <div v-for="a in jobApprovalAlerts" :key="a.id" class="mb-3 last:mb-0">
            <div class="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-3">
              <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 text-white">📝</div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-amber-800 truncate">{{ a.title || 'New job submission pending' }}</p>
                  <p class="text-xs text-amber-700 truncate">{{ a.description || 'Awaiting admin approval' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- All alerts fallback list -->
        <div v-else-if="filteredNotifications.length > 0">
          <div v-for="(notification, index) in filteredNotifications" :key="notification.id" :class="`animate-stagger-${(index % 4) + 1}`" class="mb-4">
            <!-- Priority Notification -->
            <section 
              v-if="notification.type === 'priority'" 
              class="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 sm:p-5 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01]"
            >
              <div class="flex items-start gap-3 sm:gap-4">
                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-400 flex items-center justify-center flex-shrink-0">
                  <span class="text-white text-lg sm:text-xl">🔥</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1 sm:mb-2">
                    <p class="text-xs sm:text-sm text-red-600 font-semibold">{{ notification.time }}</p>
                    <button @click="removeNotification(notification.id)" class="text-gray-400 hover:text-gray-600">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p class="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2 display-font">{{ notification.title }}</p>
                  <p class="text-sm text-gray-700 mb-3 sm:mb-4">{{ notification.description }}</p>
                  <div class="flex flex-wrap gap-2 sm:gap-3">
                    <button 
                      v-for="action in notification.actions" 
                      :key="action"
                      @click="handleNotificationAction(notification.id, action)"
                      :class="[
                        'px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 min-h-[36px] touch-manipulation btn-pressable hover:shadow-lg hover:scale-[1.02]',
                        action === 'Approve' ? 'bg-red-500 text-white hover:bg-red-600' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      ]"
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
              class="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-4 sm:p-5 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01]"
            >
              <div class="flex items-start gap-3 sm:gap-4">
                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0">
                  <span class="text-white text-lg sm:text-xl">ℹ️</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1 sm:mb-2">
                    <p class="text-xs sm:text-sm text-blue-600 font-semibold">{{ notification.time }}</p>
                    <button @click="removeNotification(notification.id)" class="text-gray-400 hover:text-gray-600">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p class="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2 display-font">{{ notification.title }}</p>
                  <p class="text-sm text-gray-700 mb-3 sm:mb-4">{{ notification.description }}</p>
                  <div class="flex flex-wrap gap-2 sm:gap-3">
                    <button 
                      v-for="action in notification.actions" 
                      :key="action"
                      @click="handleNotificationAction(notification.id, action)"
                      class="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 min-h-[36px] touch-manipulation btn-pressable hover:shadow-lg hover:scale-[1.02]"
                    >
                      {{ action }}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <!-- Meeting Notification -->
            <section
              v-else-if="notification.type === 'meeting'"
              class="bg-purple-50 border-l-4 border-purple-500 rounded-xl p-4 sm:p-5 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01]"
            >
              <div class="flex items-start gap-3 sm:gap-4">
                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-400 flex items-center justify-center flex-shrink-0">
                  <span class="text-white text-lg sm:text-xl">📅</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1 sm:mb-2">
                    <p class="text-xs sm:text-sm text-purple-600 font-semibold">{{ notification.time }}</p>
                    <button @click="removeNotification(notification.id)" class="text-gray-400 hover:text-gray-600">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p class="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2 display-font">{{ notification.title }}</p>
                  <p class="text-sm text-gray-700 mb-3 sm:mb-4">{{ notification.description }}</p>
                  <div class="flex flex-wrap gap-2 sm:gap-3">
                    <button
                      v-for="action in notification.actions"
                      :key="action"
                      @click="handleNotificationAction(notification.id, action)"
                      class="px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-purple-600 active:bg-purple-700 transition-all duration-300 min-h-[36px] touch-manipulation btn-pressable hover:shadow-lg hover:scale-[1.02]"
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
              class="bg-green-50 border-l-4 border-green-500 rounded-xl p-4 sm:p-5 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01]"
            >
              <div class="flex items-start gap-3 sm:gap-4">
                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                  <span class="text-white text-lg sm:text-xl">✅</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1 sm:mb-2">
                    <p class="text-xs sm:text-sm text-green-600 font-semibold">{{ notification.time }}</p>
                    <button @click="removeNotification(notification.id)" class="text-gray-400 hover:text-gray-600">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p class="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2 display-font">{{ notification.title }}</p>
                  <p class="text-sm text-gray-700 mb-3 sm:mb-4">{{ notification.description }}</p>
                  <div class="flex flex-wrap gap-2 sm:gap-3">
                    <button
                      v-for="action in notification.actions"
                      :key="action"
                      @click="handleNotificationAction(notification.id, action)"
                      class="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 min-h-[36px] touch-manipulation btn-pressable hover:shadow-lg hover:scale-[1.02]"
                    >
                      {{ action }}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <!-- Worklog Notification -->
            <section
              v-else-if="notification.type === 'worklog'"
              class="bg-orange-50 border-l-4 border-orange-500 rounded-xl p-4 sm:p-5 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01]"
            >
              <div class="flex items-start gap-3 sm:gap-4">
                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-400 flex items-center justify-center flex-shrink-0">
                  <span class="text-white text-lg sm:text-xl">📝</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1 sm:mb-2">
                    <p class="text-xs sm:text-sm text-orange-600 font-semibold">{{ notification.time }}</p>
                    <button @click="removeNotification(notification.id)" class="text-gray-400 hover:text-gray-600">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p class="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2 display-font">{{ notification.title }}</p>
                  <p class="text-sm text-gray-700 mb-3 sm:mb-4">{{ notification.description }}</p>
                  <div class="flex flex-wrap gap-2 sm:gap-3">
                    <button
                      v-for="action in notification.actions"
                      :key="action"
                      @click="handleNotificationAction(notification.id, action)"
                      class="px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-orange-600 active:bg-orange-700 transition-all duration-300 min-h-[36px] touch-manipulation btn-pressable hover:shadow-lg hover:scale-[1.02]"
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
              class="bg-white/95 backdrop-blur-sm border-l-4 border-gray-300 rounded-xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01]"
            >
              <div class="flex items-start gap-3 sm:gap-4">
                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-400 flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1 sm:mb-2">
                    <p class="text-xs sm:text-sm text-gray-600">{{ notification.time }}</p>
                    <button @click="removeNotification(notification.id)" class="text-gray-400 hover:text-gray-600">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p class="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2 display-font">{{ notification.title }}</p>
                  <p class="text-sm text-gray-700 mb-3 sm:mb-4">{{ notification.description }}</p>
                  <div class="flex flex-wrap gap-2 sm:gap-3">
                    <button
                      v-for="action in notification.actions"
                      :key="action"
                      @click="handleNotificationAction(notification.id, action)"
                      class="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 min-h-[36px] touch-manipulation btn-pressable hover:shadow-lg hover:scale-[1.02]"
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
          <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 sm:w-10 sm:h-10 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-2.81a6.002 6.002 0 00-1.238-3.037l-.95-.95a2.5 2.5 0 01-3.536 0L10 11.414l-1.414 1.414a2.5 2.5 0 01-3.536 0L3 11.414V17h12zm-4-9a1 1 0 100-2 1 1 0 000 2z"></path>
            </svg>
          </div>
          <h3 class="text-lg sm:text-xl font-semibold text-white mb-2">No notifications</h3>
          <p class="text-sm text-white/80">You're all caught up! No new notifications at this time.</p>
        </div>
      </main>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../../services/apiService';
import type { AlertsOut } from '../../types/api/openapi';

interface Notification {
  id: string;
  type: 'priority' | 'info' | 'success' | 'meeting' | 'worklog' | 'default';
  title: string;
  description: string;
  time: string;
  actions: string[];
  read: boolean;
}

interface Filter {
  id: string;
  name: string;
  count: number;
}

const activeFilter = ref<string>('all');
const sortBy = ref<string>('newest');
const notifications = ref<Notification[]>([]);
const loading = ref(false)
const error = ref<string | null>(null)

// Map API AlertsOut to UI Notification
function mapAlertToNotification(a: AlertsOut): Notification {
  // Derive type from priority/alert_type
  const type: Notification['type'] = a.priority === 'very_high' || a.priority === 'high'
    ? 'priority'
    : a.alert_type === 'meeting'
      ? 'meeting'
      : a.alert_type === 'agent_completion_update'
        ? 'success'
        : a.alert_type === 'worklog'
          ? 'worklog'
          : 'info'

  const ts = a.date_created ? new Date(a.date_created * 1000) : new Date()
  return {
    id: (a.id as string) || Math.random().toString(36).slice(2),
    type,
    title: a.alert_title || 'Notification',
    description: a.alert_description || '',
    time: ts.toLocaleString(),
    actions: [a.alert_primary_action, a.alert_secondary_action].filter(Boolean) as string[],
    read: false
  }
}

async function fetchNotifications() {
  loading.value = true
  error.value = null
  try {
    const res = await api.alerts.getAlerts('admin')
    if (res.success && res.data) {
      notifications.value = res.data.map(mapAlertToNotification)
      updateFilterCounts()
    } else {
      error.value = res.error || 'Failed to fetch notifications'
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to fetch notifications'
  } finally {
    loading.value = false
  }
}

const filters = ref<Filter[]>([
  { id: 'all', name: 'All', count: 0 },
  { id: 'priority', name: 'Priority', count: 0 },
  { id: 'unread', name: 'Unread', count: 0 },
  { id: 'system', name: 'System', count: 0 }
]);

const filteredNotifications = computed(() => {
  let filtered = notifications.value;

  // Apply filter
  if (activeFilter.value === 'priority') {
    filtered = filtered.filter(n => n.type === 'priority');
  } else if (activeFilter.value === 'unread') {
    filtered = filtered.filter(n => !n.read);
  } else if (activeFilter.value === 'system') {
    filtered = filtered.filter(n => n.type === 'info' || n.type === 'success');
  }

  // Apply sorting
  if (sortBy.value === 'newest') {
    filtered.sort((a, b) => {
      const timeA = new Date(a.time).getTime();
      const timeB = new Date(b.time).getTime();
      return timeB - timeA;
    });
  } else if (sortBy.value === 'oldest') {
    filtered.sort((a, b) => {
      const timeA = new Date(a.time).getTime();
      const timeB = new Date(b.time).getTime();
      return timeA - timeB;
    });
  } else if (sortBy.value === 'priority') {
    const priorityOrder = { 'priority': 0, 'meeting': 1, 'info': 2, 'success': 3, 'default': 4 };
    filtered.sort((a, b) => priorityOrder[a.type] - priorityOrder[b.type]);
  }

  return filtered;
});

// Queues for admin: accounts verification and job approvals
const verificationAlerts = computed(() => {
  return notifications.value.filter((n) => {
    const t = `${n.title} ${n.description}`.toLowerCase();
    return t.includes('agent') || t.includes('client') || t.includes('verify') || t.includes('verification');
  });
});

const jobApprovalAlerts = computed(() => {
  return notifications.value.filter((n) => {
    const t = `${n.title} ${n.description}`.toLowerCase();
    return t.includes('job') || t.includes('approval') || t.includes('pending');
  });
});

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true;
  });
};

const removeNotification = (id: string) => {
  const index = notifications.value.findIndex(n => n.id === id);
  if (index > -1) {
    notifications.value.splice(index, 1);
  }
};

const handleNotificationAction = (notificationId: string, action: string) => {
  const notification = notifications.value.find(n => n.id === notificationId);
  if (notification) {
    console.log(`Action "${action}" clicked for notification:`, notification.title);
    
    // Handle specific actions
    if (action === 'Review' || action === 'Approve') {
      // Navigate to job approval page
      // In a real app, this would navigate to the specific job
      console.log('Navigating to job approval page...');
    } else if (action === 'Verify') {
      // Navigate to agent verification
      console.log('Navigating to agent verification...');
    }
    
    // Mark as read when action is taken
    notification.read = true;
  }
};

// Update filter counts
const updateFilterCounts = () => {
  const allCount = notifications.value.length;
  const priorityCount = notifications.value.filter(n => n.type === 'priority').length;
  const unreadCount = notifications.value.filter(n => !n.read).length;
  const systemCount = notifications.value.filter(n => n.type === 'info' || n.type === 'success').length;

  filters.value = [
    { id: 'all', name: 'All', count: allCount },
    { id: 'priority', name: 'Priority', count: priorityCount },
    { id: 'unread', name: 'Unread', count: unreadCount },
    { id: 'system', name: 'System', count: systemCount }
  ];
};

// Initialize
onMounted(() => {
  fetchNotifications()
})

watch([notifications, activeFilter, sortBy], () => {
  updateFilterCounts()
})

const router = useRouter();

const goToJobApproval = () => {
  router.push('/admin/user-management');
};

const goToUserApprovals = () => {
  router.push('/admin/user-approvals');
};
</script>

<style scoped>
/* Scoped styles can be added here */
</style>

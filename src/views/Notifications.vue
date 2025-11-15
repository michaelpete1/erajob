<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-800">Notifications</h1>
        <div class="text-sm text-gray-600">Role-aware</div>
      </div>

      <NotificationFilters
        :filters="filters"
        :initial-filter="activeFilter"
        :initial-sort="sortBy"
        @filter-change="handleFilterChange"
        @sort-change="handleSortChange"
        @search="handleSearch"
      />

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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import NotificationFilters from '../components/NotificationFilters.vue'
import NotificationList from '../components/NotificationList.vue'
import { useAlerts } from '../composables/useAlerts'

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
} = useAlerts()

const activeFilter = ref('all')
const sortBy = ref('newest')
const searchQuery = ref('')

const filters = ref([
  { id: 'all', name: 'All', count: 0 },
  { id: 'priority', name: 'Priority', count: 0 },
  { id: 'unread', name: 'Unread', count: 0 },
  { id: 'meeting', name: 'Meetings', count: 0 },
  { id: 'worklog', name: 'Worklogs', count: 0 },
  { id: 'info', name: 'Info', count: 0 }
])

const filteredAlerts = computed(() => {
  if (!alerts.value) return []
  let filtered = [...alerts.value]
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(a =>
      (a.alert_title || '').toLowerCase().includes(q) ||
      (a.alert_description || '').toLowerCase().includes(q) ||
      (a.alert_type || '').toLowerCase().includes(q)
    )
  }
  if (activeFilter.value !== 'all') {
    if (activeFilter.value === 'unread') {
      filtered = filtered.filter(a => !(a as any).is_read)
    } else if (activeFilter.value === 'priority') {
      filtered = filtered.filter(a => (a.priority === 'high' || a.priority === 'very_high'))
    } else {
      filtered = filtered.filter(a => (a.alert_type || '').toLowerCase() === activeFilter.value)
    }
  }
  if (sortBy.value === 'newest') {
    filtered.sort((a, b) => (b.date_created || 0) - (a.date_created || 0))
  } else if (sortBy.value === 'oldest') {
    filtered.sort((a, b) => (a.date_created || 0) - (b.date_created || 0))
  }
  return filtered
})

const updateFilterCounts = () => {
  const all = alerts.value?.length || 0
  const priority = alerts.value?.filter(a => (a.priority === 'high' || a.priority === 'very_high')).length || 0
  const unread = alerts.value?.filter(a => !(a as any).is_read).length || 0
  const meetings = alerts.value?.filter(a => (a.alert_type || '').toLowerCase() === 'meeting').length || 0
  const worklogs = alerts.value?.filter(a => (a.alert_type || '').toLowerCase() === 'worklog').length || 0
  const info = alerts.value?.filter(a => (a.alert_type || '').toLowerCase() === 'info' || (a.alert_type || '').toLowerCase() === 'success').length || 0
  filters.value = [
    { id: 'all', name: 'All', count: all },
    { id: 'priority', name: 'Priority', count: priority },
    { id: 'unread', name: 'Unread', count: unread },
    { id: 'meeting', name: 'Meetings', count: meetings },
    { id: 'worklog', name: 'Worklogs', count: worklogs },
    { id: 'info', name: 'Info', count: info }
  ]
}

const handleFilterChange = (f: string) => { activeFilter.value = f }
const handleSortChange = (s: string) => { sortBy.value = s }
const handleSearch = (q: string) => { searchQuery.value = q }
const handleMarkAsRead = async (id: string) => { await markAsRead(id); updateFilterCounts() }
const handleDelete = async (id: string) => { await deleteAlert(id); updateFilterCounts() }
const handleAction = async (id: string, a: string) => { await handleAlertAction(id, a) }
const handleRetry = async () => { await getAlerts(); updateFilterCounts() }
const handleLoadMore = () => {}

onMounted(async () => {
  try {
    const router = useRouter()
    const storedRole = typeof window !== 'undefined' ? (localStorage.getItem('userRole') || '').toLowerCase() : ''
    const pathRole = typeof window !== 'undefined' ? (window.location.pathname.split('/')[1] || '').toLowerCase() : ''
    const role = (storedRole === 'client' || storedRole === 'agent' || storedRole === 'admin')
      ? storedRole
      : (pathRole === 'client' || pathRole === 'agent' || pathRole === 'admin' ? pathRole : '')
    if (role === 'client' && !window.location.pathname.startsWith('/client/notifications')) {
      router.replace('/client/notifications')
      return
    }
    if (role === 'agent' && !window.location.pathname.startsWith('/agent/notifications')) {
      router.replace('/agent/notifications')
      return
    }
  } catch (_) {}
  await getAlerts()
  updateFilterCounts()
})

watch([alerts, activeFilter, sortBy], () => { updateFilterCounts() })
</script>

<style scoped>
</style>

<template>
  <div class="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">User Approval Queue</h1>
    <p class="text-sm text-gray-600 mb-3">Review and approve new agents and clients.</p>
    <div class="mb-6 text-xs sm:text-sm text-gray-500 bg-teal-50 border border-teal-100 rounded-md px-3 py-2">
      Rejected accounts are scheduled for automatic cleanup on the backend, so no manual deletion is required.
    </div>
    
    <div v-if="isLoading" class="text-center p-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-teal mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading pending users...</p>
    </div>
    
    <div v-else-if="fetchError" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">
            {{ fetchError }}
          </p>
        </div>
      </div>
    </div>

    <div v-else-if="users.length === 0" class="bg-white p-8 rounded-xl shadow-sm text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">All caught up!</h3>
      <p class="mt-1 text-sm text-gray-500">No users currently require approval.</p>
    </div>
    
    <div v-else class="space-y-4">
      <div 
        v-for="user in users" 
        :key="user.id"
        class="bg-white overflow-hidden shadow rounded-lg"
      >
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              {{ user.name }}
              <span 
                :class="{
                  'bg-teal-100 text-teal-800': user.role === 'agent',
                  'bg-purple-100 text-purple-800': user.role === 'client'
                }"
                class="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                {{ user.role }}
              </span>
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              Submitted: {{ formatDate(user.createdAt) }}
            </p>
          </div>
          <div class="flex space-x-2">
            <button
              @click="approveUser(user.id)"
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-brand-teal hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Approve
            </button>
            <button
              @click="rejectUser(user.id)"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import { api } from '../../services/apiService'

interface User {
  id: string
  name: string
  email: string
  role: 'agent' | 'client'
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

const users = ref<User[]>([])
const isLoading = ref(true)
const fetchError = ref<string | null>(null)

const APPROVED_USERS_STORAGE_KEY = 'adminApprovedUserIds'
const REJECTED_USERS_STORAGE_KEY = 'adminRejectedUserIds'

const loadIdSet = (key: string): Set<string> => {
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return new Set()
    const parsed = JSON.parse(stored)
    if (Array.isArray(parsed)) return new Set(parsed.map((id: unknown) => String(id)))
    return new Set()
  } catch (error) {
    console.warn(`Failed to load persisted ids for ${key}:`, error)
    return new Set()
  }
}

const approvedUserIds = ref<Set<string>>(loadIdSet(APPROVED_USERS_STORAGE_KEY))
const rejectedUserIds = ref<Set<string>>(loadIdSet(REJECTED_USERS_STORAGE_KEY))

const persistIdSet = (key: string, idSet: Set<string>) => {
  try {
    localStorage.setItem(key, JSON.stringify(Array.from(idSet)))
  } catch (error) {
    console.warn(`Failed to persist ids for ${key}:`, error)
  }
}

const determineRole = (user: any): 'agent' | 'client' => {
  if (!user) return 'client'

  const normalise = (value: unknown): 'agent' | 'client' | null => {
    if (typeof value !== 'string') return null
    const lower = value.toLowerCase()
    if (lower.includes('agent')) return 'agent'
    if (lower.includes('client')) return 'client'
    return null
  }

  const roleFromObject = (role: any): 'agent' | 'client' | null => {
    if (!role || typeof role !== 'object') return null
    if (role.agent) return 'agent'
    if (role.client) return 'client'
    return null
  }

  return (
    roleFromObject(user.role) ||
    normalise(user.role) ||
    normalise(user.signup_role) ||
    normalise(user.requested_role) ||
    normalise(user.desired_role) ||
    'client'
  )
}

const fetchUsers = async () => {
  isLoading.value = true
  fetchError.value = null
  try {
    const resp = await api.user.listUsers(0, 50)
    if (resp.success && Array.isArray(resp.data)) {
      // Map server users to local UI model, skipping admin accounts
      const mappedUsers: User[] = resp.data
        .filter((u: any) => !u.is_admin)
        .map((u: any) => ({
          id: u.id || u.user_id || String(u._id || ''),
          name: u.full_name || u.name || u.email || 'Unknown',
          email: u.email || '',
          role: determineRole(u),
          status: u.status || 'pending',
          createdAt: u.created_at || (u.date_created ? new Date(u.date_created * 1000).toISOString() : new Date().toISOString())
        }))
      users.value = mappedUsers.filter(user => {
        const id = String(user.id)
        return !approvedUserIds.value.has(id) && !rejectedUserIds.value.has(id)
      })
    } else {
      fetchError.value = resp.error || 'Failed to load users.'
    }
  } catch (error: any) {
    console.error('Error fetching users:', error)
    fetchError.value = error?.message || 'Failed to load users. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

const approveUser = async (userId: string) => {
  try {
    const resp = await api.user.approveUser(userId)
    if (resp.success) {
      const id = String(userId)
      approvedUserIds.value.add(id)
      rejectedUserIds.value.delete(id)
      persistIdSet(APPROVED_USERS_STORAGE_KEY, approvedUserIds.value)
      persistIdSet(REJECTED_USERS_STORAGE_KEY, rejectedUserIds.value)
      users.value = users.value.filter(u => u.id !== id)
    } else {
      fetchError.value = resp.error || 'Failed to approve user. Please try again.'
    }
  } catch (error) {
    console.error('Error approving user:', error)
    fetchError.value = 'Failed to approve user. Please try again.'
  }
}

const rejectUser = async (userId: string) => {
  try {
    const resp = await api.user.rejectUser(userId)
    if (resp.success) {
      const id = String(userId)
      rejectedUserIds.value.add(id)
      approvedUserIds.value.delete(id)
      persistIdSet(REJECTED_USERS_STORAGE_KEY, rejectedUserIds.value)
      persistIdSet(APPROVED_USERS_STORAGE_KEY, approvedUserIds.value)
      users.value = users.value.filter(u => u.id !== id)
    } else {
      fetchError.value = resp.error || 'Failed to reject user. Please try again.'
    }
  } catch (error) {
    console.error('Error rejecting user:', error)
    fetchError.value = 'Failed to reject user. Please try again.'
  }
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM d, yyyy')
}

onMounted(() => {
  fetchUsers()
})
</script>
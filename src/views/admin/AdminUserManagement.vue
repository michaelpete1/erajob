<template>
  <div class="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">User Management</h1>
    <p class="text-sm text-gray-600 mb-6">View approved and rejected users.</p>

    <!-- Header for Approved Users -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-800">Approved Users ({{ approvedUsers.length }})</h2>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center p-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-teal mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading users...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="fetchError" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ fetchError }}</p>
        </div>
      </div>
    </div>

    <!-- Approved Users List -->
    <div v-if="approvedUsers.length === 0" class="bg-white p-8 rounded-xl shadow-sm text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">No approved users</h3>
      <p class="mt-1 text-sm text-gray-500">Approved users will appear here.</p>
    </div>
    <div v-else class="space-y-4">
      <div
        v-for="user in approvedUsers"
        :key="user.id"
        class="bg-white overflow-hidden shadow rounded-lg"
      >
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900 flex items-center">
              {{ user.name }}
              <span class="ml-3 px-3 py-1.5 rounded-full text-sm font-semibold border-2 flex items-center shadow-sm bg-green-100 border-green-300 text-green-800">
                <svg class="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Approved
              </span>
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              Email: {{ user.email }} | Role: {{ determineRole(user) }} | Submitted: {{ formatDate(user.createdAt) }}
            </p>
            <p v-if="user.rejection_reason" class="mt-1 text-sm text-red-600">
              Rejection Reason: {{ user.rejection_reason }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import { getUsersList } from '../../services/adminService'

interface User {
  id: string
  name: string
  email: string
  role: 'agent' | 'client'
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  admin_approved?: boolean
  rejection_reason?: string
}

const approvedUsers = ref<User[]>([])
const rejectedUsers = ref<User[]>([])
const isLoading = ref(true)
const fetchError = ref<string | null>(null)

const determineRole = (user: any): 'agent' | 'client' => {
  if (!user) return 'client'

  const normalise = (value: unknown): 'agent' | 'client' | null => {
    if (typeof value !== 'string') return null
    const lower = value.trim().toLowerCase()
    if (!lower) return null
    if (lower.includes('agent')) return 'agent'
    if (lower.includes('client')) return 'client'
    return null
  }

  const roleFromObject = (role: unknown): 'agent' | 'client' | null => {
    if (!role || typeof role !== 'object') return null
    const record = role as Record<string, unknown>
    const agentFlag = record.agent ?? record.Agent
    const clientFlag = record.client ?? record.Client

    const isTruthful = (flag: unknown) => {
      if (flag === true) return true
      if (typeof flag === 'string') return flag.toLowerCase() === 'true'
      if (typeof flag === 'number') return flag === 1
      return false
    }

    if (isTruthful(agentFlag)) return 'agent'
    if (isTruthful(clientFlag)) return 'client'
    return null
  }

  const fromRoleObject = roleFromObject(user.role)
  if (fromRoleObject) return fromRoleObject

  const stringCandidates = [user.role, user.signup_role, user.requested_role, user.desired_role, user.user_type]
  for (const candidate of stringCandidates) {
    const normalised = normalise(candidate)
    if (normalised) return normalised
  }

  // Heuristics based on domain-specific fields
  const hasAgentSignals = [
    user.available_hours_agent_can_commit,
    user.is_agent_open_to_calls_and_video_meetings,
    user.does_agent_have_working_computer,
    user.does_agent_have_stable_internet,
    user.is_agent_comfortable_with_time_tracking_tools
  ].some(flag => flag !== undefined && flag !== null)

  if (hasAgentSignals) return 'agent'

  const hasClientSignals = [user.client_reason_for_signing_up, user.client_need_agent_work_hours_to_be].some(
    value => typeof value === 'string' && value.trim().length > 0
  )

  if (hasClientSignals) return 'client'

  return 'client'
}

const fetchUsers = async () => {
  isLoading.value = true
  fetchError.value = null
  try {
    const resp = await getUsersList(0, 1000) // Fetch more users to get all approved/rejected
    if (resp.success && resp.data && resp.data.users && Array.isArray(resp.data.users)) {
      // Map server users to local UI model, skipping admin accounts
      const mappedUsers: User[] = resp.data.users
        .filter((u: any) => !u.is_admin)
        .map((u: any) => ({
          id: u.id || u.user_id || String(u._id || ''),
          name: u.full_name || u.name || u.email || 'Unknown',
          email: u.email || '',
          role: determineRole(u),
          status: u.status || 'pending',
          createdAt: u.created_at || (u.date_created ? new Date(u.date_created * 1000).toISOString() : new Date().toISOString()),
          admin_approved: u.admin_approved,
          rejection_reason: u.rejection_reason
        }))

      approvedUsers.value = mappedUsers.filter(user => user.admin_approved === true)
      rejectedUsers.value = mappedUsers.filter(user => user.admin_approved === false)
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

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM d, yyyy')
}

onMounted(() => {
  fetchUsers()
})
</script>

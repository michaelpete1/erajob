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
    
    <!-- Rejection Reason Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeRejectModal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Reject User</h3>
          <p class="text-sm text-gray-600 mb-4">Please provide a reason for rejecting this user:</p>
          <textarea
            v-model="rejectionReason"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-teal focus:border-brand-teal resize-none"
            rows="4"
            placeholder="Enter rejection reason..."
          ></textarea>
          <div class="flex justify-end space-x-3 mt-4">
            <button
              @click="closeRejectModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              @click="submitReject"
              :disabled="!rejectionReason.trim()"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed"
            >
              Reject User
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="user in users"
        :key="user.id"
        class="bg-white overflow-hidden shadow rounded-lg"
      >
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900 flex items-center">
              {{ user.name }}
              <span
                :class="{
                  'bg-teal-100 border-teal-300 text-teal-800': user.role === 'agent',
                  'bg-purple-100 border-purple-300 text-purple-800': user.role === 'client'
                }"
                class="ml-3 px-3 py-1.5 rounded-full text-sm font-semibold border-2 flex items-center shadow-sm"
              >
                <svg v-if="user.role === 'agent'" class="w-4 h-4 mr-2 text-teal-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <svg v-else-if="user.role === 'client'" class="w-4 h-4 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
                {{ user.role === 'agent' ? 'Agent' : 'Client' }}
              </span>
            </h3>
            <!-- User approval status badge below the name/role -->
            <div class="mt-1">
              <span v-if="user.admin_approved === true" class="inline-flex items-center gap-1 px-2 py-1 rounded-full border bg-green-100 text-green-700 border-green-200 text-xs font-semibold">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Approved
              </span>
              <span v-else-if="user.admin_approved === false && user.rejection_reason" class="inline-flex items-center gap-1 px-2 py-1 rounded-full border bg-red-100 text-red-700 border-red-200 text-xs font-semibold">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg> Rejected
                <span class="ml-1 text-xs text-red-500 font-normal">({{ user.rejection_reason }})</span>
              </span>
              <span v-else-if="user.admin_approved === null || user.admin_approved === undefined" class="inline-flex items-center gap-1 px-2 py-1 rounded-full border bg-yellow-100 text-yellow-700 border-yellow-200 text-xs font-semibold">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Pending
              </span>
            </div>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              Submitted: {{ formatDate(user.createdAt) }}
            </p>
          </div>
          <div v-if="user.admin_approved === null || user.admin_approved === undefined" class="flex space-x-2">
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
  admin_approved?: boolean
  rejection_reason?: string
}

const users = ref<User[]>([])
const isLoading = ref(true)
const fetchError = ref<string | null>(null)
const APPROVED_USERS_STORAGE_KEY = 'adminApprovedUserIds'
const REJECTED_USERS_STORAGE_KEY = 'adminRejectedUserIds'
const showRejectModal = ref(false)
const rejectionReason = ref('')
const userToReject = ref<string | null>(null)

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
          createdAt: u.created_at || (u.date_created ? new Date(u.date_created * 1000).toISOString() : new Date().toISOString()),
          admin_approved: u.admin_approved, // Assuming admin_approved is returned by the API
          rejection_reason: u.rejection_reason // Assuming rejection_reason is returned by the API
        }))
      users.value = mappedUsers.filter(user => {
        // Only hide users who are approved (admin_approved === true)
        // Keep pending (null/undefined) and rejected (false with reason) users visible
        return user.admin_approved !== true
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
      // Don't filter out approved users - keep them visible with approved status
      // Refresh the users list to show updated status
      await fetchUsers()
    } else {
      fetchError.value = resp.error || 'Failed to approve user. Please try again.'
    }
  } catch (error) {
    console.error('Error approving user:', error)
    fetchError.value = 'Failed to approve user. Please try again.'
  }
}

const rejectUser = (userId: string) => {
  userToReject.value = userId
  rejectionReason.value = ''
  showRejectModal.value = true
}

const closeRejectModal = () => {
  showRejectModal.value = false
  userToReject.value = null
  rejectionReason.value = ''
}

const submitReject = async () => {
  if (!userToReject.value || !rejectionReason.value.trim()) {
    return
  }

  try {
    const resp = await api.user.rejectUser(userToReject.value, rejectionReason.value.trim())
    if (resp.success) {
      const id = String(userToReject.value)
      rejectedUserIds.value.add(id)
      approvedUserIds.value.delete(id)
      persistIdSet(REJECTED_USERS_STORAGE_KEY, rejectedUserIds.value)
      persistIdSet(APPROVED_USERS_STORAGE_KEY, approvedUserIds.value)
      // Don't filter out rejected users - keep them visible with rejected status
      closeRejectModal()
      // Refresh the users list to show updated status
      await fetchUsers()
    } else {
      fetchError.value = resp.error || 'Failed to reject user. Please try again.'
      closeRejectModal()
    }
  } catch (error) {
    console.error('Error rejecting user:', error)
    fetchError.value = 'Failed to reject user. Please try again.'
    closeRejectModal()
  }
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM d, yyyy')
}

onMounted(() => {
  fetchUsers()
})
</script>
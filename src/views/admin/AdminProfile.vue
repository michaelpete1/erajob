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
          <button @click="goBack" aria-label="Back" class="p-1.5 sm:p-2 text-white/95 hover:text-white rounded-md hover:bg-white/10 transition-colors">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-sm sm:text-base font-semibold">Admin Profile</h1>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/90" />
        </div>
      </header>

      <div class="mt-2 mb-4 sm:mb-6 flex items-center justify-between">
        <div class="flex items-center text-sm sm:text-base text-white/90">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Admin Profile
        </div>
        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white/90 cursor-pointer hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      </div>

      <div class="space-y-4 sm:space-y-6 animate-fade-in">
        <!-- Profile Card -->
        <div class="bg-white/95 backdrop-blur-sm p-5 sm:p-6 rounded-xl shadow-lg">
          <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
              {{ initials }}
            </div>
            <div class="text-center sm:text-left flex-1">
              <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{{ adminName || 'Admin User' }}</h2>
              <p class="text-sm sm:text-base text-gray-600 mb-2">{{ adminEmail || 'admin@erajob.com' }}</p>
              <div class="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-teal-100 text-teal-800">
                <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                </svg>
                Administrator
              </div>
            </div>
          </div>

          <!-- Profile Information -->
          <div class="space-y-4">
            <div class="border-t border-gray-200 pt-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Account Information</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <p class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{{ adminName || 'Admin User' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <p class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{{ adminEmail || 'admin@erajob.com' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <p class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">Administrator</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                  <p class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{{ memberSince }}</p>
                </div>
              </div>
            </div>

            <!-- Admin Statistics -->
            <div class="border-t border-gray-200 pt-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Admin Statistics</h3>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div class="text-center p-3 bg-blue-50 rounded-lg">
                  <div class="text-2xl font-bold text-blue-600">{{ stats.total }}</div>
                  <div class="text-xs text-blue-600">Total Jobs</div>
                </div>
                <div class="text-center p-3 bg-green-50 rounded-lg">
                  <div class="text-2xl font-bold text-green-600">{{ stats.approved }}</div>
                  <div class="text-xs text-green-600">Approved</div>
                </div>
                <div class="text-center p-3 bg-yellow-50 rounded-lg">
                  <div class="text-2xl font-bold text-yellow-600">{{ stats.pending }}</div>
                  <div class="text-xs text-yellow-600">Pending</div>
                </div>
                <div class="text-center p-3 bg-red-50 rounded-lg">
                  <div class="text-2xl font-bold text-red-600">{{ stats.rejected }}</div>
                  <div class="text-xs text-red-600">Rejected</div>
                </div>
              </div>
            </div>

            <!-- Approved Users -->
            <div class="border-t border-gray-200 pt-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Approved Users</h3>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div class="text-center p-3 bg-teal-50 rounded-lg">
                  <div class="text-2xl font-bold text-teal-600">{{ approvedCounts.total }}</div>
                  <div class="text-xs text-teal-600">Total Approved</div>
                </div>
                <div class="text-center p-3 bg-emerald-50 rounded-lg">
                  <div class="text-2xl font-bold text-emerald-600">{{ approvedCounts.clients }}</div>
                  <div class="text-xs text-emerald-600">Clients</div>
                </div>
                <div class="text-center p-3 bg-indigo-50 rounded-lg">
                  <div class="text-2xl font-bold text-indigo-600">{{ approvedCounts.agents }}</div>
                  <div class="text-xs text-indigo-600">Agents</div>
                </div>
                <div class="text-center p-3 bg-gray-50 rounded-lg">
                  <div class="text-2xl font-bold text-gray-700">{{ approvedUsers.length }}</div>
                  <div class="text-xs text-gray-600">Loaded</div>
                </div>
              </div>

              <div v-if="approvedLoading" class="text-sm text-gray-600">Loading approved users...</div>
              <div v-else>
                <div v-if="approvedUsers.length === 0" class="text-sm text-gray-600">No approved users yet.</div>
                <ul v-else class="divide-y divide-gray-200 bg-white/95 backdrop-blur-sm rounded-xl border border-gray-100 max-h-80 overflow-y-auto">
                  <li v-for="u in approvedUsers" :key="u.id" class="p-3 sm:p-4 flex items-center justify-between">
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-semibold">
                        {{ computeInitials(u.full_name || u.name || u.email || '') }}
                      </div>
                      <div class="min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">{{ u.full_name || u.name || u.email }}</p>
                        <p class="text-xs text-gray-600 truncate">{{ u.email }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="roleBadgeClass(u)">{{ primaryRole(u) }}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Approved Jobs -->
            <div class="border-t border-gray-200 pt-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Approved Jobs</h3>
              <div v-if="jobsLoading" class="text-sm text-gray-600">Loading approved jobs...</div>
              <div v-else-if="jobsError" class="text-sm text-red-600">{{ jobsError }}</div>
              <div v-else>
                <div v-if="approvedJobs.length === 0" class="text-sm text-gray-600">No approved jobs yet.</div>
                <div v-else class="bg-white/95 backdrop-blur-sm rounded-xl border border-gray-100">
                  <div class="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <span>Project</span>
                    <span>Category</span>
                    <span>Budget</span>
                    <span>Approved On</span>
                  </div>
                  <ul class="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                    <li
                      v-for="job in approvedJobs"
                      :key="job.id"
                      class="flex flex-col sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr] gap-2 px-4 py-3"
                    >
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ job.project_title || job.title || 'Untitled Project' }}</p>
                        <p class="text-xs text-gray-500">{{ job.client_name || job.client || 'Client not specified' }}</p>
                      </div>
                      <div class="text-sm text-gray-700">{{ job.category || 'Other' }}</div>
                      <div class="text-sm font-semibold text-teal-600">{{ formatCurrency(job.budget) }}</div>
                      <div class="text-sm text-gray-700">{{ formatDate(job.last_updated || job.date_created || job.created_at) }}</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="border-t border-gray-200 pt-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div class="flex flex-col sm:flex-row gap-3">
                <button @click="$router.push('/admin/job-approval')" class="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-md transition-colors min-h-[44px] touch-manipulation">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2h2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6"></path>
                  </svg>
                  View Job Offers
                </button>
                <button @click="$router.push('/admin/notifications')" class="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-sm font-medium rounded-md transition-colors min-h-[44px] touch-manipulation">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-2.81a6.002 6.002 0 00-1.238-3.037l-.95-.95a2.5 2.5 0 01-3.536 0L10 11.414l-1.414 1.414a2.5 2.5 0 01-3.536 0L3 11.414V17h12zm-4-9a1 1 0 100-2 1 1 0 000 2z"></path>
                  </svg>
                  View Notifications
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../../services/apiService'

const router = useRouter()

const adminName = ref<string>('')
const adminEmail = ref<string>('')
const initials = ref<string>('A')
const memberSince = ref<string>('')
const stats = ref<{ total: number; approved: number; pending: number; rejected: number }>({ total: 0, approved: 0, pending: 0, rejected: 0 })

const approvedUsers = ref<any[]>([])
const approvedCounts = ref<{ total: number; clients: number; agents: number }>({ total: 0, clients: 0, agents: 0 })
const approvedLoading = ref(false)

const approvedJobs = ref<any[]>([])
const jobsLoading = ref(false)
const jobsError = ref<string | null>(null)

const goBack = () => {
  router.push('/admin/job-approval')
}

const computeInitials = (name: string) => {
  if (!name) return 'A'
  const parts = name.trim().split(/\s+/)
  return parts.slice(0, 2).map(p => p[0]?.toUpperCase() || '').join('') || 'A'
}

const loadAdmin = async () => {
  try {
    const resp = await api.admin.getCurrentUser()
    if ((resp as any).success !== false && (resp as any).data) {
      const u: any = (resp as any).data
      // Support top-level or nested .data
      const user = (u?.data) ? u.data : u
      adminName.value = user?.full_name || user?.name || 'Admin User'
      adminEmail.value = user?.email || 'admin@erajob.com'
      initials.value = computeInitials(adminName.value)
      const createdAt = user?.created_at || (user?.date_created ? new Date(user.date_created * 1000).toISOString() : null)
      memberSince.value = createdAt ? new Date(createdAt).toLocaleDateString() : '—'
    }
  } catch {}
}

const loadStats = async () => {
  jobsLoading.value = true
  jobsError.value = null
  try {
    const resp = await api.jobs.listAdminJobs(0, 200)
    if (resp.success && Array.isArray(resp.data)) {
      const jobs: any[] = resp.data
      const approvedList = jobs.filter(job => job.admin_approved === true || job.status === 'approved')
      const rejectedList = jobs.filter(job => job.admin_approved === false || job.status === 'rejected')
      const total = jobs.length
      const approved = approvedList.length
      const rejected = rejectedList.length
      const pending = Math.max(0, total - approved - rejected)

      stats.value = { total, approved, pending, rejected }
      approvedJobs.value = approvedList
    } else {
      jobsError.value = resp.error || 'Failed to fetch jobs'
      approvedJobs.value = []
    }
  } catch (error: any) {
    jobsError.value = error?.message || 'Failed to fetch jobs'
    approvedJobs.value = []
  } finally {
    jobsLoading.value = false
  }
}

const primaryRole = (u: any) => {
  const roles = u?.role ? Object.values(u.role) : []
  if (roles.includes('admin')) return 'admin'
  if (roles.includes('agent')) return 'agent'
  if (roles.includes('client')) return 'client'
  return 'user'
}

const roleBadgeClass = (u: any) => {
  const r = primaryRole(u)
  if (r === 'client') return 'bg-purple-100 text-purple-700'
  if (r === 'agent') return 'bg-blue-100 text-blue-700'
  if (r === 'admin') return 'bg-gray-100 text-gray-700'
  return 'bg-gray-100 text-gray-700'
}

const formatDate = (timestamp: any): string => {
  if (!timestamp) return '—'

  if (typeof timestamp === 'number') {
    const ms = timestamp > 1e12 ? timestamp : timestamp * 1000
    return new Date(ms).toLocaleDateString()
  }

  if (typeof timestamp === 'string') {
    const parsed = Date.parse(timestamp)
    if (!Number.isNaN(parsed)) {
      return new Date(parsed).toLocaleDateString()
    }
  }

  return '—'
}

const formatCurrency = (value: unknown): string => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  }

  if (typeof value === 'string') {
    const numeric = Number.parseFloat(value)
    if (Number.isFinite(numeric)) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numeric)
    }
  }

  return '—'
}

const loadApprovedUsers = async () => {
  approvedLoading.value = true
  try {
    const resp = await api.user.listUsers(0, 200)
    if ((resp as any).success && Array.isArray((resp as any).data)) {
      const users: any[] = (resp as any).data
      const approved = users.filter(u => isAdminApprovedUser(u))
      approvedUsers.value = approved
      const clients = approved.filter(u => Object.values(u.role || {}).includes('client')).length
      const agents = approved.filter(u => Object.values(u.role || {}).includes('agent')).length
      approvedCounts.value = { total: approved.length, clients, agents }
    }
  } catch {}
  finally {
    approvedLoading.value = false
  }
}

const isAdminApprovedUser = (user: any): boolean => {
  const flags = [user?.admin_approved, user?.adminApproved, user?.is_admin_approved, user?.approved_by_admin]
  if (flags.some(value => value === true || value === 1 || (typeof value === 'string' && ['true', 'yes', '1'].includes(value.trim().toLowerCase())))) {
    return true
  }
  const status = typeof user?.status === 'string' ? user.status.trim().toLowerCase() : ''
  if (['approved', 'active'].includes(status)) {
    return true
  }
  const profileStatus = typeof user?.profile_status === 'string' ? user.profile_status.trim().toLowerCase() : ''
  if (['approved', 'active'].includes(profileStatus)) {
    return true
  }
  return false
}

onMounted(async () => {
  await Promise.all([loadAdmin(), loadStats(), loadApprovedUsers()])
})

</script>

<style scoped>
/* Scoped styles can be added here */
</style>

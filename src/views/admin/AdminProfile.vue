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
          <button
            type="button"
            class="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
            @click="logout"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7h3m0 0v10m0-10l-3 3m3-3l-3-3M9 5h3m-3 14h3m-6-7h9" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div class="mt-2 mb-4 sm:mb-6 flex items-center justify-between">
        <div class="flex items-center text-sm sm:text-base text-white/90">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Admin Profile
        </div>
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



            <!-- Quick Actions -->
            <div class="border-t border-gray-200 pt-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button @click="$router.push('/admin/user-approvals')" class="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors min-h-[44px] touch-manipulation">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  User Approvals
                </button>
                <button @click="$router.push('/admin/user-management')" class="inline-flex items-center justify-center px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors min-h-[44px] touch-manipulation">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  User Management
                </button>
                <button @click="$router.push('/admin/alerts')" class="inline-flex items-center justify-center px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-sm font-medium rounded-md transition-colors min-h-[44px] touch-manipulation">
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
import authService from '../../services/authService'

const router = useRouter()

const adminName = ref<string>('')
const adminEmail = ref<string>('')
const initials = ref<string>('A')
const memberSince = ref<string>('')
const approvedUsers = ref<any[]>([])
const approvedCounts = ref<{ total: number; clients: number; agents: number }>({ total: 0, clients: 0, agents: 0 })
const approvedLoading = ref(false)

const goBack = () => {
  router.push('/admin/user-management')
}

const logout = () => {
  authService.logout()
  router.push('/admin/sign-in')
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
  await Promise.all([loadAdmin(), loadApprovedUsers()])
})

</script>

<style scoped>
/* Scoped styles can be added here */
</style>

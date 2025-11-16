<template>
  <div class="min-h-screen bg-gray-50 pb-20 sm:pb-24">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 sticky top-0 z-30">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <div class="flex items-center gap-1.5 sm:gap-2 md:gap-3">
          <button @click="$router.back()" class="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-base sm:text-lg md:text-xl font-semibold text-gray-800 truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">Recommended Agents</h1>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <button class="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6h.01M12 12h.01M12 18h.01" />
            </svg>
          </button>
          <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-teal-500"></div>
        </div>
      </div>
    </div>

    <div class="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 max-w-4xl mx-auto">
      <!-- Search and Filter Section -->
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-sm mb-4 sm:mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          <div class="relative flex-1">
            <input
              v-model.trim="searchQuery"
              type="text"
              placeholder="Search agents by name, skill, or location..."
              class="w-full px-3 sm:px-4 py-2 sm:py-3 pl-9 sm:pl-10 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
              @keyup.enter="performSearch"
            >
            <svg class="absolute left-3 sm:left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-teal-600 border border-teal-200 rounded-lg hover:bg-teal-50 transition-colors"
              @click="performSearch"
              :disabled="loading"
            >
              Search
            </button>
            <button
              class="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              @click="resetFilters"
              :disabled="loading && searchQuery === ''"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-700 font-medium">{{ error }}</p>
        </div>
      </div>

      <!-- Agents Grid -->
      <div v-else class="space-y-4 sm:space-y-6">
        <div v-if="filteredAgents.length > 0">
          <div
            v-for="agent in filteredAgents"
            :key="agent.id"
            class="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-teal-300 relative overflow-hidden"
            @click="goToAgent(agent)"
          >
            <!-- Agent card content -->
            <div class="relative z-10">
              <div class="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                <!-- Agent Avatar -->
                <div class="flex-shrink-0">
                  <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg ring-4 ring-white ring-offset-2 ring-offset-teal-50 group-hover:scale-105 transition-transform duration-300">
                    {{ agent.name.charAt(0) }}
                  </div>
                </div>

                <!-- Agent Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div>
                      <h4 class="font-bold text-gray-800 text-lg sm:text-xl group-hover:text-teal-600 transition-colors">{{ agent.name }}</h4>
                      <p class="text-sm sm:text-base text-gray-600 font-medium">{{ agent.title }}</p>
                    </div>
                    
                  </div>

                  <!-- Stats and Info -->
                  <div class="flex flex-wrap gap-2 sm:gap-3 mb-3">
                    <div class="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full">
                      <span class="text-xs sm:text-sm text-gray-500">📍</span>
                      <span class="text-sm text-gray-700 font-medium">{{ agent.location }}</span>
                    </div>
                    <div
                      v-if="agent.completion_rate !== undefined"
                      class="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full"
                    >
                      <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="font-semibold text-sm text-green-700">{{ agent.completion_rate }}%</span>
                    </div>
                    <div v-if="agent.company_name" class="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full">
                      <span class="text-xs sm:text-sm text-gray-500">💼</span>
                      <span class="text-sm text-gray-700 font-medium">{{ agent.company_name }}</span>
                    </div>
                  </div>

                  <!-- Skills Preview -->
                  <div class="mb-3">
                    <p class="text-xs sm:text-sm text-gray-500 mb-2">Top Skills:</p>
                    <div class="flex flex-wrap gap-1 sm:gap-2">
                      <span
                        v-for="skill in (agent.skills || []).slice(0, 4)"
                        :key="skill"
                        class="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full"
                      >
                        {{ skill }}
                      </span>
                    </div>
                  </div>

                  <!-- Enhanced Stats Grid -->
                  <div class="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-100">
                    <div class="text-center">
                      <p class="text-lg sm:text-xl font-bold text-gray-800">{{ agent.completed_jobs ?? 0 }}</p>
                      <p class="text-xs sm:text-sm text-gray-500">Jobs Done</p>
                    </div>
                    <div class="text-center">
                      <p class="text-lg sm:text-xl font-bold text-gray-800">{{ agent.reviews_count ?? 0 }}</p>
                      <p class="text-xs sm:text-sm text-gray-500">Reviews</p>
                    </div>
                  </div>

                  <!-- Availability Info -->
                  <div class="flex items-center justify-between mt-3">
                    <div class="flex items-center gap-2">
                      <span class="text-xs sm:text-sm text-gray-500">{{ agent.availability_type || 'Availability N/A' }}</span>
                    </div>
                    <div class="text-right">
                      <span :class="agent.status === 'available' ? 'text-green-600' : 'text-blue-600'" class="font-semibold text-xs sm:text-sm block">
                        {{ agent.status ? agent.status.charAt(0).toUpperCase() + agent.status.slice(1) : 'Status N/A' }}
                      </span>
                      <p class="font-bold text-sm sm:text-base text-gray-800" v-if="agent.rate_per_hour">
                        ${{ agent.rate_per_hour }}/hr
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 mt-3">
                    <button
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="!agent.id"
                      :title="!agent.id ? 'Agent has no identifier' : 'Create Meeting'"
                      @click.stop="openCreateMeeting(agent)"
                    >
                      Create Meeting
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No agents found -->
        <div v-else class="text-center py-12 sm:py-16">
          <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gray-200 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">No agents found</h3>
          <p class="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
            {{ searchQuery ? 'Try adjusting your search terms.' : 'No recommended agents available at the moment.' }}
          </p>
        </div>

        <!-- Load More -->
        <div class="text-center mt-8 sm:mt-12" v-if="hasMore && !loading && !searchQuery">
          <button
            class="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white hover:bg-gray-50 text-teal-600 font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl transition-colors border border-teal-200 hover:border-teal-300"
            @click="loadMore"
          >
            <span>Load More Agents</span>
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Create Meeting Modal -->
  <div v-if="meetingModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-white rounded-xl shadow-lg w-full max-w-md p-5">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Create Meeting</h3>
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">job_id</label>
          <input v-model="meetingModalJobId" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" readonly>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">agent_id</label>
          <input v-model="meetingModalAgentId" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" readonly>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input v-model="meetingModalDate" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input v-model="meetingModalTime" type="time" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
          </div>
        </div>
      </div>
      <div class="flex items-center justify-end gap-2 mt-5">
        <button class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50" @click="closeMeetingModal">Cancel</button>
        <button class="px-4 py-2 rounded-md text-sm font-medium text-white bg-teal-600 hover:bg-teal-700" @click="confirmCreateMeeting">Create Meeting</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAgents } from '@/composables/useAgents'
import type { AgentOut } from '@/types/api'
import { agentsService } from '@/services/agentsService'
import { useToast } from 'vue-toastification'
import jobs from '@/services/jobs'
import { apiClient } from '@/services/apiService'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const {
  agents,
  loading,
  error,
  hasMore,
  getRecommendedAgents,
  getAgentsByCategory,
  clearError
} = useAgents()

const searchQuery = ref('')
const pagination = ref({ start: 0, stop: 10 })
const jobId = ref('')

const normalizeAgentName = (agent: AgentOut) => agent.full_name || agent.id || 'Agent'
interface NormalizedAgent {
  id: string
  name: string
  title: string
  company_name: string
  location: string
  status: string
  rate_per_hour?: string | number | null
  rating: number
  completion_rate?: number
  skills: string[]
  completed_jobs: number
  response_time: string
  years_experience: string
  reviews_count: number
  availability_type: string
  email?: string
}

const normalizedAgents = computed<NormalizedAgent[]>(() => {
  return (agents.value || []).map(agent => ({
    id: String(
      (agent as any)?.id ??
      (agent as any)?.user_id ??
      (agent as any)?.agent_id ??
      (agent as any)?.uuid ??
      (agent as any)?._id ??
      (agent as any)?.profile_id ??
      (agent as any)?.account_id ??
      (agent as any)?.user?.id ??
      (agent as any)?.user?.uuid ??
      (agent as any)?.agent?.id ??
      (agent as any)?.agent?.uuid ??
      ''
    ),
    name: normalizeAgentName(agent),
    title: agent.bio || 'Skilled Specialist',
    company_name: agent.company_name || 'Independent Contractor',
    location: agent.time_zone || 'Remote',
    status: agent.status || 'available',
    rate_per_hour: (agent as any)?.rate_per_hour ?? null,
    rating: Number((agent as any)?.rating ?? 4.8),
    completion_rate: (agent as any)?.completion_rate,
    skills: Array.isArray(agent.skills) ? agent.skills : [],
    completed_jobs: Number((agent as any)?.completed_jobs ?? 0),
    response_time: (agent as any)?.response_time || 'Fast responder',
    years_experience: String((agent as any)?.years_experience ?? '2+'),
    reviews_count: Number((agent as any)?.reviews_count ?? 0),
    availability_type: (agent as any)?.availability?.type || 'Full-time',
    email: String((agent as any)?.email ?? (agent as any)?.user_email ?? '')
  }))
})

const filteredAgents = computed<NormalizedAgent[]>(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return normalizedAgents.value
  return normalizedAgents.value.filter(agent =>
    agent.name.toLowerCase().includes(query) ||
    agent.title.toLowerCase().includes(query) ||
    agent.location.toLowerCase().includes(query) ||
    agent.company_name.toLowerCase().includes(query) ||
    agent.skills.some(skill => skill.toLowerCase().includes(query))
  )
})

const performSearch = async () => {
  try {
    clearError()
    if (!agents.value.length) {
      pagination.value = { start: 0, stop: 10 }
      await getRecommendedAgents(pagination.value)
    }
  } catch (err) {
    console.error('Search error:', err)
  }
}

const loadMore = async () => {
  if (loading.value || !hasMore.value) return
  const nextStart = pagination.value.stop
  const nextStop = nextStart + 10
  pagination.value = { start: nextStart, stop: nextStop }
  try {
    await getRecommendedAgents(pagination.value)
  } catch (err) {
    console.error('Pagination error:', err)
  }
}

const resetFilters = async () => {
  searchQuery.value = ''
  pagination.value = { start: 0, stop: 10 }
  clearError()
  await getRecommendedAgents(pagination.value)
}

const resolveAgentId = (agent: any): string => {
  const candidates: (unknown)[] = [
    (agent as any)?.id,
    (agent as any)?.user_id,
    (agent as any)?.agent_id
  ]
  for (const c of candidates) {
    const s = typeof c === 'number' ? String(c) : typeof c === 'string' ? c : ''
    if (s && s.trim().length > 0) return s.trim()
  }
  return ''
}

const resolveAgentIdAsync = async (agent: any): Promise<string> => {
  let id = resolveAgentId(agent)
  if (id) return id
  try {
    const expired = localStorage.getItem('auth_expired') === 'true'
    const token = localStorage.getItem('access_token') || ''
    if (expired || !token) return ''
  } catch {}
  try {
    const email = String((agent as any)?.email || '')
    if (email && email.trim()) {
      const resp = await apiClient.get('/v1/users/', { params: { role: 'agent', email, start: 0, stop: 1 } })
      const data = resp?.data?.data
      const list = Array.isArray(data) ? data : data ? [data] : []
      const first = list[0] as any
      const fetchedId = typeof first?.id === 'string' ? first.id : ''
      if (fetchedId && fetchedId.trim()) return fetchedId.trim()
    }
  } catch {}
  try {
    const stored = localStorage.getItem('selectedAgent')
    if (stored) {
      const parsed = JSON.parse(stored)
      const s = resolveAgentId(parsed)
      if (s) return s
    }
  } catch {}
  return ''
}

const goToAgent = async (agent: NormalizedAgent) => {
  const id = await resolveAgentIdAsync(agent)
  if (!id) {
    alert('Missing agent identifier. Please select another agent.')
    return
  }
  try {
    const rawAgent = (agents.value || []).find(a => resolveAgentId(a) === id)
    localStorage.setItem('selectedAgent', JSON.stringify(rawAgent ?? agent))
  } catch (_) {}
  router.push(`/client/agent/${id}`)
}

const meetingSubmittingId = ref('')
const meetingModalOpen = ref(false)
const meetingModalJobId = ref('')
const meetingModalAgentId = ref('')
const meetingModalDate = ref('')
const meetingModalTime = ref('')

const getCurrentJobId = (): string => {
  const fromRef = typeof jobId.value === 'string' ? jobId.value : ''
  if (fromRef && fromRef.trim()) return fromRef.trim()
  const routeId = route.params.id
  const fromRoute = typeof routeId === 'string' ? routeId : (Array.isArray(routeId) && typeof routeId[0] === 'string' ? routeId[0] : '')
  if (fromRoute && fromRoute.trim()) return fromRoute.trim()
  const queryId = typeof route.query.id === 'string' ? route.query.id : (typeof route.query.job_id === 'string' ? route.query.job_id : '')
  if (queryId && queryId.trim()) return queryId.trim()
  try {
    const sp = localStorage.getItem('selectedProject')
    if (sp) {
      const p = JSON.parse(sp)
      const jid = typeof p?.job_id === 'string' ? p.job_id : (typeof p?.id === 'string' ? p.id : '')
      if (jid && jid.trim()) return jid.trim()
    }
  } catch {}
  try {
    const scp = localStorage.getItem('selectedClientProject')
    if (scp) {
      const p = JSON.parse(scp)
      const jid = typeof p?.id === 'string' ? p.id : ''
      if (jid && jid.trim()) return jid.trim()
    }
  } catch {}
  try {
    const sjc = localStorage.getItem('selectedJobContext')
    if (sjc) {
      const c = JSON.parse(sjc)
      const jid = typeof c?.project?.id === 'string' ? c.project.id : (typeof c?.admin_job_id === 'string' ? c.admin_job_id : (typeof c?.agent_job_id === 'string' ? c.agent_job_id : ''))
      if (jid && jid.trim()) return jid.trim()
    }
  } catch {}
  return ''
}

const openCreateMeeting = async (agent: NormalizedAgent) => {
  const agentId = (await resolveAgentIdAsync(agent)) || (agent.id || '').trim()
  const currentJobId = getCurrentJobId()
  console.log('Meeting agent:', agent)
  console.log('Resolved agentId:', agentId)
  console.log('Resolved jobId:', currentJobId)
  if (!agentId) {
    toast.error('Missing agent ID. Cannot open meeting modal.')
    return
  }
  if (!currentJobId) {
    toast.error('Missing job ID. Please select a project or ensure the URL is correct.')
    return
  }
  meetingModalAgentId.value = agentId
  meetingModalJobId.value = currentJobId
  meetingModalDate.value = ''
  meetingModalTime.value = ''
  meetingModalOpen.value = true
}

const confirmCreateMeeting = async () => {
  if (!meetingModalOpen.value) return
  const jobId = (meetingModalJobId.value || getCurrentJobId()).trim()
  const agentId = meetingModalAgentId.value.trim()
  if (!jobId || !agentId) {
    toast.error('Missing agent or job information')
    return
  }
  if (!meetingModalDate.value || !meetingModalTime.value) {
    toast.error('Select date and time')
    return
  }
  const dateTimeString = `${meetingModalDate.value}T${meetingModalTime.value}:00`
  const meetingTime = Math.floor(new Date(dateTimeString).getTime() / 1000)
  try {
    const resp = await agentsService.setAgentMeeting(jobId, agentId, meetingTime)
    if (resp.success) {
      toast.success('Meeting created successfully')
      meetingModalOpen.value = false
    } else {
      toast.error(resp.error || 'Failed to create meeting')
    }
  } catch (e: any) {
    toast.error(e?.message || 'Failed to create meeting')
  }
}

const closeMeetingModal = () => {
  meetingModalOpen.value = false
}

const chooseAgentForProposal = async (agent: NormalizedAgent) => {
  const idCandidates: (unknown)[] = [
    (agent as any)?.id,
    (agent as any)?.user_id,
    (agent as any)?.agent_id
  ]
  let id = ''
  for (const c of idCandidates) {
    if (typeof c === 'string' && c.trim().length > 0) { id = c.trim(); break }
  }
  const currentJobId = typeof route.params.id === 'string' ? route.params.id : Array.isArray(route.params.id) ? String(route.params.id[0] || '') : ''
  if (!id || !currentJobId) {
    toast.error('Missing agent or job information')
    return
  }
  try {
    const role = (localStorage.getItem('userRole') || '').toLowerCase()
    if (role === 'admin') {
      const payload: any = {
        agent: { id },
        proposal: 'Admin proposes this agent for the job',
        break_down: { Charges: 7, Tax: 10 }
      }
      const resp = await jobs.proposeJob(currentJobId, payload)
      const ok = (resp as any)?.data?.status_code === 200 || (resp as any)?.data?.status_code === 0 || typeof (resp as any)?.data === 'string'
      if (ok) {
        toast.success('Proposal sent successfully')
      } else {
        toast.error((resp as any)?.data?.detail || 'Failed to send proposal')
      }
    } else {
      const resp = await jobs.clientAcceptJobProposal(currentJobId, { client_approved: true as true, selected_agents: [id] })
      const ok = (resp as any)?.data?.status_code === 200 || (resp as any)?.data?.status_code === 0 || typeof (resp as any)?.data === 'string'
      if (ok) {
        toast.success('Agent selected successfully')
      } else {
        toast.error((resp as any)?.data?.detail || 'Failed to select agent')
      }
    }
  } catch (e: any) {
    toast.error(e?.message || 'Failed to select agent')
  }
}

onMounted(async () => {
  const token = localStorage.getItem('access_token')
  const role = (localStorage.getItem('userRole') || '').toLowerCase()
  if (!token || role !== 'client') {
    router.push({ name: 'sign-in', query: { redirect: route.fullPath } })
    return
  }
  const routeId = route.params.id
  if (typeof routeId === 'string') {
    jobId.value = routeId
  } else if (Array.isArray(routeId) && routeId.length > 0 && typeof routeId[0] === 'string') {
    jobId.value = routeId[0]
  }

  try {
    // If we have a job ID, try to get agents based on the job's category
    if (jobId.value) {
      // Prefer category from route query if provided
      let jobCategory: string | null = null
      const categoryFromQuery = typeof route.query.category === 'string' ? route.query.category : null
      if (categoryFromQuery && categoryFromQuery.trim()) {
        jobCategory = categoryFromQuery.trim()
      }
      try {
        if (!jobCategory) {
          const storedProject = localStorage.getItem('selectedProject') || localStorage.getItem('selectedClientProject')
          if (storedProject) {
            const parsed = JSON.parse(storedProject)
            if (parsed && (parsed.job_id === jobId.value || parsed.id === jobId.value)) {
              jobCategory = parsed.primary_area_of_expertise || parsed.category || null
              console.log('Found job category in localStorage:', jobCategory)
            }
          }
        }
      } catch (storageErr) {
        console.warn('Error reading from localStorage:', storageErr)
      }

      // If we have a category, get agents by that category
      if (jobCategory) {
        console.log('Fetching agents for category:', jobCategory)
        await getAgentsByCategory(jobCategory, { start: 0, stop: 10, jobId: jobId.value })
        return
      }
    }

    try {
      const { apiClient } = await import('../../services/apiService')
      const resp = await apiClient.get('/v1/jobss/client/created/', { params: { start: 0, stop: 100 } })
      const raw = resp?.data?.data
      const jobs = Array.isArray(raw) ? raw : []
      if (!jobId.value && jobs.length > 0) {
        const firstId = String((jobs[0] as any)?.id || '')
        if (firstId && firstId.trim()) jobId.value = firstId.trim()
      }
      let derivedCategory: string | null = null
      for (const j of jobs) {
        const cat = (j as any)?.primary_area_of_expertise || (j as any)?.category
        if (typeof cat === 'string' && cat.trim()) { derivedCategory = cat.trim(); break }
      }
      if (derivedCategory) {
        await getAgentsByCategory(derivedCategory, { start: 0, stop: 10 })
        return
      }
    } catch (_) {}

    await getRecommendedAgents({ start: 0, stop: 10 })
  } catch (err) {
    console.error('Error in onMounted:', err)
  }
});

</script>
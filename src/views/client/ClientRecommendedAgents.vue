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
                    <div class="flex items-center gap-1">
                      <svg class="w-4 h-4 sm:w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span class="font-semibold text-sm sm:text-base text-gray-800">{{ agent.rating }}</span>
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
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-100">
                    <div class="text-center">
                      <p class="text-lg sm:text-xl font-bold text-gray-800">{{ agent.completed_jobs ?? 0 }}</p>
                      <p class="text-xs sm:text-sm text-gray-500">Jobs Done</p>
                    </div>
                    <div class="text-center">
                      <p class="text-lg sm:text-xl font-bold text-gray-800">{{ agent.response_time || '—' }}</p>
                      <p class="text-xs sm:text-sm text-gray-500">Response Time</p>
                    </div>
                    <div class="text-center">
                      <p class="text-lg sm:text-xl font-bold text-gray-800">{{ agent.years_experience ?? '—' }}</p>
                      <p class="text-xs sm:text-sm text-gray-500">Years Exp</p>
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
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-teal-600 border border-teal-200 rounded-md hover:bg-teal-50 transition-colors"
                      @click.stop="selectAgent(agent)"
                    >
                      Select Agent
                    </button>
                    <button
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors disabled:opacity-60"
                      :disabled="meetingSubmittingId === agent.id"
                      @click.stop="setMeeting(agent)"
                    >
                      {{ meetingSubmittingId === agent.id ? 'Scheduling...' : 'Set Meeting' }}
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
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAgents } from '@/composables/useAgents'
import type { AgentOut } from '@/types/api'
import { meetingService } from '@/services/meetingService'
import { useToast } from 'vue-toastification'

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
}

const normalizedAgents = computed<NormalizedAgent[]>(() => {
  return (agents.value || []).map(agent => ({
    id: agent.id ?? '',
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
    availability_type: (agent as any)?.availability?.type || 'Full-time'
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

const goToAgent = (agent: NormalizedAgent) => {
  const id = typeof agent?.id === 'string' ? agent.id.trim() : ''
  if (!id || id.length < 5) {
    alert('Invalid agent profile. Please select another agent.')
    return
  }
  try {
    const rawAgent = (agents.value || []).find(a => (a.id ?? '') === id)
    localStorage.setItem('selectedAgent', JSON.stringify(rawAgent ?? agent))
  } catch (_) {}
  router.push(`/client/agent/${id}`)
}

const meetingSubmittingId = ref('')

const selectAgent = (agent: NormalizedAgent) => {
  const id = typeof agent?.id === 'string' ? agent.id.trim() : ''
  if (!id || id.length < 5) return
  try {
    const rawAgent = (agents.value || []).find(a => (a.id ?? '') === id)
    localStorage.setItem('selectedAgent', JSON.stringify(rawAgent ?? agent))
  } catch (_) {}
  router.push({ name: 'client-set-appointment', params: { id } })
}

const setMeeting = async (agent: NormalizedAgent) => {
  const id = typeof agent?.id === 'string' ? agent.id.trim() : ''
  const jobId = typeof route.params.id === 'string' ? route.params.id : Array.isArray(route.params.id) ? String(route.params.id[0] || '') : ''
  if (!id || id.length < 5 || !jobId) {
    toast.error('Missing agent or job information')
    return
  }
  const now = new Date()
  const defaultDate = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const yyyy = defaultDate.getFullYear()
  const mm = String(defaultDate.getMonth() + 1).padStart(2, '0')
  const dd = String(defaultDate.getDate()).padStart(2, '0')
  const hh = String(defaultDate.getHours()).padStart(2, '0')
  const mi = String(defaultDate.getMinutes()).padStart(2, '0')
  const suggested = `${yyyy}-${mm}-${dd} ${hh}:${mi}`
  let input = suggested
  try {
    const val = window.prompt('Enter meeting time (YYYY-MM-DD HH:mm, local time):', suggested)
    if (val && typeof val === 'string') input = val
  } catch (_) {}
  let epochSeconds = Math.floor(defaultDate.getTime() / 1000)
  try {
    const parts = (input || '').trim().replace('T', ' ').split(' ')
    const datePart = parts[0] || ''
    const timePart = parts[1] || '09:00'
    const [Y, M, D] = datePart.split('-').map(n => Number(n))
    const [H, Min] = timePart.split(':').map(n => Number(n))
    const dt = new Date(Y, (M || 1) - 1, D || 1, H || 9, Min || 0, 0)
    if (!Number.isNaN(dt.getTime())) epochSeconds = Math.floor(dt.getTime() / 1000)
  } catch (_) {}
  try {
    meetingSubmittingId.value = id
    const resp = await meetingService.setMeeting({ job_id: jobId, agent_id: id, meeting_time: epochSeconds, client_approved: true })
    meetingSubmittingId.value = ''
    if (resp.success) {
      toast.success('Meeting scheduled successfully')
    } else {
      toast.error(resp.error || 'Failed to schedule meeting')
    }
  } catch (e: any) {
    meetingSubmittingId.value = ''
    toast.error(e?.message || 'Failed to schedule meeting')
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
})
</script>
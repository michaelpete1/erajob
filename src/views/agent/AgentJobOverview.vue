<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { jobsService } from '@/services/jobsService'

const router = useRouter()
const route = useRoute()
interface OverviewJob {
  id: string
  project_title: string
  description: string
  requirement: string
  skills_needed: string
  timeline_start: number
  timeline_deadline: number
  budget: number
  status: string
  category: string
  client_name: string
  client_id?: string
}

const job = ref<OverviewJob | null>(null)
const progress = ref<number>(30)
const loading = ref(false)
const error = ref<string | null>(null)

const extractIdFromSlug = (slug: string): string => {
  if (!slug) return ''
  const parts = slug.split('-')
  return parts[parts.length - 1] || ''
}

const formatCurrency = (amount: number | null | undefined): string | null => {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return null
  const normalized = amount / 100
  return `$${normalized.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const formatDate = (timestamp?: number | null): string | null => {
  if (!timestamp) return null
  const ms = timestamp > 1_000_000_000_000 ? timestamp : timestamp * 1000
  const date = new Date(ms)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString()
}

const deriveProgressFromStatus = (status?: string | null): number => {
  if (!status) return 20
  const normalized = status.toLowerCase()
  if (normalized.includes('completed')) return 100
  if (normalized.includes('active') || normalized.includes('ongoing')) return 70
  if (normalized.includes('assigned') || normalized.includes('accepted')) return 50
  if (normalized.includes('pending')) return 25
  return 20
}

const deriveClientName = (raw: any): string => {
  if (typeof raw?.client === 'string') return raw.client
  if (typeof raw?.client_id === 'string') return raw.client_id
  if (typeof raw?.clientId === 'string') return raw.clientId
  if (raw?.client && typeof raw.client === 'object') {
    return raw.client.name || raw.client.full_name || 'Client'
  }
  return 'Client'
}

const createJobFromRaw = (raw: any, fallbackId: string): OverviewJob => {
  const timeline = raw?.timeline || {}
  const startTimestamp = timeline.start_date || raw?.timeline?.startDate || raw?.start_date
  const deadlineTimestamp = timeline.deadline || raw?.timeline?.deadline || raw?.deadline

  return {
    id: raw?.id || fallbackId || 'unknown',
    project_title: raw?.project_title || raw?.title || `Job #${fallbackId || 'Unknown'}`,
    category: raw?.category || 'Other',
    budget: typeof raw?.budget === 'number' ? raw.budget : 0,
    description: raw?.description || 'Details about this job are not available offline.',
    requirement: raw?.requirement || (Array.isArray(raw?.requirements) ? raw.requirements.join('\n') : ''),
    skills_needed: typeof raw?.skills_needed === 'string' ? raw.skills_needed : Array.isArray(raw?.skills_needed) ? raw.skills_needed.join(', ') : 'Other',
    timeline_start: typeof startTimestamp === 'number' ? startTimestamp : 0,
    timeline_deadline: typeof deadlineTimestamp === 'number' ? deadlineTimestamp : 0,
    client_name: deriveClientName(raw),
    status: raw?.status || 'pending'
  }
}

const jobDisplay = computed(() => {
  if (!job.value) return null
  return {
    title: job.value.project_title,
    description: job.value.description,
    client: job.value.client_name,
    rate: formatCurrency(job.value.budget),
    deadline: formatDate(job.value.timeline_deadline),
    requirement: job.value.requirement,
    status: job.value.status
  }
})

onMounted(async () => {
  loading.value = true
  error.value = null

  try {
    // Extract job ID from route slug
    const slug = route.params.slug as string
    const jobId = extractIdFromSlug(slug)

    if (jobId) {
      const result = await jobsService.getJobById(jobId)
      if (result.success && result.data) {
        job.value = createJobFromRaw(result.data, jobId)
        progress.value = deriveProgressFromStatus(job.value.status)
        return
      }
      if (result.error) {
        error.value = result.error
      }
    }

    // Fallback to localStorage if API fails or no jobId
    try {
      const stored = localStorage.getItem('selectedGig')
      if (stored) {
        const raw = JSON.parse(stored)
        job.value = createJobFromRaw(raw, jobId)
        progress.value = deriveProgressFromStatus(job.value.status)
      }
    } catch (e) {
      // ignore localStorage errors
      console.warn('Error reading localStorage fallback:', e)
    }

    // Final fallback: show minimal placeholder
    if (!job.value) {
      job.value = createJobFromRaw({}, jobId)
      progress.value = deriveProgressFromStatus(job.value.status)
    }
  } catch (caughtError) {
    console.error('Error loading job:', caughtError)
    // Type-safe error handling
    if (caughtError instanceof Error) {
      error.value = `Failed to load job details: ${caughtError.message}`
    } else {
      error.value = 'Failed to load job details'
    }

    // Fallback to localStorage on API error
    try {
      const stored = localStorage.getItem('selectedGig')
      if (stored) {
        const raw = JSON.parse(stored)
        job.value = createJobFromRaw(raw, '')
        progress.value = deriveProgressFromStatus(job.value.status)
      }
    } catch (e) {
      // ignore localStorage errors
      console.warn('Error reading localStorage after API failure:', e)
    }
  } finally {
    loading.value = false
  }
})

const openMessages = () => {
  router.push({ path: '/agent/notifications', query: job.value?.id ? { jobId: job.value.id } : undefined })
}

const markComplete = () => {
  router.push('/agent/gigs-listing')
}

const sendUpdate = () => {
  console.log('Update sent to client (stub)')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20 sm:pb-24 overflow-x-hidden">
    <div class="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6 mb-4 sm:mb-6">
        <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button @click="$router.back()" class="p-1.5 sm:p-2 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div class="min-w-0 flex-1">
            <h1 class="text-base sm:text-lg font-semibold text-gray-900 break-words">Job Overview</h1>
            <p class="text-xs sm:text-sm text-gray-500 break-words">A concise summary of the project and current status</p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto flex-shrink-0">
          <button @click="openMessages" class="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-white rounded-md shadow-sm hover:shadow-md text-xs sm:text-sm font-medium transition-shadow min-h-[44px] touch-manipulation">
            <span class="break-words">View Proposals</span>
          </button>
          <button @click="sendUpdate" class="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-white rounded-md shadow-sm hover:shadow-md text-xs sm:text-sm font-medium transition-shadow min-h-[44px] touch-manipulation">
            <span class="break-words">Send Update</span>
          </button>
        </div>
      </div>

      <section class="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 md:p-5 mb-4 sm:mb-6">
        <div class="flex flex-col gap-4 sm:gap-6">
          <div class="min-w-0">
            <h2 class="text-lg sm:text-xl font-semibold text-gray-900 leading-tight break-words">{{ jobDisplay?.title ?? '—' }}</h2>
            <p class="mt-1 text-xs sm:text-sm text-gray-600 leading-relaxed break-words">{{ jobDisplay?.description || 'No description provided.' }}</p>
            <div class="mt-3 space-y-2 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
              <div class="text-xs sm:text-sm text-gray-600">
                Client: <span class="font-medium text-gray-800 block break-words">{{ jobDisplay?.client }}</span>
              </div>
              <div class="text-xs sm:text-sm text-gray-600">
                Rate: <span class="font-medium text-gray-800 block break-words">{{ jobDisplay?.rate ?? '—' }}</span>
              </div>
              <div v-if="jobDisplay?.deadline" class="text-xs sm:text-sm text-gray-600">
                Deadline: <span class="font-medium text-gray-800 block break-words">{{ jobDisplay.deadline }}</span>
              </div>
            </div>
          </div>
          <div class="w-full sm:w-auto text-center">
            <div class="text-xs text-gray-500">Progress</div>
            <div class="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold text-gray-900 whitespace-nowrap">{{ progress }}%</div>
          </div>
        </div>

        <div class="mt-4">
          <div class="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div :style="{ width: progress + '%' }" class="h-2 bg-teal-600 transition-all duration-300"></div>
          </div>
          <div class="mt-2 text-xs text-gray-500 break-words">This progress value is for display; in a production app it would reflect real milestone data.</div>
        </div>
      </section>

      <section class="space-y-4 sm:space-y-6">
        <!-- Main Content Area -->
        <div class="space-y-4 sm:space-y-6">
          <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5">
            <h3 class="text-sm font-semibold text-gray-800 mb-2 sm:mb-3 break-words">About this project</h3>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed break-words">{{ jobDisplay?.description || 'No description provided.' }}</p>
          </div>

          <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5">
            <h3 class="text-sm font-semibold text-gray-800 mb-2 sm:mb-3 break-words">Recent activity</h3>
            <ul class="text-xs sm:text-sm text-gray-600 space-y-2 sm:space-y-3">
              <li class="flex items-start gap-2 min-w-0">
                <span class="text-gray-500 flex-shrink-0">•</span>
                <span class="break-words">Proposal submitted by you — <span class="text-gray-500 whitespace-nowrap">3 days ago</span></span>
              </li>
              <li class="flex items-start gap-2 min-w-0">
                <span class="text-gray-500 flex-shrink-0">•</span>
                <span class="break-words">Client requested clarification — <span class="text-gray-500 whitespace-nowrap">2 days ago</span></span>
              </li>
              <li class="flex items-start gap-2 min-w-0">
                <span class="text-gray-500 flex-shrink-0">•</span>
                <span class="break-words">Proposal approved — <span class="text-gray-500 whitespace-nowrap">1 day ago</span></span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Sidebar Actions -->
        <div class="space-y-4 sm:space-y-6">
          <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5">
            <h4 class="text-sm font-semibold text-gray-800 mb-2 sm:mb-3 break-words">Client</h4>
            <div class="mt-2 text-xs sm:text-sm text-gray-600 break-words">{{ jobDisplay?.client }}</div>
            <div class="mt-3 sm:mt-4">
              <button @click="openMessages" class="w-full inline-flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-md bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-medium transition-colors min-h-[44px] touch-manipulation">
                <span class="break-words">View Proposals</span>
              </button>
            </div>
          </div>

          <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5">
            <h4 class="text-sm font-semibold text-gray-800 mb-2 sm:mb-3 break-words">Actions</h4>
            <div class="mt-2 space-y-2 sm:space-y-3">
              <button @click="markComplete" class="w-full inline-flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-md bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-medium transition-colors min-h-[44px] touch-manipulation">
                <span class="break-words">Mark Complete</span>
              </button>
              <button @click="$router.push('/agent/gigs-listing')" class="w-full inline-flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-md bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs sm:text-sm font-medium transition-colors min-h-[44px] touch-manipulation">
                <span class="break-words">Back to Projects</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

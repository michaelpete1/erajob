<template>
  <div class="min-h-screen bg-gray-50 pb-20 sm:pb-24">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-3 sm:py-4 sticky top-0 z-30 shadow-sm">
      <div class="flex items-center justify-between max-w-5xl mx-auto">
        <div class="flex items-center gap-2 sm:gap-3">
          <button @click="goBack" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <p class="text-[11px] sm:text-xs tracking-[0.2em] uppercase text-gray-400">Job Overview</p>
            <h1 class="text-base sm:text-lg md:text-xl font-semibold text-gray-800">Job Description</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 max-w-4xl mx-auto space-y-6">
      <!-- Job Header Card -->
      <div class="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm mb-4 sm:mb-6">
        <header class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div class="flex-1 min-w-0">
            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-1">{{ job.project_title }}</h2>
            <p class="text-sm text-gray-500">Posted {{ job.postedTime }}</p>
          </div>
          <span :class="['inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full border', jobStatusClass]">
            {{ jobStatusLabel }}
          </span>
        </header>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
            <div class="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-lg">💰</div>
            <div>
              <p class="text-xs uppercase tracking-wide text-gray-400">Budget</p>
              <p class="text-sm font-semibold text-gray-800">${{ (Number(job.budget) * 1.17).toFixed(2) }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
            <div class="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-lg">📍</div>
            <div>
              <p class="text-xs uppercase tracking-wide text-gray-400">Type</p>
              <p class="text-sm font-semibold text-gray-800">{{ job.type }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
            <div class="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-lg">🗓️</div>
            <div>
              <p class="text-xs uppercase tracking-wide text-gray-400">Deadline</p>
              <p class="text-sm font-semibold text-gray-800">{{ job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Not set' }}</p>
            </div>
          </div>
        </div>

        <div class="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            @click="goToRecommendedAgents"
            class="px-3 py-1.5 bg-teal-50 text-teal-700 border border-teal-100 text-xs font-semibold rounded-full hover:bg-teal-100 transition-colors"
          >
            {{ job.category }}
          </button>
          <span v-if="job.skills_needed" class="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold rounded-full">
            {{ job.skills_needed }}
          </span>
        </div>

        <div class="mt-6 pt-4 border-t border-gray-100">
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              v-if="job.id"
              @click="viewProposals"
              class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-teal-500 text-white text-sm font-semibold shadow-sm hover:bg-teal-600 transition-colors"
            >
              View proposals
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Proposals Section -->
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
          <h3 class="text-base sm:text-lg md:text-xl font-semibold text-gray-800">Agent Proposals</h3>
          <button
            v-if="job.id"
            @click="viewProposals"
            class="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-teal-50 text-teal-600 border border-teal-200 rounded-md text-xs sm:text-sm font-medium hover:bg-teal-100 transition-colors"
          >
            <span>Open proposals page</span>
            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div v-if="proposalsLoading" class="text-center py-8 text-gray-500 text-sm sm:text-base">
          Loading proposals...
        </div>

        <div v-else-if="proposalsError" class="text-center py-8 text-red-500 text-sm sm:text-base">
          {{ proposalsError }}
        </div>

        <div v-else-if="filteredProposals.length === 0" class="text-center py-8 text-gray-500 text-sm sm:text-base">
          No proposals submitted yet.
        </div>

        <div v-else class="space-y-4">
          <article
            v-for="proposal in filteredProposals"
            :key="proposal.id"
            class="border border-gray-200 rounded-xl p-4 sm:p-5 hover:border-teal-200 hover:shadow-md transition-all"
          >
            <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <div>
                <p class="text-xs sm:text-sm text-gray-500">Submitted</p>
                <p class="text-sm sm:text-base font-semibold text-gray-800">{{ formatTimestamp(proposal.date_created) }}</p>
              </div>
              <span :class="['px-3 py-1 rounded-full text-xs font-semibold capitalize', statusBadgeClass(proposal.proposal_status)]">
                {{ formatProposalStatus(proposal.proposal_status) }}
              </span>
            </header>

            <p class="text-sm sm:text-base text-gray-700 whitespace-pre-line mb-4">
              {{ proposal.proposal }}
            </p>

            <footer class="flex flex-wrap gap-3 sm:gap-4 justify-between items-center">
              <div class="text-xs sm:text-sm text-gray-500 space-y-1">
                <p v-if="proposal.agent_name"><span class="font-semibold text-gray-700">Agent:</span> {{ proposal.agent_name }}</p>
                <p v-if="proposal.agent_email"><span class="font-semibold text-gray-700">Email:</span> {{ proposal.agent_email }}</p>
                <p v-if="!proposal.agent_name && !proposal.agent_email"><span class="font-semibold text-gray-700">Agent:</span> Contact details not provided</p>
              </div>
              <button
                class="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 border border-teal-200 text-teal-600 rounded-md text-xs sm:text-sm font-semibold hover:bg-teal-50 transition-colors"
                @click="openProposalDetail(proposal.id)"
              >
                <span>View full proposal</span>
                <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </footer>
          </article>
        </div>
      </div>

      <!-- Job Description -->
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-sm mb-4 sm:mb-6">
        <h3 class="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Description</h3>
        <p class="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6">
          {{ job.description }}
        </p>
        
        <h4 class="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Requirements</h4>
        <ul class="space-y-1.5 sm:space-y-2 md:space-y-3">
          <li v-for="requirement in job.requirements" :key="requirement" class="flex items-start gap-2 sm:gap-3">
            <span class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg class="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </span>
            <span class="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">{{ requirement }}</span>
          </li>
        </ul>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { jobsService } from '../../services/jobsService'
import { applicationsService } from '@/services/applicationsService'
import type { ApplicationOut } from '@/types/api'

const route = useRoute()
const router = useRouter()

const gigBullets = ref<string[]>([])

const hydrateJobFromContext = (jobId: string): boolean => {
  const storedContextRaw = localStorage.getItem('selectedJobContext')
  if (!storedContextRaw) return false
  try {
    const parsed = JSON.parse(storedContextRaw) as StoredJobContext
    const matches = typeof parsed?.agent_job_id === 'string' && parsed.agent_job_id === jobId
    if (!matches || !parsed.project) return false

    const project = parsed.project
    job.value = {
      id: parsed.agent_job_id,
      admin_id: project.admin_id || parsed.admin_job_id || '',
      project_title: project.project_title || 'Untitled Project',
      category: (project as any).primary_area_of_expertise || project.category || 'Other',
      budget: project.budget?.toString() || '0',
      type: 'Remote',
      postedTime: project.date_created
        ? new Date(project.date_created * 1000).toLocaleDateString()
        : 'Recently posted',
      proposals: '0',
      description: project.description || 'No description available',
      requirements: project.requirement ? [project.requirement] : ['Details not specified.'],
      skills_needed: '',
      deadline: project.timeline?.deadline ? project.timeline.deadline * 1000 : 0,
      status: project.status || 'open'
    }
    gigBullets.value = job.value.requirements
    return true
  } catch (err) {
    console.warn('Failed to hydrate job from stored context', err)
    return false
  }
}

interface StoredJobContext {
  agent_job_id: string
  admin_job_id?: string
  project?: {
    id: string
    admin_id?: string
    project_title: string
    category: string
    budget: number
    description: string
    requirement?: string
    date_created: number
    timeline: {
      start_date: number
      deadline: number
    }
    agents?: Array<{ id: string; name: string }>
    status?: string
    admin_approved?: boolean
  }
}

// Job data with proper typing
const job = ref({
  id: '',
  admin_id: '',
  project_title: 'Loading...',
  category: 'Loading...',
  budget: '0',
  type: 'Remote',
  postedTime: 'Loading...',
  proposals: '0',
  description: 'Loading job description...',
  requirements: ['Loading requirements...'],
  skills_needed: '',
  deadline: 0,
  status: 'open'
})

// Loading and error states
const loading = ref(false)
const error = ref<Error | null>(null)
const proposalsLoading = ref(false)
const proposalsError = ref<string | null>(null)
const proposals = ref<ApplicationOut[]>([])
const proposalsStart = ref(0)
const proposalsStop = ref(50)

// Methods
const goBack = () => {
  router.back()
}

const viewProposals = () => {
  if (!job.value.id) return
  router.push({ name: 'client-proposals', query: { jobId: job.value.id } })
}

const goToRecommendedAgents = () => {
  if (!job.value.id) return
  try {
    const selectedProject = {
      id: job.value.id,
      job_id: job.value.id,
      title: job.value.project_title,
      category: job.value.category,
      primary_area_of_expertise: job.value.category
    }
    localStorage.setItem('selectedProject', JSON.stringify(selectedProject))
  } catch (_) {}
  router.push({ name: 'client-job-agents', params: { id: job.value.id }, query: { category: job.value.category } })
}

const loadProposals = async () => {
  const storedContextRaw = localStorage.getItem('selectedJobContext')
  let agentJobId: string | null = null
  if (storedContextRaw) {
    try {
      const parsed = JSON.parse(storedContextRaw)
      agentJobId = typeof parsed?.agent_job_id === 'string' ? parsed.agent_job_id : null
    } catch (err) {
      console.warn('Failed to parse stored job context', err)
    }
  }

  const targetJobId = agentJobId || job.value.id

  if (!targetJobId) {
    proposals.value = []
    return
  }

  proposalsLoading.value = true
  proposalsError.value = null

  try {
    const response = await applicationsService.listClientApplications(targetJobId, {
      start: proposalsStart.value,
      stop: proposalsStop.value
    })

    if (response.success && response.data) {
      proposals.value = response.data
    } else {
      proposalsError.value = response.error || 'Failed to load proposals.'
    }
  } catch (err: any) {
    proposalsError.value = err?.message || 'Failed to load proposals.'
  } finally {
    proposalsLoading.value = false
  }
}

const openProposalDetail = (proposalId: string) => {
  const contextRaw = localStorage.getItem('selectedJobContext')
  let agentJobId = job.value.id
  if (contextRaw) {
    try {
      const parsed = JSON.parse(contextRaw)
      if (typeof parsed?.agent_job_id === 'string') agentJobId = parsed.agent_job_id
    } catch (err) {
      console.warn('Failed to parse job context', err)
    }
  }
  if (!proposalId || !agentJobId) return
  router.push({ name: 'client-proposal-detail', params: { id: proposalId }, query: { jobId: agentJobId } })
}

const formatProposalStatus = (status: string) => {
  const mapping: Record<string, string> = {
    pending_review: 'Pending Review',
    accepted: 'Accepted',
    rejected: 'Rejected'
  }
  return mapping[status] || status
}

const statusBadgeClass = (status: string) => {
  switch (status) {
    case 'accepted':
      return 'bg-green-100 text-green-600'
    case 'rejected':
      return 'bg-red-100 text-red-600'
    default:
      return 'bg-yellow-100 text-yellow-600'
  }
}

const formatTimestamp = (timestamp?: number | null) => {
  if (!timestamp) return '—'
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString()
}

const filteredProposals = computed(() => proposals.value)

const jobStatusLabel = computed(() => {
  const status = (job.value.status || 'open').toLowerCase()
  if (status.includes('complete')) return 'Completed'
  if (status.includes('in_progress')) return 'In progress'
  if (status.includes('pending')) return 'Pending review'
  if (status.includes('paused')) return 'Paused'
  return status.charAt(0).toUpperCase() + status.slice(1)
})

const jobStatusClass = computed(() => {
  const status = (job.value.status || '').toLowerCase()
  if (status.includes('complete')) return 'bg-green-50 text-green-700 border-green-200'
  if (status.includes('pending')) return 'bg-yellow-50 text-yellow-700 border-yellow-200'
  if (status.includes('paused')) return 'bg-orange-50 text-orange-700 border-orange-200'
  return 'bg-blue-50 text-blue-700 border-blue-200'
})

onMounted(async () => {
  const jobId = route.params.id as string

  if (jobId) {
    loading.value = true
    error.value = null

    try {
      const hydrated = hydrateJobFromContext(jobId)

      if (!hydrated) {
        const result = await jobsService.getJobById(jobId)

        if (result.success && result.data) {
          job.value = {
            id: jobId,
            admin_id: result.data.id || '',
            project_title: result.data.title || 'Job Title',
            category: (result.data as any)?.primary_area_of_expertise || result.data.category || 'Other',
            budget: result.data.budget?.toString() || '0',
            type: 'Remote',
            postedTime: (result.data as any)?.date_created ? new Date((result.data as any).date_created * 1000).toLocaleDateString() : (result.data as any)?.createdAt ? new Date((result.data as any).createdAt).toLocaleDateString() : 'Recently posted',
            proposals: '0',
            description: result.data.description || 'No description available',
            requirements: [result.data.description?.split('\n')[0] || 'Requirements not specified'],
            skills_needed: Array.isArray((result.data as any).skills_needed) ? (result.data as any).skills_needed.join(', ') : (result.data as any).skills_needed || '',
            deadline: result.data.timeline?.endDate ? new Date(result.data.timeline.endDate).getTime() : 0,
            status: 'open'
          }
        } else {
          throw new Error(result.error || 'Job not found')
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to load job details')
    } finally {
      loading.value = false
    }
  } else {
    error.value = new Error('No job ID provided in route')
  }
})

watch(
  () => job.value.id,
  (newId) => {
    if (newId) {
      loadProposals()
    } else {
      proposals.value = []
    }
  }
)

const getDefaultDescription = (title: string) => {
  return `We're looking for a skilled professional to complete this project. The full brief will be shared with successful applicants.`
}

const getDefaultRequirements = (category: string) => {
  const baseRequirements = [
    'Proven experience in the field with a strong portfolio of relevant projects.',
    'Proficiency in industry-standard tools and technologies.',
    'Solid understanding of fundamental principles and best practices.',
    'Attention to detail and commitment to delivering high-quality work on time.'
  ]

  if (category.includes('Design')) {
    return [
      'Proven experience in UI/UX design with a strong portfolio of web or mobile projects.',
      'Proficiency in design tools such as Figma, Adobe XD, or Sketch.',
      'Solid understanding of design principles, typography, color theory, and accessibility.',
      'Attention to detail and commitment to delivering pixel-perfect designs on time.'
    ]
  }

  if (category.includes('Writing')) {
    return [
      'Exceptional writing and editing skills with a strong command of grammar and style.',
      'Experience in creating engaging content for various platforms and audiences.',
      'Ability to research and write on diverse topics with accuracy and creativity.',
      'Strong time management skills and ability to meet deadlines consistently.'
    ]
  }

  if (category.includes('Marketing')) {
    return [
      'Proven experience in digital marketing with a track record of successful campaigns.',
      'Proficiency in marketing analytics tools and social media platforms.',
      'Strong understanding of SEO, content marketing, and audience engagement strategies.',
      'Ability to analyze data and optimize campaigns for better performance.'
    ]
  }

  return baseRequirements
}
</script>

<style scoped>
/* No custom styles needed - using Tailwind classes */
</style>

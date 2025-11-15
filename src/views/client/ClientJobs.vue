<template>
  <div class="min-h-screen bg-gray-50 pb-16 sm:pb-20">

    <div class="px-4 sm:px-6 py-4 sm:py-6 max-w-4xl mx-auto">
      <!-- Page Title -->
      <div class="mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Jobs</h1>
        <p class="text-gray-600 mt-1">Manage your active and browse jobs</p>
      </div>
      <div class="flex bg-gray-100 rounded-lg overflow-hidden max-w-md mx-auto mb-6">
        <button
          @click="activeTab = 'active'"
          :class="activeTab === 'active' ? 'bg-teal-500 text-white' : 'text-gray-600'"
          class="flex-1 py-3 sm:py-3 text-sm sm:text-base font-medium transition-colors duration-200 hover:bg-gray-200"
        >
          Active
        </button>
        <button
          @click="activeTab = 'pending'"
          :class="activeTab === 'pending' ? 'bg-teal-500 text-white' : 'text-gray-600'"
          class="flex-1 py-3 sm:py-3 text-sm sm:text-base font-medium transition-colors duration-200 hover:bg-gray-200"
        >
          Pending
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-700 font-medium">{{ error }}</p>
        </div>
      </div>

      <!-- Jobs Grid -->
      <div v-if="!loading && !error" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 pb-32">
        <div 
          v-for="project in activeProjects"
          :key="project.id || `active-${project.project_title}-${project.date_created}`"
          v-show="activeTab === 'active'"
          @click="goToProject(project)"
          class="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-lg hover:border-teal-300 transition-all duration-300 cursor-pointer group"
        >
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
          <p class="flex items-center gap-1 text-sm text-gray-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-xs sm:text-sm">{{ formatDate(project.date_created) }}</span>
          </p>
          <span class="px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full whitespace-nowrap">
            Active
          </span>
        </div>
        
        <h2 class="font-semibold text-gray-800 text-base sm:text-lg lg:text-xl mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors">
          {{ project.project_title }}
        </h2>
        
        <div class="flex items-center gap-2 mb-4">
          <span class="text-blue-500 text-lg sm:text-xl">📋</span>
          <p class="text-sm sm:text-base text-gray-600">{{ project.category }}</p>
        </div>
        
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div class="flex items-center text-teal-600 font-semibold">
            <span class="text-lg sm:text-xl">💰</span>
            <span class="ml-1 text-lg sm:text-xl font-bold">${{ (project.budget * 1.17).toFixed(2) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500">{{ formatDate(project.timeline?.deadline) }}</span>
          </div>
        </div>
        
        <!-- Description Preview -->
        <div class="mt-3 pt-3 border-t border-gray-100">
          <p class="text-sm text-gray-600 line-clamp-3">{{ project.description }}</p>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <button
            class="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-teal-500 text-teal-600 hover:bg-teal-50 transition-colors"
            @click.stop="goToProject(project)"
          >
            View Details
          </button>
          <button
            class="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
            @click.stop="goToJobPage(project)"
          >
            View Job Page
          </button>
          <button
            class="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-colors"
            @click.stop="goToProjectWorkLogs(project)"
          >
            Open Work Logs
          </button>
          <button
            v-if="activeTab === 'pending'"
            class="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-1"
            @click.stop="confirmDeleteProject(project)"
            :disabled="isDeleting(project.id)"
          >
            <span v-if="isDeleting(project.id)" class="inline-block animate-spin">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span v-else>
              <svg class="w-3 h-3 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </span>
            {{ isDeleting(project.id) ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>

        <div v-if="activeTab === 'active' && activeProjects.length === 0 && !loading" class="md:col-span-2 lg:col-span-3">
          <div class="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-8 sm:p-12 text-center">
            <div class="mb-6">
              <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 class="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">No Active Jobs Yet</h3>
              <p class="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
                You don't have any active jobs with assigned agents. Start by browsing available jobs or create a new one to get started.
              </p>
            </div>
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              @click="activeTab = 'pending'"
              class="px-6 py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors duration-200"
            >
              Browse Jobs
            </button>
            <button
              @click="goToCreateProject"
              class="px-6 py-3 border border-teal-500 text-teal-500 rounded-lg font-medium hover:bg-teal-50 transition-colors duration-200"
            >
              Create Job
            </button>
          </div>
        </div>
      </div>

        <div v-if="activeTab === 'pending' && !loading" class="md:col-span-2 lg:col-span-3">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div
              v-for="project in pendingProjects"
              :key="project.id || `pending-${project.project_title}-${project.date_created}`"
              @click="goToProject(project)"
              class="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg hover:border-teal-300 transition-all duration-300 group cursor-pointer"
            >
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs text-gray-500 flex items-center gap-1">
                  <span class="text-lg">⏰</span>
                  <span>{{ formatDate(project.date_created) }}</span>
                </span>
                <span class="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full" v-if="!project.admin_approved">Pending Approval</span>
                <span class="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full" v-else>Approved</span>
              </div>
              <h2 class="font-semibold text-gray-800 text-base sm:text-lg mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors">
                {{ project.project_title }}
              </h2>
              <p class="text-sm text-gray-600 mb-4 line-clamp-3">
                {{ project.description }}
              </p>
              <p class="text-xs font-medium text-yellow-700 mb-3" v-if="!project.admin_approved">Awaiting admin approval before work can begin.</p>
              <p class="text-xs font-medium text-green-700 mb-3" v-else>Approved and ready for work.</p>
              <div class="flex items-center justify-between">
                <span class="text-lg font-bold text-teal-600">${{ (project.budget * 1.17).toFixed(2) }}</span>
                <button
                  class="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium text-sm sm:text-base transition-colors"
                  @click.stop="goToProject(project)"
                >
                  View Details
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Empty state for pending projects -->
          <div v-if="pendingProjects.length === 0" class="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-8 sm:p-12 text-center">
            <div class="mb-6">
              <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 class="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">No Available Jobs</h3>
              <p class="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
                There are no available jobs at the moment. Check back later or create your own job to get started.
              </p>
            </div>
            <div class="flex justify-center">
              <button
                @click="goToCreateProject"
                class="px-6 py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors duration-200"
              >
                Create Job
              </button>
            </div>
          </div>
        </div>

        <!-- Browse Tab -->

      </div>
    </div>

    <button
      @click="goToCreateProject"
      class="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-teal-500 text-white text-xl sm:text-2xl flex items-center justify-center shadow-lg hover:bg-teal-600 hover:shadow-xl transition-all duration-300 z-40 group"
    >
      <svg class="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useJobs } from '@/composables/useJobs'
import { useToast } from 'vue-toastification'

const router = useRouter()
const { deleteJob } = useJobs()
const toast = useToast()
const activeTab = ref<'active' | 'pending'>('pending')
const { getClientJobs, loading, clearError } = useJobs()
const error = ref<string | null>(null)
const deletingJobIds = ref<string[]>([])

const formatDate = (timestamp: number | null | undefined) => {
  if (!timestamp) return 'N/A'
  const ms = timestamp > 1_000_000_000_000 ? timestamp : timestamp * 1000
  const date = new Date(ms)
  if (Number.isNaN(date.getTime())) {
    return 'N/A'
  }
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

interface Project {
  id: string
  admin_id?: string
  project_title: string
  category: string
  budget: number
  description: string
  requirement?: string | string[]
  skills_needed?: string[]
  date_created: number
  timeline: {
    start_date: number
    deadline: number
  }
  agents?: Array<{
    id: string
    name: string
    email?: string
    avatar?: string
  }>
  status?: string
  admin_approved?: boolean
}

const activeProjects = ref<Project[]>([])
const pendingProjects = ref<Project[]>([])

const isDeleting = (id?: string) => {
  return id ? deletingJobIds.value.includes(id) : false
}

const removeDeletingId = (id: string) => {
  deletingJobIds.value = deletingJobIds.value.filter(did => did !== id)
}

const suspiciousPatterns = [
  /return\s+[A-Za-z0-9_]/i,
  /await\s+/i,
  /function\s*\(/i,
  /=>/,
  /\bconst\b/i,
  /\blet\b/i,
  /\bvar\b/i,
  /APIResponse/i,
  /\bdef\b/i,
  /[{;}]/
]

const stripCodeLikeLines = (value: string): string => {
  const lines = value.replace(/\r\n?/g, '\n').split('\n')
  const safeLines = lines
    .map(line => line.trim())
    .filter(line => line.length > 0 && !suspiciousPatterns.some(pattern => pattern.test(line)))

  if (safeLines.length > 0) {
    return safeLines.join('\n').trim()
  }

  const cleaned = value
    .replace(/[{};]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (cleaned && !suspiciousPatterns.some(pattern => pattern.test(cleaned))) {
    return cleaned
  }

  return ''
}

const sanitizeTextValue = (input: unknown): string => {
  if (typeof input !== 'string') return ''
  const trimmed = input.trim()
  if (!trimmed) return ''
  return stripCodeLikeLines(trimmed)
}

const parseSkillsList = (input: unknown): string[] => {
  if (!input) return []
  if (Array.isArray(input)) {
    return input
      .map(item => sanitizeTextValue(item))
      .filter(Boolean)
  }
  if (typeof input === 'string') {
    const trimmed = sanitizeTextValue(input)
    if (!trimmed) return []
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return parsed
          .map(item => sanitizeTextValue(item))
          .filter(Boolean)
      }
    } catch (_) {
      // not JSON, fall through
    }
    return trimmed
      .split(/[,;\n]/)
      .map(part => sanitizeTextValue(part))
      .filter(Boolean)
  }
  return []
}

const parseRequirementText = (input: unknown): string => {
  if (!input) return ''
  if (Array.isArray(input)) {
    return input
      .map(item => sanitizeTextValue(item))
      .filter(Boolean)
      .join('\n')
  }
  if (typeof input === 'string') return sanitizeTextValue(input)
  return ''
}

const toProject = (jobPayload: unknown): Project => {
  const job = (jobPayload || {}) as Record<string, any>
  const timeline = job.timeline || {}
  const startDate = typeof timeline.start_date === 'number'
    ? timeline.start_date
    : typeof timeline.startDate === 'number'
      ? timeline.startDate
      : 0
  const deadline = typeof timeline.deadline === 'number'
    ? timeline.deadline
    : typeof timeline.end_date === 'number'
      ? timeline.end_date
      : typeof timeline.endDate === 'number'
        ? timeline.endDate
        : 0

  const adminId = job.id ?? job.admin_id ?? job.adminId
  const agentId = job.job_id ?? job.agent_job_id ?? job.agentId
  const resolvedId = (job.id ?? agentId ?? adminId ?? `temp-${Date.now()}`).toString()

  const descriptionCandidates = [
    job.description,
    job.project_description,
    job.project_desc,
    job.job_description,
    job.job_overview,
    job.brief
  ]

  let description = ''
  for (const candidate of descriptionCandidates) {
    const sanitized = sanitizeTextValue(candidate)
    if (sanitized) {
      description = sanitized
      break
    }
  }

  const requirementSource =
    job.requirement ??
    job.requirements ??
    job.project_requirement ??
    job.job_requirement ??
    job.project_requirements

  const skillsSource =
    job.skills_needed ??
    job.skills ??
    job.required_skills ??
    job.skills_required ??
    job.skillset

  const rawAgentsBase = Array.isArray(job.agents)
    ? job.agents
    : Array.isArray(job.assigned_agents)
      ? job.assigned_agents
      : Array.isArray(job.agent_details)
        ? job.agent_details
        : []

  const gatherAgentCandidates = (): Record<string, any>[] => {
    const candidates: unknown[] = [
      job.assigned_agent,
      job.agent,
      job.primary_agent,
      job.selected_agent,
      job.accepted_agent,
      job.approved_agent,
      job.accepted_proposal,
      job.acceptedProposal,
      job.approved_proposal,
      job.approvedProposal,
      job.current_agent,
      job.agent_info,
      job.agentProfile
    ]

    const records: Record<string, any>[] = []
    for (const candidate of candidates) {
      if (!candidate) continue
      if (Array.isArray(candidate)) {
        for (const item of candidate) {
          if (item && typeof item === 'object') {
            records.push(item as Record<string, any>)
            const nested = (item as any).agent
            if (nested && typeof nested === 'object') {
              records.push(nested as Record<string, any>)
            }
          }
        }
      } else if (typeof candidate === 'object') {
        records.push(candidate as Record<string, any>)
        const nested = (candidate as any).agent
        if (nested && typeof nested === 'object') {
          records.push(nested as Record<string, any>)
        }
      }
    }

    const singleName = sanitizeTextValue(job.agent_name) || sanitizeTextValue(job.approved_agent_name) || sanitizeTextValue(job.accepted_agent_name)
    const singleEmail = sanitizeTextValue(job.agent_email) || sanitizeTextValue(job.approved_agent_email) || sanitizeTextValue(job.accepted_agent_email)
    const singleId = job.agent_id ?? job.approved_agent_id ?? job.accepted_agent_id
    if (singleName || singleEmail) {
      records.push({ id: singleId, name: singleName, email: singleEmail })
    }

    return records
  }

  const rawAgents = rawAgentsBase.concat(gatherAgentCandidates())

  const agents = rawAgents.reduce<{ id: string; name: string; email?: string; avatar?: string }[]>((acc, agent) => {
    const raw = agent as Record<string, any>
    const idValue = raw?.id ?? raw?.agent_id ?? raw?.user_id ?? raw?.agentId ?? ''
    const id = idValue ? String(idValue) : ''
    const name = sanitizeTextValue(
      raw?.name ??
      raw?.full_name ??
      raw?.display_name ??
      raw?.username ??
      raw?.agent_name
    ) || 'Assigned Agent'

    const email = sanitizeTextValue(
      raw?.email ??
      raw?.agent_email ??
      raw?.contact_email ??
      raw?.user_email
    ) || undefined

    const avatar = raw?.avatar || raw?.profile_image || raw?.avatar_url

    const resolvedId = id || (name ? `agent-${acc.length + 1}-${Date.now()}` : '')
    if (!resolvedId && !name) {
      return acc
    }

    const existingIndex = resolvedId ? acc.findIndex(existing => existing.id === resolvedId) : -1
    if (existingIndex >= 0) {
      const existing = acc[existingIndex]
      if (!existing.email && email) {
        existing.email = email
      }
      if (existing.name === 'Assigned Agent' && name) {
        existing.name = name
      }
      if (!existing.avatar && avatar) {
        existing.avatar = avatar
      }
      return acc
    }

    acc.push({
      id: resolvedId,
      name,
      email,
      avatar
    })
    return acc
  }, [])

  const categoryCandidate = sanitizeTextValue(job.primary_area_of_expertise) || sanitizeTextValue(job.category) || sanitizeTextValue(job.project_category)
  const category = categoryCandidate || 'General'

  const budget = typeof job.budget === 'number' ? job.budget : Number(job.budget ?? 0)
  const requirementText = parseRequirementText(requirementSource)
  const skills = parseSkillsList(skillsSource)

  const projectTitleCandidate =
    sanitizeTextValue(job.project_title) ||
    sanitizeTextValue(job.title)
  const projectTitle = projectTitleCandidate || 'Untitled Project'

  return {
    id: resolvedId,
    admin_id: adminId ? adminId.toString() : undefined,
    project_title: projectTitle,
    category,
    budget: Number.isFinite(budget) ? budget : 0,
    description,
    requirement: requirementText,
    skills_needed: skills,
    date_created: typeof job.date_created === 'number' ? job.date_created : 0,
    timeline: {
      start_date: startDate,
      deadline: deadline
    },
    agents,
    status: typeof job.status === 'string' ? job.status : undefined,
    admin_approved: typeof job.admin_approved === 'boolean' ? job.admin_approved : undefined
  }
}

const fetchActiveProjects = async () => {
  try {
    const response = await getClientJobs(0, 10)
    if (!response.success || !response.data) {
      activeProjects.value = []
      return
    }
    const jobsData = Array.isArray(response.data) ? response.data : [response.data]
    const approvedJobs = jobsData.filter((job: any) => job?.admin_approved === true)
    activeProjects.value = approvedJobs.map(job => toProject(job))
  } catch (err) {
    console.error('Error fetching active projects:', err)
    error.value = 'Failed to load active projects'
  }
}

const fetchPendingProjects = async () => {
  try {
    // Fetch all client's projects for pending tab
    const response = await getClientJobs(0, 10)
    if (!response.success || !response.data) {
      pendingProjects.value = []
      return
    }
    const jobsData = Array.isArray(response.data) ? response.data : [response.data]
    // Filter out approved jobs - only show pending (unapproved) jobs
    const pendingJobs = jobsData.filter((job: any) => job.admin_approved !== true)
    pendingProjects.value = pendingJobs.map((job) => toProject(job))
  } catch (err) {
    console.error('Error fetching pending projects:', err)
    error.value = 'Failed to load pending projects'
  }
}

const fetchProjects = () => {
  if (activeTab.value === 'active') {
    fetchActiveProjects()
  } else {
    fetchPendingProjects()
  }
}

// Watch for tab changes
watch(activeTab, fetchProjects)

// Fetch initial data
onMounted(() => {
  fetchProjects()
})

const cacheProjectContext = (project: Project) => {
  const jobId = project?.id ? String(project.id) : ''
  if (!jobId) return

  const jobPayload = {
    agent_job_id: jobId,
    admin_job_id: project.admin_id || jobId,
    project
  }

  try {
    localStorage.setItem('selectedJobContext', JSON.stringify(jobPayload))
    localStorage.setItem(
      'selectedClientProject',
      JSON.stringify({
        ...project,
        requirement: project.requirement,
        skills_needed: project.skills_needed,
        agents: project.agents
      })
    )
    localStorage.setItem(
      'selectedProject',
      JSON.stringify({
        id: jobId,
        job_id: jobId,
        title: project.project_title,
        requirement: project.requirement,
        skills_needed: project.skills_needed,
        description: project.description,
        category: project.category,
        budget: project.budget,
        timeline: project.timeline,
        agents: project.agents || []
      })
    )
  } catch (err) {
    console.warn('Unable to cache job context', err)
  }
}

const goToProject = (project: Project) => {
  if (!project?.id) return
  cacheProjectContext(project)
  router.push({ name: 'client-job-details', params: { id: String(project.id) } })
}

const goToJobPage = (project: Project) => {
  if (!project?.id) return
  cacheProjectContext(project)
  router.push({ name: 'client-job-overview', params: { id: String(project.id) } })
}

const goToProjectWorkLogs = (project: Project) => {
  if (!project?.id) return
  cacheProjectContext(project)
  router.push({ name: 'client-work-log', params: { jobId: String(project.id) } })
}

const goToCreateProject = () => {
  router.push({ name: 'client-create-job' })
}

const confirmDeleteProject = async (project: Project) => {
  if (!project.id) return
  
  const confirmed = window.confirm('Are you sure you want to delete this project? This action cannot be undone.')
  if (!confirmed) return
  
  try {
    deletingJobIds.value.push(project.id)
    const response = await deleteJob(project.id)
    
    if (response.success) {
      // Remove from the appropriate list based on tab
      if (activeTab.value === 'pending') {
        pendingProjects.value = pendingProjects.value.filter(p => p.id !== project.id)
      } else {
        activeProjects.value = activeProjects.value.filter(p => p.id !== project.id)
      }
      toast.success('Project deleted successfully')
    } else {
      throw new Error(response.error || 'Failed to delete project')
    }
  } catch (error) {
    console.error('Error deleting project:', error)
    toast.error(error instanceof Error ? error.message : 'Failed to delete project')
  } finally {
    removeDeletingId(project.id)
  }
}
</script>

<style scoped>
</style>

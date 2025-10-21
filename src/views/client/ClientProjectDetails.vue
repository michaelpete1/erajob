<template>
  <div class="min-h-screen bg-gray-50 pb-24">
    <header class="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div class="max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
        <div class="flex items-center gap-3">
          <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors" @click="goBack" title="Back to projects">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900">{{ projectTitle }}</h1>
            <p class="text-xs sm:text-sm text-gray-500">Project overview & work log approvals</p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-2">
          <button
            class="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
            @click="openJobPage"
          >
            View Job Page
          </button>
          <button
            class="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold bg-teal-500 text-white hover:bg-teal-600 transition-colors"
            @click="openFullLogPage"
          >
            Open Work Log Page
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <section class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div class="p-6">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div class="flex items-center gap-3 mb-3" v-if="projectCategory || projectStatus">
                <span
                  v-if="projectCategory"
                  class="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-600 text-xs font-semibold rounded-full"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18M3 17h18" />
                  </svg>
                  {{ projectCategory }}
                </span>
                <span
                  v-if="projectStatus"
                  :class="['px-3 py-1 text-xs font-semibold rounded-full', statusBadgeClass]"
                >
                  {{ projectStatus }}
                </span>
              </div>
              <p v-if="projectDescription" class="text-gray-700 leading-relaxed">{{ projectDescription }}</p>
              <p v-else class="text-sm text-gray-500">Project description not provided.</p>
            </div>
            <div class="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 min-w-[220px]">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Budget</p>
              <p class="text-xl font-bold text-gray-900 mt-1">{{ projectBudget }}</p>
              <div class="mt-4 space-y-2 text-xs text-gray-500">
                <div><span class="font-semibold text-gray-600">Start:</span> {{ projectStartDate }}</div>
                <div><span class="font-semibold text-gray-600">Deadline:</span> {{ projectDeadline }}</div>
              </div>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 class="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-3">Requirements</h2>
              <ul v-if="parsedRequirements.length" class="space-y-2">
                <li
                  v-for="(req, idx) in parsedRequirements"
                  :key="`req-${idx}`"
                  class="flex items-start gap-2 text-sm text-gray-700"
                >
                  <span class="mt-1 w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                  <span>{{ req }}</span>
                </li>
              </ul>
              <p v-else class="text-sm text-gray-500">No requirements listed for this project.</p>
            </div>
            <div>
              <h2 class="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-3">Skills Needed</h2>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(skill, idx) in projectSkills"
                  :key="`skill-${idx}`"
                  class="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 border border-gray-200"
                >
                  {{ skill }}
                </span>
                <span v-if="projectSkills.length === 0" class="text-sm text-gray-500">No skills specified.</span>
              </div>
            </div>
          </div>

          <div v-if="agentNames.length" class="mt-6">
            <h2 class="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-3">Assigned Agents</h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(name, idx) in agentNames"
                :key="`agent-${idx}`"
                class="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-teal-50 text-teal-700 border border-teal-100"
              >
                <span class="w-2 h-2 rounded-full bg-teal-500 mr-2"></span>
                {{ name }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div class="p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Work Logs</h2>
              <p class="text-sm text-gray-500">Review submitted hours and manage approvals directly from this page.</p>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-teal-50 border border-teal-100 rounded-xl px-4 py-3 text-sm">
                <p class="text-xs uppercase font-semibold text-teal-700">Total Hours</p>
                <p class="text-xl font-bold text-teal-800 mt-1">{{ totalLoggedHours.toFixed(1) }}h</p>
              </div>
              <div class="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm">
                <p class="text-xs uppercase font-semibold text-blue-700">Last 7 Days</p>
                <p class="text-xl font-bold text-blue-800 mt-1">{{ weeklyLoggedHours.toFixed(1) }}h</p>
              </div>
            </div>
          </div>

          <div v-if="successMessage" class="mb-4 px-4 py-3 rounded-lg border border-green-200 bg-green-50 text-green-800 text-sm">
            {{ successMessage }}
          </div>
          <div v-if="actionError" class="mb-4 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
            {{ actionError }}
          </div>

          <div v-if="isProjectLoading" class="py-10 flex justify-center">
            <div class="animate-spin h-10 w-10 border-2 border-teal-500 border-t-transparent rounded-full"></div>
          </div>
          <div v-else>
            <div v-if="logsLoading" class="py-10 flex justify-center">
              <div class="animate-spin h-10 w-10 border-2 border-teal-500 border-t-transparent rounded-full"></div>
            </div>

            <div v-else-if="logsError" class="rounded-lg border border-red-200 bg-red-50 px-4 py-5">
              <p class="text-sm text-red-600">{{ logsError }}</p>
              <button
                class="mt-3 inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors"
                @click="fetchWorkLogs"
              >
                Retry
              </button>
            </div>

            <div v-else-if="displayLogs.length === 0" class="rounded-lg border border-dashed border-gray-300 px-6 py-8 text-center">
              <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="mt-3 text-sm font-semibold text-gray-900">No work logs yet</h3>
              <p class="mt-1 text-sm text-gray-500">Logs submitted by assigned agents will appear here for review.</p>
            </div>

            <div v-else class="space-y-4">
              <article
                v-for="log in displayLogs"
                :key="log.id"
                class="border border-gray-200 rounded-xl p-5 shadow-sm bg-white"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <div class="h-11 w-11 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center font-semibold">
                        {{ log.initials }}
                      </div>
                      <div>
                        <h3 class="text-sm font-semibold text-gray-800">{{ log.title }}</h3>
                        <p class="text-xs text-gray-500">{{ log.dateLabel }}</p>
                      </div>
                    </div>

                    <p class="text-sm text-gray-700" v-if="log.comment">{{ log.comment }}</p>
                    <p class="text-sm text-gray-400" v-else>No additional description provided.</p>

                    <div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span class="inline-flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ log.hours.toFixed(1) }} hours
                      </span>
                      <span :class="['px-2 py-1 rounded-full font-semibold', log.statusClasses]">{{ log.statusLabel }}</span>
                      <span v-if="log.rejectionReason" class="text-red-600">Reason: {{ log.rejectionReason }}</span>
                    </div>

                    <div v-if="log.files.length" class="mt-3">
                      <h4 class="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Attachments</h4>
                      <div class="flex flex-wrap gap-2">
                        <a
                          v-for="(file, fileIdx) in log.files"
                          :key="`${log.id}-file-${fileIdx}`"
                          :href="file"
                          target="_blank"
                          class="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-100"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-4.553a2.1 2.1 0 10-2.971-2.971L12.029 7.029m-1.058 1.058L6.447 12.61a2.1 2.1 0 102.971 2.971l3.473-3.473" />
                          </svg>
                          Attachment {{ fileIdx + 1 }}
                        </a>
                      </div>
                    </div>

                    <div class="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        v-if="!log.clientApproved && !log.rejectionReason"
                        class="inline-flex items-center px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-teal-500 text-white hover:bg-teal-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        :disabled="actionLoadingId === log.id"
                        @click="approveLog(log.id)"
                      >
                        {{ actionLoadingId === log.id ? 'Approving...' : 'Approve Log' }}
                      </button>
                      <button
                        v-if="!log.clientApproved && !log.rejectionReason"
                        class="inline-flex items-center px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        :disabled="actionLoadingId === log.id"
                        @click="promptReject(log.id)"
                      >
                        Reject Log
                      </button>
                      <button
                        class="inline-flex items-center px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        @click="openFullLogPage"
                      >
                        View in Work Log Page
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobs } from '@/composables/useJobs'
import { workLogsService } from '@/services/workLogsService'
import type { Skill, JobTimeline, WorkLogOut } from '@/types/api'

interface ExtendedJobOut {
  id?: string | null
  project_title: string
  description: string
  category: string
  budget: number
  requirement: string
  skills_needed: Skill[] | string | null | undefined
  timeline: JobTimeline
  date_created?: number | null
  last_updated?: number | null
  admin_approved?: boolean
  break_down?: {
    Charges: number
    Tax: number
  }
  status?: string
  agents?: Array<Record<string, any>>
}

interface DisplayLog {
  id: string
  title: string
  comment: string
  hours: number
  dateLabel: string
  initials: string
  statusLabel: string
  statusClasses: string
  clientApproved: boolean
  rejectionReason?: string | null
  files: string[]
}

const route = useRoute()
const router = useRouter()
const { getJobById, loading: jobsLoading } = useJobs()

const jobId = ref('')
const project = ref<ExtendedJobOut | null>(null)

const logs = ref<WorkLogOut[]>([])
const logsLoading = ref(false)
const logsError = ref<string | null>(null)
const actionError = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const actionLoadingId = ref<string | null>(null)
const agentDirectory = ref<Record<string, string>>({})

const projectTitle = computed(() => project.value?.project_title?.trim() || '—')
const projectDescription = computed(() => project.value?.description?.trim() || '')
const projectCategory = computed(() => project.value?.category?.trim() || '')
const projectBudget = computed(() => {
  const budget = project.value?.budget
  if (typeof budget === 'number' && !Number.isNaN(budget)) {
    return `$${budget.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
  }
  return '—'
})

const rawStatus = computed(() => project.value?.status?.toLowerCase() || '')
const projectStatus = computed(() => {
  if (!rawStatus.value) return ''
  const formatted = rawStatus.value.replace(/_/g, ' ')
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
})

const projectStartDate = computed(() => formatDate(project.value?.timeline?.start_date ?? null))
const projectDeadline = computed(() => formatDate(project.value?.timeline?.deadline ?? null))
const projectSkills = computed(() => {
  const raw = project.value?.skills_needed
  if (!raw) return [] as string[]
  if (Array.isArray(raw)) return raw.map(skill => (typeof skill === 'string' ? skill : String(skill)))
  if (typeof raw === 'string') return raw.split(',').map(skill => skill.trim()).filter(Boolean)
  return [] as string[]
})
const agentNames = computed(() => Object.values(agentDirectory.value))

const statusBadgeClass = computed(() => {
  const status = rawStatus.value
  if (status.includes('complete')) return 'bg-green-50 text-green-700 border border-green-200'
  if (status.includes('pending')) return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
  if (!status) return 'bg-gray-100 text-gray-600 border border-gray-200'
  return 'bg-blue-50 text-blue-700 border border-blue-200'
})

const isProjectLoading = computed(() => jobsLoading.value)

const formatDate = (timestamp: number | null): string => {
  if (!timestamp) return '—'
  const ms = timestamp > 1_000_000_000_000 ? timestamp : timestamp * 1000
  const date = new Date(ms)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const parsedRequirements = computed(() => {
  if (!project.value?.requirement) return [] as string[]
  return project.value.requirement
    .split(',')
    .map(req => req.trim())
    .filter(Boolean)
})

const normalizeTimestamp = (timestamp?: number | null): number => {
  if (!timestamp) return 0
  return timestamp > 1_000_000_000_000 ? timestamp : timestamp * 1000
}

const formatTimestamp = (timestamp?: number | null): string => {
  if (!timestamp) return ''
  const ms = normalizeTimestamp(timestamp)
  const date = new Date(ms)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString()
}

const getInitials = (name: string): string => {
  if (!name) return 'AG'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const resolveAgentName = (agentId: string): string => {
  return agentDirectory.value[agentId] || agentId || 'Assigned Agent'
}

const normalizeLog = (log: WorkLogOut): DisplayLog => {
  const agentName = resolveAgentName(log.agent_id)
  const clientApproved = Boolean(log.client_approved)
  const rejected = Boolean(log.rejection_reason)

  let statusLabel = 'Pending Approval'
  let statusClasses = 'bg-yellow-100 text-yellow-800'

  if (clientApproved) {
    statusLabel = 'Approved'
    statusClasses = 'bg-green-100 text-green-800'
  } else if (rejected) {
    statusLabel = 'Rejected'
    statusClasses = 'bg-red-100 text-red-700'
  }

  const attachments = Array.isArray(log.files) ? log.files.filter(Boolean) : []

  return {
    id: log.id,
    title: log.log_title || `Work log from ${agentName}`,
    comment: log.log_comment || '',
    hours: typeof log.hours === 'number' ? log.hours : 0,
    dateLabel: formatTimestamp(log.date_created),
    initials: getInitials(agentName),
    statusLabel,
    statusClasses,
    clientApproved,
    rejectionReason: log.rejection_reason,
    files: attachments
  }
}

const displayLogs = computed<DisplayLog[]>(() => logs.value.map(normalizeLog))

const totalLoggedHours = computed(() =>
  logs.value.reduce((sum, log) => sum + (typeof log.hours === 'number' ? log.hours : 0), 0)
)

const weeklyLoggedHours = computed(() => {
  const now = Date.now()
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000
  return logs.value.reduce((sum, log) => {
    const timestamp = normalizeTimestamp(log.date_created)
    if (timestamp >= oneWeekAgo) {
      sum += typeof log.hours === 'number' ? log.hours : 0
    }
    return sum
  }, 0)
})

const loadProjectContext = () => {
  try {
    const storedProject = localStorage.getItem('selectedClientProject') || localStorage.getItem('selectedProject')
    if (storedProject) {
      const parsed = JSON.parse(storedProject) as Record<string, any>
      if (Array.isArray(parsed?.agents)) {
        const directory: Record<string, string> = {}
        parsed.agents.forEach((agent: any) => {
          const id = String(agent?.id || agent?.agent_id || '')
          if (id) {
            directory[id] = agent?.name || agent?.full_name || agent?.display_name || id
          }
        })
        agentDirectory.value = directory
      }
    }
  } catch (err) {
    console.warn('Unable to hydrate agent directory from storage', err)
  }
}

const fetchProject = async () => {
  if (!jobId.value) return

  try {
    const response = await getJobById(jobId.value)
    if (response?.success && response.data) {
      const data = response.data as Record<string, any>
      const skills: Skill[] =
        typeof data.skills_needed === 'string'
          ? data.skills_needed.split(',').map((skill: string) => skill.trim())
          : (data.skills_needed as Skill[]) || []

      project.value = {
        id: data.id,
        project_title: data.project_title || data.title || '',
        description: data.description || '',
        category: data.category || 'General',
        budget: data.budget || 0,
        requirement: data.requirement || '',
        skills_needed: skills,
        timeline: data.timeline || { start_date: 0, deadline: 0 },
        date_created: data.date_created,
        last_updated: data.last_updated,
        admin_approved: data.admin_approved,
        break_down: data.break_down,
        status: data.status || 'active',
        agents: Array.isArray(data.agents) ? data.agents : []
      }

      if (Array.isArray(project.value.agents)) {
        const directory: Record<string, string> = {}
        project.value.agents.forEach(agent => {
          const id = String(agent?.id || agent?.agent_id || '')
          if (id) {
            directory[id] = agent?.name || agent?.full_name || agent?.display_name || id
          }
        })
        agentDirectory.value = { ...agentDirectory.value, ...directory }
      }
    }
  } catch (err) {
    console.error('Error fetching project details', err)
  }
}

const fetchWorkLogs = async () => {
  if (!jobId.value) {
    logsError.value = 'No project selected'
    return
  }

  logsLoading.value = true
  logsError.value = null
  actionError.value = null
  try {
    const response = await workLogsService.listClientLogsForJob(jobId.value)
    if (response.success && Array.isArray(response.data)) {
      logs.value = response.data
    } else {
      logs.value = []
      logsError.value = response.error || 'Failed to load work logs.'
    }
  } catch (err: any) {
    logs.value = []
    logsError.value = err?.message || 'Failed to load work logs.'
  } finally {
    logsLoading.value = false
  }
}

const approveLog = async (logId: string) => {
  actionError.value = null
  successMessage.value = null
  actionLoadingId.value = logId
  try {
    const response = await workLogsService.approveWorkLog(logId)
    if (response.success) {
      successMessage.value = 'Work log approved successfully.'
      await fetchWorkLogs()
    } else {
      actionError.value = response.error || 'Failed to approve work log.'
    }
  } catch (err: any) {
    actionError.value = err?.message || 'Failed to approve work log.'
  } finally {
    actionLoadingId.value = null
  }
}

const promptReject = async (logId: string) => {
  const reason = window.prompt('Please provide a reason for rejecting this log:')
  if (reason === null) return

  const trimmed = reason.trim()
  if (!trimmed) {
    actionError.value = 'Rejection reason is required.'
    return
  }

  await rejectLog(logId, trimmed)
}

const rejectLog = async (logId: string, reason: string) => {
  actionError.value = null
  successMessage.value = null
  actionLoadingId.value = logId
  try {
    const response = await workLogsService.rejectWorkLog(logId, reason)
    if (response.success) {
      successMessage.value = 'Work log rejected successfully.'
      await fetchWorkLogs()
    } else {
      actionError.value = response.error || 'Failed to reject work log.'
    }
  } catch (err: any) {
    actionError.value = err?.message || 'Failed to reject work log.'
  } finally {
    actionLoadingId.value = null
  }
}

const goBack = () => {
  router.back()
}

const openJobPage = () => {
  if (!jobId.value) return
  router.push({ name: 'client-job-description', params: { id: jobId.value } })
}

const openFullLogPage = () => {
  if (!jobId.value) return
  try {
    localStorage.setItem(
      'selectedProject',
      JSON.stringify({
        id: jobId.value,
        job_id: jobId.value,
        title: projectTitle.value,
        agents: project.value?.agents || []
      })
    )
  } catch (err) {
    console.warn('Unable to persist project context for work logs', err)
  }
  router.push({ name: 'client-work-log', params: { jobId: jobId.value } })
}

onMounted(async () => {
  const routeId = route.params.id
  if (typeof routeId === 'string') {
    jobId.value = routeId
  } else if (Array.isArray(routeId) && routeId.length > 0 && typeof routeId[0] === 'string') {
    jobId.value = routeId[0]
  }

  if (!jobId.value) {
    const stored = localStorage.getItem('selectedProject')
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { id?: string; job_id?: string }
        const candidate = parsed?.job_id || parsed?.id
        if (typeof candidate === 'string') {
          jobId.value = candidate
        }
      } catch (err) {
        console.warn('Unable to parse stored project id', err)
      }
    }
  }

  loadProjectContext()
  await fetchProject()
  await fetchWorkLogs()
})
</script>

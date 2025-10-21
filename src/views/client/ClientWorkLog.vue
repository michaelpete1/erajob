<template>
  <div class="min-h-screen bg-gray-50 pb-16 sm:pb-20">
    <!-- Top Navbar -->
    <nav class="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <!-- Left Section -->
        <div class="flex items-center gap-3 sm:gap-4">
          <button @click="$router.back()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Back">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
              <span class="text-white font-semibold text-sm sm:text-base">C</span>
            </div>
            <div>
              <h1 class="text-lg sm:text-xl font-bold text-gray-800">Work Log</h1>
              <p class="text-xs sm:text-sm text-gray-500">{{ projectName }}</p>
            </div>
          </div>
        </div>

        <!-- Right Section -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Filter -->
          <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Filter">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
          
          <!-- Export -->
          <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Export">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          
          <!-- User Profile -->
          <button class="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors" title="Profile">
            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
              <span class="text-white font-semibold text-sm sm:text-base">C</span>
            </div>
          </button>
        </div>
      </div>
    </nav>

    <!-- View Toggle -->
    <div class="px-4 sm:px-6 py-4 sm:py-6">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-1 flex">
          <button 
            @click="currentView = 'Daily'" 
            :class="{ 'bg-teal-500 text-white shadow-sm': currentView === 'Daily' }"
            class="flex-1 py-3 px-4 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 hover:bg-gray-50"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4M8 7h8M8 7l-4 9h16l-4-9" />
            </svg>
            Daily View
          </button>
          <button 
            @click="currentView = 'Weekly'" 
            :class="{ 'bg-teal-500 text-white shadow-sm': currentView === 'Weekly' }"
            class="flex-1 py-3 px-4 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 hover:bg-gray-50"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Weekly View
          </button>
        </div>
      </div>
    </div>

    <!-- Work Logs -->
    <div class="px-4 sm:px-6 pb-6">
      <div class="max-w-4xl mx-auto space-y-3 sm:space-y-4">
        <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3">
          {{ successMessage }}
        </div>
        <div v-if="actionError" class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
          {{ actionError }}
        </div>

        <!-- Summary Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
          <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs sm:text-sm text-gray-500 font-medium">Total Hours</p>
                <p class="text-xl sm:text-2xl font-bold text-gray-800">{{ totalLoggedHours.toFixed(1) }}</p>
              </div>
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs sm:text-sm text-gray-500 font-medium">This Week</p>
                <p class="text-xl sm:text-2xl font-bold text-gray-800">{{ weeklyLoggedHours.toFixed(1) }}h</p>
              </div>
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Work Log Entries -->
        <div class="space-y-3">
          <div v-if="loading" class="bg-white rounded-xl border border-gray-200 p-8 flex justify-center">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
          </div>

          <div v-else-if="error" class="bg-white rounded-xl border border-red-200 p-6">
            <p class="text-sm text-red-600">{{ error }}</p>
            <button class="mt-4 inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors" @click="fetchWorkLogs">
              Retry
            </button>
          </div>

          <div v-else-if="displayLogs.length === 0" class="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="mt-3 text-sm font-semibold text-gray-900">No work logs yet</h3>
            <p class="mt-1 text-sm text-gray-500">Logs submitted by agents will appear here for your review.</p>
          </div>

          <div
            v-else
            v-for="log in displayLogs"
            :key="log.id"
            class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 transition-all duration-300"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {{ log.initials }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-sm sm:text-base font-semibold text-gray-800 truncate">{{ log.title }}</h3>
                    <p class="text-xs sm:text-sm text-gray-500">{{ log.dateLabel }}</p>
                  </div>
                </div>

                <div class="ml-12 sm:ml-14 space-y-3">
                  <p class="text-sm sm:text-base text-gray-700" v-if="log.comment">{{ log.comment }}</p>
                  <p class="text-sm text-gray-400" v-else>No additional description provided.</p>

                  <div class="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
                    <div class="flex items-center gap-1 text-gray-500">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{{ log.hours.toFixed(1) }} hours</span>
                    </div>
                    <span :class="['px-2 py-1 rounded-full text-xs font-medium', log.statusClasses]">
                      {{ log.statusLabel }}
                    </span>
                    <span v-if="log.rejectionReason" class="text-xs text-red-600">Reason: {{ log.rejectionReason }}</span>
                  </div>

                  <div v-if="log.files.length" class="pt-1">
                    <h4 class="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Attachments</h4>
                    <div class="flex flex-wrap gap-2">
                      <a
                        v-for="(file, index) in log.files"
                        :key="`${log.id}-file-${index}`"
                        :href="file"
                        target="_blank"
                        class="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                        @click.stop
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-4.553a2.1 2.1 0 10-2.971-2.971L12.029 7.029m-1.058 1.058L6.447 12.61a2.1 2.1 0 102.971 2.971l3.473-3.473" />
                        </svg>
                        <span>Attachment {{ index + 1 }}</span>
                      </a>
                    </div>
                  </div>

                  <div class="flex flex-wrap items-center gap-3 pt-3">
                    <button
                      v-if="!log.clientApproved && !log.rejectionReason"
                      class="inline-flex items-center px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      :disabled="actionLoadingId === log.id"
                      @click.stop="approveLog(log.id)"
                    >
                      {{ actionLoadingId === log.id ? 'Approving...' : 'Approve Log' }}
                    </button>
                    <button
                      v-if="!log.clientApproved && !log.rejectionReason"
                      class="inline-flex items-center px-4 py-2 text-xs sm:text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      :disabled="actionLoadingId === log.id"
                      @click.stop="promptReject(log.id)"
                    >
                      Reject Log
                    </button>
                    <button
                      class="inline-flex items-center px-4 py-2 text-xs sm:text-sm font-semibold text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
                      @click.stop="goToLogDetail(log)"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { workLogsService } from '@/services/workLogsService'
import type { WorkLogOut } from '@/types/api'

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

const router = useRouter()
const route = useRoute()

const currentView = ref<'Daily' | 'Weekly'>('Daily')
const projectName = ref('Project Work Log')
const jobId = ref('')

const loading = ref(false)
const error = ref<string | null>(null)
const actionError = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const actionLoadingId = ref<string | null>(null)

const rawLogs = ref<WorkLogOut[]>([])
const agentDirectory = ref<Record<string, string>>({})

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

const displayLogs = computed<DisplayLog[]>(() => rawLogs.value.map(normalizeLog))

const totalLoggedHours = computed(() =>
  rawLogs.value.reduce((sum, log) => sum + (typeof log.hours === 'number' ? log.hours : 0), 0)
)

const weeklyLoggedHours = computed(() => {
  const now = Date.now()
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000
  return rawLogs.value.reduce((sum, log) => {
    const timestamp = normalizeTimestamp(log.date_created)
    if (timestamp >= oneWeekAgo) {
      sum += typeof log.hours === 'number' ? log.hours : 0
    }
    return sum
  }, 0)
})

const fetchWorkLogs = async () => {
  if (!jobId.value) {
    error.value = 'No project selected'
    return
  }

  loading.value = true
  error.value = null
  actionError.value = null
  try {
    const response = await workLogsService.listClientLogsForJob(jobId.value)
    if (response.success && Array.isArray(response.data)) {
      rawLogs.value = response.data
    } else {
      rawLogs.value = []
      error.value = response.error || 'Failed to load work logs.'
    }
  } catch (err: any) {
    rawLogs.value = []
    error.value = err?.message || 'Failed to load work logs.'
  } finally {
    loading.value = false
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
  if (reason === null) {
    return
  }

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

const goToLogDetail = (log: DisplayLog) => {
  try {
    localStorage.setItem('selectedWorkLog', JSON.stringify(log))
  } catch (err) {
    console.warn('Unable to cache selected work log', err)
  }
  router.push({ name: 'client-work-log-dashboard', params: { jobId: jobId.value } })
}

const loadProjectContext = () => {
  try {
    const storedProject = localStorage.getItem('selectedClientProject') || localStorage.getItem('selectedProject')
    if (storedProject) {
      const project = JSON.parse(storedProject) as Record<string, any>
      if (project?.title) {
        projectName.value = project.title
      }

      if (!jobId.value) {
        const projectJobId = project?.job_id || project?.id || project?.project_id
        if (typeof projectJobId === 'string') {
          jobId.value = projectJobId
        }
      }

      if (Array.isArray(project?.agents)) {
        const directory: Record<string, string> = {}
        project.agents.forEach((agent: any) => {
          const id = String(agent?.id || agent?.agent_id || '')
          if (id) {
            directory[id] = agent?.name || agent?.full_name || id
          }
        })
        agentDirectory.value = directory
      }
    }
  } catch (e) {
    console.error('Error loading project context:', e)
  }
}

onMounted(async () => {
  const paramJobId = route.params?.jobId
  if (typeof paramJobId === 'string') {
    jobId.value = paramJobId
  } else if (Array.isArray(paramJobId) && paramJobId.length > 0 && typeof paramJobId[0] === 'string') {
    jobId.value = paramJobId[0]
  }

  loadProjectContext()

  await fetchWorkLogs()
})
</script>

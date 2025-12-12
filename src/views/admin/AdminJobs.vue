<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-800">Jobs</h1>
        <div class="flex items-center gap-2">
          <button @click="refresh" :disabled="loading" class="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">Refresh</button>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-700 font-medium">{{ error }}</p>
      </div>

  <div v-else>
    <div v-if="jobs.length === 0" class="text-center text-gray-600 py-12">
      <p>No jobs found</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="job in displayJobs" :key="jobKey(job)" class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div class="min-w-0">
            <h2 class="text-lg font-semibold text-gray-900 truncate flex items-center gap-2">
              <span class="truncate">{{ jobTitle(job) }}</span>
              <span v-if="hasMeeting(job)" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">Meeting Set</span>
            </h2>
            <p class="text-sm text-gray-600 mt-1 truncate">{{ jobDescription(job) }}</p>
            <div class="mt-2 text-xs text-gray-500">Category: <span class="font-medium text-gray-700">{{ jobCategory(job) }}</span></div>
            <div class="mt-1 text-xs text-gray-500">Budget: <span class="font-medium text-gray-700">{{ jobBudget(job) }}</span></div>
            <div class="mt-1 text-xs text-gray-500" v-if="clientName(job)">
              Client: <span class="font-medium text-gray-700">{{ clientName(job) }}</span>
              <span v-if="clientEmail(job)" class="text-gray-400"> • {{ clientEmail(job) }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 sm:flex-col sm:items-stretch">
            <button @click="goToProposal(job)" class="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-sm">Propose to Client</button>
            <button @click="memoSelected(job)" class="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm">Memo to Agent</button>
          </div>
        </div>

              <div v-if="expandedJobId === jobId(job)" class="mt-4 border-t border-gray-100 pt-3">
              <div v-if="jobAgents(job).length > 0" class="space-y-2">
                <div class="text-sm font-medium text-gray-700">{{ jobAgentsLabel(job) }}</div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div v-for="agent in jobAgents(job)" :key="resolveAgentId(agent) || String(agent)" class="flex items-center justify-between border border-gray-200 rounded-lg p-2">
                    <div class="text-sm text-gray-700 truncate">{{ agentName(agent) }}</div>
                    <button @click="goToMemoWithJob(job, agent)" class="px-2 py-1 bg-gray-900 text-white rounded-md text-xs">Memo</button>
                  </div>
                </div>
              </div>
              <div v-else class="text-sm text-gray-600">No agents assigned.</div>
              <div class="mt-3" v-if="jobAgents(job).length === 0">
                <button @click="showFindAgents(job)" class="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">Find Agents</button>
              </div>
              </div>
          </div>
        </div>
      </div>

      <AdminFindAgentsModal
        :is-open="isFindAgentsOpen"
        :job="activeJobForAgents"
        @close="isFindAgentsOpen = false"
        @agentAssigned="handleAgentAssigned"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminFindAgentsModal from '@/components/AdminFindAgentsModal.vue'
import { api, apiClient } from '@/services/apiService'
import { alertsService } from '@/services/notificationsService'

const router = useRouter()
const jobs = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const expandedJobId = ref<string>('')
const isFindAgentsOpen = ref(false)
const activeJobForAgents = ref<{ id: string; title: string; category: string; pay: string } | null>(null)
const agentCache = ref<Record<string, any>>({})

const resolveAgentId = (agent: any): string => {
  const candidates: unknown[] = [
    agent?.id,
    agent?._id,
    agent?.user_id,
    agent?.agent_id,
    agent?.uuid,
    agent?.profile_id,
    agent?.account_id,
    agent?.user?.id,
    agent?.user?.uuid,
    agent?.agent?.id,
    agent?.agent?.uuid
  ]
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim().length > 0) return c.trim()
    if (typeof c === 'number') return String(c)
  }
  const email = typeof agent?.email === 'string' ? agent.email.trim() : ''
  if (email) return email
  return ''
}

const jobId = (job: any): string => String(job?.id || job?.job_id || job?.ID || '')
const jobKey = (job: any): string => String(jobId(job) || Math.random().toString(36))
const jobTitle = (job: any): string => String(job?.project_title || job?.job_title || job?.title || 'Untitled Job')
const jobDescription = (job: any): string => String(job?.description || job?.requirement || '')
const jobCategory = (job: any): string => String(job?.category || job?.primary_area_of_expertise || 'General')
const jobBudget = (job: any): string => {
  const b = job?.budget
  return typeof b === 'number' ? `$${b.toLocaleString()}` : String(b || '$0')
}
const jobAgents = (job: any): any[] => {
  const singleAgent = (() => {
    const aObj = job?.agent
    const aId = String(job?.agent_id || '').trim()
    const assigned = String(job?.assigned_agent || '').trim()
    if (aObj && (aObj.id || aObj._id || aObj.user_id || aObj.email)) return [aObj]
    if (aId) return [aId]
    if (assigned) return [assigned]
    return []
  })()
  if (singleAgent.length > 0) return singleAgent
  if (Array.isArray(job?.recommended_agents) && job.recommended_agents.length > 0) return job.recommended_agents
  if (Array.isArray(job?.selected_agents) && job.selected_agents.length > 0) return job.selected_agents
  if (Array.isArray(job?.agents) && job.agents.length > 0) return job.agents
  return []
}
const jobAgentsLabel = (job: any): string => {
  const hasAssigned = !!job?.agent || !!job?.agent_id || !!job?.assigned_agent
  if (hasAssigned) return 'Assigned Agent'
  if (Array.isArray(job?.recommended_agents) && job.recommended_agents.length > 0) return 'Recommended Agent'
  return 'Agents'
}
const agentName = (agent: any): string => {
  const key = typeof agent === 'string' ? agent : resolveAgentId(agent)
  const cached = key ? agentCache.value[key] : null
  if (cached) return String(cached?.full_name || cached?.name || cached?.email || cached?.id || 'Agent')
  return String((agent as any)?.full_name || (agent as any)?.name || (agent as any)?.email || resolveAgentId(agent) || 'Agent')
}
const ensureAgentDetail = async (agent: any) => {
  const key = typeof agent === 'string' ? agent : resolveAgentId(agent)
  if (!key || agentCache.value[key]) return
  if (typeof agent === 'object' && agent) {
    const info = {
      full_name: (agent as any)?.full_name || (agent as any)?.name || '',
      email: (agent as any)?.email || (agent as any)?.user_email || ''
    }
    if (info.full_name || info.email) {
      agentCache.value[key] = info
      return
    }
  }
  try {
    const isEmail = key.includes('@')
    const resp = await apiClient.get('/v1/users/', { params: { role: 'agent', status: 'approved', [isEmail ? 'email' : 'id']: key, start: 0, stop: 1 } })
    const data = resp?.data?.data
    const list = Array.isArray(data) ? data : data ? [data] : []
    const first = list[0] || null
    if (first) agentCache.value[key] = first
  } catch {}
}

const clientName = (job: any): string => {
  const c = (job as any)?.client || (job as any)?.client_profile || (job as any)?.client_details
  const name = c?.full_name || c?.name || c?.display_name || ''
  return name || ''
}

const clientEmail = (job: any): string => {
  const c = (job as any)?.client || (job as any)?.client_profile || (job as any)?.client_details
  const email = c?.email || c?.contact_email || c?.user_email || ''
  return email || ''
}

const refresh = async () => {
  loading.value = true
  error.value = null
  try {
    const resp = await api.jobs.listAdminJobs(0, 25)
    jobs.value = Array.isArray(resp.data) ? resp.data : (resp.data ? [resp.data as any] : [])
    try {
      await alertsService.getAlerts({ start: 0, stop: 50 })
    } catch {}
    // Auto-resolve agents from meeting alerts for jobs missing selection
    try {
      const state = alertsService.getNotificationState()
      const alerts = Array.isArray(state.alerts) ? state.alerts : []
      for (const job of jobs.value) {
        const jid = jobId(job)
        const existing = jobAgents(job)
        if (!Array.isArray(existing) || existing.length === 0) {
          // Prefer client-side recommended map per job
          try {
            const raw = localStorage.getItem('clientJobRecommendedMap')
            if (raw) {
              const map = JSON.parse(raw)
              const ids = Array.isArray(map?.[jid]) ? map[jid] : []
              if (ids.length > 0) {
                job.recommended_agents = ids
                try {
                  const raw = localStorage.getItem('clientJobRecommendedMap')
                  const map = raw ? JSON.parse(raw) : {}
                  map[jid] = ids
                  localStorage.setItem('clientJobRecommendedMap', JSON.stringify(map))
                } catch {}
              }
            }
          } catch {}
          // Prefer client cached recommended agent when available
          try {
            const cached = localStorage.getItem('selectedClientProject')
            if (cached) {
              const parsed = JSON.parse(cached)
              const cachedId = String(parsed?.id || parsed?.job_id || '')
              const cachedAgents = Array.isArray(parsed?.agents) ? parsed.agents : []
              if (cachedId && cachedId === jid && cachedAgents.length > 0) {
                const idsOnly = cachedAgents
                  .map((v: any) => typeof v === 'string' ? v : String(v?.id || v?._id || v?.user_id || v?.agent_id || v?.email || ''))
                  .filter((s: string) => s.trim().length > 0)
                job.recommended_agents = idsOnly.filter((agent: any) => agent?.role === 'agent')
                try { if (idsOnly.length > 0) await api.jobs.updateJob(jid, { recommended_agents: idsOnly }) } catch {}
              }
            }
          } catch {}
          // Prefer backend recommended_agents when present
          if (Array.isArray(job?.recommended_agents) && job.recommended_agents.length > 0) {
            const rec = job.recommended_agents[0] as any
            let recId = typeof rec === 'string' ? rec : String(rec?.id || rec?._id || rec?.user_id || '')
            if (!recId && typeof rec?.email === 'string' && rec.email.trim()) {
              try {
                const resp = await apiClient.get('/v1/users/', { params: { role: 'agent', email: rec.email.trim(), start: 0, stop: 1 } })
                const data = resp?.data?.data
                const list = Array.isArray(data) ? data : data ? [data] : []
                const first = list[0] as any
                const fetchedId = typeof first?.id === 'string' ? first.id : ''
                if (fetchedId && fetchedId.trim()) recId = fetchedId.trim()
                if (first) agentCache.value[rec.email.trim()] = first
              } catch {}
            }
            if (recId && recId.trim().length > 0) {
              job.selected_agents = [recId]
              try {
                const raw = localStorage.getItem('clientJobRecommendedMap')
                const map = raw ? JSON.parse(raw) : {}
                map[jid] = [recId]
                localStorage.setItem('clientJobRecommendedMap', JSON.stringify(map))
              } catch {}
              continue
            }
          }
          const ids = alerts
            .filter((a: any) => String(a?.job_id || '') === jid && typeof a?.alert_type === 'string' && a.alert_type.toLowerCase().includes('meeting'))
            .map((a: any) => String(a?.agent_id || ''))
            .filter((s: string) => s.trim().length > 0)
          const unique = Array.from(new Set(ids))
          if (unique.length > 0) {
            job.selected_agents = unique
            try {
              const raw = localStorage.getItem('clientJobRecommendedMap')
              const map = raw ? JSON.parse(raw) : {}
              map[jid] = unique
              localStorage.setItem('clientJobRecommendedMap', JSON.stringify(map))
            } catch {}
          }
        }
        const primary = jobAgents(job)[0]
        if (primary) await ensureAgentDetail(primary)
      }
    } catch {}
  } catch (e: any) {
    error.value = e?.message || 'Failed to load jobs'
  } finally {
    loading.value = false
  }
}

onMounted(refresh)

const goToProposal = (job: any) => {
  const id = jobId(job)
  if (!id) return
  router.push(`/admin/propose/${id}`)
}

const openAgents = (job: any) => {
  expandedJobId.value = jobId(job)
}

const memoSelected = (job: any) => {
  const agents = jobAgents(job)
  if (agents.length > 0) {
    goToMemoWithJob(job, agents[0])
  } else {
    showFindAgents(job)
  }
}

const goToMemo = (agent: any) => {
  const id = typeof agent === 'string' ? agent : resolveAgentId(agent)
  if (!id) return
  router.push(`/admin/memo/${id}`)
}

const goToMemoWithJob = (job: any, agent: any) => {
  const id = typeof agent === 'string' ? agent : resolveAgentId(agent)
  const jid = jobId(job)
  if (!id) return
  if (jid) {
    router.push({ path: `/admin/memo/${id}`, query: { jobId: jid } })
  } else {
    router.push(`/admin/memo/${id}`)
  }
}


const showFindAgents = (job: any) => {
  const id = jobId(job)
  activeJobForAgents.value = { id, title: jobTitle(job), category: jobCategory(job), pay: jobBudget(job) }
  isFindAgentsOpen.value = true
}

const handleAgentAssigned = (agent: any) => {
  isFindAgentsOpen.value = false
  if (agent?.id) {
    router.push(`/admin/memo/${agent.id}`)
  }
}
const meetingJobIds = computed(() => {
  const state = alertsService.getNotificationState()
  const ids = (state.alerts || [])
    .filter((a: any) => typeof a?.alert_type === 'string' && a.alert_type.toLowerCase().includes('meeting') && a?.job_id)
    .map((a: any) => String(a.job_id))
  return new Set(ids)
})

const displayJobs = computed(() => {
  const ids = meetingJobIds.value
  const all = jobs.value || []
  if (!ids || ids.size === 0) return all
  return all.filter((job: any) => ids.has(jobId(job)))
})

const hasMeeting = (job: any) => meetingJobIds.value.has(jobId(job))

</script>

<style scoped>
</style>

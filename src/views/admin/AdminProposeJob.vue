<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-brand-teal text-white px-4 py-4 sticky top-0 z-10">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button @click="$router.back()" aria-label="Back" class="p-1 text-white/95 hover:text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-lg font-semibold">Send Proposal</h1>
            <p class="text-xs text-white/80">Job: {{ jobId }}</p>
          </div>
        </div>
        <button @click="submitProposal" :disabled="submitting || !canSubmit" class="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors">
          <span v-if="submitting">Submitting...</span>
          <span v-else>Submit Proposal</span>
        </button>
      </div>
    </header>

    <main class="p-4 pb-24 max-w-3xl mx-auto">
      <div class="space-y-6">

        

        <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-gray-800">Chosen Agent</h3>
            <span class="text-xs text-gray-500">Tap to switch</span>
          </div>

          <div v-if="candidateAgents.length > 0" class="max-h-56 overflow-y-auto divide-y divide-gray-100 border border-gray-100 rounded-md">
            <div
              v-for="agent in candidateAgents"
              :key="String(agent?.id || agent?.email || agent)"
              class="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
              :class="{ 'bg-teal-50 border-l-4 border-teal-500': isSelectedAgent(agent) }"
              @click="setSelectedAgent(agent)"
            >
              <div class="min-w-0 flex-1">
                <p class="text-sm text-gray-800 truncate">{{ agentName(agent) }}</p>
                <p class="text-xs text-gray-500 truncate">{{ agentEmail(agent) }}</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500">Select</span>
                <input type="radio" class="h-4 w-4 text-teal-600" :checked="isSelectedAgent(agent)" @change="setSelectedAgent(agent)" />
              </div>
            </div>
          </div>
          <div v-else class="text-sm text-gray-600">
            No agent selected for this job. Please choose an agent to send the proposal.
          </div>
          <p class="mt-2 text-xs text-gray-500">Selected: {{ selectedAgents.length }}</p>
          <p v-if="!canSubmit" class="text-xs text-red-600">
            {{ selectedAgents.length === 0 ? 'Select an agent' : '' }}{{ selectedAgents.length === 0 && !proposalText.trim() ? ' and ' : '' }}{{ proposalText.trim() ? '' : 'Add proposal text' }} to submit.
          </p>
          <div v-if="hasMoreAgents && !loadingAgents" class="pt-2">
            <button
              class="px-3 py-1.5 text-xs font-medium text-teal-600 border border-teal-200 rounded-md hover:bg-teal-50"
              @click="fetchRecommendedAgentsForJob(lastJobForAgents.value, { reset: false })"
            >
              Load more agents
            </button>
          </div>
          <div v-else-if="loadingAgents" class="text-xs text-gray-500">Loading agents…</div>
        </div>

        <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 class="text-sm font-semibold text-gray-800 mb-2">Proposal Text</h3>
          <textarea v-model="proposalText" rows="6" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" placeholder="Write the proposal you want to send to the client"></textarea>
        </div>

        <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 class="text-sm font-semibold text-gray-800 mb-3">Timeline</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-gray-600 mb-1">Start Date</label>
              <input v-model="startDate" type="date" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">Start Time</label>
              <input v-model="startTime" type="time" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">Deadline Date</label>
              <input v-model="deadlineDate" type="date" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">Deadline Time</label>
              <input v-model="deadlineTime" type="time" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 class="text-sm font-semibold text-gray-800 mb-3">Breakdown</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs text-gray-600 mb-1">Service Amount</label>
              <input v-model.number="serviceAmount" type="number" min="0" step="0.01" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">Charges (%)</label>
              <input v-model.number="charges" type="number" min="0" max="100" step="0.1" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">Tax (%)</label>
              <input v-model.number="tax" type="number" min="0" max="100" step="0.1" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{{ error }}</div>
        <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">{{ successMessage }}</div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { proposeJob, getJobById } from '../../services/jobs'
import apiClient from '../../services/apiClient'

const route = useRoute()
const router = useRouter()
const jobId = computed(() => {
  const p = String(route.params.jobId || route.params.id || '')
  if (p && p.trim()) return p.trim()
  const q = String(route.query.jobId || route.query.id || '')
  if (q && q.trim()) return q.trim()
  try {
    const sjc = localStorage.getItem('selectedJobContext')
    if (sjc) {
      const c = JSON.parse(sjc)
      const jid = String(c?.project?.id || c?.admin_job_id || c?.agent_job_id || '')
      if (jid && jid.trim()) return jid.trim()
    }
  } catch {}
  return ''
})

const recommendedAgents = ref<any[]>([])
const recommendedLoaded = ref(false)
const AGENT_FETCH_LIMIT = 50
const agentStart = ref(0)
const hasMoreAgents = ref(true)
const loadingAgents = ref(false)
const lastJobForAgents = ref<any>(null)

const handleAgentList = (mapped: any[], start: number) => {
  if (start === 0) {
    recommendedAgents.value = dedupeAgents(mapped)
  } else {
    recommendedAgents.value = dedupeAgents(recommendedAgents.value.concat(mapped))
  }
  agentStart.value = start + mapped.length
  hasMoreAgents.value = mapped.length >= AGENT_FETCH_LIMIT
  recommendedLoaded.value = true
}
const proposalText = ref('')
const charges = ref<number>(7)
const tax = ref<number>(10)
const serviceAmount = ref<number>(0)
const startDate = ref('')
const startTime = ref('')
const deadlineDate = ref('')
const deadlineTime = ref('')
const submitting = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const selectedAgents = ref<any[]>([])
const addRecommendedAgent = (agent: any) => {
  const id = String(agent?.id || '')
  const exists = selectedAgents.value.some(a => (typeof a === 'string' ? a : a?.id) === id)
  if (!exists) selectedAgents.value = [agent]
}
const normalizeId = (value: unknown): string => String(value || '').trim()
const normalizeEmail = (value: unknown): string => String(value || '').trim().toLowerCase()
const normalizeName = (value: unknown): string => String(value || '').trim()
const normalizeRole = (value: unknown): string => {
  if (!value) return ''
  if (typeof value === 'string') return value.trim().toLowerCase()
  if (typeof value === 'object' && (value as any).name) {
    return String((value as any).name).trim().toLowerCase()
  }
  return ''
}
const isAgentCandidate = (raw: any): boolean => {
  if (!raw || typeof raw === 'string') return false
  if (raw.is_agent === false) return false
  if (raw.is_agent === true || raw.isAgent === true) return true
  const role = normalizeRole(raw.role)
  if (role) return role.includes('agent')
  // If role is missing (e.g., from /v1/agents/list), treat as agent
  return true
}
const dedupeAgents = (agents: any[]): any[] => {
  const seen = new Set<string>()
  const result: any[] = []
  for (const agent of agents) {
    const id = normalizeId(typeof agent === 'string' ? agent : agent?.id || agent?._id || agent?.uuid)
    const email = normalizeEmail(typeof agent === 'string' ? '' : agent?.email || agent?.user_email)
    const key = id || (email ? `email:${email}` : '')
    if (!key || seen.has(key)) continue
    seen.add(key)
    result.push(agent)
  }
  return result
}
const agentName = (agent: any) => {
  if (typeof agent === 'string') return agent
  return String(agent?.name || agent?.full_name || agent?.email || agent?.id || '')
}
const agentEmail = (agent: any) => {
  if (typeof agent === 'string') return ''
  return String(agent?.email || '')
}
const jobTimeline = ref<{ start_date: number; deadline: number } | null>(null)

const toUnix = (d: string, t: string): number => {
  if (!d || !t) return Math.floor(Date.now() / 1000)
  const s = `${d}T${t}:00`
  return Math.floor(new Date(s).getTime() / 1000)
}

const buildAgentPayload = (raw: any): any => {
  const ts = Math.floor(Date.now() / 1000)
  const normalizeExpertise = (value: unknown): string => {
    const allowed = [
      'Web Development',
      'Mobile Development',
      'Sales',
      'Customer Service',
      'Editing',
      'Book Keeping',
      'Executive Assistant',
      'Appointment Setting',
      'Digital Marketing',
      'Data Analysis'
    ]
    if (typeof value === 'string') {
      const v = value.replace(/\xa0/g, ' ').trim().toLowerCase()
      const map: Record<string, string> = {
        'web development': 'Web Development',
        'mobile development': 'Mobile Development',
        'sales': 'Sales',
        'customer service': 'Customer Service',
        'editing': 'Editing',
        'book keeping': 'Book Keeping',
        'executive assistant': 'Executive Assistant',
        'appointment setting': 'Appointment Setting',
        'digital marketing': 'Digital Marketing',
        'data analysis': 'Data Analysis'
      }
      if (map[v]) return map[v]
      const matched = allowed.find(a => a.toLowerCase() === v)
      if (matched) return matched
    }
    return 'Web Development'
  }

  const normalizeHours = (value: unknown): number => {
    const allowed = new Set([160, 80, 40, 20])
    if (typeof value === 'number') {
      return allowed.has(value) ? value : 40
    }
    if (typeof value === 'string') {
      const v = value.trim().toLowerCase()
      const num = parseInt(v.replace(/[^0-9]/g, ''), 10)
      if (allowed.has(num)) return num
      if (v.includes('160')) return 160
      if (v.includes('80')) return 80
      if (v.includes('40')) return 40
      if (v.includes('20')) return 20
    }
    return 40
  }

  const normalizeTimezone = (value: unknown): string => {
    const allowed = [
      'UTC-12:00','UTC-11:00','UTC-10:00','UTC-09:30','UTC-09:00','UTC-08:00','UTC-07:00','UTC-06:00','UTC-05:00',
      'UTC-04:30','UTC-04:00','UTC-03:30','UTC-03:00','UTC-02:00','UTC-01:00','UTC+00:00','UTC+01:00','UTC+02:00',
      'UTC+03:00','UTC+03:30','UTC+04:00','UTC+05:00','UTC+05:30','UTC+05:45','UTC+06:00','UTC+06:30','UTC+07:00',
      'UTC+08:00','UTC+08:45','UTC+09:00','UTC+09:30','UTC+10:00','UTC+10:30','UTC+11:00','UTC+11:30','UTC+12:00',
      'UTC+12:45','UTC+13:00','UTC+14:00'
    ]
    if (typeof value === 'string') {
      const v = value.trim().toUpperCase()
      if (allowed.includes(v)) return v
    }
    return 'UTC+00:00'
  }

  return {
    id: String(raw?.id || raw?._id || raw?.uuid || ''),
    admin_approved: Boolean(raw?.admin_approved ?? true),
    full_name: String(raw?.full_name || raw?.name || ''),
    email: String(raw?.email || raw?.user_email || ''),
    role: raw?.role || 'agent',
    phone_number: String(raw?.phone_number || raw?.contact_phone || ''),
    certificate_url: Array.isArray(raw?.certificate_url) ? raw.certificate_url : (raw?.certificates ? [].concat(raw.certificates) : []),
    video_url: String(raw?.video_url || ''),
    personality_url: String(raw?.personality_url || ''),
    company_name: String(raw?.company_name || ''),
    company_email: String(raw?.company_email || ''),
    company_address: String(raw?.company_address || ''),
    services: Array.isArray(raw?.services) ? raw.services : [],
    client_reason_for_signing_up: String(raw?.client_reason_for_signing_up || ''),
    client_need_agent_work_hours_to_be: String(raw?.client_need_agent_work_hours_to_be || ''),
    primary_area_of_expertise: normalizeExpertise(raw?.primary_area_of_expertise ?? raw?.expertise),
    years_of_experience: Number(raw?.years_of_experience ?? raw?.experience_years ?? 0),
    three_most_commonly_used_tools_or_platforms: Array.isArray(raw?.three_most_commonly_used_tools_or_platforms) ? raw.three_most_commonly_used_tools_or_platforms : (Array.isArray(raw?.tools) ? raw.tools.slice(0,3) : []),
    available_hours_agent_can_commit: normalizeHours(raw?.available_hours_agent_can_commit ?? raw?.availability_hours),
    time_zone: normalizeTimezone(raw?.time_zone),
    portfolio_link: String(raw?.portfolio_link || raw?.portfolio || ''),
    is_agent_open_to_calls_and_video_meetings: Boolean(raw?.is_agent_open_to_calls_and_video_meetings ?? true),
    does_agent_have_working_computer: Boolean(raw?.does_agent_have_working_computer ?? true),
    does_agent_have_stable_internet: Boolean(raw?.does_agent_have_stable_internet ?? true),
    is_agent_comfortable_with_time_tracking_tools: Boolean(raw?.is_agent_comfortable_with_time_tracking_tools ?? true),
    date_created: Number(raw?.date_created ?? ts),
    last_updated: Number(raw?.last_updated ?? ts),
    refresh_token: String(raw?.refresh_token || ''),
    access_token: String(raw?.access_token || ''),
    password: String(raw?.password || '$2b$12$ZW5jcnlwdGVkLWhhc2gtcGFzc3dvcmQ')
  }
}

const fetchAgentById = async (id: string): Promise<any | null> => {
  try {
    const resp = await apiClient.get('/v1/users/', { params: { role: 'agent', id, start: 0, stop: 1 } })
    const data = resp?.data?.data
    const list = Array.isArray(data) ? data : data ? [data] : []
    return list[0] || null
  } catch (err: any) {
    if (err?.response?.status === 401) {
      try {
        const { refreshSession } = await import('@/utils/auth')
        const refreshed = await refreshSession()
        if (refreshed) {
          const retryResp = await apiClient.get('/v1/users/', { params: { role: 'agent', id, start: 0, stop: 1 } })
          const data2 = retryResp?.data?.data
          const list2 = Array.isArray(data2) ? data2 : data2 ? [data2] : []
          return list2[0] || null
        }
      } catch (e) {
        console.error('Token refresh and retry failed:', e)
      }
    }
    return null
  }
}

const fetchAgentByEmail = async (email: string): Promise<any | null> => {
  try {
    const resp = await apiClient.get('/v1/users/', { params: { role: 'agent', email, start: 0, stop: 1 } })
    const data = resp?.data?.data
    const list = Array.isArray(data) ? data : data ? [data] : []
    return list[0] || null
  } catch (err: any) {
    if (err?.response?.status === 401) {
      try {
        const { refreshSession } = await import('@/utils/auth')
        const refreshed = await refreshSession()
        if (refreshed) {
          const retryResp = await apiClient.get('/v1/users/', { params: { role: 'agent', email, start: 0, stop: 1 } })
          const data2 = retryResp?.data?.data
          const list2 = Array.isArray(data2) ? data2 : data2 ? [data2] : []
          return list2[0] || null
        }
      } catch (e) {
        console.error('Token refresh and retry failed:', e)
      }
    }
    return null
  }
}

const canSubmit = computed(() => {
  return !!jobId.value && proposalText.value.trim().length > 0 && selectedAgents.value.length > 0
})

const viewAgentProfile = (agent: any) => {
  const agentId = typeof agent === 'string' ? agent : (agent?.id || '')
  if (agentId) {
    router.push(`/client/agent/${agentId}`)
  }
}

const submitProposal = async () => {
  error.value = null
  successMessage.value = null
  if (!canSubmit.value) {
    error.value = 'Please complete the form'
    return
  }
  submitting.value = true
  try {
    const primary = selectedAgents.value[0]
    const primaryAgentId = normalizeId(typeof primary === 'string' ? primary : (primary?.id || primary?._id || primary?.uuid || ''))
    let agentObj: any = typeof primary === 'object' && primary ? primary : null
    if (!agentObj && primaryAgentId) {
      agentObj = await fetchAgentById(primaryAgentId)
    }
    if ((!agentObj || !agentObj?.id) && agentObj?.email) {
      const byEmail = await fetchAgentByEmail(String(agentObj.email))
      agentObj = byEmail || agentObj
    }
    if (!agentObj || !agentObj?.id) {
      error.value = 'Selected agent not found. Please select a valid agent.'
      return
    }
    const agentPayload = buildAgentPayload(agentObj)
    const start = jobTimeline.value?.start_date ?? toUnix(startDate.value, startTime.value)
    const end = jobTimeline.value?.deadline ?? (deadlineDate.value && deadlineTime.value ? toUnix(deadlineDate.value, deadlineTime.value) : start)
    const payload = {
      agent: agentPayload,
      agent_id: primaryAgentId || agentPayload.id,
      timeline: { start_date: start, deadline: end },
      proposal: proposalText.value.trim(),
      break_down: {
        service: Number(serviceAmount.value) || 0,
        Charges: Number(charges.value) || 0,
        Tax: Number(tax.value) || 0
      }
    }
  const res = await proposeJob(jobId.value, payload)
  const ok = (res as any)?.data?.status_code === 200 || (res as any)?.data?.status_code === 0 || typeof (res as any)?.data === 'string'
  if (ok) {
    try {
      const { alertsService } = await import('@/services/notificationsService')
      alertsService.createLocalAlert({
        alert_title: 'New Proposal Sent',
        alert_description: `A proposal was sent for job ${jobId.value} to the client`,
        alert_type: 'proposal',
        alert_primary_action: 'View',
        alert_secondary_action: 'Acknowledge',
        priority: 'normal',
        alert_target_user_id: String(agentPayload.id),
        job_id: jobId.value,
        agent_id: String(agentPayload.id)
      } as any)
    } catch (_) {}
    successMessage.value = 'Proposal sent successfully'
    setTimeout(() => {
      router.push('/admin/notifications')
    }, 800)
  } else {
      error.value = (res as any)?.data?.detail || 'Failed to send proposal'
    }
  } catch (e: any) {
    error.value = e?.response?.data?.detail || e?.message || 'Failed to send proposal'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  try {
    try {
      const id = jobId.value
      if (id) {
        const res = await getJobById(id)
        const job = (res as any)?.data?.data || (res as any)?.data
        const selected = Array.isArray(job?.selected_agents) ? job.selected_agents : []
        const selectedIds = selected
          .map((a: any) => {
            if (typeof a === 'string') return a
            if (a?.id) return a.id
            return ''
          })
          .filter((v: string) => v.length > 0)
        selectedAgents.value = selected
        // Add client-recommended agents if they exist and are not already selected
        if (job?.recommended_agents && Array.isArray(job.recommended_agents)) {
          for (const recAgent of job.recommended_agents) {
            const recId = String(recAgent?.id || recAgent?._id || recAgent?.uuid || '').trim()
        const recEmail = String(recAgent?.email || recAgent?.user_email || '').trim().toLowerCase()
        const alreadySelected = selectedAgents.value.some((sel: any) => {
          const selId = String(typeof sel === 'string' ? sel : (sel?.id || '')).trim()
          const selEmail = String(typeof sel === 'string' ? '' : (sel?.email || '')).trim().toLowerCase()
          return selId && recId && selId === recId || selEmail && recEmail && selEmail === recEmail
        })
        if (!alreadySelected && (recId || recEmail)) {
          selectedAgents.value.push(recAgent)
        }
      }
    } else if (job?.recommended_agent && typeof job.recommended_agent === 'object') {
          const recAgent = job.recommended_agent
          const recId = String(recAgent?.id || recAgent?._id || recAgent?.uuid || '').trim()
          const recEmail = String(recAgent?.email || recAgent?.user_email || '').trim().toLowerCase()
          const alreadySelected = selectedAgents.value.some((sel: any) => {
            const selId = String(typeof sel === 'string' ? sel : (sel?.id || '')).trim()
            const selEmail = String(typeof sel === 'string' ? '' : (sel?.email || '')).trim().toLowerCase()
            return selId && recId && selId === recId || selEmail && recEmail && selEmail === recEmail
          })
          if (!alreadySelected && (recId || recEmail)) {
            selectedAgents.value.push(recAgent)
          }
        } else if (job?.recommended_agent_id) {
          const recId = String(job.recommended_agent_id).trim()
          const alreadySelected = selectedAgents.value.some((sel: any) => {
            const selId = String(typeof sel === 'string' ? sel : (sel?.id || '')).trim()
            return selId === recId
          })
          if (!alreadySelected) {
          selectedAgents.value.push(recId)
        }
      }
        if (job?.timeline && typeof job.timeline === 'object') {
          jobTimeline.value = job.timeline
        }
        if (!recommendedLoaded.value) {
          try {
            const { listAdminApplicationsForJob } = await import('../../services/applicationsService')
          const apps = await listAdminApplicationsForJob(id)
            const data = apps?.data || []
            const mapped = data.map((app: any) => ({
              id: String(app?.agent_id || app?.agent?.id || ''),
              email: String(app?.agent_email || ''),
              full_name: String(app?.agent_name || ''),
            }))
            recommendedAgents.value = mapped.filter((a: any) => (a.id || a.email) && a.email !== 'test@gmail.com')
            recommendedLoaded.value = true
          } catch {}
          await fetchRecommendedAgentsForJob(job, { reset: true })
          // Filter out already selected agents from recommended list
          recommendedAgents.value = recommendedAgents.value.filter((rec: any) => {
            const recId = String(rec?.id || '').trim()
            const recEmail = String(rec?.email || '').trim().toLowerCase()
            return !selectedAgents.value.some((sel: any) => {
              const selId = String(typeof sel === 'string' ? sel : (sel?.id || '')).trim()
              const selEmail = String(typeof sel === 'string' ? '' : (sel?.email || '')).trim().toLowerCase()
              return selId && recId && selId === recId || selEmail && recEmail && selEmail === recEmail
            })
          })
        }
        selectedAgents.value = dedupeAgents(selectedAgents.value)
        // If the client set a meeting for this job, prefer that agent as the sole selection
        const resolvedMeetingAgent = await selectMeetingAgent(job)
        if (!resolvedMeetingAgent) {
          selectedAgents.value = dedupeAgents(selectedAgents.value)
          // No auto-selection; require admin to pick manually
          selectedAgents.value = []
        }
      }
    } catch {}
  } catch {}
})
const deriveExpertiseFromJob = (job: any): string => {
  const source = job || lastJobForAgents.value || {}
  const cat = String(source?.primary_area_of_expertise || source?.category || source?.expertise || '').trim()
  if (cat) return cat
  const proj = source?.project
  if (proj) {
    const projCat = String(proj.primary_area_of_expertise || proj.category || proj.expertise || '').trim()
    if (projCat) return projCat
  }
  try {
    const sjc = localStorage.getItem('selectedJobContext')
    if (sjc) {
      const ctx = JSON.parse(sjc)
      const pj = ctx?.project || {}
      const ctxCat = String(pj.primary_area_of_expertise || pj.category || pj.expertise || '').trim()
      if (ctxCat) return ctxCat
    }
  } catch {}
  return ''
}

const fetchRecommendedAgentsForJob = async (job: any, opts: { reset?: boolean } = {}) => {
  try {
    if (opts.reset) {
      agentStart.value = 0
      hasMoreAgents.value = true
      recommendedAgents.value = []
    }
    const expertise = deriveExpertiseFromJob(job)
    const start = agentStart.value
    const stop = agentStart.value + AGENT_FETCH_LIMIT
    const params: Record<string, any> = { start, stop }
    if (expertise) params.primary_area_of_expertise = expertise
    loadingAgents.value = true
    // Primary: use /v1/users?role=agent (works even when /agents fails)
    const userParams: Record<string, any> = { role: 'agent', start, stop }
    if (expertise) userParams.expertise = expertise
    let mapped: any[] = []
    try {
      const respUsers = await apiClient.get('/v1/users/', { params: userParams })
      const dataUsers = respUsers?.data?.data
      const listUsers = Array.isArray(dataUsers) ? dataUsers : dataUsers ? [dataUsers] : []
      mapped = listUsers
        .map((u: any) => toAgentRecord(u))
        .filter((v): v is any => Boolean(v))
        .filter(isAgentCandidate)
    } catch (_) {
      mapped = []
    }

    // Fallback to /v1/agents/ if user call returned nothing
    if (mapped.length === 0) {
      const resp = await apiClient.get('/v1/agents/', { params })
      const data = resp?.data?.data
      const list = Array.isArray(data) ? data : data ? [data] : []
      mapped = list
        .map((u: any) => toAgentRecord(u))
        .filter((v): v is any => Boolean(v))
        .filter(isAgentCandidate)
    }

    handleAgentList(mapped, start)
    lastJobForAgents.value = job || lastJobForAgents.value
  } catch (err: any) {
    if (opts.reset) {
      recommendedAgents.value = []
    }
    hasMoreAgents.value = false
  } finally {
    loadingAgents.value = false
  }
}

const toAgentRecord = (raw: any): any | null => {
  if (!raw) return null
  if (typeof raw === 'string') {
    const id = normalizeId(raw)
    return id ? { id } : null
  }
  const id = normalizeId(raw.id ?? raw.agent_id ?? raw.user_id ?? raw._id ?? raw.uuid)
  const email = normalizeEmail(raw.email ?? raw.agent_email ?? raw.user_email ?? raw.contact_email)
  const full_name = normalizeName(raw.full_name ?? raw.name ?? raw.display_name ?? raw.agent_name ?? raw.username ?? '')
  if (!id && !email && !full_name) return null
  const role = normalizeRole(raw.role) || (raw.is_agent === true ? 'agent' : '')
  return { ...raw, id, email, full_name, role: role || raw.role || 'agent' }
}

const pickFirstAgent = (list: any[]): any | null => {
  for (const item of list) {
    const rec = toAgentRecord(item)
    if (rec && (normalizeId(rec.id) || normalizeEmail(rec.email))) return rec
  }
  return null
}

const candidateAgents = computed(() => {
  const pool: any[] = []
  pool.push(...selectedAgents.value)
  pool.push(...recommendedAgents.value)
  const contextAgent = selectAgentFromContext()
  if (contextAgent) pool.push(contextAgent)
  const normalized = pool
    .map(toAgentRecord)
    .filter((v): v is any => Boolean(v))
  return dedupeAgents(normalized).filter(isAgentCandidate)
})

const isSelectedAgent = (agent: any): boolean => {
  const agentId = normalizeId(typeof agent === 'string' ? agent : (agent?.id || agent?._id || agent?.uuid || ''))
  const agentEmail = normalizeEmail(typeof agent === 'string' ? '' : agent?.email || agent?.user_email)
  return selectedAgents.value.some(sel => {
    const selId = normalizeId(typeof sel === 'string' ? sel : (sel?.id || sel?._id || sel?.uuid || ''))
    const selEmail = normalizeEmail(typeof sel === 'string' ? '' : sel?.email || sel?.user_email)
    if (agentId && selId && agentId === selId) return true
    if (agentEmail && selEmail && agentEmail === selEmail) return true
    return false
  })
}

const setSelectedAgent = (agent: any) => {
  const record = toAgentRecord(agent)
  if (record && isAgentCandidate(record)) {
    selectedAgents.value = [record]
  }
}

const extractAgentFromObject = (obj: any): any | null => {
  if (!obj || typeof obj !== 'object') return null
  const candidates: any[] = [
    obj.agent,
    obj.selected_agent,
    obj.assigned_agent,
    obj.primary_agent,
    obj.accepted_agent,
    obj.approved_agent,
    obj.agent_profile,
    obj.agent_info,
    obj.agent_details,
    obj.agent_data,
    obj.current_agent,
    obj.user,
    {
      id: obj.agent_id || obj.selected_agent_id || obj.approved_agent_id || obj.accepted_agent_id,
      email: obj.agent_email,
      full_name: obj.agent_name
    }
  ]
  if (Array.isArray(obj.agents)) candidates.push(...obj.agents)
  if (Array.isArray(obj.selected_agents)) candidates.push(...obj.selected_agents)
  if (Array.isArray(obj.assigned_agents)) candidates.push(...obj.assigned_agents)
  return pickFirstAgent(candidates)
}

const selectAgentFromContext = (): any | null => {
  try {
    const raw = localStorage.getItem('selectedJobContext')
    if (!raw) return null
    const ctx = JSON.parse(raw)
    const fromTop = extractAgentFromObject(ctx)
    if (fromTop) return fromTop
    if (ctx?.project) {
      const fromProject = extractAgentFromObject(ctx.project)
      if (fromProject) return fromProject
    }
    return null
  } catch {
    return null
  }
}

const extractAgentFromMeetingPayload = (payload: any): any | null => {
  if (!payload) return null
  const candidates: any[] = []
  if (Array.isArray(payload)) {
    candidates.push(...payload)
  } else if (typeof payload === 'object') {
    candidates.push(
      payload.agent,
      payload.agent_info,
      payload.agent_details,
      payload.agentProfile,
      payload.agent_data,
      payload.assigned_agent
    )
    if (Array.isArray(payload.meetings)) {
      for (const m of payload.meetings) {
        if (m?.agent) candidates.push(m.agent)
        if (m?.agent_info) candidates.push(m.agent_info)
      }
    }
    if (Array.isArray(payload.meeting_agents)) candidates.push(...payload.meeting_agents)
    candidates.push({
      id: payload.agent_id || payload.selected_agent_id || payload.approved_agent_id || payload.accepted_agent_id,
      email: payload.agent_email,
      full_name: payload.agent_name
    })
  }
  return pickFirstAgent(candidates)
}

const fetchMeetingAgentByJobId = async (id: string): Promise<any | null> => {
  return null
}

const selectMeetingAgent = async (job: any): Promise<boolean> => {
  const meetingAgentObj =
    job?.meeting_agent ||
    job?.meeting?.agent ||
    job?.meeting?.agent_info ||
    job?.meeting?.agent_details ||
    job?.meeting_details?.agent ||
    job?.meeting_details?.agent_info ||
    null

  const meetingAgentId = normalizeId(
    job?.meeting_agent_id ||
    job?.client_meeting_agent_id ||
    job?.meetingAgentId ||
    job?.clientMeetingAgentId ||
    job?.meeting?.agent_id ||
    (meetingAgentObj && (meetingAgentObj.id || meetingAgentObj._id || meetingAgentObj.uuid)) ||
    job?.agent_meeting_id ||
    job?.agent_id ||
    job?.selected_agent_id ||
    job?.approved_agent_id ||
    job?.accepted_agent_id
  )
  const meetingAgentEmail = normalizeEmail(
    job?.meeting_agent_email ||
    job?.meeting?.agent_email ||
    (meetingAgentObj && (meetingAgentObj.email || meetingAgentObj.user_email)) ||
    job?.agent_email ||
    job?.selected_agent_email ||
    job?.approved_agent_email ||
    job?.accepted_agent_email
  )

  const candidateObjects: any[] = [
    meetingAgentObj,
    job?.assigned_agent,
    job?.selected_agent,
    job?.approved_agent,
    job?.accepted_agent,
    job?.agent_profile,
    job?.agent_info,
    job?.primary_agent,
    job?.agent_data,
    job?.agent_details
  ].filter(Boolean)

  const arrayCandidates: any[] = []
  if (Array.isArray(job?.meeting_agents)) arrayCandidates.push(...job.meeting_agents)
  if (Array.isArray(job?.meetings)) {
    for (const m of job.meetings) {
      if (m?.agent) arrayCandidates.push(m.agent)
      if (m?.agent_info) arrayCandidates.push(m.agent_info)
    }
  }
  if (Array.isArray(job?.selected_agents)) arrayCandidates.push(...job.selected_agents)
  if (Array.isArray(job?.agents)) arrayCandidates.push(...job.agents)
  if (Array.isArray(job?.assigned_agents)) arrayCandidates.push(...job.assigned_agents)

  let resolvedAgent: any = pickFirstAgent(candidateObjects) || pickFirstAgent(arrayCandidates) || null

  if (!resolvedAgent) {
    const contextAgent = selectAgentFromContext()
    if (contextAgent) {
      resolvedAgent = contextAgent
    }
  }

  if (!resolvedAgent && jobId.value) {
    resolvedAgent = await fetchMeetingAgentByJobId(jobId.value)
  }

  if (!resolvedAgent && (meetingAgentId || meetingAgentEmail)) {
    if (meetingAgentId) {
      resolvedAgent = await fetchAgentById(meetingAgentId)
    }
    if (!resolvedAgent && meetingAgentEmail) {
      resolvedAgent = await fetchAgentByEmail(meetingAgentEmail)
    }
    if (!resolvedAgent) {
      resolvedAgent = {
        id: meetingAgentId,
        email: meetingAgentEmail,
        full_name: job?.meeting_agent_name || job?.agent_name || ''
      }
    }
  }

  const hasIdentifier = resolvedAgent && (normalizeId(resolvedAgent?.id) || normalizeEmail(resolvedAgent?.email))
  if (!hasIdentifier) return false

  selectedAgents.value = dedupeAgents([resolvedAgent])
  return true
}
</script>

<style scoped>
</style>

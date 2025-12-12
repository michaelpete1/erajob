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
            <p class="text-xs text-white/80">Client: {{ clientName(jobRaw) || '—' }}</p>
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

        <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 class="text-sm font-semibold text-gray-800 mb-2">Job Details</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
            <div class="text-gray-600">Title: <span class="font-medium text-gray-800 break-words">{{ jobDisplay?.project_title || jobDisplay?.title || '—' }}</span></div>
            <div class="text-gray-600">Category: <span class="font-medium text-gray-800 break-words">{{ jobDisplay?.primary_area_of_expertise || jobDisplay?.category || '—' }}</span></div>
            <div class="text-gray-600">Budget: <span class="font-medium text-gray-800 break-words">{{ typeof jobDisplay?.budget === 'number' ? ('$' + jobDisplay.budget.toLocaleString()) : (jobDisplay?.budget || '—') }}</span></div>
            <div class="text-gray-600" v-if="clientName(jobRaw)">Client: <span class="font-medium text-gray-800 break-words">{{ clientName(jobRaw) }}</span><span v-if="clientEmail(jobRaw)" class="text-gray-400"> • {{ clientEmail(jobRaw) }}</span></div>
          </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-gray-800">Recommended Agent</h3>
            <span v-if="hasMeetingAlertForJob" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">Meeting Linked</span>
          </div>
          <div v-if="selectedAgents.length > 0" class="max-h-56 overflow-y-auto divide-y divide-gray-100 border border-gray-100 rounded-md">
            <div v-for="agent in selectedAgents" :key="resolveAgentId(agent) || String(agent)" class="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors" @click="viewAgentProfile(agent)">
              <div class="min-w-0 flex-1">
                <p class="text-sm text-gray-800 truncate">{{ agentName(agent) }}</p>
                <p class="text-xs text-gray-500 truncate">{{ agentEmail(agent) }}</p>
                <p class="text-xs text-gray-400 truncate" v-if="agentExpertise(agent) || agentTimezone(agent)">
                  <span v-if="agentExpertise(agent)">{{ agentExpertise(agent) }}</span>
                  <span v-if="agentExpertise(agent) && agentTimezone(agent)"> • </span>
                  <span v-if="agentTimezone(agent)">{{ agentTimezone(agent) }}</span>
                </p>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500">View Profile</span>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
          <div v-else class="text-sm text-gray-600">No selected agent for this job.</div>
          <div class="mt-2 flex items-center justify-end">
            <button v-if="selectedAgents.length > 0" @click="memoSelectedAgent" class="text-xs px-2 py-1 rounded-md bg-gray-900 text-white">Memo Recommended Agent</button>
          </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-gray-800">Browse Agents</h3>
            <span v-if="agentsLoading" class="text-xs text-gray-500">Loading…</span>
          </div>
          <div v-if="agentsError" class="text-sm text-red-600">{{ agentsError }}</div>
          <div v-if="availableAgents.length > 0" class="max-h-56 overflow-y-auto divide-y divide-gray-100 border border-gray-100 rounded-md">
            <div v-for="agent in availableAgents" :key="resolveAgentId(agent) || String(agent?.email || agent)" class="flex items-center justify-between px-3 py-2 hover:bg-gray-50">
              <div class="min-w-0 flex-1">
                <p class="text-sm text-gray-800 truncate">{{ String(agent?.full_name || agent?.name || agent?.email || agent?.id || '') }}</p>
                <p class="text-xs text-gray-500 truncate">{{ String(agent?.email || '') }}</p>
                <p class="text-xs text-gray-400 truncate" v-if="agentExpertise(agent) || agentTimezone(agent)">
                  <span v-if="agentExpertise(agent)">{{ agentExpertise(agent) }}</span>
                  <span v-if="agentExpertise(agent) && agentTimezone(agent)"> • </span>
                  <span v-if="agentTimezone(agent)">{{ agentTimezone(agent) }}</span>
                </p>
              </div>
              <div class="flex items-center gap-2">
                <button class="text-xs px-2 py-1 rounded-md bg-teal-600 text-white" @click="selectAgent(agent)">Select</button>
              </div>
            </div>
          </div>
          <div v-else class="text-sm text-gray-600">No agents available for this category.</div>
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
              <input v-model="startDate" type="date" :disabled="timelineLocked" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">Start Time</label>
              <input v-model="startTime" type="time" :disabled="timelineLocked" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">Deadline Date</label>
              <input v-model="deadlineDate" type="date" :disabled="timelineLocked" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">Deadline Time</label>
              <input v-model="deadlineTime" type="time" :disabled="timelineLocked" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
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
          <div class="mt-3 flex items-center justify-end gap-2">
            <button :disabled="submitting || !canSubmit" @click="submitProposal" class="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50">Submit Proposal</button>
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
import { api } from '@/services/apiService'
import { alertsService } from '@/services/notificationsService'
import { agentsService } from '@/services/agentsService'

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
const availableAgents = ref<any[]>([])
const agentsLoading = ref(false)
const agentsError = ref<string | null>(null)
const jobDisplay = ref<any | null>(null)
const jobRaw = ref<any | null>(null)
const agentCache = ref<Record<string, any>>({})
const resolveAgentId = (a: any): string => {
  const candidates: unknown[] = [
    a?.id,
    a?._id,
    a?.user_id,
    a?.agent_id,
    a?.uuid,
    a?.user?.id,
    a?.user?.uuid
  ]
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim().length > 0) return c.trim()
    if (typeof c === 'number') return String(c)
  }
  const email = typeof a?.email === 'string' ? a.email.trim() : ''
  return email
}
const agentName = (agent: any) => {
  if (typeof agent === 'string') {
    const cached = agentCache.value[agent]
    return String(cached?.full_name || cached?.name || cached?.email || agent)
  }
  return String(agent?.name || agent?.full_name || agent?.email || agent?.id || '')
}
const agentEmail = (agent: any) => {
  if (typeof agent === 'string') {
    const cached = agentCache.value[agent]
    return String(cached?.email || '')
  }
  return String(agent?.email || '')
}
const agentExpertise = (agent: any) => {
  const raw = typeof agent === 'string' ? agentCache.value[agent] || {} : agent || {}
  return String(raw?.primary_area_of_expertise || raw?.expertise || '').trim()
}
const agentTimezone = (agent: any) => {
  const raw = typeof agent === 'string' ? agentCache.value[agent] || {} : agent || {}
  const tz = String(raw?.time_zone || raw?.timezone || '').trim()
  if (!tz) return ''
  if (/^[+-]\d{2}:\d{2}$/.test(tz)) return `UTC${tz}`
  if (/^\d{2}:\d{2}$/.test(tz)) return `UTC+${tz}`
  return tz
}
const jobTimeline = ref<{ start_date: number; deadline: number } | null>(null)
const timelineLocked = computed(() => !!jobTimeline.value)
const hasMeetingAlertForJob = computed(() => {
  try {
    const state = alertsService.getNotificationState()
    return (state.alerts || []).some((a: any) => String(a?.job_id || '') === jobId.value && typeof a?.alert_type === 'string' && a.alert_type.toLowerCase().includes('meeting'))
  } catch {
    return false
  }
})
const memoSelectedAgent = () => {
  const primary = selectedAgents.value[0]
  const agentId = typeof primary === 'string' ? primary.trim() : resolveAgentId(primary)
  if (!agentId) return
  router.push({ path: `/admin/memo/${agentId}` , query: { jobId: jobId.value } })
}

const toUnix = (d: string, t: string): number => {
  if (!d || !t) return 0
  const s = `${d}T${t}:00`
  return Math.floor(new Date(s).getTime() / 1000)
}
const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n))
const toDateInput = (unix: number): string => {
  const d = new Date(unix * 1000)
  const y = d.getFullYear()
  const m = pad2(d.getMonth() + 1)
  const day = pad2(d.getDate())
  return `${y}-${m}-${day}`
}
const toTimeInput = (unix: number): string => {
  const d = new Date(unix * 1000)
  const h = pad2(d.getHours())
  const min = pad2(d.getMinutes())
  return `${h}:${min}`
}

const deriveExpertiseFromJob = (job: any): string => {
  const cat = String(job?.primary_area_of_expertise || job?.category || job?.expertise || '')
  return cat.trim()
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

const normalizeExpertise = (raw: string): string => {
  const v = String(raw || '').toLowerCase().trim()
  if (!v) return 'Digital Marketing'
  if (v.includes('web') || v.includes('frontend') || v.includes('backend') || v.includes('software')) return 'Web Development'
  if (v.includes('mobile') || v.includes('android') || v.includes('ios')) return 'Mobile Development'
  if (v.includes('sales')) return 'Sales'
  if (v.includes('customer') || v.includes('support') || v.includes('csr')) return 'Customer Service'
  if (v.includes('edit')) return 'Editing'
  if (v.includes('book') || v.includes('account')) return 'Book Keeping'
  if (v.includes('executive') || v.includes('assistant')) return 'Executive\u00A0Assistant'
  if (v.includes('appointment') || v.includes('calling')) return 'Appointment Setting'
  if (v.includes('marketing') || v.includes('seo') || v.includes('sem') || v.includes('social')) return 'Digital Marketing'
  if (v.includes('data') || v.includes('analytics') || v.includes('analysis')) return 'Data Analysis'
  return 'Digital Marketing'
}

const formatUTCOffset = (tz: string): string => {
  const s = String(tz || '').trim()
  if (/^UTC[+-]\d{2}:\d{2}$/.test(s)) return s
  if (/^[+-]\d{2}:\d{2}$/.test(s)) return `UTC${s}`
  if (/^\d{2}:\d{2}$/.test(s)) return `UTC+${s}`
  if (/^UTC\d{2}:\d{2}$/.test(s)) return s.replace(/^UTC/, 'UTC+')
  return 'UTC+00:00'
}

// removed recommended agent fetching

const buildAgentPayload = (raw: any): any => {
    const tzUTC = formatUTCOffset(String(raw?.time_zone || '+00:00'))
    const expertise = normalizeExpertise(String(raw?.primary_area_of_expertise || raw?.expertise || deriveExpertiseFromJob(raw)))
    const tools = Array.isArray(raw?.three_most_commonly_used_tools_or_platforms)
      ? raw.three_most_commonly_used_tools_or_platforms
      : (Array.isArray(raw?.tools) ? raw.tools.slice(0, 3) : [])
    const certsRaw = Array.isArray(raw?.certificate_url)
      ? raw.certificate_url
      : (raw?.certificates ? [].concat(raw.certificates) : [])
    const certs = certsRaw
      .map((u: any) => String(u || '').replace(/[`'\"]/g, '').trim())
      .filter((u: string) => u.length > 0)
    const hoursNum = (() => {
      const h = parseInt(String(raw?.available_hours_agent_can_commit || raw?.availability_hours || ''), 10)
      return isNaN(h) ? undefined : h
    })()
    const resolvedId = String(raw?.id || raw?._id || raw?.uuid || '')
    const base: Record<string, any> = {
      id: resolvedId,
      full_name: String(raw?.full_name || raw?.name || ''),
      email: String(raw?.email || raw?.user_email || ''),
      phone_number: String(raw?.phone_number || raw?.contact_phone || ''),
      certificate_url: certs,
      video_url: String(raw?.video_url || '').replace(/[`'\"]/g, '').trim(),
      personality_url: String(raw?.personality_url || '').replace(/[`'\"]/g, '').trim(),
      portfolio_link: String(raw?.portfolio_link || raw?.portfolio || ''),
      primary_area_of_expertise: expertise,
      years_of_experience: Number(raw?.years_of_experience ?? raw?.experience_years ?? 0),
      three_most_commonly_used_tools_or_platforms: tools,
      time_zone: tzUTC,
      is_agent_open_to_calls_and_video_meetings: Boolean(raw?.is_agent_open_to_calls_and_video_meetings ?? true),
      does_agent_have_working_computer: Boolean(raw?.does_agent_have_working_computer ?? true),
      does_agent_have_stable_internet: Boolean(raw?.does_agent_have_stable_internet ?? true),
      is_agent_comfortable_with_time_tracking_tools: Boolean(raw?.is_agent_comfortable_with_time_tracking_tools ?? true)
    }
    if (typeof hoursNum === 'number') base.available_hours_agent_can_commit = hoursNum
    const sanitized = Object.fromEntries(Object.entries(base).filter(([_, v]) => {
      if (v === null || v === undefined) return false
      if (typeof v === 'string') return v.trim().length > 0
      if (Array.isArray(v)) return v.length > 0
      return true
    }))
    return sanitized
}

const fetchAgentById = async (id: string): Promise<any | null> => {
  try {
    const resp = await apiClient.get('/v1/users/', { params: { role: 'agent', status: 'approved', id, start: 0, stop: 1 } })
    const data = resp?.data?.data
    const list = Array.isArray(data) ? data : data ? [data] : []
    return list[0] || null
  } catch {
    return null
  }
}

const fetchAgentByEmail = async (email: string): Promise<any | null> => {
  try {
    const resp = await apiClient.get('/v1/users/', { params: { role: 'agent', status: 'approved', email, start: 0, stop: 1 } })
    const data = resp?.data?.data
    const list = Array.isArray(data) ? data : data ? [data] : []
    return list[0] || null
  } catch {
    return null
  }
}

const ensureAgentDetails = async (agents: any[]) => {
  const identifiers = agents
    .map(a => (typeof a === 'string' ? a : String(a?.id || a?._id || a?.user_id || a?.agent_id || a?.email || '')))
    .filter(v => v.trim().length > 0)
  for (const key of identifiers) {
    if (!agentCache.value[key]) {
      const isEmail = key.includes('@')
      const detail = isEmail ? await fetchAgentByEmail(key) : await fetchAgentById(key)
      if (detail) {
        agentCache.value[key] = detail
      }
    }
  }
}

const canSubmit = computed(() => {
  return !!jobId.value && proposalText.value.trim().length > 0 && selectedAgents.value.length > 0
})

const viewAgentProfile = async (agent: any) => {
  let agentId = typeof agent === 'string' ? agent.trim() : resolveAgentId(agent)
  if (!agentId && typeof agent?.email === 'string' && agent.email.includes('@')) {
    try {
      const detail = await fetchAgentByEmail(agent.email)
      agentId = String(detail?.id || '').trim()
    } catch {}
  }
  if (agentId && agentId.trim()) {
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
    try {
      const auth = await api.admin.getCurrentUser()
      if (!auth.success || !auth.data) {
        throw new Error('Admin authentication required')
      }
    } catch (authErr: any) {
      error.value = authErr?.message || 'Admin authentication required'
      return
    }
    const primary = selectedAgents.value[0]
    const primaryAgentIdOrEmail = String(
      typeof primary === 'string'
        ? primary
        : (primary?.id || primary?._id || primary?.user_id || primary?.agent_id || primary?.email || '')
    ).trim()
    if (!primaryAgentIdOrEmail) {
      error.value = 'Selected agent not found. Please select a valid agent.'
      return
    }
    let agentPayload: any = { id: primaryAgentIdOrEmail }
    try {
      const rawDetail = typeof primary === 'string'
        ? (agentCache.value[primaryAgentIdOrEmail]
            || (primaryAgentIdOrEmail.includes('@') ? await fetchAgentByEmail(primaryAgentIdOrEmail) : await fetchAgentById(primaryAgentIdOrEmail)))
        : primary
      if (rawDetail && (rawDetail.id || rawDetail.email)) {
        agentPayload = buildAgentPayload(rawDetail)
      }
    } catch {}
    if (!agentPayload.password) agentPayload.password = '$2b$12$ZW5jcnlwdGVkLWhhc2gtcGFzc3dvcmQ'
    if (typeof agentPayload.email !== 'string') agentPayload.email = ''
    if (!Array.isArray(agentPayload.certificate_url)) agentPayload.certificate_url = []
    if (!agentPayload.role) agentPayload.role = 'agent'
    const start = (startDate.value && startTime.value) ? toUnix(startDate.value, startTime.value) : 0
    const end = (deadlineDate.value && deadlineTime.value) ? toUnix(deadlineDate.value, deadlineTime.value) : 0
    const payload: any = {
      agent: agentPayload,
      proposal: proposalText.value.trim(),
      break_down: {
        service: Number(serviceAmount.value) || 0,
        Charges: Number(charges.value) || 0,
        Tax: Number(tax.value) || 0
      }
    }
    if (start > 0 && end > 0) {
      payload.timeline = { start_date: start, deadline: end }
    }
    // sanitize empty strings/arrays from payload
    payload.agent = Object.fromEntries(Object.entries(payload.agent).filter(([_, v]) => {
      if (v === null || v === undefined) return false
      if (typeof v === 'string') return v.trim().length > 0
      if (Array.isArray(v)) return v.length > 0
      return true
    }))
    if (!payload.agent.id && payload.agent.email) payload.agent.id = payload.agent.email
    let res = await proposeJob(jobId.value, payload)
    let ok = (res as any)?.data?.status_code === 200 || (res as any)?.data?.status_code === 0 || typeof (res as any)?.data === 'string'
    if (ok) {
      successMessage.value = 'Proposal sent successfully'
      try {
        const title = `Admin sent a proposal`
        const desc = `A proposal has been sent for job ${jobDisplay.value?.project_title || jobId.value}`
        alertsService.createLocalAlert({
          alert_title: title,
          alert_description: desc,
          alert_type: 'admin_proposal',
          alert_primary_action: 'View',
          priority: 'high',
          alert_target_user_id: primaryAgentIdOrEmail,
          job_id: jobId.value
        })
      } catch (_) {}
      setTimeout(() => {
        router.push('/admin/notifications')
      }, 800)
    } else {
      // Fallback: minimal agent payload
      const minimal: any = { agent: { id: agentPayload.id, email: agentPayload.email || '', full_name: agentPayload.full_name || '' }, proposal: payload.proposal, break_down: payload.break_down }
      if (payload.timeline) minimal.timeline = payload.timeline
      try {
        res = await proposeJob(jobId.value, minimal as any)
        ok = (res as any)?.data?.status_code === 200 || (res as any)?.data?.status_code === 0 || typeof (res as any)?.data === 'string'
        if (ok) {
          successMessage.value = 'Proposal sent successfully'
          try {
            const title = `Admin sent a proposal`
            const desc = `A proposal has been sent for job ${jobDisplay.value?.project_title || jobId.value}`
            alertsService.createLocalAlert({
              alert_title: title,
              alert_description: desc,
              alert_type: 'admin_proposal',
              alert_primary_action: 'View',
              priority: 'high',
              alert_target_user_id: primaryAgentIdOrEmail,
              job_id: jobId.value
            })
          } catch (_) {}
          setTimeout(() => { router.push('/admin/notifications') }, 800)
        } else {
          error.value = (res as any)?.data?.detail || 'Failed to send proposal'
        }
      } catch (e2: any) {
        error.value = e2?.response?.data?.detail || e2?.message || 'Failed to send proposal'
      }
    }
  } catch (e: any) {
    error.value = e?.response?.data?.detail || e?.message || 'Failed to send proposal'
  } finally {
    submitting.value = false
  }
}

const selectAgent = async (agent: any) => {
  const id = String(agent?.id || agent?._id || agent?.user_id || agent?.agent_id || agent?.email || '').trim()
  if (!id) return
  const existingKeys = selectedAgents.value.map((v: any) => typeof v === 'string' ? v : String(v?.id || v?._id || v?.user_id || v?.agent_id || v?.email || ''))
  if (!existingKeys.includes(id)) {
    selectedAgents.value = [...selectedAgents.value, agent]
    await ensureAgentDetails(selectedAgents.value)
    try {
      const idsOnly = selectedAgents.value
        .map((v: any) => typeof v === 'string' ? v.trim() : resolveAgentId(v))
        .filter((s: string) => s && s.trim().length > 0)
      if (idsOnly.length > 0) {
        try {
          const raw = localStorage.getItem('clientJobRecommendedMap')
          const map = raw ? JSON.parse(raw) : {}
          map[jobId.value] = idsOnly
          localStorage.setItem('clientJobRecommendedMap', JSON.stringify(map))
        } catch {}
      }
    } catch {}
  }
}

const loadPageData = async () => {
  try {
    const id = jobId.value
    if (id) {
      const res = await getJobById(id)
      const job = (res as any)?.data?.data || (res as any)?.data
      jobRaw.value = job
      jobDisplay.value = {
        project_title: String(job?.project_title || job?.job_title || job?.title || ''),
        primary_area_of_expertise: String(job?.primary_area_of_expertise || job?.category || ''),
        budget: typeof job?.budget === 'number' ? job?.budget : (job?.budget || ''),
        description: String(job?.description || job?.requirement || '')
      }
      // Build selection from backend first
      let selected: any[] = []
      if (selected.length === 0 && Array.isArray(job?.recommended_agents) && job.recommended_agents.length > 0) {
        const rec = job.recommended_agents[0] as any
        let recId = typeof rec === 'string'
          ? rec
          : String(rec?.id || rec?._id || rec?.user_id || rec?.agent_id || rec?.email || '')
        if ((!recId || !recId.trim()) && typeof rec?.email === 'string' && rec.email.trim()) {
          try {
            const resp = await apiClient.get('/v1/users/', { params: { role: 'agent', email: rec.email.trim(), start: 0, stop: 1 } })
            const data = resp?.data?.data
            const list = Array.isArray(data) ? data : data ? [data] : []
            const first = list[0] as any
            const fetchedId = typeof first?.id === 'string' ? first.id : ''
            if (fetchedId && fetchedId.trim()) recId = fetchedId.trim()
          } catch {}
        }
        if (recId && recId.trim().length > 0) {
          selected = [recId]
          try {
            try {
              const raw = localStorage.getItem('clientJobRecommendedMap')
              const map = raw ? JSON.parse(raw) : {}
              map[id] = [recId]
              localStorage.setItem('clientJobRecommendedMap', JSON.stringify(map))
            } catch {}
          } catch {}
        }
      }
      // If no recommendation exists, fall back to any agents or previously selected agents
      if (selected.length === 0 && Array.isArray(job?.agents)) {
        selected = job.agents
      }
      if (selected.length === 0 && Array.isArray(job?.selected_agents)) {
        selected = job.selected_agents
      }
      // Fallback to single-agent fields
      const singleAgentCandidates: string[] = [
        String(job?.agent_id || ''),
        String((job?.agent || {})?.id || ''),
        String(job?.assigned_agent || '')
      ].filter(s => s.trim().length > 0)
      if (selected.length === 0 && singleAgentCandidates.length > 0) {
        selected = [singleAgentCandidates[0]]
      }
      if (selected.length > 0) {
        selectedAgents.value = selected
        await ensureAgentDetails(selectedAgents.value)
        selectedAgents.value = selectedAgents.value.filter((a: any) => {
          const key = typeof a === 'string' ? a : String(a?.id || a?._id || a?.user_id || a?.agent_id || a?.email || '')
          const detail = agentCache.value[key]
          const roleLower = String((detail?.role && (detail.role as any)?.name) || detail?.role || '').trim().toLowerCase()
          const approved = Boolean((detail as any)?.admin_approved)
          return roleLower === 'agent' && approved
        })
      }
      try {
        agentsLoading.value = true
        agentsError.value = null
        const category = String(jobDisplay.value?.primary_area_of_expertise || jobDisplay.value?.category || '').trim()
        const resp = await agentsService.getAgentsByCategory(category, { jobId: id, start: 0, stop: 20 })
        if (resp.success && resp.data) {
          availableAgents.value = resp.data
        } else {
          availableAgents.value = []
          agentsError.value = resp.error || 'Failed to load agents'
        }
        if (!availableAgents.value || availableAgents.value.length === 0) {
          const general = await agentsService.getRecommendedAgents({ start: 0, stop: 20, role: 'agent' } as any)
          if (general.success && general.data && general.data.length > 0) {
            availableAgents.value = general.data
            agentsError.value = null
          } else {
            const avail = await agentsService.getAvailableAgents({ start: 0, stop: 20 })
            if (avail.success && avail.data && avail.data.length > 0) {
              availableAgents.value = avail.data
              agentsError.value = null
            }
          }
        }
      } catch (e: any) {
        availableAgents.value = []
        agentsError.value = e?.message || 'Failed to load agents'
      } finally {
        agentsLoading.value = false
      }
      if (job?.timeline && typeof job.timeline === 'object') {
        jobTimeline.value = job.timeline
        const sd = Number(job.timeline.start_date || 0)
        const ed = Number(job.timeline.deadline || 0)
        if (sd > 0) {
          startDate.value = toDateInput(sd)
          startTime.value = toTimeInput(sd)
        }
        if (ed > 0) {
          deadlineDate.value = toDateInput(ed)
          deadlineTime.value = toTimeInput(ed)
        }
      }
      // No localStorage fallbacks; rely on backend/alerts only
      if (selectedAgents.value.length === 0) {
        try {
          let state = alertsService.getNotificationState()
          const hasLocal = Array.isArray(state.alerts) && state.alerts.length > 0
          if (!hasLocal) {
            await alertsService.getAlerts({ start: 0, stop: 50 })
            state = alertsService.getNotificationState()
          }
          const ids = (state.alerts || [])
            .filter((a: any) => String(a?.job_id || '') === id && typeof a?.alert_type === 'string' && a.alert_type.toLowerCase().includes('meeting'))
            .map((a: any) => String(a?.agent_id || ''))
            .filter((aid: string) => aid.trim().length > 0)
          const uniqueIds = Array.from(new Set(ids))
          const resolved: any[] = []
          for (const aid of uniqueIds) {
            const detail = await fetchAgentById(aid)
            if (detail && detail.id) {
              resolved.push(detail)
            } else {
              resolved.push(aid)
            }
          }
          if (resolved.length > 0) {
            selectedAgents.value = resolved
            await ensureAgentDetails(selectedAgents.value)
            try {
              const idsOnly = resolved
                .map((v: any) => typeof v === 'string' ? v.trim() : resolveAgentId(v))
                .filter((s: string) => s && s.trim().length > 0)
              if (idsOnly.length > 0) {
                try {
                  const raw = localStorage.getItem('clientJobRecommendedMap')
                  const map = raw ? JSON.parse(raw) : {}
                  map[id] = idsOnly
                  localStorage.setItem('clientJobRecommendedMap', JSON.stringify(map))
                } catch {}
              }
            } catch {}
          }
        } catch {}
      }
      
    }
  } catch {}
}

onMounted(loadPageData)

import { watch } from 'vue'
watch(() => route.params.jobId, async (newId) => {
  if (typeof newId === 'string' && newId.trim()) {
    selectedAgents.value = []
    await loadPageData()
  }
})
</script>

<style scoped>
</style>

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

        

        <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 class="text-sm font-semibold text-gray-800 mb-3">Chosen Agent</h3>
          <div v-if="selectedAgents.length > 0" class="max-h-56 overflow-y-auto divide-y divide-gray-100 border border-gray-100 rounded-md">
            <div v-for="agent in selectedAgents" :key="String(agent?.id || agent)" class="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors" @click="viewAgentProfile(agent)">
              <div class="min-w-0 flex-1">
                <p class="text-sm text-gray-800 truncate">{{ agentName(agent) }}</p>
                <p class="text-xs text-gray-500 truncate">{{ agentEmail(agent) }}</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500">View Profile</span>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
          <div v-else class="text-sm text-gray-600">No agent selected for this job.</div>
          <p class="mt-2 text-xs text-gray-500">Selected: {{ selectedAgents.length }}</p>
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
    primary_area_of_expertise: String(raw?.primary_area_of_expertise || raw?.expertise || ''),
    years_of_experience: Number(raw?.years_of_experience ?? raw?.experience_years ?? 0),
    three_most_commonly_used_tools_or_platforms: Array.isArray(raw?.three_most_commonly_used_tools_or_platforms) ? raw.three_most_commonly_used_tools_or_platforms : (Array.isArray(raw?.tools) ? raw.tools.slice(0,3) : []),
    available_hours_agent_can_commit: String(raw?.available_hours_agent_can_commit || raw?.availability_hours || '40_hours_per_week'),
    time_zone: String(raw?.time_zone || ''),
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
  } catch {
    return null
  }
}

const fetchAgentByEmail = async (email: string): Promise<any | null> => {
  try {
    const resp = await apiClient.get('/v1/users/', { params: { role: 'agent', email, start: 0, stop: 1 } })
    const data = resp?.data?.data
    const list = Array.isArray(data) ? data : data ? [data] : []
    return list[0] || null
  } catch {
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
    const primaryAgentId = typeof primary === 'string' ? primary : (primary?.id || '')
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
          if (recommendedAgents.value.length === 0) {
            await fetchRecommendedAgentsForJob(job)
          }
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
      }
    } catch {}
  } catch {}
})
const deriveExpertiseFromJob = (job: any): string => {
  const cat = String(job?.primary_area_of_expertise || job?.category || job?.expertise || '')
  return cat.trim()
}

const fetchRecommendedAgentsForJob = async (job: any) => {
  try {
    const expertise = deriveExpertiseFromJob(job)
    const params: Record<string, any> = { role: 'agent', start: 0, stop: 10 }
    if (expertise) params.expertise = expertise
    const resp = await apiClient.get('/v1/users/', { params })
    const data = resp?.data?.data
    const list = Array.isArray(data) ? data : data ? [data] : []
    const mapped = list.map((u: any) => ({
      id: String(u?.id || u?._id || u?.uuid || ''),
      email: String(u?.email || u?.user_email || ''),
      full_name: String(u?.full_name || u?.name || '')
    }))
    recommendedAgents.value = mapped.filter((a: any) => a.id || a.email)
    recommendedLoaded.value = true
  } catch {
    recommendedAgents.value = []
  }
}
</script>

<style scoped>
</style>
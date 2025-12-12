<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-800">Agent Memo</h1>
        <div class="text-sm text-gray-600">Admin</div>
      </div>

  <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
    <div class="grid grid-cols-1 gap-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-700 mb-1">Agent Name</label>
          <input :value="agentName" readonly class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50" />
        </div>
        <div>
          <label class="block text-sm text-gray-700 mb-1">Agent Email</label>
          <input :value="agentEmail" readonly class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50" />
        </div>
      </div>
      <div>
        <label class="block text-sm text-gray-700 mb-1">Job ID</label>
        <input :value="jobId" readonly class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50" />
      </div>
      <div>
        <label class="block text-sm text-gray-700 mb-1">Subject</label>
        <input v-model="subject" placeholder="Memo subject" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm text-gray-700 mb-1">Message</label>
        <textarea v-model="message" rows="6" placeholder="Write your memo to the agent" class="w-full border border-gray-300 rounded-lg px-3 py-2"></textarea>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-700 mb-1">Start Date</label>
          <input v-model="startDate" type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm text-gray-700 mb-1">Start Time</label>
          <input v-model="startTime" type="time" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm text-gray-700 mb-1">Deadline Date</label>
          <input v-model="deadlineDate" type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm text-gray-700 mb-1">Deadline Time</label>
          <input v-model="deadlineTime" type="time" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
      </div>
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <h3 class="text-sm font-semibold text-gray-800 mb-2">Breakdown</h3>
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
          <div class="flex items.center justify-end gap-2">
            <button @click="cancel" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700">Cancel</button>
            <button :disabled="submitting || !canSubmit" @click="submitMemo" class="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50">Send Memo</button>
          </div>
          <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
          <p v-if="successMessage" class="text-sm text-green-600">{{ successMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { apiClient } from '@/services/apiService'
import { proposeJob, getJobById } from '../../services/jobs'

const route = useRoute()
const router = useRouter()
const agentId = computed(() => String(route.params.agentId || route.query.agentId || ''))
const jobId = computed(() => String(route.query.jobId || ''))

const subject = ref('')
const message = ref('')
const submitting = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const agentName = ref('')
const agentEmail = ref('')
const toast = useToast()

const startDate = ref('')
const startTime = ref('')
const deadlineDate = ref('')
const deadlineTime = ref('')
const serviceAmount = ref<number>(0)
const charges = ref<number>(7)
const tax = ref<number>(10)

const toUnix = (d: string, t?: string): number => {
  try {
    if (!d) return 0
    const base = new Date(d)
    if (t && t.trim()) {
      const [hh, mm] = t.split(':').map(v => parseInt(v, 10))
      base.setHours(hh || 0, mm || 0, 0, 0)
    }
    return Math.floor(base.getTime() / 1000)
  } catch { return 0 }
}

const canSubmit = computed(() => {
  const hasText = subject.value.trim().length > 0 && message.value.trim().length > 0
  const hasAgent = !!agentId.value
  const hasStart = !!startDate.value && !!startTime.value
  const hasDeadline = !!deadlineDate.value && !!deadlineTime.value
  const start = hasStart ? toUnix(startDate.value, startTime.value) : 0
  const end = hasDeadline ? toUnix(deadlineDate.value, deadlineTime.value) : 0
  const validOrder = start > 0 && end > 0 && end >= start
  return hasAgent && hasText && hasStart && hasDeadline && validOrder
})

const submitMemo = async () => {
  if (submitting.value) return
  error.value = null
  successMessage.value = null
  if (!canSubmit.value) {
    const hasStart = !!startDate.value && !!startTime.value
    const hasDeadline = !!deadlineDate.value && !!deadlineTime.value
    if (!subject.value.trim() || !message.value.trim()) {
      error.value = 'Enter subject and message'
      return
    }
    if (!hasStart || !hasDeadline) {
      error.value = 'Select start and deadline date/time'
      return
    }
    const start = toUnix(startDate.value, startTime.value)
    const end = toUnix(deadlineDate.value, deadlineTime.value)
    if (!(end >= start)) {
      error.value = 'Deadline must be after start time'
      return
    }
  }
  submitting.value = true
  try {
    const joinText = () => {
      const s = subject.value.trim()
      const m = message.value.trim()
      if (s && m) return `${s}\n\n${m}`
      return s || m
    }
    const agentKey = agentId.value || agentEmail.value
    let detail: any = null
    const buildAgentPayload = (raw: any): any => {
      const base: Record<string, any> = {
        id: String(raw?.id || agentId.value || '').trim(),
        full_name: String(raw?.full_name || agentName.value || ''),
        email: String(raw?.email || agentEmail.value || ''),
        role: 'agent'
      }
      const sanitized = Object.fromEntries(Object.entries(base).filter(([_, v]) => {
        if (v === null || v === undefined) return false
        if (typeof v === 'string') return v.trim().length > 0
        return true
      }))
      if (!sanitized.password) sanitized.password = '$2b$12$ZW5jcnlwdGVkLWhhc2gtcGFzc3dvcmQ'
      if (!Array.isArray(sanitized.certificate_url)) sanitized.certificate_url = []
      return sanitized
    }
    const payload = {
      agent: buildAgentPayload(detail || {}),
      timeline: {
        start_date: toUnix(startDate.value, startTime.value),
        deadline: toUnix(deadlineDate.value, deadlineTime.value)
      },
      proposal: joinText(),
      break_down: {
        service: Number(serviceAmount.value) || 0,
        Charges: Number(charges.value) || 0,
        Tax: Number(tax.value) || 0
      }
    }
    if (!jobId.value) throw new Error('Missing job')
    const resp = await proposeJob(jobId.value, payload)
    if (!resp || (resp as any)?.status >= 400) throw new Error('Failed to send memo')
    const { alertsService } = await import('@/services/notificationsService')
    alertsService.createLocalAlert({
      alert_title: 'Memo Sent To Agent',
      alert_description: `A memo was sent to agent ${agentName.value || agentId.value}: ${subject.value}`,
      alert_type: 'info',
      alert_primary_action: 'Agent',
      alert_secondary_action: 'Client',
      priority: 'medium',
      alert_target_user_id: 'admin',
      agent_id: agentId.value,
      job_id: jobId.value
    } as any)
    alertsService.createLocalAlert({
      alert_title: 'New Memo From Admin',
      alert_description: subject.value,
      alert_type: 'info',
      alert_primary_action: 'View Details',
      alert_secondary_action: 'Acknowledge',
      priority: 'medium',
      alert_target_user_id: agentId.value,
      job_id: jobId.value
    } as any)
    successMessage.value = 'Memo sent successfully'
    try { toast.success(`Memo sent to ${agentName.value || agentId.value}`) } catch {}
    setTimeout(() => {
      router.push('/admin/notifications')
    }, 800)
  } catch (e: any) {
    error.value = e?.message || 'Failed to send memo'
  } finally {
    submitting.value = false
  }
}

const cancel = () => {
  router.back()
}

const loadAgentDetails = async () => {
  try {
    const id = agentId.value
    const jid = jobId.value
    if (!id || !jid) return
    const res = await getJobById(jid)
    const job = (res as any)?.data?.data || (res as any)?.data || null
    const resolveId = (a: any): string => {
      const c: unknown[] = [a?.id, a?._id, a?.user_id, a?.agent_id, a?.uuid, a?.user?.id]
      for (const v of c) {
        if (typeof v === 'string' && v.trim().length > 0) return v.trim()
        if (typeof v === 'number') return String(v)
      }
      const em = typeof a?.email === 'string' ? a.email.trim() : ''
      return em
    }
    const pools: any[] = []
    if (Array.isArray((job as any)?.agents)) pools.push(...(job as any).agents)
    if (Array.isArray((job as any)?.selected_agents)) pools.push(...(job as any).selected_agents)
    if (Array.isArray((job as any)?.recommended_agents)) pools.push(...(job as any).recommended_agents)
    const single = (job as any)?.agent || (job as any)?.agent_profile || (job as any)?.agent_details
    if (single) pools.push(single)
    let found: any = null
    for (const a of pools) {
      const rid = typeof a === 'string' ? a.trim() : resolveId(a)
      if (rid && rid === id) {
        found = typeof a === 'string' ? null : a
        break
      }
    }
    const nm = String(found?.full_name || found?.name || '').trim()
    const em = String(found?.email || found?.user_email || '').trim()
    if (nm) agentName.value = nm
    if (em) agentEmail.value = em
    if (job?.timeline && typeof job.timeline === 'object') {
      const sd = Number(job.timeline.start_date || 0)
      const ed = Number(job.timeline.deadline || 0)
      const toDateInput = (u: number): string => {
        if (!u || u <= 0) return ''
        try { return new Date(u * 1000).toISOString().slice(0, 10) } catch { return '' }
      }
      const toTimeInput = (u: number): string => {
        if (!u || u <= 0) return ''
        try {
          const d = new Date(u * 1000)
          const h = String(d.getHours()).padStart(2, '0')
          const m = String(d.getMinutes()).padStart(2, '0')
          return `${h}:${m}`
        } catch { return '' }
      }
      if (sd > 0) {
        startDate.value = toDateInput(sd)
        startTime.value = toTimeInput(sd)
      }
      if (ed > 0) {
        deadlineDate.value = toDateInput(ed)
        deadlineTime.value = toTimeInput(ed)
      }
    }
  } catch {}
}

loadAgentDetails()
</script>

<style scoped>
</style>

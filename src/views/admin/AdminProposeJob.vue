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

const route = useRoute()
const router = useRouter()
const jobId = computed(() => String(route.params.jobId || route.query.jobId || ''))

const recommendedAgents = ref<string[]>([])
const proposalText = ref('')
const charges = ref<number>(7)
const tax = ref<number>(10)
const serviceAmount = ref<number>(0)
const submitting = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const selectedAgents = ref<any[]>([])
const agentName = (agent: any) => {
  if (typeof agent === 'string') return agent
  return String(agent?.name || agent?.full_name || agent?.email || agent?.id || '')
}
const agentEmail = (agent: any) => {
  if (typeof agent === 'string') return ''
  return String(agent?.email || '')
}
const jobTimeline = ref<{ start_date: number; deadline: number } | null>(null)

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
    const payload = {
      agent: primaryAgentId,
      timeline: jobTimeline.value || { start_date: Math.floor(Date.now() / 1000), deadline: Math.floor(Date.now() / 1000) },
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
        if (selectedIds.length > 0) {
          recommendedAgents.value = selectedIds
        }
        selectedAgents.value = selected
        if (job?.timeline && typeof job.timeline === 'object') {
          jobTimeline.value = job.timeline
        }
      }
    } catch {}
  } catch {}
})
</script>

<style scoped>
</style>
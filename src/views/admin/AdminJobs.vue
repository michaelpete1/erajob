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
          <div v-for="job in jobs" :key="jobKey(job)" class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div class="min-w-0">
                <h2 class="text-lg font-semibold text-gray-900 truncate">{{ jobTitle(job) }}</h2>
                <p class="text-sm text-gray-600 mt-1 truncate">{{ jobDescription(job) }}</p>
                <div class="mt-2 text-xs text-gray-500">Category: <span class="font-medium text-gray-700">{{ jobCategory(job) }}</span></div>
                <div class="mt-1 text-xs text-gray-500">Budget: <span class="font-medium text-gray-700">{{ jobBudget(job) }}</span></div>
              </div>
              <div class="flex items-center gap-2 sm:flex-col sm:items-stretch">
                <button @click="goToProposal(job)" class="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-sm">Propose to Client</button>
                <button @click="memoSelected(job)" class="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm">Memo to Agent</button>
              </div>
            </div>

            <div v-if="expandedJobId === jobId(job)" class="mt-4 border-t border-gray-100 pt-3">
              <div v-if="jobAgents(job).length > 0" class="space-y-2">
                <div class="text-sm font-medium text-gray-700">Agents</div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div v-for="agent in jobAgents(job)" :key="String(agent?.id || agent)" class="flex items-center justify-between border border-gray-200 rounded-lg p-2">
                    <div class="text-sm text-gray-700 truncate">{{ agentName(agent) }}</div>
                    <button @click="goToMemo(agent)" class="px-2 py-1 bg-gray-900 text-white rounded-md text-xs">Memo</button>
                  </div>
                </div>
              </div>
              <div v-else class="text-sm text-gray-600">No agents assigned. Use "Find Agents" to select an agent.</div>
              <div class="mt-3">
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminFindAgentsModal from '@/components/AdminFindAgentsModal.vue'
import { api } from '@/services/apiService'

const router = useRouter()
const jobs = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const expandedJobId = ref<string>('')
const isFindAgentsOpen = ref(false)
const activeJobForAgents = ref<{ id: string; title: string; category: string; pay: string } | null>(null)

const jobId = (job: any): string => String(job?.id || job?.job_id || job?.ID || '')
const jobKey = (job: any): string => String(jobId(job) || Math.random().toString(36))
const jobTitle = (job: any): string => String(job?.project_title || job?.job_title || job?.title || 'Untitled Job')
const jobDescription = (job: any): string => String(job?.description || job?.requirement || '')
const jobCategory = (job: any): string => String(job?.category || job?.primary_area_of_expertise || 'General')
const jobBudget = (job: any): string => {
  const b = job?.budget
  return typeof b === 'number' ? `$${b.toLocaleString()}` : String(b || '$0')
}
const jobAgents = (job: any): any[] => Array.isArray(job?.selected_agents) ? job.selected_agents : (Array.isArray(job?.agents) ? job.agents : [])
const agentName = (agent: any): string => String(agent?.full_name || agent?.name || agent?.email || agent?.id || 'Agent')

const refresh = async () => {
  loading.value = true
  error.value = null
  try {
    const resp = await api.jobs.listAdminJobs(0, 25)
    jobs.value = Array.isArray(resp.data) ? resp.data : (resp.data ? [resp.data as any] : [])
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
    goToMemo(agents[0])
  } else {
    showFindAgents(job)
  }
}

const goToMemo = (agent: any) => {
  const id = String(agent?.id || agent)
  if (!id) return
  router.push(`/admin/memo/${id}`)
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
</script>

<style scoped>
</style>
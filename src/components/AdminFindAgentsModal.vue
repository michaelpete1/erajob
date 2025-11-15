<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeModal">
    <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Find Agents for Job</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="mb-6">
          <div class="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 class="font-semibold text-gray-900 mb-2">Job Details</h4>
            <p class="text-sm text-gray-600"><strong>Title:</strong> {{ job?.title }}</p>
            <p class="text-sm text-gray-600"><strong>Category:</strong> {{ job?.category }}</p>
            <p class="text-sm text-gray-600"><strong>Budget:</strong> {{ job?.pay }}</p>
          </div>
        </div>

        <div class="mb-6">
          <div class="flex flex-col sm:flex-row gap-4 mb-4">
            <div class="flex-1">
              <label for="search-query" class="block text-sm font-medium text-gray-700 mb-2">
                Search Agents
              </label>
              <input
                id="search-query"
                v-model="searchQuery"
                type="text"
                placeholder="Search by name, skills, or category..."
                class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all"
              />
            </div>
            <div class="flex items-end">
              <button
                @click="searchAgents"
                :disabled="isSearching"
                class="px-6 py-3 bg-brand-teal hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors min-h-[44px] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="isSearching" class="w-4 h-4 inline mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                {{ isSearching ? 'Searching...' : 'Search' }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="agents.length > 0" class="mb-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">Available Agents</h4>
          <div class="space-y-4 max-h-96 overflow-y-auto">
            <div
              v-for="agent in agents"
              :key="agent.id"
              class="border border-gray-200 rounded-lg p-4 hover:border-teal-200 hover:shadow-md transition-all"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h5 class="font-semibold text-gray-900">{{ agent.name }}</h5>
                  <p class="text-sm text-gray-600 mb-2">{{ agent.email }}</p>
                  <div class="flex flex-wrap gap-2 mb-3">
                    <span
                      v-for="skill in agent.skills"
                      :key="skill"
                      class="px-2 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full"
                    >
                      {{ skill }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-700">{{ agent.bio }}</p>
                </div>
                <button
                  @click="assignAgent(agent)"
                  :disabled="isAssigning"
                  class="ml-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors min-h-[36px] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="isAssigning" class="w-4 h-4 inline mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  {{ isAssigning ? 'Assigning...' : 'Assign' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="searched && !isSearching" class="text-center py-8">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No agents found</h3>
          <p class="text-gray-600">Try adjusting your search criteria or check back later.</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="closeModal"
            class="flex-1 px-4 py-2.5 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium transition-colors min-h-[44px] touch-manipulation"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import { agentsService } from '../services/agentsService'
import { api } from '@/services/apiService'

interface Agent {
  id: string
  name: string
  email: string
  skills: string[]
  bio: string
}

interface Job {
  id: string
  title: string
  category: string
  pay: string
}

const props = defineProps<{
  isOpen: boolean
  job: Job | null
}>()

const emit = defineEmits<{
  close: []
  agentAssigned: [agent: Agent]
}>()

const searchQuery = ref('')
const agents = ref<Agent[]>([])
const isSearching = ref(false)
const isAssigning = ref(false)
const searched = ref(false)

const closeModal = () => {
  emit('close')
}

const searchAgents = async () => {
  if (!searchQuery.value.trim()) {
    alert('Please enter a search query.')
    return
  }

  isSearching.value = true
  searched.value = true

  try {
    // This would typically call an API to search agents
    // For now, we'll simulate with mock data
    const response = await agentsService.searchAgents({ query: searchQuery.value })
    if (response.success && response.data) {
      agents.value = response.data.map(agent => ({
        id: agent.id || '',
        name: agent.full_name || '',
        email: agent.email || '',
        skills: agent.skills || [],
        bio: agent.bio || ''
      }))
    } else {
      agents.value = []
    }
  } catch (error) {
    console.error('Error searching agents:', error)
    agents.value = []
  } finally {
    isSearching.value = false
  }
}

const assignAgent = async (agent: Agent) => {
  if (!props.job) return

  if (!confirm(`Are you sure you want to assign ${agent.name} to this job?`)) {
    return
  }

  isAssigning.value = true

  try {
    const jobId = String(props.job.id || '')
    if (!jobId) throw new Error('Missing job ID')

    let existing: string[] = []
    try {
      const res = await api.jobs.getJob(jobId)
      if (res.success && res.data) {
        const sel = (res.data as any)?.selected_agents
        if (Array.isArray(sel)) {
          existing = sel
        }
      }
    } catch {}

    const nextSelected = Array.from(new Set([...(existing || []).map(v => String(v)), String(agent.id)]))
    const resp = await api.jobs.updateJob(jobId, { selected_agents: nextSelected })
    if (!resp.success) {
      throw new Error(resp.error || 'Failed to assign agent')
    }

    alert(`Agent ${agent.name} has been assigned to the job successfully!`)
    emit('agentAssigned', agent)
    closeModal()
  } catch (error: any) {
    console.error('Error assigning agent:', error)
    alert(error?.message || 'Failed to assign agent.')
  } finally {
    isAssigning.value = false
  }
}
</script>

<style scoped>
/* Scoped styles can be added here */
</style>

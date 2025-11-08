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
            <h1 class="text-lg font-semibold">
              {{ currentJobId ? getJobTitle(currentJobId) : 'All Proposals' }}
            </h1>
            <p v-if="currentJobId" class="text-xs text-white/80">
              {{ filteredProposals.length }} proposal{{ filteredProposals.length !== 1 ? 's' : '' }}
            </p>
          </div>
        </div>
        <button 
          v-if="!currentJobId"
          @click="createNewProposal" 
          class="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Proposal
        </button>
        <button 
          v-else
          @click="$router.push('/proposals')" 
          class="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
        >
          View All Proposals
        </button>
      </div>
      
      <!-- Job filter indicator -->
      <div v-if="currentJobId" class="mt-2 pt-2 border-t border-white/10">
        <div class="flex items-center justify-between">
          <span class="text-xs text-white/80">Filtered by job</span>
          <button 
            @click="$router.push(`/agent/job/${currentJobId}`)" 
            class="text-xs font-medium text-white/90 hover:text-white flex items-center"
          >
            Back to Job
            <svg class="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </header>
    
    <main class="p-4 pb-24">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal"></div>
      </div>

      <!-- Error State -->
      <div v-if="error && !loading" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-700 font-medium">{{ error }}</p>
        </div>
      </div>

      <!-- Content (only show when not loading and no error) -->
      <div v-if="!loading && !error">
      <!-- Filter Tabs -->
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-2 text-sm font-medium',
            activeTab === tab.id 
              ? 'text-brand-teal border-b-2 border-brand-teal' 
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          {{ tab.label }}
          <span v-if="tab.count > 0" class="ml-1 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Search Bar -->
      <div class="mb-4">
        <div class="relative">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search proposals..." 
            class="w-full px-4 py-2 pl-10 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
          >
          <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Proposal List -->
      <div class="space-y-3">
        <div 
          v-for="proposal in filteredProposals" 
          :key="proposal.id"
          @click="viewProposal(proposal)"
          class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <h3 class="font-semibold text-gray-900 truncate">{{ proposal.projectName }}</h3>
                <span 
                  class="text-xs font-medium px-2 py-0.5 rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': proposal.status === 'accepted',
                    'bg-yellow-100 text-yellow-800': proposal.status === 'pending',
                    'bg-red-100 text-red-800': proposal.status === 'rejected',
                    'bg-blue-100 text-blue-800': proposal.status === 'submitted'
                  }"
                >
                  {{ formatStatus(proposal.status) }}
                </span>
              </div>
              
              <div class="flex items-center text-sm text-gray-600 mb-2">
                <span>For: {{ proposal.clientName }}</span>
                <span class="mx-2">•</span>
                <span>Budget: ${{ (proposal.budget * 1.17).toFixed(2) }}</span>
              </div>
              
              <p class="text-sm text-gray-600 line-clamp-2 mb-3">{{ proposal.description }}</p>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center text-xs text-gray-500">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDate(proposal.submittedDate) }}
                </div>
                
                <div class="flex items-center">
                  <span class="text-xs text-gray-500 mr-2">View Details</span>
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && !error && filteredProposals.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No proposals yet</h3>
        <p class="text-gray-500 mb-4">Create a new proposal to get started</p>
        <button @click="createNewProposal" class="bg-brand-teal text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-teal/90 transition-colors">
          Create Proposal
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// Simulate API service for proposals
const proposalsService = {
  async getProposals(filters?: { status?: string; jobId?: string }): Promise<{ success: boolean; data?: any[]; error?: string }> {
    // In a real implementation, this would call:
    // const result = await api.get('/proposals', { params: filters })

    // For now, simulate API response with filtered data
    const mockApiResponse = {
      success: true,
      data: proposals.value.filter(p => {
        if (filters?.status && p.status !== filters.status) return false
        if (filters?.jobId && p.jobId !== filters.jobId) return false
        return true
      })
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    return mockApiResponse
  },

  async getJobs(): Promise<{ success: boolean; data?: any[]; error?: string }> {
    // In a real implementation, this would call:
    // const result = await api.get('/jobs')

    // For now, simulate API response
    const mockApiResponse = {
      success: true,
      data: jobs.value
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return mockApiResponse
  }
}

const router = useRouter()
const route = useRoute()

// Refs
const searchQuery = ref('')
const activeTab = ref('all')
const currentJobId = ref<string>('')
const loading = ref(false)
const error = ref<string | null>(null)

// Data
const proposals = ref<any[]>([])
const jobs = ref<any[]>([])

// Tabs for filtering proposals
const tabs = computed(() => [
  { id: 'all', label: 'All Proposals', count: proposals.value.length },
  { id: 'pending', label: 'Pending', count: proposals.value.filter((p: any) => p.status === 'pending').length },
  { id: 'accepted', label: 'Accepted', count: proposals.value.filter((p: any) => p.status === 'accepted').length },
  { id: 'rejected', label: 'Rejected', count: proposals.value.filter((p: any) => p.status === 'rejected').length },
  { id: 'submitted', label: 'Submitted', count: proposals.value.filter((p: any) => p.status === 'submitted').length }
])

// Load proposals and jobs data
async function loadProposals() {
  loading.value = true
  error.value = null

  try {
    // Load jobs first
    const jobsResult = await proposalsService.getJobs()
    if (jobsResult.success && jobsResult.data) {
      jobs.value = jobsResult.data
    }

    // Load proposals with filters
    const filters: any = {}
    if (activeTab.value !== 'all') {
      filters.status = activeTab.value
    }
    if (currentJobId.value) {
      filters.jobId = currentJobId.value
    }

    const proposalsResult = await proposalsService.getProposals(filters)
    if (proposalsResult.success && proposalsResult.data) {
      proposals.value = proposalsResult.data
    } else {
      error.value = proposalsResult.error || 'Failed to load proposals'
    }
  } catch (caughtError) {
    console.error('Error loading proposals:', caughtError)
    error.value = 'Failed to load proposals'
  } finally {
    loading.value = false
  }
}

// Watch for route changes to update the job ID filter
watch(() => route.query.jobId, (newJobId) => {
  currentJobId.value = Array.isArray(newJobId) ? newJobId[0] || '' : newJobId || ''
  // Update the active tab to 'all' when job ID changes
  activeTab.value = 'all'
  loadProposals() // Reload proposals when job filter changes
}, { immediate: true })

// Load data on mount
onMounted(() => {
  loadProposals()
})

// Get job title by ID
const getJobTitle = (jobId: string) => {
  const job = jobs.value.find(j => j.id === jobId)
  return job ? `${job.title} (${job.client})` : 'Unknown Job'
}

const filteredProposals = computed(() => {
  return proposals.value.filter((p: any) => {
    const searchLower = searchQuery.value.toLowerCase()
    const matchesSearch = searchQuery.value === '' ||
      p.projectName.toLowerCase().includes(searchLower) ||
      p.clientName.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    const matchesStatus = activeTab.value === 'all' || p.status === activeTab.value
    const matchesJob = !currentJobId.value || p.jobId === currentJobId.value

    return matchesSearch && matchesStatus && matchesJob
  })
})

const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': 'Pending Review',
    'accepted': 'Accepted',
    'rejected': 'Rejected',
    'submitted': 'Submitted'
  }
  return statusMap[status] || status
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const viewProposal = (proposal: any) => {
  // Navigate to proposal detail view
  router.push(`/proposals/${proposal.id}`)
}

const createNewProposal = () => {
  // Navigate to create proposal form
  router.push('/proposals/new')
}
</script>

<style scoped>
/* Custom scrollbar */
main {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

main::-webkit-scrollbar {
  width: 6px;
}

main::-webkit-scrollbar-track {
  background: #f1f5f9;
}

main::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

main::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Line clamp for description */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

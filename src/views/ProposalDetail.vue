<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <button 
          @click="$router.back()" 
          class="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Back to proposals"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-lg font-semibold text-gray-900">Proposal Details</h1>
        <div class="w-9"></div> <!-- Spacer for alignment -->
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="max-w-4xl mx-auto px-4 py-8">
      <div class="animate-pulse space-y-4">
        <div class="h-8 bg-gray-200 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        <div class="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-4 py-8">
      <div class="bg-red-50 border-l-4 border-red-400 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Proposal Content -->
    <div v-else class="max-w-4xl mx-auto px-4 py-6 space-y-8">
      <!-- Header Section -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-2xl font-bold text-gray-900">{{ proposal.projectName }}</h1>
              <span 
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
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
            <p class="text-gray-600">Submitted on {{ formatDate(proposal.submittedDate) }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-2xl font-bold text-gray-900">${{ (proposal.budget * 1.17).toFixed(2) }}</span>
            <span class="text-sm text-gray-500">Budget</span>
          </div>
        </div>
      </div>

      <!-- Client & Project Details -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Client Card -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Client</h2>
          <div class="flex items-center gap-4">
            <img 
              :src="proposal.clientAvatar" 
              :alt="proposal.clientName"
              class="w-12 h-12 rounded-full object-cover"
            >
            <div>
              <h3 class="font-medium text-gray-900">{{ proposal.clientName }}</h3>
              <p class="text-sm text-gray-500">{{ proposal.clientCompany || 'Independent Client' }}</p>
            </div>
          </div>
          <div class="mt-4 space-y-2 text-sm">
            <div class="flex items-center text-gray-600">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {{ proposal.clientEmail || 'No email provided' }}
            </div>
            <div class="flex items-center text-gray-600">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {{ proposal.clientPhone || 'No phone provided' }}
            </div>
          </div>
        </div>

        <!-- Project Timeline -->
        <div class="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Project Timeline</h2>
          <div class="space-y-4">
            <div class="flex items-start">
              <div class="flex-shrink-0 h-10 w-10 rounded-full bg-brand-teal/10 flex items-center justify-center">
                <svg class="h-5 w-5 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="font-medium text-gray-900">Proposed Start Date</h3>
                <p class="text-sm text-gray-600">{{ formatDate(proposal.timeline.startDate) }}</p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="flex-shrink-0 h-10 w-10 rounded-full bg-brand-teal/10 flex items-center justify-center">
                <svg class="h-5 w-5 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="font-medium text-gray-900">Estimated Duration</h3>
                <p class="text-sm text-gray-600">{{ proposal.timeline.duration }} weeks</p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="flex-shrink-0 h-10 w-10 rounded-full bg-brand-teal/10 flex items-center justify-center">
                <svg class="h-5 w-5 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="font-medium text-gray-900">Milestones</h3>
                <ul class="mt-1 space-y-1 text-sm text-gray-600">
                  <li v-for="(milestone, index) in proposal.timeline.milestones" :key="index" class="flex items-start">
                    <span class="mr-2">•</span>
                    <span>{{ milestone }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Proposal Details -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Proposal Details</h2>
        <div class="prose max-w-none text-gray-600">
          <p class="whitespace-pre-line">{{ proposal.description }}</p>
        </div>

        <!-- Attachments -->
        <div v-if="proposal.attachments && proposal.attachments.length > 0" class="mt-6">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Attachments</h3>
          <ul class="space-y-2">
            <li v-for="(file, index) in proposal.attachments" :key="index" class="flex items-center">
              <svg class="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <a :href="file.url" target="_blank" class="text-sm text-brand-teal hover:underline">
                {{ file.name }}
              </a>
              <span class="text-xs text-gray-500 ml-2">({{ formatFileSize(file.size) }})</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
        <button 
          v-if="proposal.status === 'pending'"
          @click="updateProposalStatus('rejected')"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Reject Proposal
        </button>
        <button 
          v-if="proposal.status === 'pending'"
          @click="updateProposalStatus('accepted')"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-teal hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Accept Proposal
        </button>
        <button 
          v-else-if="proposal.status === 'accepted'"
          @click="startProject"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Start Project
        </button>
        <button 
          @click="$router.back()"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Back to Proposals
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { applicationsService } from '@/services/applicationsService'
import { jobsService } from '@/services/jobsService'

const route = useRoute()

const loading = ref(true)
const error = ref('')
const proposal = ref<any>({})

// Format status for display
const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'pending': 'Pending Review',
    'accepted': 'Accepted',
    'rejected': 'Rejected',
    'submitted': 'Submitted'
  }
  return statusMap[status] || status
}

// Format date for display
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Format file size for display
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Update proposal status
const updateProposalStatus = async (status: string) => {
  const id = String(proposal.value?.id || '')
  const jobId = String(proposal.value?.jobId || '')
  if (!id || !jobId) return
  loading.value = true
  error.value = ''
  try {
    if (status === 'accepted') {
      const resp = await applicationsService.approveAgentApplication(jobId, { id })
      if (!resp.success) error.value = resp.error || 'Failed to accept proposal'
    } else if (status === 'rejected') {
      const resp = await applicationsService.rejectAgentApplication(jobId, { application_id: id, rejection_reason: 'Not a fit' })
      if (!resp.success) error.value = resp.error || 'Failed to reject proposal'
    }
    proposal.value.status = status
  } catch (err: any) {
    error.value = err?.message || 'Failed to update proposal status'
  } finally {
    loading.value = false
  }
}

// Start project
const startProject = () => {
  // In a real app, this would create a new project from the proposal
  alert('Starting project from this proposal...')
  // router.push(`/projects/${newProjectId}`)
}

// Load proposal data
const loadProposal = async () => {
  loading.value = true
  error.value = ''
  try {
    const id = String((route.params as any)?.id || '')
    const jobIdQuery = String((route.query as any)?.jobId || '')
    if (!id) {
      error.value = 'No proposal ID provided'
      loading.value = false
      return
    }
    const resp = await applicationsService.getAgentApplicationById(id)
    if (!resp.success || !resp.data) {
      error.value = resp.error || 'Failed to load proposal details'
      loading.value = false
      return
    }
    const app = resp.data
    let jobTitle = 'Untitled Job'
    let budget = 0
    let startDate = ''
    const jobId = jobIdQuery || String(app.job_id || '')
    if (jobId) {
      const jobResp = await jobsService.getJobById(jobId)
      if (jobResp.success && jobResp.data) {
        const job = jobResp.data as any
        jobTitle = String(job?.title || job?.job_title || jobTitle)
        budget = Number(job?.budget ?? 0)
        if (job?.timeline && job?.timeline?.start_date) {
          startDate = new Date(Number(job.timeline.start_date) * 1000).toISOString()
        }
      }
    }
    proposal.value = {
      id: app.id,
      jobId,
      projectName: jobTitle,
      status: String(app.proposal_status || 'pending'),
      budget,
      submittedDate: new Date(Number(app.date_created || 0) * 1000).toISOString(),
      description: app.proposal,
      clientName: 'Client',
      clientCompany: '',
      clientEmail: '',
      clientPhone: '',
      clientAvatar: '',
      timeline: {
        startDate: startDate || proposal.value?.submittedDate || '',
        duration: 0,
        milestones: []
      },
      attachments: []
    }
  } catch (err: any) {
    error.value = err?.message || 'Failed to load proposal details. Please try again.'
  } finally {
    loading.value = false
  }
}

// Load proposal when component mounts
onMounted(() => {
  loadProposal()
})
</script>

<style scoped>
.prose {
  max-width: 100%;
  line-height: 1.6;
  color: #4B5563;
}

.prose p {
  margin-top: 0.75em;
  margin-bottom: 0.75em;
}

.whitespace-pre-line {
  white-space: pre-line;
}
</style>

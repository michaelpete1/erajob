<template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 overflow-auto pb-10">
    <div class="max-w-md mx-auto">
      <!-- Header -->
      <header class="flex items-center gap-3 py-4 px-2">
        <button @click="router.back()" class="p-2 rounded-xl bg-white/10 text-white shadow-md hover:bg-white/20 transition duration-150">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div class="flex-1 text-center">
          <div class="inline-flex items-center bg-white/95 rounded-full px-5 py-2 shadow-lg">
            <span class="text-base font-bold text-brand-teal">Project Details</span>
          </div>
        </div>
        <div class="w-8"></div>
      </header>

      <main class="bg-white/95 rounded-3xl p-5 shadow-2xl mx-3">
        <!-- Loading/Error State -->
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-teal mx-auto"></div>
          <p class="text-gray-600 mt-3">Loading project details...</p>
        </div>
        <div v-else-if="error" class="text-center py-8 text-red-600 font-semibold">{{ error }}</div>

        <div v-if="gig && !loading">
          <div class="mb-3">
            <h1 class="text-2xl font-extrabold text-brand-teal">{{ gig.title || 'Posted Project' }}</h1>
          </div>
          
          <!-- Budget and Tag -->
          <div class="mb-5 flex items-center justify-start gap-3">
            <div class="px-3 py-1 rounded-full bg-gray-100 text-sm font-semibold text-gray-700 border border-gray-200 shadow-sm">{{ gig.category }}</div>
            <div class="px-4 py-1 rounded-full bg-brand-teal text-white text-sm font-bold shadow-md">
              Budget: {{ formattedBudget }}
            </div>
          </div>

          <!-- Description and Requirements -->
          <section class="text-gray-800 mb-6">
            <h3 class="font-bold text-lg text-gray-800 mb-2 border-b pb-1 border-gray-100">Project Overview</h3>
            <p class="mb-4 text-gray-700 leading-relaxed" v-html="gig.description || defaultDescription"></p>

            <h4 class="font-semibold text-brand-teal mb-2 mt-4">Key Requirements</h4>
            <ul class="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li v-for="(line, idx) in gigBullets" :key="idx" class="pl-1">{{ line }}</li>
            </ul>
          </section>

          <!-- Client Details -->
          <section class="bg-teal-50 rounded-2xl p-4 border border-teal-100 mt-6 shadow-inner">
            <h3 class="font-bold text-lg text-brand-teal mb-3">About the Client</h3>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div class="text-sm text-gray-700">
                <div class="mb-2"><strong>⭐ Reviews:</strong> <span class="font-medium text-amber-500">4.8</span> (Top-rated)</div>
                <div class="mb-2">📍 **Location:** {{ gig.client || 'Sydney, Australia' }}</div>
                <div class="text-xs text-gray-500">🗓️ Member since: {{ gig.memberSince || '03 September 2025' }}</div>
              </div>
              
              <div class="text-sm text-gray-700 sm:text-right">
                <div class="font-semibold mb-2">Engagement Metrics</div>
                <div class="flex flex-col gap-2">
                  <span class="inline-flex items-center gap-2 text-xs font-medium text-green-700">
                    <span class="h-2 w-2 rounded-full bg-green-500 inline-block shrink-0"></span> Contacted less than 5 freelancers
                  </span>
                  <span class="inline-flex items-center gap-2 text-xs font-medium text-green-700">
                    <span class="h-2 w-2 rounded-full bg-green-500 inline-block shrink-0"></span> Invited 0 freelancers
                  </span>
                  <span class="inline-flex items-center gap-2 text-xs font-medium text-green-700">
                    <span class="h-2 w-2 rounded-full bg-green-500 inline-block shrink-0"></span> Completed 10+ Projects
                  </span>
                </div>
              </div>
            </div>
          </section>

          <!-- Proposal Section -->
          <section class="mt-6">
            <h4 class="font-bold text-lg text-brand-teal mb-3">Make a proposition</h4>
            
            <!-- Custom Alert Message -->
            <div v-if="alertMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-3" role="alert">
              <p class="font-bold">Error</p>
              <p class="text-sm">{{ alertMessage }}</p>
            </div>

            <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg mb-3" role="status">
              <p class="font-bold">Success</p>
              <p class="text-sm">{{ successMessage }}</p>
            </div>

            <div class="relative">
              <textarea
                v-model="proposal"
                rows="6"
                class="w-full p-4 rounded-xl border-2 border-gray-200 placeholder-gray-400 focus:ring-brand-teal focus:border-brand-teal transition duration-150 shadow-inner"
                placeholder="Tell us why you would like this job, and any additional details or even a counter proposal."
                :disabled="submitting"
              ></textarea>
              <div class="flex justify-end p-2">
                <button
                  @click="sendProposal"
                  :disabled="submitting"
                  class="inline-flex items-center justify-center rounded-full bg-brand-teal px-8 py-3 text-white font-bold hover:bg-teal-800 transition duration-150 shadow-lg transform hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <svg v-if="submitting" class="-ml-1 mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ submitting ? 'Sending...' : 'Submit Proposal' }}
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
    
    <!-- Agent Bottom Navigation -->
    <AgentBottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AgentBottomNav from '../../components/AgentBottomNavUpdated.vue'
import { useJobs } from '@/composables/useJobs'
import type { Job as ApiJob } from '@/types/api'
import type { JobsOut } from '@/types/api/openapi'
import { applicationsService } from '@/services/applicationsService'

interface GigDetail {
  id: string
  title: string
  description: string
  category: string
  budget: number
  requirements: string[]
  skillsNeeded: string
  client: string
  memberSince: string
}

const router = useRouter()
const route = useRoute()
const { jobs, getAvailableJobs } = useJobs()

type RawJob = Partial<JobsOut> & Partial<ApiJob> & Record<string, any>

const gig = ref<GigDetail | null>(null)
const proposal = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const alertMessage = ref<string | null>(null)
const submitting = ref(false)
const successMessage = ref<string | null>(null)

const defaultDescription = `We're looking for a skilled professional to complete this project. The full brief will be shared with successful applicants.`
const gigBullets = ref<string[]>([])

const extractIdFromSlug = (slug: string): string => {
  const parts = slug.split('-')
  return parts.pop() || ''
}

const formattedBudget = computed(() => {
  if (!gig.value?.budget || gig.value.budget <= 0) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(gig.value.budget)
})

const formattedRequirements = computed(() => {
  if (!gig.value?.requirements || gig.value.requirements.length === 0) {
    return [
      'Simplifying navigation and reducing clutter to make key features easier to find.',
      'Improving the overall layout and design for a consistent and professional look.',
      'Creating reusable interactions and transitions for a more engaging user experience.'
    ]
  }

  if (
    gig.value.requirements.length === 1 &&
    typeof gig.value.requirements[0] === 'string' &&
    gig.value.requirements[0].includes('\n')
  ) {
    return gig.value.requirements[0]
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
  }

  return gig.value.requirements
})

const mapJobToGig = (job: RawJob): GigDetail => {
  const requirementSource =
    job.requirement ??
    job.requirements ??
    job.requirement_description ??
    job.requirement_details ??
    job.description ??
    ''

  const requirements = Array.isArray(requirementSource)
    ? requirementSource
    : typeof requirementSource === 'string' && requirementSource.includes('\n')
      ? requirementSource
          .split('\n')
          .map(line => line.trim())
          .filter(Boolean)
      : requirementSource
        ? [String(requirementSource)]
        : []

  const skillsField = job.skills_needed ?? job.skillsNeeded ?? job.skills
  const skills = Array.isArray(skillsField)
    ? skillsField
        .map(skill => {
          if (typeof skill === 'string') return skill
          if (skill && typeof skill === 'object') {
            const name = (skill as Record<string, any>).name
            return typeof name === 'string' ? name : ''
          }
          return ''
        })
        .filter(Boolean)
        .join(', ')
    : typeof skillsField === 'string'
      ? skillsField
      : ''

  const numericBudget = typeof job.budget === 'number'
    ? job.budget
    : typeof job.budget === 'string'
      ? Number.parseFloat(job.budget)
      : 0

  const clientName =
    typeof job.company_name === 'string'
      ? job.company_name
      : typeof job.client_name === 'string'
        ? job.client_name
        : typeof job.client === 'string'
          ? job.client
          : typeof job.clientId === 'string'
            ? job.clientId
            : 'Not specified'

  const createdTimestamp =
    typeof job.date_created === 'number'
      ? job.date_created * 1000
      : typeof job.created_at === 'string'
        ? Date.parse(job.created_at)
        : null

  return {
    id: job.id ? String(job.id) : '',
    title: typeof job.project_title === 'string'
      ? job.project_title
      : typeof job.title === 'string'
        ? job.title
        : 'Untitled Project',
    description: job.description ?? defaultDescription,
    category: typeof job.category === 'string' ? job.category : 'Other',
    budget: Number.isFinite(numericBudget) ? numericBudget : 0,
    requirements,
    skillsNeeded: skills,
    client: clientName,
    memberSince: createdTimestamp
      ? new Date(createdTimestamp).toLocaleDateString()
      : '03 September 2025'
  }
}

const getStoredJob = (id: string): RawJob | null => {
  const match = jobs.value.find(job => String(job.id ?? '') === id)
  if (match) {
    return match as unknown as RawJob
  }

  const stored = localStorage.getItem('selectedGig')
  if (!stored) return null

  try {
    const parsed = JSON.parse(stored)
    return String(parsed?.id ?? '') === id ? parsed as RawJob : null
  } catch {
    return null
  }
}

const loadGigDetails = async (slug: string) => {
  const id = extractIdFromSlug(slug)
  if (!id) {
    error.value = 'Invalid gig ID in URL.'
    return
  }

  loading.value = true
  error.value = null

  try {
    let rawJob = getStoredJob(id)

    if (!rawJob) {
      const response = await getAvailableJobs({ start: 0, stop: 20 })
      if (!response.success) {
        error.value = response.error || 'Unable to load job details.'
      }
      rawJob = getStoredJob(id)
    }

    if (!rawJob) {
      error.value = 'Job details are not available right now.'
      gig.value = null
      return
    }

    gig.value = mapJobToGig(rawJob)
    gigBullets.value = formattedRequirements.value
  } catch (err: any) {
    error.value = err?.message || 'Failed to load gig details.'
    gig.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const slug = route.params.slug as string
  if (!slug) {
    error.value = 'No gig ID provided in the URL.'
    return
  }

  loadGigDetails(slug)
})

const sendProposal = async () => {
  alertMessage.value = null
  successMessage.value = null

  if (!gig.value?.id) {
    alertMessage.value = 'Job information is missing. Please go back and try again.'
    return
  }

  if (!proposal.value.trim()) {
    alertMessage.value = 'Please enter a proposition before sending.'
    return
  }

  submitting.value = true
  try {
    const payload = {
      job_id: gig.value.id,
      proposal: proposal.value.trim()
    }

    const response = await applicationsService.applyForJob(payload)
    if (response.success) {
      const rawMessage = typeof response.data === 'string' ? response.data : ''
      const isJsonString = rawMessage.trim().startsWith('{') && rawMessage.trim().endsWith('}')
      const displayMessage = rawMessage && !isJsonString
        ? rawMessage
        : 'Proposal submitted successfully.'

      successMessage.value = displayMessage
      proposal.value = ''
    } else {
      alertMessage.value = response.error || 'Failed to submit proposal. Please try again.'
    }
  } catch (err: any) {
    alertMessage.value = err?.message || 'Failed to submit proposal. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* Scoped styles */
.bg-brand-teal { background-color: #0fb9a5 }
.text-brand-teal { color: #0fb9a5 }
.focus\:ring-brand-teal:focus {
    --tw-ring-color: #0fb9a5;
}
.focus\:border-brand-teal:focus {
    border-color: #0fb9a5;
}
</style>

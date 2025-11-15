<template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 flex items-center justify-center p-4 overflow-hidden">
    <div class="absolute top-0 right-0 h-32 w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-24 w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />

    <div class="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-40 right-32 w-1 h-1 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-32 left-40 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-20 right-20 w-2.5 h-2.5 bg-white/15 rounded-full animate-float-delayed-4" />

    <div class="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden animate-fade-up">

      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <div class="flex items-center gap-2">
          <router-link to="/client/gigs-listing" class="text-lg text-brand-teal hover:text-teal-600 transition-colors">←</router-link>
        </div>
        <span class="font-medium text-brand-teal">Job Application</span>
        <button class="text-xl text-brand-teal">☰</button>
      </div>

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

      <!-- Job Content (only show when loaded) -->
      <div v-if="job && !loading && !error">
        <div class="p-4 bg-gradient-to-r from-brand-teal/10 to-teal-600/10">
          <p class="font-semibold text-brand-teal">Budget: <span class="text-gray-700">${{ (Number(job.budget) * 1.17).toFixed(2) }}</span></p>
        </div>

        <div class="px-4 py-3">
          <h2 class="font-bold text-lg mb-2 text-brand-teal">{{ job.title }}</h2>
          <p class="text-gray-700 text-sm mb-3 whitespace-pre-line">
            {{ job.description }}
          </p>

          <ul class="space-y-2 mb-4">
            <li v-for="(item, i) in job.details" :key="i" class="flex items-start space-x-2 text-sm text-gray-700">
              <span class="text-brand-teal mt-1">•</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>

        <div class="bg-gradient-to-r from-brand-teal to-teal-600 text-white p-4 mx-4 mb-4 rounded-xl shadow-lg">
          <h3 class="font-semibold mb-2 text-lg">About the Client</h3>
          <div class="flex items-center space-x-2 mb-2">
            <span>{{ job.client.reviews }}</span>
            <span class="text-yellow-300">★★★★★</span>
          </div>
          <p class="text-sm mt-1 flex items-center space-x-2">
            <span>📍</span>
            <span>{{ job.client.location }}</span>
          </p>
          <p class="text-sm flex items-center space-x-2">
            <span>📅</span>
            <span>Member since {{ job.client.memberSince }}</span>
          </p>
        </div>

        <div class="px-4 mb-4">
          <h3 class="font-semibold mb-3 text-brand-teal">Client Engagement</h3>
          <ul class="text-sm space-y-2">
            <li v-for="(item, i) in job.engagement" :key="i" class="flex items-center space-x-2 text-gray-700">
              <span class="text-green-500 font-bold">✓</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>

        <!-- Proposition Form -->
        <div class="px-4 pb-6">
          <h3 class="bg-gradient-to-r from-brand-teal to-teal-600 text-white px-4 py-3 rounded-t-xl font-semibold">Make a proposition</h3>
          <div class="border border-gray-200 rounded-b-xl p-4 bg-white">
            <textarea
              v-model="proposalText"
              class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent resize-none"
              rows="4"
              placeholder="Write your proposal here..."
              :disabled="submitting">
            </textarea>
            <div class="flex items-center mt-3 space-x-2">
              <input
                type="checkbox"
                v-model="sendCopy"
                class="w-4 h-4 text-brand-teal border-gray-300 rounded focus:ring-brand-teal"
                :disabled="submitting">
              <label class="text-sm text-gray-600">Send me a copy</label>
            </div>
            <button
              @click="submitApplication"
              :disabled="!isFormValid || submitting"
              class="w-full mt-4 py-3 bg-gradient-to-r from-brand-teal to-teal-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
              <span v-if="submitting" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
              <span v-else>Send Proposal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { jobsService } from '../../services/jobsService'
import { applicationsService } from '../../services/applicationsService'

const route = useRoute()
const router = useRouter()

// Reactive data
const job = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const proposalText = ref('')
const sendCopy = ref(false)
const submitting = ref(false)

// Job application interface
interface JobApplication {
  jobId: string
  proposal: string
  sendCopy: boolean
}

// Load job data on mount
onMounted(async () => {
  loading.value = true
  error.value = null

  try {
    const jobId = route.params.id as string

    if (jobId) {
      const result = await jobsService.getJobById(jobId)

      if (result.success && result.data) {
        // Transform API response to expected format
        job.value = {
          id: result.data.id || jobId,
          title: result.data.title || 'Job Title',
          description: result.data.description || 'No description available',
          budget: result.data.budget || 0,
          client: {
            reviews: '4.8',
            location: 'Remote',
            memberSince: '2023'
          },
          details: [result.data.description?.split('\n')[0] || 'Requirements not specified'],
          engagement: ['Clear communication', 'Timely payments', 'Professional approach']
        }
        console.log('Loaded job for application:', job.value)
      } else {
        error.value = 'Failed to load job details'
        console.error('Failed to load job:', result.error)
      }
    } else {
      error.value = 'No job ID provided'
    }
  } catch (caughtError) {
    console.error('Error loading job:', caughtError)
    error.value = 'Failed to load job details'
  } finally {
    loading.value = false
  }
})

// Submit job application
const submitApplication = async () => {
  if (!job.value || !proposalText.value.trim()) {
    return
  }

  submitting.value = true
  error.value = null

  try {
    const applicationData = {
      jobId: job.value.id,
      proposal: proposalText.value.trim(),
      sendCopy: sendCopy.value
    }

    const resp = await applicationsService.applyForJob({
      job_id: applicationData.jobId,
      proposal: applicationData.proposal
    })

    if (resp.success) {
      console.log('Job application submitted successfully:', resp.data)
      // Navigate to success page or back to job listing
      router.push('/client/gigs-listing')
    } else {
      error.value = resp.error || 'Failed to submit application'
    }
  } catch (caughtError) {
    console.error('Error submitting application:', caughtError)
    error.value = 'Failed to submit application. Please try again.'
  } finally {
    submitting.value = false
  }
}

// Computed properties
const isFormValid = computed(() => {
  return job.value && proposalText.value.trim().length > 0
})
</script>

<style scoped>
/* No custom styles needed - using Tailwind classes */
</style>

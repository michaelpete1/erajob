<script setup lang="ts">
import { ref, onMounted } from 'vue'
// FIX 2: Import useRoute to access the current route object
import { useRouter, useRoute } from 'vue-router' 
// Assuming a real service would be imported here. We import AxiosResponse for typing the mock.
import type { AxiosResponse } from 'axios'; 
// import jobsService from '../../services/jobsService' // Commented out to prevent errors if the file is missing/incorrect

// FIX 1: Define the missing Job type locally to prevent "no exported member 'Job'" error
interface Job {
  id: string;
  title: string;
  description: string;
  client: string;
  price: string;
  deadline: string | null;
  progress: number;
}

// FIX 4 Helper: Define the API response wrapper type inferred from the error
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
}

// MOCK: Replace with your actual imported service and endpoint if available
const jobsService = {
  getJobById: async (jobId: string): Promise<AxiosResponse<ApiResponse<Job>>> => {
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.warn(`MOCK: Fulfilling jobsService.getJobById for ID: ${jobId}`);

    // Mock successful response data structure
    const mockData: ApiResponse<Job> = {
      success: true,
      data: {
        id: jobId,
        title: `Design Project: ${jobId}`,
        description: 'Create a responsive landing page for a new e-commerce startup. Deliverables include wireframes, mockups, and final HTML/CSS/JS.',
        client: 'Tech Innovations Inc.',
        price: '500',
        deadline: '2025-12-31',
        progress: 75,
      }
    };

    // Return an object shaped like an AxiosResponse for type safety
    return {
      data: mockData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    } as AxiosResponse<ApiResponse<Job>>;
  }
}

/**
 * FIX 3: Define the missing utility function to extract the ID from a slug.
 * Assumes the ID is the last segment after the last hyphen.
 * e.g., 'awesome-job-123' -> '123'
 */
const extractIdFromSlug = (slug: string): string => {
  if (!slug) return '';
  const parts = slug.split('-');
  return parts[parts.length - 1] || '';
}

const router = useRouter()
const route = useRoute() // FIX 2: Use the useRoute hook
const job = ref<Job | null>(null)
const progress = ref<number>(0)
const loading = ref(false)
const error = ref<string | null>(null)

// Try to load from API first, then fall back to localStorage
onMounted(async () => {
  loading.value = true
  error.value = null

  try {
    // Extract job ID from route slug
    const slug = route.params.slug as string
    const jobId = extractIdFromSlug(slug)

    if (jobId) {
      // Try to load from API first
      const result = await jobsService.getJobById(jobId)

      // FIX 4: Access 'success' and 'data' from the inner result.data object
      if (result.data.success && result.data.data) {
        job.value = result.data.data // Assign the inner 'data'
        progress.value = job.value?.progress ?? 30
        console.log('Loaded job from API:', job.value)
        return
      }
    }

    // Fallback to localStorage if API fails or no jobId
    try {
      const stored = localStorage.getItem('selectedGig')
      if (stored) {
        job.value = JSON.parse(stored)
        progress.value = job.value?.progress ?? 30
        console.log('Loaded job from localStorage')
      }
    } catch (e) {
      // ignore localStorage errors
      console.warn('Error reading localStorage fallback:', e)
    }

    // Final fallback: show minimal placeholder
    if (!job.value) {
      job.value = {
        id: jobId || 'unknown',
        title: `Job #${jobId || 'Unknown'}`,
        description: 'Details about this job are not available offline. Open the project to view full details.',
        client: 'Unknown Client',
        price: '—',
        deadline: null,
        progress: 10,
      }
      progress.value = job.value.progress
    }
  } catch (caughtError) {
    console.error('Error loading job:', caughtError)
    // Type-safe error handling
    if (caughtError instanceof Error) {
      error.value = `Failed to load job details: ${caughtError.message}`
    } else {
      error.value = 'Failed to load job details'
    }

    // Fallback to localStorage on API error
    try {
      const stored = localStorage.getItem('selectedGig')
      if (stored) {
        job.value = JSON.parse(stored)
        progress.value = job.value?.progress ?? 30
      }
    } catch (e) {
      // ignore localStorage errors
      console.warn('Error reading localStorage after API failure:', e)
    }
  } finally {
    loading.value = false
  }
})

const openMessages = () => {
  if (job.value?.id) {
    // Navigating to a mock 'messages' route since the 'proposals' route was complex
    router.push(`/agent/messages?jobId=${job.value.id}`)
  } else {
    router.push('/agent/messages')
  }
}

const markComplete = () => {
  // For now just navigate back to gigs listing after marking complete
  // In a real app this would call an API and update job state
  router.push('/agent/gigs-listing')
}

const sendUpdate = () => {
  // placeholder behavior
  // Replaced alert() with console.log()
  console.log('Update sent to client (stub)')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20 sm:pb-24 overflow-x-hidden">
    <div class="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6 mb-4 sm:mb-6">
        <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button @click="$router.back()" class="p-1.5 sm:p-2 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div class="min-w-0 flex-1">
            <h1 class="text-base sm:text-lg font-semibold text-gray-900 break-words">Job Overview</h1>
            <p class="text-xs sm:text-sm text-gray-500 break-words">A concise summary of the project and current status</p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto flex-shrink-0">
          <button @click="openMessages" class="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-white rounded-md shadow-sm hover:shadow-md text-xs sm:text-sm font-medium transition-shadow min-h-[44px] touch-manipulation">
            <span class="break-words">View Proposals</span>
          </button>
          <button @click="sendUpdate" class="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-white rounded-md shadow-sm hover:shadow-md text-xs sm:text-sm font-medium transition-shadow min-h-[44px] touch-manipulation">
            <span class="break-words">Send Update</span>
          </button>
        </div>
      </div>

      <section class="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 md:p-5 mb-4 sm:mb-6">
        <div class="flex flex-col gap-4 sm:gap-6">
          <div class="min-w-0">
            <h2 class="text-lg sm:text-xl font-semibold text-gray-900 leading-tight break-words">{{ job?.title ?? '—' }}</h2>
            <p class="mt-1 text-xs sm:text-sm text-gray-600 leading-relaxed break-words">{{ job?.description }}</p>
            <div class="mt-3 space-y-2 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
              <div class="text-xs sm:text-sm text-gray-600">
                Client: <span class="font-medium text-gray-800 block break-words">{{ job?.client }}</span>
              </div>
              <div class="text-xs sm:text-sm text-gray-600">
                Rate: <span class="font-medium text-gray-800 block break-words">{{ job?.price ? '$' + job.price : '—' }}</span>
              </div>
              <div v-if="job?.deadline" class="text-xs sm:text-sm text-gray-600">
                Deadline: <span class="font-medium text-gray-800 block break-words">{{ job.deadline }}</span>
              </div>
            </div>
          </div>
          <div class="w-full sm:w-auto text-center">
            <div class="text-xs text-gray-500">Progress</div>
            <div class="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold text-gray-900 whitespace-nowrap">{{ progress }}%</div>
          </div>
        </div>

        <div class="mt-4">
          <div class="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div :style="{ width: progress + '%' }" class="h-2 bg-teal-600 transition-all duration-300"></div>
          </div>
          <div class="mt-2 text-xs text-gray-500 break-words">This progress value is for display; in a production app it would reflect real milestone data.</div>
        </div>
      </section>

      <section class="space-y-4 sm:space-y-6">
        <!-- Main Content Area -->
        <div class="space-y-4 sm:space-y-6">
          <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5">
            <h3 class="text-sm font-semibold text-gray-800 mb-2 sm:mb-3 break-words">About this project</h3>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed break-words">{{ job?.description }}</p>
          </div>

          <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5">
            <h3 class="text-sm font-semibold text-gray-800 mb-2 sm:mb-3 break-words">Recent activity</h3>
            <ul class="text-xs sm:text-sm text-gray-600 space-y-2 sm:space-y-3">
              <li class="flex items-start gap-2 min-w-0">
                <span class="text-gray-500 flex-shrink-0">•</span>
                <span class="break-words">Proposal submitted by you — <span class="text-gray-500 whitespace-nowrap">3 days ago</span></span>
              </li>
              <li class="flex items-start gap-2 min-w-0">
                <span class="text-gray-500 flex-shrink-0">•</span>
                <span class="break-words">Client requested clarification — <span class="text-gray-500 whitespace-nowrap">2 days ago</span></span>
              </li>
              <li class="flex items-start gap-2 min-w-0">
                <span class="text-gray-500 flex-shrink-0">•</span>
                <span class="break-words">Proposal approved — <span class="text-gray-500 whitespace-nowrap">1 day ago</span></span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Sidebar Actions -->
        <div class="space-y-4 sm:space-y-6">
          <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5">
            <h4 class="text-sm font-semibold text-gray-800 mb-2 sm:mb-3 break-words">Client</h4>
            <div class="mt-2 text-xs sm:text-sm text-gray-600 break-words">{{ job?.client }}</div>
            <div class="mt-3 sm:mt-4">
              <button @click="openMessages" class="w-full inline-flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-md bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-medium transition-colors min-h-[44px] touch-manipulation">
                <span class="break-words">View Proposals</span>
              </button>
            </div>
          </div>

          <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5">
            <h4 class="text-sm font-semibold text-gray-800 mb-2 sm:mb-3 break-words">Actions</h4>
            <div class="mt-2 space-y-2 sm:space-y-3">
              <button @click="markComplete" class="w-full inline-flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-md bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-medium transition-colors min-h-[44px] touch-manipulation">
                <span class="break-words">Mark Complete</span>
              </button>
              <button @click="$router.push('/agent/gigs-listing')" class="w-full inline-flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-md bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs sm:text-sm font-medium transition-colors min-h-[44px] touch-manipulation">
                <span class="break-words">Back to Projects</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

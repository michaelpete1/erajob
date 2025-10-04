<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AgentBottomNav from '../../components/AgentBottomNavUpdated.vue'
import { extractIdFromSlug } from '../../utils/slugUtils'

const route = useRoute()
const router = useRouter()

const job = ref<any | null>(null)
const progress = ref<number>(0)

// Try to hydrate from localStorage first, then fall back to route param
onMounted(() => {
  try {
    const stored = localStorage.getItem('selectedGig')
    if (stored) {
      job.value = JSON.parse(stored)
      progress.value = job.value?.progress ?? 30
      return
    }
  } catch (e) {
    // ignore
  }

  // fallback: read slug from route and show a minimal placeholder if no stored job
  const slug = route.params.slug
  const id = extractIdFromSlug(slug as string)
  if (slug) {
    job.value = {
      id,
      title: `Job #${id}`,
      description: 'Details about this job are not available offline. Open the project to view full details.',
      client: 'Unknown Client',
      price: '—',
      deadline: null,
      progress: 10,
    }
    progress.value = job.value.progress
  }
})

const openMessages = () => {
  if (job.value?.id) {
    router.push(`/proposals?jobId=${job.value.id}`)
  } else {
    router.push('/proposals')
  }
}

const markComplete = () => {
  // For now just navigate back to gigs listing after marking complete
  // In a real app this would call an API and update job state
  router.push('/agent/gigs-listing')
}

const sendUpdate = () => {
  // placeholder behavior
  alert('Update sent to client (stub)')
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
    <!-- Agent Bottom Navigation -->
    <AgentBottomNav />
  </div>
</template>
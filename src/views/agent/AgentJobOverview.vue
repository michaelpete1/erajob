<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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

  // fallback: read id from route and show a minimal placeholder if no stored job
  const id = route.params.id
  if (id) {
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
  router.push('/messages')
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
  <div class="min-h-screen bg-gray-50 pb-24">
    <div class="max-w-4xl mx-auto p-4 sm:p-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <button @click="$router.back()" class="p-2 rounded-md bg-white shadow-sm hover:shadow-md">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h1 class="text-lg font-semibold text-gray-900">Job Overview</h1>
            <p class="text-sm text-gray-500">A concise summary of the project and current status</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button @click="openMessages" class="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-md shadow-sm hover:shadow-md text-sm">
            Message Client
          </button>
          <button @click="sendUpdate" class="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-md shadow-sm hover:shadow-md text-sm">
            Send Update
          </button>
        </div>
      </div>

      <section class="bg-white rounded-lg shadow-sm p-5 mb-6">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <h2 class="text-xl font-semibold text-gray-900">{{ job?.title ?? '—' }}</h2>
            <p class="mt-1 text-sm text-gray-600">{{ job?.description }}</p>
            <div class="mt-3 flex items-center gap-4 text-sm text-gray-600">
              <div>Client: <span class="font-medium text-gray-800">{{ job?.client }}</span></div>
              <div>Rate: <span class="font-medium text-gray-800">{{ job?.price ? '$' + job.price : '—' }}</span></div>
              <div v-if="job?.deadline">Deadline: <span class="font-medium text-gray-800">{{ job.deadline }}</span></div>
            </div>
          </div>
          <div class="w-40 text-right">
            <div class="text-xs text-gray-500">Progress</div>
            <div class="mt-2 text-2xl font-semibold text-gray-900">{{ progress }}%</div>
          </div>
        </div>

        <div class="mt-4">
          <div class="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div :style="{ width: progress + '%' }" class="h-2 bg-teal-600"></div>
          </div>
          <div class="mt-2 text-xs text-gray-500">This progress value is for display; in a production app it would reflect real milestone data.</div>
        </div>
      </section>

      <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2">
          <div class="bg-white rounded-lg shadow-sm p-5">
            <h3 class="text-sm font-semibold text-gray-800 mb-2">About this project</h3>
            <p class="text-gray-600 text-sm">{{ job?.description }}</p>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-5 mt-4">
            <h3 class="text-sm font-semibold text-gray-800 mb-2">Recent activity</h3>
            <ul class="text-sm text-gray-600 space-y-2">
              <li>Proposal submitted by you — <span class="text-gray-500">3 days ago</span></li>
              <li>Client requested clarification — <span class="text-gray-500">2 days ago</span></li>
              <li>Proposal approved — <span class="text-gray-500">1 day ago</span></li>
            </ul>
          </div>
        </div>

        <aside>
          <div class="bg-white rounded-lg shadow-sm p-5 mb-4">
            <h4 class="text-sm font-semibold text-gray-800">Client</h4>
            <div class="mt-2 text-sm text-gray-600">{{ job?.client }}</div>
            <div class="mt-3">
              <button @click="openMessages" class="w-full inline-flex items-center justify-center px-3 py-2 rounded-md bg-teal-600 text-white text-sm">Message</button>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-5">
            <h4 class="text-sm font-semibold text-gray-800">Actions</h4>
            <div class="mt-2 space-y-2">
              <button @click="markComplete" class="w-full inline-flex items-center justify-center px-3 py-2 rounded-md bg-green-600 text-white text-sm">Mark Complete</button>
              <button @click="$router.push('/agent/gigs-listing')" class="w-full inline-flex items-center justify-center px-3 py-2 rounded-md bg-white border text-sm">Back to Projects</button>
            </div>
          </div>
        </aside>
      </section>
    </div>

    <BottomNav />
  </div>
</template>

<script lang="ts">
// Import BottomNav lazily to match project conventions
import BottomNav from '../../components/BottomNav.vue'
export default { components: { BottomNav } }
</script>

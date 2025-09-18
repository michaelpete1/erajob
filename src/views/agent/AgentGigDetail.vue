<template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 overflow-auto pb-10">
    <div class="max-w-md mx-auto">
      <!-- Header -->
      <header class="flex items-center gap-3 py-4 px-2">
        <button @click="$router.back()" class="p-2 rounded bg-white/10 text-white">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div class="flex-1 text-center">
          <div class="inline-flex items-center bg-white/95 rounded-full px-4 py-1">
            <span class="text-sm font-semibold text-brand-teal">Details</span>
          </div>
        </div>
        <div class="w-8"></div>
      </header>

      <main class="bg-white/95 rounded-2xl p-4 shadow-lg mx-3">
        <div class="mb-2">
          <h1 class="text-lg font-bold text-brand-teal">{{ gig?.title || 'Posted Project' }}</h1>
        </div>
        <div class="mb-4 flex items-center justify-start gap-3">
          <div class="px-3 py-1 rounded bg-gray-100 text-sm font-semibold text-gray-700">Details</div>
          <div class="ml-auto px-3 py-1 rounded bg-brand-teal text-white text-sm font-semibold">Budget: ${{ gig?.price || '—' }}/hr</div>
        </div>

        <section class="text-gray-800 mb-4">
          <p class="mb-3" v-html="gig?.description || defaultDescription"></p>
          <ul class="list-disc pl-5 text-sm text-gray-700">
            <li v-for="(line, idx) in gigBullets" :key="idx">{{ line }}</li>
          </ul>
        </section>

        <section class="bg-white rounded p-3 border mt-4">
          <h3 class="font-semibold text-brand-teal mb-3">About the Client</h3>
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              <div class="mb-2"><strong>Reviews:</strong> <span class="font-medium">4.8</span></div>
              <div class="mb-2">📍 {{ gig?.client || 'Sydney, Australia' }}</div>
              <div class="text-xs text-gray-500">Member since: {{ gig?.memberSince || '03 September 2025' }}</div>
            </div>
            <div class="text-sm text-gray-700 text-right">
              <div class="mb-1">Client Engagement</div>
              <div class="flex flex-col gap-2">
                <span class="inline-flex items-center gap-2 text-sm text-green-600"><span class="h-2 w-2 rounded-full bg-green-500 inline-block"></span> Contacted less than 5 freelancers</span>
                <span class="inline-flex items-center gap-2 text-sm text-green-600"><span class="h-2 w-2 rounded-full bg-green-500 inline-block"></span> Invited 0 freelancers</span>
                <span class="inline-flex items-center gap-2 text-sm text-green-600"><span class="h-2 w-2 rounded-full bg-green-500 inline-block"></span> Completed 10+ Projects</span>
              </div>
            </div>
          </div>
        </section>

        <section class="mt-6">
          <h4 class="font-semibold text-brand-teal mb-2">Make a proposition</h4>
          <div class="relative">
            <textarea v-model="proposal" rows="6" class="w-full p-3 rounded border placeholder-gray-500" placeholder="Tell us why you would like this job, and any additional details or even a counter proposal."></textarea>
            <div class="absolute right-3 bottom-3">
              <button @click="sendProposal" class="inline-flex items-center justify-center rounded-full bg-brand-teal px-6 py-2 text-white font-semibold">Send</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const proposal = ref('')
const gig = ref<any | null>(null)

const defaultDescription = `We're looking for a skilled professional to complete this project. The full brief will be shared with successful applicants.`

const gigBullets = ref<string[]>([])

onMounted(() => {
  // try to load selected gig from localStorage first
  try {
    const stored = localStorage.getItem('selectedGig')
    if (stored) gig.value = JSON.parse(stored)
  } catch (e) {
    // ignore
  }

  const id = route.params.id
  if (!gig.value && id) {
    gig.value = { id, title: 'Posted Project', description: defaultDescription, price: '—', client: 'Sydney, Australia', memberSince: '03 September 2025' }
  }

  // create bullets for display (static for now)
  gigBullets.value = [
    'Simplifying navigation and reducing clutter to make key features easier to find.',
    'Improving the overall layout and design for a consistent and professional look.',
    'Creating reusable interactions and transitions for a more engaging user experience.'
  ]
})

const sendProposal = () => {
  // basic feedback + navigate to congrats
  alert('Proposal sent')
  proposal.value = ''
  router.push('/agent/congrats')
}
</script>

<style scoped>
.bg-brand-teal { background-color: #0fb9a5 }
.text-brand-teal { color: #0fb9a5 }
</style>

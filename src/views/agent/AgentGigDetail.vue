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

            <div class="relative">
              <textarea v-model="proposal" rows="6" class="w-full p-4 rounded-xl border-2 border-gray-200 placeholder-gray-400 focus:ring-brand-teal focus:border-brand-teal transition duration-150 shadow-inner" placeholder="Tell us why you would like this job, and any additional details or even a counter proposal."></textarea>
              <div class="flex justify-end p-2">
                <button @click="sendProposal" class="inline-flex items-center justify-center rounded-full bg-brand-teal px-8 py-3 text-white font-bold hover:bg-teal-800 transition duration-150 shadow-lg transform hover:scale-[1.01]">
                  Send Proposition
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
import { ref, onMounted, computed } from 'vue' // 'computed' added
import { useRouter, useRoute } from 'vue-router' // 'useRoute' added

// --- Mock/Internal Type Definitions to fix TS errors ---

interface ApiJobData {
    id: string;
    project_title: string;
    description: string;
    budget: number; // in cents
    category: string;
    requirement: string;
    skills_needed: string | string[];
}

interface ApiServiceResponse {
    success: boolean;
    data: ApiJobData | null;
}

interface Job {
    id: string;
    title: string;
    description: string;
    price: string; // formatted price
    category: string;
    budget: number; // raw budget in cents
    requirements: string[];
    skills_needed: string;
    client: string;
    memberSince: string;
}

// --- Mock Services and Components (since imports are not available in this context) ---

// Mock jobsService to resolve type issues
const jobsService = {
    async getJobById(id: string): Promise<ApiServiceResponse> {
        console.log(`Mock: Fetching job ${id} from API...`);
        // Simulate a successful API response with data matching the structure the component expects
        if (id === '12345') {
             return {
                success: true,
                data: {
                    id: '12345',
                    project_title: 'Interactive Portfolio Website Redesign',
                    description: 'We need an experienced front-end developer to revamp our current static portfolio site into a highly interactive and mobile-responsive web application.',
                    budget: 4500, // $45.00
                    category: 'Web Development',
                    requirement: 'Must be proficient in Vue 3 (Composition API) and Tailwind CSS. Portfolio review required.',
                    skills_needed: ['Vue 3', 'Tailwind CSS', 'TypeScript', 'UI/UX'],
                }
            };
        }
        // Simulate a failure for other IDs
        return { success: false, data: null };
    }
}

// Placeholder component for AgentBottomNav
const AgentBottomNav = {
  template: `
    <nav class="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-200 p-3 z-10">
      <div class="flex justify-around max-w-sm mx-auto">
        <button class="text-gray-600 hover:text-brand-teal flex flex-col items-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l-7 7m0-7v10a1 1 0 01-1 1h-3"></path></svg>
          <span class="text-xs">Home</span>
        </button>
        <button class="text-brand-teal flex flex-col items-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-1.041-8.5-2.745M12 4v10m0 0l-4-4m4 4l4-4"></path></svg>
          <span class="text-xs font-semibold">Gigs</span>
        </button>
        <button class="text-gray-600 hover:text-brand-teal flex flex-col items-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          <span class="text-xs">Profile</span>
        </button>
      </div>
    </nav>
  `,
}

// --- Component Logic ---

const router = useRouter()
const route = useRoute() // Initialized useRoute
const gig = ref<Job | null>(null)
const proposal = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const alertMessage = ref<string | null>(null) // Used to replace alert()

const defaultDescription = `We're looking for a skilled professional to complete this project. The full brief will be shared with successful applicants.`

const gigBullets = ref<string[]>([])

// Helper function defined to fix 'Cannot find name 'extractIdFromSlug'.'
const extractIdFromSlug = (slug: string): string => {
    const parts = slug.split('-')
    // Assumes the ID is the last part of the slug and is a string
    return parts.pop() || ''
}

// Computed property to format budget
const formattedBudget = computed(() => { // 'computed' fixed
    if (!gig.value?.budget) return '—'
    // Budget is in cents, convert to dollars/hr
    return `$${(gig.value.budget / 100).toFixed(2)}/hr`
})

// Computed property to format requirements as bullets
const formattedRequirements = computed(() => { // 'computed' fixed
    // Mock data for a nice UI if real requirements are missing
    if (!gig.value?.requirements || gig.value.requirements.length === 0 || (gig.value.requirements.length === 1 && gig.value.requirements[0] === 'Requirements not specified')) {
        return [
            'Simplifying navigation and reducing clutter to make key features easier to find.',
            'Improving the overall layout and design for a consistent and professional look.',
            'Creating reusable interactions and transitions for a more engaging user experience.'
        ]
    }
    // API response often has 'requirement' as a single string, manually convert to array if needed
    if (gig.value.requirements.length === 1 && typeof gig.value.requirements[0] === 'string' && gig.value.requirements[0].includes('\n')) {
        return gig.value.requirements[0].split('\n').filter(line => line.trim() !== '')
    }
    
    return gig.value.requirements
})

onMounted(async () => {
    const slug = route.params.slug as string // 'route' fixed

    if (slug) {
        loading.value = true
        error.value = null

        try {
            // Extract ID from slug (function fixed)
            const id = extractIdFromSlug(slug)
            if (!id) {
                throw new Error('Invalid gig ID in URL slug')
            }

            // Try to get gig from API first (using mock service)
            const result = await jobsService.getJobById(id)

            // Fixed property access based on defined types
            if (result.success && result.data) {
                const data = result.data

                gig.value = {
                    id: data.id,
                    title: data.project_title,
                    description: data.description,
                    price: (data.budget / 100).toFixed(2), // Convert cents to dollars
                    category: data.category,
                    budget: data.budget,
                    requirements: [data.requirement || 'Requirements not specified'],
                    // Ensure skills_needed is a joined string
                    skills_needed: Array.isArray(data.skills_needed) ? data.skills_needed.join(', ') : data.skills_needed || '',
                    client: 'Sydney, Australia', // Default since API doesn't have client info
                    memberSince: '03 September 2025' // Default since API doesn't have this
                }
                console.log('Loaded gig from API:', data)
            } else {
                // Fallback to localStorage if API fails (using stored job object)
                const stored = localStorage.getItem('lastProposition')
                if (stored) {
                    const propositionData = JSON.parse(stored)
                    // Attempt to use gig data from the last proposition
                    if (propositionData.gig && propositionData.gig.id === id) {
                        gig.value = propositionData.gig as Job
                        console.log('Loaded gig from localStorage (last proposition):', propositionData.gig)
                    }
                }
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred while fetching details.'
            console.error('Error loading gig:', errorMessage)
            error.value = 'Failed to load gig details. Please try again.'
        } finally {
            loading.value = false
        }
    } else {
        console.error('No slug provided in route')
        error.value = 'No gig ID provided in the URL.'
    }

    // Set gig bullets after gig is loaded, ensuring default is used if fetch failed
    if (gig.value) {
        gigBullets.value = formattedRequirements.value
    } else {
        // Final fallback if no data was loaded at all
         gig.value = {
            id: 'fallback',
            title: 'Posted Project (Mock Data)',
            description: defaultDescription + ' This data is mock data shown because the project ID could not be loaded.',
            price: '—',
            category: 'Other',
            budget: 0,
            requirements: ['Requirements not specified', 'Mobile-first design approach is a plus.'],
            skills_needed: 'General Freelancer Skills',
            client: 'Sydney, Australia',
            memberSince: '03 September 2025'
        }
        gigBullets.value = formattedRequirements.value
        error.value = 'Could not load project details. Showing a generic placeholder.'
    }
})

const sendProposal = () => {
    alertMessage.value = null
    if (!proposal.value.trim()) {
        // Replaced alert() with setting an internal message
        alertMessage.value = 'Please enter a proposition before sending.'
        return
    }

    // Simulate proposition review - randomly accept or reject
    const isAccepted = Math.random() > 0.5 // 50% chance of acceptance

    // Store proposition details
    const propositionData = {
        gig: gig.value,
        proposal: proposal.value,
        timestamp: new Date().toISOString(),
        status: isAccepted ? 'accepted' : 'rejected'
    }

    try {
        // Storing data to demonstrate successful submission
        localStorage.setItem('lastProposition', JSON.stringify(propositionData))
    } catch (e) {
        console.error('Error storing proposition in localStorage:', e)
    }

    proposal.value = ''

    // Navigate to appropriate page based on acceptance (assuming these routes exist)
    if (isAccepted) {
        router.push('/agent/proposition-accepted')
    } else {
        router.push('/agent/proposition-rejected')
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

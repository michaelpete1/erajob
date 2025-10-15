<template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 overflow-hidden">
    <div class="absolute top-0 right-0 h-24 w-24 sm:h-32 sm:w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow"></div>
    <div class="absolute bottom-0 left-0 h-20 w-20 sm:h-24 sm:w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse"></div>
    <div class="absolute top-1/2 left-1/2 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float"></div>
    
    <div class="absolute top-16 left-16 sm:top-20 sm:left-20 w-2 h-2 bg-white/20 rounded-full animate-float-delayed-1"></div>
    <div class="absolute top-32 right-24 sm:top-40 sm:right-32 w-1 h-1 bg-white/30 rounded-full animate-float-delayed-2"></div>
    <div class="absolute bottom-24 left-32 sm:bottom-32 sm:left-40 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-delayed-3"></div>
    <div class="absolute bottom-16 right-16 sm:bottom-20 sm:right-20 w-2.5 h-2.5 bg-white/15 rounded-full animate-float-delayed-4"></div>

    <div class="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-24">
      <header class="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 w-[90%] sm:w-[92%] max-w-3xl bg-brand-teal text-white rounded-xl px-3 sm:px-4 py-2 sm:py-3 z-50 shadow-md flex items-center justify-between">
        <div class="flex items-center gap-2 sm:gap-3">
          <button @click="$router.back()" aria-label="Back" class="p-1 text-white/95 hover:text-white">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-sm sm:text-base font-semibold">Projects</h1>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <button @click="openMobileNav = !openMobileNav" class="p-1 text-white/95 hover:text-white md:hidden" aria-label="Menu">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <nav class="hidden md:flex items-center gap-4">
            <router-link to="/agent/gigs-listing" class="flex items-center gap-2 text-white/90 hover:text-white" aria-label="Home">
              <BrandLogo size="sm" />
            </router-link>
            <router-link to="/agent/gigs-listing" class="flex items-center gap-2 text-white/90 hover:text-white" aria-label="Projects">
              <PencilSquareIcon class="h-5 w-5" />
              <span class="hidden lg:inline text-sm">Projects</span>
            </router-link>
            <router-link to="/messages" class="flex items-center gap-2 text-white/90 hover:text-white" aria-label="Messages">
              <MusicalNoteIcon class="h-5 w-5" />
              <span class="hidden lg:inline text-sm">Proposals</span>
            </router-link>
            <router-link to="/notifications" class="relative flex items-center gap-2 text-white/90 hover:text-white" aria-label="Notifications">
              <CheckCircleIcon class="h-5 w-5" />
              <span class="absolute -top-2 -right-3 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-brand-teal text-xs">3</span>
            </router-link>
            <router-link to="/settings" class="flex items-center gap-2 text-white/90 hover:text-white" aria-label="Settings">
              <AdjustmentsHorizontalIcon class="h-5 w-5" />
            </router-link>
          </nav>

          <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/90" />
        </div>
      </header>

      <div v-if="openMobileNav" class="fixed top-16 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white/95 text-brand-teal rounded-xl shadow-lg z-50 md:hidden">
        <div class="flex flex-col p-3">
          <div class="flex justify-center mb-3 pb-3 border-b border-gray-200">
            <router-link @click="openMobileNav = false" to="/agent/gigs-listing" class="flex items-center justify-center">
              <BrandLogo size="sm" />
            </router-link>
          </div>
          <router-link @click="openMobileNav = false" to="/agent/gigs-listing" class="py-2 px-3 rounded hover:bg-gray-100">Projects</router-link>
          <router-link @click="openMobileNav = false" to="/proposals" class="py-2 px-3 rounded hover:bg-gray-100">Proposals</router-link>
          <router-link @click="openMobileNav = false" to="/notifications" class="py-2 px-3 rounded hover:bg-gray-100">Notifications <span class="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-400 text-white text-xs">3</span></router-link>
          <router-link @click="openMobileNav = false" to="/settings" class="py-2 px-3 rounded hover:bg-gray-100">Settings</router-link>
        </div>
      </div>

      <div class="mt-2 mb-4 sm:mb-6 flex items-center justify-center">
        <div class="bg-white/95 rounded-full p-1 flex items-center gap-1 shadow-sm max-w-xs sm:max-w-none w-full sm:w-auto">
          <button 
            @click="activeTab = 'active'" 
            :class="activeTab === 'active' ? 'bg-brand-teal text-white' : 'text-gray-600'"
            class="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 min-h-[40px] touch-manipulation"
          >
            Active
          </button>
          <button 
            @click="activeTab = 'browse'" 
            :class="activeTab === 'browse' ? 'bg-brand-teal text-white' : 'text-gray-600'"
            class="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 min-h-[40px] touch-manipulation"
          >
            Browse
          </button>
        </div>
      </div>

      <div v-if="activeTab === 'browse'" class="mb-4 sm:mb-6 animate-fade-in">
        <div class="max-w-2xl mx-auto">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search for gigs..."
              class="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 pl-12 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30 backdrop-blur-sm transition-all"
            />
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button 
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p v-if="searchQuery" class="text-center text-white/80 text-sm mt-2">
            Showing results for "{{ searchQuery }}"
          </p>
        </div>
      </div>

      <div class="mt-6 sm:mt-8">
        <!-- Loading State -->
        <div v-if="jobsLoading" class="flex justify-center py-8">
          <svg class="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <!-- Error State -->
        <div v-else-if="jobsError" class="text-center py-8">
          <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 max-w-sm mx-auto">
            <span class="text-3xl sm:text-4xl mb-3 sm:mb-4 block">⚠️</span>
            <h3 class="text-lg sm:text-xl font-bold text-brand-teal mb-2">Error Loading Jobs</h3>
            <p class="text-sm sm:text-base text-gray-600">{{ jobsError }}</p>
            <button 
              @click="getAvailableJobs(paginationParams)" 
              class="mt-4 bg-brand-teal text-white px-4 py-2 rounded-full text-sm"
            >
              Try Again
            </button>
          </div>
        </div>

        <!-- Results Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-6xl mx-auto">
          
            <div 
            v-for="job in filteredGigs" 
            :key="job.id || ''"
            class="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-102 animate-fade-up-delay-1 block cursor-pointer"
            @click="goToGig(job)"
          >
            <div class="block">
              <div class="flex items-center mb-3 sm:mb-4 gap-3">
                <span class="text-2xl sm:text-3xl flex-shrink-0">
                  {{ getCategoryIcon(job.category) }}
                </span>
                <h3 class="text-lg sm:text-xl font-bold text-brand-teal break-words flex-1 min-w-0">
                  {{ job.project_title }}
                </h3>
              </div>
              <p class="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 break-words leading-relaxed">
                {{ job.description }}
              </p>
              <div class="flex items-center justify-between mb-3 sm:mb-4">
                <span class="text-xl sm:text-2xl font-bold text-brand-teal whitespace-nowrap">${{ job.budget }}</span>
                <span class="text-xs sm:text-sm text-gray-500 whitespace-nowrap">budget</span>
              </div>

              <div>
                <button @click.stop="goToGig(job)" class="w-full bg-brand-teal text-white py-2.5 sm:py-3 px-4 rounded-full hover:bg-teal-600 transition-colors duration-300 text-center block text-sm sm:text-base font-medium min-h-[44px] touch-manipulation">
                  View Details
                </button>
              </div>
            </div>
          </div>      <!-- No results message -->
      <div v-if="filteredGigs.length === 0" class="col-span-full text-center py-8 sm:py-12">
        <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 max-w-sm mx-auto">
          <span class="text-3xl sm:text-4xl mb-3 sm:mb-4 block">🔍</span>
          <h3 class="text-lg sm:text-xl font-bold text-brand-teal mb-2 break-words">No gigs found</h3>
          <p class="text-sm sm:text-base text-gray-600 break-words leading-relaxed">Try adjusting your search terms or browse all gigs in the Active tab.</p>
        </div>
      </div>
        </div>
      </div>

      <!-- Back Button -->
      <div class="text-center mt-6 sm:mt-8">
        <router-link to="/agent/explore-gigs" class="inline-flex items-center text-white hover:text-white/80 transition-colors duration-300 text-sm sm:text-base">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Explore
        </router-link>
      </div>

  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import BrandLogo from '../../components/BrandLogo.vue'
import { PencilSquareIcon, AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline'
import { CheckCircleIcon, MusicalNoteIcon } from '@heroicons/vue/24/solid'
import { createGigSlug } from '@/utils/slugUtils'
import { useJobs } from '@/composables/useJobs'

const openMobileNav = ref(false)
const activeTab = ref<'active' | 'browse'>('browse')
const searchQuery = ref('')

// Determine gig links based on flow type (navigate directly to agent summary)
const router = useRouter()


const goToLogWorkHours = (job: any) => {
  // Persist selected job so destination pages can read it
  try {
    localStorage.setItem('selectedGig', JSON.stringify(job))
  } catch (e) {
    // ignore storage errors
  }
  
  // Navigate to the job overview page
  const slug = createGigSlug(job.project_title, job.id || '')
  router.push({ path: `/agent/job/${slug}` })
}

const getCategoryIcon = (category: string | { name: string }) => {
  const categoryName = typeof category === 'string' ? category : category.name
  const iconMap: Record<string, string> = {
    'writing': '📝',
    'design': '🎨',
    'development': '💻',
    'data': '📊',
    'admin': '🎯',
    'marketing': '📱',
    'default': '💼'
  }
  
  return iconMap[categoryName.toLowerCase()] || iconMap.default
}

const goToGig = (job: any) => {
  // Persist selected job so destination pages can read it
  try {
    localStorage.setItem('selectedGig', JSON.stringify(job))
  } catch (e) {
    // ignore storage errors
  }

  if (activeTab.value === 'active') {
    // Open the log work hours page for active jobs
    router.push({ path: '/agent/logging-details' })
  } else {
    // browse -> go to detail page
    const slug = createGigSlug(job.project_title, job.id || '')
    router.push({ path: `/agent/gig/${slug}` })
  }
}

const { 
  jobs, 
  loading: jobsLoading, 
  error: jobsError,
  getAvailableJobs, 
  hasMore,
  loadMoreJobs 
} = useJobs()

// Default pagination parameters
const paginationParams = {
  start: 0,
  stop: 10
}

// Load jobs when component mounts
onMounted(async () => {
  await getAvailableJobs(paginationParams)
})

// Watch tab changes to load appropriate jobs
watch(activeTab, async () => {
  await getAvailableJobs(paginationParams)
})

const selectedServices = ref<any[]>([])

onMounted(() => {
  const stored = localStorage.getItem('selectedAgentServices')
  if (stored) {
    selectedServices.value = JSON.parse(stored)
  }
})

const filteredGigs = computed(() => {
  if (!jobs.value) return []
  
  let result = jobs.value
  
  // Filter by search query if present
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(job => 
      job.project_title.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query) ||
      (typeof job.category === 'string' ? job.category.toLowerCase().includes(query) : false)
    )
  }
  
  // Filter by selected services if any are selected
  if (selectedServices.value.length > 0) {
    const serviceTitles = selectedServices.value.map(service => service.title.toLowerCase())
    result = result.filter(job => 
      serviceTitles.some(service => 
        job.project_title.toLowerCase().includes(service) ||
        (typeof job.category === 'string' ? job.category.toLowerCase().includes(service) : false)
      )
    )
  }
  
  return result
})
</script>

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
            :key="job.key"
            class="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-102 animate-fade-up-delay-1 block cursor-pointer"
            @click="goToGig(job.raw)"
          >
            <div class="block">
              <div class="flex items-start justify-between mb-3 sm:mb-4 gap-3">
                <div class="flex items-center gap-3">
                  <span class="text-2xl sm:text-3xl flex-shrink-0">
                    {{ job.categoryIcon }}
                  </span>
                  <h3 class="text-lg sm:text-xl font-bold text-brand-teal break-words flex-1 min-w-0">
                    {{ job.title }}
                  </h3>
                </div>
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
                  :class="statusBadgeClass(job.status, activeTab === 'active')"
                >
                  {{ statusLabel(job.status, activeTab === 'active') }}
                </span>
              </div>
              <p class="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 break-words leading-relaxed">
                {{ job.snippet }}
              </p>
              <dl class="grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600 mb-3">
                <div>
                  <dt class="font-semibold text-gray-700">Budget</dt>
                  <dd class="text-brand-teal font-bold">{{ job.budget }}</dd>
                </div>
                <div>
                  <dt class="font-semibold text-gray-700">Posted</dt>
                  <dd>{{ job.created }}</dd>
                </div>
              </dl>

              <div>
                <button
                  @click.stop="goToGig(job.raw)"
                  class="w-full bg-brand-teal text-white py-2.5 sm:py-3 px-4 rounded-full hover:bg-teal-600 transition-colors duration-300 text-center block text-sm sm:text-base font-medium min-h-[44px] touch-manipulation"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>

          <div v-if="filteredGigs.length === 0" class="col-span-full text-center py-8 sm:py-12">
            <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 max-w-sm mx-auto">
              <span class="text-3xl sm:text-4xl mb-3 sm:mb-4 block">🔍</span>
              <h3 class="text-lg sm:text-xl font-bold text-brand-teal mb-2 break-words">No gigs found</h3>
              <p class="text-sm sm:text-base text-gray-600 break-words leading-relaxed">
                Try adjusting your search terms or browse all gigs in the Active tab.
              </p>
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
import { applicationsService } from '@/services/applicationsService'
import type { ApplicationOut } from '@/types/api'

const openMobileNav = ref(false)
const activeTab = ref<'active' | 'browse'>('browse')
const searchQuery = ref('')
const agentApplications = ref<ApplicationOut[]>([])
const applicationsLoading = ref(false)
const applicationsError = ref<string | null>(null)

const normalizeId = (value: unknown): string | null => {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }
  return null
}

const getJobId = (job: any): string | null => {
  return (
    normalizeId(job?.id) ||
    normalizeId(job?.job_id) ||
    normalizeId(job?.jobId) ||
    normalizeId(job?.uid)
  )
}

const isAcceptedProposalStatus = (status: ApplicationOut['proposal_status']) => {
  if (!status) return false
  if (typeof status === 'string') {
    const normalized = status.toLowerCase()
    const acceptedFlags = [
      'accepted',
      'approved',
      'accepted_by_client',
      'client_accepted',
      'client_approved',
      'selected'
    ]
    return acceptedFlags.some(flag => normalized === flag || normalized.includes(flag))
  }
  return false
}

const acceptedJobIds = computed(() => {
  const ids = new Set<string>()
  agentApplications.value.forEach(application => {
    const jobId = normalizeId(application?.job_id)
    if (jobId && isAcceptedProposalStatus(application.proposal_status)) {
      ids.add(jobId)
    }
  })
  return ids
})

const proposalJobIds = computed(() => {
  const ids = new Set<string>()
  agentApplications.value.forEach(application => {
    const jobId = normalizeId(application?.job_id)
    if (jobId) {
      ids.add(jobId)
    }
  })
  return ids
})

const loadAgentApplications = async () => {
  applicationsLoading.value = true
  applicationsError.value = null
  try {
    const response = await applicationsService.listAgentApplications()
    if (response.success) {
      const data = response.data as unknown
      if (Array.isArray(data)) {
        agentApplications.value = data as ApplicationOut[]
      } else if (data && typeof data === 'object') {
        agentApplications.value = [data as ApplicationOut]
      } else {
        agentApplications.value = []
        applicationsError.value = 'Failed to load applications.'
      }
    } else {
      agentApplications.value = []
      applicationsError.value = response.error || 'Failed to load applications.'
    }
  } catch (error: any) {
    agentApplications.value = []
    applicationsError.value = error?.message || 'Failed to load applications.'
  } finally {
    applicationsLoading.value = false
  }
}

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
  await Promise.all([getAvailableJobs(paginationParams), loadAgentApplications()])
})

// Watch tab changes to load appropriate jobs
watch(activeTab, async () => {
  await Promise.all([getAvailableJobs(paginationParams), loadAgentApplications()])
})

const selectedServices = ref<any[]>([])

onMounted(() => {
  const stored = localStorage.getItem('selectedAgentServices')
  if (stored) {
    selectedServices.value = JSON.parse(stored)
  }
})

const formatBudget = (budget?: number | null) => {
  if (!budget || Number.isNaN(budget)) return '$0'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(budget / 100)
}

const formatDate = (timestamp?: number | null) => {
  if (!timestamp) return '—'
  const ms = timestamp > 1_000_000_000_000 ? timestamp : timestamp * 1000
  const date = new Date(ms)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString()
}

interface MappedGigCard {
  key: string
  title: string
  snippet: string
  budget: string
  created: string
  categoryIcon: string
  status: string
  raw: any
}

const filteredGigs = computed<MappedGigCard[]>(() => {
  const source = Array.isArray(jobs.value) ? jobs.value : []

  const normalized = source.map((job, index) => {
    const key = job.id ? String(job.id) : `gig-${index}`
    const description = typeof job.description === 'string' ? job.description : ''
    const title = typeof job.project_title === 'string' ? job.project_title : 'Untitled gig'
    const category = typeof job.category === 'string' ? job.category : ''
    return {
      key,
      title,
      snippet: description.length > 160 ? `${description.slice(0, 157)}...` : description,
      budget: formatBudget(job.budget),
      created: formatDate(job.date_created),
      categoryIcon: getCategoryIcon(category),
      searchable: `${title} ${description} ${category}`.toLowerCase(),
      status: normalizeJobStatus(job),
      raw: job
    }
  })

  let result = normalized

  result = result.filter(job => {
    if (activeTab.value === 'active') {
      return job.status === 'active'
    }
    return ['awaiting_client', 'available'].includes(job.status)
  })

  const query = searchQuery.value.trim().toLowerCase()
  if (query) {
    result = result.filter(job => job.searchable.includes(query))
  }

  if (selectedServices.value.length > 0) {
    const serviceTitles = selectedServices.value
      .map(service => (service?.title ? String(service.title).toLowerCase() : ''))
      .filter(Boolean)
    if (serviceTitles.length > 0) {
      result = result.filter(job => serviceTitles.some(service => job.searchable.includes(service)))
    }
  }

  return result.map(({ searchable, ...rest }) => rest)
})

const normalizeJobStatus = (job: any): string => {
  const adminApproved = isAdminApproved(job)
  const jobId = getJobId(job)
  const hasAcceptedProposal = jobId ? acceptedJobIds.value.has(jobId) : false
  const hasAgentProposal = jobId ? proposalJobIds.value.has(jobId) : false

  if (adminApproved && hasAcceptedProposal) return 'active'
  if (adminApproved && hasAgentProposal) return 'awaiting_client'
  if (adminApproved) return 'available'
  if (hasAcceptedProposal) return 'pending_admin'
  if (hasAgentProposal) return 'proposal_submitted'
  return 'pending_review'
}

const isAdminApproved = (job: any): boolean => {
  const adminFlags = [job?.admin_approved, job?.adminApproved, job?.is_admin_approved]
  return adminFlags.some(value => value === true || value === 1 || (typeof value === 'string' && ['true', '1', 'yes'].includes(value.trim().toLowerCase())))
}

const statusLabel = (status: string, isActive: boolean) => {
  if (status === 'active') return 'Active'
  if (status === 'awaiting_client') return 'Awaiting Client'
  if (status === 'available') return 'Available'
  return isActive ? 'Active' : 'Pending'
}

const statusBadgeClass = (status: string, isActive: boolean) => {
  if (status === 'active' || isActive) {
    return 'bg-green-100 text-green-700 border border-green-200'
  }
  if (status === 'available') {
    return 'bg-blue-100 text-blue-700 border border-blue-200'
  }
  if (status === 'awaiting_client') {
    return 'bg-yellow-100 text-yellow-700 border border-yellow-200'
  }
  return 'bg-gray-100 text-gray-600 border border-gray-200'
}
</script>

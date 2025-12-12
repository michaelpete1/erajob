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
            <router-link to="/chat/1" class="flex items-center gap-2 text-white/90 hover:text-white" aria-label="Messages">
              <MusicalNoteIcon class="h-5 w-5" />
              <span class="hidden lg:inline text-sm">Proposals</span>
            </router-link>
            <router-link to="/alerts" class="relative flex items-center gap-2 text-white/90 hover:text-white" aria-label="Notifications">
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
          <div class="flex justify-center mb-3 pb-3 border-gray-200">
            <router-link @click="openMobileNav = false" to="/agent/gigs-listing" class="flex items-center justify-center">
              <BrandLogo size="sm" />
            </router-link>
          </div>
          <router-link @click="openMobileNav = false" to="/agent/gigs-listing" class="py-2 px-3 rounded hover:bg-gray-100">Projects</router-link>
          <router-link @click="openMobileNav = false" to="/proposals" class="py-2 px-3 rounded hover:bg-gray-100">Proposals</router-link>
          <router-link @click="openMobileNav = false" to="/alerts" class="py-2 px-3 rounded hover:bg-gray-100">Notifications <span class="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-400 text-white text-xs">3</span></router-link>
          <router-link @click="openMobileNav = false" to="/settings" class="py-2 px-3 rounded hover:bg-gray-100">Settings</router-link>
        </div>
      </div>

      

      <div class="mt-6 sm:mt-8">
        <!-- Loading State -->
        <div v-if="assignedLoading" class="flex justify-center py-8">
          <svg class="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <!-- Error State -->
        <div v-else-if="assignedError" class="text-center py-8">
          <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 max-w-sm mx-auto">
            <span class="text-3xl sm:text-4xl mb-3 sm:mb-4 block">⚠️</span>
            <h3 class="text-lg sm:text-xl font-bold text-brand-teal mb-2">Error Loading Jobs</h3>
            <p class="text-sm sm:text-base text-gray-600">{{ assignedError }}</p>
            <button 
              @click="fetchAssignedJobs()" 
              class="mt-4 bg-brand-teal text-white px-4 py-2 rounded-full text-sm"
            >
              Try Again
            </button>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          
          <div 
            v-for="gig in filteredGigs" 
            :key="gig.id"
            class="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-102 animate-fade-up-delay-1 block cursor-pointer"
            @click="goToLogWorkHours(gig)"
          >
            <div class="block">
              <div class="flex items-start justify-between mb-3 sm:mb-4 gap-3">
                <div class="flex items-center gap-3">
                  <span class="text-2xl sm:text-3xl">{{ gig.icon }}</span>
                  <h3 class="text-lg sm:text-xl font-bold text-brand-teal">{{ gig.title }}</h3>
                </div>
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
                  :class="statusBadgeClass(gig.status, true)"
                >
                  {{ statusLabel(gig.status, true) }}
                </span>
              </div>
              <p class="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{{ gig.description }}</p>
              <div class="flex items-center justify-between mb-3 sm:mb-4">
                <span class="text-xl sm:text-2xl font-bold text-brand-teal">${{ (Number(gig.price) * 1.17).toFixed(2) }}</span>
                <span class="text-xs sm:text-sm text-gray-500">per hour (total)</span>
              </div>

              <div>
                <button @click.stop="goToLogWorkHours(gig)" class="w-full bg-brand-teal text-white py-2 px-4 rounded-full hover:bg-teal-600 transition-colors duration-300 text-center block text-sm sm:text-base">
                  Log Work
                </button>
              </div>
            </div>
          </div>
      
      <!-- No results message -->
      <div v-if="filteredGigs.length === 0" class="col-span-full text-center py-12">
        <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-8">
          <span class="text-4xl mb-4 block">🔍</span>
          <h3 class="text-xl font-bold text-brand-teal mb-2">No gigs found</h3>
          <p class="text-gray-600">Try adjusting your search terms or browse all gigs in the Active tab.</p>
        </div>
      </div>
        </div>
      </div>

      <!-- Back Button -->
      <div class="text-center mt-8">
        <router-link to="/agent/explore-gigs" class="inline-flex items-center text-white hover:text-white/80 transition-colors duration-300">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Explore
        </router-link>
      </div>

  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { jobsService } from '@/services/jobsService'
import { PencilSquareIcon, AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline'
import { CheckCircleIcon, MusicalNoteIcon } from '@heroicons/vue/24/solid'

const openMobileNav = ref(false)
const selectedServices = ref<any[]>([])
const assignedJobs = ref<JobCard[]>([])
const assignedLoading = ref(false)
const assignedError = ref<string | null>(null)
const agentData = ref<any>(null)

const router = useRouter()

// No browse tab: we only load assigned jobs


const paginationParams = { start: 0, stop: 10 }

onMounted(async () => {
  const stored = localStorage.getItem('selectedAgentServices')
  if (stored) {
    selectedServices.value = JSON.parse(stored)
  }

  // Load agent expertise data
  const agentStored = localStorage.getItem('agentWelcomeData')
  if (agentStored) {
    agentData.value = JSON.parse(agentStored)
  }

  await fetchData()
})

const fetchData = async () => {
  await fetchAssignedJobs()
}

const fetchAssignedJobs = async () => {
  assignedLoading.value = true
  assignedError.value = null
  try {
    const response = await jobsService.listAgentSelectedJobs(paginationParams.start, paginationParams.stop)
    if (response.success && response.data) {
      const items = Array.isArray(response.data) ? response.data : response.data ? [response.data] : []
      assignedJobs.value = items.map(buildJobCard)
    } else {
      assignedJobs.value = []
      assignedError.value = response.error || 'Failed to load assigned jobs.'
    }
  } catch (error: any) {
    assignedJobs.value = []
    assignedError.value = error?.message || 'Failed to load assigned jobs.'
  } finally {
    assignedLoading.value = false
  }
}

const getCategoryIcon = (category: string | undefined) => {
  const normalized = (category || '').toLowerCase()
  if (normalized.includes('writing')) return '📝'
  if (normalized.includes('design')) return '🎨'
  if (normalized.includes('marketing')) return '📱'
  if (normalized.includes('data')) return '📊'
  if (normalized.includes('mobile')) return '📱'
  if (normalized.includes('admin')) return '🎯'
  if (normalized.includes('web')) return '💻'
  return '💼'
}

interface JobCard {
  id: string
  title: string
  description: string
  price: string
  category: string
  icon: string
  status: string
  keywords: string[]
  raw: any
}

const extractKeywords = (job: any): string[] => {
  const skillsField = job?.skills_needed ?? job?.skills
  if (Array.isArray(skillsField)) {
    return skillsField
      .map((skill: any) => {
        if (typeof skill === 'string') return skill
        if (skill && typeof skill === 'object') {
          return skill.name || skill.title || ''
        }
        return ''
      })
      .filter(Boolean)
  }
  if (typeof skillsField === 'string') {
    try {
      const parsed = JSON.parse(skillsField)
      if (Array.isArray(parsed)) return parsed.filter((item: any) => typeof item === 'string').map(item => item.trim()).filter(Boolean)
    } catch (error) {
      // ignore json parse errors and fallback to splitting by comma
    }
    return skillsField
      .split(',')
      .map((skill: string) => skill.trim())
      .filter(Boolean)
  }
  return []
}

const buildJobCard = (job: any): JobCard => {
  const rawId = job?.id ?? job?.job_id ?? ''
  const id = typeof rawId === 'string' ? rawId : String(rawId || '')
  const title = job?.project_title ?? job?.title ?? 'Untitled Project'
  const description = job?.description ?? ''
  const budgetRaw = typeof job?.budget === 'number' ? job.budget : Number.parseFloat(job?.budget ?? '0')
  const budget = Number.isFinite(budgetRaw) ? budgetRaw : 0
  const category = job?.category ?? 'Other'

  return {
    id,
    title,
    description,
    price: (budget / 100).toFixed(2),
    category,
    icon: getCategoryIcon(category),
    status: normalizeJobStatus(job),
    keywords: extractKeywords(job),
    raw: job
  }
}

const normalizeJobStatus = (job: any): string => {
  const statusRaw = String(job?.status || '').toLowerCase()
  const clientApproved = isClientApproved(job)
  const adminApproved = isAdminApproved(job)
  if (statusRaw.includes('active') || (adminApproved && clientApproved)) return 'active'
  if (adminApproved) return 'awaiting_client'
  return 'pending_review'
}


const isAdminApproved = (job: any): boolean => {
  const adminFlags = [job?.admin_approved, job?.adminApproved, job?.is_admin_approved]
  return adminFlags.some(value => isTruthyApproval(value))
}

const isJobApprovedForAgent = (job: any): boolean => {
  return isAdminApproved(job) || isClientApproved(job)
}

const isClientApproved = (job: any): boolean => {
  const flags = [job?.client_approved, job?.clientApproved, job?.is_client_approved]
  if (flags.some(value => isTruthyApproval(value))) return true
  const statusRaw = String(job?.status || '').toLowerCase()
  return statusRaw.includes('active') || statusRaw.includes('accepted')
}

const isTruthyApproval = (value: unknown): boolean => {
  if (value === true) return true
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    return ['true', 'yes', 'approved', 'accepted'].includes(normalized)
  }
  if (typeof value === 'number') {
    return value === 1
  }
  return false
}

const activeJobs = computed(() => assignedJobs.value
  .filter(job => isClientApproved(job.raw))
  .map(job => ({ ...job, status: 'active' }))
)

const getAgentExpertise = (): string | null => {
  try {
    // First try agentWelcomeData
    const welcomeData = localStorage.getItem('agentWelcomeData')
    if (welcomeData) {
      const parsed = JSON.parse(welcomeData)
      if (parsed.primaryExpertise) return parsed.primaryExpertise
    }

    // Fallback to userInfo
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      const parsed = JSON.parse(userInfo)
      const agentData = parsed.agentProfile || parsed.profile || parsed
      if (agentData?.primaryExpertise || agentData?.primary_expertise) {
        return agentData.primaryExpertise || agentData.primary_expertise
      }
    }

    // Last fallback to agentProfile
    const agentProfile = localStorage.getItem('agentProfile')
    if (agentProfile) {
      const parsed = JSON.parse(agentProfile)
      if (parsed.primaryExpertise) return parsed.primaryExpertise
    }
  } catch (error) {
    console.warn('Failed to parse agent data:', error)
  }
  return null
}

const filteredGigs = computed(() => {
  let result = [...activeJobs.value]

  if (selectedServices.value.length > 0) {
    const serviceTitles = selectedServices.value.map(service => service.title.toLowerCase())
    result = result.filter(job =>
      serviceTitles.some(service =>
        job.title.toLowerCase().includes(service) ||
        (job.category || '').toLowerCase().includes(service) ||
        job.keywords.some(keyword => keyword.toLowerCase().includes(service))
      )
    )
  }

  return result
})

const persistJob = (job: JobCard) => {
  try {
    localStorage.setItem('selectedGig', JSON.stringify(job.raw))
  } catch (e) {
    // ignore storage errors
  }
}

const goToLogWorkHours = (gig: JobCard) => {
  persistJob(gig)
  router.push({ path: '/agent/logging-details' })
}


const statusLabel = (status: string, isActive: boolean) => {
  if (isActive) return 'Approved'
  if (!status) return 'Pending'
  const normalized = status.toLowerCase()
  if (normalized.includes('approved') || normalized.includes('accepted') || normalized.includes('assigned')) return 'Approved'
  return 'Pending'
}

const statusBadgeClass = (status: string, isActive: boolean) => {
  const normalized = status?.toLowerCase?.() || ''
  if (isActive || normalized.includes('approved') || normalized.includes('accepted') || normalized.includes('assigned')) {
    return 'bg-green-100 text-green-700 border border-green-200'
  }
  return 'bg-yellow-100 text-yellow-700 border border-yellow-200'
}
</script>

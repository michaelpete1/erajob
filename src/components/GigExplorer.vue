<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Optional Header Section (controlled by parent component) -->
    <slot name="header">
      <!-- Default header if no custom header is provided -->
      <div class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center space-x-4">
              <button @click="goBack" class="flex items-center text-gray-600 hover:text-gray-900">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                Back
              </button>
              <h1 class="text-2xl font-bold text-gray-900">Explore Gigs</h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-500">{{ totalGigs }} gigs available</span>
              <div class="relative">
                <button @click="toggleFilters" class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                  </svg>
                  Filters
                </button>
                <!-- Filters Panel -->
                <div v-if="showFilters" class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-10">
                  <div class="p-4">
                    <h3 class="text-lg font-semibold mb-4">Filter Gigs</h3>

                    <!-- Skills Filter -->
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                      <select v-model="filters.skills" @change="applyFilters" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">All Skills</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Mobile Development">Mobile Development</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="Content Writing">Content Writing</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                        <option value="Data Analysis">Data Analysis</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <!-- Budget Range -->
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                      <div class="flex space-x-2">
                        <input v-model="filters.minBudget" @input="applyFilters" type="number" placeholder="Min" class="w-1/2 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                        <input v-model="filters.maxBudget" @input="applyFilters" type="number" placeholder="Max" class="w-1/2 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                      </div>
                    </div>

                    <!-- Status Filter -->
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select v-model="filters.status" @change="applyFilters" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>

                    <div class="flex justify-between">
                      <button @click="clearFilters" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Clear
                      </button>
                      <button @click="toggleFilters" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </slot>

    <!-- Search Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <div class="flex-1 relative">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search gigs by title, description, or skills..."
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
          <svg class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <div class="flex space-x-2">
          <select v-model="sortBy" @change="handleSort" class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="budget_high">Highest Budget</option>
            <option value="budget_low">Lowest Budget</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">Loading gigs...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg class="mx-auto h-12 w-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <h3 class="text-lg font-medium text-red-800 mb-2">Error Loading Gigs</h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="retryFetch" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Try Again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredGigs.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m6 8v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No Gigs Found</h3>
        <p class="text-gray-600 mb-4">
          {{ searchQuery || Object.values(filters).some(v => v) ? 'Try adjusting your search or filters' : 'No gigs available at the moment' }}
        </p>
        <button v-if="searchQuery || Object.values(filters).some(v => v)" @click="clearAllFilters" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Clear Filters
        </button>
      </div>

      <!-- Gigs Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="gig in paginatedGigs"
          :key="gig.id || gig.title"
          class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          <!-- Gig Card Header -->
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {{ gig.title }}
                </h3>
                <div class="flex items-center text-sm text-gray-500 mb-2">
                  <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    {{ gig.status ?? 'active' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Description -->
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">
              {{ gig.description }}
            </p>

            <!-- Skills -->
            <div class="mb-4">
              <div class="flex flex-wrap gap-1">
                <template v-if="Array.isArray(gig.skills_needed)">
                  <span
                    v-for="(skill, index) in gig.skills_needed.slice(0, 3)"
                    :key="index"
                    class="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs"
                  >
                    {{ skill }}
                  </span>
                  <span v-if="gig.skills_needed.length > 3" class="text-xs text-gray-500">
                    +{{ gig.skills_needed.length - 3 }} more
                  </span>
                </template>
                <template v-else>
                  <span class="text-xs text-gray-500">No skills specified</span>
                </template>
              </div>
            </div>

            <!-- Timeline -->
            <div class="mb-4">
              <div class="flex items-center text-sm text-gray-500">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span class="mr-2">Timeline:</span>
                <span>{{ formatDate(gig.timeline?.start_date) }} - {{ formatDate(gig.timeline?.end_date) }}</span>
              </div>
            </div>

            <!-- Budget -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
                <span class="text-lg font-bold text-green-600">${{ gig.budget?.toLocaleString() }}</span>
              </div>
              <span class="text-sm text-gray-500">
                {{ calculateDaysLeft(gig.timeline?.end_date) }} days left
              </span>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-2">
              <button
                @click="viewGigDetails(gig)"
                class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                View Details
              </button>
              <button
                @click="applyForGig(gig)"
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center items-center space-x-2 mt-8">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>

        <div class="flex space-x-1">
          <template v-for="(page, index) in visiblePages" :key="index">
            <button
              v-if="typeof page === 'number'"
              @click="goToPage(page)"
              :class="[
                'px-3 py-2 border rounded-lg hover:bg-gray-50',
                page === currentPage ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'
              ]"
            >
              {{ page }}
            </button>
            <span v-else class="px-3 py-2 text-gray-500">...</span>
          </template>
        </div>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Gig Details Modal -->
    <div v-if="selectedGig" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-2xl font-bold text-gray-900">{{ selectedGig.title }}</h2>
            <button @click="closeGigDetails" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="space-y-6">
            <!-- Status -->
            <div class="flex space-x-2">
              <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {{ selectedGig.status }}
              </span>
            </div>

            <!-- Description -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p class="text-gray-600">{{ selectedGig.description }}</p>
            </div>

            <!-- Skills -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Required Skills</h3>
              <div class="flex flex-wrap gap-2">
                <template v-if="Array.isArray(selectedGig.skills_needed)">
                  <span
                    v-for="(skill, index) in selectedGig.skills_needed"
                    :key="index"
                    class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {{ skill }}
                  </span>
                </template>
                <template v-else>
                  <span class="text-sm text-gray-500">No skills specified</span>
                </template>
              </div>
            </div>

            <!-- Timeline -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Timeline</h3>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex justify-between">
                  <span class="text-gray-600">Start Date:</span>
                  <span class="font-medium">{{ formatDate(selectedGig.timeline?.start_date) }}</span>
                </div>
                <div class="flex justify-between mt-2">
                  <span class="text-gray-600">Deadline:</span>
                  <span class="font-medium">{{ formatDate(selectedGig.timeline?.end_date) }}</span>
                </div>
                <div class="flex justify-between mt-2">
                  <span class="text-gray-600">Duration:</span>
                  <span class="font-medium">{{ calculateDuration(selectedGig.timeline?.start_date, selectedGig.timeline?.end_date) }} days</span>
                </div>
              </div>
            </div>

            <!-- Budget -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Budget</h3>
              <div class="bg-green-50 p-4 rounded-lg">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Project Budget:</span>
                  <span class="text-2xl font-bold text-green-600">${{ selectedGig.budget?.toLocaleString() }}</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-3 pt-4">
              <button
                @click="applyForGig(selectedGig)"
                class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Apply for this Gig
              </button>
              <button
                @click="closeGigDetails"
                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { jobsService } from '@/services/jobsService'

// Define a component-specific type that maps from the API's Job to what the template expects.
// This helps keep template changes minimal while adapting to the new API shape.
interface ComponentDisplayJob {
  id: string;
  title: string; // Maps from API Job.title
  description: string;
  budget: number;
  skills_needed: string[]; // Converted from API Job.skills_needed: { id: string; name: string }[]
  status: string;
  timeline: {
    start_date: string;
    end_date: string; // Maps from API Job.timeline.end_date
  };
  created_at: string; // Maps from API Job.created_at
}

// Define the structure of a raw job object as received from the API
// This replaces the external 'Job' type if it's not correctly exported or found.
interface ApiJob {
  id: string;
  title: string;
  description: string;
  budget: number;
  skills_needed: Array<{ id: string; name: string }>; // API returns array of objects
  status: string;
  timeline: {
    start_date: string;
    end_date: string;
  };
  created_at: string;
}

// Define a generic API response structure
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

const router = useRouter()

const gigs = ref<ComponentDisplayJob[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const searchQuery = ref('')
const sortBy = ref('newest')
const currentPage = ref(1)
const itemsPerPage = 9
const selectedGig = ref<ComponentDisplayJob | null>(null)
const showFilters = ref(false)

// Filters
const filters = ref({
  skills: '',
  minBudget: '',
  maxBudget: '',
  status: ''
})

// Computed properties
const totalGigs = computed(() => gigs.value.length)

const sortedGigs = computed(() => {
  const sorted = [...gigs.value]
  sorted.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case 'budget_high':
        return (b.budget ?? 0) - (a.budget ?? 0)
      case 'budget_low':
        return (a.budget ?? 0) - (b.budget ?? 0)
      case 'title':
        return (a.title ?? '').localeCompare(b.title ?? '')
      default:
        return 0
    }
  })
  return sorted
})

const filteredGigs = computed(() => {
  let filtered = [...sortedGigs.value]

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(gig => {
      const skillsText = gig.skills_needed.join(' ').toLowerCase()
          
      return (
        gig.title?.toLowerCase().includes(query) ||
        gig.description?.toLowerCase().includes(query) ||
        skillsText.includes(query)
      )
    })
  }

  // Skills filter
  if (filters.value.skills) {
    const searchTerm = filters.value.skills.toLowerCase();
    filtered = filtered.filter(gig => 
      gig.skills_needed.some(skill => 
        skill.toLowerCase().includes(searchTerm)
      )
    );
  }

  // Budget range filter
  if (filters.value.minBudget) {
    const min = parseInt(filters.value.minBudget)
    if (!isNaN(min)) {
      filtered = filtered.filter(gig => gig.budget !== undefined && gig.budget >= min)
    }
  }
  if (filters.value.maxBudget) {
    const max = parseInt(filters.value.maxBudget)
    if (!isNaN(max)) {
      filtered = filtered.filter(gig => gig.budget !== undefined && gig.budget <= max)
    }
  }

  // Status filter
  if (filters.value.status) {
    filtered = filtered.filter(gig => gig.status === filters.value.status)
  }

  return filtered
})

const totalPages = computed(() =>
  Math.ceil(filteredGigs.value.length / itemsPerPage)
)

const paginatedGigs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredGigs.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value
  const range = 1 // Pages around current

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }

  pages.push(1)
  if (current > range + 2) pages.push('...')
  
  for (let i = Math.max(2, current - range); i <= Math.min(total - 1, current + range); i++) {
    pages.push(i)
  }

  if (current < total - (range + 1)) pages.push('...')
  pages.push(total)

  return pages
})

// Methods
/**
 * Normalizes a job object from the API (ApiJob) to a format suitable for the component (ComponentDisplayJob).
 * Ensures `skills_needed` is always an array of strings for consistent use in the component.
 */
const normalizeJob = (apiJob: ApiJob): ComponentDisplayJob => {
  // skills_needed is now an array of { id: string; name: string } objects from the API
  const skills = Array.isArray(apiJob.skills_needed) 
    ? apiJob.skills_needed.map(skill => skill.name)
    : [];

  return {
    id: apiJob.id,
    title: apiJob.title,
    description: apiJob.description,
    budget: apiJob.budget,
    skills_needed: skills,
    status: apiJob.status,
    timeline: {
      start_date: apiJob.timeline.start_date,
      end_date: apiJob.timeline.end_date,
    },
    created_at: apiJob.created_at,
  };
};

const fetchGigs = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Fetch the raw response, explicitly type it as 'any' to ignore external type definitions
    const response: any = await jobsService.listAdminJobs(0, 1000);
    
    // Now, safely access data and cast it to our local ApiResponse structure
    const apiResponseData: ApiResponse<ApiJob[]> = response.data;

    if (apiResponseData && apiResponseData.data) {
      gigs.value = Array.isArray(apiResponseData.data)
        ? apiResponseData.data.map(normalizeJob)
        : []
    } else {
      // Access message from apiResponseData
      error.value = apiResponseData.message || 'Failed to load gigs'
    }
  } catch (err: any) {
    const message = err.response?.data?.message || err.message || 'An unknown error occurred'
    error.value = `Network error: ${message}`
    console.error('Error fetching gigs:', err)
  } finally {
    isLoading.value = false
  }
}

const retryFetch = () => {
  fetchGigs()
}

const goBack = () => {
  router.back()
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const applyFilters = () => {
  currentPage.value = 1
  // Filters are applied through computed property
}

const clearFilters = () => {
  filters.value = {
    skills: '',
    minBudget: '',
    maxBudget: '',
    status: ''
  }
  currentPage.value = 1
}

const clearAllFilters = () => {
  searchQuery.value = ''
  clearFilters()
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleSort = () => {
  // Sorting is handled in the computed property
  currentPage.value = 1
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const viewGigDetails = (gig: ComponentDisplayJob) => {
  selectedGig.value = gig
}

const closeGigDetails = () => {
  selectedGig.value = null
}

const applyForGig = (gig: ComponentDisplayJob) => {
  // Navigate to application page or show application modal
  console.log('Applying for gig:', gig.id)
  // You could navigate to an application form or show a modal
  console.warn(`Application functionality for "${gig.title}" would be implemented here.`)
}

const formatDate = (dateString: string | undefined | null) => {
  if (!dateString) return 'N/A'
  // Assuming dateString is in ISO 8601 format (e.g., "YYYY-MM-DDTHH:mm:ss.sssZ")
  return new Date(dateString).toLocaleDateString()
}

const calculateDaysLeft = (dateString: string | undefined | null) => {
  if (!dateString) return 0
  const deadline = new Date(dateString).getTime()
  const now = Date.now()
  const days = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24))
  return Math.max(0, days)
}

const calculateDuration = (startDateString: string | undefined | null, endDateString: string | undefined | null) => {
  if (!startDateString || !endDateString) return 0
  const start = new Date(startDateString).getTime()
  const end = new Date(endDateString).getTime()
  const durationMs = end - start
  return Math.ceil(durationMs / (1000 * 60 * 60 * 24))
}

// Lifecycle
onMounted(() => {
  fetchGigs()
})

// Watch for real-time updates if needed
watch(() => filteredGigs.value.length, () => {
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = totalPages.value
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 3;
}
</style>
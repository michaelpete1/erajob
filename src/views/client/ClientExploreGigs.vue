<template>
  <div class="min-h-screen bg-gray-50 pb-16 sm:pb-20">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <div class="flex items-center gap-2 sm:gap-3">
          <button @click="goBack" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-lg sm:text-xl font-semibold text-gray-800">Available Services</h1>
        </div>
        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-teal-500"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 sm:px-6 py-4 sm:py-6 max-w-7xl mx-auto">
      <!-- Welcome Section -->
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Available Services</h2>
        <p class="text-gray-600">Browse through our available gig services</p>
      </div>

      <!-- GigExplorer Component -->
      <GigExplorer>
        <template #header>
          <div class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="flex justify-between items-center py-4">
                <div class="flex items-center space-x-4">
                  <span class="text-sm text-gray-500">{{ totalGigs }} gigs available</span>
                  <div class="relative">
                    <button @click="toggleFilters" class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                      </svg>
                      Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </GigExplorer>

      <!-- Continue Button -->
      <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 sm:px-6">
        <button
          @click="goToProjects"
          class="w-full bg-teal-500 text-white font-medium py-4 rounded-xl hover:bg-teal-600 transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          Continue to Projects
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import GigExplorer from '@/components/GigExplorer.vue'

export default defineComponent({
  name: 'ClientExploreGigs',
  components: {
    GigExplorer
  },
  setup() {
    const router = useRouter()
    const selectedServices = ref<any[]>([])
    const totalGigs = ref(0)

    const goBack = () => {
      router.go(-1)
    }

    const goToProjects = () => {
      try {
        localStorage.setItem('selectedClientServices', JSON.stringify(selectedServices.value))
      } catch (e) {
        console.error('Error saving to localStorage:', e)
      }
      router.push('/client/projects')
    }

    const toggleFilters = () => {
      console.log('Toggle filters')
      // Implement filter toggle logic here
    }

    onMounted(() => {
      // Initialize or fetch data
      totalGigs.value = 0 // Replace with actual data fetch
    })

    return {
      selectedServices,
      totalGigs,
      goBack,
      goToProjects,
      toggleFilters
    }
  }
})
</script>

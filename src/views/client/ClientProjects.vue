<template>
  <div class="min-h-screen bg-gray-50 pb-16 sm:pb-20">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <div class="flex items-center gap-2 sm:gap-3">
          <button @click="$router.back()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-lg sm:text-xl font-semibold text-gray-800">Projects</h1>
        </div>
        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-teal-500"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 sm:px-6 py-4 sm:py-6 max-w-4xl mx-auto">
      <!-- Tabs -->
      <div class="flex bg-gray-100 rounded-lg overflow-hidden max-w-md mx-auto mb-6">
        <button 
          @click="activeTab = 'active'"
          :class="activeTab === 'active' ? 'bg-teal-500 text-white' : 'text-gray-600'"
          class="flex-1 py-3 sm:py-3 text-sm sm:text-base font-medium transition-colors duration-200 hover:bg-gray-200"
        >
          Active
        </button>
        <button 
          @click="activeTab = 'browse'"
          :class="activeTab === 'browse' ? 'bg-teal-500 text-white' : 'text-gray-600'"
          class="flex-1 py-3 sm:py-3 text-sm sm:text-base font-medium transition-colors duration-200 hover:bg-gray-200"
        >
          Browse
        </button>
      </div>

    <!-- Project Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 pb-32">
      <!-- Active Projects -->
      <div 
        v-for="project in activeProjects"
        :key="project.id"
        v-show="activeTab === 'active'"
        @click="goToProject(project)"
        class="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-lg hover:border-teal-300 transition-all duration-300 cursor-pointer group"
      >
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
          <p class="flex items-center gap-1 text-sm text-gray-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-xs sm:text-sm">{{ project.assignedTime }}</span>
          </p>
          <span class="px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full whitespace-nowrap">
            {{ project.timeLeft }}
          </span>
        </div>
        
        <h2 class="font-semibold text-gray-800 text-base sm:text-lg lg:text-xl mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors">
          {{ project.title }}
        </h2>
        
        <div class="flex items-center gap-2 mb-4">
          <span class="text-blue-500 text-lg sm:text-xl">👤</span>
          <p class="text-sm sm:text-base text-gray-600">{{ project.client }}</p>
        </div>
        
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div class="flex items-center text-teal-600 font-semibold">
            <span class="text-lg sm:text-xl">💰</span>
            <span class="ml-1 text-lg sm:text-xl font-bold">${{ project.budget }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex -space-x-2">
              <div v-for="agent in (project.agents || []).slice(0, 3)" :key="agent.id" class="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center text-xs text-white font-semibold">
                {{ agent.name.charAt(0) }}
              </div>
              <div v-if="project.agents && project.agents.length > 3" class="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs text-gray-600 font-semibold">
                +{{ project.agents.length - 3 }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Browse Projects -->
      <div v-if="activeTab === 'browse'" class="md:col-span-2 lg:col-span-3">
        <!-- Top Filters -->
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div class="flex flex-wrap gap-4">
            <button class="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors">
              <span class="text-lg">🕒</span>
              <span class="text-sm sm:text-base font-medium">Recent Projects</span>
            </button>
            <button class="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <span class="text-lg">❤️</span>
              <span class="text-sm sm:text-base font-medium">Favorites</span>
            </button>
          </div>
        </div>

        <!-- Browse Project Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div 
            v-for="project in browseProjects"
            :key="project.id"
            @click="goToProject(project)"
            class="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg hover:border-teal-300 transition-all duration-300 group cursor-pointer"
          >
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs text-gray-500 flex items-center gap-1">
            <span class="text-lg">⏰</span>
            <span>{{ project.postedTime }}</span>
          </span>
          <span class="px-2 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">{{ project.category }}</span>
        </div>
        <h2 class="font-semibold text-gray-800 text-base sm:text-lg mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors">
          {{ project.title }}
        </h2>
        <p class="text-sm text-gray-600 mb-4 line-clamp-3">
          Project description for {{ project.title }}
        </p>
        <div class="flex items-center justify-between">
          <span class="text-lg font-bold text-teal-600">${{ project.budget }}</span>
          <button class="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium text-sm sm:text-base transition-colors">
            View Details
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Action Button -->
    <button
      @click="goToCreateProject"
      class="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-teal-500 text-white text-xl sm:text-2xl flex items-center justify-center shadow-lg hover:bg-teal-600 hover:shadow-xl transition-all duration-300 z-40 group"
    >
      <svg class="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </button>

    <!-- Client Bottom Navigation -->
    <ClientBottomNav />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ClientBottomNav from '../../components/ClientBottomNav.vue'

const router = useRouter()
const activeTab = ref<'active' | 'browse'>('browse')

// Mock data
const activeProjects = ref([
  {
    id: 1,
    title: 'Complete Freelancer Application UI/UX Revamp',
    client: 'Jenny Wilson (jennyson)',
    budget: '2,500',
    assignedTime: 'Assigned 8 hours ago',
    timeLeft: '5 Hours',
    agents: [
      { id: 1, name: 'Agent 1' },
      { id: 2, name: 'Agent 2' },
      { id: 3, name: 'Agent 3' },
      { id: 4, name: 'Agent 4' }
    ]
  },
  {
    id: 2,
    title: 'E-commerce Website Development',
    client: 'Matt Barrie (matt)',
    budget: '5,000',
    assignedTime: 'Assigned 3 days ago',
    timeLeft: '7 Days',
    agents: [
      { id: 1, name: 'Agent 1' },
      { id: 2, name: 'Agent 2' }
    ]
  }
])

const browseProjects = ref([
  {
    id: 3,
    title: 'Mobile App Design for Startup',
    category: 'UI/UX Design',
    budget: '3,500',
    postedTime: 'Posted 2 days ago',
    proposals: '12'
  },
  {
    id: 4,
    title: 'Content Writing for Blog',
    category: 'Writing',
    budget: '800',
    postedTime: 'Posted 1 day ago',
    proposals: '8'
  },
  {
    id: 5,
    title: 'Social Media Marketing Campaign',
    category: 'Marketing',
    budget: '1,200',
    postedTime: 'Posted 5 hours ago',
    proposals: '5'
  }
])

// Methods
const goToProject = (project: any) => {
  // Save project to localStorage for detail page
  try {
    localStorage.setItem('selectedProject', JSON.stringify(project))
  } catch (e) {
    // ignore
  }
  // Navigate to job description page for browse projects
  router.push(`/client/jobs/${project.id}`)
}

const goToCreateProject = () => {
  router.push('/client/projects/create')
}
</script>

<style scoped>
/* No custom styles needed - using Tailwind classes */
</style>

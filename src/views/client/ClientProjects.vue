<template>
  <div class="min-h-screen bg-gray-50 pb-16 sm:pb-20">

    <div class="px-4 sm:px-6 py-4 sm:py-6 max-w-4xl mx-auto">
      <!-- Page Title -->
      <div class="mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Projects</h1>
        <p class="text-gray-600 mt-1">Manage your active and browse projects</p>
      </div>
      <div class="flex bg-gray-100 rounded-lg overflow-hidden max-w-md mx-auto mb-6">
        <button 
          @click="activeTab = 'active'"
          :class="activeTab === 'active' ? 'bg-teal-500 text-white' : 'text-gray-600'"
          class="flex-1 py-3 sm:py-3 text-sm sm:text-base font-medium transition-colors duration-200 hover:bg-gray-200"
        >
          Active
        </button>
        <button 
          @click="activeTab = 'pending'"
          :class="activeTab === 'pending' ? 'bg-teal-500 text-white' : 'text-gray-600'"
          class="flex-1 py-3 sm:py-3 text-sm sm:text-base font-medium transition-colors duration-200 hover:bg-gray-200"
        >
          Pending
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-700 font-medium">{{ error }}</p>
        </div>
      </div>

      <!-- Projects Grid -->
      <div v-if="!loading && !error" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 pb-32">
        <div 
          v-for="project in activeProjects"
          :key="project.id || `active-${project.project_title}-${project.date_created}`"
          v-show="activeTab === 'active'"
          @click="goToProject(project)"
          class="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-lg hover:border-teal-300 transition-all duration-300 cursor-pointer group"
        >
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
          <p class="flex items-center gap-1 text-sm text-gray-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-xs sm:text-sm">{{ formatDate(project.date_created) }}</span>
          </p>
          <span class="px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full whitespace-nowrap">
            Active
          </span>
        </div>
        
        <h2 class="font-semibold text-gray-800 text-base sm:text-lg lg:text-xl mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors">
          {{ project.project_title }}
        </h2>
        
        <div class="flex items-center gap-2 mb-4">
          <span class="text-blue-500 text-lg sm:text-xl">📋</span>
          <p class="text-sm sm:text-base text-gray-600">{{ project.category }}</p>
        </div>
        
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div class="flex items-center text-teal-600 font-semibold">
            <span class="text-lg sm:text-xl">💰</span>
            <span class="ml-1 text-lg sm:text-xl font-bold">${{ project.budget.toLocaleString() }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500">{{ formatDate(project.timeline?.deadline) }}</span>
          </div>
        </div>
        
        <!-- Description Preview -->
        <div class="mt-3 pt-3 border-t border-gray-100">
          <p class="text-sm text-gray-600 line-clamp-3">{{ project.description }}</p>
        </div>
      </div>

        <div v-if="activeTab === 'active' && activeProjects.length === 0 && !loading" class="md:col-span-2 lg:col-span-3">
          <div class="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-8 sm:p-12 text-center">
            <div class="mb-6">
              <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            <h3 class="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">No Active Projects Yet</h3>
            <p class="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
              You don't have any active projects with assigned agents. Start by browsing available projects or create a new one to get started.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button 
              @click="activeTab = 'pending'"
              class="px-6 py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors duration-200"
            >
              Browse Projects
            </button>
            <button 
              @click="goToCreateProject"
              class="px-6 py-3 border border-teal-500 text-teal-500 rounded-lg font-medium hover:bg-teal-50 transition-colors duration-200"
            >
              Create Project
            </button>
          </div>
        </div>
      </div>

        <div v-if="activeTab === 'pending' && !loading" class="md:col-span-2 lg:col-span-3">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div 
              v-for="project in browseProjects"
              :key="project.id || `browse-${project.project_title}-${project.date_created}`"
              @click="goToProject(project)"
              class="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg hover:border-teal-300 transition-all duration-300 group cursor-pointer"
            >
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs text-gray-500 flex items-center gap-1">
                  <span class="text-lg">⏰</span>
                  <span>{{ formatDate(project.date_created) }}</span>
                </span>
                <span class="px-2 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">{{ project.category }}</span>
              </div>
              <h2 class="font-semibold text-gray-800 text-base sm:text-lg mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors">
                {{ project.project_title }}
              </h2>
              <p class="text-sm text-gray-600 mb-4 line-clamp-3">
                {{ project.description }}
              </p>
              <div class="flex items-center justify-between">
                <span class="text-lg font-bold text-teal-600">${{ project.budget.toLocaleString() }}</span>
                <button class="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium text-sm sm:text-base transition-colors">
                  View Details
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Empty state for browse projects -->
          <div v-if="browseProjects.length === 0" class="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-8 sm:p-12 text-center">
            <div class="mb-6">
              <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 class="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">No Available Projects</h3>
              <p class="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
                There are no available projects at the moment. Check back later or create your own project to get started.
              </p>
            </div>
            <div class="flex justify-center">
              <button 
                @click="goToCreateProject"
                class="px-6 py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors duration-200"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button
      @click="goToCreateProject"
      class="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-teal-500 text-white text-xl sm:text-2xl flex items-center justify-center shadow-lg hover:bg-teal-600 hover:shadow-xl transition-all duration-300 z-40 group"
    >
      <svg class="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useJobs } from '../../composables/useJobs'
import type { JobOut } from '../../types/api'

const router = useRouter()
const activeTab = ref<'active' | 'pending'>('pending')
const { getClientJobs, getAllJobs, loading, error } = useJobs()

const formatDate = (timestamp: number | null) => {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp * 1000)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays <= 7) {
    return `${diffDays} days ago`
  } else {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }
}

const activeProjects = ref<JobOut[]>([])
const browseProjects = ref<JobOut[]>([])

const fetchActiveProjects = async () => {
  try {
    const result = await getClientJobs()
    if (result.success && result.data) {
      activeProjects.value = result.data
    }
  } catch (err) {
    console.error('Error fetching active projects:', err)
  }
}

const fetchBrowseProjects = async () => {
  try {
    const result = await getAllJobs()
    if (result.success && result.data) {
      browseProjects.value = result.data
    }
  } catch (err) {
    console.error('Error fetching browse projects:', err)
  }
}

const fetchProjects = async () => {
  if (activeTab.value === 'active') {
    await fetchActiveProjects()
  } else {
    await fetchBrowseProjects()
  }
}

// Watch for tab changes
watch(activeTab, fetchProjects)

// Fetch initial data
onMounted(fetchProjects)


const goToProject = (project: any) => {
  try {
    localStorage.setItem('selectedProject', JSON.stringify(project))
  } catch (e) {
  }
  
  if (project.assignedTime && project.agents) {
    router.push('/client/work-log')
  } else {
    router.push(`/client/jobs/${project.id}`)
  }
}

const goToCreateProject = () => {
  router.push('/client/projects/create')
}
</script>

<style scoped>
</style>

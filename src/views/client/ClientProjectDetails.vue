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
          <h1 class="text-lg sm:text-xl font-semibold text-gray-800">Project Details</h1>
        </div>
        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 sm:px-6 py-4 sm:py-6 max-w-4xl mx-auto">
      <!-- Project Info Card -->
      <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h2 class="text-xl font-bold text-gray-800 mb-2">{{ project?.title || 'Project Title' }}</h2>
            <div class="flex items-center gap-2 mb-3">
              <span class="text-blue-500">📝</span>
              <p class="text-sm text-gray-600">{{ project?.category || 'UI/UX Design' }}</p>
            </div>
          </div>
          <span class="px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
            {{ project?.status || 'Active' }}
          </span>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-500 mb-1">Budget</p>
            <p class="text-lg font-bold text-green-600">${{ project?.budget || '2,500' }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-500 mb-1">Time Left</p>
            <p class="text-lg font-bold text-red-600">{{ project?.timeLeft || '5 Hours' }}</p>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-blue-500">👤</span>
            <p class="text-sm text-gray-600">{{ project?.client || 'Jenny Wilson' }}</p>
          </div>
          <div class="flex -space-x-2">
            <div v-for="agent in project?.agents?.slice(0, 3) || []" :key="agent.id" class="w-8 h-8 rounded-full bg-green-500 border-2 border-white"></div>
            <div v-if="(project?.agents?.length || 0) > 3" class="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs text-gray-600">
              +{{ (project?.agents?.length || 0) - 3 }}
            </div>
          </div>
        </div>
      </div>

      <!-- Project Description -->
      <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">Description</h3>
        <p class="text-gray-600 text-sm leading-relaxed">
          {{ project?.description || 'Complete redesign and revamp of the freelancer application UI/UX. This project involves creating a modern, user-friendly interface that improves the overall user experience and engagement.' }}
        </p>
      </div>

      <!-- Requirements -->
      <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">Requirements</h3>
        <div class="space-y-2">
          <div v-for="(req, index) in project?.requirements || defaultRequirements" :key="index" class="flex items-start gap-2">
            <div class="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <p class="text-sm text-gray-600">{{ req }}</p>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">Timeline</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-sm text-gray-600">Started</span>
            </div>
            <span class="text-sm text-gray-500">{{ project?.startDate || '8/1/2025' }}</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span class="text-sm text-gray-600">In Progress</span>
            </div>
            <span class="text-sm text-gray-500">{{ project?.currentDate || '8/4/2025' }}</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
              <span class="text-sm text-gray-600">Deadline</span>
            </div>
            <span class="text-sm text-gray-500">{{ project?.deadline || '8/9/2025' }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-3">
        <button class="w-full bg-green-500 text-white font-medium py-3 rounded-xl hover:bg-green-600 transition-colors duration-200">
          Message Team
        </button>
        <button class="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
          View Files
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const project = ref<any>(null)

const defaultRequirements = [
  'Modern, clean UI design',
  'Improved user experience',
  'Mobile-responsive layout',
  'Performance optimization',
  'Accessibility compliance'
]

onMounted(() => {
  // Get project data from localStorage
  try {
    const projectData = localStorage.getItem('selectedProject')
    if (projectData) {
      project.value = JSON.parse(projectData)
    }
  } catch (e) {
    // ignore
  }
})
</script>

<style scoped>
/* No custom styles needed - using Tailwind classes */
</style>

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

      <!-- Projects Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 pb-32">
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
              <div 
                v-for="agent in (project.agents || []).slice(0, 3)" 
                :key="agent.id" 
                @click.stop="goToAgentProfile(agent)"
                class="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center text-xs text-white font-semibold cursor-pointer hover:bg-teal-600 hover:scale-110 transition-all duration-200"
                :title="`View ${agent.name}'s profile`"
              >
                {{ agent.name.charAt(0) }}
              </div>
              <div 
                v-if="project.agents && project.agents.length > 3" 
                @click.stop="goToAgentProfile(project.agents[3])"
                class="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs text-gray-600 font-semibold cursor-pointer hover:bg-gray-400 hover:scale-110 transition-all duration-200"
                :title="`View more agents`"
              >
                +{{ project.agents.length - 3 }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Agent Names Section -->
        <div v-if="project.agents && project.agents.length > 0" class="mt-3 pt-3 border-t border-gray-100">
          <p class="text-xs text-gray-500 mb-2">Assigned Agents:</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="agent in project.agents"
              :key="`name-${agent.id}`"
              @click.stop="goToAgentProfile(agent)"
              class="inline-flex items-center px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 hover:text-teal-800 text-xs sm:text-sm font-medium rounded-full cursor-pointer transition-colors duration-200 border border-teal-200 hover:border-teal-300"
              :title="`View ${agent.name}'s profile`"
            >
              <span class="w-2 h-2 bg-teal-500 rounded-full mr-1.5"></span>
              {{ agent.name }}
            </span>
          </div>
        </div>
      </div>

        <div v-if="activeTab === 'active' && activeProjects.length === 0" class="md:col-span-2 lg:col-span-3">
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

        <div v-if="activeTab === 'pending'" class="md:col-span-2 lg:col-span-3">
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref<'active' | 'pending'>('pending')

const activeProjects = ref([
  {
    id: 1,
    title: 'Complete Freelancer Application UI/UX Revamp',
    client: 'Jenny Wilson (jennyson)',
    budget: '2,500',
    assignedTime: 'Assigned 8 hours ago',
    timeLeft: '5 Hours',
    agents: [
      { id: 1, name: 'Jenny Wilson' },
      { id: 2, name: 'Sarah Johnson' },
      { id: 3, name: 'Mike Chen' },
      { id: 4, name: 'Emily Davis' }
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
      { id: 1, name: 'Alex Rodriguez' },
      { id: 2, name: 'Lisa Thompson' }
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

const goToAgentProfile = (agent: any) => {
  try {
    localStorage.setItem('selectedAgent', JSON.stringify(agent))
  } catch (e) {
  }
  
  router.push(`/client/agent/${agent.id}`)
}

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

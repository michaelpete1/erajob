<template>
  <div class="min-h-screen bg-gray-50 pb-16 sm:pb-20">
    <!-- Top Navbar -->
    <nav class="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <!-- Left Section -->
        <div class="flex items-center gap-3 sm:gap-4">
          <button @click="$router.back()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Back">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
              <span class="text-white font-semibold text-sm sm:text-base">C</span>
            </div>
            <div>
              <h1 class="text-lg sm:text-xl font-bold text-gray-800">Work Log</h1>
              <p class="text-xs sm:text-sm text-gray-500">{{ projectName }}</p>
            </div>
          </div>
        </div>

        <!-- Right Section -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Filter -->
          <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Filter">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
          
          <!-- Export -->
          <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Export">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          
          <!-- User Profile -->
          <button class="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors" title="Profile">
            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
              <span class="text-white font-semibold text-sm sm:text-base">C</span>
            </div>
          </button>
        </div>
      </div>
    </nav>

    <!-- View Toggle -->
    <div class="px-4 sm:px-6 py-4 sm:py-6">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-1 flex">
          <button 
            @click="currentView = 'Daily'" 
            :class="{ 'bg-teal-500 text-white shadow-sm': currentView === 'Daily' }"
            class="flex-1 py-3 px-4 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 hover:bg-gray-50"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4M8 7h8M8 7l-4 9h16l-4-9" />
            </svg>
            Daily View
          </button>
          <button 
            @click="currentView = 'Weekly'" 
            :class="{ 'bg-teal-500 text-white shadow-sm': currentView === 'Weekly' }"
            class="flex-1 py-3 px-4 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 hover:bg-gray-50"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Weekly View
          </button>
        </div>
      </div>
    </div>

    <!-- Work Logs -->
    <div class="px-4 sm:px-6 pb-6">
      <div class="max-w-4xl mx-auto space-y-3 sm:space-y-4">
        <!-- Summary Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs sm:text-sm text-gray-500 font-medium">Total Hours</p>
                <p class="text-xl sm:text-2xl font-bold text-gray-800">127.5</p>
              </div>
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs sm:text-sm text-gray-500 font-medium">Tasks Completed</p>
                <p class="text-xl sm:text-2xl font-bold text-gray-800">24</p>
              </div>
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs sm:text-sm text-gray-500 font-medium">This Week</p>
                <p class="text-xl sm:text-2xl font-bold text-gray-800">18.5h</p>
              </div>
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Work Log Entries -->
        <div class="space-y-3">
          <div
            v-for="log in workLogs"
            :key="log.id"
            @click="goToLogDetail(log)"
            class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md hover:border-teal-300 transition-all duration-300 cursor-pointer group"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                    <span class="text-white font-semibold text-sm">{{ log.initials }}</span>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-sm sm:text-base font-semibold text-gray-800">{{ log.agentName }}</h3>
                    <p class="text-xs sm:text-sm text-gray-500">{{ log.date }} {{ log.time }}</p>
                  </div>
                </div>
                
                <div class="ml-12 sm:ml-14">
                  <p class="text-sm sm:text-base text-gray-700 mb-2">{{ log.task }}</p>
                  
                  <div class="flex items-center gap-4 text-xs sm:text-sm">
                    <div class="flex items-center gap-1 text-gray-500">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{{ log.hours }} hours</span>
                    </div>
                    
                    <div class="flex items-center gap-1 text-gray-500">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span>{{ log.category }}</span>
                    </div>
                    
                    <span :class="[
                      'px-2 py-1 rounded-full text-xs font-medium',
                      log.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                      log.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    ]">
                      {{ log.status }}
                    </span>
                  </div>
                </div>
              </div>
              
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-teal-500 transition-colors duration-300 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentView = ref('Daily')
const projectName = ref('Mobile App Development')

const workLogs = ref([
  { 
    id: 1, 
    date: 'April 7, 2025', 
    time: 'at 09:00 AM', 
    task: 'Home screen UI/UX design completed with responsive layout', 
    agentName: 'Sarah Johnson',
    initials: 'SJ',
    hours: 4.5,
    category: 'Design',
    status: 'Completed'
  },
  { 
    id: 2, 
    date: 'April 6, 2025', 
    time: 'at 02:30 PM', 
    task: 'Sign up and Login Screen implementation finished ahead of schedule', 
    agentName: 'Mike Chen',
    initials: 'MC',
    hours: 6.0,
    category: 'Development',
    status: 'Completed'
  },
  { 
    id: 3, 
    date: 'April 8, 2025', 
    time: 'at 11:00 AM', 
    task: 'Home screen UI/UX done with modern design patterns', 
    agentName: 'Sarah Johnson',
    initials: 'SJ',
    hours: 3.5,
    category: 'Design',
    status: 'Completed'
  },
  { 
    id: 4, 
    date: 'April 5, 2025', 
    time: 'at 10:15 AM', 
    task: 'Finished the Sign up and Login Screen early with authentication', 
    agentName: 'Mike Chen',
    initials: 'MC',
    hours: 5.5,
    category: 'Development',
    status: 'Completed'
  },
  { 
    id: 5, 
    date: 'April 4, 2025', 
    time: 'at 03:00 PM', 
    task: 'Home screen UI/UX design with user research insights', 
    agentName: 'Sarah Johnson',
    initials: 'SJ',
    hours: 4.0,
    category: 'Design',
    status: 'Completed'
  },
  { 
    id: 6, 
    date: 'April 3, 2025', 
    time: 'at 09:00 AM', 
    task: 'Finished the Sign up and Login Screen early with security features', 
    agentName: 'Mike Chen',
    initials: 'MC',
    hours: 7.0,
    category: 'Development',
    status: 'Completed'
  },
  { 
    id: 7, 
    date: 'April 2, 2025', 
    time: 'at 01:00 PM', 
    task: 'Home screen UI/UX wireframes and prototyping', 
    agentName: 'Sarah Johnson',
    initials: 'SJ',
    hours: 3.0,
    category: 'Design',
    status: 'Completed'
  },
  { 
    id: 8, 
    date: 'April 1, 2025', 
    time: 'at 10:30 AM', 
    task: 'Project setup and initial architecture planning', 
    agentName: 'Mike Chen',
    initials: 'MC',
    hours: 2.5,
    category: 'Planning',
    status: 'Completed'
  }
])

// Load project data from localStorage when component mounts
onMounted(() => {
  try {
    const selectedProject = localStorage.getItem('selectedProject')
    if (selectedProject) {
      const project = JSON.parse(selectedProject)
      projectName.value = project.title || 'Project Work Log'
    }
  } catch (e) {
    console.error('Error loading project data:', e)
  }
})

const goToLogDetail = (log: any) => {
  // Navigate to log dashboard page
  console.log('Navigating to log dashboard for log:', log)
  router.push('/client/work-log-dashboard')
}
</script>

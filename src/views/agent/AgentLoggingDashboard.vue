<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeTab = ref<'daily'|'weekly'>('daily')

const logs = ref([
  { id: 1, date: '8/4/2025 at 07:43 AM', title: 'Home screen UI/UX done', comment: 'Home screen UI/UX done', hours: 8 },
  { id: 2, date: '8/4/2025 at 09:00 AM', title: 'Finished the Sign up and Login Screen early', comment: 'Finished the Sign up and Login Screen early', hours: 6 },
  { id: 3, date: '8/3/2025 at 02:30 PM', title: 'Client meeting and requirements gathering', comment: 'Discussed project scope and timeline', hours: 2 },
  { id: 4, date: '8/3/2025 at 10:15 AM', title: 'Database optimization', comment: 'Improved query performance by 40%', hours: 4 }
])

const totalHours = ref(40)

// Type definitions
interface DailyData {
  day: string
  hours: number
}

interface WeeklyData {
  week: string
  hours: number
}

type ChartData = DailyData | WeeklyData

// Chart data for different views
const dailyData = ref<DailyData[]>([
  { day: 'Mon', hours: 8 },
  { day: 'Tue', hours: 6 },
  { day: 'Wed', hours: 7 },
  { day: 'Thu', hours: 9 },
  { day: 'Fri', hours: 5 },
  { day: 'Sat', hours: 3 },
  { day: 'Sun', hours: 2 }
])

const weeklyData = ref<WeeklyData[]>([
  { week: 'W1', hours: 35 },
  { week: 'W2', hours: 42 },
  { week: 'W3', hours: 38 },
  { week: 'W4', hours: 40 }
])

const currentChartData = computed<ChartData[]>(() => {
  return activeTab.value === 'daily' ? dailyData.value : weeklyData.value
})

const maxHours = computed(() => {
  return Math.max(...currentChartData.value.map(item => item.hours))
})

// Helper function to get the label for chart items
const getChartItemLabel = (item: ChartData): string => {
  return 'day' in item ? item.day : item.week
}

const goToLog = (log: any) => {
  try {
    localStorage.setItem('selectedLog', JSON.stringify(log))
  } catch (e) {
    // ignore
  }
  router.push(`/agent/log-receipt/${log.id}`)
}
</script>

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
          <h1 class="text-lg sm:text-xl font-semibold text-gray-800">Log Dashboard</h1>
        </div>
        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-teal-500"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 sm:px-6 py-4 sm:py-6 max-w-7xl mx-auto">
      <!-- Stats Overview -->
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
          <h2 class="text-lg sm:text-xl font-bold text-gray-800">Logged Hours</h2>
          <div class="text-center sm:text-right">
            <div class="text-xs sm:text-sm text-gray-500">Total Hours</div>
            <div class="text-xl sm:text-2xl font-bold text-teal-500">{{ totalHours }} h</div>
          </div>
        </div>
        
        <!-- Tab Selector -->
        <div class="flex bg-gray-100 rounded-lg p-1 mb-4 sm:mb-6">
          <button 
            @click="activeTab = 'daily'" 
            :class="activeTab === 'daily' ? 'bg-white text-teal-500 shadow-sm' : 'text-gray-600 hover:text-gray-800'" 
            class="flex-1 py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all duration-200"
          >
            Daily
          </button>
          <button 
            @click="activeTab = 'weekly'" 
            :class="activeTab === 'weekly' ? 'bg-white text-teal-500 shadow-sm' : 'text-gray-600 hover:text-gray-800'" 
            class="flex-1 py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all duration-200"
          >
            Weekly
          </button>
        </div>

        <!-- Bar Chart -->
        <div class="bg-gray-50 rounded-xl p-3 sm:p-4">
          <div class="flex items-end justify-between h-32 sm:h-40 mb-2">
            <div 
              v-for="(item, index) in currentChartData" 
              :key="index"
              class="flex flex-col items-center flex-1 px-1"
            >
              <div 
                class="w-full max-w-[2rem] sm:max-w-[2.5rem] bg-teal-500 rounded-t-lg transition-all duration-300 hover:bg-teal-600"
                :style="{ height: `${(item.hours / maxHours) * 100}%` }"
              >
                <div class="text-[10px] sm:text-xs text-white font-semibold text-center pt-1">
                  {{ item.hours }}h
                </div>
              </div>
              <div class="text-[10px] sm:text-xs text-gray-600 mt-1 sm:mt-2 font-medium">
                {{ getChartItemLabel(item) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Logs -->
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
        <h3 class="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Recent Logs</h3>
        <div class="space-y-3">
          <div
            v-for="log in logs"
            :key="log.id"
            @click="goToLog(log)"
            class="bg-gray-50 rounded-xl p-3 sm:p-4 hover:bg-gray-100 transition-colors duration-200 cursor-pointer border border-gray-100"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
                  <div class="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0"></div>
                  <div class="text-xs text-gray-500 font-medium">{{ log.date }}</div>
                  <div class="px-2 py-1 bg-teal-100 text-teal-600 text-xs rounded-full font-semibold">
                    {{ log.hours }}h
                  </div>
                </div>
                <h4 class="font-semibold text-gray-800 mb-1 text-sm sm:text-base">{{ log.title }}</h4>
                <p class="text-xs sm:text-sm text-gray-600">{{ log.comment }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- View All Button -->
        <div class="mt-4 sm:mt-6 text-center">
          <button class="text-teal-500 font-semibold hover:text-teal-600 transition-colors duration-200 text-sm sm:text-base">
            View All Logs →
          </button>
        </div>
      </div>
    </div>
    
    <!-- Bottom Navbar -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 sm:px-4 py-2 sm:py-3 z-50">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-around items-center">
          <button class="flex flex-col items-center text-gray-400 hover:text-gray-600 transition-colors group">
            <span class="text-xl sm:text-2xl mb-1 group-hover:scale-110 transition-transform">📊</span>
            <span class="text-xs sm:text-sm font-medium">Dashboard</span>
          </button>
          <button class="flex flex-col items-center text-gray-400 hover:text-gray-600 transition-colors group">
            <span class="text-xl sm:text-2xl mb-1 group-hover:scale-110 transition-transform">📝</span>
            <span class="text-xs sm:text-sm font-medium">Logs</span>
          </button>
          <button class="flex flex-col items-center text-teal-500 hover:text-teal-600 transition-colors group">
            <span class="text-xl sm:text-2xl mb-1 group-hover:scale-110 transition-transform">➕</span>
            <span class="text-xs sm:text-sm font-medium">Add</span>
          </button>
          <button class="flex flex-col items-center text-gray-400 hover:text-gray-600 transition-colors group">
            <span class="text-xl sm:text-2xl mb-1 group-hover:scale-110 transition-transform">💬</span>
            <span class="text-xs sm:text-sm font-medium">Chat</span>
          </button>
          <button class="flex flex-col items-center text-gray-400 hover:text-gray-600 transition-colors group">
            <span class="text-xl sm:text-2xl mb-1 group-hover:scale-110 transition-transform">⚙️</span>
            <span class="text-xs sm:text-sm font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* No custom styles needed - using Tailwind classes */
</style>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeTab = ref<'daily'|'weekly'>('daily')

// Work logs data with proper typing
interface WorkLog {
  id: string
  title: string
  hours: number
  date: string
  comment: string
  projectId?: string
  gigId?: string
  status: 'draft' | 'submitted' | 'approved'
}

// Reactive data
const logs = ref<WorkLog[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const totalHours = ref(0)

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
const dailyData = ref<DailyData[]>([])
const weeklyData = ref<WeeklyData[]>([])

const currentChartData = computed<ChartData[]>(() => {
  return activeTab.value === 'daily' ? dailyData.value : weeklyData.value
})

// Load work logs and generate chart data
onMounted(async () => {
  loading.value = true
  error.value = null

  try {
    // Try to load from API first (in a real implementation)
    // For now, we'll simulate API call with localStorage fallback
    await loadWorkLogsFromAPI()

    if (logs.value.length === 0) {
      // Fallback to localStorage if API returns empty
      loadWorkLogsFromLocalStorage()
    }

    // Generate chart data from loaded logs
    generateChartData()
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
    console.error('Error loading work logs:', errorMessage)
    error.value = 'Failed to load work logs'

    // Fallback to localStorage on error
    loadWorkLogsFromLocalStorage()
    generateChartData()
  } finally {
    loading.value = false
  }
})

// Simulate API call for work logs (replace with real API call)
const loadWorkLogsFromAPI = async () => {
  // In a real implementation, this would call:
  // const result = await workLogsService.getMyWorkLogs()

  // For now, simulate successful API response
  const mockApiResponse = [
    {
      id: '1',
      title: 'Content Writing for TechCorp',
      hours: 8,
      date: '2024-01-15',
      comment: 'Completed blog post about React best practices',
      projectId: 'proj_1',
      gigId: 'gig_1',
      status: 'submitted' as const
    },
    {
      id: '2',
      title: 'UI Design for Mobile App',
      hours: 6,
      date: '2024-01-14',
      comment: 'Created wireframes and mockups for user dashboard',
      projectId: 'proj_2',
      gigId: 'gig_2',
      status: 'approved' as const
    }
  ]

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  logs.value = mockApiResponse
  console.log('Loaded work logs from API simulation')
}

// Fallback to localStorage
const loadWorkLogsFromLocalStorage = () => {
  try {
    const storedLogs = localStorage.getItem('workLogs')
    if (storedLogs) {
      logs.value = JSON.parse(storedLogs)
      console.log('Loaded work logs from localStorage')
    }
  } catch (e) {
    console.error('Error loading work logs from localStorage:', e)
  }
}

// Generate chart data from work logs
const generateChartData = () => {
  if (logs.value.length === 0) {
    // Default chart data if no logs
    dailyData.value = [
      { day: 'Mon', hours: 0 },
      { day: 'Tue', hours: 0 },
      { day: 'Wed', hours: 0 },
      { day: 'Thu', hours: 0 },
      { day: 'Fri', hours: 0 },
      { day: 'Sat', hours: 0 },
      { day: 'Sun', hours: 0 }
    ]

    weeklyData.value = [
      { week: 'W1', hours: 0 },
      { week: 'W2', hours: 0 },
      { week: 'W3', hours: 0 },
      { week: 'W4', hours: 0 }
    ]

    totalHours.value = 0
    return
  }

  // Calculate total hours
  totalHours.value = logs.value.reduce((total, log) => total + log.hours, 0)

  // Generate daily data (group by day of week)
  const dailyTotals: { [key: string]: number } = {}
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  logs.value.forEach(log => {
    const date = new Date(log.date)
    const dayName = dayNames[date.getDay()]
    dailyTotals[dayName] = (dailyTotals[dayName] || 0) + log.hours
  })

  dailyData.value = dayNames.map(day => ({
    day,
    hours: dailyTotals[day] || 0
  }))

  // Generate weekly data (group by week)
  const weeklyTotals: { [key: string]: number } = {}

  logs.value.forEach(log => {
    const date = new Date(log.date)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay()) // Start of week (Sunday)
    const weekKey = `W${Math.ceil((date.getDate() - date.getDay() + 1) / 7)}`

    weeklyTotals[weekKey] = (weeklyTotals[weekKey] || 0) + log.hours
  })

  // Generate 4 weeks of data
  weeklyData.value = []
  for (let i = 1; i <= 4; i++) {
    const weekKey = `W${i}`
    weeklyData.value.push({
      week: weekKey,
      hours: weeklyTotals[weekKey] || 0
    })
  }

  console.log('Generated chart data:', { dailyData: dailyData.value, weeklyData: weeklyData.value })
}

// Helper function to get bar height percentage (commented out as it's not used)
// const getBarHeight = (hours: number, maxHours: number) => {
//   if (maxHours === 0) return '0%'
//   return `${Math.max((hours / maxHours) * 100, 5)}%` // Minimum 5% height
// }

// Get max hours for scaling
const maxHours = computed(() => {
  const data = currentChartData.value
  if (data.length === 0) return 10
  return Math.max(...data.map(item => item.hours || 0), 10)
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
          <h2 class="text-lg sm:text-xl font-bold text-gray-800 break-words">Logged Hours</h2>
          <div class="text-center sm:text-right">
            <div class="text-xs sm:text-sm text-gray-500">Total Hours</div>
            <div class="text-xl sm:text-2xl font-bold text-teal-500 whitespace-nowrap">{{ totalHours }} h</div>
          </div>
        </div>
        
        <!-- Tab Selector -->
        <div class="flex bg-gray-100 rounded-lg p-1 mb-4 sm:mb-6">
          <button 
            @click="activeTab = 'daily'" 
            :class="activeTab === 'daily' ? 'bg-white text-teal-500 shadow-sm' : 'text-gray-600 hover:text-gray-800'" 
            class="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 min-h-[44px] touch-manipulation"
          >
            Daily
          </button>
          <button 
            @click="activeTab = 'weekly'" 
            :class="activeTab === 'weekly' ? 'bg-white text-teal-500 shadow-sm' : 'text-gray-600 hover:text-gray-800'" 
            class="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 min-h-[44px] touch-manipulation"
          >
            Weekly
          </button>
        </div>

        <!-- Bar Chart -->
        <div class="bg-gray-50 rounded-xl p-3 sm:p-4">
          <div class="flex items-end justify-between h-24 sm:h-32 md:h-40 mb-2">
            <div 
              v-for="(item, index) in currentChartData" 
              :key="index"
              class="flex flex-col items-center flex-1 px-0.5 sm:px-1"
            >
              <div 
                class="w-full max-w-[1.5rem] sm:max-w-[2rem] md:max-w-[2.5rem] bg-teal-500 rounded-t-lg transition-all duration-300 hover:bg-teal-600"
                :style="{ height: `${(item.hours / maxHours) * 100}%` }"
              >
                <div class="text-[8px] sm:text-[10px] md:text-xs text-white font-semibold text-center pt-0.5 sm:pt-1 break-words px-0.5">
                  {{ item.hours }}h
                </div>
              </div>
              <div class="text-[9px] sm:text-[10px] md:text-xs text-gray-600 mt-1 sm:mt-2 font-medium whitespace-nowrap">
                {{ getChartItemLabel(item) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Logs -->
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
        <h3 class="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 break-words">Recent Logs</h3>
        <div class="space-y-3">
          <div
            v-for="log in logs"
            :key="log.id"
            @click="goToLog(log)"
            class="bg-gray-50 rounded-xl p-3 sm:p-4 hover:bg-gray-100 transition-colors duration-200 cursor-pointer border border-gray-100"
          >
            <div class="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-0">
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
                  <div class="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0"></div>
                  <div class="text-xs text-gray-500 font-medium whitespace-nowrap">{{ log.date }}</div>
                  <div class="px-2 py-1 bg-teal-100 text-teal-600 text-xs rounded-full font-semibold whitespace-nowrap">
                    {{ log.hours }}h
                  </div>
                </div>
                <h4 class="font-semibold text-gray-800 mb-1 text-sm sm:text-base break-words">{{ log.title }}</h4>
                <p class="text-xs sm:text-sm text-gray-600 break-words leading-relaxed">{{ log.comment }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- View All Button -->
        <div class="mt-4 sm:mt-6 text-center">
          <button class="text-teal-500 font-semibold hover:text-teal-600 transition-colors duration-200 text-sm sm:text-base touch-manipulation min-h-[44px] inline-flex items-center justify-center px-4 py-2">
            View All Logs →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* No custom styles needed - using Tailwind classes */
</style>

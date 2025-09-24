<template>
  <div class="min-h-screen bg-gray-50 font-sans antialiased text-gray-800">
    <!-- Header -->
    <header class="bg-teal-500 text-white px-4 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between shadow-md sticky top-0 z-30 backdrop-blur-sm bg-opacity-95">
      <div class="flex items-center">
        <button @click="$router.back()" class="p-2 -ml-2 sm:p-2 sm:-ml-2 md:p-2.5 md:-ml-2.5 rounded-full hover:bg-white hover:bg-opacity-10 active:bg-opacity-20 transition-all duration-200 touch-manipulation" aria-label="Go back">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <h1 class="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight ml-1 sm:ml-2">Set Appointment</h1>
      </div>
      <button class="p-2 -mr-2 sm:p-2 sm:-mr-2 md:p-2.5 md:-mr-2.5 rounded-full hover:bg-white hover:bg-opacity-10 active:bg-opacity-20 transition-all duration-200 touch-manipulation" aria-label="More options">
        <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6h.01M12 12h.01M12 18h.01"></path>
        </svg>
      </button>
    </header>

    <main class="px-3 sm:px-4 md:px-6 py-4 sm:py-6 pb-24 sm:pb-28">
      <!-- Agent Info Card -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm mb-6 sm:mb-8 p-4 sm:p-6 border border-gray-100">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
            {{ agent.name.charAt(0) }}
          </div>
          <div>
            <h2 class="text-lg sm:text-xl font-bold text-gray-800">{{ agent.name }}</h2>
            <p class="text-sm sm:text-base text-gray-600">{{ agent.title }}</p>
          </div>
        </div>
      </div>

      <!-- Schedule Time Section -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm mb-6 sm:mb-8 p-4 sm:p-6 border border-gray-100">
        <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 sm:w-6 sm:h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Schedule Time
        </h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Date Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input 
              v-model="appointment.date" 
              type="date" 
              class="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
              :min="minDate"
            >
          </div>
          
          <!-- Time Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Time</label>
            <input 
              v-model="appointment.time" 
              type="time" 
              class="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
            >
          </div>
        </div>
      </div>

      <!-- Time Zone Section -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm mb-6 sm:mb-8 p-4 sm:p-6 border border-gray-100">
        <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 sm:w-6 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Time Zone
        </h3>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Select Time Zone</label>
          <select 
            v-model="appointment.timezone" 
            class="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="">Select a time zone</option>
            <option value="UTC-12:00">(UTC-12:00) Baker Island, Howland Island</option>
            <option value="UTC-11:00">(UTC-11:00) American Samoa, Niue</option>
            <option value="UTC-10:00">(UTC-10:00) Hawaii, Cook Islands</option>
            <option value="UTC-09:00">(UTC-09:00) Alaska</option>
            <option value="UTC-08:00">(UTC-08:00) Pacific Time (US & Canada)</option>
            <option value="UTC-07:00">(UTC-07:00) Mountain Time (US & Canada)</option>
            <option value="UTC-06:00">(UTC-06:00) Central Time (US & Canada)</option>
            <option value="UTC-05:00">(UTC-05:00) Eastern Time (US & Canada)</option>
            <option value="UTC-04:00">(UTC-04:00) Atlantic Time (Canada)</option>
            <option value="UTC-03:00">(UTC-03:00) Buenos Aires, Greenland</option>
            <option value="UTC-02:00">(UTC-02:00) Mid-Atlantic</option>
            <option value="UTC-01:00">(UTC-01:00) Azores, Cape Verde Islands</option>
            <option value="UTC+00:00">(UTC+00:00) London, Dublin, Lisbon</option>
            <option value="UTC+01:00">(UTC+01:00) Berlin, Paris, Rome</option>
            <option value="UTC+02:00">(UTC+02:00) Cairo, Johannesburg, Kiev</option>
            <option value="UTC+03:00">(UTC+03:00) Moscow, Istanbul, Riyadh</option>
            <option value="UTC+04:00">(UTC+04:00) Dubai, Baku, Tbilisi</option>
            <option value="UTC+05:00">(UTC+05:00) Karachi, Tashkent, Maldives</option>
            <option value="UTC+05:30">(UTC+05:30) India, Sri Lanka</option>
            <option value="UTC+06:00">(UTC+06:00) Dhaka, Almaty, Omsk</option>
            <option value="UTC+07:00">(UTC+07:00) Bangkok, Jakarta, Hanoi</option>
            <option value="UTC+08:00">(UTC+08:00) Beijing, Hong Kong, Singapore</option>
            <option value="UTC+09:00">(UTC+09:00) Tokyo, Seoul, Pyongyang</option>
            <option value="UTC+10:00">(UTC+10:00) Sydney, Melbourne, Brisbane</option>
            <option value="UTC+11:00">(UTC+11:00) Solomon Islands, New Caledonia</option>
            <option value="UTC+12:00">(UTC+12:00) Auckland, Fiji, Marshall Islands</option>
          </select>
        </div>
      </div>

      <!-- Calendar Section -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm mb-6 sm:mb-8 p-4 sm:p-6 border border-gray-100">
        <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 sm:w-6 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          Calendar
        </h3>
        
        <div class="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg sm:rounded-xl p-4 sm:p-5">
          <!-- Calendar Header -->
          <div class="flex items-center justify-between mb-4">
            <button @click="previousMonth" class="p-2 rounded-lg hover:bg-white hover:bg-opacity-50 transition-colors">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h4 class="text-lg font-semibold text-gray-800">{{ currentMonthName }} {{ currentYear }}</h4>
            <button @click="nextMonth" class="p-2 rounded-lg hover:bg-white hover:bg-opacity-50 transition-colors">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
          
          <!-- Calendar Grid -->
          <div class="grid grid-cols-7 gap-1 text-center">
            <!-- Day Headers -->
            <div class="text-xs font-semibold text-gray-500 py-2">Sun</div>
            <div class="text-xs font-semibold text-gray-500 py-2">Mon</div>
            <div class="text-xs font-semibold text-gray-500 py-2">Tue</div>
            <div class="text-xs font-semibold text-gray-500 py-2">Wed</div>
            <div class="text-xs font-semibold text-gray-500 py-2">Thu</div>
            <div class="text-xs font-semibold text-gray-500 py-2">Fri</div>
            <div class="text-xs font-semibold text-gray-500 py-2">Sat</div>
            
            <!-- Calendar Days -->
            <div 
              v-for="day in calendarDays" 
              :key="day.date"
              @click="selectCalendarDate(day)"
              class="p-2 text-sm cursor-pointer rounded-lg transition-colors"
              :class="{
                'text-gray-400': !day.isCurrentMonth,
                'bg-teal-100 text-teal-800': isCalendarDateSelected(day),
                'hover:bg-purple-100': day.isCurrentMonth && !isCalendarDateSelected(day),
                'text-gray-800': day.isCurrentMonth && !isCalendarDateSelected(day)
              }"
            >
              {{ day.day }}
            </div>
          </div>
        </div>
      </div>

      <!-- Set Appointment Button -->
      <div class="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-xl border-t border-gray-200 backdrop-blur-lg bg-opacity-95">
        <div class="p-3 sm:p-4 md:p-5 lg:p-6 max-w-7xl mx-auto">
          <button 
            @click="setAppointment"
            :disabled="!isFormValid"
            class="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold text-sm sm:text-base py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            Set Appointment
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Agent data
const agent = ref({
  id: '',
  name: '',
  title: ''
})

// Appointment data
const appointment = ref({
  date: '',
  time: '',
  timezone: ''
})

// Calendar state
const currentDate = ref(new Date())
const selectedCalendarDate = ref(null)

// Computed properties
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const isFormValid = computed(() => {
  return appointment.value.date && appointment.value.time && appointment.value.timezone
})

const currentMonthName = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long' })
})

const currentYear = computed(() => {
  return currentDate.value.getFullYear()
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // First day of month
  const firstDay = new Date(year, month, 1)
  // Last day of month
  const lastDay = new Date(year, month + 1, 0)
  // Start from Sunday
  const startDay = firstDay.getDay()
  
  const days = []
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startDay; i++) {
    const prevDate = new Date(year, month, -startDay + i + 1)
    days.push({
      day: prevDate.getDate(),
      date: prevDate.toISOString().split('T')[0],
      isCurrentMonth: false
    })
  }
  
  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    days.push({
      day: i,
      date: date.toISOString().split('T')[0],
      isCurrentMonth: true
    })
  }
  
  return days
})

// Methods
const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const selectCalendarDate = (day) => {
  if (day.isCurrentMonth) {
    selectedCalendarDate.value = day.date
    appointment.value.date = day.date
  }
}

const isCalendarDateSelected = (day) => {
  return selectedCalendarDate.value === day.date
}

const setAppointment = () => {
  if (!isFormValid.value) return
  
  const appointmentData = {
    agentId: agent.value.id,
    agentName: agent.value.name,
    agentTitle: agent.value.title,
    date: appointment.value.date,
    time: appointment.value.time,
    timezone: appointment.value.timezone,
    createdAt: new Date().toISOString()
  }
  
  // Save to localStorage
  try {
    const existingAppointments = JSON.parse(localStorage.getItem('savedAppointments') || '[]')
    existingAppointments.push(appointmentData)
    localStorage.setItem('savedAppointments', JSON.stringify(existingAppointments))
    
    // Show success message (you could use a toast notification here)
    alert('Appointment set successfully!')
    
    // Navigate back to agent profile
    router.push(`/client/agent/${agent.value.id}`)
  } catch (error) {
    console.error('Error saving appointment:', error)
    alert('Error saving appointment. Please try again.')
  }
}

// Load agent data
onMounted(() => {
  const agentId = route.params.id
  
  // Try to load agent data from localStorage (from previous navigation)
  try {
    const savedAgentData = localStorage.getItem('selectedAgent')
    if (savedAgentData) {
      const parsedAgentData = JSON.parse(savedAgentData)
      agent.value = {
        id: parsedAgentData.id || agentId,
        name: parsedAgentData.name || 'Unknown Agent',
        title: parsedAgentData.title || 'Unknown Title'
      }
    }
  } catch (error) {
    console.error('Error loading agent data:', error)
    // Fallback to basic data
    agent.value = {
      id: agentId,
      name: 'Unknown Agent',
      title: 'Unknown Title'
    }
  }
})
</script>

<style scoped>
/* No custom styles needed - using Tailwind classes */
</style>

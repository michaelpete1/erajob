<template>
  <div class="min-h-screen bg-gray-100 font-sans antialiased text-gray-800">
    
    <header class="bg-teal-500 text-white p-4 sm:p-6 flex items-center justify-between shadow-md">
      <div class="flex items-center">
        <svg
          @click="$router.back()"
          class="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4 text-white cursor-pointer hover:bg-teal-600 rounded-lg p-1 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        <h1 class="text-lg sm:text-xl font-semibold">Log Dashboard</h1>
      </div>
      <div class="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full"></div>
    </header>

    <main class="p-4 sm:p-6 max-w-6xl mx-auto space-y-4 sm:space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Logged Hours</h2>
        <div class="flex items-center gap-2 sm:gap-4">
          <span class="text-sm sm:text-base text-gray-600">Time Period:</span>
          <select class="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>
      
      <div class="bg-gray-200 rounded-lg flex text-center text-sm sm:text-base font-semibold p-1 w-full sm:w-auto">
        <button 
          @click="currentView = 'Daily'" 
          :class="{ 'bg-gray-800 text-white': currentView === 'Daily' }"
          class="flex-1 py-2 sm:py-3 rounded-lg transition-colors duration-300 hover:bg-gray-700"
        >
          Daily
        </button>
        <button 
          @click="currentView = 'Weekly'" 
          :class="{ 'bg-gray-800 text-white': currentView === 'Weekly' }"
          class="flex-1 py-2 sm:py-3 rounded-lg transition-colors duration-300 hover:bg-gray-700"
        >
          Weekly
        </button>
      </div>

      <!-- Chart Section -->
      <div class="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm">
        <div class="mb-4 sm:mb-6">
          <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Hours Worked Over Time</h3>
          <p class="text-sm sm:text-base text-gray-600">Track your team's productivity and work patterns</p>
        </div>
        
        <!-- Static Bar Chart -->
        <div class="w-full h-48 sm:h-64 lg:h-80 flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-4 pb-4 border-b-2 border-l-2 border-gray-300">
          <!-- Chart Bars -->
          <div class="flex flex-col items-center flex-1">
            <div class="w-full bg-teal-500 hover:bg-teal-600 transition-colors rounded-t-lg" style="height: 75%"></div>
            <span class="text-xs sm:text-sm text-gray-600 mt-2">Mon</span>
          </div>
          <div class="flex flex-col items-center flex-1">
            <div class="w-full bg-teal-500 hover:bg-teal-600 transition-colors rounded-t-lg" style="height: 90%"></div>
            <span class="text-xs sm:text-sm text-gray-600 mt-2">Tue</span>
          </div>
          <div class="flex flex-col items-center flex-1">
            <div class="w-full bg-teal-500 hover:bg-teal-600 transition-colors rounded-t-lg" style="height: 60%"></div>
            <span class="text-xs sm:text-sm text-gray-600 mt-2">Wed</span>
          </div>
          <div class="flex flex-col items-center flex-1">
            <div class="w-full bg-teal-500 hover:bg-teal-600 transition-colors rounded-t-lg" style="height: 85%"></div>
            <span class="text-xs sm:text-sm text-gray-600 mt-2">Thu</span>
          </div>
          <div class="flex flex-col items-center flex-1">
            <div class="w-full bg-teal-500 hover:bg-teal-600 transition-colors rounded-t-lg" style="height: 70%"></div>
            <span class="text-xs sm:text-sm text-gray-600 mt-2">Fri</span>
          </div>
          <div class="flex flex-col items-center flex-1">
            <div class="w-full bg-gray-300 hover:bg-gray-400 transition-colors rounded-t-lg" style="height: 40%"></div>
            <span class="text-xs sm:text-sm text-gray-600 mt-2">Sat</span>
          </div>
          <div class="flex flex-col items-center flex-1">
            <div class="w-full bg-gray-300 hover:bg-gray-400 transition-colors rounded-t-lg" style="height: 30%"></div>
            <span class="text-xs sm:text-sm text-gray-600 mt-2">Sun</span>
          </div>
        </div>
        
        <!-- Chart Legend -->
        <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 sm:mt-6">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-teal-500 rounded"></div>
            <span class="text-xs sm:text-sm text-gray-700">Work Hours</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-gray-300 rounded"></div>
            <span class="text-xs sm:text-sm text-gray-700">Weekend</span>
          </div>
        </div>
      </div>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div class="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs sm:text-sm text-gray-500 font-medium">Total Hours</p>
              <p class="text-xl sm:text-2xl font-bold text-gray-800">40 h</p>
            </div>
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs sm:text-sm text-gray-500 font-medium">This Week</p>
              <p class="text-xl sm:text-2xl font-bold text-gray-800">32 h</p>
            </div>
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs sm:text-sm text-gray-500 font-medium">Avg Daily</p>
              <p class="text-xl sm:text-2xl font-bold text-gray-800">8 h</p>
            </div>
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
        
      </div>
      
    </main>
    
  </div>
</template>

<script setup>
import { ref } from 'vue';

const currentView = ref('Daily');
</script>

<style scoped>
/* Any custom styles for this component can be added here, though Tailwind should cover most needs. */
</style>

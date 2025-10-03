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
        <h1 class="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight ml-1 sm:ml-2">Agent Profile</h1>
      </div>
      <button class="p-2 -mr-2 sm:p-2 sm:-mr-2 md:p-2.5 md:-mr-2.5 rounded-full hover:bg-white hover:bg-opacity-10 active:bg-opacity-20 transition-all duration-200 touch-manipulation" aria-label="More options">
        <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6h.01M12 12h.01M12 18h.01"></path>
        </svg>
      </button>
    </header>

    <main class="px-3 sm:px-4 md:px-6 py-4 sm:py-6 pb-24 sm:pb-28">
      <!-- Profile Header -->
      <div class="flex flex-col items-center py-6 sm:py-8 md:py-10 lg:py-12 bg-white rounded-lg sm:rounded-xl shadow-sm mb-6 sm:mb-8 relative overflow-hidden">
        <!-- Decorative background element -->
        <div class="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-teal-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
        
        <div class="relative z-10 flex flex-col items-center w-full px-4">
          <!-- Avatar with enhanced responsive sizing -->
          <div class="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full mb-4 sm:mb-5 md:mb-6 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl shadow-lg ring-4 ring-white ring-offset-2 ring-offset-teal-50 transform hover:scale-105 transition-transform duration-300">
            {{ agent.name.charAt(0) }}
          </div>
          
          <!-- Name and title with enhanced typography -->
          <div class="text-center mb-4 sm:mb-5 md:mb-6">
            <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 tracking-tight leading-tight">{{ agent.name }}</h2>
            <p class="text-sm sm:text-base md:text-lg text-gray-600 mt-1 sm:mt-2 font-medium">{{ agent.title }}</p>
          </div>
          
          <!-- Stats and info with improved responsive layout -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full max-w-md">
            <!-- Rating -->
            <div class="flex items-center justify-center sm:justify-start gap-1 sm:gap-1.5 bg-gray-50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full">
              <div class="flex items-center">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="font-semibold text-sm sm:text-base text-gray-800">{{ agent.rating }}</span>
              </div>
            </div>
            
            <!-- Location -->
            <div class="flex items-center justify-center sm:justify-start gap-1 sm:gap-1.5 bg-gray-50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full">
              <span class="text-lg sm:text-xl">🇮🇳</span>
              <span class="text-sm sm:text-base text-gray-700 font-medium">{{ agent.location }}</span>
            </div>
            
            <!-- Completion Rate -->
            <div class="flex items-center justify-center sm:justify-start gap-1 sm:gap-1.5 bg-green-50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="font-semibold text-sm sm:text-base text-green-700">{{ agent.completionRate }}%</span>
            </div>
          </div>
          
          <!-- Loom Video Link -->
          <a :href="agent.loomVideo" class="mt-4 sm:mt-5 md:mt-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base transition-colors duration-200 hover:underline">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Watch Loom Video</span>
          </a>
        </div>
      </div>
      
      <!-- Availability -->
      <div class="bg-white p-5 sm:p-6 md:p-7 lg:p-8 rounded-lg sm:rounded-xl shadow-sm mb-6 sm:mb-8 border border-gray-100">
        <div class="flex items-center gap-3 mb-4 sm:mb-5">
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="font-semibold text-lg sm:text-xl md:text-2xl text-gray-800">Availability</h3>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <!-- Work Type Card -->
          <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-blue-200">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs sm:text-sm font-medium text-blue-600 uppercase tracking-wide">Work Type</span>
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p class="text-lg sm:text-xl font-bold text-gray-800 mb-1">{{ agent.availability.type }}</p>
            <p class="text-sm sm:text-base text-gray-600">Preferred work arrangement</p>
          </div>
          
          <!-- Hours Card -->
          <div class="bg-gradient-to-r from-purple-50 to-purple-100 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-purple-200">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs sm:text-sm font-medium text-purple-600 uppercase tracking-wide">Weekly Hours</span>
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-lg sm:text-xl font-bold text-gray-800 mb-1">{{ agent.availability.hours }} hrs</p>
            <p class="text-sm sm:text-base text-gray-600">Available per week</p>
          </div>
        </div>
        
        <!-- Status Indicator -->
        <div class="mt-4 sm:mt-6 bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-4 sm:p-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="relative">
                <div class="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full animate-pulse"></div>
                <div class="absolute inset-0 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <div>
                <p class="font-semibold text-green-800 text-sm sm:text-base">Currently Available</p>
                <p class="text-xs sm:text-sm text-green-600">Ready to start new projects</p>
              </div>
            </div>
            <div class="text-right">
              <span class="inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
                {{ agent.availability.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Communication -->
      <div class="bg-white p-5 sm:p-6 md:p-7 lg:p-8 rounded-lg sm:rounded-xl shadow-sm mb-6 sm:mb-8 border border-gray-100">
        <div class="flex items-center gap-3 mb-4 sm:mb-5">
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 class="font-semibold text-lg sm:text-xl md:text-2xl text-gray-800">Communication</h3>
        </div>
        
        <div class="space-y-3 sm:space-y-4">
          <!-- Email Card -->
          <a :href="`mailto:${agent.email}`" class="group block p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg sm:rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            <div class="flex items-center gap-3 sm:gap-4">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs sm:text-sm font-medium text-blue-600 uppercase tracking-wide mb-1">Email Address</p>
                <p class="text-sm sm:text-base md:text-lg font-semibold text-gray-800 truncate group-hover:text-blue-700 transition-colors">{{ agent.email }}</p>
                <p class="text-xs sm:text-sm text-gray-600 mt-1">Click to send email</p>
              </div>
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
          
          <!-- Phone Card -->
          <a :href="`tel:${agent.phone}`" class="group block p-4 sm:p-5 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg sm:rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            <div class="flex items-center gap-3 sm:gap-4">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.684l1.45 3.391a1 1 0 01-.152 1.09L9.4 12.87l-.95.95a1 1 0 01-1.09.152l-3.39-1.45a1 1 0 01-.685-.95V5z"></path>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs sm:text-sm font-medium text-green-600 uppercase tracking-wide mb-1">Phone Number</p>
                <p class="text-sm sm:text-base md:text-lg font-semibold text-gray-800 truncate group-hover:text-green-700 transition-colors">{{ agent.phone }}</p>
                <p class="text-xs sm:text-sm text-gray-600 mt-1">Click to make call</p>
              </div>
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        </div>
        
        <!-- Quick Actions -->
        <div class="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
          <p class="text-xs sm:text-sm font-medium text-gray-600 mb-3 sm:mb-4">Quick Actions</p>
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button @click="sendMessage" class="flex-1 inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm sm:text-base font-medium rounded-lg sm:rounded-xl transition-colors duration-200">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Send Proposal</span>
            </button>
            <button class="flex-1 inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm sm:text-base font-medium rounded-lg sm:rounded-xl transition-colors duration-200">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Add Contact</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Skills -->
      <div class="bg-white p-5 sm:p-6 md:p-7 lg:p-8 rounded-lg sm:rounded-xl shadow-sm mb-6 sm:mb-8 border border-gray-100">
        <div class="flex items-center gap-3 mb-4 sm:mb-5">
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 class="font-semibold text-lg sm:text-xl md:text-2xl text-gray-800">Skills & Expertise</h3>
        </div>
        
        <div class="flex flex-wrap gap-2 sm:gap-3">
          <span v-for="(skill, index) in agent.skills" :key="skill" 
                class="group inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 text-purple-700 text-xs sm:text-sm font-medium rounded-full hover:from-purple-100 hover:to-purple-200 hover:border-purple-300 hover:shadow-sm transition-all duration-200 hover:scale-105 cursor-default">
            <span class="relative flex items-center">
              {{ skill }}
              <span class="ml-1.5 text-purple-400 group-hover:text-purple-600 transition-colors">•</span>
              <span class="ml-0.5 text-xs text-purple-500 font-semibold">{{ index + 1 }}</span>
            </span>
          </span>
        </div>
        
        <!-- Skill Categories -->
        <div class="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
          <p class="text-xs sm:text-sm font-medium text-gray-600 mb-3 sm:mb-4">Skill Categories</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <h4 class="font-semibold text-blue-800 text-sm sm:text-base mb-2">Design Tools</h4>
              <div class="flex flex-wrap gap-1.5 sm:gap-2">
                <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md">Figma</span>
                <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md">Adobe CS</span>
              </div>
            </div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
              <h4 class="font-semibold text-green-800 text-sm sm:text-base mb-2">UX Research</h4>
              <div class="flex flex-wrap gap-1.5 sm:gap-2">
                <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md">User Research</span>
                <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md">Wireframing</span>
              </div>
            </div>
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
              <h4 class="font-semibold text-orange-800 text-sm sm:text-base mb-2">Prototyping</h4>
              <div class="flex flex-wrap gap-1.5 sm:gap-2">
                <span class="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-md">Prototyping</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Experience -->
      <div class="bg-white p-5 sm:p-6 md:p-7 lg:p-8 rounded-lg sm:rounded-xl shadow-sm mb-6 sm:mb-8 border border-gray-100">
        <div class="flex items-center gap-3 mb-4 sm:mb-5">
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="font-semibold text-lg sm:text-xl md:text-2xl text-gray-800">Professional Experience</h3>
        </div>
        
        <div class="space-y-4 sm:space-y-6">
          <div v-for="(exp, index) in agent.experience" :key="exp.company" 
               class="group relative bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
            <!-- Timeline connector -->
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-indigo-600 rounded-l-lg sm:rounded-l-xl"></div>
            
            <!-- Content -->
            <div class="relative pl-4 sm:pl-6">
              <!-- Year badge -->
              <div class="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {{ exp.duration.split(' - ')[0] }}
              </div>
              
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                <div class="flex-1">
                  <h4 class="font-bold text-gray-800 text-base sm:text-lg md:text-xl mb-1 group-hover:text-indigo-700 transition-colors">{{ exp.position }}</h4>
                  <p class="text-sm sm:text-base text-gray-600 font-medium mb-2">{{ exp.company }}</p>
                  <div class="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ exp.duration }}</span>
                  </div>
                </div>
                
                <!-- Experience level indicator -->
                <div class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                  <div class="flex">
                    <div v-for="i in 3" :key="i" class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full mx-0.5" :class="i <= (3 - index) ? 'bg-green-500' : 'bg-gray-300'"></div>
                  </div>
                  <span class="text-xs font-medium text-gray-600">Level {{ 3 - index }}</span>
                </div>
              </div>
              
              <!-- Key responsibilities placeholder -->
              <div class="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                <p class="text-xs sm:text-sm text-gray-600 italic">Key responsibilities and achievements would be displayed here...</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Total Experience Summary -->
        <div class="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
          <div class="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4 sm:p-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm sm:text-base font-semibold text-indigo-800">Total Experience</p>
                <p class="text-xs sm:text-sm text-indigo-600">Combined professional background</p>
              </div>
              <div class="text-right">
                <p class="text-2xl sm:text-3xl font-bold text-indigo-700">6+</p>
                <p class="text-xs sm:text-sm text-indigo-600">Years</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Send a meet-and-greet -->
      <div class="bg-white p-5 sm:p-6 md:p-7 lg:p-8 rounded-lg sm:rounded-xl shadow-sm mb-20 sm:mb-24 border border-gray-100">
        <div class="flex items-center gap-3 mb-4 sm:mb-5">
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-pink-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="font-semibold text-lg sm:text-xl md:text-2xl text-gray-800">Schedule Meet & Greet</h3>
        </div>
        
        <!-- Calendar Container -->
        <div @click="goToSetAppointment" class="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden">
          <!-- Click hint overlay -->
          <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-5 transition-all duration-300 rounded-lg sm:rounded-xl"></div>
          
          <!-- Click hint badge -->
          <div class="absolute top-2 right-2 bg-teal-500 text-white text-xs px-2 py-1 rounded-full font-medium opacity-90">
            Click to Schedule
          </div>
          <!-- Calendar Header -->
          <div class="flex items-center justify-between mb-4 sm:mb-5">
            <button class="p-2 sm:p-2.5 rounded-lg hover:bg-white hover:bg-opacity-50 transition-colors active:scale-95">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            
            <div class="text-center">
              <h4 class="font-bold text-lg sm:text-xl md:text-2xl text-gray-800">{{ currentMonth }}</h4>
              <p class="text-xs sm:text-sm text-gray-600 mt-1">Select available date</p>
            </div>
            
            <button class="p-2 sm:p-2.5 rounded-lg hover:bg-white hover:bg-opacity-50 transition-colors active:scale-95">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
          
          <!-- Calendar Grid -->
          <div class="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
            <!-- Weekday Headers -->
            <div class="grid grid-cols-7 gap-1 mb-2 sm:mb-3">
              <div v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day" 
                   class="text-center py-2">
                <span class="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">{{ day }}</span>
              </div>
            </div>
            
            <!-- Calendar Days -->
            <div class="grid grid-cols-7 gap-1">
              <button v-for="day in calendarDays" :key="day" 
                      @click="selectDate(day)"
                      class="group relative aspect-square flex items-center justify-center rounded-lg sm:rounded-xl transition-all duration-200 text-sm sm:text-base font-medium
                             hover:shadow-md active:scale-95 touch-manipulation"
                      :class="{
                        'bg-teal-500 text-white hover:bg-teal-600': isToday(day),
                        'bg-gray-100 text-gray-400 cursor-not-allowed': isPastDate(day),
                        'bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-600 border border-gray-200': !isToday(day) && !isPastDate(day),
                        'ring-2 ring-pink-400 ring-offset-2': isSelected(day)
                      }">
                <span class="relative z-10">{{ day }}</span>
                
                <!-- Available indicator -->
                <div v-if="!isPastDate(day) && hasAvailability(day)" 
                     class="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"></div>
                
                <!-- Today indicator -->
                <div v-if="isToday(day)" 
                     class="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 opacity-10"></div>
              </button>
            </div>
          </div>
          
          <!-- Selected Date Info -->
          <div v-if="selectedDate" class="mt-4 sm:mt-5 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-pink-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm sm:text-base font-semibold text-gray-800">Selected Date</p>
                <p class="text-xs sm:text-sm text-gray-600">{{ formatDate(selectedDate) }}</p>
              </div>
              <div class="text-right">
                <span class="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <div class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
                  Available
                </span>
              </div>
            </div>
          </div>
          
          <!-- Time Slots -->
          <div class="mt-4 sm:mt-5">
            <p class="text-sm sm:text-base font-semibold text-gray-800 mb-3 sm:mb-4">Available Time Slots</p>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
              <button v-for="time in availableTimes" :key="time" 
                      class="px-3 py-2 sm:px-4 sm:py-2.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-pink-50 hover:border-pink-300 hover:text-pink-600 transition-colors active:scale-95">
                {{ time }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Fixed Bottom Button -->
      <div class="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-xl border-t border-gray-200 backdrop-blur-lg bg-opacity-95">
        <div class="p-3 sm:p-4 md:p-5 lg:p-6 max-w-7xl mx-auto">
          <button @click="sendMeetAndGreetRequest" 
                  class="group w-full py-3.5 sm:py-4 md:py-4.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-sm sm:text-base md:text-lg rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden">
            
            <!-- Button background animation -->
            <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <!-- Button content -->
            <div class="relative flex items-center justify-center gap-2 sm:gap-3">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="tracking-tight">Send Meet & Greet Request</span>
              <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            
            <!-- Status indicator -->
            <div v-if="selectedDate" class="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
              Ready
            </div>
          </button>
          
          <!-- Safety margin for mobile devices with home indicators -->
          <div class="h-2 sm:h-0 bg-transparent"></div>
        </div>
      </div>
      
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Agent data
const agent = ref({
  name: 'Jenny Wilson',
  title: 'UI/UX Designer',
  rating: 5.0,
  location: 'Lucknow, India',
  completionRate: 100,
  loomVideo: '#',
  email: 'ellamicheal@gmail.com',
  phone: '+1-324-5334-423',
  availability: {
    type: 'Full-Time',
    hours: 160,
    status: 'Available'
  },
  skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research', 'Wireframing'],
  experience: [
    {
      position: 'Senior UI/UX Designer',
      company: 'Design Studio Pro',
      duration: '2021 - Present'
    },
    {
      position: 'UI/UX Designer',
      company: 'Creative Solutions',
      duration: '2019 - 2021'
    },
    {
      position: 'Junior Designer',
      company: 'Tech Innovations',
      duration: '2017 - 2019'
    }
  ]
})

// Calendar data
const currentMonth = ref('JANUARY 2023')
const calendarDays = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])
const selectedDate = ref(null)
const availableTimes = ref(['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'])

// Check if today is the selected day
const isToday = (day) => {
  return day === 15 // Example: highlight the 15th as today
}

// Check if date is in the past
const isPastDate = (day) => {
  return day < 15 // Example: dates before 15th are in the past
}

// Check if date is selected
const isSelected = (day) => {
  return selectedDate.value === day
}

// Check if date has availability
const hasAvailability = (day) => {
  // Example: most dates have availability except some random ones
  const unavailableDates = [3, 8, 17, 22, 28]
  return !unavailableDates.includes(day)
}

// Select date
const selectDate = (day) => {
  if (!isPastDate(day)) {
    selectedDate.value = day
  }
}

// Format date
const formatDate = (day) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return `${months[0]} ${day}, 2023` // Using January as example
}

// Navigate to chat with agent
const sendMessage = () => {
  const agentId = route.params.id || agent.value.id || '1' // Fallback to agent.value.id or '1'
  console.log('Navigating to chat with agent ID:', agentId)
  router.push(`/chat/${agentId}`)
}

// Send meet and greet request
const sendMeetAndGreetRequest = () => {
  // Get all saved appointments for this agent
  try {
    const savedAppointments = JSON.parse(localStorage.getItem('savedAppointments') || '[]')
    const agentAppointments = savedAppointments.filter(apt => apt.agentId === agent.value.id)
    
    if (agentAppointments.length === 0) {
      alert('No appointments found. Please set an appointment first.')
      return
    }
    
    // In a real app, this would send all appointments to a backend
    console.log('Sending all appointments for:', {
      agent: agent.value.name,
      appointments: agentAppointments,
      totalAppointments: agentAppointments.length,
      timestamp: new Date().toISOString()
    })
    
    // Show success message with appointment details
    const appointmentDetails = agentAppointments.map(apt => 
      `${apt.date} at ${apt.time} (${apt.timezone})`
    ).join(', ')
    
    alert(`Successfully sent ${agentAppointments.length} appointment(s) to ${agent.value.name}:\n${appointmentDetails}`)
    
    // Clear saved appointments for this agent
    const remainingAppointments = savedAppointments.filter(apt => apt.agentId !== agent.value.id)
    localStorage.setItem('savedAppointments', JSON.stringify(remainingAppointments))
    console.log('Cleared sent appointments for agent:', agent.value.id)
    
  } catch (error) {
    console.error('Error processing saved appointments:', error)
    alert('Error sending appointments. Please try again.')
  }
}

// Navigate to set appointment page
const goToSetAppointment = () => {
  // Save agent data to localStorage for the appointment page
  try {
    localStorage.setItem('selectedAgent', JSON.stringify(agent.value))
    console.log('Saved agent data for appointment:', agent.value)
  } catch (error) {
    console.error('Error saving agent data:', error)
  }
  
  // Navigate to the set appointment page
  router.push(`/client/agent/${agent.value.id}/set-appointment`)
}

// Load agent data based on route parameter
onMounted(() => {
  const agentId = route.params.id
  console.log('Loading agent profile for ID:', agentId)
  
  // Try to load agent data from localStorage
  try {
    const savedAgentData = localStorage.getItem('selectedAgent')
    if (savedAgentData) {
      const parsedAgentData = JSON.parse(savedAgentData)
      // Update the agent ref with the data from localStorage
      agent.value = {
        ...agent.value, // Keep default values as fallback
        ...parsedAgentData // Override with saved data
      }
      console.log('Loaded agent data from localStorage:', parsedAgentData)
    }
  } catch (error) {
    console.error('Error loading agent data from localStorage:', error)
    // Keep using default mock data if localStorage fails
  }
})
</script>

<style scoped>
/* Scoped styles if any, but Tailwind handles most of it */
</style>

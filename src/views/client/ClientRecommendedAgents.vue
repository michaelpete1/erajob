<template>
  <div class="min-h-screen bg-gray-50 pb-20 sm:pb-24">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 sticky top-0 z-30">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <div class="flex items-center gap-1.5 sm:gap-2 md:gap-3">
          <button @click="$router.back()" class="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-base sm:text-lg md:text-xl font-semibold text-gray-800 truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">Recommended Agents</h1>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <button class="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6h.01M12 12h.01M12 18h.01" />
            </svg>
          </button>
          <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-teal-500"></div>
        </div>
      </div>
    </div>

    <div class="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 max-w-4xl mx-auto">
      <!-- Search and Filter Section -->
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-sm mb-4 sm:mb-6">
        <div class="mb-4 sm:mb-6">
          <div class="relative">
            <input 
              type="text" 
              placeholder="Search agents by name, skills, or location..." 
              class="w-full px-3 sm:px-4 py-2 sm:py-3 pl-9 sm:pl-10 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
            >
            <svg class="absolute left-3 sm:left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Agents Grid -->
      <div class="space-y-4 sm:space-y-6">
        <div v-for="agent in recommendedAgents" :key="agent.id" class="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-teal-300 relative overflow-hidden" @click="$router.push(`/client/agent/${agent.id}`)">
          <!-- Decorative background element -->
          <div class="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-full -mr-12 -mt-12 opacity-30 group-hover:opacity-50 transition-opacity"></div>
          
          <div class="relative z-10">
            <div class="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
              <!-- Enhanced Avatar -->
              <div class="flex-shrink-0">
                <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg ring-4 ring-white ring-offset-2 ring-offset-teal-50 group-hover:scale-105 transition-transform duration-300">
                  {{ agent.name.charAt(0) }}
                </div>
              </div>
              
              <!-- Agent Info -->
              <div class="flex-1 min-w-0">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div>
                    <h4 class="font-bold text-gray-800 text-lg sm:text-xl group-hover:text-teal-600 transition-colors">{{ agent.name }}</h4>
                    <p class="text-sm sm:text-base text-gray-600 font-medium">{{ agent.title }}</p>
                  </div>
                  <div class="flex items-center gap-1">
                    <svg class="w-4 h-4 sm:w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span class="font-semibold text-sm sm:text-base text-gray-800">{{ agent.rating }}</span>
                  </div>
                </div>
                
                <!-- Stats and Info -->
                <div class="flex flex-wrap gap-2 sm:gap-3 mb-3">
                  <div class="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full">
                    <span class="text-xs sm:text-sm text-gray-500">📍</span>
                    <span class="text-sm text-gray-700 font-medium">{{ agent.location }}</span>
                  </div>
                  <div class="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full">
                    <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="font-semibold text-sm text-green-700">{{ agent.completionRate }}%</span>
                  </div>
                  <div class="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full">
                    <span class="text-xs sm:text-sm text-gray-500">💼</span>
                    <span class="text-sm text-gray-700 font-medium">{{ agent.company }}</span>
                  </div>
                </div>
                
                <!-- Skills Preview -->
                <div class="mb-3">
                  <p class="text-xs sm:text-sm text-gray-500 mb-2">Top Skills:</p>
                  <div class="flex flex-wrap gap-1 sm:gap-2">
                    <span v-for="skill in agent.skills.slice(0, 4)" :key="skill.name" class="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                      {{ skill.name }}
                    </span>
                  </div>
                </div>
                
                <!-- Enhanced Stats Grid -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-100">
                  <div class="text-center">
                    <p class="text-lg sm:text-xl font-bold text-gray-800">{{ agent.completedJobs }}</p>
                    <p class="text-xs sm:text-sm text-gray-500">Jobs Done</p>
                  </div>
                  <div class="text-center">
                    <p class="text-lg sm:text-xl font-bold text-gray-800">{{ agent.availability.responseTime }}</p>
                    <p class="text-xs sm:text-sm text-gray-500">Response Time</p>
                  </div>
                  <div class="text-center">
                    <p class="text-lg sm:text-xl font-bold text-gray-800">{{ agent.experience.length }}+</p>
                    <p class="text-xs sm:text-sm text-gray-500">Years Exp</p>
                  </div>
                  <div class="text-center">
                    <p class="text-lg sm:text-xl font-bold text-gray-800">{{ agent.reviews }}</p>
                    <p class="text-xs sm:text-sm text-gray-500">Reviews</p>
                  </div>
                </div>
                
                <!-- Availability Info -->
                <div class="flex items-center justify-between mt-3">
                  <div class="flex items-center gap-2">
                    <span class="text-xs sm:text-sm text-gray-500">{{ agent.availability.type }} · {{ agent.availability.hours }}</span>
                  </div>
                  <div class="text-right">
                    <span :class="agent.status === 'Available' ? 'text-green-600' : 'text-blue-600'" class="font-semibold text-xs sm:text-sm block">{{ agent.status }}</span>
                    <p class="font-bold text-sm sm:text-base text-gray-800">${{ agent.rate }}/Mo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More -->
      <div class="text-center mt-8 sm:mt-12">
        <button class="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white hover:bg-gray-50 text-teal-600 font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl transition-colors border border-teal-200 hover:border-teal-300">
          <span>Load More Agents</span>
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Recommended agents data - standardized with ClientAgentProfile.vue structure
const recommendedAgents = ref([
  {
    id: 1,
    name: 'Alex Johnson',
    title: 'Senior UI/UX Designer',
    company: 'Design Studio Pro',
    location: 'California, USA',
    status: 'Available',
    rate: '15K',
    rating: 5,
    completionRate: 98,
    availability: {
      type: 'Full-time',
      hours: '40+ hours/week',
      responseTime: 'Within 1 hour'
    },
    skills: [
      { name: 'UI Design', level: 'Expert' },
      { name: 'UX Research', level: 'Advanced' },
      { name: 'Figma', level: 'Expert' },
      { name: 'Prototyping', level: 'Advanced' }
    ],
    experience: [
      { title: 'Senior Designer', company: 'Design Studio Pro', period: '2021-Present', level: 'Senior' },
      { title: 'UI Designer', company: 'Creative Agency', period: '2019-2021', level: 'Mid' }
    ],
    communication: {
      email: 'alex.johnson@email.com',
      phone: '+1 (555) 123-4567'
    },
    completedJobs: 127,
    reviews: 98
  },
  {
    id: 2,
    name: 'Sarah Chen',
    title: 'Content Strategist',
    company: 'Creative Solutions',
    location: 'New York, USA',
    status: 'Busy',
    rate: '12K',
    rating: 4,
    completionRate: 95,
    availability: {
      type: 'Part-time',
      hours: '20-30 hours/week',
      responseTime: 'Within 2 hours'
    },
    skills: [
      { name: 'Content Strategy', level: 'Expert' },
      { name: 'Copywriting', level: 'Advanced' },
      { name: 'SEO', level: 'Advanced' },
      { name: 'Analytics', level: 'Intermediate' }
    ],
    experience: [
      { title: 'Content Strategist', company: 'Creative Solutions', period: '2020-Present', level: 'Senior' },
      { title: 'Content Writer', company: 'Marketing Agency', period: '2018-2020', level: 'Mid' }
    ],
    communication: {
      email: 'sarah.chen@email.com',
      phone: '+1 (555) 987-6543'
    },
    completedJobs: 89,
    reviews: 76
  },
  {
    id: 3,
    name: 'Mike Rodriguez',
    title: 'Full Stack Developer',
    company: 'Tech Innovations',
    location: 'Texas, USA',
    status: 'Available',
    rate: '18K',
    rating: 5,
    completionRate: 99,
    availability: {
      type: 'Full-time',
      hours: '40+ hours/week',
      responseTime: 'Within 30 minutes'
    },
    skills: [
      { name: 'JavaScript', level: 'Expert' },
      { name: 'React', level: 'Expert' },
      { name: 'Node.js', level: 'Advanced' },
      { name: 'Python', level: 'Advanced' }
    ],
    experience: [
      { title: 'Senior Developer', company: 'Tech Innovations', period: '2019-Present', level: 'Senior' },
      { title: 'Developer', company: 'Startup Co', period: '2017-2019', level: 'Mid' }
    ],
    communication: {
      email: 'mike.rodriguez@email.com',
      phone: '+1 (555) 456-7890'
    },
    completedJobs: 156,
    reviews: 134
  },
  {
    id: 4,
    name: 'Emily Davis',
    title: 'Digital Marketing Specialist',
    company: 'Digital Marketing Pro',
    location: 'Florida, USA',
    status: 'Available',
    rate: '10K',
    rating: 4,
    completionRate: 94,
    availability: {
      type: 'Full-time',
      hours: '40+ hours/week',
      responseTime: 'Within 1 hour'
    },
    skills: [
      { name: 'SEO', level: 'Advanced' },
      { name: 'Content Marketing', level: 'Expert' },
      { name: 'Social Media', level: 'Advanced' },
      { name: 'Google Ads', level: 'Intermediate' }
    ],
    experience: [
      { title: 'Marketing Specialist', company: 'Digital Marketing Pro', period: '2020-Present', level: 'Senior' },
      { title: 'Marketing Coordinator', company: 'Agency Inc', period: '2018-2020', level: 'Mid' }
    ],
    communication: {
      email: 'emily.davis@email.com',
      phone: '+1 (555) 234-5678'
    },
    completedJobs: 94,
    reviews: 87
  },
  {
    id: 5,
    name: 'David Kim',
    title: 'Senior Full Stack Developer',
    company: 'Full Stack Dev',
    location: 'Washington, USA',
    status: 'Busy',
    rate: '20K',
    rating: 5,
    completionRate: 97,
    availability: {
      type: 'Full-time',
      hours: '40+ hours/week',
      responseTime: 'Within 45 minutes'
    },
    skills: [
      { name: 'Python', level: 'Expert' },
      { name: 'Django', level: 'Expert' },
      { name: 'PostgreSQL', level: 'Advanced' },
      { name: 'AWS', level: 'Advanced' },
      { name: 'Docker', level: 'Intermediate' }
    ],
    experience: [
      { title: 'Senior Developer', company: 'Full Stack Dev', period: '2018-Present', level: 'Senior' },
      { title: 'Developer', company: 'Tech Startup', period: '2016-2018', level: 'Mid' }
    ],
    communication: {
      email: 'david.kim@email.com',
      phone: '+1 (555) 345-6789'
    },
    completedJobs: 203,
    reviews: 178
  }
])
</script>

<style scoped>
/* No custom styles needed - using Tailwind classes */
</style>

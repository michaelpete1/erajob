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
          <h1 class="text-base sm:text-lg md:text-xl font-semibold text-gray-800 truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">Job Description</h1>
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

    <!-- Main Content -->
    <div class="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 max-w-4xl mx-auto">
      <!-- Job Header Card -->
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-sm mb-4 sm:mb-6">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4">
          <div class="flex-1 min-w-0">
            <h2 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-2 sm:mb-3 leading-tight">{{ job.title }}</h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              <div class="flex items-center gap-1.5 sm:gap-2">
                <span class="text-base sm:text-lg">💰</span>
                <span class="text-xs sm:text-sm text-gray-600">Budget:</span>
                <span class="text-xs sm:text-sm font-semibold text-gray-800 truncate">${{ job.budget }}</span>
              </div>
              <div class="flex items-center gap-1.5 sm:gap-2">
                <span class="text-base sm:text-lg">📍</span>
                <span class="text-xs sm:text-sm text-gray-600">Type:</span>
                <span class="text-xs sm:text-sm font-semibold text-gray-800 truncate">{{ job.type }}</span>
              </div>
              <div class="flex items-center gap-1.5 sm:gap-2">
                <span class="text-base sm:text-lg">⏰</span>
                <span class="text-xs sm:text-sm text-gray-600">Posted:</span>
                <span class="text-xs sm:text-sm font-semibold text-gray-800 truncate">{{ job.postedTime }}</span>
              </div>
            </div>
          </div>
          <button class="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
        
        <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span class="px-2 sm:px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">{{ job.category }}</span>
          <span class="px-2 sm:px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">{{ job.proposals }} proposals</span>
        </div>
      </div>

      <!-- Recommended Agents (Top Section) -->
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-sm mb-4 sm:mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h3 class="text-base sm:text-lg md:text-xl font-semibold text-gray-800">Recommended Agents</h3>
          <button @click="$router.push('/client/recommended-agents')" class="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white rounded-md shadow-sm hover:shadow-md text-xs sm:text-sm text-teal-600 font-medium hover:text-teal-700 transition-colors border border-teal-200 hover:border-teal-300">
            <span>View all</span>
            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-4 sm:space-y-6">
          <div v-for="agent in recommendedAgents.slice(0, 3)" :key="agent.id" class="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-teal-300 relative overflow-hidden" @click="$router.push(`/client/agent/${agent.id}`)">
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
                      <span class="text-sm">📍</span>
                      <span class="text-sm text-gray-700 font-medium">{{ agent.location }}</span>
                    </div>
                    <div class="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full">
                      <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="font-semibold text-sm text-green-700">{{ agent.completionRate }}%</span>
                    </div>
                    <div class="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full">
                      <span class="text-sm">💼</span>
                      <span class="text-sm text-gray-700 font-medium">{{ agent.company }}</span>
                    </div>
                  </div>
                  
                  <!-- Skills Preview -->
                  <div class="mb-3">
                    <p class="text-xs sm:text-sm text-gray-500 mb-2">Top Skills:</p>
                    <div class="flex flex-wrap gap-1 sm:gap-2">
                      <span v-for="skill in agent.skills.slice(0, 3)" :key="skill.name" class="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                        {{ skill.name }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Availability Info -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="text-xs sm:text-sm text-gray-500">{{ agent.availability.type }} · {{ agent.availability.hours }}</span>
                    </div>
                    <div class="text-right">
                      <span :class="agent.status === 'Ongoing' ? 'text-green-600' : 'text-blue-600'" class="font-semibold text-xs sm:text-sm block">{{ agent.status }}</span>
                      <p class="font-bold text-sm sm:text-base text-gray-800">${{ agent.rate }}/Mo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Job Description -->
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-sm mb-4 sm:mb-6">
        <h3 class="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Description</h3>
        <p class="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6">
          {{ job.description }}
        </p>
        
        <h4 class="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Requirements</h4>
        <ul class="space-y-1.5 sm:space-y-2 md:space-y-3">
          <li v-for="requirement in job.requirements" :key="requirement" class="flex items-start gap-2 sm:gap-3">
            <span class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg class="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </span>
            <span class="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">{{ requirement }}</span>
          </li>
        </ul>
      </div>

      <!-- Recommended Agents -->
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h3 class="text-base sm:text-lg md:text-xl font-semibold text-gray-800">Recommended Agents</h3>
          <button class="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white rounded-md shadow-sm hover:shadow-md text-xs sm:text-sm text-teal-600 font-medium hover:text-teal-700 transition-colors border border-teal-200 hover:border-teal-300">
            <span>View more</span>
            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
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
                      <span class="text-sm">📍</span>
                      <span class="text-sm text-gray-700 font-medium">{{ agent.location }}</span>
                    </div>
                    <div class="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full">
                      <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="font-semibold text-sm text-green-700">{{ agent.completionRate }}%</span>
                    </div>
                    <div class="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full">
                      <span class="text-sm">💼</span>
                      <span class="text-sm text-gray-700 font-medium">{{ agent.company }}</span>
                    </div>
                  </div>
                  
                  <!-- Skills Preview -->
                  <div class="mb-3">
                    <p class="text-xs sm:text-sm text-gray-500 mb-2">Top Skills:</p>
                    <div class="flex flex-wrap gap-1 sm:gap-2">
                      <span v-for="skill in agent.skills.slice(0, 3)" :key="skill.name" class="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                        {{ skill.name }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Availability Info -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="text-xs sm:text-sm text-gray-500">{{ agent.availability.type }} · {{ agent.availability.hours }}</span>
                    </div>
                    <div class="text-right">
                      <span :class="agent.status === 'Ongoing' ? 'text-green-600' : 'text-blue-600'" class="font-semibold text-xs sm:text-sm block">{{ agent.status }}</span>
                      <p class="font-bold text-sm sm:text-base text-gray-800">${{ agent.rate }}/Mo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Client Bottom Navigation -->
    <ClientBottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ClientBottomNav from '../../components/ClientBottomNav.vue'

const route = useRoute()

// Job data
const job = ref({
  id: 0,
  title: '',
  category: '',
  budget: '',
  type: 'Remote',
  postedTime: '',
  proposals: '',
  description: '',
  requirements: [] as string[]
})

// Recommended agents data - standardized with ClientAgentProfile.vue structure
const recommendedAgents = ref([
  {
    id: 1,
    name: 'Alex Johnson',
    title: 'Senior UI/UX Designer',
    company: 'Design Studio Pro',
    location: 'California, USA',
    timeAgo: '25 minutes ago',
    status: 'Ongoing',
    rate: '15K',
    rating: 5,
    completionRate: 98,
    availability: {
      type: 'Full-time',
      hours: '40+ hours/week',
      responseTime: 'Within 2 hours'
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
    }
  },
  {
    id: 2,
    name: 'Sarah Chen',
    title: 'Content Strategist',
    company: 'Creative Solutions',
    location: 'New York, USA',
    timeAgo: '1 hour ago',
    status: 'Complete',
    rate: '12K',
    rating: 4,
    completionRate: 95,
    availability: {
      type: 'Part-time',
      hours: '20-30 hours/week',
      responseTime: 'Within 4 hours'
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
    }
  },
  {
    id: 3,
    name: 'Mike Rodriguez',
    title: 'Full Stack Developer',
    company: 'Tech Innovations',
    location: 'Texas, USA',
    timeAgo: '2 hours ago',
    status: 'Ongoing',
    rate: '18K',
    rating: 5,
    completionRate: 99,
    availability: {
      type: 'Full-time',
      hours: '40+ hours/week',
      responseTime: 'Within 1 hour'
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
    }
  }
])

// Load job data from localStorage or based on route parameter
onMounted(() => {
  const jobId = route.params.id
  
  // Try to get job from localStorage first
  const savedJob = localStorage.getItem('selectedProject')
  if (savedJob) {
    const parsedJob = JSON.parse(savedJob)
    if (parsedJob.id === parseInt(jobId as string)) {
      job.value = {
        id: parsedJob.id,
        title: parsedJob.title,
        category: parsedJob.category,
        budget: parsedJob.budget,
        type: 'Remote',
        postedTime: parsedJob.postedTime,
        proposals: parsedJob.proposals || '0',
        description: parsedJob.description || getDefaultDescription(parsedJob.title),
        requirements: parsedJob.requirements || getDefaultRequirements(parsedJob.category)
      }
      return
    }
  }
  
  // Fallback to mock data based on job ID
  loadMockJob(parseInt(jobId as string))
})

const getDefaultDescription = (title: string) => {
  return `We are looking for a skilled and creative professional to bring our vision to life by ${title.toLowerCase()}. The ideal candidate should have a strong understanding of industry best practices, excellent technical skills, and the ability to translate complex requirements into clean and effective solutions.`
}

const getDefaultRequirements = (category: string) => {
  const baseRequirements = [
    'Proven experience in the field with a strong portfolio of relevant projects.',
    'Proficiency in industry-standard tools and technologies.',
    'Solid understanding of fundamental principles and best practices.',
    'Attention to detail and commitment to delivering high-quality work on time.'
  ]
  
  if (category.includes('Design')) {
    return [
      'Proven experience in UI/UX design with a strong portfolio of web or mobile projects.',
      'Proficiency in design tools such as Figma, Adobe XD, or Sketch.',
      'Solid understanding of design principles, typography, color theory, and accessibility.',
      'Attention to detail and commitment to delivering pixel-perfect designs on time.'
    ]
  }
  
  if (category.includes('Writing')) {
    return [
      'Exceptional writing and editing skills with a strong command of grammar and style.',
      'Experience in creating engaging content for various platforms and audiences.',
      'Ability to research and write on diverse topics with accuracy and creativity.',
      'Strong time management skills and ability to meet deadlines consistently.'
    ]
  }
  
  if (category.includes('Marketing')) {
    return [
      'Proven experience in digital marketing with a track record of successful campaigns.',
      'Proficiency in marketing analytics tools and social media platforms.',
      'Strong understanding of SEO, content marketing, and audience engagement strategies.',
      'Ability to analyze data and optimize campaigns for better performance.'
    ]
  }
  
  return baseRequirements
}

const loadMockJob = (jobId: number) => {
  const mockJobs = {
    3: {
      id: 3,
      title: 'Mobile App Design for Startup',
      category: 'UI/UX Design',
      budget: '3,500',
      type: 'Remote',
      postedTime: 'Posted 2 days ago',
      proposals: '12',
      description: 'We are looking for a skilled and creative UI/UX designer to bring our vision to life by designing an intuitive, visually appealing, and user-friendly interface for our mobile application. The ideal candidate should have a strong understanding of user-centered design principles, excellent visual design skills, and the ability to translate complex requirements into clean and engaging user experiences.',
      requirements: [
        'Proven experience in UI/UX design with a strong portfolio of mobile app projects.',
        'Proficiency in design tools such as Figma, Adobe XD, or Sketch.',
        'Solid understanding of mobile design patterns, typography, color theory, and accessibility.',
        'Attention to detail and commitment to delivering pixel-perfect designs on time.'
      ]
    },
    4: {
      id: 4,
      title: 'Content Writing for Blog',
      category: 'Writing',
      budget: '800',
      type: 'Remote',
      postedTime: 'Posted 1 day ago',
      proposals: '8',
      description: 'We are seeking a talented content writer to create engaging and informative blog posts for our website. The ideal candidate should have excellent writing skills, the ability to research various topics, and experience in creating content that resonates with our target audience.',
      requirements: [
        'Exceptional writing and editing skills with a strong command of grammar and style.',
        'Experience in creating engaging blog content for various industries.',
        'Ability to research and write on diverse topics with accuracy and creativity.',
        'Strong time management skills and ability to meet deadlines consistently.'
      ]
    },
    5: {
      id: 5,
      title: 'Social Media Marketing Campaign',
      category: 'Marketing',
      budget: '1,200',
      type: 'Remote',
      postedTime: 'Posted 5 hours ago',
      proposals: '5',
      description: 'We need an experienced social media marketer to develop and execute a comprehensive marketing campaign across multiple platforms. The ideal candidate should have a proven track record of successful campaigns, strong analytical skills, and the ability to create engaging content that drives results.',
      requirements: [
        'Proven experience in social media marketing with a track record of successful campaigns.',
        'Proficiency in marketing analytics tools and major social media platforms.',
        'Strong understanding of content strategy, audience engagement, and community management.',
        'Ability to analyze campaign performance and optimize for better results.'
      ]
    }
  }
  
  job.value = mockJobs[jobId as keyof typeof mockJobs] || mockJobs[3]
}
</script>

<style scoped>
/* No custom styles needed - using Tailwind classes */
</style>

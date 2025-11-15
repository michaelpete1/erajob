<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import axios from 'axios'
import type { SignupData } from '../../types/api/auth'

const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : import.meta.env.VITE_API_BASE_URL ?? 'https://eba-jobs.getxoxo.space'

const router = useRouter()
const isSubmitting = ref(false)
const errorMessage = ref('')
const hasCompletedSignup = ref(false)

const finishSignup = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const basic = JSON.parse(localStorage.getItem('signupBasicData') || '{}')
    const welcome = JSON.parse(localStorage.getItem('agentWelcomeData') || '{}')
    const services: string[] = JSON.parse(localStorage.getItem('selectedAgentServices') || '[]')

    if (!basic?.email || !basic?.password || !basic?.firstName || !basic?.lastName) {
      errorMessage.value = 'Missing signup information. Please restart the signup.'
      return
    }

    // Transform welcome data to match API schema and types
    const toolsArray = typeof welcome?.tools === 'string'
      ? welcome.tools.split(',').map((s: string) => s.trim()).filter((s: string) => !!s).slice(0, 3)
      : []
    // Certificates: accept array from welcome.certificates or parse comma-separated certificateUrls
    let certUrls: string[] = []
    if (Array.isArray(welcome?.certificates)) {
      certUrls = (welcome.certificates as string[]).map((s: string) => String(s).trim()).filter(Boolean)
    } else if (typeof welcome?.certificateUrls === 'string') {
      certUrls = welcome.certificateUrls.split(',').map((s: string) => s.trim()).filter(Boolean)
    }
    // If still empty, try to use any available link to satisfy backend non-empty requirement
    if (!certUrls.length) {
      const fallbacks = [welcome?.portfolioLink, welcome?.videoUrl, welcome?.personalityUrl]
        .map((s: any) => (typeof s === 'string' ? s.trim() : ''))
        .filter(Boolean)
      certUrls = fallbacks.slice(0, 1)
    }

    // Normalize enums
    const allowedExpertise = [
      'Sales',
      'Customer Service',
      'Editing',
      'Book Keeping',
      'Executive Assistant',
      'Appointment Setting',
      'Web Development',
      'Mobile Development',
      'UI/UX Design',
      'Content Writing',
      'Digital Marketing',
      'Data Analysis',
      'Other'
    ]
    const selectedExpertise = typeof welcome?.primaryExpertise === 'string' && allowedExpertise.includes(welcome.primaryExpertise)
      ? welcome.primaryExpertise
      : 'Other'
    const hoursNum = Number(welcome?.hoursPerWeek)
    const normalizedHours = hoursNum === 80 || hoursNum === 160 ? hoursNum : 80

    // Guard: backend requires at least one certificate_url
    if (!certUrls.length) {
      errorMessage.value = 'Please provide at least one certificate link (or portfolio/video/personality link).'
      isSubmitting.value = false
      return
    }

    const payload: SignupData = {
      email: basic.email,
      password: basic.password,
      role: 'agent',
      full_name: `${basic.firstName} ${basic.lastName}`.trim(),
      phone_number: basic?.phone || welcome?.phoneNumber || '',
      certificate_url: certUrls,
      video_url: welcome?.videoUrl || '',
      personality_url: welcome?.personalityUrl || '',
      primary_area_of_expertise: selectedExpertise,
      years_of_experience: Number(welcome?.yearsOfExperience || 0),
      three_most_commonly_used_tools_or_platforms: toolsArray,
      available_hours_agent_can_commit: normalizedHours,
      time_zone: welcome?.timezone || 'UTC+00:00',
      portfolio_link: welcome?.portfolioLink || '',
      is_agent_open_to_calls_and_video_meetings: Boolean(welcome?.openToCalls),
      does_agent_have_working_computer: Boolean(welcome?.hasComputer),
      does_agent_have_stable_internet: Boolean(welcome?.hasInternet),
      is_agent_comfortable_with_time_tracking_tools: Boolean(welcome?.comfortableWithTracking)
    }

    const resp = await axios.post(`${API_BASE_URL}/v1/users/signup`, payload)
    if (resp.status < 200 || resp.status >= 300) {
      errorMessage.value = resp.data?.detail || 'Signup failed. Please try again.'
      return
    }

    // Optionally clear stored data after success
    hasCompletedSignup.value = true

    try {
      localStorage.removeItem('signupBasicData')
      localStorage.removeItem('agentWelcomeData')
      localStorage.removeItem('selectedAgentServices')
    } catch {}

    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userInfo')
    router.push('/sign-in')
  } catch (e: any) {
    errorMessage.value = e?.response?.data?.detail || e?.message || 'Unexpected error.'
  } finally {
    isSubmitting.value = false
  }
}

function handleBackToWelcome() {
  // Set hours to 20 before returning to welcome
  const welcome = JSON.parse(localStorage.getItem('agentWelcomeData') || '{}')
  welcome.available_hours_agent_can_commit = 20
  localStorage.setItem('agentWelcomeData', JSON.stringify(welcome))
  router.push('/agent/welcome')
}

onBeforeRouteLeave((to, _from, next) => {
  // Allow navigation to welcome page or if signup is complete
  if (to.path === '/agent/welcome' || hasCompletedSignup.value) {
    next()
    return
  }
  // Redirect to welcome page only if not already going there
  if (to.path !== '/agent/welcome') {
    next('/agent/welcome')
  } else {
    next()
  }
})
</script>

<template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 flex items-center justify-center overflow-hidden">
    <!-- Animated decorative circles - responsive sizes -->
    <div class="absolute top-0 right-0 h-24 w-24 sm:h-32 sm:w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-20 w-20 sm:h-24 sm:w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />
    
    <!-- Floating particles - responsive positioning -->
    <div class="absolute top-16 left-16 sm:top-20 sm:left-20 w-2 h-2 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-32 right-24 sm:top-40 sm:right-32 w-1 h-1 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-24 left-32 sm:bottom-32 sm:left-40 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-16 right-16 sm:bottom-20 sm:right-20 w-2.5 h-2.5 bg-white/15 rounded-full animate-float-delayed-4" />

    <div class="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div class="rounded-2xl bg-white/95 backdrop-blur-sm px-4 sm:px-6 py-8 sm:py-12 text-center shadow-xl animate-fade-up-delay-2">
        <div class="text-center">
          <button @click="handleBackToWelcome" class="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div class="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-teal-50 mb-4 sm:mb-6 animate-bounce">
            <span class="text-3xl sm:text-4xl">🎉</span>
          </div>
          <h2 class="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-teal mb-2 animate-fade-up-delay-1">Congratulations!</h2>
          <p class="text-sm sm:text-base md:text-lg font-semibold text-brand-teal mb-4 animate-fade-up-delay-2">You've successfully completed your application</p>
          <div class="mx-auto mt-2 max-w-xs sm:max-w-sm text-left space-y-3 text-gray-700 animate-fade-up-delay-3">
            <p>If you pass the selection process, you'll go through our free onboarding and training program.</p>
            <ul class="list-disc pl-5 space-y-1">
              <li>Structured learning to prepare you for real projects.</li>
              <li>Equip you with the tools and knowledge to succeed as an EBA agent.</li>
              <li>Completely free, no fees required.</li>
              <li>Once you pass the training, you'll be eligible to receive jobs as an EBA agent.</li>
            </ul>
            <p>We look forward to working with you!</p>
          </div>
        </div>

        <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {{ errorMessage }}
        </div>
        <button @click="finishSignup" :disabled="isSubmitting" class="btn-pressable mt-6 sm:mt-8 inline-flex items-center justify-center rounded-full bg-brand-teal px-6 sm:px-8 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-up-delay-4 w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed">
          {{ isSubmitting ? 'Finishing...' : 'Finish Sign Up' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../../services/authService'
import type { SignupData } from '../../types/api/auth'

const router = useRouter()
const isSubmitting = ref(false)
const errorMessage = ref('')

const finishSignup = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const basic = JSON.parse(localStorage.getItem('signupBasicData') || '{}')
    const welcome = JSON.parse(localStorage.getItem('clientWelcomeData') || '{}')
    const services: string[] = JSON.parse(localStorage.getItem('selectedClientServices') || '[]')

    if (!basic?.email || !basic?.password) {
      errorMessage.value = 'Missing signup information. Please restart the signup.'
      return
    }

    const payload: SignupData = {
      email: basic.email,
      password: basic.password,
      role: 'client',
      full_name: welcome?.fullName || `${basic.firstName || ''} ${basic.lastName || ''}`.trim(),
      phone_number: welcome?.phone || '',
      certificate_url: Array.isArray(welcome?.certificates) ? welcome.certificates : [],
      video_url: welcome?.shortVideo || '',
      personality_url: welcome?.personalityTest || '',
      company_name: welcome?.companyName || '',
      company_email: welcome?.companyEmail || '',
      company_address: welcome?.companyAddress || '',
      company_website: welcome?.companyWebsite || '',
      // Required enums with defaults if missing
      client_reason_for_signing_up: welcome?.clientReason || 'Just hire me someone',
      client_need_agent_work_hours_to_be: 'both',
      primary_area_of_expertise: welcome?.primaryAreaOfExpertise || 'Other',
      time_zone: welcome?.timezone || 'UTC+00:00',
      portfolio_link: welcome?.urlLink || '',
      // Booleans in prepareSignupData are derived from 'yes' string; default to 'no' if empty
      is_agent_open_to_calls_and_video_meetings: welcome?.openToCalls || 'no',
      does_agent_have_working_computer: welcome?.hasWorkingComputer || 'no',
      does_agent_have_stable_internet: welcome?.hasStableInternet || 'no',
      is_agent_comfortable_with_time_tracking_tools: welcome?.comfortableWithTimeTracking || 'no',
      three_most_commonly_used_tools_or_platforms: [],
      available_hours_agent_can_commit: '',
      services: Array.isArray(services) ? services : []
    }

    const resp = await authService.signup(payload)
    if (!resp.success) {
      errorMessage.value = resp.error || 'Signup failed. Please try again.'
      return
    }

    try {
      localStorage.removeItem('signupBasicData')
      localStorage.removeItem('clientWelcomeData')
      localStorage.removeItem('selectedClientServices')
    } catch {}

    router.push('/client/projects')
  } catch (e: any) {
    errorMessage.value = e?.response?.data?.detail || e?.message || 'Unexpected error.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 flex items-center justify-center overflow-hidden">
    <div class="absolute top-0 right-0 h-32 w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-24 w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />
    
    <div class="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-40 right-32 w-1 h-1 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-32 left-40 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-20 right-20 w-2.5 h-2.5 bg-white/15 rounded-full animate-float-delayed-4" />

    <div class="relative z-10 w-full max-w-md mx-auto px-4 py-6">
      <!-- Navigation Header -->
      <header class="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white/10 backdrop-blur-sm rounded-t-2xl animate-fade-up">
        <button @click="$router.push('/client/additional')" class="text-white/80 hover:text-white transition-colors flex items-center gap-2 text-sm animate-bounce-in">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div class="flex items-center gap-2 animate-fade-up-delay-1">
          <div class="w-2 h-2 rounded-full bg-white"></div>
          <div class="w-2 h-2 rounded-full bg-white"></div>
          <div class="w-2 h-2 rounded-full bg-white"></div>
          <div class="w-2 h-2 rounded-full bg-white"></div>
        </div>
        <div class="w-6" />
      </header>
      
      <div class="rounded-2xl bg-white/95 backdrop-blur-sm px-6 py-12 text-center shadow-xl animate-fade-up-delay-2">
      <div class="flex justify-center mb-4 animate-bounce">
        <span class="text-4xl">🎉</span>
      </div>
      <h2 class="text-2xl md:text-3xl font-extrabold text-brand-teal mb-2 animate-fade-up-delay-1">Congratulations!</h2>
      <p class="text-base md:text-lg font-semibold text-brand-teal mb-4 animate-fade-up-delay-2">Your client account has been created successfully!</p>
      <div class="mx-auto mt-2 max-w-sm text-left space-y-3 text-gray-700 animate-fade-up-delay-3">
        <p>Welcome to ERA! Your client account is now ready to help you find the perfect talent for your projects.</p>
        <ul class="list-disc pl-5 space-y-1">
          <li>Access to skilled professionals across various industries.</li>
          <li>Streamlined hiring process with vetted candidates.</li>
          <li>Dedicated support for your project needs.</li>
          <li>Flexible hiring options to match your requirements.</li>
        </ul>
        <p>We're excited to help you build your dream team!</p>
      </div>

      <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
        {{ errorMessage }}
      </div>
      <button @click="finishSignup" :disabled="isSubmitting" class="btn-pressable mt-10 inline-flex items-center justify-center rounded-full bg-brand-teal px-8 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-up-delay-4 disabled:opacity-60 disabled:cursor-not-allowed">
        {{ isSubmitting ? 'Finishing...' : 'Finish Sign Up' }}
      </button>
      </div>
    </div>
  </div>
</template>


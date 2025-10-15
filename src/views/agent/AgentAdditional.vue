<template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 overflow-hidden">
    <!-- Animated decorative circles -->
    <div class="absolute top-0 right-0 h-32 w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-24 w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />

    <!-- Floating particles -->
    <div class="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-40 right-32 w-1 h-1 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-32 left-40 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-20 right-20 w-2.5 h-2.5 bg-white/15 rounded-full animate-float-delayed-4" />

    <div class="relative z-10 w-full max-w-md mx-auto px-4 py-6">

      <div class="mx-auto w-full max-w-md px-4 py-6">
        <form @submit.prevent="onSubmit" class="space-y-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl animate-fade-up-delay-2">
          <!-- Error Messages -->
          <div v-if="generalError" class="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-white text-sm animate-fade-in">
            {{ generalError }}
          </div>

          <fieldset class="space-y-3 animate-slide-in-left">
            <legend class="text-sm font-semibold text-brand-teal">Preferred Work Schedule</legend>
            <label class="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <input type="checkbox" v-model="form.partTime" class="h-4 w-4 text-brand-teal focus:ring-brand-teal" />
              Part-Time (20-30 hours/week)
            </label>
            <label class="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <input type="checkbox" v-model="form.fullTime" class="h-4 w-4 text-brand-teal focus:ring-brand-teal" />
              Full-Time (40+ hours/week)
            </label>
          </fieldset>

          <fieldset class="space-y-3 animate-slide-in-right">
            <legend class="text-sm font-semibold text-brand-teal">Work Environment Preference</legend>
            <label class="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <input type="checkbox" v-model="form.remote" class="h-4 w-4 text-brand-teal focus:ring-brand-teal" />
              Remote Work
            </label>
            <label class="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <input type="checkbox" v-model="form.onsite" class="h-4 w-4 text-brand-teal focus:ring-brand-teal" />
              On-site Work
            </label>
            <label class="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <input type="checkbox" v-model="form.hybrid" class="h-4 w-4 text-brand-teal focus:ring-brand-teal" />
              Hybrid Work
            </label>
          </fieldset>

          <fieldset class="space-y-3 animate-slide-in-left">
            <legend class="text-sm font-semibold text-brand-teal">Additional Services & Skills</legend>
            <label class="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <input type="checkbox" v-model="form.consulting" class="h-4 w-4 text-brand-teal focus:ring-brand-teal" />
              Consulting Services
            </label>
            <label class="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <input type="checkbox" v-model="form.training" class="h-4 w-4 text-brand-teal focus:ring-brand-teal" />
              Training & Workshops
            </label>
            <label class="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <input type="checkbox" v-model="form.projectManagement" class="h-4 w-4 text-brand-teal focus:ring-brand-teal" />
              Project Management
            </label>
          </fieldset>

          <div class="space-y-3 pt-4 animate-fade-up-delay-4">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="btn-pressable block w-full rounded-full bg-brand-teal px-6 py-3 text-center text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Saving...' : 'Complete Signup' }}
            </button>
            <button type="button" class="btn-pressable block w-full rounded-full border border-brand-teal/30 bg-brand-teal/10 px-6 py-3 text-sm text-brand-teal hover:bg-brand-teal/20 transition-all duration-300" @click="$router.back()">Back</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../../services/authService'
import type { SignupData } from '../../types/api/auth'

const router = useRouter()
const isSubmitting = ref(false)
const generalError = ref('')

const form = ref({
  partTime: false,
  fullTime: false,
  remote: false,
  onsite: false,
  hybrid: false,
  consulting: false,
  training: false,
  projectManagement: false
})

// Helper function to format error messages
const formatErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error
  if (Array.isArray(error)) {
    return error.map(item => {
      if (typeof item === 'string') return item
      if (typeof item === 'object' && item !== null) {
        return item.message || item.detail || item.error || JSON.stringify(item)
      }
      return String(item)
    }).join(', ')
  }
  if (typeof error === 'object' && error !== null) {
    return error.message || error.detail || error.error || JSON.stringify(error)
  }
  return String(error)
}

const onSubmit = async () => {
  isSubmitting.value = true
  generalError.value = ''

  try {
    // Get all stored data
    const basicData = JSON.parse(localStorage.getItem('signupBasicData') || '{}')
    const welcomeData = JSON.parse(localStorage.getItem('agentWelcomeData') || '{}')
    const selectedServices = JSON.parse(localStorage.getItem('selectedAgentServices') || '[]')

    if (!basicData.email || !welcomeData.primaryExpertise) {
      alert('Signup information not found. Please start the signup process again.')
      router.push('/auth/signup')
      return
    }

    // Map work hours to API expected values
    let hoursPerWeek = '80'
    if (welcomeData.hoursPerWeek === '160 hours part time') {
      hoursPerWeek = '160'
    }

    // Prepare complete signup data
    const completeSignupData: SignupData = {
      email: basicData.email,
      password: basicData.password,
      role: basicData.role as 'client' | 'agent',
      full_name: `${basicData.firstName} ${basicData.lastName}`.trim(),
      phone_number: '+1234567890', // Default placeholder - could be added to form later
      certificate_url: welcomeData.certifications || [],
      video_url: welcomeData.videoUrl,
      personality_url: welcomeData.personalityTest || '',
      // Client-specific fields (required for all roles)
      company_name: '',
      company_email: '',
      company_address: '',
      company_website: '',
      client_reason_for_signing_up: '',
      client_need_agent_work_hours_to_be: 'both',
      // Agent-specific fields
      primary_expertise: welcomeData.primaryExpertise,
      years_of_experience: welcomeData.yearsOfExperience,
      tools: welcomeData.tools,
      hours_per_week: hoursPerWeek,
      timezone: welcomeData.timezone,
      preferred_projects: welcomeData.preferredProjects,
      open_to_calls: welcomeData.openToCalls === 'yes' ? 'yes' : 'no',
      has_computer: welcomeData.hasComputer === 'yes' ? 'yes' : 'no',
      has_internet: welcomeData.hasInternet === 'yes' ? 'yes' : 'no',
      comfortable_with_tracking: welcomeData.comfortableWithTracking === 'yes' ? 'yes' : 'no',
      // Shared fields for both roles
      primary_area_of_expertise: welcomeData.primaryExpertise,
      time_zone: welcomeData.timezone,
      portfolio_link: '',
      is_agent_open_to_calls_and_video_meetings: welcomeData.openToCalls === 'yes' ? 'yes' : 'no',
      does_agent_have_working_computer: welcomeData.hasComputer === 'yes' ? 'yes' : 'no',
      does_agent_have_stable_internet: welcomeData.hasInternet === 'yes' ? 'yes' : 'no',
      is_agent_comfortable_with_time_tracking_tools: welcomeData.comfortableWithTracking === 'yes' ? 'yes' : 'no',
      three_most_commonly_used_tools_or_platforms: welcomeData.tools ? [welcomeData.tools] : [],
      available_hours_agent_can_commit: hoursPerWeek,
      services: selectedServices
    }

    // Call signup API with complete data
    const response = await authService.signup(completeSignupData)

    if (response.success) {
      // Clear all signup data from localStorage
      localStorage.removeItem('signupBasicData')
      localStorage.removeItem('agentWelcomeData')
      localStorage.removeItem('selectedAgentServices')

      // Save user info to localStorage for future use
      const userInfo = {
        id: response.user?.id,
        email: basicData.email,
        role: basicData.role,
        fullName: completeSignupData.full_name,
        welcomeFormData: welcomeData,
        services: selectedServices,
        additionalFormData: form.value
      }
      localStorage.setItem('userInfo', JSON.stringify(userInfo))

      // Navigate to congrats page
      router.push('/agent/congrats')
    } else {
      // Handle field errors
      if (response.fieldErrors) {
        // Display general error for now
        generalError.value = 'Please check your form data and try again.'
      }
      // Handle general error
      if (response.error) {
        generalError.value = formatErrorMessage(response.error)
      } else {
        generalError.value = 'An error occurred during signup. Please check the form and try again.'
      }
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    generalError.value = 'An unexpected error occurred. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

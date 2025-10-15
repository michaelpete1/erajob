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
        <form class="space-y-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl animate-fade-up-delay-2" @submit.prevent="onSubmit">
          <!-- Error Messages -->
          <div v-if="generalError" class="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-white text-sm animate-fade-in">
            {{ generalError }}
          </div>

          <fieldset class="space-y-3 animate-slide-in-left">
            <legend class="text-sm font-semibold text-brand-teal">Expected Agent Work Hours <span class="text-red-500">*</span></legend>
            <label class="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <input v-model="form.workHours" type="radio" name="workHours" value="Part-Time (80 hours)" class="h-4 w-4 text-brand-teal focus:ring-brand-teal" required />
              Part-Time (80 hours)
            </label>
            <label class="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <input v-model="form.workHours" type="radio" name="workHours" value="Full-Time (160 hours)" class="h-4 w-4 text-brand-teal focus:ring-brand-teal" required />
              Full-Time (160 hours)
            </label>
          </fieldset>

          <fieldset class="space-y-3 animate-slide-in-right">
            <legend class="text-sm font-semibold text-brand-teal">How can we help you through the process? <span class="text-red-500">*</span></legend>
            <label class="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <input v-model="form.assistanceType" type="radio" name="assistanceType" value="Just hire me someone" class="h-4 w-4 text-brand-teal focus:ring-brand-teal" required />
              Just hire me someone
            </label>
            <label class="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <input v-model="form.assistanceType" type="radio" name="assistanceType" value="Need assistance with hiring, training, onboarding and management for first month" class="h-4 w-4 text-brand-teal focus:ring-brand-teal" required />
              Need assistance with hiring, training, onboarding and management for first month
            </label>
          </fieldset>

          <div class="space-y-3 pt-4 animate-fade-up-delay-4">
            <button type="submit" :disabled="isSubmitting || !form.workHours || !form.assistanceType" class="btn-pressable block w-full rounded-full bg-brand-teal px-6 py-3 text-center text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isSubmitting ? 'Submitting...' : 'Complete Signup' }}
            </button>
            <button type="button" class="btn-pressable block w-full rounded-full border border-brand-teal/30 bg-brand-teal/10 px-6 py-3 text-sm text-brand-teal hover:bg-brand-teal/20 transition-all duration-300" @click="$router.back()">Back</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../../services/authService'
import type { SignupData } from '../../types/api/auth'

const router = useRouter()
const isSubmitting = ref(false)
const generalError = ref('')
const fieldErrors = reactive<Record<string, string>>({})

// Form data for additional fields
const form = reactive({
  workHours: '',
  assistanceType: ''
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
  Object.keys(fieldErrors).forEach(key => delete fieldErrors[key as keyof typeof fieldErrors])

  try {
    // Get all stored data
    const basicData = JSON.parse(localStorage.getItem('signupBasicData') || '{}')
    const welcomeData = JSON.parse(localStorage.getItem('clientWelcomeData') || '{}')
    const selectedServices = JSON.parse(localStorage.getItem('selectedClientServices') || '[]')

    if (!basicData.email || !welcomeData.email) {
      alert('Signup information not found. Please start the signup process again.')
      router.push('/auth/signup')
      return
    }

    // Map work hours to API expected values
    let clientNeedAgentWorkHours = 'both'
    if (form.workHours === 'Part-Time (80 hours)') {
      clientNeedAgentWorkHours = '80'
    } else if (form.workHours === 'Full-Time (160 hours)') {
      clientNeedAgentWorkHours = '160'
    }

    // Map assistance type to API expected values
    let clientReasonForSigningUp = 'Just hire me someone'
    if (form.assistanceType === 'Need assistance with hiring, training, onboarding and management for first month') {
      clientReasonForSigningUp = 'Need assistance with hiring, training, onboarding and management for first month'
    }

    // Prepare complete signup data
    const completeSignupData: SignupData = {
      email: welcomeData.email || basicData.email,
      password: basicData.password,
      role: basicData.role as 'client' | 'agent',
      full_name: welcomeData.fullName,
      phone_number: welcomeData.phone,
      certificate_url: welcomeData.certificates || [],
      video_url: welcomeData.shortVideo,
      personality_url: welcomeData.personalityTest || '',
      // Client-specific fields
      company_name: welcomeData.companyName,
      company_email: welcomeData.companyEmail,
      company_address: welcomeData.companyAddress,
      company_website: welcomeData.companyWebsite,
      client_reason_for_signing_up: clientReasonForSigningUp,
      client_need_agent_work_hours_to_be: clientNeedAgentWorkHours,
      // Shared fields for both roles
      primary_area_of_expertise: welcomeData.primaryAreaOfExpertise,
      time_zone: welcomeData.timezone,
      portfolio_link: welcomeData.urlLink,
      is_agent_open_to_calls_and_video_meetings: welcomeData.openToCalls === 'yes' ? 'yes' : 'no',
      does_agent_have_working_computer: welcomeData.hasWorkingComputer === 'yes' ? 'yes' : 'no',
      does_agent_have_stable_internet: welcomeData.hasStableInternet === 'yes' ? 'yes' : 'no',
      is_agent_comfortable_with_time_tracking_tools: welcomeData.comfortableWithTimeTracking === 'yes' ? 'yes' : 'no',
      three_most_commonly_used_tools_or_platforms: [], // Clients don't specify tools
      available_hours_agent_can_commit: clientNeedAgentWorkHours === '80' ? '80' : clientNeedAgentWorkHours === '160' ? '160' : '80', // Map to valid enum values
      services: selectedServices
    }

    // Call signup API with complete data
    const response = await authService.signup(completeSignupData)

    if (response.success) {
      // Clear all signup data from localStorage
      localStorage.removeItem('signupBasicData')
      localStorage.removeItem('clientWelcomeData')
      localStorage.removeItem('selectedClientServices')

      // Save user info to localStorage for future use
      const userInfo = {
        id: response.user?.id,
        email: welcomeData.email || basicData.email,
        role: basicData.role,
        fullName: welcomeData.fullName,
        welcomeFormData: welcomeData,
        services: selectedServices,
        additionalFormData: form
      }
      localStorage.setItem('userInfo', JSON.stringify(userInfo))

      // Navigate to congrats page
      router.push('/client/congrats')
    } else {
      // Handle field errors
      if (response.fieldErrors) {
        Object.assign(fieldErrors, response.fieldErrors)
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

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
              {{ isSubmitting ? 'Saving...' : 'Next' }}
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

const router = useRouter()
const isSubmitting = ref(false)

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

const onSubmit = async () => {
  isSubmitting.value = true
  
  try {
    // Save additional details to localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    userInfo.additionalDetails = form.value
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    
    console.log('AgentAdditional: Saved additional details, navigating to congrats')
    
    // Navigate to congrats page
    await router.push('/agent/congrats')
    
  } catch (error) {
    console.error('Form submission error:', error)
    alert('There was an error saving your preferences. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

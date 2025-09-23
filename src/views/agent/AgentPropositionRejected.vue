<template>
  <div class="relative min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-red-700 flex items-center justify-center p-4 overflow-hidden">
    <div class="absolute top-0 right-0 h-32 w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-24 w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />
    
    <div class="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-40 right-32 w-1 h-1 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-32 left-40 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-20 right-20 w-2.5 h-2.5 bg-white/15 rounded-full animate-float-delayed-4" />

    <div class="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden animate-fade-up text-center p-8">
      <!-- Rejection Icon -->
      <div class="mb-6">
        <div class="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
      </div>

      <!-- Rejection Message -->
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Your Proposition Was Rejected</h1>
      
      <p class="text-gray-600 mb-6">
        We're sorry, but the client has decided not to move forward with your proposition at this time. Don't be discouraged - keep applying for other opportunities!
      </p>

      <!-- Job Details -->
      <div v-if="gigDetails" class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
        <h3 class="font-semibold text-red-600 mb-2">Job Details</h3>
        <p class="font-medium text-gray-800">{{ gigDetails.title }}</p>
        <p class="text-sm text-gray-600">Budget: ${{ gigDetails.price }}/hr</p>
        <p class="text-sm text-gray-600">Client: {{ gigDetails.client }}</p>
      </div>

      <!-- Rejection Reasons -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
        <h3 class="font-semibold text-yellow-800 mb-2">Possible Reasons</h3>
        <ul class="text-sm text-yellow-700 space-y-1">
          <li>• Not relevant to the topic</li>
          <li>• Lacks clarity or detail</li>
          <li>• Contains inaccurate information</li>
          <li>• Not actionable / no value added</li>
        </ul>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-3">
        <button @click="findMoreJobs" class="w-full bg-brand-teal text-white py-3 rounded-full font-semibold hover:bg-teal-600 transition-colors duration-200">
          Find More Jobs
        </button>
        <button @click="improveProposition" class="w-full bg-gray-100 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors duration-200">
          Improve Your Proposition
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const gigDetails = ref<any>(null)

onMounted(() => {
  // Retrieve gig details from localStorage
  try {
    const stored = localStorage.getItem('selectedGig')
    if (stored) {
      gigDetails.value = JSON.parse(stored)
    }
  } catch (e) {
    // ignore storage errors
  }
})

const findMoreJobs = () => {
  router.push('/agent/explore-gigs')
}

const improveProposition = () => {
  router.push('/agent/gigs-listing')
}
</script>

<style scoped>
/* Any specific styles not easily handled by Tailwind can go here */
</style>

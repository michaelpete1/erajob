<template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 flex items-center justify-center overflow-hidden">
    <div class="absolute top-0 right-0 h-32 w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-24 w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />
    
    <div class="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-40 right-32 w-1 h-1 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-32 left-40 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-20 right-20 w-2.5 h-2.5 bg-white/15 rounded-full animate-float-delayed-4" />

    <div class="relative z-10 w-full max-w-sm mx-auto px-4 py-6">
      <!-- Admin Badge -->
      <div class="absolute top-4 left-1/2 -translate-x-1/2 z-20 animate-fade-up">
        <div class="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
          <svg class="w-4 h-4 mr-1.5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-xs font-medium text-white">Admin Portal</span>
        </div>
      </div>
      
      <div class="flex flex-col items-center justify-center text-center py-12">
        <div class="mb-8 animate-bounce-in">
          <div class="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
            <svg class="w-10 h-10 text-brand-teal" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
            </svg>
          </div>
        </div>
        
        <h2 class="mb-2 text-3xl font-extrabold text-white animate-fade-up-delay-1">Admin Sign In</h2>
        <p class="mb-8 text-sm text-white/80 animate-fade-up-delay-1">Access the admin dashboard</p>
        
        <form @submit.prevent="onSubmit" class="space-y-4 w-full animate-fade-up-delay-2">
          <div class="relative animate-slide-in-left">
            <input
              id="admin-email"
              v-model="email"
              type="text"
              placeholder="Admin Email"
              class="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30 backdrop-blur-sm transition-all"
            />
          </div>
          <div class="relative animate-slide-in-right">
            <input
              id="admin-password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Admin Password"
              class="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30 backdrop-blur-sm transition-all"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            >
              <svg v-if="!showPassword" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
          
          <div v-if="errorMessage" class="bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-3 animate-fade-up-delay-3">
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-red-200" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-sm text-red-100">{{ errorMessage }}</span>
            </div>
          </div>
          
          <button
            type="submit"
            :disabled="isLoading"
            class="btn-pressable w-full rounded-full bg-white px-6 py-3 text-brand-teal font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-up-delay-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-brand-teal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
            <span v-else>Sign In to Admin Portal</span>
          </button>
        </form>
        
        <div class="mt-6 animate-fade-up-delay-4">
          <router-link to="/sign-in" class="text-sm text-white/80 hover:text-white underline transition-colors">
            ← Back to User Sign In
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const router = useRouter()

// Mock admin credentials - in a real app, this would be handled by a backend
const ADMIN_CREDENTIALS = {
  email: 'admin@erajob.com',
  password: 'admin123'
}

function onSubmit() {
  // Reset error message
  errorMessage.value = ''
  isLoading.value = true
  
  // Simulate API call delay
  setTimeout(() => {
    // Validate admin credentials
    if (email.value === ADMIN_CREDENTIALS.email && password.value === ADMIN_CREDENTIALS.password) {
      // Set admin authentication data
      localStorage.setItem('userToken', 'admin-token-' + Date.now())
      localStorage.setItem('userRole', 'admin')
      localStorage.setItem('userInfo', JSON.stringify({
        email: email.value,
        role: 'admin',
        loginTime: new Date().toISOString(),
        adminAccess: true
      }))
      
      // Redirect to admin job approval page
      router.push('/admin/job-approval')
    } else {
      // Show error message
      errorMessage.value = 'Invalid admin credentials. Please try again.'
    }
    
    isLoading.value = false
  }, 1000)
}
</script>

<style scoped>
/* Scoped styles can be added here */
</style>

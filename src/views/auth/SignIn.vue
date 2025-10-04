<template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 flex items-center justify-center overflow-hidden">
    <div class="absolute top-0 right-0 h-32 w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-24 w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />
    
    <div class="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-40 right-32 w-1 h-1 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-32 left-40 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-20 right-20 w-2.5 h-2.5 bg-white/15 rounded-full animate-float-delayed-4" />

    <div class="relative z-10 w-full max-w-sm mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <!-- Navigation Header -->
      <div class="absolute top-4 left-4 right-4 z-20 flex justify-between items-center animate-fade-up">
        <button @click="$router.push('/sign-up')" class="text-white/80 hover:text-white transition-colors text-sm font-medium">
          Sign Up
        </button>
      </div>
      
      <div class="flex flex-col items-center justify-center text-center py-12">
        <BrandLogo size="lg" class="mb-8 [filter:brightness(0)_invert(1)] animate-bounce-in" />
      <h2 class="mb-6 sm:mb-8 text-2xl sm:text-3xl font-extrabold text-white animate-fade-up-delay-1">Sign In</h2>
      
      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-white text-sm animate-fade-in">
        {{ error }}
      </div>
      
      <form @submit.prevent="onSubmit" class="space-y-4 w-full animate-fade-up-delay-2">
        <div class="relative animate-slide-in-left">
          <input
            id="email"
            v-model="email"
            type="text"
            placeholder="Email or Username"
            class="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30 backdrop-blur-sm transition-all"
          />
        </div>
        <div class="relative animate-slide-in-right">
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
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
        
        <!-- Role Selection -->
          <label class="block text-sm sm:text-base font-medium text-white mb-2">Select your role</label>
          <div class="grid grid-cols-3 gap-2 sm:gap-3">
            <button
              type="button"
              @click="selectedRole = 'client'"
              :class="[
                'flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 text-xs sm:text-sm font-medium',
                selectedRole === 'client'
                  ? 'bg-white text-brand-teal border-white shadow-lg'
                  : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20 hover:text-white'
              ]"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Client</span>
            </button>
            
            <button
              type="button"
              @click="selectedRole = 'agent'"
              :class="[
                'flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 text-xs sm:text-sm font-medium',
                selectedRole === 'agent'
                  ? 'bg-white text-brand-teal border-white shadow-lg'
                  : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20 hover:text-white'
              ]"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M12 18h.01" />
              </svg>
              <span>Agent</span>
            </button>
            
            <button
              type="button"
              @click="selectedRole = 'admin'"
              :class="[
                'flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 text-xs sm:text-sm font-medium',
                selectedRole === 'admin'
                  ? 'bg-white text-brand-teal border-white shadow-lg'
                  : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20 hover:text-white'
              ]"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Admin</span>
            </button>
          </div>
        
        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-full bg-white px-6 py-3.5 sm:py-4 text-brand-teal font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100 transition-all duration-300 animate-fade-up-delay-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span v-if="loading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-brand-teal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </span>
          <span v-else>Log In</span>
        </button>
      </form>
      <p class="mt-6 text-sm sm:text-base text-white/80 animate-fade-up-delay-4">
        Don't have an account? 
        <router-link to="/sign-up" class="font-semibold text-white hover:text-teal-100 underline transition-colors">Sign up</router-link>
      </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BrandLogo from '../../components/BrandLogo.vue'
import { useAuth } from '../../composables/useAuth'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const selectedRole = ref('client') // Default to client
const router = useRouter()
const { loading, error, clearError } = useAuth()

async function onSubmit() {
  clearError()
  
  if (!email.value || !password.value) {
    return
  }

  try {
    console.log('SignIn: Testing mode - bypassing authentication')
    
    // For testing purposes - bypass API calls
    const testUserInfo = {
      email: email.value || 'test@example.com',
      name: 'Test User',
      id: 'test-user-id',
      role: selectedRole.value
    }
    
    // Store test user data in localStorage
    localStorage.setItem('userInfo', JSON.stringify(testUserInfo))
    localStorage.setItem('userRole', selectedRole.value)
    
    console.log(`SignIn: Test login successful as ${selectedRole.value}`)
    
    // Redirect based on selected role
    let redirectPath = '/client/projects'
    if (selectedRole.value === 'agent') {
      redirectPath = '/agent/explore-gigs'
    } else if (selectedRole.value === 'admin') {
      redirectPath = '/admin/job-approval'
    }
    
    router.push(redirectPath)
    
  } catch (err) {
    console.error('SignIn: Login error:', err)
  }
}
</script>

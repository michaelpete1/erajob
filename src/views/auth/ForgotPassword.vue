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
      
      <div class="flex flex-col items-center justify-center text-center py-12">
        <BrandLogo size="lg" class="mb-8 [filter:brightness(0)_invert(1)] animate-bounce-in" />
        <h2 class="mb-4 text-3xl font-extrabold text-white animate-fade-up-delay-1">Forgot Password</h2>
        <p class="mb-8 text-white/80 text-sm animate-fade-up-delay-1">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        <!-- Success Message -->
        <div v-if="success" class="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-white text-sm animate-fade-in">
          {{ success }}
        </div>
        
        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-white text-sm animate-fade-in">
          {{ error }}
        </div>
        
        <form @submit.prevent="onSubmit" class="space-y-4 w-full animate-fade-up-delay-2">
          <div class="relative animate-slide-in-left">
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="Email address"
              class="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30 backdrop-blur-sm transition-all"
              required
            />
          </div>
          
          <button
            type="submit"
            :disabled="loading"
            class="btn-pressable w-full rounded-full bg-white px-6 py-3 text-brand-teal font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-up-delay-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-brand-teal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
            <span v-else>Send Reset Link</span>
          </button>
        </form>
        
        <div v-if="!success" class="mt-6 text-sm text-white/80 animate-fade-up-delay-4">
          Remember your password? 
          <router-link to="/sign-in" class="font-semibold text-white hover:text-teal-100 underline transition-colors">Sign in</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BrandLogo from '../../components/BrandLogo.vue'

const email = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)
const router = useRouter()

async function onSubmit() {
  loading.value = true
  error.value = null
  success.value = null
  
  try {
    console.log('ForgotPassword: Sending reset email to:', email.value)
    
    // Call the forgot password API
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value
      })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      success.value = 'Password reset link has been sent to your email address.'
      console.log('ForgotPassword: Reset email sent successfully')
      
      // Redirect to sign-in after 3 seconds
      setTimeout(() => {
        router.push('/sign-in')
      }, 3000)
    } else {
      error.value = data.detail || 'Failed to send reset email. Please try again.'
      console.error('ForgotPassword: API error:', data)
    }
  } catch (err) {
    error.value = 'Network error. Please check your connection and try again.'
    console.error('ForgotPassword: Network error:', err)
  } finally {
    loading.value = false
  }
}
</script>

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
      <!-- Navigation Header -->
      <div class="absolute top-4 left-4 right-4 z-20 flex justify-between items-center animate-fade-up">
        <button @click="$router.push('/sign-in')" class="text-white/80 hover:text-white transition-colors text-sm font-medium">
          Back to Sign In
        </button>
      </div>
      
      <div class="flex flex-col items-center justify-center text-center py-12">
        <BrandLogo size="lg" class="mb-8 [filter:brightness(0)_invert(1)] animate-bounce-in" />
        <h2 class="mb-4 text-3xl font-extrabold text-white animate-fade-up-delay-1">Reset Password</h2>
        <p class="mb-8 text-white/80 text-sm animate-fade-up-delay-1">
          Create a new password for your account.
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
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="New password"
              class="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30 backdrop-blur-sm transition-all"
              required
              minlength="8"
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
          
          <div class="relative animate-slide-in-right">
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm new password"
              class="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30 backdrop-blur-sm transition-all"
              required
              minlength="8"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            >
              <svg v-if="!showConfirmPassword" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
          
          <!-- Password Requirements -->
          <div class="text-left text-xs text-white/70 space-y-1 animate-fade-up-delay-3">
            <div class="flex items-center gap-2">
              <svg :class="['w-3 h-3', password.length >= 8 ? 'text-green-400' : 'text-white/40']" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span :class="password.length >= 8 ? 'text-green-400' : 'text-white/60'">At least 8 characters</span>
            </div>
            <div class="flex items-center gap-2">
              <svg :class="['w-3 h-3', password === confirmPassword && confirmPassword.length > 0 ? 'text-green-400' : 'text-white/40']" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span :class="password === confirmPassword && confirmPassword.length > 0 ? 'text-green-400' : 'text-white/60'">Passwords match</span>
            </div>
          </div>
          
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="btn-pressable w-full rounded-full bg-white px-6 py-3 text-brand-teal font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-up-delay-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-brand-teal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Resetting...
            </span>
            <span v-else>Reset Password</span>
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
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BrandLogo from '../../components/BrandLogo.vue'

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)
const router = useRouter()
const route = useRoute()

const isFormValid = computed(() => {
  return password.value.length >= 8 && password.value === confirmPassword.value
})

async function onSubmit() {
  if (!isFormValid.value) {
    error.value = 'Please ensure your password meets all requirements.'
    return
  }
  
  loading.value = true
  error.value = null
  success.value = null
  
  try {
    const token = route.query.token as string
    
    if (!token) {
      error.value = 'Invalid or expired reset link.'
      return
    }
    
    console.log('ResetPassword: Resetting password with token')
    
    // Call the reset password API
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        new_password: password.value
      })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      success.value = 'Password has been reset successfully. You will be redirected to sign in.'
      console.log('ResetPassword: Password reset successful')
      
      // Redirect to sign-in after 3 seconds
      setTimeout(() => {
        router.push('/sign-in')
      }, 3000)
    } else {
      error.value = data.detail || 'Failed to reset password. The link may have expired.'
      console.error('ResetPassword: API error:', data)
    }
  } catch (err) {
    error.value = 'Network error. Please check your connection and try again.'
    console.error('ResetPassword: Network error:', err)
  } finally {
    loading.value = false
  }
}
</script>

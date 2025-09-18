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
      
      <div class="rounded-2xl bg-white/95 backdrop-blur-sm px-6 py-12 text-center shadow-xl animate-fade-up-delay-2">
        <div class="flex justify-center mb-6 animate-bounce">
          <span class="text-4xl">👋</span>
        </div>
        
        <h2 class="text-3xl md:text-4xl font-extrabold text-brand-teal mb-6 animate-fade-up-delay-1">Welcome Back</h2>
        
        <div class="mx-auto max-w-sm text-left space-y-4 text-gray-700 animate-fade-up-delay-2">
          <p class="text-base leading-relaxed">
            <strong>Once onboarding is complete, this page will no longer be visible.</strong>
          </p>
          <p class="text-base leading-relaxed">
            If you have completed onboarding and are still seeing this, contact us.
          </p>
        </div>

        <div class="mt-8 animate-fade-up-delay-4">
          <button 
            @click="logout" 
            class="btn-pressable block w-full rounded-full bg-brand-teal px-8 py-3 text-center text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Continue to Services
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  
  localStorage.removeItem('userToken')
  localStorage.removeItem('userInfo')
  localStorage.removeItem('selectedAgentServices')
  
  
  router.push('/sign-in')
}
</script>

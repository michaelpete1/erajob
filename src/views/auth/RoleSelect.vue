<template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 flex items-center justify-center overflow-hidden">
    <!-- Back arrow at top left -->
    <button @click="$router.back()" class="absolute top-4 left-4 z-20 text-brand-teal hover:text-brand-teal/80 transition-colors animate-fade-up">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    
    <!-- Animated decorative circles -->
    <div class="absolute top-0 right-0 h-32 w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-24 w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />
    
    <!-- Floating particles -->
    <div class="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-40 right-32 w-1 h-1 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-32 left-40 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-20 right-20 w-2.5 h-2.5 bg-white/15 rounded-full animate-float-delayed-4" />

    <div class="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center justify-center text-center py-12">
      <h2 class="mb-8 text-3xl font-extrabold text-white animate-fade-up-delay-1">Select a role</h2>
      <div class="space-y-4 w-full animate-fade-up-delay-2">
        <router-link
          to="/client/welcome"
          class="btn-pressable block w-full rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-brand-teal shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-slide-in-left"
        >
          I am a Client
        </router-link>
        <router-link
          to="/agent/welcome"
          class="btn-pressable block w-full rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-brand-teal shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-slide-in-right"
        >
          I am an Agent
        </router-link>
      </div>
      <div class="mt-8 animate-fade-up-delay-3">
        <router-link to="/sign-in" class="text-xs text-white/80 hover:text-white underline transition-colors">Back to Sign in</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Removed unused PageContainer import
// Hook up role selection later
</script>

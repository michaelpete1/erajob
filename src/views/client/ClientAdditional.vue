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
      <header class="sticky top-0 z-10 flex items-center justify-between border-b border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 md:rounded-t-2xl md:border-x animate-fade-up">
        <button @click="$router.push('/client/services')" class="text-white/80 hover:text-white transition-colors flex items-center gap-2 text-sm animate-bounce-in">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div class="flex items-center gap-2 animate-fade-up-delay-1">
          <div class="w-2 h-2 rounded-full bg-white"></div>
          <div class="w-2 h-2 rounded-full bg-white"></div>
          <div class="w-2 h-2 rounded-full bg-white"></div>
          <div class="w-2 h-2 rounded-full bg-white/60"></div>
        </div>
        <div class="w-6" />
      </header>

      <div class="mx-auto w-full max-w-md px-4 py-6">
        <form class="space-y-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl animate-fade-up-delay-2">
          <fieldset class="space-y-3 animate-slide-in-left">
            <legend class="text-sm font-semibold text-brand-teal">Expected Agent Work Hours</legend>
            <label class="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <input type="checkbox" class="h-4 w-4 text-brand-teal focus:ring-brand-teal" />
              Part-Time (80 hours)
            </label>
            <label class="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <input type="checkbox" class="h-4 w-4 text-brand-teal focus:ring-brand-teal" />
              Full-Time (160 hours)
            </label>
          </fieldset>

          <fieldset class="space-y-3 animate-slide-in-right">
            <legend class="text-sm font-semibold text-brand-teal">How can we help you through the process?</legend>
            <label class="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <input type="checkbox" class="h-4 w-4 text-brand-teal focus:ring-brand-teal" />
              Just hire me someone
            </label>
            <label class="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <input type="checkbox" class="h-4 w-4 text-brand-teal focus:ring-brand-teal" />
              Need assistance with hiring, training, onboarding and management for first month
            </label>
          </fieldset>

          <div class="space-y-3 pt-4 animate-fade-up-delay-4">
            <router-link to="/client/congrats" class="btn-pressable block w-full rounded-full bg-brand-teal px-6 py-3 text-center text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              Next
            </router-link>
            <button type="button" class="btn-pressable block w-full rounded-full border border-brand-teal/30 bg-brand-teal/10 px-6 py-3 text-sm text-brand-teal hover:bg-brand-teal/20 transition-all duration-300" @click="$router.back()">Back</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

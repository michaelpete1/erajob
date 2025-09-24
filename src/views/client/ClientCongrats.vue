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
      <!-- Navigation Header -->
      <header class="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white/10 backdrop-blur-sm rounded-t-2xl animate-fade-up">
        <button @click="$router.push('/client/additional')" class="text-white/80 hover:text-white transition-colors flex items-center gap-2 text-sm animate-bounce-in">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div class="flex items-center gap-2 animate-fade-up-delay-1">
          <div class="w-2 h-2 rounded-full bg-white"></div>
          <div class="w-2 h-2 rounded-full bg-white"></div>
          <div class="w-2 h-2 rounded-full bg-white"></div>
          <div class="w-2 h-2 rounded-full bg-white"></div>
        </div>
        <div class="w-6" />
      </header>
      
      <div class="rounded-2xl bg-white/95 backdrop-blur-sm px-6 py-12 text-center shadow-xl animate-fade-up-delay-2">
      <div class="flex justify-center mb-4 animate-bounce">
        <span class="text-4xl">🎉</span>
      </div>
      <h2 class="text-2xl md:text-3xl font-extrabold text-brand-teal mb-2 animate-fade-up-delay-1">Congratulations!</h2>
      <p class="text-base md:text-lg font-semibold text-brand-teal mb-4 animate-fade-up-delay-2">Your client account has been created successfully!</p>
      <div class="mx-auto mt-2 max-w-sm text-left space-y-3 text-gray-700 animate-fade-up-delay-3">
        <p>Welcome to ERA! Your client account is now ready to help you find the perfect talent for your projects.</p>
        <ul class="list-disc pl-5 space-y-1">
          <li>Access to skilled professionals across various industries.</li>
          <li>Streamlined hiring process with vetted candidates.</li>
          <li>Dedicated support for your project needs.</li>
          <li>Flexible hiring options to match your requirements.</li>
        </ul>
        <p>We're excited to help you build your dream team!</p>
      </div>

      <router-link to="/agent/welcome-back" class="btn-pressable mt-10 inline-flex items-center justify-center rounded-full bg-brand-teal px-8 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-up-delay-4">
        Next
      </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

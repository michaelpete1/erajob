<template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 flex items-center justify-center overflow-hidden">
    <div class="absolute top-0 right-0 h-24 w-24 sm:h-32 sm:w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-20 w-20 sm:h-24 sm:w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />
    
    <div class="absolute top-16 left-16 sm:top-20 sm:left-20 w-2 h-2 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-32 right-24 sm:top-40 sm:right-32 w-1 h-1 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-24 left-32 sm:bottom-32 sm:left-40 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-16 right-16 sm:bottom-20 sm:right-20 w-2.5 h-2.5 bg-white/15 rounded-full animate-float-delayed-4" />

    <div class="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6 py-6 sm:py-8">
      
      <div class="rounded-2xl bg-white/95 backdrop-blur-sm px-4 sm:px-6 py-8 sm:py-12 text-center shadow-xl animate-fade-up-delay-2">
        <div class="flex justify-center mb-4 animate-bounce">
          <span class="text-3xl sm:text-4xl">💼</span>
        </div>
        <h2 class="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-teal mb-2 animate-fade-up-delay-1">Explore Gigs</h2>
        <p class="text-sm sm:text-base md:text-lg font-semibold text-brand-teal mb-4 animate-fade-up-delay-2">Discover exciting opportunities</p>
        <div class="mx-auto mt-2 max-w-xs sm:max-w-sm text-left space-y-3 text-gray-700 animate-fade-up-delay-3">
          <p class="text-sm sm:text-base">Browse through available gigs and find the perfect match for your skills and expertise.</p>
          <ul class="list-disc pl-5 space-y-1 text-sm sm:text-base">
            <li>Various gig categories to choose from</li>
            <li>Competitive earnings starting at $13-14 per hour</li>
            <li>Flexible work arrangements</li>
            <li>Quick and easy application process</li>
            <li>Build your portfolio and gain experience</li>
          </ul>
          <p class="text-sm sm:text-base">Start your journey as an ERA agent today!</p>
        </div>

        <router-link to="/agent/gigs-listing" class="btn-pressable mt-8 sm:mt-10 inline-flex items-center justify-center rounded-full bg-brand-teal px-6 sm:px-8 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-up-delay-4 w-full sm:w-auto">
          Explore Gigs
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

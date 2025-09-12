<template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 flex items-center justify-center overflow-hidden">
    <!-- Animated decorative circles -->
    <div class="absolute top-0 right-0 h-32 w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-24 w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />
    
    <!-- Floating particles -->
    <div class="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-40 right-32 w-1 h-1 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-32 left-40 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-20 right-20 w-2.5 h-2.5 bg-white/15 rounded-full animate-float-delayed-4" />

    <div class="relative z-10 w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-sm px-6 py-12 text-center shadow-xl animate-fade-up-delay-2">
      <div class="flex justify-center mb-4 animate-bounce">
        <span class="text-4xl">🎉</span>
      </div>
      <h2 class="text-2xl md:text-3xl font-extrabold text-brand-teal mb-2 animate-fade-up-delay-1">Congratulations!</h2>
      <p class="text-base md:text-lg font-semibold text-brand-teal mb-4 animate-fade-up-delay-2">You've submitted your application</p>
      <div class="mx-auto mt-2 max-w-sm text-left space-y-3 text-gray-700 animate-fade-up-delay-3">
        <p>If you pass the selection process, you'll go through our free onboarding and training program.</p>
        <ul class="list-disc pl-5 space-y-1">
          <li>Structured learning to prepare you for real projects.</li>
          <li>Equip you with the tools and knowledge to succeed as an ERA agent.</li>
          <li>Completely free, no fees required.</li>
          <li>Once you pass the training, you'll be eligible to receive jobs as an ERA agent.</li>
        </ul>
        <p>We look forward to working with you!</p>
      </div>

      <router-link to="/" class="btn-pressable mt-10 inline-flex items-center justify-center rounded-full bg-brand-teal px-8 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-up-delay-4">
        Okay
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

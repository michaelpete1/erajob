
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

  <div class="relative content-front w-full max-w-xs sm:max-w-sm md:max-w-2xl mx-auto flex flex-col items-center justify-center text-center py-16 pb-8 md:pb-12">
      <BrandLogo size="lg" class="mb-8 [filter:brightness(0)_invert(1)] animate-bounce-in" />
      <h1 class="text-4xl md:text-5xl mb-2 text-white font-bold animate-fade-up-delay-1">Welcome</h1>
      <p class="text-base md:text-lg text-white font-semibold mb-1 animate-fade-up-delay-2">to</p>
      <p class="text-2xl md:text-3xl font-extrabold text-white mb-10 animate-fade-up-delay-3 bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">ERA onboarding</p>
      <router-link
        to="/sign-in"
        class="btn-pressable rounded-full bg-white px-8 py-3 text-brand-teal font-semibold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-up-delay-4"
      >
        Get started!
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import BrandLogo from '../components/BrandLogo.vue'
</script>

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

    <div class="relative z-10 w-full max-w-md mx-auto px-4 py-6">
      <header class="sticky top-0 z-10 flex items-center justify-between border-b border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 md:rounded-t-2xl md:border-x animate-fade-up-delay-1">
        <div class="flex items-center gap-2">
          <router-link to="/" class="text-brand-teal hover:text-brand-teal/80 transition-colors">
            <BrandLogo size="sm" class="filter invert brightness-200" />
          </router-link>
          <button class="text-sm text-brand-teal hover:text-brand-teal/80 transition-colors" @click="$router.back()">←</button>
        </div>
        <h1 class="text-sm font-semibold text-white">Available Gigs</h1>
        <div class="w-6" />
      </header>

      <div class="mx-auto w-full max-w-md px-4 py-6 animate-fade-up-delay-2">
        <div class="mb-4 animate-slide-in-left">
          <div class="relative">
            <input type="text" placeholder="Search gigs" class="w-full rounded-full border border-white/30 bg-white/10 px-5 py-2.5 pr-10 text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all" />
            <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/70">✕</span>
          </div>
        </div>

        <ul class="divide-y divide-white/20 rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm animate-slide-in-right">
          <li v-for="item in items" :key="item" class="px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors cursor-pointer">{{ item }}</li>
        </ul>

        <div class="px-2 py-6 space-y-3 animate-fade-up-delay-4">
          <router-link to="/agent/congrats" class="btn-pressable block w-full rounded-full bg-brand-teal px-6 py-3 text-center text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            Next
          </router-link>
          <button class="btn-pressable block w-full rounded-full border border-brand-teal/30 bg-brand-teal/10 px-6 py-3 text-sm text-brand-teal hover:bg-brand-teal/20 transition-all duration-300" @click="$router.back()">Back</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const items = [
  'Content Writing',
  'Graphic Design',
  'Web Development',
  'Data Entry',
  'Social Media Management',
  'Virtual Assistant',
  'Customer Service',
  'Translation',
  'Video Editing',
  'SEO Specialist',
]
</script>

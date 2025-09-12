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

    <div class="relative z-10 w-full max-w-md mx-auto flex flex-col items-center text-center pt-8 pb-12">
      <h2 class="mb-6 text-3xl font-extrabold text-white drop-shadow-md z-20 animate-fade-up-delay-1">Service Category</h2>
      <ul class="divide-y divide-gray-200 w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 animate-fade-up-delay-2">
        <ServiceRow :icon="PencilSquareIcon" title="Graphic Design" subtitle="Logo & brand identity" class="animate-slide-in-left" />
        <ServiceRow :icon="MegaphoneIcon" title="Digital Marketing" subtitle="Social media marketing, SEO" class="animate-slide-in-right" />
        <ServiceRow :icon="FilmIcon" title="Video & Animation" subtitle="Video editing & Video Reels" class="animate-slide-in-left" />
        <ServiceRow :icon="UserGroupIcon" title="Sales, customer, process..." subtitle="Producers & Composers" class="animate-slide-in-right" />
        <ServiceRow :icon="CodeBracketSquareIcon" title="Program & Tech" subtitle="Website & App development" class="animate-slide-in-left" />
        <ServiceRow :icon="CameraIcon" title="Product Photography" subtitle="Product photographers" class="animate-slide-in-right" />
        <ServiceRow :icon="CpuChipIcon" title="Build AI Service" subtitle="Build your AI app" class="animate-slide-in-left" />
        <ServiceRow :icon="ChartBarIcon" title="Data" subtitle="Data science & AI" class="animate-slide-in-right" />
      </ul>
      <div class="px-2 py-6 space-y-3 w-full animate-fade-up-delay-4">
        <router-link
          to="/client/additional"
          class="btn-pressable block w-full rounded-full bg-brand-teal px-6 py-3 text-center text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          Next
        </router-link>
        <button class="btn-pressable block w-full rounded-full border border-brand-teal/30 bg-brand-teal/10 px-6 py-3 text-sm text-brand-teal hover:bg-brand-teal/20 transition-all duration-300" @click="$router.back()">
          Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ServiceRow from '../widgets/ServiceRow.vue'
import { PencilSquareIcon, MegaphoneIcon, FilmIcon, UserGroupIcon, CodeBracketSquareIcon, CameraIcon, CpuChipIcon, ChartBarIcon } from '@heroicons/vue/24/outline'
import { onMounted, onErrorCaptured } from 'vue'

onMounted(() => {
  // eslint-disable-next-line no-console
  console.log('ClientServices mounted')
})

onErrorCaptured((err) => {
  // eslint-disable-next-line no-console
  console.error('ClientServices render error:', err)
  try { alert(`ClientServices error: ${String((err as any)?.message ?? err)}`) } catch (e) {}
  // allow global handler to also run
  return false
})
</script>

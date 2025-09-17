<template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 overflow-hidden">
    <!-- Animated decorative circles - responsive sizes -->
    <div class="absolute top-0 right-0 h-24 w-24 sm:h-32 sm:w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-20 w-20 sm:h-24 sm:w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />
    
    <!-- Floating particles - responsive positioning -->
    <div class="absolute top-16 left-16 sm:top-20 sm:left-20 w-2 h-2 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-32 right-24 sm:top-40 sm:right-32 w-1 h-1 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-24 left-32 sm:bottom-32 sm:left-40 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-16 right-16 sm:bottom-20 sm:right-20 w-2.5 h-2.5 bg-white/15 rounded-full animate-float-delayed-4" />

  <div class="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-24">
      <!-- Fixed top header (Projects) - responsive -->
      <header class="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 w-[90%] sm:w-[92%] max-w-3xl bg-brand-teal text-white rounded-xl px-3 sm:px-4 py-2 sm:py-3 z-50 shadow-md flex items-center justify-between">
        <div class="flex items-center gap-2 sm:gap-3">
          <button @click="$router.back()" aria-label="Back" class="p-1 text-white/95 hover:text-white">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-sm sm:text-base font-semibold">Projects</h1>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- mobile hamburger: visible only on small screens -->
          <button @click="openMobileNav = !openMobileNav" class="p-1 text-white/95 hover:text-white md:hidden" aria-label="Menu">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <!-- desktop nav: show icons inline on md+ -->
          <nav class="hidden md:flex items-center gap-4">
            <router-link to="/agent/gigs-listing" class="flex items-center gap-2 text-white/90 hover:text-white" aria-label="Projects">
              <PencilSquareIcon class="h-5 w-5" />
              <span class="hidden lg:inline text-sm">Projects</span>
            </router-link>
            <router-link to="/messages" class="flex items-center gap-2 text-white/90 hover:text-white" aria-label="Messages">
              <MusicalNoteIcon class="h-5 w-5" />
              <span class="hidden lg:inline text-sm">Messages</span>
            </router-link>
            <router-link to="/notifications" class="relative flex items-center gap-2 text-white/90 hover:text-white" aria-label="Notifications">
              <CheckCircleIcon class="h-5 w-5" />
              <span class="absolute -top-2 -right-3 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-brand-teal text-xs">3</span>
            </router-link>
            <router-link to="/settings" class="flex items-center gap-2 text-white/90 hover:text-white" aria-label="Settings">
              <AdjustmentsHorizontalIcon class="h-5 w-5" />
            </router-link>
          </nav>

          <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/90" />
        </div>
      </header>

      <!-- Mobile nav overlay (small) -->
      <div v-if="openMobileNav" class="fixed top-16 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white/95 text-brand-teal rounded-xl shadow-lg z-50 md:hidden">
        <div class="flex flex-col p-3">
          <router-link @click="openMobileNav = false" to="/agent/gigs-listing" class="py-2 px-3 rounded hover:bg-gray-100">Projects</router-link>
          <router-link @click="openMobileNav = false" to="/messages" class="py-2 px-3 rounded hover:bg-gray-100">Messages</router-link>
          <router-link @click="openMobileNav = false" to="/notifications" class="py-2 px-3 rounded hover:bg-gray-100">Notifications <span class="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-400 text-white text-xs">3</span></router-link>
          <router-link @click="openMobileNav = false" to="/settings" class="py-2 px-3 rounded hover:bg-gray-100">Settings</router-link>
        </div>
      </div>

      <!-- Small segmented control under header -->
      <div class="mt-2 mb-4 sm:mb-6 flex items-center justify-center">
        <div class="bg-white/95 rounded-full p-1 flex items-center gap-1 shadow-sm">
          <button class="px-3 sm:px-4 py-1 rounded-full bg-brand-teal text-white text-xs sm:text-sm font-medium">Active</button>
          <button class="px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium text-gray-600">Browse</button>
        </div>
      </div>

  <!-- Gigs Grid - responsive grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
        <!-- Gig Card 1 -->
  <router-link to="/agent/congrats" class="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-102 animate-fade-up-delay-1 block cursor-pointer">
          <div class="flex items-center mb-3 sm:mb-4 gap-3">
            <span class="text-2xl sm:text-3xl mr-0">📝</span>
            <h3 class="text-lg sm:text-xl font-bold text-brand-teal">Content Writing</h3>
          </div>
          <p class="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">Create engaging blog posts, articles, and web content for various clients.</p>
          <div class="flex justify-between items-center mb-3 sm:mb-4">
            <span class="text-xl sm:text-2xl font-bold text-brand-teal">$14.00</span>
            <span class="text-xs sm:text-sm text-gray-500">per hour</span>
          </div>
          <router-link to="/agent/congrats" class="w-full bg-brand-teal text-white py-2 px-4 rounded-full hover:bg-teal-600 transition-colors duration-300 text-center block text-sm sm:text-base" @click.stop>
            Apply Now
          </router-link>
        </router-link>

        <!-- Gig Card 2 -->
        <router-link to="/agent/congrats" class="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-up-delay-2 block cursor-pointer">
          <div class="flex items-center mb-3 sm:mb-4">
            <span class="text-2xl sm:text-3xl mr-3">🎨</span>
            <h3 class="text-lg sm:text-xl font-bold text-brand-teal">Graphic Design</h3>
          </div>
          <p class="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">Design logos, social media graphics, and marketing materials for businesses.</p>
          <div class="flex justify-between items-center mb-3 sm:mb-4">
            <span class="text-xl sm:text-2xl font-bold text-brand-teal">$13.50</span>
            <span class="text-xs sm:text-sm text-gray-500">per hour</span>
          </div>
          <router-link to="/agent/congrats" class="w-full bg-brand-teal text-white py-2 px-4 rounded-full hover:bg-teal-600 transition-colors duration-300 text-center block text-sm sm:text-base" @click.stop>
            Apply Now
          </router-link>
        </router-link>

        <!-- Gig Card 3 -->
        <router-link to="/agent/congrats" class="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-up-delay-3 block cursor-pointer">
          <div class="flex items-center mb-3 sm:mb-4">
            <span class="text-2xl sm:text-3xl mr-3">💻</span>
            <h3 class="text-lg sm:text-xl font-bold text-brand-teal">Web Development</h3>
          </div>
          <p class="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">Build and maintain websites, web applications, and digital solutions.</p>
          <div class="flex justify-between items-center mb-3 sm:mb-4">
            <span class="text-xl sm:text-2xl font-bold text-brand-teal">$15.00</span>
            <span class="text-xs sm:text-sm text-gray-500">per hour</span>
          </div>
          <router-link to="/agent/congrats" class="w-full bg-brand-teal text-white py-2 px-4 rounded-full hover:bg-teal-600 transition-colors duration-300 text-center block text-sm sm:text-base" @click.stop>
            Apply Now
          </router-link>
        </router-link>

        <!-- Gig Card 4 -->
        <router-link to="/agent/congrats" class="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-up-delay-4 block cursor-pointer">
          <div class="flex items-center mb-3 sm:mb-4">
            <span class="text-2xl sm:text-3xl mr-3">📊</span>
            <h3 class="text-lg sm:text-xl font-bold text-brand-teal">Data Entry</h3>
          </div>
          <p class="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">Input, organize, and manage data for various business processes and projects.</p>
          <div class="flex justify-between items-center mb-3 sm:mb-4">
            <span class="text-xl sm:text-2xl font-bold text-brand-teal">$13.00</span>
            <span class="text-xs sm:text-sm text-gray-500">per hour</span>
          </div>
          <router-link to="/agent/congrats" class="w-full bg-brand-teal text-white py-2 px-4 rounded-full hover:bg-teal-600 transition-colors duration-300 text-center block text-sm sm:text-base" @click.stop>
            Apply Now
          </router-link>
        </router-link>

        <!-- Gig Card 5 -->
        <router-link to="/agent/congrats" class="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-up-delay-5 block cursor-pointer">
          <div class="flex items-center mb-3 sm:mb-4">
            <span class="text-2xl sm:text-3xl mr-3">🎯</span>
            <h3 class="text-lg sm:text-xl font-bold text-brand-teal">Virtual Assistant</h3>
          </div>
          <p class="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">Provide administrative support, scheduling, and customer service remotely.</p>
          <div class="flex justify-between items-center mb-3 sm:mb-4">
            <span class="text-xl sm:text-2xl font-bold text-brand-teal">$13.75</span>
            <span class="text-xs sm:text-sm text-gray-500">per hour</span>
          </div>
          <router-link to="/agent/congrats" class="w-full bg-brand-teal text-white py-2 px-4 rounded-full hover:bg-teal-600 transition-colors duration-300 text-center block text-sm sm:text-base" @click.stop>
            Apply Now
          </router-link>
        </router-link>

        <!-- Gig Card 6 -->
        <router-link to="/agent/congrats" class="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-up-delay-6 block cursor-pointer">
          <div class="flex items-center mb-3 sm:mb-4">
            <span class="text-2xl sm:text-3xl mr-3">🗣️</span>
            <h3 class="text-lg sm:text-xl font-bold text-brand-teal">Customer Support</h3>
          </div>
          <p class="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">Assist customers with inquiries, issues, and provide excellent service.</p>
          <div class="flex justify-between items-center mb-3 sm:mb-4">
            <span class="text-xl sm:text-2xl font-bold text-brand-teal">$14.50</span>
            <span class="text-xs sm:text-sm text-gray-500">per hour</span>
          </div>
          <router-link to="/agent/congrats" class="w-full bg-brand-teal text-white py-2 px-4 rounded-full hover:bg-teal-600 transition-colors duration-300 text-center block text-sm sm:text-base" @click.stop>
            Apply Now
          </router-link>
        </router-link>
      </div>

  <!-- Back Button -->
  <div class="text-center mt-8">
        <router-link to="/agent/explore-gigs" class="inline-flex items-center text-white hover:text-white/80 transition-colors duration-300">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Explore Gigs
        </router-link>
      </div>
    </div>
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BottomNav from '../../components/BottomNav.vue'
import { PencilSquareIcon, AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline'
import { CheckCircleIcon, MusicalNoteIcon } from '@heroicons/vue/24/solid'

const openMobileNav = ref(false)
</script>

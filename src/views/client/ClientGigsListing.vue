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

    <div class="relative z-10 container mx-auto px-4 py-8">
      <!-- Home Logo (link to home) -->
      <router-link to="/" class="absolute top-4 left-4 z-20">
        <BrandLogo size="sm" class="filter invert brightness-200" />
      </router-link>
      
      <!-- Header -->
      <div class="text-center mb-8 animate-fade-up">
        <h1 class="text-3xl md:text-4xl font-extrabold text-white mb-2">Available Gigs</h1>
        <p class="text-lg text-white/90">Find the perfect gig for your skills</p>
      </div>

      <!-- Gigs Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <!-- Gig Card 1 -->
        <router-link to="/client/add-post" class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-up-delay-1 block cursor-pointer">
          <div class="flex items-center mb-4">
            <span class="text-3xl mr-3">📝</span>
            <h3 class="text-xl font-bold text-brand-teal">Content Writing</h3>
          </div>
          <p class="text-gray-700 mb-4">Create engaging blog posts, articles, and web content for various clients.</p>
          <div class="flex justify-between items-center mb-4">
            <span class="text-2xl font-bold text-brand-teal">$14.00</span>
            <span class="text-sm text-gray-500">per hour</span>
          </div>
          <router-link to="/client/job-application" class="w-full bg-brand-teal text-white py-2 px-4 rounded-full hover:bg-teal-600 transition-colors duration-300 text-center block" @click.stop>
            Apply Now
          </router-link>
        </router-link>

        <!-- Gig Card 2 -->
        <router-link to="/client/add-post" class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-up-delay-2 block cursor-pointer">
          <div class="flex items-center mb-4">
            <span class="text-3xl mr-3">🎨</span>
            <h3 class="text-xl font-bold text-brand-teal">Graphic Design</h3>
          </div>
          <p class="text-gray-700 mb-4">Design logos, social media graphics, and marketing materials for businesses.</p>
          <div class="flex justify-between items-center mb-4">
            <span class="text-2xl font-bold text-brand-teal">$15.00</span>
            <span class="text-sm text-gray-500">per hour</span>
          </div>
          <router-link to="/client/job-application" class="w-full bg-brand-teal text-white py-2 px-4 rounded-full hover:bg-teal-600 transition-colors duration-300 text-center block" @click.stop>
            Apply Now
          </router-link>
        </router-link>

        <!-- Gig Card 3 -->
        <router-link to="/client/add-post" class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-up-delay-3 block cursor-pointer">
          <div class="flex items-center mb-4">
            <span class="text-3xl mr-3">💻</span>
            <h3 class="text-xl font-bold text-brand-teal">Web Development</h3>
          </div>
          <p class="text-gray-700 mb-4">Build and maintain websites using modern frameworks and technologies.</p>
          <div class="flex justify-between items-center mb-4">
            <span class="text-2xl font-bold text-brand-teal">$18.00</span>
            <span class="text-sm text-gray-500">per hour</span>
          </div>
          <router-link to="/client/job-application" class="w-full bg-brand-teal text-white py-2 px-4 rounded-full hover:bg-teal-600 transition-colors duration-300 text-center block" @click.stop>
            Apply Now
          </router-link>
        </router-link>

        <!-- Gig Card 4 -->
        <router-link to="/client/add-post" class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-up-delay-4 block cursor-pointer">
          <div class="flex items-center mb-4">
            <span class="text-3xl mr-3">📊</span>
            <h3 class="text-xl font-bold text-brand-teal">Data Entry</h3>
          </div>
          <p class="text-gray-700 mb-4">Input and manage data accurately for various business operations.</p>
          <div class="flex justify-between items-center mb-4">
            <span class="text-2xl font-bold text-brand-teal">$13.00</span>
            <span class="text-sm text-gray-500">per hour</span>
          </div>
          <router-link to="/client/job-application" class="w-full bg-brand-teal text-white py-2 px-4 rounded-full hover:bg-teal-600 transition-colors duration-300 text-center block" @click.stop>
            Apply Now
          </router-link>
        </router-link>

        <!-- Gig Card 5 -->
        <router-link to="/client/add-post" class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-up-delay-5 block cursor-pointer">
          <div class="flex items-center mb-4">
            <span class="text-3xl mr-3">🎯</span>
            <h3 class="text-xl font-bold text-brand-teal">Virtual Assistant</h3>
          </div>
          <p class="text-gray-700 mb-4">Provide administrative support and manage tasks for busy professionals.</p>
          <div class="flex justify-between items-center mb-4">
            <span class="text-2xl font-bold text-brand-teal">$14.00</span>
            <span class="text-sm text-gray-500">per hour</span>
          </div>
          <router-link to="/client/job-application" class="w-full bg-brand-teal text-white py-2 px-4 rounded-full hover:bg-teal-600 transition-colors duration-300 text-center block" @click.stop>
            Apply Now
          </router-link>
        </router-link>

        <!-- Gig Card 6 -->
        <router-link to="/client/add-post" class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-up-delay-6 block cursor-pointer">
          <div class="flex items-center mb-4">
            <span class="text-3xl mr-3">📱</span>
            <h3 class="text-xl font-bold text-brand-teal">Social Media Management</h3>
          </div>
          <p class="text-gray-700 mb-4">Manage social media accounts and create engaging content for brands.</p>
          <div class="flex justify-between items-center mb-4">
            <span class="text-2xl font-bold text-brand-teal">$16.00</span>
            <span class="text-sm text-gray-500">per hour</span>
          </div>
          <router-link to="/client/job-application" class="w-full bg-brand-teal text-white py-2 px-4 rounded-full hover:bg-teal-600 transition-colors duration-300 text-center block" @click.stop>
            Apply Now
          </router-link>
        </router-link>
      </div>

      <!-- Back Button -->
      <div class="text-center mt-8">
        <router-link to="/client/explore-gigs" class="inline-flex items-center text-white hover:text-white/80 transition-colors duration-300">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Explore
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BrandLogo from '../../components/BrandLogo.vue'
</script>

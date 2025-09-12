<template>
  <PageContainer bg="bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 min-h-svh">
    <!-- Animated decorative circles -->
    <div class="absolute top-0 right-0 h-32 w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-24 w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />
    
    <!-- Floating particles -->
    <div class="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-40 right-32 w-1 h-1 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-32 left-40 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-20 right-20 w-2.5 h-2.5 bg-white/15 rounded-full animate-float-delayed-4" />
    
    <header class="sticky top-0 z-10 flex items-center justify-between border-b border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 md:rounded-t-2xl md:border-x animate-fade-up">
      <button class="text-sm text-brand-teal md:text-brand-teal hover:text-brand-teal/80 md:hover:text-brand-teal/90 transition-colors animate-bounce-in" @click="$router.back()">←</button>
      <h1 class="text-sm font-semibold text-white animate-fade-up-delay-1">Client Information</h1>
      <div class="w-6" />
    </header>

    <div class="mx-auto w-full max-w-md px-4 py-6">
      <form class="space-y-4 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl animate-fade-up-delay-2">
        <div class="animate-slide-in-left">
          <input v-model="form.email" type="email" placeholder="Email" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-right">
          <input v-model="form.phone" type="tel" placeholder="Phone Number" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-left">
          <input v-model="form.companyName" type="text" placeholder="Company Name" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-right">
          <input v-model="form.companyEmail" type="email" placeholder="Company email" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-left">
          <input v-model="form.companyAddress" type="text" placeholder="Company Address" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-right">
          <input v-model="form.companyWebsite" type="url" placeholder="Company Website" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-left">
          <input v-model="form.fullName" type="text" placeholder="Full Name" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-right">
          <input v-model="form.shortVideo" type="url" placeholder="Submit your 1min video (URL)" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-left">
          <input v-model="form.urlLink" type="url" placeholder="URL Link" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>

        <div class="rounded-md border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700 animate-fade-up-delay-3">
          <strong class="text-brand-teal">Background Check Consent:</strong>
          <p class="mt-1">Consent to ERA onboarding, conducting a background check as required by financial capability and project management.</p>
        </div>

      </form>
      <div class="space-y-3 pt-4 animate-fade-up-delay-4">
        <router-link
          to="/client/services"
          class="btn-pressable block w-full rounded-full bg-brand-teal px-6 py-3 text-center text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          Next
        </router-link>
        <button class="btn-pressable block w-full rounded-full border border-brand-teal/30 md:border-brand-teal bg-brand-teal/10 md:bg-brand-teal/5 px-6 py-3 text-sm text-brand-teal hover:bg-brand-teal/20 md:hover:bg-brand-teal/10 transition-all duration-300" @click="$router.back()">Back</button>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import PageContainer from '../components/PageContainer.vue'

const form = reactive({
  email: '',
  phone: '',
  companyName: '',
  companyEmail: '',
  companyAddress: '',
  companyWebsite: '',
  fullName: '',
  shortVideo: '',
  urlLink: '',
})
</script>


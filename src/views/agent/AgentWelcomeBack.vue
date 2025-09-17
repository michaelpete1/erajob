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
      <!-- Home Logo (link to home) -->
      <router-link to="/" class="absolute top-2 left-2 z-20">
        <BrandLogo size="sm" class="filter invert brightness-200" />
      </router-link>
      
      <div class="rounded-2xl bg-white/95 backdrop-blur-sm px-6 py-12 text-center shadow-xl animate-fade-up-delay-2">
        <div class="flex justify-center mb-6 animate-bounce">
          <span class="text-4xl">👋</span>
        </div>
        
        <h2 class="text-3xl md:text-4xl font-extrabold text-brand-teal mb-6 animate-fade-up-delay-1">Welcome Back</h2>
        
        <div class="mx-auto max-w-sm text-left space-y-4 text-gray-700 animate-fade-up-delay-2">
          <p class="text-base leading-relaxed">
            <strong>Once onboarding is complete, this page will no longer be visible.</strong>
          </p>
          <p class="text-base leading-relaxed">
            If you have completed onboarding and are still seeing this, contact us.
          </p>
        </div>

        <!-- Contact Information -->
        <div class="mt-8 p-4 bg-gray-50 rounded-lg animate-fade-up-delay-3">
          <h3 class="font-semibold text-brand-teal mb-3">Need Help?</h3>
          <div class="space-y-2 text-sm text-gray-600">
            <p class="flex items-center justify-center">
              <svg class="w-4 h-4 mr-2 text-brand-teal" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
              support@era.com
            </p>
            <p class="flex items-center justify-center">
              <svg class="w-4 h-4 mr-2 text-brand-teal" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
              </svg>
              +1 (555) 123-4567
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 space-y-3 animate-fade-up-delay-4">
          <router-link 
            to="/agent/services" 
            class="btn-pressable block w-full rounded-full bg-brand-teal px-8 py-3 text-center text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Continue to Services
          </router-link>
          
          <button 
            @click="contactSupport" 
            class="block w-full rounded-full border-2 border-brand-teal px-8 py-3 text-center text-sm font-semibold text-brand-teal hover:bg-brand-teal hover:text-white transition-all duration-300"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BrandLogo from '../../components/BrandLogo.vue'

const contactSupport = () => {
  // This would typically open a support ticket system or email client
  window.open('mailto:support@era.com?subject=Onboarding Support Request', '_blank')
}
</script>

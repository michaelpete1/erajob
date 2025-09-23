<template>
    <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 flex items-center justify-center overflow-hidden">
      <!-- Animated background elements -->
      <div class="absolute top-0 right-0 h-24 w-24 sm:h-32 sm:w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
      <div class="absolute bottom-0 left-0 h-20 w-20 sm:h-24 sm:w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
      <div class="absolute top-1/2 left-1/2 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />
      
      <div class="absolute top-16 left-16 sm:top-20 sm:left-20 w-2 h-2 bg-white/20 rounded-full animate-float-delayed-1" />
      <div class="absolute top-32 right-24 sm:top-40 sm:right-32 w-1 h-1 bg-white/30 rounded-full animate-float-delayed-2" />
      <div class="absolute bottom-24 left-32 sm:bottom-32 sm:left-40 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-delayed-3" />
      <div class="absolute bottom-16 right-16 sm:bottom-20 sm:right-20 w-2.5 h-2.5 bg-white/15 rounded-full animate-float-delayed-4" />
  
      <div class="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        
        <!-- Main content card -->
        <div class="rounded-2xl bg-white/95 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 text-center shadow-xl animate-fade-up-delay-2">
          <!-- Icon with bounce animation -->
          <div class="flex justify-center mb-4 sm:mb-6 animate-bounce">
            <span class="text-3xl sm:text-4xl lg:text-5xl">💼</span>
          </div>
          
          <!-- Title -->
          <h2 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-teal mb-2 sm:mb-3 animate-fade-up-delay-1">Explore Gigs</h2>
          
          <!-- Subtitle -->
          <p class="text-sm sm:text-base lg:text-lg font-semibold text-brand-teal mb-4 sm:mb-6 animate-fade-up-delay-2">Discover exciting opportunities</p>
          
          <!-- Content section -->
          <div class="mx-auto mt-2 sm:mt-4 max-w-xs sm:max-w-sm lg:max-w-md text-left space-y-3 sm:space-y-4 text-gray-700 animate-fade-up-delay-3">
            <!-- Description paragraph -->
            <p class="text-sm sm:text-base lg:text-base leading-relaxed">
              Browse through available gigs and find the perfect match for your skills and expertise.
            </p>
            
            <!-- Benefits list -->
            <ul class="list-disc pl-5 sm:pl-6 space-y-1 sm:space-y-2 text-sm sm:text-base lg:text-base">
              <li class="leading-relaxed">Various gig categories to choose from</li>
              <li class="leading-relaxed">Competitive earnings starting at $13-14 per hour</li>
              <li class="leading-relaxed">Flexible work arrangements</li>
              <li class="leading-relaxed">Quick and easy application process</li>
              <li class="leading-relaxed">Build your portfolio and gain experience</li>
            </ul>
            
            <!-- Call to action -->
            <p class="text-sm sm:text-base lg:text-base font-medium leading-relaxed">
              Start your journey as an ERA agent today!
            </p>
          </div>
  
          <!-- Action button -->
          <router-link 
            to="/agent/gigs-listing" 
            class="btn-pressable mt-6 sm:mt-8 lg:mt-10 inline-flex items-center justify-center rounded-full bg-brand-teal px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-up-delay-4 w-full sm:w-auto min-w-[120px] sm:min-w-[140px]"
          >
            <span class="flex items-center gap-2">
              Next
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </router-link>
        </div>
      </div>
    </div>
    
    <!-- Agent Bottom Navigation -->
    <AgentBottomNav />
  </template>
  
  <script setup lang="ts">
  import AgentBottomNav from '../../components/AgentBottomNav.vue'
  </script>

<style scoped>
.bg-brand-teal { background-color: #0fb9a5 }
.text-brand-teal { color: #0fb9a5 }

/* Custom animations */
@keyframes fade-up-delay-1 {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-up-delay-2 {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-up-delay-3 {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-up-delay-4 {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

@keyframes pulse-slow-reverse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(-50%, -50%) translateY(0px);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-10px);
  }
}

@keyframes float-delayed-1 {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes float-delayed-2 {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes float-delayed-3 {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
}

@keyframes float-delayed-4 {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-4px);
  }
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -20px, 0) scaleY(1.1);
  }
  70% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -10px, 0) scaleY(1.05);
  }
  90% {
    transform: translate3d(0, -4px, 0) scaleY(1.02);
  }
}

.animate-fade-up-delay-1 {
  animation: fade-up-delay-1 0.6s ease-out forwards;
}

.animate-fade-up-delay-2 {
  animation: fade-up-delay-2 0.6s ease-out 0.2s forwards;
  opacity: 0;
}

.animate-fade-up-delay-3 {
  animation: fade-up-delay-3 0.6s ease-out 0.4s forwards;
  opacity: 0;
}

.animate-fade-up-delay-4 {
  animation: fade-up-delay-4 0.6s ease-out 0.6s forwards;
  opacity: 0;
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

.animate-pulse-slow-reverse {
  animation: pulse-slow-reverse 4s ease-in-out infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed-1 {
  animation: float-delayed-1 3s ease-in-out infinite;
}

.animate-float-delayed-2 {
  animation: float-delayed-2 4s ease-in-out infinite;
}

.animate-float-delayed-3 {
  animation: float-delayed-3 3.5s ease-in-out infinite;
}

.animate-float-delayed-4 {
  animation: float-delayed-4 2.5s ease-in-out infinite;
}

.animate-bounce {
  animation: bounce 2s ease-in-out infinite;
}

/* Button press effect */
.btn-pressable:active {
  transform: scale(0.95);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .animate-fade-up-delay-1,
  .animate-fade-up-delay-2,
  .animate-fade-up-delay-3,
  .animate-fade-up-delay-4 {
    animation-duration: 0.5s;
  }
}
</style>
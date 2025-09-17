<template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 overflow-hidden">
    <!-- Animated decorative circles -->
    <div class="absolute top-0 right-0 h-24 w-24 sm:h-32 sm:w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-20 w-20 sm:h-24 sm:w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />
    
    <!-- Floating particles -->
    <div class="absolute top-16 left-16 sm:top-20 sm:left-20 w-2 h-2 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-32 right-24 sm:top-40 sm:right-32 w-1 h-1 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-24 left-32 sm:bottom-32 sm:left-40 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-16 right-16 sm:bottom-20 sm:right-20 w-2.5 h-2.5 bg-white/15 rounded-full animate-float-delayed-4" />

    <div class="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-24">
      <!-- Fixed top header -->
      <header class="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 w-[90%] sm:w-[92%] max-w-3xl bg-brand-teal text-white rounded-xl px-3 sm:px-4 py-2 sm:py-3 z-50 shadow-md flex items-center justify-between">
        <div class="flex items-center gap-2 sm:gap-3">
          <button @click="$router.back()" aria-label="Back" class="p-1 text-white/95 hover:text-white">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-sm sm:text-base font-semibold">Terms & Conditions</h1>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <button @click="openMobileNav = !openMobileNav" class="p-1 text-white/95 hover:text-white md:hidden" aria-label="Menu">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <!-- desktop nav -->
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

      <!-- Mobile nav overlay -->
      <div v-if="openMobileNav" class="fixed top-16 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white/95 text-brand-teal rounded-xl shadow-lg z-50 md:hidden">
        <div class="flex flex-col p-3">
          <router-link @click="openMobileNav = false" to="/agent/gigs-listing" class="py-2 px-3 rounded hover:bg-gray-100">Projects</router-link>
          <router-link @click="openMobileNav = false" to="/messages" class="py-2 px-3 rounded hover:bg-gray-100">Messages</router-link>
          <router-link @click="openMobileNav = false" to="/notifications" class="py-2 px-3 rounded hover:bg-gray-100">Notifications <span class="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-400 text-white text-xs">3</span></router-link>
          <router-link @click="openMobileNav = false" to="/settings" class="py-2 px-3 rounded hover:bg-gray-100">Settings</router-link>
        </div>
      </div>

      <!-- Main Content -->
      <div class="mt-20 max-w-4xl mx-auto">
        <!-- Earnings Overview Card -->
        <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg mb-6 animate-fade-up">
          <div class="text-center mb-6">
            <h2 class="text-2xl sm:text-3xl font-bold text-brand-teal mb-2">Earnings Structure</h2>
            <p class="text-gray-600">Transparent pricing for your freelance success</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <!-- Basic Tier -->
            <div class="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 sm:p-6 text-center">
              <div class="text-3xl mb-3">🌟</div>
              <h3 class="text-lg font-bold text-brand-teal mb-2">Basic Projects</h3>
              <div class="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">$50 - $200</div>
              <p class="text-sm text-gray-600">Simple tasks, quick completion</p>
              <ul class="mt-3 text-left text-sm text-gray-600 space-y-1">
                <li>• Content writing</li>
                <li>• Data entry</li>
                <li>• Virtual assistance</li>
              </ul>
            </div>

            <!-- Professional Tier -->
            <div class="bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl p-4 sm:p-6 text-center transform scale-105 shadow-md">
              <div class="text-3xl mb-3">💎</div>
              <h3 class="text-lg font-bold text-brand-teal mb-2">Professional</h3>
              <div class="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">$200 - $500</div>
              <p class="text-sm text-gray-600">Specialized expertise required</p>
              <ul class="mt-3 text-left text-sm text-gray-600 space-y-1">
                <li>• Graphic design</li>
                <li>• Web development</li>
                <li>• Marketing campaigns</li>
              </ul>
            </div>

            <!-- Expert Tier -->
            <div class="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 sm:p-6 text-center">
              <div class="text-3xl mb-3">🚀</div>
              <h3 class="text-lg font-bold text-brand-teal mb-2">Expert Level</h3>
              <div class="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">$500 - $2000+</div>
              <p class="text-sm text-gray-600">Complex, high-value projects</p>
              <ul class="mt-3 text-left text-sm text-gray-600 space-y-1">
                <li>• Full-stack development</li>
                <li>• Business consulting</li>
                <li>• Project management</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Commission Structure -->
        <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg mb-6 animate-fade-up-delay-1">
          <h3 class="text-xl sm:text-2xl font-bold text-brand-teal mb-4">Commission Structure</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
              <span class="font-medium text-gray-700">Platform Fee</span>
              <span class="text-lg font-bold text-brand-teal">15%</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
              <span class="font-medium text-gray-700">Your Earnings</span>
              <span class="text-lg font-bold text-green-600">85%</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
              <span class="font-medium text-gray-700">Payment Processing</span>
              <span class="text-lg font-bold text-brand-teal">2.9% + $0.30</span>
            </div>
          </div>
        </div>

        <!-- Terms and Conditions Content -->
        <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg animate-fade-up-delay-2">
          <h3 class="text-xl sm:text-2xl font-bold text-brand-teal mb-6">Terms & Conditions</h3>
          
          <div class="space-y-6 text-gray-700">
            <section>
              <h4 class="text-lg font-semibold text-brand-teal mb-3">1. Acceptance of Terms</h4>
              <p class="mb-3">By using EraJob, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our platform.</p>
            </section>

            <section>
              <h4 class="text-lg font-semibold text-brand-teal mb-3">2. Payment Terms</h4>
              <ul class="list-disc pl-6 space-y-2">
                <li>All payments are processed securely through our payment partners</li>
                <li>Freelancers receive 85% of the project value</li>
                <li>Platform fee is 15% for all completed projects</li>
                <li>Payments are released within 24-48 hours after project completion and client approval</li>
                <li>Minimum withdrawal amount is $20</li>
              </ul>
            </section>

            <section>
              <h4 class="text-lg font-semibold text-brand-teal mb-3">3. Project Guidelines</h4>
              <ul class="list-disc pl-6 space-y-2">
                <li>All projects must be completed within the agreed timeframe</li>
                <li>Quality standards must be maintained as per client requirements</li>
                <li>Communication should be professional and timely</li>
                <li>Plagiarism or copyright infringement is strictly prohibited</li>
                <li>Confidentiality of client information must be maintained</li>
              </ul>
            </section>

            <section>
              <h4 class="text-lg font-semibold text-brand-teal mb-3">4. Dispute Resolution</h4>
              <ul class="list-disc pl-6 space-y-2">
                <li>All disputes will be mediated by EraJob support team</li>
                <li>Decisions made by EraJob are final and binding</li>
                <li>Both parties agree to cooperate in good faith during dispute resolution</li>
                <li>Resolution timeline is typically 3-5 business days</li>
              </ul>
            </section>

            <section>
              <h4 class="text-lg font-semibold text-brand-teal mb-3">5. Account Termination</h4>
              <ul class="list-disc pl-6 space-y-2">
                <li>EraJob reserves the right to terminate accounts for violations</li>
                <li>Reasons for termination include fraud, harassment, or repeated policy violations</li>
                <li>Terminated accounts forfeit any pending earnings</li>
                <li>Users may appeal termination decisions within 30 days</li>
              </ul>
            </section>

            <section>
              <h4 class="text-lg font-semibold text-brand-teal mb-3">6. Limitation of Liability</h4>
              <p>EraJob is not responsible for disputes between freelancers and clients, project quality issues, or financial losses resulting from platform use. Our maximum liability is limited to the platform fees collected from the disputed project.</p>
            </section>

            <section>
              <h4 class="text-lg font-semibold text-brand-teal mb-3">7. Changes to Terms</h4>
              <p>EraJob reserves the right to modify these terms at any time. Users will be notified of significant changes via email or platform notifications. Continued use of the platform constitutes acceptance of modified terms.</p>
            </section>

            <div class="mt-8 p-4 bg-teal-50 rounded-lg border-l-4 border-brand-teal">
              <p class="text-sm font-medium text-brand-teal">
                <strong>Last Updated:</strong> September 17, 2025<br>
                <strong>Contact:</strong> support@erajob.com for any questions regarding these terms.
              </p>
            </div>
          </div>
        </div>

        <!-- Accept Button -->
        <div class="text-center mt-8">
          <button @click="acceptTerms" class="bg-brand-teal hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
            I Accept the Terms & Conditions
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { PencilSquareIcon, AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline'
import { CheckCircleIcon, MusicalNoteIcon } from '@heroicons/vue/24/solid'

const router = useRouter()
const openMobileNav = ref(false)

const acceptTerms = () => {
  // Store acceptance in localStorage or state management
  localStorage.setItem('termsAccepted', 'true')
  // Navigate back or to a specific page
  router.back()
}
</script>

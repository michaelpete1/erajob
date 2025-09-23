<script setup lang="ts">
import ClientBottomNav from '../../components/ClientBottomNav.vue'

const job = {
  budget: "$68/hr",
  title: "Complete Freelancer Application UI/UX Revamp",
  description: `
We're looking for a skilled designer to completely revamp the UI/UX of our Freelancer application.
The goal is to modernize the user experience by making the interface more modern, intuitive, and visually appealing.
`,
  details: [
    "Simplify navigation and reduce clutter to improve the overall user experience.",
    "Introduce modern design trends for a clean and professional look.",
    "Create seamless interactions and transitions for a more engaging user experience.",
    "Incorporate new methods to showcase job posts and align with design trends.",
    "Ensure compatibility with various screen sizes and devices."
  ],
  client: {
    reviews: "3 Reviews",
    rating: 5,
    location: "Sydney, Australia",
    memberSince: "June 03 September 2019",
  },
  engagement: [
    "Contracted less than 5 freelancers",
    "Invited 10 freelancers",
    "Completed 10+ Projects"
  ]
};
</script>

<template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 flex items-center justify-center p-4 overflow-hidden">
    <div class="absolute top-0 right-0 h-32 w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-24 w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />
    
    <div class="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-40 right-32 w-1 h-1 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-32 left-40 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-20 right-20 w-2.5 h-2.5 bg-white/15 rounded-full animate-float-delayed-4" />

    <div class="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden animate-fade-up">

      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <div class="flex items-center gap-2">
          <router-link to="/client/gigs-listing" class="text-lg text-brand-teal hover:text-teal-600 transition-colors">←</router-link>
        </div>
        <span class="font-medium text-brand-teal">Job Application</span>
        <button class="text-xl text-brand-teal">☰</button>
      </div>

      <div class="p-4 bg-gradient-to-r from-brand-teal/10 to-teal-600/10">
        <p class="font-semibold text-brand-teal">Budget: <span class="text-gray-700">{{ job.budget }}</span></p>
      </div>

      <div class="px-4 py-3">
        <h2 class="font-bold text-lg mb-2 text-brand-teal">{{ job.title }}</h2>
        <p class="text-gray-700 text-sm mb-3 whitespace-pre-line">
          {{ job.description }}
        </p>

        <ul class="space-y-2 mb-4">
          <li v-for="(item, i) in job.details" :key="i" class="flex items-start space-x-2 text-sm text-gray-700">
            <span class="text-brand-teal mt-1">•</span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>

      <div class="bg-gradient-to-r from-brand-teal to-teal-600 text-white p-4 mx-4 mb-4 rounded-xl shadow-lg">
        <h3 class="font-semibold mb-2 text-lg">About the Client</h3>
        <div class="flex items-center space-x-2 mb-2">
          <span>{{ job.client.reviews }}</span>
          <span class="text-yellow-300">★★★★★</span>
        </div>
        <p class="text-sm mt-1 flex items-center space-x-2">
          <span>📍</span>
          <span>{{ job.client.location }}</span>
        </p>
        <p class="text-sm flex items-center space-x-2">
          <span>📅</span>
          <span>Member since {{ job.client.memberSince }}</span>
        </p>
      </div>

      <div class="px-4 mb-4">
        <h3 class="font-semibold mb-3 text-brand-teal">Client Engagement</h3>
        <ul class="text-sm space-y-2">
          <li v-for="(item, i) in job.engagement" :key="i" class="flex items-center space-x-2 text-gray-700">
            <span class="text-green-500 font-bold">✓</span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>

      <!-- Proposition Form -->
      <div class="px-4 pb-6">
        <h3 class="bg-gradient-to-r from-brand-teal to-teal-600 text-white px-4 py-3 rounded-t-xl font-semibold">Make a proposition</h3>
        <div class="border border-gray-200 rounded-b-xl p-4 bg-white">
          <textarea 
            class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent resize-none" 
            rows="4" placeholder="Write your proposal message here...">
          </textarea>
          <div class="flex items-center mt-3 space-x-2">
            <input type="checkbox" class="w-4 h-4 text-brand-teal border-gray-300 rounded focus:ring-brand-teal">
            <label class="text-sm text-gray-600">Send me a copy</label>
          </div>
          <button class="w-full mt-4 py-3 bg-gradient-to-r from-brand-teal to-teal-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
            Send Proposal
          </button>
        </div>
      </div>

    </div>
    
    <!-- Client Bottom Navigation -->
    <ClientBottomNav />
  </div>
</template>

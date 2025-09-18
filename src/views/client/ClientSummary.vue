<template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 flex items-center justify-center overflow-hidden p-4">
    <div class="absolute top-0 right-0 h-32 w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-24 w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />
    
    <div class="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-40 right-32 w-1 h-1 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-32 left-40 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-20 right-20 w-2.5 h-2.5 bg-white/15 rounded-full animate-float-delayed-4" />

    <div class="relative z-10 w-full max-w-sm bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-6 animate-fade-up">
      
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <button @click="$router.back()" class="text-brand-teal text-lg hover:text-brand-teal/80 transition-colors">←</button>
        </div>
        <span class="text-brand-teal font-semibold cursor-pointer hover:text-brand-teal/80 transition-colors">Post</span>
      </div>

      <h2 class="text-lg font-semibold mb-4 text-gray-800">Add Post</h2>

      <div class="flex items-center mb-4">
        <div class="h-12 w-12 rounded-full bg-brand-teal flex items-center justify-center text-white font-bold">
          JD
        </div>
        <div class="ml-3">
          <p class="font-medium text-gray-800">John Doe</p>
        </div>
      </div>

      <div class="p-4 bg-gradient-to-r from-brand-teal/10 to-teal-600/10 rounded-lg mb-4">
        <p class="font-semibold text-brand-teal">Budget: <span class="text-gray-700">{{ job.budget }}</span></p>
      </div>

      <h3 class="font-bold text-lg mb-2 text-brand-teal">{{ job.title }}</h3>
      <p class="text-gray-700 text-sm mb-3 whitespace-pre-line">
        {{ job.description }}
      </p>

      <h4 class="text-lg font-semibold mb-3 text-brand-teal">Job Details</h4>
      <ul class="space-y-2 mb-4">
        <li v-for="(detail, index) in job.details" :key="index" class="flex items-start space-x-2 text-sm text-gray-700">
          <span class="text-brand-teal mt-1">•</span>
          <span>{{ detail }}</span>
        </li>
      </ul>

      <div class="bg-gradient-to-r from-brand-teal to-teal-600 text-white p-4 rounded-xl shadow-lg mb-4">
        <h4 class="font-semibold mb-2 text-lg">About the Client</h4>
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

      <h4 class="font-semibold mb-3 text-brand-teal">Client Engagement</h4>
      <ul class="text-sm space-y-2">
        <li v-for="(engagement, index) in job.engagement" :key="index" class="flex items-center space-x-2 text-gray-700">
          <span class="text-green-500 font-bold">✓</span>
          <span>{{ engagement }}</span>
        </li>
      </ul>

      <div class="flex items-center space-x-4 my-4">
        <button class="text-gray-600 text-xl hover:text-brand-teal transition-colors">🖼️</button>
        <button class="text-gray-600 text-xl hover:text-brand-teal transition-colors">📷</button>
      </div>

      <router-link
        to="/client/job-application"
        class="w-full py-3 bg-gradient-to-r from-brand-teal to-teal-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 text-center block"
      >
        Make a proposition
      </router-link>

      <button @click="$router.back()" class="w-full mt-3 py-3 text-brand-teal font-medium hover:text-brand-teal/80 transition-colors">
        Back
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const job = {
  budget: "$68/hr",
  title: "Complete Freelancer Application UI/UX Revamp",
  description: `We're looking for a skilled designer to completely revamp the UI/UX of our Freelancer application.
The goal is to modernize the user experience by making the interface more modern, intuitive, and visually appealing.`,
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

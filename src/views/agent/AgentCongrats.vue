<script setup lang="ts">
// Props or dummy data (replace with actual data later)
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
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 flex items-center justify-center overflow-hidden">
    <!-- Animated decorative circles - responsive sizes -->
    <div class="absolute top-0 right-0 h-24 w-24 sm:h-32 sm:w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-20 w-20 sm:h-24 sm:w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />
    
    <!-- Floating particles - responsive positioning -->
    <div class="absolute top-16 left-16 sm:top-20 sm:left-20 w-2 h-2 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-32 right-24 sm:top-40 sm:right-32 w-1 h-1 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-24 left-32 sm:bottom-32 sm:left-40 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-16 right-16 sm:bottom-20 sm:right-20 w-2.5 h-2.5 bg-white/15 rounded-full animate-float-delayed-4" />

    <div class="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div class="rounded-2xl bg-white/95 backdrop-blur-sm px-4 sm:px-6 py-8 sm:py-12 text-center shadow-xl animate-fade-up-delay-2">
        <div class="flex justify-center mb-4 animate-bounce">
          <span class="text-3xl sm:text-4xl">🎉</span>
        </div>
        <h2 class="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-teal mb-2 animate-fade-up-delay-1">Congratulations!</h2>
        <p class="text-sm sm:text-base md:text-lg font-semibold text-brand-teal mb-4 animate-fade-up-delay-2">You've been matched with a job opportunity</p>
        
        <!-- Job Details -->
        <div class="mx-auto mt-2 max-w-xs sm:max-w-sm text-left space-y-3 text-gray-700 animate-fade-up-delay-3">
          <!-- Budget -->
          <div class="p-3 sm:p-4">
            <p class="font-semibold text-sm sm:text-base">Budget: <span class="text-gray-700">{{ job.budget }}</span></p>
          </div>

          <!-- Job Title & Description -->
          <div class="p-3 sm:p-4">
            <h3 class="font-bold text-brand-teal mb-2 text-sm sm:text-base">{{ job.title }}</h3>
            <p class="text-sm sm:text-base text-gray-700">{{ job.description }}</p>
          </div>

          <!-- Job Details -->
          <div class="p-3 sm:p-4">
            <h4 class="font-bold text-brand-teal mb-2 text-sm sm:text-base">Job Details:</h4>
            <ul class="space-y-1 text-sm sm:text-base">
              <li v-for="(detail, index) in job.details" :key="index" class="flex items-start">
                <span class="text-brand-teal mr-2">•</span>
                <span>{{ detail }}</span>
              </li>
            </ul>
          </div>

          <!-- Client Info -->
          <div class="p-3 sm:p-4">
            <h4 class="font-bold text-brand-teal mb-2 text-sm sm:text-base">Client Information:</h4>
            <div class="space-y-1 text-sm sm:text-base">
              <p><span class="font-semibold">Reviews:</span> {{ job.client.reviews }}</p>
              <p><span class="font-semibold">Rating:</span> {{ job.client.rating }}/5</p>
              <p><span class="font-semibold">Location:</span> {{ job.client.location }}</p>
              <p><span class="font-semibold">Member Since:</span> {{ job.client.memberSince }}</p>
            </div>
          </div>

          <!-- Engagement -->
          <div class="p-3 sm:p-4">
            <h4 class="font-bold text-brand-teal mb-2 text-sm sm:text-base">Engagement:</h4>
            <ul class="space-y-1 text-sm sm:text-base">
              <li v-for="(item, index) in job.engagement" :key="index" class="flex items-start">
                <span class="text-brand-teal mr-2">•</span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>

          <!-- Contact Form -->
          <div class="p-3 sm:p-4 border-t border-gray-200">
            <h4 class="font-bold text-brand-teal mb-3 text-sm sm:text-base">Contact Client:</h4>
            <div class="space-y-3">
              <input 
                type="text" 
                placeholder="Your message" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
              >
              <div class="flex items-center mt-2 space-x-2">
                <input type="checkbox" class="accent-teal-500">
                <label class="text-sm text-gray-600">Send me a copy</label>
              </div>
              <button class="w-full mt-3 py-2 bg-teal-500 text-white rounded-full font-semibold hover:bg-teal-600 transition text-sm sm:text-base">
                Send
              </button>
            </div>
          </div>
        </div>

        <router-link to="/agent/gigs-listing" class="btn-pressable mt-6 sm:mt-8 inline-flex items-center justify-center rounded-full bg-brand-teal px-6 sm:px-8 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-up-delay-4 w-full sm:w-auto">
          Next
        </router-link>
      </div>
    </div>
  </div>
</template>


<template>
  <div class="bg-gray-50 min-h-screen flex flex-col font-sans antialiased">
    <header class="bg-white p-4 flex items-center shadow-sm">
      <button @click="$router.back()" class="mr-4">
        <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      <h1 class="text-xl font-semibold text-gray-800">Logging Summary</h1>
    </header>

    <main class="flex-grow p-4">
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Work Summary</h2>
        
        <div v-if="workDetails" class="space-y-4">
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-sm font-medium text-gray-500 mb-1">Service Category</h3>
            <div class="flex items-center gap-3">
              <div class="p-2 bg-gray-100 rounded-lg">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="workDetails.category.iconPath"></path>
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ workDetails.category.title }}</p>
                <p class="text-sm text-gray-500">{{ workDetails.category.description }}</p>
              </div>
            </div>
          </div>

          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-sm font-medium text-gray-500 mb-1">Work Description</h3>
            <p class="text-gray-900">{{ workDetails.description || 'No description provided' }}</p>
          </div>

          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-sm font-medium text-gray-500 mb-1">Hours Worked</h3>
            <p class="text-gray-900">{{ workDetails.hours }} hours</p>
          </div>

          <div class="pb-4">
            <h3 class="text-sm font-medium text-gray-500 mb-1">Date & Time</h3>
            <p class="text-gray-900">{{ formattedDate }}</p>
          </div>
        </div>

        <div v-if="selectedGig" class="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-sm font-medium text-gray-500 mb-2">Related Gig</h3>
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ selectedGig.icon }}</span>
            <div>
              <p class="font-medium text-gray-900">{{ selectedGig.title }}</p>
              <p class="text-sm text-gray-500">${{ selectedGig.price }}/hour</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="p-4 bg-white shadow-lg">
      <button @click="submitWork" class="w-full bg-teal-500 text-white py-3 rounded-full text-lg font-semibold mb-3 hover:bg-teal-600 transition-colors duration-200">
        Submit Work Log
      </button>
      <button @click="goBack" class="w-full text-gray-600 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
        Back
      </button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const workDetails = ref<any>(null);
const selectedGig = ref<any>(null);

const formattedDate = computed(() => {
  if (!workDetails.value?.timestamp) return '';
  return new Date(workDetails.value.timestamp).toLocaleString();
});

onMounted(() => {
  // Retrieve work details from localStorage
  const storedWork = localStorage.getItem('workDetails');
  if (storedWork) {
    workDetails.value = JSON.parse(storedWork);
  }

  // Retrieve selected gig from localStorage
  const storedGig = localStorage.getItem('selectedGig');
  if (storedGig) {
    selectedGig.value = JSON.parse(storedGig);
  }
});

const submitWork = () => {
  // Here you would typically send the work log to your backend
  console.log('Submitting work log:', workDetails.value);
  
  // Show success message (you could use a toast notification here)
  alert('Work log submitted successfully!');
  
  // Clear the work details from localStorage
  localStorage.removeItem('workDetails');
  
  // Navigate back to gigs listing
  router.push('/agent/gigs-listing');
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
/* Any specific styles not easily handled by Tailwind can go here */
</style>

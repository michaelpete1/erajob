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

    <div class="relative z-10 w-full max-w-md mx-auto flex flex-col items-center justify-center text-center py-12">
      <h2 class="mb-8 text-3xl font-extrabold text-white animate-fade-up-delay-1">Service Category</h2>
      <div class="w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 animate-fade-up-delay-2">
        <div v-for="(category, index) in categories" :key="index" class="flex items-center p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
          <input
            type="checkbox"
            :id="`category-${index}`"
            v-model="selectedCategories"
            :value="category"
            class="w-5 h-5 text-brand-teal border-gray-300 rounded focus:ring-brand-teal focus:ring-2"
          />
          <label :for="`category-${index}`" class="flex items-center flex-1 cursor-pointer ml-4">
            <div class="p-3 bg-gray-100 rounded-lg mr-4 flex-shrink-0">
              <component :is="category.icon" class="w-6 h-6 text-gray-600" />
            </div>
            <div class="flex-grow text-left">
              <p class="text-lg font-medium text-gray-900">{{ category.title }}</p>
              <p class="text-sm text-gray-500">{{ category.description }}</p>
            </div>
          </label>
        </div>
      </div>
      
      <!-- Selection counter -->
      <div class="mt-4 text-sm text-white/80 animate-fade-up-delay-3">
        Selected: {{ selectedCategories.length }} (minimum 3 required)
      </div>
      
      <div class="px-2 py-6 space-y-3 w-full animate-fade-up-delay-4">
        <button
          @click="goNext"
          :disabled="selectedCategories.length < 3"
          class="btn-pressable block w-full rounded-full px-6 py-3 text-center text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          :class="selectedCategories.length >= 3 
            ? 'bg-brand-teal text-white hover:bg-teal-600' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
        >
          Next
        </button>
        <button class="btn-pressable block w-full rounded-full border border-brand-teal/30 bg-brand-teal/10 px-6 py-3 text-sm text-brand-teal hover:bg-brand-teal/20 transition-all duration-300" @click="$router.back()">
          Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { PencilSquareIcon, MegaphoneIcon, FilmIcon, CodeBracketSquareIcon, CameraIcon, CpuChipIcon, ChartBarIcon } from '@heroicons/vue/24/outline'
import { MusicalNoteIcon } from '@heroicons/vue/24/solid'

const router = useRouter()

const categories = [
  { title: 'Graphic Design', description: 'Logo & brand identity', icon: PencilSquareIcon },
  { title: 'Digital Marketing', description: 'Social media marketing, SEO', icon: MegaphoneIcon },
  { title: 'Video & Animation', description: 'Video editing & Video Reels', icon: FilmIcon },
  { title: 'Music & Audio', description: 'Producers & Composers', icon: MusicalNoteIcon },
  { title: 'Program & Tech', description: 'Website & App development', icon: CodeBracketSquareIcon },
  { title: 'Product Photography', description: 'Product photographers', icon: CameraIcon },
  { title: 'Build AI Service', description: 'Build your AI app', icon: CpuChipIcon },
  { title: 'Data', description: 'Data science & AI', icon: ChartBarIcon },
  { title: 'Sales Associate', description: 'Sales', icon: PencilSquareIcon },
  { title: 'Customer Sales Associate', description: 'Sales', icon: PencilSquareIcon },
  { title: 'Administrators', description: 'Administrative Support', icon: PencilSquareIcon },
  { title: 'Customer Service Rep', description: 'Customer Support', icon: PencilSquareIcon },
  { title: 'Bookkeeper', description: 'Accounting & Finance', icon: PencilSquareIcon },
  { title: 'Editor', description: 'Media & Content', icon: PencilSquareIcon },
  { title: 'Credit Repair Disputer', description: 'Finance/Credit Services', icon: PencilSquareIcon },
  { title: 'Executive Assistant', description: 'Administrative Support', icon: PencilSquareIcon }
]

const selectedCategories = ref<any[]>([])

const goNext = () => {
  if (selectedCategories.value.length >= 3) {
    // Store selected categories in localStorage or state management
    localStorage.setItem('selectedAgentServices', JSON.stringify(selectedCategories.value))
    router.push('/agent/congrats')
  }
}
</script>

<template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 flex items-center justify-center overflow-hidden">
    <div class="absolute top-0 right-0 h-32 w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-24 w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />
    
    <div class="absolute top-16 left-16 w-2 h-2 sm:top-20 sm:left-20 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-32 right-24 w-1 h-1 sm:top-40 sm:right-32 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-24 left-32 w-1.5 h-1.5 sm:bottom-32 sm:left-40 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-16 right-16 w-2.5 h-2.5 sm:bottom-20 sm:right-20 bg-white/15 rounded-full animate-float-delayed-4" />

    <!-- Header -->
    <div class="sticky top-0 z-20 w-full flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 bg-teal-500 text-white animate-fade-up">
      <button class="text-lg animate-bounce-in" @click="$router.back()">&lt;</button>
      <h1 class="font-semibold animate-fade-up-delay-1">Service Category</h1>
      <div class="w-8 h-8 rounded-full bg-white" />
    </div>

    <div class="relative z-10 w-full max-w-md sm:max-w-lg mx-auto flex flex-col items-center text-center pt-4 pb-32">
      <h2 class="mb-4 sm:mb-6 text-2xl sm:text-3xl font-extrabold text-white drop-shadow-md z-20 animate-fade-up-delay-1">Service Category</h2>
      <div class="w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 animate-fade-up-delay-2">
        <div v-for="(category, index) in categories" :key="index" class="flex items-center p-3 sm:p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
          <input
            type="checkbox"
            :id="`category-${index}`"
            v-model="selectedCategories"
            :value="category"
            class="w-5 h-5 text-brand-teal border-gray-300 rounded focus:ring-brand-teal focus:ring-2"
          />
          <label :for="`category-${index}`" class="flex items-center flex-1 cursor-pointer ml-4">
            <div class="p-2 sm:p-3 bg-gray-100 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
              <component :is="category.icon" class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </div>
            <div class="flex-grow text-left">
              <p class="text-base sm:text-lg font-medium text-gray-900">{{ category.title }}</p>
              <p class="text-xs sm:text-sm text-gray-500">{{ category.description }}</p>
            </div>
          </label>
        </div>
      </div>
      
      <div class="mt-4 text-sm text-white/80 animate-fade-up-delay-3">
        Selected: {{ selectedCategories.length }} (minimum 3 required)
      </div>
      
      <div class="px-2 py-4 sm:py-6 space-y-3 w-full animate-fade-up-delay-4">
        <button
          @click="goNext"
          :disabled="selectedCategories.length < 3"
          class="btn-pressable block w-full rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-center text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          :class="selectedCategories.length >= 3 
            ? 'bg-brand-teal text-white hover:bg-teal-600' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
        >
          Next
        </button>
        <button class="btn-pressable block w-full rounded-full border border-brand-teal/30 bg-brand-teal/10 px-4 sm:px-6 py-2.5 sm:py-3 text-sm text-brand-teal hover:bg-brand-teal/20 transition-all duration-300" @click="$router.back()">
          Back
        </button>
      </div>
    </div>
    
    <!-- Client Bottom Navigation -->
    <ClientBottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { PencilSquareIcon, MegaphoneIcon, FilmIcon, UserGroupIcon, CodeBracketSquareIcon, CameraIcon, CpuChipIcon, ChartBarIcon } from '@heroicons/vue/24/outline'
import { onMounted, onErrorCaptured } from 'vue'
import ClientBottomNav from '../../components/ClientBottomNav.vue'

const router = useRouter()

const categories = [
  { title: 'Graphic Design', description: 'Logo & brand identity', icon: PencilSquareIcon },
  { title: 'Digital Marketing', description: 'Social media marketing, SEO', icon: MegaphoneIcon },
  { title: 'Video & Animation', description: 'Video editing & Video Reels', icon: FilmIcon },
  { title: 'Sales, customer, process...', description: 'Producers & Composers', icon: UserGroupIcon },
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
    localStorage.setItem('selectedClientServices', JSON.stringify(selectedCategories.value))
    router.push('/client/additional')
  }
}

onMounted(() => {
  console.log('ClientServices mounted')
})

onErrorCaptured((err) => {
  console.error('ClientServices render error:', err)
  try { alert(`ClientServices error: ${String((err as any)?.message ?? err)}`) } catch (e) {}
  return false
})
</script>

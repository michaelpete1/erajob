<template>
  <div class="relative min-h-screen overflow-hidden">
    <!-- Animated decorative circles -->
    <div class="absolute top-0 right-0 h-32 w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-24 w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />
    
    <!-- Floating particles -->
    <div class="absolute top-16 left-16 w-2 h-2 sm:top-20 sm:left-20 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-32 right-24 w-1 h-1 sm:top-40 sm:right-32 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-24 left-32 w-1.5 h-1.5 sm:bottom-32 sm:left-40 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-16 right-16 w-2.5 h-2.5 sm:bottom-20 sm:right-20 bg-white/15 rounded-full animate-float-delayed-4" />

    <div class="relative z-10 w-full max-w-md sm:max-w-lg mx-auto flex flex-col items-center justify-center text-center py-8 sm:py-12">
      <div class="w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 animate-fade-up-delay-2">
        <h2 class="text-2xl font-bold text-gray-800 text-center">Service Category</h2>
        <p class="mt-2 text-sm text-gray-500 text-center mb-6">Select at least 3 categories that match your expertise</p>
        
        <div class="space-y-2">
          <div 
            v-for="(category, index) in categories" 
            :key="index" 
            class="flex items-center p-3 sm:p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
          >
            <input
              type="checkbox"
              :id="`category-${index}`"
              :value="category"
              v-model="selectedCategories"
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
        
        <!-- Selection counter -->
        <div 
          class="mt-4 text-sm font-medium text-center" 
          :class="selectedCategories.length >= 3 ? 'text-green-600' : 'text-amber-600'"
        >
          {{ selectedCategories.length }} of 3+ categories selected
        </div>
        
        <div class="px-2 py-4 sm:py-6 space-y-3 w-full">
          <button
            @click="goNext"
            :disabled="selectedCategories.length < 3"
            class="btn-pressable block w-full rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-center text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            :class="selectedCategories.length >= 3 
              ? 'bg-brand-teal text-white hover:bg-teal-600' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
          >
            {{ selectedCategories.length >= 3 ? `Continue with ${selectedCategories.length} services` : 'Select 3 or more services' }}
          </button>
          <button 
            @click="$router.back()" 
            class="btn-pressable block w-full rounded-full border border-brand-teal/30 bg-brand-teal/10 px-6 py-3 text-sm text-brand-teal hover:bg-brand-teal/20 transition-all duration-300"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  PencilSquareIcon,
  MegaphoneIcon, 
  FilmIcon, 
  CodeBracketSquareIcon, 
  CameraIcon, 
  CpuChipIcon, 
  ChartBarIcon,
  UserGroupIcon,
  UserCircleIcon,
  DocumentTextIcon,
  CreditCardIcon,
  BriefcaseIcon,
  CalendarDaysIcon
} from '@heroicons/vue/24/outline'
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
  { title: 'Sales Associate', description: 'Sales', icon: UserCircleIcon },
  { title: 'Customer Sales Associate', description: 'Sales', icon: UserGroupIcon },
  { title: 'Administrators', description: 'Administrative Support', icon: BriefcaseIcon },
  { title: 'Customer Service Rep', description: 'Customer Support', icon: UserGroupIcon },
  { title: 'Book Keeping', description: 'Accounting & Finance', icon: DocumentTextIcon },
  { title: 'Editor', description: 'Media & Content', icon: PencilSquareIcon },
  { title: 'Credit Repair Disputer', description: 'Finance/Credit Services', icon: CreditCardIcon },
  { title: 'Executive Assistant', description: 'Administrative Support', icon: BriefcaseIcon },
  { title: 'Appointment Setting', description: 'Scheduling & coordination', icon: CalendarDaysIcon }
]

const selectedCategories = ref<any[]>([])

// Load previously selected services (stored as enum strings) and reconstruct UI selection
onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem('selectedAgentServices') || '[]')
    if (Array.isArray(saved) && saved.length) {
      selectedCategories.value = categories.filter(c => saved.includes(c.title))
    }
  } catch (error) {
    console.error('Error loading saved categories:', error)
  }
})

// Autosave mapped enums as user selects/deselects
watch(selectedCategories, (val) => {
  try {
    const titles = val
      .map((cat: any) => (typeof cat?.title === 'string' ? cat.title : ''))
      .filter((title: string) => title.length > 0)
    localStorage.setItem('selectedAgentServices', JSON.stringify(titles))
  } catch (e) {
    console.error('Error autosaving services:', e)
  }
}, { deep: true })

const goNext = async () => {
  try {
    if (selectedCategories.value.length >= 3) {
      // Store mapped enum services as strings for API compatibility
      try {
        const titles = selectedCategories.value
          .map((cat: any) => (typeof cat?.title === 'string' ? cat.title : ''))
          .filter((title: string) => title.length > 0)
        localStorage.setItem('selectedAgentServices', JSON.stringify(titles))
      } catch (storageError) {
        console.error('LocalStorage error:', storageError)
        // Continue even if localStorage fails
      }
      
      // Check if this is a sign-up flow (use signupBasicData for consistency with guard)
      const isSignUpFlow = !!localStorage.getItem('signupBasicData')

      // Use setTimeout to prevent potential async issues
      setTimeout(() => {
        try {
          if (isSignUpFlow) {
            // For sign-up flow: proceed to final Congrats step
            router.push('/agent/congrats').catch((navError) => {
              console.error('Navigation error:', navError)
            })
          } else {
            // For returning users, take them to additional details page
            router.push('/agent/additional').catch((navError) => {
              console.error('Navigation error:', navError)
            })
          }
        } catch (timeoutError) {
          console.error('Timeout navigation error:', timeoutError)
        }
      }, 0)
    }
  } catch (error) {
    console.error('Error in goNext:', error)
  }
}

onMounted(() => {
  try {
    console.log('AgentServices mounted')
    // Add a small delay to ensure component is fully mounted
    setTimeout(() => {
      try {
        // Any additional initialization can go here
      } catch (initError) {
        console.error('Initialization error:', initError)
      }
    }, 100)
  } catch (error) {
    console.error('Error in onMounted:', error)
  }
})
</script>

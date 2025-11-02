<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { PencilSquareIcon, MegaphoneIcon, FilmIcon, MusicalNoteIcon, CodeBracketIcon, GlobeAltIcon, ChartBarIcon, DocumentTextIcon, CameraIcon, MicrophoneIcon, PuzzlePieceIcon, PencilIcon, LightBulbIcon, CurrencyDollarIcon, ShoppingCartIcon } from '@heroicons/vue/24/solid';

const router = useRouter();
const selectedCategories = ref([]);
const showPreferredProjects = ref(false);

const categories = [
  { title: 'Web Development', description: 'Web & Mobile development', icon: CodeBracketIcon },
  { title: 'Mobile Development', description: 'Mobile app development', icon: CodeBracketIcon },
  { title: 'Sales', description: 'Lead Generation & Sales', icon: CurrencyDollarIcon },
  { title: 'Customer Service', description: 'Customer support services', icon: GlobeAltIcon },
  { title: 'Editing', description: 'Content editing', icon: DocumentTextIcon },
  { title: 'Book Keeping', description: 'Bookkeeping & Tax', icon: ChartBarIcon },
  { title: 'Executive Assistant', description: 'Virtual Assistant & Admin', icon: GlobeAltIcon },
  { title: 'Appointment Setting', description: 'Appointment scheduling', icon: GlobeAltIcon },
  { title: 'UI/UX Design', description: 'Digital Art & Design', icon: PencilIcon },
  { title: 'Content Writing', description: 'Content & Copywriting', icon: DocumentTextIcon },
  { title: 'Digital Marketing', description: 'Social media marketing, SEO', icon: MegaphoneIcon },
  { title: 'Data Analysis', description: 'Data analysis services', icon: ChartBarIcon },
  { title: 'Other', description: 'Other services', icon: PuzzlePieceIcon }
];

// Load any previously selected services
onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem('selectedClientServices') || '[]')
    if (Array.isArray(saved) && saved.length) {
      // Reconstruct minimal category objects for UI selection state
      // We only need title matches; map saved service enum back to categories heuristically
      const reverseMap = {
        'Digital Marketing': 'Digital Marketing',
        'Content Writing': 'Content Writing',
        'Web Development': 'Web Development',
        'Other': 'Other'
      }
      const titles = saved.map((s) => reverseMap[s] || 'Other')
      selectedCategories.value = categories.filter(c => titles.includes(c.title))
    }
  } catch {}
})

// Autosave as user selects/deselects
watch(selectedCategories, (val) => {
  try {
    const serviceMapping = {
      'Web Development': 'Web Development',
      'Mobile Development': 'Mobile Development',
      'Sales': 'Sales',
      'Customer Service': 'Customer Service',
      'Editing': 'Editing',
      'Book Keeping': 'Book Keeping',
      'Executive Assistant': 'Executive Assistant',
      'Appointment Setting': 'Appointment Setting',
      'UI/UX Design': 'UI/UX Design',
      'Content Writing': 'Content Writing',
      'Digital Marketing': 'Digital Marketing',
      'Data Analysis': 'Data Analysis',
      'Other': 'Other'
    };
    const selectedServices = [...new Set(val.map(cat => serviceMapping[cat.title] || 'Other'))];
    localStorage.setItem('selectedClientServices', JSON.stringify(selectedServices));
  } catch {}
}, { deep: true })

const goNext = () => {
  if (selectedCategories.value.length >= 3) {
    // Map UI service titles to API enum values
    const serviceMapping = {
      'Web Development': 'Web Development',
      'Mobile Development': 'Mobile Development',
      'Sales': 'Sales',
      'Customer Service': 'Customer Service',
      'Editing': 'Editing',
      'Book Keeping': 'Book Keeping',
      'Executive Assistant': 'Executive Assistant',
      'Appointment Setting': 'Appointment Setting',
      'UI/UX Design': 'UI/UX Design',
      'Content Writing': 'Content Writing',
      'Digital Marketing': 'Digital Marketing',
      'Data Analysis': 'Data Analysis',
      'Other': 'Other'
    };

    // Store selected services as API enum values, removing duplicates
    const selectedServices = [...new Set(
      selectedCategories.value.map(cat => serviceMapping[cat.title] || 'Other')
    )];
    localStorage.setItem('selectedClientServices', JSON.stringify(selectedServices));
    const isSignUpFlow = !!localStorage.getItem('signupBasicData')
    if (isSignUpFlow) {
      router.push('/client/congrats')
    } else {
      router.push('/client/additional')
    }
  }
};
</script>

<template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 flex items-center justify-center p-4">
    <div class="absolute top-0 right-0 h-32 w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-24 w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />
    
    <div class="absolute top-16 left-16 w-2 h-2 sm:top-20 sm:left-20 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-32 right-24 w-1 h-1 sm:top-40 sm:right-32 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-24 left-32 w-1.5 h-1.5 sm:bottom-32 sm:left-40 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-16 right-16 w-2.5 h-2.5 sm:bottom-20 sm:right-20 bg-white/15 rounded-full animate-float-delayed-4" />

    <div class="relative z-10 w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 animate-fade-up-delay-2">
      <h2 class="text-2xl font-bold text-gray-800 text-center">Service Category</h2>
      <p class="mt-2 text-sm text-gray-500 text-center mb-6">Select at least 3 categories that match your needs</p>
      <div class="space-y-2">
        <div v-for="(category, index) in categories" :key="index" class="flex items-center p-3 sm:p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
          <input
            type="checkbox"
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
      
      <!-- Selection counter -->
      <div class="mt-4 text-sm font-medium text-center" :class="selectedCategories.length >= 3 ? 'text-green-600' : 'text-amber-600'">
        {{ selectedCategories.length }} of 3+ categories selected
      </div>
      
      <div class="mt-6 space-y-3 w-full relative">
        <div class="relative">
          <button
            @mouseenter="showPreferredProjects = true"
            @mouseleave="showPreferredProjects = false"
            class="w-full text-center text-sm font-medium text-brand-teal underline hover:text-teal-700 transition-colors duration-200 mb-2"
          >
            Preferred Projects
          </button>
          
          <!-- Preferred Projects Dropdown -->
          <div 
            v-if="showPreferredProjects"
            class="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg p-4 z-20 border border-gray-200"
            @mouseenter="showPreferredProjects = true"
            @mouseleave="showPreferredProjects = false"
          >
            <h3 class="text-sm font-semibold text-gray-800 mb-2">Your Preferred Projects</h3>
            <p class="text-xs text-gray-600">Select at least 3 categories that match your project needs.</p>
          </div>
        </div>

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
        <button class="btn-pressable block w-full rounded-full border border-brand-teal/30 bg-brand-teal/10 px-6 py-3 text-sm text-brand-teal hover:bg-brand-teal/20 transition-all duration-300" @click="$router.back()">
          Back
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-pressable:active {
  transform: scale(0.98);
}
</style>

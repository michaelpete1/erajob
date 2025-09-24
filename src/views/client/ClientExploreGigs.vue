<template>
  <div class="min-h-screen bg-gray-50 pb-16 sm:pb-20">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <div class="flex items-center gap-2 sm:gap-3">
          <button @click="$router.back()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-lg sm:text-xl font-semibold text-gray-800">Explore Services</h1>
        </div>
        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-teal-500"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 sm:px-6 py-4 sm:py-6 max-w-4xl mx-auto">
      <!-- Welcome Section -->
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Available Services</h2>
        <p class="text-gray-600">Browse through our available gig services</p>
      </div>

      <!-- Search Section -->
      <div class="mb-6">
        <div class="relative">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search services..." 
            class="w-full border border-gray-200 rounded-lg px-4 py-3 pr-12 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
          />
          <button 
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Categories -->
      <div class="mb-6">
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="category in categories" 
            :key="category"
            @click="selectedCategory = category"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
              selectedCategory === category 
                ? 'bg-green-500 text-white shadow-sm' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 gap-4">
        <div 
          v-for="gig in (filteredGigs || [])" 
          :key="gig.id"
          @click="selectService(gig)"
          class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <div class="flex items-start gap-4">
            <span class="text-3xl">{{ gig.icon }}</span>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-800 mb-2">{{ gig.title }}</h3>
              <p class="text-sm text-gray-600 mb-3">{{ gig.description }}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-lg font-bold text-teal-500">${{ gig.price }}</span>
                  <span class="text-xs text-gray-500">per hour</span>
                </div>
                <div class="px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
                  {{ gig.category }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      <!-- No results message -->
      <div v-if="filteredGigs && filteredGigs.length === 0" class="text-center py-12">
        <div class="bg-gray-50 rounded-2xl p-8 border border-gray-200">
          <span class="text-4xl mb-4 block">🔍</span>
          <h3 class="text-xl font-bold text-gray-800 mb-2">No services found</h3>
          <p class="text-gray-600">Try adjusting your search terms.</p>
        </div>
      </div>

      <!-- Continue Button -->
      <div class="mt-8">
        <button 
          @click="goToProjects"
          class="w-full bg-teal-500 text-white font-medium py-4 rounded-xl hover:bg-teal-600 transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          Continue to Projects
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selectedCategory = ref('All')
const searchQuery = ref('')
const selectedServices = ref<any[]>([])

const categories = [
  'All',
  'Writing',
  'Design',
  'Development',
  'Data',
  'Marketing',
  'Admin'
]

const availableGigs = [
  {
    id: 1,
    title: 'Content Writing',
    description: 'Create engaging blog posts, articles, and web content for various clients.',
    price: '14.00',
    icon: '📝',
    category: 'Writing',
    keywords: ['writing', 'content', 'blog', 'articles', 'web content']
  },
  {
    id: 2,
    title: 'Graphic Design',
    description: 'Design logos, social media graphics, and marketing materials for businesses.',
    price: '13.50',
    icon: '🎨',
    category: 'Design',
    keywords: ['design', 'logo', 'graphics', 'social media', 'marketing']
  },
  {
    id: 3,
    title: 'Web Development',
    description: 'Build and maintain websites using modern frameworks and technologies.',
    price: '17.50',
    icon: '💻',
    category: 'Development',
    keywords: ['web', 'development', 'websites', 'programming', 'coding']
  },
  {
    id: 4,
    title: 'Data Entry',
    description: 'Input and manage data accurately for various business operations.',
    price: '13.00',
    icon: '📊',
    category: 'Data',
    keywords: ['data', 'entry', 'input', 'management', 'business']
  },
  {
    id: 5,
    title: 'Virtual Assistant',
    description: 'Provide administrative support and manage tasks for busy professionals.',
    price: '13.75',
    icon: '🎯',
    category: 'Admin',
    keywords: ['virtual', 'assistant', 'administrative', 'support', 'tasks']
  },
  {
    id: 6,
    title: 'Social Media Management',
    description: 'Manage social media accounts and create engaging content for brands.',
    price: '15.50',
    icon: '📱',
    category: 'Marketing',
    keywords: ['social', 'media', 'management', 'content', 'brands']
  }
]

const filteredGigs = computed(() => {
  if (!availableGigs || !Array.isArray(availableGigs)) {
    return []
  }
  
  return availableGigs.filter(gig => {
    if (!gig) return false
    
    const matchesCategory = selectedCategory.value === 'All' || gig.category === selectedCategory.value
    
    let matchesSearch = true
    if (searchQuery.value.trim()) {
      const searchLower = searchQuery.value.toLowerCase()
      matchesSearch = gig.title.toLowerCase().includes(searchLower) ||
                      gig.description.toLowerCase().includes(searchLower) ||
                      (gig.keywords && Array.isArray(gig.keywords) && gig.keywords.some((keyword: string) => 
                        keyword.toLowerCase().includes(searchLower)
                      ))
    }
    
    return matchesCategory && matchesSearch
  })
})

// Methods
const selectService = (service: any) => {
  // Toggle service selection
  const existingIndex = selectedServices.value.findIndex(s => s.id === service.id)
  if (existingIndex > -1) {
    selectedServices.value.splice(existingIndex, 1)
  } else {
    selectedServices.value.push(service)
  }
}

const goToProjects = () => {
  // Save selected services to localStorage
  try {
    localStorage.setItem('selectedClientServices', JSON.stringify(selectedServices.value))
  } catch (e) {
    // ignore
  }
  
  // Navigate to projects page
  router.push('/client/projects')
}

onMounted(() => {
  // Any initialization logic can go here
})
</script>

<style scoped>
/* No custom styles needed - using Tailwind classes */
</style>

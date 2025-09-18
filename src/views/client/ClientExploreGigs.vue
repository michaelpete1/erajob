<template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 overflow-hidden">
    <div class="absolute top-0 right-0 h-24 w-24 sm:h-32 sm:w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-20 w-20 sm:h-24 sm:w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />
    
    <div class="absolute top-16 left-16 sm:top-20 sm:left-20 w-2 h-2 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-32 right-24 sm:top-40 sm:right-32 w-1 h-1 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-24 left-32 sm:bottom-32 sm:left-40 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-16 right-16 sm:bottom-20 sm:right-20 w-2.5 h-2.5 bg-white/15 rounded-full animate-float-delayed-4" />

  <div class="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-24">
      <header class="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 w-[90%] sm:w-[92%] max-w-3xl bg-brand-teal text-white rounded-xl px-3 sm:px-4 py-2 sm:py-3 z-50 shadow-md flex items-center justify-between">
        <div class="flex items-center gap-2 sm:gap-3">
          <button @click="$router.back()" aria-label="Back" class="p-1 text-white/95 hover:text-white">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-sm sm:text-base font-semibold">Explore Gigs</h1>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <button @click="openMobileNav = !openMobileNav" class="p-1 text-white/95 hover:text-white md:hidden" aria-label="Menu">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <div class="mt-16 sm:mt-20">
        <!-- Search Section -->
        <div class="mb-8 animate-fade-up-delay-1">
          <div class="relative max-w-md mx-auto">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search available gigs..." 
              class="w-full rounded-full border border-white/30 bg-white/10 px-5 py-3 pr-12 text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all backdrop-blur-sm"
              readonly
            />
            <button 
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p class="text-center text-white/80 text-sm mt-2">
            View available gigs (Read-only mode)
          </p>
        </div>

        <!-- Gig Categories -->
        <div class="mb-8 animate-fade-up-delay-2">
          <div class="flex flex-wrap justify-center gap-2 sm:gap-3">
            <button 
              v-for="category in categories" 
              :key="category"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                selectedCategory === category 
                  ? 'bg-white text-brand-teal shadow-lg' 
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              ]"
              disabled
            >
              {{ category }}
            </button>
          </div>
        </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
    
    <div 
      v-for="gig in filteredGigs" 
      :key="gig.id"
      class="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-102 animate-fade-up-delay-1 opacity-75 cursor-not-allowed"
    >
      <div class="block" @click.stop>
        <div class="flex items-center mb-3 sm:mb-4 gap-3">
          <span class="text-2xl sm:text-3xl">{{ gig.icon }}</span>
          <h3 class="text-lg sm:text-xl font-bold text-brand-teal">{{ gig.title }}</h3>
        </div>
        <p class="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">{{ gig.description }}</p>
        <div class="flex justify-between items-center mb-3 sm:mb-4">
          <span class="text-xl sm:text-2xl font-bold text-brand-teal">${{ gig.price }}</span>
          <span class="text-xs sm:text-sm text-gray-500">per hour</span>
        </div>
        <div class="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-full text-center block text-sm sm:text-base cursor-not-allowed">
          View Details (Read-only)
        </div>
      </div>
    </div>
    
    <!-- No results message -->
    <div v-if="filteredGigs.length === 0" class="col-span-full text-center py-12">
      <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-8">
        <span class="text-4xl mb-4 block">🔍</span>
        <h3 class="text-xl font-bold text-brand-teal mb-2">No gigs found</h3>
        <p class="text-gray-600">Try adjusting your search terms.</p>
      </div>
    </div>
      </div>

  <!-- Back Button -->
  <div class="text-center mt-8">
        <router-link to="/client/welcome" class="inline-flex items-center text-white hover:text-white/80 transition-colors duration-300">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Client Dashboard
        </router-link>
      </div>
      
      <div class="text-center mt-6">
        <router-link to="/client/gigs-listing" class="btn-pressable mt-4 inline-flex items-center justify-center rounded-full bg-brand-teal px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 w-full sm:w-auto">
          Next
        </router-link>
      </div>
    </div>
    <BottomNav />
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BottomNav from '../../components/BottomNav.vue'

const openMobileNav = ref(false)
const selectedCategory = ref('All')
const searchQuery = ref('')

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
  let gigs = availableGigs
  
  // Filter by category
  if (selectedCategory.value !== 'All') {
    gigs = gigs.filter(gig => gig.category === selectedCategory.value)
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    gigs = gigs.filter(gig => 
      gig.title.toLowerCase().includes(query) ||
      gig.description.toLowerCase().includes(query) ||
      gig.keywords.some(keyword => keyword.toLowerCase().includes(query))
    )
  }
  
  return gigs
})

onMounted(() => {
  // Any initialization logic can go here
})
</script>

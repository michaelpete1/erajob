<template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 overflow-hidden">
    <div class="absolute top-0 right-0 h-32 w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-24 w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />
    
    <div class="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-40 right-32 w-1 h-1 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-32 left-40 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-20 right-20 w-2.5 h-2.5 bg-white/15 rounded-full animate-float-delayed-4" />

  <div class="relative z-10 container mx-auto px-4 pt-24 pb-24">
      <header class="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-3xl bg-brand-teal text-white rounded-xl px-4 py-3 z-50 shadow-md flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button @click="$router.back()" aria-label="Back" class="p-1 text-white/95 hover:text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-base font-semibold">Projects</h1>
        </div>
        <div class="flex items-center gap-3">
          <button @click="openMobileNav = !openMobileNav" class="p-1 text-white/95 hover:text-white md:hidden" aria-label="Menu">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <nav class="hidden md:flex items-center gap-4">
            <router-link to="/client/gigs-listing" class="flex items-center gap-2 text-white/90 hover:text-white" aria-label="Home">
              <BrandLogo size="sm" />
            </router-link>
            <router-link to="/client/gigs-listing" class="flex items-center gap-2 text-white/90 hover:text-white" aria-label="Projects">
              <PencilSquareIcon class="h-5 w-5" />
              <span class="hidden lg:inline text-sm">Projects</span>
            </router-link>
            <router-link to="/messages" class="flex items-center gap-2 text-white/90 hover:text-white" aria-label="Messages">
              <MusicalNoteIcon class="h-5 w-5" />
              <span class="hidden lg:inline text-sm">Messages</span>
            </router-link>
            <router-link to="/notifications" class="relative flex items-center gap-2 text-white/90 hover:text-white" aria-label="Notifications">
              <CheckCircleIcon class="h-5 w-5" />
              <span class="absolute -top-2 -right-3 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-brand-teal text-xs">3</span>
            </router-link>
            <router-link to="/settings" class="flex items-center gap-2 text-white/90 hover:text-white" aria-label="Settings">
              <AdjustmentsHorizontalIcon class="h-5 w-5" />
            </router-link>
          </nav>

          <div class="w-8 h-8 rounded-full bg-white/90" />
        </div>
      </header>

      <div v-if="openMobileNav" class="fixed top-16 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white/95 text-brand-teal rounded-xl shadow-lg z-50 md:hidden">
        <div class="flex flex-col p-3">
          <div class="flex justify-center mb-3 pb-3 border-b border-gray-200">
            <router-link @click="openMobileNav = false" to="/client/gigs-listing" class="flex items-center justify-center">
              <BrandLogo size="sm" />
            </router-link>
          </div>
          <router-link @click="openMobileNav = false" to="/client/gigs-listing" class="py-2 px-3 rounded hover:bg-gray-100">Projects</router-link>
          <router-link @click="openMobileNav = false" to="/messages" class="py-2 px-3 rounded hover:bg-gray-100">Messages</router-link>
          <router-link @click="openMobileNav = false" to="/notifications" class="py-2 px-3 rounded hover:bg-gray-100">Notifications <span class="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-400 text-white text-xs">3</span></router-link>
          <router-link @click="openMobileNav = false" to="/settings" class="py-2 px-3 rounded hover:bg-gray-100">Settings</router-link>
        </div>
      </div>

      <div class="mt-2 mb-6 flex items-center justify-center">
        <div class="bg-white/95 rounded-full p-1 flex items-center gap-1 shadow-sm">
          <button 
            @click="activeTab = 'active'" 
            :class="activeTab === 'active' ? 'bg-brand-teal text-white' : 'text-gray-600'"
            class="px-4 py-1 rounded-full text-sm font-medium transition-colors duration-200"
          >
            Active
          </button>
          <button 
            @click="activeTab = 'browse'" 
            :class="activeTab === 'browse' ? 'bg-brand-teal text-white' : 'text-gray-600'"
            class="px-4 py-1 rounded-full text-sm font-medium transition-colors duration-200"
          >
            Browse
          </button>
        </div>
      </div>

      <div v-if="activeTab === 'browse'" class="mb-6 animate-fade-in">
        <div class="max-w-2xl mx-auto">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search for gigs..."
              class="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 pl-12 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30 backdrop-blur-sm transition-all"
            />
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
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
          <p v-if="searchQuery" class="text-center text-white/80 text-sm mt-2">
            Showing results for "{{ searchQuery }}"
          </p>
        </div>
      </div>

  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
    
    <div 
      v-for="gig in filteredGigs" 
      :key="gig.id"
      class="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-102 animate-fade-up-delay-1 block cursor-pointer"
    >
      <router-link :to="gig.link" class="block" @click.stop>
        <div class="flex items-center mb-3 gap-3">
          <span class="text-3xl">{{ gig.icon }}</span>
          <h3 class="text-xl font-bold text-brand-teal">{{ gig.title }}</h3>
        </div>
        <p class="text-gray-700 mb-4">{{ gig.description }}</p>
        <div class="flex justify-between items-center mb-4">
          <span class="text-2xl font-bold text-brand-teal">${{ gig.price }}</span>
          <span class="text-sm text-gray-500">per hour</span>
        </div>
        <router-link v-if="activeTab === 'browse'" :to="gig.applyLink" class="w-full bg-brand-teal text-white py-2 px-4 rounded-full hover:bg-teal-600 transition-colors duration-300 text-center block" @click.stop>
          Apply Now
        </router-link>
        <router-link v-else :to="gig.link" class="w-full bg-brand-teal text-white py-2 px-4 rounded-full hover:bg-teal-600 transition-colors duration-300 text-center block" @click.stop>
          View Details
        </router-link>
      </router-link>
    </div>
    
    <!-- No results message -->
    <div v-if="filteredGigs.length === 0" class="col-span-full text-center py-12">
      <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-8">
        <span class="text-4xl mb-4 block">🔍</span>
        <h3 class="text-xl font-bold text-brand-teal mb-2">No gigs found</h3>
        <p class="text-gray-600">Try adjusting your search terms or browse all gigs in the Active tab.</p>
      </div>
    </div>
      </div>

      <!-- Back Button -->
      <div class="text-center mt-8">
        <router-link to="/client/explore-gigs" class="inline-flex items-center text-white hover:text-white/80 transition-colors duration-300">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Explore
        </router-link>
      </div>
    </div>
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BottomNav from '../../components/BottomNav.vue'
import BrandLogo from '../../components/BrandLogo.vue'
import { PencilSquareIcon, AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline'
import { CheckCircleIcon, MusicalNoteIcon } from '@heroicons/vue/24/solid'

const openMobileNav = ref(false)
const activeTab = ref<'active' | 'browse'>('active')
const searchQuery = ref('')

const activeJobs = [
  {
    id: 1,
    title: 'Content Writing Project',
    description: 'Currently working on blog posts for TechCorp',
    price: '14.00',
    icon: '📝',
    link: '/client/add-post',
    applyLink: '/client/add-post',
    status: 'in_progress',
    client: 'TechCorp',
    deadline: '2024-01-15'
  },
  {
    id: 2,
    title: 'Social Media Management',
    description: 'Managing social media accounts for FashionBrand',
    price: '18.00',
    icon: '📱',
    link: '/client/add-post',
    applyLink: '/client/add-post',
    status: 'in_progress',
    client: 'FashionBrand',
    deadline: '2024-01-20'
  }
]

const availableGigs = [
  {
    id: 1,
    title: 'Content Writing',
    description: 'Create engaging blog posts, articles, and web content for various clients.',
    price: '14.00',
    icon: '📝',
    link: '/client/add-post',
    applyLink: '/client/job-application',
    category: 'writing',
    keywords: ['writing', 'content', 'blog', 'articles', 'web content']
  },
  {
    id: 2,
    title: 'Graphic Design',
    description: 'Design logos, social media graphics, and marketing materials for businesses.',
    price: '15.00',
    icon: '🎨',
    link: '/client/add-post',
    applyLink: '/client/job-application',
    category: 'design',
    keywords: ['design', 'logo', 'graphics', 'social media', 'marketing']
  },
  {
    id: 3,
    title: 'Web Development',
    description: 'Build and maintain websites using modern frameworks and technologies.',
    price: '18.00',
    icon: '💻',
    link: '/client/add-post',
    applyLink: '/client/job-application',
    category: 'development',
    keywords: ['web', 'development', 'websites', 'programming', 'coding']
  },
  {
    id: 4,
    title: 'Data Entry',
    description: 'Input and manage data accurately for various business operations.',
    price: '13.00',
    icon: '📊',
    link: '/client/add-post',
    applyLink: '/client/job-application',
    category: 'data',
    keywords: ['data', 'entry', 'input', 'management', 'business']
  },
  {
    id: 5,
    title: 'Virtual Assistant',
    description: 'Provide administrative support and manage tasks for busy professionals.',
    price: '14.00',
    icon: '🎯',
    link: '/client/add-post',
    applyLink: '/client/job-application',
    category: 'admin',
    keywords: ['virtual', 'assistant', 'administrative', 'support', 'tasks']
  },
  {
    id: 6,
    title: 'Social Media Management',
    description: 'Manage social media accounts and create engaging content for brands.',
    price: '16.00',
    icon: '📱',
    link: '/client/add-post',
    applyLink: '/client/job-application',
    category: 'marketing',
    keywords: ['social', 'media', 'management', 'content', 'brands']
  }
]

const selectedServices = ref<any[]>([])

onMounted(() => {
  const stored = localStorage.getItem('selectedClientServices')
  if (stored) {
    selectedServices.value = JSON.parse(stored)
  }
})

const filteredGigs = computed(() => {
  if (activeTab.value === 'active') {
    
    return activeJobs
  } else {
    
    let result = availableGigs
    
    
    if (selectedServices.value.length > 0) {
      const serviceTitles = selectedServices.value.map(service => service.title.toLowerCase())
      result = result.filter(gig => 
        serviceTitles.some(service => 
          gig.title.toLowerCase().includes(service) ||
          gig.category.toLowerCase().includes(service) ||
          gig.keywords.some(keyword => keyword.toLowerCase().includes(service))
        )
      )
    }
    
    
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim()
      result = result.filter(gig => 
        gig.title.toLowerCase().includes(query) ||
        gig.description.toLowerCase().includes(query) ||
        gig.keywords.some(keyword => keyword.toLowerCase().includes(query))
      )
    }
    
    return result
  }
})
</script>

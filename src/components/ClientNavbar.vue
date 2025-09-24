<template>
  <nav class="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo/Brand Removed -->

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-1">
          <router-link 
            :to="'/client/projects'" 
            :class="navLinkClass('/client/projects')"
          >
            <PencilSquareIcon :class="navIconClass('/client/projects')" />
            <span>Projects</span>
          </router-link>
          
          <router-link 
            :to="'/client/explore-gigs'" 
            :class="navLinkClass('/client/explore-gigs')"
          >
            <CheckCircleIcon :class="navIconClass('/client/explore-gigs')" />
            <span>Explore</span>
          </router-link>
          
          <router-link 
            :to="'/client/projects/create'" 
            :class="navLinkClass('/client/projects/create')"
          >
            <MusicalNoteIcon :class="navIconClass('/client/projects/create')" />
            <span>Post Job</span>
          </router-link>


          <router-link 
            :to="'/client/notifications'" 
            :class="['relative', navLinkClass('/client/notifications')]"
          >
            <CheckCircleIcon :class="navIconClass('/client/notifications')" />
            <span>Alerts</span>
            <span class="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-teal-400 text-white text-[10px]">3</span>
          </router-link>

          <router-link 
            :to="'/client/settings'" 
            :class="navLinkClass('/client/settings')"
          >
            <AdjustmentsHorizontalIcon :class="navIconClass('/client/settings')" />
            <span>Settings</span>
          </router-link>
        </div>

        <!-- User Profile (Desktop) -->
        <div class="hidden md:flex items-center space-x-3">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span class="text-gray-600 text-sm font-medium">
                {{ userInitial }}
              </span>
            </div>
            <span class="text-sm text-gray-700">{{ userRoleDisplay }}</span>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button 
            @click="toggleMobileMenu" 
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-teal"
            aria-expanded="false"
          >
            <span class="sr-only">Open main menu</span>
            <svg v-if="!mobileMenuOpen" class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div 
      v-show="mobileMenuOpen" 
      class="md:hidden"
      @click.away="closeMobileMenu"
    >
      <div class="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
        <router-link 
          :to="'/client/projects'" 
          :class="mobileNavLinkClass('/client/projects')"
          @click="closeMobileMenu"
        >
          <PencilSquareIcon :class="mobileNavIconClass('/client/projects')" />
          <span>Projects</span>
        </router-link>
        
        <router-link 
          :to="'/client/explore-gigs'" 
          :class="mobileNavLinkClass('/client/explore-gigs')"
          @click="closeMobileMenu"
        >
          <CheckCircleIcon :class="mobileNavIconClass('/client/explore-gigs')" />
          <span>Explore</span>
        </router-link>
        
        <router-link 
          :to="'/client/projects/create'" 
          :class="mobileNavLinkClass('/client/projects/create')"
          @click="closeMobileMenu"
        >
          <MusicalNoteIcon :class="mobileNavIconClass('/client/projects/create')" />
          <span>Post Job</span>
        </router-link>


        <router-link 
          :to="'/client/notifications'" 
          :class="['relative', mobileNavLinkClass('/client/notifications')]"
          @click="closeMobileMenu"
        >
          <CheckCircleIcon :class="mobileNavIconClass('/client/notifications')" />
          <span>Alerts</span>
          <span class="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-teal-400 text-white text-[10px]">3</span>
        </router-link>

        <router-link 
          :to="'/client/settings'" 
          :class="mobileNavLinkClass('/client/settings')"
          @click="closeMobileMenu"
        >
          <AdjustmentsHorizontalIcon :class="mobileNavIconClass('/client/settings')" />
          <span>Settings</span>
        </router-link>

        <!-- Mobile User Profile -->
        <div class="border-t border-gray-200 pt-4 pb-3">
          <div class="flex items-center px-3">
            <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span class="text-gray-600 text-sm font-medium">
                {{ userInitial }}
              </span>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">{{ userRoleDisplay }}</div>
              <div class="text-sm text-gray-500">Client Account</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { 
  PencilSquareIcon, 
  AdjustmentsHorizontalIcon
} from '@heroicons/vue/24/outline'
import { 
  CheckCircleIcon, 
  MusicalNoteIcon 
} from '@heroicons/vue/24/solid'
import { useRoute } from 'vue-router'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const route = useRoute()
const userRole = ref<string>('')
const mobileMenuOpen = ref<boolean>(false)

onMounted(() => {
  userRole.value = localStorage.getItem('userRole') || ''
})

const userInitial = computed(() => {
  return userRole.value ? userRole.value.charAt(0).toUpperCase() : 'U'
})

const userRoleDisplay = computed(() => {
  return userRole.value ? userRole.value.charAt(0).toUpperCase() + userRole.value.slice(1) : 'User'
})

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function navLinkClass(path: string) {
  const isActive = route.path === path
  return [
    'flex',
    'items-center',
    'space-x-2',
    'px-3',
    'py-2',
    'rounded-md',
    'text-sm',
    'font-medium',
    'transition-colors',
    'duration-200',
    isActive 
      ? 'bg-brand-teal/10 text-brand-teal' 
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
  ]
}

function navIconClass(path: string) {
  const isActive = route.path === path
  return [
    'h-5',
    'w-5',
    isActive ? 'text-brand-teal' : 'text-gray-500'
  ]
}

function mobileNavLinkClass(path: string) {
  const isActive = route.path === path
  return [
    'flex',
    'items-center',
    'space-x-3',
    'px-3',
    'py-2',
    'rounded-md',
    'text-base',
    'font-medium',
    'transition-colors',
    'duration-200',
    isActive 
      ? 'bg-brand-teal/10 text-brand-teal' 
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
  ]
}

function mobileNavIconClass(path: string) {
  const isActive = route.path === path
  return [
    'h-6',
    'w-6',
    isActive ? 'text-brand-teal' : 'text-gray-500'
  ]
}

// Close mobile menu when clicking outside
onBeforeUnmount(() => {
  closeMobileMenu()
})
</script>

<style scoped>
/* Add padding to body content to account for fixed navbar */
.client-navbar-safe { 
  padding-top: 64px; 
}

/* Mobile menu animation */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

<template>
  <nav class="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative min-h-[64px]">
        <!-- Logo/Brand -->
        <div class="absolute left-4 top-1/2 -translate-y-1/2">
          <BrandLogo />
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div class="flex items-center gap-1">
            <router-link 
              :to="'/agent/notifications'" 
              :class="['relative', navLinkClass('/agent/notifications')]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
              </svg>
              <span>Notifications</span>
              <span class="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-teal-400 text-white text-[10px]">3</span>
            </router-link>
            <router-link 
              :to="'/agent/gigs-listing'" 
              :class="navLinkClass('/agent/gigs-listing')"
            >
              <PencilSquareIcon :class="navIconClass('/agent/gigs-listing')" />
              <span>Projects</span>
            </router-link>
            
            <router-link 
              :to="'/agent/log-work'" 
              :class="navLinkClass('/agent/log-work')"
            >
              <PencilSquareIcon :class="navIconClass('/agent/log-work')" />
              <span>Log Work</span>
            </router-link>

            <router-link 
              :to="'/agent/logging-dashboard'" 
              :class="navLinkClass('/agent/logging-dashboard')"
            >
              <ChartBarIcon :class="navIconClass('/agent/logging-dashboard')" />
              <span>Dashboard</span>
            </router-link>

            <!-- FIX: Use global /settings since /agent/settings route does not exist -->
            <router-link 
              :to="'/settings'" 
              :class="navLinkClass('/settings')"
            >
              <AdjustmentsHorizontalIcon :class="navIconClass('/settings')" />
              <span>Settings</span>
            </router-link>
          </div>
        </div>

        <!-- User Profile (Desktop) -->
        <div class="hidden md:block absolute right-4 top-1/2 -translate-y-1/2">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span class="text-gray-600 text-sm font-medium">
                {{ userInitial }}
              </span>
            </div>
            <span class="text-sm text-gray-700 whitespace-nowrap">{{ userRoleDisplay }}</span>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden absolute right-4 top-1/2 -translate-y-1/2">
          <button 
            @click="toggleMobileMenu" 
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-teal min-h-[44px] min-w-[44px] touch-manipulation"
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
          :to="'/agent/gigs-listing'" 
          :class="mobileNavLinkClass('/agent/gigs-listing')"
          @click="closeMobileMenu"
        >
          <PencilSquareIcon :class="mobileNavIconClass('/agent/gigs-listing')" />
          <span>Projects</span>
        </router-link>
        
        <router-link 
          :to="'/agent/logging-dashboard'" 
          :class="mobileNavLinkClass('/agent/logging-dashboard')"
          @click="closeMobileMenu"
        >
          <ChartBarIcon :class="mobileNavIconClass('/agent/logging-dashboard')" />
          <span>Dashboard</span>
        </router-link>

        <!-- FIX: Point messages to /agent/notifications (no /agent/messages route) -->
        <router-link 
          :to="'/agent/notifications'" 
          :class="['relative', mobileNavLinkClass('/agent/notifications')]"
          @click="closeMobileMenu"
        >
          <MusicalNoteIcon :class="mobileNavIconClass('/agent/notifications')" />
          <span>Notifications</span>
          <span class="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-teal-400 text-white text-[10px]">3</span>
        </router-link>

        <!-- FIX: Use global /settings since /agent/settings route does not exist -->
        <router-link 
          :to="'/settings'" 
          :class="mobileNavLinkClass('/settings')"
          @click="closeMobileMenu"
        >
          <AdjustmentsHorizontalIcon :class="mobileNavIconClass('/settings')" />
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
              <div class="text-sm text-gray-500">Agent Account</div>
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
  AdjustmentsHorizontalIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'
import { 
  MusicalNoteIcon 
} from '@heroicons/vue/24/solid'
import BrandLogo from './BrandLogo.vue'
import { useRoute } from 'vue-router'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const route = useRoute()
const userRole = ref<string>('')
const mobileMenuOpen = ref<boolean>(false)

onMounted(() => {
  // NOTE: This assumes userRole is correctly managed in App.vue based on localStorage
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
  // NOTE: Added check for path starting with path to handle nested routes like /agent/settings/profile
  const isActive = route.path.startsWith(path)
  return [
    'flex',
    'items-center',
    'space-x-2',
    'px-2',
    'py-2',
    'rounded-md',
    'text-sm',
    'font-medium',
    'transition-colors',
    'duration-200',
    'whitespace-nowrap',
    'min-h-[40px]',
    'touch-manipulation',
    'flex-shrink-0',
    isActive 
      ? 'bg-brand-teal/10 text-brand-teal' 
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
  ]
}

function navIconClass(path: string) {
  const isActive = route.path.startsWith(path)
  return [
    'h-5',
    'w-5',
    isActive ? 'text-brand-teal' : 'text-gray-500'
  ]
}

function mobileNavLinkClass(path: string) {
  const isActive = route.path.startsWith(path)
  return [
    'flex',
    'items-center',
    'space-x-3',
    'px-3',
    'py-2.5',
    'rounded-md',
    'text-base',
    'font-medium',
    'transition-colors',
    'duration-200',
    'whitespace-nowrap',
    'min-h-[48px]',
    'touch-manipulation',
    isActive 
      ? 'bg-brand-teal/10 text-brand-teal' 
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
  ]
}

function mobileNavIconClass(path: string) {
  const isActive = route.path.startsWith(path)
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
.agent-navbar-safe { 
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

/* Ensure navbar content doesn't overflow */
.navbar-content {
  overflow-x: hidden;
}
</style>

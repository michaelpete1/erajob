<template>
  <nav class="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between min-h-[64px]">
        <!-- Logo/Brand placeholder (assuming it's elsewhere or removed intentionally) -->
        <div class="md:hidden">
          <span class="text-lg font-bold text-gray-800">Client Portal</span>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-1 flex-1 justify-center px-4">
          <router-link
            :to="'/client/jobs'"
            :class="navLinkClass('/client/jobs')"
          >
            <PencilSquareIcon :class="navIconClass('/client/jobs')" />
            <span>Jobs</span>
          </router-link>
          
          <!-- FIX: Scoped to /client/proposals -->
          <router-link 
            :to="'/client/proposals'" 
            :class="navLinkClass('/client/proposals')"
            class="flex items-center space-x-2"
          >
            <DocumentTextIcon :class="navIconClass('/client/proposals')" />
            <span>Proposals</span>
          </router-link>
          
          <router-link
            :to="'/client/jobs/create'"
            :class="navLinkClass('/client/jobs/create')"
          >
            <UserGroupIcon :class="navIconClass('/client/jobs/create')" />
            <span>Post Job</span>
          </router-link>


          <router-link 
            :to="'/client/notifications'" 
            :class="['relative', navLinkClass('/client/notifications')]"
          >
            <BellIcon :class="navIconClass('/client/notifications')" />
            <span>Alerts</span>
            <span
              v-if="unreadCount > 0"
              class="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-teal-400 text-white text-[10px]"
            >
              {{ unreadBadgeLabel }}
            </span>
          </router-link>

          <router-link 
            :to="'/settings'" 
            :class="navLinkClass('/settings')"
          >
            <!-- NOTE: Removed array filter logic for simplicity, relying on navIconClass for sizing -->
            <Cog6ToothIcon :class="navIconClass('/settings')" />
            <span>Settings</span>
          </router-link>
        </div>

        <!-- User Profile (Desktop) -->
        <div class="hidden md:flex items-center space-x-3 flex-shrink-0">
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
          :to="'/client/jobs'"
          :class="mobileNavLinkClass('/client/jobs')"
          @click="closeMobileMenu"
        >
          <PencilSquareIcon :class="mobileNavIconClass('/client/jobs')" />
          <span>Jobs</span>
        </router-link>
        
        <!-- NEW: Added Proposals to Mobile Menu and Scoped -->
        <router-link 
          :to="'/client/proposals'" 
          :class="mobileNavLinkClass('/client/proposals')"
          @click="closeMobileMenu"
        >
          <DocumentTextIcon :class="mobileNavIconClass('/client/proposals')" />
          <span>Proposals</span>
        </router-link>
        
        <router-link
          :to="'/client/jobs/create'"
          :class="mobileNavLinkClass('/client/jobs/create')"
          @click="closeMobileMenu"
        >
          <UserGroupIcon :class="mobileNavIconClass('/client/jobs/create')" />
          <span>Post Job</span>
        </router-link>


        <router-link 
          :to="'/client/notifications'" 
          :class="['relative', mobileNavLinkClass('/client/notifications')]"
          @click="closeMobileMenu"
        >
          <BellIcon :class="mobileNavIconClass('/client/notifications')" />
          <span>Alerts</span>
          <span
            v-if="unreadCount > 0"
            class="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-teal-400 text-white text-[10px]"
          >
            {{ unreadBadgeLabel }}
          </span>
        </router-link>

        <router-link 
          :to="'/settings'" 
          :class="mobileNavLinkClass('/settings')"
          @click="closeMobileMenu"
        >
          <Cog6ToothIcon :class="mobileNavIconClass('/settings')" />
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { 
  PencilSquareIcon, 
  UserGroupIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  BellIcon
} from '@heroicons/vue/24/outline'
import { useAlerts } from '../../composables/useAlerts'

const route = useRoute()
const userRole = ref<string>('')
const mobileMenuOpen = ref<boolean>(false)
const { unreadCount, getAlerts } = useAlerts()
const unreadBadgeLabel = computed(() => {
  const count = Number(unreadCount.value || 0)
  return count > 9 ? '9+' : String(count)
})

onMounted(async () => {
  // NOTE: This assumes userRole is correctly managed in App.vue based on localStorage
  userRole.value = localStorage.getItem('userRole') || ''
  try {
    await getAlerts()
  } catch (error) {
    console.warn('ClientNavbar: failed to load alerts', error)
  }
})

const userInitial = computed(() => {
  const name = userRole.value || 'U'
  return name.charAt(0).toUpperCase()
})

const userRoleDisplay = computed(() => {
  return userRole.value === 'admin' ? 'Administrator' : userRole.value ? userRole.value.charAt(0).toUpperCase() + userRole.value.slice(1) : 'User'
})
function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function navLinkClass(path: string) {
  // FIX: Use startsWith to handle nested routes (e.g., /client/settings/profile)
  const isActive = route.path.startsWith(path)
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
    'py-2',
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

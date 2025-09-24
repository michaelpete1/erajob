<template>
  <nav class="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50 hidden md:block">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo/Brand -->
        <div class="flex items-center">
          <router-link :to="userRole === 'agent' ? '/agent/gigs-listing' : '/client/projects'" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-brand-teal rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">EJ</span>
            </div>
            <span class="text-xl font-bold text-gray-900">EraJob</span>
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="flex items-center space-x-1">
          <!-- Agent-specific links -->
          <template v-if="userRole === 'agent'">
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
          </template>

          <!-- Client-specific links -->
          <template v-if="userRole === 'client'">
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
          </template>


          <router-link 
            :to="userRole === 'client' ? '/client/notifications' : '/notifications'" 
            :class="['relative', navLinkClass(userRole === 'client' ? '/client/notifications' : '/notifications')]"
          >
            <CheckCircleIcon :class="navIconClass(userRole === 'client' ? '/client/notifications' : '/notifications')" />
            <span>Alerts</span>
            <span class="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-teal-400 text-white text-[10px]">3</span>
          </router-link>

          <router-link 
            :to="userRole === 'client' ? '/client/settings' : '/settings'" 
            :class="navLinkClass(userRole === 'client' ? '/client/settings' : '/settings')"
          >
            <AdjustmentsHorizontalIcon :class="navIconClass(userRole === 'client' ? '/client/settings' : '/settings')" />
            <span>Settings</span>
          </router-link>
        </div>

        <!-- User Profile -->
        <div class="flex items-center space-x-3">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span class="text-gray-600 text-sm font-medium">
                {{ userInitial }}
              </span>
            </div>
            <span class="text-sm text-gray-700">{{ userRoleDisplay }}</span>
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
  CheckCircleIcon
} from '@heroicons/vue/24/solid'
import { useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'

const route = useRoute()
const userRole = ref<string>('')

onMounted(() => {
  userRole.value = localStorage.getItem('userRole') || ''
})

const userInitial = computed(() => {
  return userRole.value ? userRole.value.charAt(0).toUpperCase() : 'U'
})

const userRoleDisplay = computed(() => {
  return userRole.value ? userRole.value.charAt(0).toUpperCase() + userRole.value.slice(1) : 'User'
})

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
</script>

<style scoped>
/* Add padding to body content to account for fixed navbar */
.top-nav-safe { 
  padding-top: 64px; 
}
</style>

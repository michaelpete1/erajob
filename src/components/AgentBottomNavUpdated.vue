<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg z-50 lg:hidden">
    <div class="max-w-lg mx-auto px-2 py-2">
      <div class="flex items-center justify-around">
        <!-- Projects Button -->
        <router-link 
          to="/agent/gigs-listing" 
          :class="navItemClass('/agent/gigs-listing')"
          class="flex flex-col items-center justify-center flex-1 py-2"
        >
          <PencilSquareIcon :class="iconClass('/agent/gigs-listing')" />
          <span class="text-xs mt-1">Projects</span>
        </router-link>

        <!-- Messages Button -->
        <router-link 
          to="/messages" 
          :class="navItemClass('/messages')"
          class="flex flex-col items-center justify-center flex-1 py-2"
        >
          <MusicalNoteIcon :class="iconClass('/messages')" />
          <span class="text-xs mt-1">Messages</span>
        </router-link>

        <!-- Dashboard Button (replaces plus button for agents) -->
        <router-link 
          to="/agent/logging-dashboard" 
          :class="navItemClass('/agent/logging-dashboard')"
          class="flex flex-col items-center justify-center flex-1 py-2"
        >
          <ChartBarIcon :class="iconClass('/agent/logging-dashboard')" />
          <span class="text-xs mt-1">Dashboard</span>
        </router-link>

        <!-- Notifications Button -->
        <router-link 
          to="/notifications" 
          :class="['relative', navItemClass('/notifications')]"
          class="flex flex-col items-center justify-center flex-1 py-2"
        >
          <CheckCircleIcon :class="iconClass('/notifications')" />
          <span class="text-xs mt-1">Alerts</span>
          <span class="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-teal-400 text-white text-[10px]">3</span>
        </router-link>

        <!-- Settings Button -->
        <router-link 
          to="/settings" 
          :class="navItemClass('/settings')"
          class="flex flex-col items-center justify-center flex-1 py-2"
        >
          <AdjustmentsHorizontalIcon :class="iconClass('/settings')" />
          <span class="text-xs mt-1">Settings</span>
        </router-link>
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
  MusicalNoteIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/solid'
import { useRoute } from 'vue-router'

const route = useRoute()

// Navigation item classes
function navItemClass(path: string) {
  const isActive = route.path === path
  return [
    'transition-colors',
    'duration-200',
    isActive 
      ? 'text-brand-teal' 
      : 'text-gray-600 hover:text-gray-900'
  ]
}

// Icon classes
function iconClass(path: string) {
  const isActive = route.path === path
  return [
    'w-6',
    'h-6',
    isActive ? 'text-brand-teal' : 'text-gray-600'
  ]
}
</script>

<style scoped>
/* Add padding to body content to account for fixed bottom nav */
.agent-bottom-nav-safe { 
  padding-bottom: 80px; 
}
</style>

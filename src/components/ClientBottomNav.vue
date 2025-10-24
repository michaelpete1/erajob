<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg z-50 lg:hidden">
    <div class="max-w-lg mx-auto px-2 py-1.5">
      <div class="flex items-center justify-around">
        <!-- Projects Button -->
        <router-link 
          to="/client/projects" 
          :class="navItemClass('/client/projects')"
          class="flex flex-col items-center justify-center flex-1 py-1.5"
        >
          <PencilSquareIcon :class="iconClass('/client/projects')" />
          <span class="text-[11px] mt-0.5">Projects</span>
        </router-link>

        <!-- Proposals Button -->
        <router-link 
          to="/client/proposals" 
          :class="navItemClass('/client/proposals')"
          class="flex flex-col items-center justify-center flex-1 py-1.5"
        >
          <DocumentTextIcon :class="iconClass('/client/proposals')" />
          <span class="text-[11px] mt-0.5">Proposals</span>
        </router-link>

        <!-- Plus Button (Only for Clients on Project Pages) -->
        <button
          v-if="showPlusButton"
          @click="handlePlusClick"
          class="flex flex-col items-center justify-center flex-1 py-1.5"
        >
          <div class="w-12 h-12 bg-brand-teal rounded-full flex items-center justify-center shadow-lg hover:bg-brand-teal-600 transition-colors">
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span class="text-[11px] mt-0.5 text-gray-600">Create</span>
        </button>

        <!-- Notifications Button -->
        <router-link 
          to="/client/notifications" 
          :class="['relative', navItemClass('/client/notifications')]"
          class="flex flex-col items-center justify-center flex-1 py-1.5"
        >
          <CheckCircleIcon :class="iconClass('/client/notifications')" />
          <span class="text-[11px] mt-0.5">Alerts</span>
          <span class="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-teal-400 text-white text-[10px]">3</span>
        </router-link>

        <!-- Settings Button -->
        <router-link 
          to="/client/settings" 
          :class="navItemClass('/client/settings')"
          class="flex flex-col items-center justify-center flex-1 py-1.5"
        >
          <AdjustmentsHorizontalIcon :class="iconClass('/client/settings')" />
          <span class="text-[11px] mt-0.5">Settings</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {
  PencilSquareIcon,
  AdjustmentsHorizontalIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'
import {
  CheckCircleIcon
} from '@heroicons/vue/24/solid'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()
// Check if plus button should be shown (only for clients on project-related pages)
const showPlusButton = computed(() => {
  const clientProjectPages = [
    '/client/projects',
    '/client/projects/create',
    '/client/explore-gigs'
  ]
  
  // Uses startsWith to match nested routes under the primary paths
  return clientProjectPages.some(page => route.path.startsWith(page))
})

// Handle plus button click
function handlePlusClick() {
  router.push('/client/projects/create')
}

// Navigation item classes
function navItemClass(path: string) {
  // Use startsWith to handle nested routes (e.g., /client/settings/profile)
  const isActive = route.path.startsWith(path)
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
  // Use startsWith to handle nested routes
  const isActive = route.path.startsWith(path)
  return [
    'w-5',
    'h-5',
    isActive ? 'text-brand-teal' : 'text-gray-600'
  ]
}
</script>

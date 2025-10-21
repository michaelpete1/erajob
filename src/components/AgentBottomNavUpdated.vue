<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg z-50 lg:hidden">
    <div class="max-w-lg mx-auto px-2 py-2">
      <div class="flex items-center justify-around">
        <!-- Explore Gigs -->
        <router-link
          to="/agent/explore-gigs"
          :class="navItemClass('/agent/explore-gigs')"
          class="flex flex-col items-center justify-center flex-1 py-2"
        >
          <BriefcaseIcon :class="iconClass('/agent/explore-gigs')" />
          <span class="text-xs mt-1">Explore</span>
        </router-link>

        <!-- My Gigs -->
        <router-link
          to="/agent/gigs-listing"
          :class="navItemClass('/agent/gigs-listing')"
          class="flex flex-col items-center justify-center flex-1 py-2"
        >
          <ClipboardDocumentListIcon :class="iconClass('/agent/gigs-listing')" />
          <span class="text-xs mt-1">My Gigs</span>
        </router-link>

        <!-- Log Work -->
        <router-link
          to="/agent/log-work"
          :class="['relative', navItemClass('/agent/log-work')]"
          class="flex flex-col items-center justify-center flex-1 py-2"
        >
          <ClockIcon :class="iconClass('/agent/log-work')" />
          <span class="text-xs mt-1">Log Work</span>
        </router-link>

        <!-- Notifications -->
        <router-link
          to="/agent/notifications"
          :class="['relative', navItemClass('/agent/notifications')]"
          class="flex flex-col items-center justify-center flex-1 py-2"
        >
          <BellIcon :class="iconClass('/agent/notifications')" />
          <span class="text-xs mt-1">Alerts</span>
        </router-link>

        <!-- Settings -->
        <router-link
          to="/settings"
          :class="navItemClass('/settings')"
          class="flex flex-col items-center justify-center flex-1 py-2"
        >
          <Cog6ToothIcon :class="iconClass('/settings')" />
          <span class="text-xs mt-1">Settings</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  BriefcaseIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  BellIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()

const navItemClass = (path: string) => {
  const isActive = route.path.startsWith(path)
  return [
    'transition-colors',
    'duration-200',
    isActive ? 'text-brand-teal' : 'text-gray-600 hover:text-gray-900'
  ]
}

const iconClass = (path: string) => {
  const isActive = route.path.startsWith(path)
  return [
    'w-6',
    'h-6',
    isActive ? 'text-brand-teal' : 'text-gray-600'
  ]
}

const BODY_CLASS = 'agent-bottom-nav-safe'

onMounted(() => {
  if (typeof document !== 'undefined') {
    document.body.classList.add(BODY_CLASS)
  }
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.body.classList.remove(BODY_CLASS)
  }
})
</script>

<style scoped>
.agent-bottom-nav-safe {
  padding-bottom: 80px;
}
</style>

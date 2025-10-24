<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg z-50 lg:hidden">
    <div class="max-w-lg mx-auto px-2 py-1.5">
      <div class="flex items-center justify-around">
        <!-- Explore Gigs -->
        <router-link
          to="/agent/explore-gigs"
          :class="navItemClass('/agent/explore-gigs')"
          class="flex flex-col items-center justify-center flex-1 py-1.5"
        >
          <BriefcaseIcon :class="iconClass('/agent/explore-gigs')" />
          <span class="text-[11px] mt-0.5">Explore</span>
        </router-link>

        <!-- My Gigs -->
        <router-link
          to="/agent/gigs-listing"
          :class="navItemClass('/agent/gigs-listing')"
          class="flex flex-col items-center justify-center flex-1 py-1.5"
        >
          <ClipboardDocumentListIcon :class="iconClass('/agent/gigs-listing')" />
          <span class="text-[11px] mt-0.5">My Gigs</span>
        </router-link>

        <!-- Log Work -->
        <router-link
          to="/agent/log-work"
          :class="['relative', navItemClass('/agent/log-work')]"
          class="flex flex-col items-center justify-center flex-1 py-1.5"
        >
          <ClockIcon :class="iconClass('/agent/log-work')" />
          <span class="text-[11px] mt-0.5">Log Work</span>
        </router-link>

        <!-- Notifications -->
        <router-link
          to="/agent/notifications"
          :class="['relative', navItemClass('/agent/notifications')]"
          class="flex flex-col items-center justify-center flex-1 py-1.5"
        >
          <BellIcon :class="iconClass('/agent/notifications')" />
          <span class="text-[11px] mt-0.5">Alerts</span>
          <span
            v-if="unreadCount > 0"
            class="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-teal-400 text-white text-[10px]"
          >
            {{ unreadBadgeLabel }}
          </span>
        </router-link>

        <!-- Settings -->
        <router-link
          to="/settings"
          :class="navItemClass('/settings')"
          class="flex flex-col items-center justify-center flex-1 py-1.5"
        >
          <Cog6ToothIcon :class="iconClass('/settings')" />
          <span class="text-[11px] mt-0.5">Settings</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useAlerts } from '../composables/useAlerts'
import {
  BriefcaseIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  BellIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const { unreadCount, getAlerts } = useAlerts()
const unreadBadgeLabel = computed(() => {
  const count = Number(unreadCount.value || 0)
  return count > 9 ? '9+' : String(count)
})
onMounted(async () => {
  try {
    await getAlerts()
  } catch (error) {
    console.warn('AgentBottomNav: failed to load alerts', error)
  }
})

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
    'w-5',
    'h-5',
    isActive ? 'text-brand-teal' : 'text-gray-600'
  ]
}
</script>

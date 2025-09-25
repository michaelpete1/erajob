<template>
  <nav class="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-lg bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg px-4 py-3 flex items-center justify-between z-50 md:hidden">
    <router-link 
      v-if="userRole === 'agent'" 
      :to="'/agent/gigs-listing'" 
      :class="['flex-1', linkClass('/agent/gigs-listing')]" 
      aria-label="Projects"
    >
      <PencilSquareIcon :class="['mb-1', iconClass('/agent/gigs-listing')]" />
      <span class="text-xs">Projects</span>
    </router-link>

    <router-link 
      v-if="userRole === 'agent'" 
      :to="'/agent/log-work'" 
      :class="['flex-1', linkClass('/agent/log-work')]" 
      aria-label="Log Work"
    >
      <PencilSquareIcon :class="['mb-1', iconClass('/agent/log-work')]" />
      <span class="text-xs">Log Work</span>
    </router-link>

    <router-link 
      v-if="userRole === 'agent'" 
      :to="'/agent/logging-dashboard'" 
      :class="['flex-1', linkClass('/agent/logging-dashboard')]" 
      aria-label="Dashboard"
    >
      <ChartBarIcon :class="['mb-1', iconClass('/agent/logging-dashboard')]" />
      <span class="text-xs">Dashboard</span>
    </router-link>

    <router-link :to="'/agent/notifications'" :class="['flex-1', linkClass('/agent/notifications')]" aria-label="Notifications">
      <MusicalNoteIcon :class="['mb-1', iconClass('/agent/notifications')]" />
      <span class="text-xs">Notifications</span>
    </router-link>

    <router-link :to="'/messages'" :class="['flex-1', linkClass('/messages')]" aria-label="Messages">
      <MusicalNoteIcon :class="['mb-1', iconClass('/messages')]" />
      <span class="text-xs">Messages</span>
    </router-link>

    <router-link :to="'/settings'" :class="['flex-1', linkClass('/settings')]" aria-label="Settings">
      <AdjustmentsHorizontalIcon :class="['mb-1', iconClass('/settings')]" />
      <span class="text-xs">Settings</span>
    </router-link>
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
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()
const userRole = ref<string>('')

onMounted(() => {
  userRole.value = localStorage.getItem('userRole') || ''
})

function linkClass(path: string) {
  return ['flex', 'flex-col', 'items-center', 'gap-1', 'text-sm', route.path === path ? 'text-brand-teal' : 'text-gray-600']
}

function iconClass(path: string) {
  return route.path === path ? 'h-6 w-6 text-brand-teal' : 'h-6 w-6 text-gray-600'
}
</script>

<style scoped>
.bottom-nav-safe { padding-bottom: 7rem; }
</style>

<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg z-50 md:hidden">
    <div class="max-w-lg mx-auto px-2 py-2">
      <div class="flex items-center justify-around">
        <!-- Projects Button -->
        <router-link 
          v-if="userRole === 'agent'" 
          :to="'/agent/gigs-listing'" 
          :class="['flex flex-col items-center justify-center flex-1 py-2 min-h-[56px] touch-manipulation', linkClass('/agent/gigs-listing')]" 
          aria-label="Projects"
        >
          <PencilSquareIcon :class="['mb-1', iconClass('/agent/gigs-listing')]" />
          <span class="text-xs mt-0.5">Projects</span>
        </router-link>

        <!-- Log Work Button -->
        <router-link 
          v-if="userRole === 'agent'" 
          :to="'/agent/log-work'" 
          :class="['flex flex-col items-center justify-center flex-1 py-2 min-h-[56px] touch-manipulation', linkClass('/agent/log-work')]" 
          aria-label="Log Work"
        >
          <PencilSquareIcon :class="['mb-1', iconClass('/agent/log-work')]" />
          <span class="text-xs mt-0.5">Log Work</span>
        </router-link>

        <!-- Dashboard Button -->
        <router-link 
          v-if="userRole === 'agent'" 
          :to="'/agent/logging-dashboard'" 
          :class="['flex flex-col items-center justify-center flex-1 py-2 min-h-[56px] touch-manipulation', linkClass('/agent/logging-dashboard')]" 
          aria-label="Dashboard"
        >
          <ChartBarIcon :class="['mb-1', iconClass('/agent/logging-dashboard')]" />
          <span class="text-xs mt-0.5">Dashboard</span>
        </router-link>

        <!-- Notifications Button -->
        <router-link 
          :to="'/agent/notifications'" 
          :class="['flex flex-col items-center justify-center flex-1 py-2 min-h-[56px] touch-manipulation', linkClass('/agent/notifications')]" 
        >
          <MusicalNoteIcon :class="['mb-1', iconClass('/agent/notifications')]" />
          <span class="text-xs mt-0.5">Notifications</span>
        </router-link>

        <!-- Proposals Button -->
        <router-link 
          :to="'/proposals'" 
          :class="['flex flex-col items-center justify-center flex-1 py-2 min-h-[56px] touch-manipulation', linkClass('/proposals')]" 
          aria-label="Proposals"
        >
          <DocumentIcon :class="['mb-1', iconClass('/proposals')]" />
          <span class="text-xs mt-0.5">Proposals</span>
        </router-link>

        <!-- Settings Button -->
        <router-link 
          :to="'/settings'" 
          aria-label="Settings"
        >
          <AdjustmentsHorizontalIcon :class="['mb-1', iconClass('/settings')]" />
          <span class="text-xs mt-0.5">Settings</span>
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
  return [
    'transition-colors',
    'duration-200',
    route.path === path ? 'text-brand-teal' : 'text-gray-600 hover:text-gray-900'
  ]
}

function iconClass(path: string) {
  return [
    'w-5', 
    'h-5',
    route.path === path ? 'text-brand-teal' : 'text-gray-600'
  ]
}
</script>

<style scoped>
.bottom-nav-safe { 
  padding-bottom: 80px; 
}
</style>

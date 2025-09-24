<template>
  <nav class="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-lg bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg px-4 py-3 flex items-center justify-between z-50 md:hidden">
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
      v-if="userRole === 'client'" 
      :to="'/client/projects'" 
      :class="['flex-1', linkClass('/client/projects')]" 
      aria-label="Projects"
    >
      <PencilSquareIcon :class="['mb-1', iconClass('/client/projects')]" />
      <span class="text-xs">Projects</span>
    </router-link>

    <router-link 
      :to="userRole === 'client' ? '/client/notifications' : '/notifications'" 
      :class="['relative', 'flex-1', linkClass(userRole === 'client' ? '/client/notifications' : '/notifications')]" 
      aria-label="Notifications"
    >
      <CheckCircleIcon :class="['mb-1', iconClass(userRole === 'client' ? '/client/notifications' : '/notifications')]" />
      <span class="absolute -top-1 -right-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-teal-400 text-white text-[10px]">3</span>
      <span class="text-xs">Alerts</span>
    </router-link>

    <router-link 
      :to="userRole === 'client' ? '/client/settings' : '/settings'" 
      :class="['flex-1', linkClass(userRole === 'client' ? '/client/settings' : '/settings')]" 
      aria-label="Settings"
    >
      <AdjustmentsHorizontalIcon :class="['mb-1', iconClass(userRole === 'client' ? '/client/settings' : '/settings')]" />
      <span class="text-xs">Settings</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { PencilSquareIcon, AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline'
import { CheckCircleIcon } from '@heroicons/vue/24/solid'
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

.bottom-nav-safe { padding-bottom: 72px; }
</style>

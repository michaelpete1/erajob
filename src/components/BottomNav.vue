<template>
  <nav class="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-lg bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg px-4 py-3 flex items-center justify-between z-50 md:hidden">
    <router-link :to="'/agent/gigs-listing'" :class="['flex-1', linkClass('/agent/gigs-listing')]" aria-label="Projects">
      <PencilSquareIcon :class="['mb-1', iconClass('/agent/gigs-listing')]" />
      <span class="text-xs">Projects</span>
    </router-link>

    <router-link :to="'/messages'" :class="['flex-1', linkClass('/messages')]" aria-label="Messages">
      <MusicalNoteIcon :class="['mb-1', iconClass('/messages')]" />
      <span class="text-xs">Messages</span>
    </router-link>

    <router-link :to="'/notifications'" :class="['relative', 'flex-1', linkClass('/notifications')]" aria-label="Notifications">
      <CheckCircleIcon :class="['mb-1', iconClass('/notifications')]" />
      <span class="absolute -top-1 -right-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-teal-400 text-white text-[10px]">3</span>
      <span class="text-xs">Alerts</span>
    </router-link>

    <router-link :to="'/settings'" :class="['flex-1', linkClass('/settings')]" aria-label="Settings">
      <AdjustmentsHorizontalIcon :class="['mb-1', iconClass('/settings')]" />
      <span class="text-xs">Settings</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { PencilSquareIcon, AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline'
import { CheckCircleIcon, MusicalNoteIcon } from '@heroicons/vue/24/solid'
import { useRoute } from 'vue-router'

const route = useRoute()

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

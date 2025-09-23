<template>
  <nav class="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-lg bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg px-4 py-3 flex items-center justify-between z-50 md:hidden">
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
      v-if="userRole === 'client'" 
      :to="'/client/explore-gigs'" 
      :class="['flex-1', linkClass('/client/explore-gigs')]" 
      aria-label="Explore"
    >
      <CheckCircleIcon :class="['mb-1', iconClass('/client/explore-gigs')]" />
      <span class="text-xs">Explore</span>
    </router-link>

    <router-link 
      v-if="userRole === 'client'" 
      :to="'/client/projects/create'" 
      :class="['flex-1', linkClass('/client/projects/create')]" 
      aria-label="Post Job"
    >
      <MusicalNoteIcon :class="['mb-1', iconClass('/client/projects/create')]" />
      <span class="text-xs">Post Job</span>
    </router-link>

    <router-link :to="'/client/messages'" :class="['flex-1', linkClass('/client/messages')]" aria-label="Messages">
      <MusicalNoteIcon :class="['mb-1', iconClass('/client/messages')]" />
      <span class="text-xs">Messages</span>
    </router-link>

    <router-link :to="'/client/settings'" :class="['flex-1', linkClass('/client/settings')]" aria-label="Settings">
      <AdjustmentsHorizontalIcon :class="['mb-1', iconClass('/client/settings')]" />
      <span class="text-xs">Settings</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { 
  PencilSquareIcon, 
  AdjustmentsHorizontalIcon 
} from '@heroicons/vue/24/outline'
import { 
  CheckCircleIcon, 
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
.bottom-nav-safe { padding-bottom: 72px; }
</style>

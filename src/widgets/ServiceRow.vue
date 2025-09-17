<template>
  <li class="group flex items-center justify-between gap-3 py-3">
    <div class="flex items-start gap-3">
      <component :is="icon" v-if="icon" class="mt-0.5 h-6 w-6 text-gray-500" />
      <svg v-else class="mt-0.5 h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5" class="text-gray-300" />
        <path d="M7 12h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      <div>
        <p class="text-sm font-medium text-gray-900">{{ title }}</p>
        <p v-if="subtitle" class="text-xs text-gray-500">{{ subtitle }}</p>
      </div>
    </div>
    <ChevronRightIcon class="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-0.5" />
  </li>
</template>

<script setup lang="ts">
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
interface Props {
  title: string
  subtitle?: string
  icon?: any
}
defineProps<Props>()
</script>

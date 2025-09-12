<template>
  <li class="group flex items-center justify-between gap-3 py-3">
    <div class="flex items-start gap-3">
      <component :is="icon" v-if="icon" class="mt-0.5 h-6 w-6 text-gray-500" />
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

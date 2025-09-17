<template>
  <button 
    @click="goHome" 
    class="transition-colors duration-200 focus:outline-none"
    :class="[
      variant === 'icon' ? 'p-1' : 'px-3 py-2',
      'text-white hover:text-white/80',
      customClass
    ]"
    :title="title"
  >
    <svg 
      v-if="showIcon" 
      xmlns="http://www.w3.org/2000/svg" 
      class="h-6 w-6" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      stroke-width="2"
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="2" 
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
      />
    </svg>
    <span v-if="variant === 'text' || variant === 'both'" class="text-sm font-medium">
      {{ label }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  variant?: 'icon' | 'text' | 'both'
  label?: string
  title?: string
  showIcon?: boolean
  customClass?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'both',
  label: 'Home',
  title: 'Go to Home',
  showIcon: true,
  customClass: ''
})

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

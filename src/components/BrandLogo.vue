<template>
  <img :src="resolvedSrc" :alt="alt" :class="computedClass" />
</template>

<script setup lang="ts">
import defaultLogo from '../assets/B_logo-removebg-preview.png'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  alt?: string
  src?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  alt: 'Brand Logo',
  src: '',
})

const computedClass = {
  sm: 'h-6 w-auto',
  md: 'h-8 w-auto',
  lg: 'h-10 w-auto',
}[props.size]

const resolvedSrc = props.src || defaultLogo
</script>

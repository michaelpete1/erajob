<template>
  <!-- Outer page background wrapper -->
  <div :class="outerClass">
    <!-- Centered content card for desktop, full-bleed on mobile -->
    <div class="mx-auto w-full max-w-[440px] md:max-w-[720px] lg:max-w-[900px]">
      <div
        class="md:mx-auto md:my-8 md:rounded-2xl md:border md:bg-white md:shadow-lg"
        :class="cardPadding"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  padded?: boolean
  bg?: string // background utility classes for the outer wrapper
}
const props = withDefaults(defineProps<Props>(), {
  padded: true,
  bg: 'min-h-svh bg-white',
})

const outerClass = props.bg
const cardPadding = props.padded ? 'px-4 py-6 md:px-8 md:py-8' : ''
</script>

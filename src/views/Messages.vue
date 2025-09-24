<template>
  <div class="min-h-screen bg-white">
    <header class="bg-brand-teal text-white px-4 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button @click="$router.back()" aria-label="Back" class="p-1 text-white/95 hover:text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-lg font-semibold">Messages</h1>
      </div>
    </header>
    <main class="p-4 pb-24">
      <p class="text-gray-700">Messages placeholder</p>
    </main>
  </div>
</template>

<script setup lang="ts">
// This page uses role-based navigation from App.vue
</script>

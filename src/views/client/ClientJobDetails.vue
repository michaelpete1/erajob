<template>
  <div class="min-h-screen bg-gray-50">
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script setup lang="ts">
</script>
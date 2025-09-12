<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
// App shell renders routed views

const routeError = ref<string | null>(null)
onErrorCaptured((err) => {
  // capture runtime errors from routed components and show UI
  // eslint-disable-next-line no-console
  console.error('Captured render error:', err)
  routeError.value = String((err as any)?.message ?? err)
  // prevent further propagation
  return false
})

function reloadApp() {
  // quick retry path
  window.location.reload()
}
</script>

<template>
  <div id="app-shell" class="min-h-screen">
    <template v-if="!routeError">
      <router-view v-slot="{ Component }">
        <Transition name="route" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </template>

    <template v-else>
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="max-w-lg mx-auto p-6 rounded-2xl bg-white shadow-lg text-center">
          <h3 class="text-lg font-semibold mb-2">An error occurred</h3>
          <p class="text-sm text-gray-600 mb-4">{{ routeError }}</p>
          <button @click="reloadApp" class="inline-block rounded-full bg-brand-teal px-6 py-2 text-white font-semibold">Reload</button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.route-enter-from { opacity: 0; transform: translateY(8px); }
.route-enter-active { transition: all 250ms ease; }
.route-leave-to { opacity: 0; transform: translateY(-8px); }
.route-leave-active { transition: all 200ms ease; }
</style>

<script setup lang="ts">
import { ref, onErrorCaptured, onMounted } from 'vue'
import TopNav from './components/TopNav.vue'
import ClientNavbar from './components/ClientNavbar.vue'

const routeError = ref<string | null>(null)
const userRole = ref<string>('')

onMounted(() => {
  const storedRole = localStorage.getItem('userRole')
  console.log('Debug - stored userRole from localStorage:', storedRole)
  userRole.value = storedRole || ''
  console.log('Debug - userRole.value set to:', userRole.value)
  console.log('Debug - should show ClientNavbar:', userRole.value === 'client')
})

onErrorCaptured((err) => {
  
  
  console.error('Captured render error:', err)
  routeError.value = String((err as any)?.message ?? err)
  
  return false
})

function reloadApp() {
  
  window.location.reload()
}
</script>

<template>
  <div id="app-shell" class="min-h-screen" :class="userRole === 'client' ? 'client-navbar-safe' : 'top-nav-safe'">
    <!-- Conditional Navigation -->
    <ClientNavbar v-if="userRole === 'client'" />
    <TopNav v-else />
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

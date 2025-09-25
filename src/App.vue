<script setup lang="ts">
import { ref, onErrorCaptured, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import AgentNavbar from './components/AgentNavbar.vue'
import ClientNavbar from './components/ClientNavbar.vue'
import ClientBottomNav from './components/ClientBottomNav.vue'
import AgentBottomNav from './components/AgentBottomNavUpdated.vue'
import AdminBottomNav from './components/AdminBottomNav.vue'

const routeError = ref<string | null>(null)
const userRole = ref<string>('')
const currentRoute = useRoute()

// Check if current route is an authentication page
const isAuthPage = computed(() => {
  const authRoutes = ['/', '/sign-in', '/sign-up', '/role-select']
  return authRoutes.includes(currentRoute.path)
})

// Check if navbar should be shown
const shouldShowNavbar = computed(() => {
  // Show navbar for all authenticated routes except auth pages
  return !isAuthPage.value
})

// Compute navbar padding class based on user role
const navbarPaddingClass = computed(() => {
  if (userRole.value === 'client') {
    return 'client-navbar-safe'
  } else if (userRole.value === 'agent') {
    return 'agent-navbar-safe'
  } else if (userRole.value === 'admin') {
    return 'admin-navbar-safe'
  }
  return ''
})

// Compute bottom nav padding class
const bottomNavPaddingClass = computed(() => {
  if (userRole.value === 'client') {
    return 'client-bottom-nav-safe'
  } else if (userRole.value === 'agent') {
    return 'agent-bottom-nav-safe'
  } else if (userRole.value === 'admin') {
    return 'admin-bottom-nav-safe'
  }
  return ''
})

onMounted(() => {
  updateUserRole()
  
  // Listen for storage changes to update role reactively
  window.addEventListener('storage', updateUserRole)
})

// Function to update user role
function updateUserRole() {
  const storedRole = localStorage.getItem('userRole')
  console.log('Debug - stored userRole from localStorage:', storedRole)
  userRole.value = storedRole || ''
  console.log('Debug - userRole.value set to:', userRole.value)
  console.log('Debug - should show ClientNavbar:', shouldShowNavbar.value && userRole.value === 'client')
  console.log('Debug - should show AgentNavbar:', shouldShowNavbar.value && userRole.value === 'agent')
  console.log('Debug - isAuthPage:', isAuthPage.value)
  console.log('Debug - shouldShowNavbar:', shouldShowNavbar.value)
  console.log('Debug - current route:', currentRoute.path)
}

// Cleanup event listener
onUnmounted(() => {
  window.removeEventListener('storage', updateUserRole)
})

// Watch for route changes and update role
watch(currentRoute, () => {
  updateUserRole()
}, { immediate: false })

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
  <div id="app-shell" class="min-h-screen" :class="[navbarPaddingClass, bottomNavPaddingClass]">
    <!-- Conditional Top Navigation -->
    <ClientNavbar v-if="shouldShowNavbar && userRole === 'client'" />
    <AgentNavbar v-else-if="shouldShowNavbar && userRole === 'agent'" />
    
    <!-- Role-specific Bottom Navigation (Mobile Only) -->
    <ClientBottomNav v-if="shouldShowNavbar && userRole === 'client'" />
    <AgentBottomNav v-if="shouldShowNavbar && userRole === 'agent'" />
    <AdminBottomNav v-if="shouldShowNavbar && userRole === 'admin'" />
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

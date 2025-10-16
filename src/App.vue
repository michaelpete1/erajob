<script setup lang="ts">
import { ref, onErrorCaptured, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import AgentNavbar from './components/AgentNavbar.vue'
import ClientNavbar from './components/navbar/ClientNavbar.vue'
import ClientBottomNav from './components/ClientBottomNav.vue'
import AdminBottomNav from './components/AdminBottomNav.vue'

const AUTH_BASE_ROUTES = [
  '/',
  '/sign-in',
  '/sign-up',
  '/role-select',
  '/forgot-password',
  '/reset-password',
  '/admin/sign-in'
]

const AUTH_ROUTE_PREFIXES = [
  '/client/welcome',
  '/client/services',
  '/client/congrats',
  '/agent/welcome',
  '/agent/services',
  '/agent/congrats',
  '/agent/welcome-back',
  '/agent/explore-gigs',
  '/admin/sign-in'
]

const routeError = ref<string | null>(null)
const userRole = ref<string>('')
const currentRoute = useRoute()


const isAuthPage = computed(() => {
  const path = currentRoute.path
  if (AUTH_BASE_ROUTES.includes(path)) {
    return true
  }
  return AUTH_ROUTE_PREFIXES.some(prefix => path.startsWith(prefix))
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
// In App.vue
function updateUserRole() {
  // Clear any existing role
  userRole.value = '';

  // Check authentication status
  const isAuthenticated = !!localStorage.getItem('access_token');

  if (!isAuthenticated) {
    // If not authenticated, clear any existing role and redirect to login
    localStorage.removeItem('userRole');
    return;
  }

  // Get role from localStorage (set during login)
  const storedRole = localStorage.getItem('userRole');

  if (storedRole && ['client', 'agent', 'admin'].includes(storedRole)) {
    userRole.value = storedRole;
  } else {
    // If no valid role is found, log the user out for security
    console.warn('No valid role found, logging out...');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userRole');
    window.location.href = '/sign-in';
  }

  // Ensure role is consistent with route
  const currentPath = window.location.pathname
  const isAuthPath = AUTH_BASE_ROUTES.includes(currentPath) || AUTH_ROUTE_PREFIXES.some(prefix => currentPath.startsWith(prefix))
  if (isAuthPath) {
    return;
  }

  if (userRole.value === 'client' && currentPath.startsWith('/agent')) {
    // Redirect to client dashboard if trying to access agent routes as client
    window.location.href = '/client/dashboard';
  } else if (userRole.value === 'agent' && currentPath.startsWith('/client')) {
    // Redirect to agent dashboard if trying to access client routes as agent
    window.location.href = '/agent/dashboard';
  } else if (userRole.value === 'admin' && !currentPath.startsWith('/admin')) {
    // Redirect to admin dashboard if trying to access non-admin routes as admin
    window.location.href = '/admin/job-approval';
  }
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

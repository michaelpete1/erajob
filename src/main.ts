import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)
const pinia = createPinia()

// Initialize authentication state on app startup
const initializeAuth = () => {
  const authStore = useAuthStore(pinia)
  authStore.initialize()
}

// Import auth store after pinia is created
import { useAuthStore } from './stores/auth'

// Global Vue error handler (dev helper)
app.config.errorHandler = (err: unknown, vm, info) => {
  // log to console
  // eslint-disable-next-line no-console
  console.error('Vue errorHandler:', err, info, vm)
  // show an alert in dev to make the error obvious when navigating
  try { alert(`Vue error: ${String((err as any)?.message ?? err)}`) } catch (e) {}
}

// Router error + navigation logging
let __importErrorCount = 0
router.onError((err: unknown) => {
  // eslint-disable-next-line no-console
  console.error('Router error:', err)
  try { alert(`Router error: ${String((err as any)?.message ?? err)}`) } catch (e) {}

  // Auto-recover common dev-time dynamic import failures by reloading once
  const msg = String((err as any)?.message || '')
  if (/Failed to fetch dynamically imported module/.test(msg) && __importErrorCount === 0) {
    __importErrorCount++
    // give Vite a moment to recompile, then reload
    setTimeout(() => {
      // eslint-disable-next-line no-restricted-globals
      location.reload()
    }, 400)
  }
})

router.afterEach((to, from) => {
  // eslint-disable-next-line no-console
  console.log('navigated to', to.fullPath, 'from', from.fullPath)
})

// Window-level handlers for uncaught errors/promises
window.addEventListener('error', (e) => {
  // eslint-disable-next-line no-console
  console.error('Uncaught error:', e.error || e)
})
window.addEventListener('unhandledrejection', (e) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled rejection:', e.reason || e)
})

// Initialize auth before mounting
initializeAuth()

app.use(pinia).use(router).use(Toast as any, {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
})

// Add global listener for failed refresh attempts to notify user and redirect
import { useToast } from 'vue-toastification'
import { clearAuthData } from '@/utils/auth'
const toast = useToast()
window.addEventListener('auth:refreshFailed', (ev: any) => {
  try {
    console.warn('auth:refreshFailed event', ev?.detail)
    toast.error('Session expired. Please sign in again.')
    clearAuthData()
    // Slight delay to let the toast appear
    setTimeout(() => {
      try { router.push('/sign-in') } catch (e) { window.location.href = '/sign-in' }
    }, 600)
  } catch (e) {
    console.error('Error handling auth:refreshFailed', e)
  }
})

app.mount('#app')

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

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
router.onError((err: unknown) => {
  // eslint-disable-next-line no-console
  console.error('Router error:', err)
  try { alert(`Router error: ${String((err as any)?.message ?? err)}`) } catch (e) {}
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

app.use(pinia).use(router).mount('#app')

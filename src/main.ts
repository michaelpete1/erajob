import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

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

app.use(router).mount('#app')

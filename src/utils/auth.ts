import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

/**
 * Clears all authentication data from storage
 */
export const clearAuthData = () => {
  // Clear all auth-related data
  const authItems = [
    'access_token',
    'refresh_token',
    'userRole',
    'userName',
    'userEmail',
    'clientProfile',
    'userInfo',
    'selectedGig'
  ]
  
  authItems.forEach(item => {
    localStorage.removeItem(item)
    sessionStorage.removeItem(item)
  })

  // Clear all cookies (if any)
  document.cookie.split(';').forEach(cookie => {
    const [name] = cookie.trim().split('=')
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  })
}

/**
 * Handles account deletion cleanup and redirection
 */
export const handleAccountDeletion = async () => {
  // Clear all auth data
  clearAuthData()
  
  // Clear service worker caches
  if ('caches' in window) {
    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)))
  }
  
  // Force a hard redirect to sign-in with account deletion flag
  window.location.href = '/sign-in?accountDeleted=true'
}

/**
 * Checks if the current session is still valid
 */
export const validateSession = async (): Promise<boolean> => {
  try {
    // Check if we have a token
    const token = localStorage.getItem('access_token')
    if (!token || typeof token !== 'string' || token.trim() === '') return false

    // For now, we'll just check if the token exists and has content
    // TODO: Implement proper token validation with API call
    return true
  } catch (error) {
    console.error('Session validation error:', error)
    return false
  }
}

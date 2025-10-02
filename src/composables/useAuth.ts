// src/composables/useAuth.ts

import { ref, computed, onMounted } from 'vue'
import { authService } from '../services'
import type { UserLogin, UserBase, AuthState } from '../types/api'

export function useAuth() {
  const authState = ref<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
  })

  // Computed properties
  const isAuthenticated = computed(() => authState.value.isAuthenticated)
  const currentUser = computed(() => authState.value.user)
  const userRole = computed(() => {
    const role = authState.value.user?.role
    if (typeof role === 'string') return role
    if (typeof role === 'object' && role !== null) {
      return role.type || role.role || 'unknown'
    }
    return null
  })
  const loading = computed(() => authState.value.loading)
  const error = computed(() => authState.value.error)

  // Actions
  const login = async (credentials: UserLogin) => {
    const result = await authService.login(credentials)

    if (result.success && result.data) {
      authState.value = {
        isAuthenticated: true,
        user: result.data,
        loading: false,
        error: null
      }
    } else {
      authState.value = {
        ...authState.value,
        loading: false,
        error: result.error || 'Login failed'
      }
    }

    return result
  }

  const signup = async (userData: UserBase) => {
    const result = await authService.signup(userData)

    if (result.success && result.data) {
      authState.value = {
        isAuthenticated: true,
        user: result.data,
        loading: false,
        error: null
      }
    } else {
      authState.value = {
        ...authState.value,
        loading: false,
        error: result.error || 'Signup failed'
      }
    }

    return result
  }

  const logout = async () => {
    const result = await authService.logout()

    if (result.success) {
      authState.value = {
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      }
    }

    return result
  }

  const refreshUser = async () => {
    const result = await authService.getCurrentUser()

    if (result.success && result.data) {
      authState.value.user = result.data
    }

    return result
  }

  const deleteAccount = async () => {
    const result = await authService.deleteAccount()

    if (result.success) {
      authState.value = {
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      }
    }

    return result
  }

  const clearError = () => {
    authState.value.error = null
  }

  // Initialize auth state on mount
  onMounted(() => {
    const currentState = authService.getAuthState()
    authState.value = currentState

    // Refresh user data if authenticated
    if (currentState.isAuthenticated) {
      refreshUser()
    }
  })

  return {
    // State
    isAuthenticated,
    currentUser,
    userRole,
    loading,
    error,

    // Actions
    login,
    signup,
    logout,
    refreshUser,
    deleteAccount,
    clearError
  }
}

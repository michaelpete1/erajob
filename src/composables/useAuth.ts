// src/composables/useAuth.ts

import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import authService from '@/services/authService'
import type { LoginCredentials, SignupData, AuthResponse, User } from '@/types/api/auth'

const user = useStorage<User | null>('user-session', null)
const token = useStorage<string | null>('access_token', null)

const loading = ref(false)
const error = ref<string | null>(null)

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const setError = (message: string) => {
    error.value = message
  }

  const clearError = () => {
    error.value = null
  }

  const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    loading.value = true
    clearError()
    try {
      const response = await authService.login(credentials)
      if (response.success && response.user && response.token) {
        user.value = response.user
        token.value = response.token
      } else {
        setError(response.error || 'Login failed')
      }
      return response
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred during login.'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  const signupUser = async (data: SignupData): Promise<AuthResponse> => {
    loading.value = true
    clearError()
    try {
      const response = await authService.signup(data)
      if (response.success && response.user && response.token) {
        user.value = response.user
        token.value = response.token
      } else {
        setError(response.error || 'Signup failed')
      }
      return response
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred during signup.'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  const logoutUser = () => {
    user.value = null
    token.value = null
  }

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    loginUser,
    signupUser,
    logoutUser,
    setError,
    clearError,
  }
}
// src/services/authService.ts

import { apiClient } from './api'
import { STORAGE_CONFIG, debugLog } from '../config'
import type { UserLogin, UserBase, UserOut, ApiResponse, AuthState, ServiceResponse } from '../types/api'

export class AuthService {
  private authState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
  }

  private static instance: AuthService

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  /**
   * Get stored user data from localStorage
   */
  private getStoredAuthData(): { token: string | null; userData: UserOut | null } {
    const token = localStorage.getItem(STORAGE_CONFIG.tokenKey)
    const userDataStr = localStorage.getItem(STORAGE_CONFIG.userKey)
    const userData = userDataStr ? JSON.parse(userDataStr) : null
    debugLog('Retrieved stored auth data', { hasToken: !!token, hasUserData: !!userData })
    return { token, userData }
  }

  /**
   * Store authentication data
   */
  private storeAuthData(token: string, userData: UserOut): void {
    localStorage.setItem(STORAGE_CONFIG.tokenKey, token)
    localStorage.setItem(STORAGE_CONFIG.userKey, JSON.stringify(userData))
    localStorage.setItem('userRole', JSON.stringify(userData.role))
    debugLog('Auth data stored', { role: userData.role })
  }

  /**
   * Clear authentication data
   */
  private clearAuthData(): void {
    localStorage.removeItem(STORAGE_CONFIG.tokenKey)
    localStorage.removeItem(STORAGE_CONFIG.userKey)
    localStorage.removeItem('userRole')

    // Reset state
    this.authState.isAuthenticated = false
    this.authState.user = null
    this.authState.error = null
    debugLog('Auth data cleared')
  }

  /**
   * Get current authentication state
   */
  public getAuthState(): AuthState {
    const { token, userData } = this.getStoredAuthData()
    
    if (token && userData) {
      this.authState = {
        isAuthenticated: true,
        user: userData,
        loading: false,
        error: null
      }
    }
    
    return { ...this.authState }
  }

  /**
   * Login user
   */
  public async login(credentials: UserLogin): Promise<ServiceResponse<UserOut>> {
    this.authState.loading = true
    this.authState.error = null
    
    try {
      // Try real API first
      const response = await apiClient.post<ApiResponse<UserOut>>('/v1/users/login', credentials)
      const responseData = response.data.data
      const user = responseData as UserOut
      const access_token = (responseData as any).access_token
      
      if (access_token) {
        this.storeAuthData(access_token, user)
      }
      
      this.authState.loading = false
      return { success: true, data: user, error: this.authState.error || undefined }
    } catch (error) {
      this.authState.loading = false
      this.authState.error = error instanceof Error ? error.message : 'Login failed'
      return { success: false, data: undefined, error: this.authState.error || undefined }
    }
  }

  /**
   * Signup user
   */
  public async signup(userData: UserBase): Promise<ServiceResponse<UserOut>> {
    this.authState.loading = true
    this.authState.error = null
    
    try {
      // Try real API first
      const response = await apiClient.post<ApiResponse<UserOut>>('/v1/users/signup', userData)
      const responseData = response.data.data
      const user = responseData as UserOut
      const access_token = (responseData as any).access_token
      
      if (access_token) {
        this.storeAuthData(access_token, user)
      }
      
      this.authState.loading = false
      return { success: true, data: user, error: this.authState.error || undefined }
    } catch (error) {
      this.authState.loading = false
      this.authState.error = error instanceof Error ? error.message : 'Signup failed'
      return { success: false, data: undefined, error: this.authState.error || undefined }
    }
  }

  /**
   * Logout user
   */
  public async logout(): Promise<ServiceResponse<void>> {
    try {
      await apiClient.post('/v1/users/logout')
    } catch (error) {
      // Continue with logout even if API call fails
      debugLog('Logout API call failed', { error })
    }
    
    this.clearAuthData()
    
    return {
      success: true
    }
  }

  /**
   * Get current user
   */
  public async getCurrentUser(): Promise<ServiceResponse<UserOut>> {
    try {
      const response = await apiClient.get<ApiResponse<UserOut>>('/v1/users/me')
      const user = response.data.data
      
      // Update stored user data
      const { token } = this.getStoredAuthData()
      if (token) {
        this.storeAuthData(token, user)
        this.authState.user = user
      }
      
      debugLog('Current user retrieved', { role: user.role })
      
      return {
        success: true,
        data: user
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to get current user'
      debugLog('Get current user failed', { error: errorMessage })
      
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  /**
   * Delete user account
   */
  public async deleteAccount(): Promise<ServiceResponse<void>> {
    try {
      await apiClient.delete('/v1/users/account')
      this.clearAuthData()
      
      debugLog('Account deleted successfully')
      
      return {
        success: true
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to delete account'
      debugLog('Delete account failed', { error: errorMessage })
      
      return {
        success: false,
        error: errorMessage
      }
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance()

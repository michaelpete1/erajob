// src/types/api.ts

// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
}

// Admin model (adjust fields to match your backend)
export interface Admin {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

// Admin signup payload
export interface AdminSignupData {
  name: string
  email: string
  password: string
}

// Admin login payload
export interface AdminLoginData {
  email: string
  password: string
}

// Token refresh payload
export interface TokenRefreshData {
  refreshToken: string
}

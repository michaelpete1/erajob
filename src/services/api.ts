// src/services/api.ts

import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { API_CONFIG, STORAGE_CONFIG, debugLog, handleApiError } from '../config'

// Create axios instance
class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor for authentication
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getAccessToken()
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor for token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        debugLog('API Response', {
          url: response.config.url,
          status: response.status,
          method: response.config.method
        })
        return response
      },
      async (error) => {
        debugLog('API Error', {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message
        })
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            await this.refreshAccessToken()
            const newToken = this.getAccessToken()

            if (newToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
            }

            return this.client(originalRequest)
          } catch (refreshError) {
            this.handleAuthError()
            return Promise.reject(handleApiError(refreshError))
          }
        }

        return Promise.reject(handleApiError(error))
      }
    )
  }

  private getAccessToken(): string | null {
    const token = localStorage.getItem(STORAGE_CONFIG.tokenKey)
    debugLog('Getting access token', token ? 'Token found' : 'No token found')
    return token
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token') // Keep existing key for backward compatibility
  }

  private async refreshAccessToken(): Promise<void> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await axios.post(`${API_CONFIG.baseURL}/v1/users/refesh`, {
        refresh_token: refreshToken
      })

      const { access_token } = response.data.data
      localStorage.setItem(STORAGE_CONFIG.tokenKey, access_token)
    } catch (error) {
      this.handleAuthError()
      throw error
    }
  }

  private handleAuthError(): void {
    // Clear authentication data
    localStorage.removeItem(STORAGE_CONFIG.tokenKey)
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('userRole')

    // Redirect to login if in browser environment
    if (typeof window !== 'undefined') {
      window.location.href = '/sign-in'
    }
  }

  // HTTP methods
  async get<T = any>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config)
  }

  async post<T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config)
  }

  async put<T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config)
  }

  async patch<T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config)
  }

  async delete<T = any>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config)
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
export default apiClient

// Export axios for direct usage if needed
export { axios }

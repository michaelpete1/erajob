// Base Admin User structure
export interface Admin {
  id: string
  full_name: string
  email: string
  date_created: number
  last_updated: number
  refresh_token: string
  access_token: string
}

// Data required for admin signup
export interface AdminSignupData {
  full_name: string
  password: string
  email: string
}

// Data required for admin login
export interface AdminLoginCredentials {
  email: string
  password: string
}

// Generic API response for a single admin
export interface AdminApiResponse {
  status_code: number
  data: Admin
  detail: string
}

// API response for a list of admins
export interface AdminListApiResponse {
  status_code: number
  data: Admin[]
  detail: string
}

// Data for refreshing a token
export interface TokenRefreshData {
  refresh_token: string
}

// API response for a token refresh
export interface TokenRefreshResponse {
  status_code: number
  data: {
    access_token: string
    refresh_token: string
  }
  detail: string
}
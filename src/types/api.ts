// src/types/api.ts

// Common API Response wrapper
export interface ApiResponse<T = any> {
  status_code: number
  data: T
  detail: string
}

// User related types
export type UserRole = 'client' | 'agent'

export interface UserBase {
  email: string
  password: string
  role: UserRole
}

export interface UserLogin {
  email: string
  password: string
}

export interface UserRefresh {
  refresh_token: string
}

export interface UserOut {
  email: string
  password: string
  role: Record<string, any>
  id: string | null
  date_created: number | null
  last_updated: number | null
  refresh_token: string | null
  access_token: string | null
}

// Job related types
export type JobCategory = 'Web Devlopment' | 'Mobile Development' | 'UI/UX Design' | 'Content Writing' | 'Digital Marketing' | 'Data Analysis' | 'Other'

export type Skill = 'Web Devlopment' | 'Mobile Development' | 'UI/UX Design' | 'Content Writing' | 'Digital Marketing' | 'Data Analysis' | 'Other'

export interface JobTimeline {
  start_date: number
  deadline: number
}

export interface JobBase {
  project_title: string
  category: JobCategory
  budget: number
  description: string
  requirement: string
  skills_needed: Skill
  timeline: JobTimeline
}

export interface JobOut {
  project_title: string
  category: JobCategory
  budget: number
  description: string
  requirement: string
  skills_needed: Skill
  timeline: JobTimeline
  id: string | null
  date_created: number | null
  last_updated: number | null
}

// Pagination types
export interface PaginationParams {
  start: number
  stop: number
}

// Error types
export interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface HTTPValidationError {
  detail: ValidationError[]
}

// Authentication state types for Vue components
export interface AuthState {
  isAuthenticated: boolean
  user: UserOut | null
  loading: boolean
  error: string | null
}

// Job state types for Vue components
export interface JobState {
  jobs: JobOut[]
  currentJob: JobOut | null
  loading: boolean
  error: string | null
  pagination: {
    start: number
    stop: number
    hasMore: boolean
  }
}

// API Service response types
export interface ServiceResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Filter and search types
export interface JobFilters {
  category?: JobCategory
  budgetMin?: number
  budgetMax?: number
  skills?: Skill[]
  search?: string
}

export interface UserFilters {
  role?: UserRole
  search?: string
}

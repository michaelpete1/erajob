// OpenAPI specification types for EraJob API
// Generated from the FastAPI OpenAPI schema

export interface EJApiResponse<T = any> {
  status_code: number
  data: T | null
  detail: string
}

export interface UserBase {
  email: string
  password: string
  role: 'client' | 'agent'
}

export interface UserLogin {
  email: string
  password: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  new_password: string
}

export interface UserRefresh {
  refresh_token: string
}

export interface UserOut {
  email: string
  password: string
  role: Record<string, any>
  id?: string | null
  date_created?: number | null
  last_updated?: number | null
  refresh_token?: string | null
  access_token?: string | null
}

export interface JobTimeline {
  start_date: number
  deadline: number
}

export type JobCategories =
  | 'Web Development'
  | 'Web Devlopment'
  | 'Mobile Development'
  | 'Sales'
  | 'Customer Service'
  | 'Editing'
  | 'Book Keeping'
  | 'Executive Assitant'
  | 'Appointment Setting'
  | 'UI/UX Design'
  | 'Content Writing'
  | 'Digital Marketing'
  | 'Data Analysis'
  | 'Other'

export type Skills =
  | 'Web Development'
  | 'Web Devlopment'
  | 'Mobile Development'
  | 'Sales'
  | 'Customer Service'
  | 'Editing'
  | 'Book Keeping'
  | 'Executive Assitant'
  | 'Appointment Setting'
  | 'UI/UX Design'
  | 'Content Writing'
  | 'Digital Marketing'
  | 'Data Analysis'
  | 'Other'

export interface JobsBase {
  project_title: string
  category: JobCategories
  budget: number
  description: string
  requirement: string
  skills_needed: Skills
  timeline: JobTimeline
}

export interface JobsOut extends JobsBase {
  id?: string | null
  date_created?: number | null
  last_updated?: number | null
}

export interface AlertsOut {
  id?: string | null
  user_type: string
  user_id: string
  priority: string
  alert_type: string
  alert_title: string
  alert_description: string
  alert_primary_action: string
  alert_secondary_action: string
  date_created?: number | null
  last_updated?: number | null
}

export interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface HTTPValidationError {
  detail: ValidationError[]
}

// Service response wrapper for frontend
export interface ServiceResponse<T> {
  success: boolean
  data?: T | null
  error?: string
  message?: string
}

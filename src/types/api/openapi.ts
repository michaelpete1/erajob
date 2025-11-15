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
  // Authentication
  email: string
  password: string
  role: Record<string, any>
  access_token?: string | null
  refresh_token?: string | null

  // User info
  id?: string | null
  full_name?: string | null
  phone_number?: string | null
  date_created?: number | null
  last_updated?: number | null

  // Profile
  certificate_url?: string[]
  video_url?: string | null
  personality_url?: string | null
  settings?: Record<string, any>

  // Company info
  company_name?: string | null
  company_email?: string | null
  company_address?: string | null

  // Agent-specific fields
  services?: string[]
  client_reason_for_signing_up?: string | null
  client_need_agent_work_hours_to_be?: string | null
  primary_area_of_expertise?: string | null
  years_of_experience?: number
  three_most_commonly_used_tools_or_platforms?: string[]
  available_hours_agent_can_commit?: number
  time_zone?: string | null
  portfolio_link?: string | null
  is_agent_open_to_calls_and_video_meetings?: boolean
  does_agent_have_working_computer?: boolean
  does_agent_have_stable_internet?: boolean
  is_agent_comfortable_with_time_tracking_tools?: boolean

  // Admin fields
  admin_approved?: boolean
  rejection_reason?: string | null

  // Additional agent-specific fields for compatibility
  name?: string
  agent_profile?: any
  agentProfile?: any
  phone?: string
  primary_expertise?: string
  verified?: boolean
  created_at?: string
  createdAt?: string
}

export interface JobTimeline {
  start_date: number
  deadline: number
}

export type JobCategories =
  | 'Web Development'
  | 'Mobile Development'
  | 'Sales'
  | 'Customer Service'
  | 'Editing'
  | 'Book Keeping'
  | 'Executive Assistant'
  | 'Appointment Setting'
  | 'Digital Marketing'
  | 'Data Analysis'

export type Skills =
  | 'Web Development'
  | 'Mobile Development'
  | 'Sales'
  | 'Customer Service'
  | 'Editing'
  | 'Book Keeping'
  | 'Executive Assistant'
  | 'Appointment Setting'
  | 'Digital Marketing'
  | 'Data Analysis'
  | 'Other'

export interface JobsBase {
  project_title: string
  primary_area_of_expertise: JobCategories
  budget: number
  description: string
  timeline: JobTimeline
  selected_agents?: string[]
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
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T | null;
  error?: string;
  message?: string;
  statusCode?: number;
}

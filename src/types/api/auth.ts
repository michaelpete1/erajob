export interface User {
  id: string
  email: string
  role: 'client' | 'agent' | 'admin' // Add 'admin' to the allowed roles
  full_name?: string
  admin_approved?: boolean
  rejection_reason?: string | null
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
}

export interface LoginCredentials {
  email: string
  password: string
  role: 'client' | 'agent' | 'admin'
}

// Signup interface with required fields for API compatibility
export interface SignupData {
  email: string
  password: string
  role: 'client' | 'agent'
  full_name: string
  phone_number: string
  certificate_url: string[]
  video_url: string
  personality_url: string
  // Client-specific fields
  company_name: string
  company_email: string
  company_address: string
  company_website: string
  client_reason_for_signing_up: string
  client_need_agent_work_hours_to_be: string
  // Agent-specific fields
  primary_expertise?: string
  years_of_experience?: string
  tools?: string
  hours_per_week?: string
  timezone?: string
  preferred_projects?: string[]
  open_to_calls?: string
  has_computer?: string
  has_internet?: string
  comfortable_with_tracking?: string

  // Shared optional fields for both roles
  primary_area_of_expertise?: string
  time_zone?: string
  portfolio_link?: string
  is_agent_open_to_calls_and_video_meetings?: string
  does_agent_have_working_computer?: string
  does_agent_have_stable_internet?: string
  is_agent_comfortable_with_time_tracking_tools?: string
  three_most_commonly_used_tools_or_platforms?: string[]
  available_hours_agent_can_commit?: string
  services?: string[]
}

// This interface is updated to include fieldErrors
export interface AuthResponse {
  success: boolean
  user?: User | null
  token?: string | null
  error?: string | null
  fieldErrors?: Record<string, string>
}

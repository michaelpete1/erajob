/**
 * Represents the full data structure for a single User object.
 * This is a generic user that can be either a client or an agent.
 */
export interface User {
  id: string
  admin_approved: boolean
  full_name: string
  email: string
  role: Record<string, any> // Role is a flexible object
  phone_number: string
  certificate_url: string[]
  video_url: string
  personality_url: string
  company_name: string
  company_email: string
  company_address: string
  services: string[]
  client_reason_for_signing_up: string
  client_need_agent_work_hours_to_be: string
  primary_area_of_expertise: string
  years_of_experience: number
  three_most_commonly_used_tools_or_platforms: string[]
  available_hours_agent_can_commit: number
  time_zone: string
  portfolio_link: string
  is_agent_open_to_calls_and_video_meetings: boolean
  does_agent_have_working_computer: boolean
  does_agent_have_stable_internet: boolean
  is_agent_comfortable_with_time_tracking_tools: boolean
  date_created: number
  last_updated: number
  refresh_token: string
  access_token: string
}

/**
 * Defines the data required to sign up a new user.
 */
export interface UserSignupData {
  email: string
  password: string
  role: 'client' | 'agent'
  full_name: string
  phone_number?: string
  certificate_url?: string[]
  video_url?: string
  personality_url?: string
  company_name?: string
  company_email?: string
  company_address?: string
  services?: string[]
  client_reason_for_signing_up?: string
  client_need_agent_work_hours_to_be?: string
}

/**
 * Defines the credentials required for a user to log in.
 */
export interface UserLoginCredentials {
  email: string
  password: string
}

/**
 * Defines the data required to refresh an authentication token.
 */
export interface TokenRefreshData {
  refresh_token: string
}

/**
 * Defines the structure of an API response containing a single user.
 */
export interface UserApiResponse {
  status_code: number
  data: User
  detail: string
}

/**
 * Defines the structure of an API response containing a list of users.
 */
export interface UserListApiResponse {
  status_code: number
  data: User[]
  detail: string
}

/**
 * Defines the structure of the API response for a successful signup.
 */
export interface SignupApiResponse {
  status_code: number
  data: string
  detail: string
}
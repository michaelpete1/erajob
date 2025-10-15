/**
 * Represents the full data structure for a single Client user.
 */
export interface Client {
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
 * Defines the credentials required for a client to log in.
 */
export interface ClientLoginCredentials {
  email: string
  password: string
}

/**
 * Defines the data required to request a password reset token.
 */
export interface ResetTokenRequest {
  email: string
}

/**
 * Defines the data required to reset a client's password.
 */
export interface ResetPasswordData {
  reset_token: string
  otp: string
  new_password: string
}

/**
 * Defines the structure of the data in a successful reset token response.
 */
export interface ResetTokenResponseData {
  reset_token: string
}

/**
 * Defines the structure of an API response containing a single client.
 */
export interface ClientApiResponse {
  status_code: number
  data: Client
  detail: string
}

/**
 * Defines the structure of an API response containing a list of clients.
 */
export interface ClientListApiResponse {
  status_code: number
  data: Client[]
  detail: string
}

/**
 * Defines the structure of an API response for a password reset token request.
 */
export interface ResetTokenApiResponse {
  status_code: number
  data: ResetTokenResponseData
  detail: string
}
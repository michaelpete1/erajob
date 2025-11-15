// src/services/authService.ts
import apiClient from './apiClient'
// Import the centralized types from the single source of truth
import type { LoginCredentials, SignupData, AuthResponse } from '../types/api/auth'

// Shared interfaces for welcome form data
export interface AgentWelcomeData {
  primaryExpertise: string
  yearsOfExperience: string
  tools: string
  hoursPerWeek: string
  timezone: string
  preferredProjects: string[]
  openToCalls: string
  hasComputer: string
  hasInternet: string
  comfortableWithTracking: string
  videoUrl: string
  certificates: string[]
  personalityTest: string
}

export interface ClientWelcomeData {
  email: string
  phone: string
  companyName: string
  companyEmail: string
  companyAddress: string
  companyWebsite: string
  fullName: string
  shortVideo: string
  urlLink: string
  primaryAreaOfExpertise: string
  timezone: string
  clientReason: string
  certificates: string[]
  personalityTest: string
}

// Helper function to map client work hours to API expected values
function mapClientWorkHours(hours: string): string {
  switch (hours) {
    case 'part_time': return '80'
    case 'full_time': return '160'
    case 'both': return 'both'
    default: return 'both'
  }
}

// Helper function to prepare signup data with proper field mapping
const prepareSignupData = (data: SignupData): any => {
  const baseData = {
    email: data.email,
    password: data.password,
    role: data.role,
    full_name: data.full_name,
    phone_number: data.phone_number,
    certificate_url: data.certificate_url,
    video_url: data.video_url,
    personality_url: data.personality_url,
  }

  if (data.role === 'client') {
    return {
      ...baseData,
      company_name: data.company_name,
      company_email: data.company_email,
      company_address: data.company_address,
      company_website: data.company_website,
      client_reason_for_signing_up: data.client_reason_for_signing_up,
      client_need_agent_work_hours_to_be: mapClientWorkHours(data.client_need_agent_work_hours_to_be || 'both'),
      primary_area_of_expertise: data.primary_area_of_expertise,
      time_zone: data.time_zone,
      portfolio_link: data.portfolio_link,
      is_agent_open_to_calls_and_video_meetings: (data as any).is_agent_open_to_calls_and_video_meetings === 'yes',
      does_agent_have_working_computer: (data as any).does_agent_have_working_computer === 'yes',
      does_agent_have_stable_internet: (data as any).does_agent_have_stable_internet === 'yes',
      is_agent_comfortable_with_time_tracking_tools: (data as any).is_agent_comfortable_with_time_tracking_tools === 'yes',
      three_most_commonly_used_tools_or_platforms: data.three_most_commonly_used_tools_or_platforms,
      available_hours_agent_can_commit: data.available_hours_agent_can_commit,
      services: data.services,
    }
  } else {
    // Agent schema exact keys
    const primaryArea = (data as any).primary_area_of_expertise || (data as any).primary_expertise || ''
    // Build tools array from either explicit array or comma-separated string
    const toolsArray = (data as any).three_most_commonly_used_tools_or_platforms
      ? (data as any).three_most_commonly_used_tools_or_platforms
      : (data as any).tools
        ? String((data as any).tools).split(',').map((s: string) => s.trim()).filter((s: string) => !!s).slice(0, 3)
        : []
    const hours = (data as any).available_hours_agent_can_commit || (data as any).hours_per_week

    return {
      ...baseData,
      primary_area_of_expertise: primaryArea,
      years_of_experience: typeof (data as any).years_of_experience === 'number'
        ? (data as any).years_of_experience
        : parseInt(String((data as any).years_of_experience || '0')),
      three_most_commonly_used_tools_or_platforms: toolsArray,
      available_hours_agent_can_commit: typeof hours === 'number' ? hours : parseInt(String(hours || '0')),
      time_zone: (data as any).time_zone || (data as any).timezone,
      portfolio_link: (data as any).portfolio_link || (data as any).video_url || '',
      is_agent_open_to_calls_and_video_meetings: typeof (data as any).is_agent_open_to_calls_and_video_meetings === 'boolean'
        ? (data as any).is_agent_open_to_calls_and_video_meetings
        : String((data as any).open_to_calls) === 'yes',
      does_agent_have_working_computer: typeof (data as any).does_agent_have_working_computer === 'boolean'
        ? (data as any).does_agent_have_working_computer
        : String((data as any).has_computer) === 'yes',
      does_agent_have_stable_internet: typeof (data as any).does_agent_have_stable_internet === 'boolean'
        ? (data as any).does_agent_have_stable_internet
        : String((data as any).has_internet) === 'yes',
      is_agent_comfortable_with_time_tracking_tools: typeof (data as any).is_agent_comfortable_with_time_tracking_tools === 'boolean'
        ? (data as any).is_agent_comfortable_with_time_tracking_tools
        : String((data as any).comfortable_with_tracking) === 'yes',
    }
  }
}

const signup = async (credentials: SignupData): Promise<AuthResponse> => {
  const maxAttempts = 2

  if (typeof navigator !== 'undefined' && navigator && 'onLine' in navigator && !navigator.onLine) {
    return { success: false, error: 'You appear to be offline. Please check your internet connection.' }
  }

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const preparedData = prepareSignupData(credentials)
      const response = await apiClient.post('/v1/users/signup', preparedData)

      const ok = response.data && (response.data.status_code === 0 || response.data.status_code === 200)
      if (ok) {
        return { success: true }
      }

      return { success: false, error: response.data?.detail || 'Signup failed.' }
    } catch (err: any) {
      const axiosError = err
      const message = axiosError?.message ?? ''
      const isNetworkError =
        axiosError?.code === 'ERR_NETWORK' ||
        axiosError?.code === 'ECONNABORTED' ||
        message === 'Network Error' ||
        message.toLowerCase().includes('timeout')

      if (!isNetworkError || attempt === maxAttempts - 1) {
        const error = err.response?.data?.detail || err.message || 'An unexpected error occurred.'
        const fieldErrors = err.response?.data?.errors
        return { success: false, error, fieldErrors }
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  return { success: false, error: 'Signup failed after retries.' }
}
const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    let endpoint = '/v1/users/login'
    if (credentials.role === 'admin') {
      endpoint = '/v1/admins/login'
    } else if (credentials.role === 'agent') {
      endpoint = '/v1/agents/login'
    } else if (credentials.role === 'client') {
      endpoint = '/v1/clients/login'
    }

    const response = await apiClient.post(endpoint, {
      email: credentials.email,
      password: credentials.password
    })

    const ok = response.data && (response.data.status_code === 0 || response.data.status_code === 200)
    if (ok && response.data.data) {
      const userData = response.data.data

      if (userData.access_token) {
        localStorage.setItem('access_token', userData.access_token)
      }
      if (userData.refresh_token) {
        localStorage.setItem('refresh_token', userData.refresh_token)
      }
      localStorage.setItem('userRole', credentials.role)
      localStorage.setItem('userInfo', JSON.stringify(userData))

      return {
        success: true,
        user: {
          id: userData.id,
          email: userData.email,
          role: credentials.role,
          full_name: userData.full_name
        },
        token: userData.access_token
      }
    }
    return { success: false, error: 'Login failed.' }
  } catch (err: any) {
    const error = err.response?.data?.detail || 'Login failed.'
    return {
      success: false,
      error
    }
  }
}

// Shared function for updating agent profile (used by both signup and welcome forms)
const updateAgentProfile = async (userId: string, data: AgentWelcomeData): Promise<AuthResponse> => {
  try {
    let services: string[] = []
    try {
      const stored = JSON.parse(localStorage.getItem('selectedAgentServices') || '[]')
      if (Array.isArray(stored)) services = stored
    } catch {}

    const updateData = {
      primary_expertise: data.primaryExpertise,
      years_of_experience: parseInt(data.yearsOfExperience),
      three_most_commonly_used_tools_or_platforms: [data.tools],
      available_hours_agent_can_commit: parseInt(data.hoursPerWeek),
      time_zone: data.timezone,
      portfolio_link: data.videoUrl,
      is_agent_open_to_calls_and_video_meetings: data.openToCalls === 'yes',
      does_agent_have_working_computer: data.hasComputer === 'yes',
      does_agent_have_stable_internet: data.hasInternet === 'yes',
      is_agent_comfortable_with_time_tracking_tools: data.comfortableWithTracking === 'yes',
      certificate_url: data.certificates,
      personality_url: data.personalityTest,
      services,
    }

    const response = await apiClient.put(`/v1/users/${userId}`, updateData)

    if (response.data) {
      return {
        success: true,
        user: response.data.user
      }
    }
    return { success: false, error: 'Profile update failed: Invalid response from server.' }
  } catch (err: any) {
    const error = err.response?.data?.detail || err.message || 'An unexpected error occurred.'
    return {
      success: false,
      error
    }
  }
}

// Shared function for updating client profile (used by both signup and welcome forms)
const updateClientProfile = async (userId: string, data: ClientWelcomeData): Promise<AuthResponse> => {
  try {
    const updateData = {
      email: data.email,
      phone_number: data.phone,
      company_name: data.companyName,
      company_email: data.companyEmail,
      company_address: data.companyAddress,
      company_website: data.companyWebsite,
      full_name: data.fullName,
      video_url: data.shortVideo,
      portfolio_link: data.urlLink,
      primary_area_of_expertise: data.primaryAreaOfExpertise,
      time_zone: data.timezone,
      client_reason_for_signing_up: data.clientReason,
      certificate_url: data.certificates,
      personality_url: data.personalityTest,
    }

    const response = await apiClient.put(`/v1/users/${userId}`, updateData)

    if (response.data) {
      return {
        success: true,
        user: response.data.user
      }
    }
    return { success: false, error: 'Profile update failed: Invalid response from server.' }
  } catch (err: any) {
    const error = err.response?.data?.detail || err.message || 'An unexpected error occurred.'
    return {
      success: false,
      error
    }
  }
}

const logout = () => {
  try {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userInfo')
  } catch (err) {
    console.warn('Logout cleanup failed:', err)
  }
}

export default {
  signup,
  login,
  updateAgentProfile,
  updateClientProfile,
  prepareSignupData,
  mapClientWorkHours,
  logout
}

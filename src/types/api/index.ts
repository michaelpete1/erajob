// --- Enums and Union Types ---
export type UserRole = 'client' | 'agent' | 'admin'
// Note: JobCategory is kept as string for flexibility, as the new Job type doesn't explicitly use it.
export type JobCategory = 'Web Development' | 'Mobile Development' | 'UI/UX Design' | 'Content Writing' | 'Digital Marketing' | 'Data Analysis' | 'Other' | string
export type JobStatus = 'pending' | 'active' | 'completed' | 'cancelled' | string // Added string for flexibility with new Job type
export type AlertType = 'new_agent' | 'new_client' | 'job_posted' | 'worklog'
export type PriorityStatus = 'very_high' | 'high' | 'medium' | 'low'

// --- Core Data Structures (Updated based on user's prompt) ---

export interface JobTimeline {
  start_date: string // Changed from number to string
  end_date: string // Changed from deadline: number to end_date: string
}

// PriceBreakdown is no longer directly part of Job or JobPostData in the new schema,
// but keeping it in case it's used elsewhere or for future expansion.
export interface PriceBreakdown {
  Charges: number
  Tax: number
}

// --- API Input Schemas (Payloads for POST/PUT requests - Updated based on user's prompt) ---

export interface UserCommonFields {
  time_zone?: string | null
}

export interface AdminSignupData {
  fullName: string // Changed from full_name
  email: string
  password: string
  confirmPassword?: string // New field
  role?: 'admin' | 'superadmin' // New field
}

/**
 * Data required for a user to sign up, extending common fields.
 */
export interface UserSignupData extends UserCommonFields {
  full_name: string
  email: string
  password: string
  role: UserRole // API input for role is a string
}

/**
 * Data required for a user or admin to log in.
 * Renamed from LoginData to AdminLoginData for admin-specific use.
 */
export interface AdminLoginData {
  email: string
  password: string
}

/**
 * Data required to refresh a user or admin's authentication token.
 * Renamed from RefreshData to TokenRefreshData for admin-specific use.
 */
export interface TokenRefreshData {
  refreshToken: string // Changed from refresh_token
}

/**
 * Data required to post a new job.
 */
export interface JobPostData {
  title: string // Changed from project_title
  description: string
  budget: number
  clientId: string // New field
  skills_needed: string[] // Changed from string | string[] to string[]
  timeline: JobTimeline // Uses the updated JobTimeline
}

/**
 * Data required for an admin to approve a job (Updated based on user's prompt).
 */
export interface JobApprovalData {
  approved: boolean // Changed from admin_approved
  charge: number // New field
  tax: number // New field
  approvedBy: string // New field
}

// --- Main Entity Interfaces (API Output Schemas - Updated based on user's prompt) ---

export interface Admin {
  id: string
  fullName: string // Changed from full_name
  email: string
  role: 'superadmin' | 'admin' // New field
  created_at: string // New field
  updated_at: string // New field
  last_login?: string // New field
  isActive: boolean // New field
}

export interface User {
  id: string
  full_name: string
  email: string
  role: UserRole
  access_token: string | null
  refresh_token?: string
  time_zone?: string | null
}

export interface Agent extends User {
  // Agent-specific fields if any, otherwise just extends User
}

export interface Client extends User {
  // Client-specific fields if any, otherwise just extends User
}

/**
 * Represents a job entity (Updated based on user's prompt).
 */
export interface Job {
  id: string // Changed from string | null
  title: string // Changed from project_title
  description: string
  budget: number
  clientId: string // New field
  skills_needed: { id: string; name: string }[] // Significantly changed type
  status: JobStatus // Using JobStatus, which now includes string for flexibility
  timeline: JobTimeline // Uses the updated JobTimeline
  created_at: string // Changed from date_created: number | null
  // Removed: category, requirement, last_updated, admin_approved, break_down
}

// --- API Response Structures (Updated based on user's prompt) ---

export interface ApiResponse<T> {
  success: boolean // Changed from status: 'success' | 'error'
  message?: string // Made optional
  data: T // No longer optional
  // Removed: detail
}

export interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface ErrorResponse {
  detail: string | ValidationError[]
}

// Re-export AgentOut from api.ts
export type { AgentOut } from '../api'

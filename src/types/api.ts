/* API types (single source of truth for frontend services)
   Derived from the OpenAPI spec at https://eba-jobs.getxoxo.space/openapi.json
*/

/* EraJob-specific API types (unique names to avoid collisions with other project types). */

export interface EJApiResponse<T = any> {
  status_code: number;
  data: T | null;
  detail: string;
}

export interface EJJobTimeline {
  start_date: number;
  deadline: number;
}

export interface EJPriceBreakDown {
  Charges: number;
  Tax: number;
}

export interface EJJobBase {
  project_title: string;
  category: string; // JobCatgeries enum in spec
  budget: number;
  description: string;
  requirement: string;
  skills_needed: string;
  timeline: EJJobTimeline;
}

export interface EJJobOut extends EJJobBase {
  id?: string | null;
  date_created?: number | null;
  last_updated?: number | null;
  admin_approved?: boolean;
  break_down?: EJPriceBreakDown;
  status?: string; // JobStatus
}

export interface EJUserOut {
  id?: string | null;
  full_name: string;
  email: string;
  role?: any;
  access_token?: string | null;
  refresh_token?: string | null;
  status?: string;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
  approved_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
}

export interface EJAlertsOut {
  id?: string | null;
  user_type: string;
  user_id: string;
  priority: string;
  alert_type: string;
  alert_title: string;
  alert_description: string;
  alert_primary_action: string | null;
  alert_secondary_action: string | null;
  date_created?: number | null;
  last_updated?: number | null;
  is_read?: boolean | null;
}

export interface EJPaginationParams {
  start: number;
  stop: number;
}

export interface EJValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface EJHTTPValidationError {
  detail: EJValidationError[];
}


// src/types/api.ts

// Generic API response wrapper
export interface ApiResponse<T> {
  status_code: number;
  data: T | null;
  detail: string;
}

// Service response for frontend
export interface ServiceResponse<T> {
  success: boolean;
  data?: T | null;
  error?: string;
  message?: string;
}

// ===========================
// JOB-RELATED TYPES
// ===========================

export interface Job {
  id: string
  title: string
  description: string
  category?: string // Made optional
  budget: number
  status: string // Changed to string for flexibility
  clientId: string
  createdAt: string
  updatedAt: string
  skills_needed?: string[] // Changed to string[]
  timeline?: { startDate: string; endDate: string } // Added from ApiJob, using startDate/endDate
}

export interface JobPostData {
  title: string
  description: string
  category?: string // Made optional
  budget: number
  skills_needed?: string[] // Added for consistency with GigExplorer.vue's normalizeJob
  timeline?: {
    startDate: string
    endDate: string
  }
}

export interface JobApprovalData {
  approved: boolean
  tax?: number
  charges?: number
  feedback?: string; // Added for consistency with apiService.approveJob
  reason?: string; // Added for consistency with apiService.approveJob
}

export type ApplicationStatus =
  | 'pending_review'
  | 'accepted'
  | 'rejected'
  | string

export interface ApplicationOut {
  job_id: string
  proposal: string
  id: string
  proposal_status: ApplicationStatus
  agent_id: string
  date_created: number
  last_updated: number
}

export interface ApplicationListParams {
  start: number
  stop: number
}

export interface ApplicationApplyPayload {
  job_id: string
  proposal: string
}

export interface ApplicationApprovePayload {
  id: string
}

export interface ApplicationRejectPayload {
  application_id: string
  rejection_reason: string
}

// ===========================
// WORK LOG TYPES
// ===========================

export type WorkLogStatus = 'pending_review' | 'submitted' | 'approved' | 'rejected' | string

export interface WorkLogOut {
  job_id: string
  log_comment: string
  files: string[]
  hours: number
  log_title: string
  agent_id: string
  client_approved: boolean
  id: string
  date_created: number
  last_updated: number
  rejection_reason?: string | null
}

export interface WorkLogListParams {
  start: number
  stop: number
}

export interface WorkLogPostPayload {
  job_id: string
  log_comment: string
  log_title: string
  hours: number
  files?: string[]
}

// ===========================
// USER-RELATED TYPES

// Agent types
export interface AgentOut extends EJUserOut {
  availability?: any;
  status?: string;
  bio?: string;
  skills?: string[];
  experience?: any[];
  portfolio?: any[];
  company_name?: string | null;
  time_zone?: string | null;
}

export interface AgentState {
  agents: AgentOut[];
  currentAgent: AgentOut | null;
  loading: boolean;
  error: string | null;
  pagination: {
    start: number;
    stop: number;
    hasMore: boolean;
  };
}

export interface AgentFilters {
  role?: string;
  skills?: string[];
  location?: string;
  status?: string;
}

// Alert types
export interface AlertOut {
  id?: string | null;
  user_type: string;
  user_id: string;
  priority: string;
  alert_type: string;
  alert_title: string;
  alert_description: string;
  alert_primary_action: string | null;
  alert_secondary_action: string | null;
  date_created?: number | null;
  last_updated?: number | null;
  is_read?: boolean | null;
}

export interface AlertState {
  alerts: AlertOut[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  pagination: {
    start: number;
    stop: number;
    hasMore: boolean;
  };
}

export interface AlertFilters {
  priority?: string;
  alert_type?: string;
  is_read?: boolean;
}



export interface UserBase {
  id: string
  name: string
  email: string
}

export interface AuthState {
  token: string | null
  isAuthenticated: boolean
}

export interface JobState {
  jobs: Job[]
  loading: boolean
}

// Removed: ServiceResponse as it's now replaced by ApiResponse

export interface PaginationParams {
  start: number
  stop: number
}

export interface JobFilters {
  category?: string
  status?: string
}

export interface UserFilters {
  role?: 'client' | 'agent' | 'admin';
  search?: string;
}

// Admin authentication interfaces (moved from src/services/api.ts for centralization)
export interface AdminCredentials {
  email: string;
  password: string;
}

export interface AdminAuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    is_admin: boolean;
  };
}

export type { LoginCredentials as UserLogin } from './api/auth'
export type { EJJobCategory as JobCategory } from './api/jobs'
export type { EJJobTimeline as JobTimeline }
export type { EJUserOut as UserOut }
export type { EJJobBase as JobBase }
export type { EJJobOut as JobOut }
export type Skill = string

// Types are exported by declaration or re-export above

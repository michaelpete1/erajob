export interface EJJobCategory {
  id: string
  name: string
  description?: string
}

export interface EJJobOut {
  id: string
  title: string
  description: string
  category: string | EJJobCategory
  location: string
  rate: number
  status: 'open' | 'assigned' | 'completed'
  createdAt: string
  updatedAt: string
  skills_needed: string[]
}

export interface EJJobCreate {
  title: string
  description: string
  category: string
  location: string
  rate: number
}

export interface EJLogEntry {
  id: string
  jobId: string
  agentId: string
  hours: number
  description: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

/**
 * Defines the timeline for a job.
 */
export interface JobTimeline {
  start_date: number
  deadline: number
}

/**
 * Defines the cost breakdown for a job.
 */
export interface JobBreakdown {
  Charges: number
  Tax: number
}

/**
 * Represents the full data structure for a single Job object.
 */
export interface Job {
  id: string
  project_title: string
  category: string
  budget: number
  description: string
  requirement: string
  skills_needed: string
  timeline: JobTimeline
  date_created: number
  last_updated: number
  admin_approved: boolean
  break_down: JobBreakdown
  status: 'pending' | 'active' | 'completed' | 'cancelled'
}

/**
 * Defines the data required for a client to post a new job.
 */
export interface JobPostData {
  project_title: string
  category: string
  budget: number
  description: string
  requirement: string
  skills_needed: string
  timeline: JobTimeline
}

/**
 * Defines the data required for an admin to approve a job.
 */
export interface JobApprovalData {
  admin_approved: boolean
  break_down: JobBreakdown
}

/**
 * Defines the structure of an API response containing a single job.
 */
export interface JobApiResponse {
  status_code: number
  data: Job
  detail: string
}

/**
 * Defines the structure of an API response containing a list of jobs.
 */
export interface JobListApiResponse {
  status_code: number
  data: Job[]
  detail: string
}
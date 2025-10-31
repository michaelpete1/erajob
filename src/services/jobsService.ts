// src/services/jobsService.ts
import apiClient from './apiClient'
import type { ApiResponse, Job, JobPostData, JobApprovalData, ServiceResponse } from '../types/api'

const BASE_URL = '/v1/jobss'

const isSuccessfulStatus = (status?: number | null) => status === 200 || status === 201 || status === 0

const ensureArray = <T>(data: T | T[] | null | undefined): T[] => {
  if (!data) return []
  return Array.isArray(data) ? data : [data]
}

/**
 * Lists jobs that an agent qualifies for. (Agent only)
 * @param start - The starting index for the list.
 * @param stop - The ending index for the list.
 * @param agentData - Optional agent expertise data for filtering
 */
export const listAvailableAgentJobs = async (
  start: number,
  stop: number,
  agentData?: { primaryExpertise?: string; preferredProjects?: string[] }
): Promise<ServiceResponse<Job[]>> => {
  try {
    const params: any = { start, stop }

    // Include agent expertise data if provided
    if (agentData?.primaryExpertise) {
      params.primary_expertise = agentData.primaryExpertise
    }
    if (agentData?.preferredProjects && agentData.preferredProjects.length > 0) {
      params.preferred_projects = agentData.preferredProjects.join(',')
    }

    const response = await apiClient.get<ApiResponse<Job[]>>(`${BASE_URL}/agent/available/`, { params })
    if (isSuccessfulStatus(response.data.status_code)) {
      const jobs = ensureArray(response.data.data)
      return {
        success: true,
        data: jobs,
        message: `Retrieved ${jobs.length} available jobs`
      }
    } else {
      return {
        success: false,
        error: response.data.detail || 'Failed to fetch available jobs'
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'Failed to fetch available jobs'
    }
  }
}

/**
 * Lists jobs that a client has created. (Client only)
 * @param start - The starting index for the list.
 * @param stop - The ending index for the list.
 */
export const listClientCreatedJobs = async (start: number, stop: number): Promise<ServiceResponse<Job[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<Job[]>>(`${BASE_URL}/client/created/`, {
      params: { start, stop }
    })
    if (isSuccessfulStatus(response.data.status_code)) {
      const jobs = ensureArray(response.data.data)
      return {
        success: true,
        data: jobs,
        message: `Retrieved ${jobs.length} client jobs`
      }
    } else {
      return {
        success: false,
        error: response.data.detail || 'Failed to fetch client jobs'
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'Failed to fetch client jobs'
    }
  }
}

/**
 * Lists all jobs for an admin. (Admin only)
 * @param start - The starting index for the list.
 * @param stop - The ending index for the list.
 */
export const listAdminJobs = async (start: number, stop: number): Promise<ServiceResponse<Job[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<Job[]>>(`${BASE_URL}/admin/`, {
      params: { start, stop }
    })
    if (isSuccessfulStatus(response.data.status_code)) {
      const jobs = ensureArray(response.data.data)
      return {
        success: true,
        data: jobs,
        message: `Retrieved ${jobs.length} admin jobs`
      }
    } else {
      return {
        success: false,
        error: response.data.detail || 'Failed to fetch admin jobs'
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'Failed to fetch admin jobs'
    }
  }
}

/**
 * Retrieves a single job by its ID.
 * @param id - The ID of the job to fetch.
 */
export const getJobById = async (id: string): Promise<ServiceResponse<Job>> => {
  try {
    const response = await apiClient.get<ApiResponse<Job>>(`${BASE_URL}/me`, { params: { id } })
    if (response.data.status_code === 200) {
      return {
        success: true,
        data: response.data.data,
        message: 'Job retrieved successfully'
      }
    } else {
      return {
        success: false,
        error: response.data.detail || 'Failed to fetch job'
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'Failed to fetch job'
    }
  }
}

/**
 * Creates a new job posting. (Client only)
 * @param data - The data for the new job.
 */
export const postNewJob = async (data: JobPostData): Promise<ServiceResponse<Job>> => {
  try {
    const response = await apiClient.post<ApiResponse<Job>>(`${BASE_URL}/`, data)
    if (response.data.status_code === 201 || response.data.status_code === 200) {
      return {
        success: true,
        data: response.data.data,
        message: 'Job created successfully'
      }
    } else {
      return {
        success: false,
        error: response.data.detail || 'Failed to create job'
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'Failed to create job'
    }
  }
}

/**
 * Approves a job posting. (Admin only)
 * @param jobId - The ID of the job to approve.
 * @param data - The approval data, including charges and tax.
 */
export const approveJob = async (jobId: string, data: JobApprovalData): Promise<ServiceResponse<string>> => {
  try {
    const response = await apiClient.post<ApiResponse<string>>(`${BASE_URL}/approve/${jobId}`, data)
    if (response.data.status_code === 200) {
      return {
        success: true,
        data: response.data.data || 'Job approved successfully',
        message: 'Job approved successfully'
      }
    } else {
      return {
        success: false,
        error: response.data.detail || 'Failed to approve job'
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'Failed to approve job'
    }
  }
}

/**
 * Rejects a job posting. (Admin only)
 * @param jobId - The ID of the job to reject.
 * @param data - The rejection payload including reason.
 */
export const rejectJob = async (
  jobId: string,
  data: { admin_approved: boolean; rejection_reason: string }
): Promise<ServiceResponse<string>> => {
  try {
    const response = await apiClient.post<ApiResponse<string>>(`${BASE_URL}/reject/${jobId}`, data)
    if (response.data.status_code === 200) {
      return {
        success: true,
        data: response.data.data || 'Job rejected successfully',
        message: 'Job rejected successfully'
      }
    } else {
      return {
        success: false,
        error: response.data.detail || 'Failed to reject job'
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'Failed to reject job'
    }
  }
}

/**
 * Updates a job posting. (Client only)
 * @param id - The ID of the job to update.
 * @param data - The updated job data.
 */
export const updateJob = async (id: string, data: Partial<JobPostData>): Promise<ServiceResponse<Job>> => {
  try {
    const response = await apiClient.put<ApiResponse<Job>>(`${BASE_URL}/${id}`, data)
    if (response.data.status_code === 200) {
      return {
        success: true,
        data: response.data.data,
        message: 'Job updated successfully'
      }
    } else {
      return {
        success: false,
        error: response.data.detail || 'Failed to update job'
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'Failed to update job'
    }
  }
}

/**
 * Deletes a job posting. (Client only)
 * @param id - The ID of the job to delete.
 */
export const deleteJob = async (id: string): Promise<ServiceResponse<string>> => {
  try {
    const response = await apiClient.delete<ApiResponse<string>>(`${BASE_URL}/${id}`)
    if (response.data.status_code === 200) {
      return {
        success: true,
        data: response.data.data || 'Job deleted successfully',
        message: 'Job deleted successfully'
      }
    } else {
      return {
        success: false,
        error: response.data.detail || 'Failed to delete job'
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'Failed to delete job'
    }
  }
}

export const jobsService = {
  listAvailableAgentJobs,
  listClientCreatedJobs,
  listAdminJobs,
  getJobById,
  postNewJob,
  createJob: postNewJob, // Alias for compatibility
  approveJob,
  rejectJob,
  updateJob,
  deleteJob
}

export default jobsService

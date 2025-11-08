import apiClient from './apiClient'
import type {
  JobPostData,
  JobApprovalData,
  JobApiResponse,
  JobListApiResponse
} from '../types/api/jobs'

const BASE_URL = '/v1/jobss'

/**
 * Retrieves a paginated list of jobs that the authenticated agent qualifies for.
 * @param start - The starting index for the list.
 * @param stop - The ending index for the list.
 */
export const listAvailableAgentJobs = (start: number, stop: number) => {
  return apiClient.get<JobListApiResponse>(`${BASE_URL}/agent/available/`, {
    params: { start, stop }
  })
}

/**
 * Retrieves a paginated list of jobs created by the authenticated client.
 * @param start - The starting index for the list.
 * @param stop - The ending index for the list.
 */
export const listClientCreatedJobs = (start: number, stop: number) => {
  return apiClient.get<JobListApiResponse>(`${BASE_URL}/client/created/`, {
    params: { start, stop }
  })
}

/**
 * Retrieves a paginated list of all jobs in the system. (Admin only)
 * @param start - The starting index for the list.
 * @param stop - The ending index for the list.
 */
export const listAllJobsAdmin = (start: number, stop: number) => {
  return apiClient.get<JobListApiResponse>(`${BASE_URL}/admin/`, {
    params: { start, stop }
  })
}

/**
 * Fetches a specific job by its ID. (Admin only)
 * @param id - The ID of the job to fetch.
 */
export const getJobById = (id: string) => {
  return apiClient.get<JobApiResponse>(`${BASE_URL}/me`, { params: { id } })
}

/**
 * Posts a new job on behalf of the authenticated client.
 * @param data - The data for the new job.
 */
export const postNewJob = (data: JobPostData) => {
  return apiClient.post<JobApiResponse>(`${BASE_URL}/`, data)
}

/**
 * Approves a new job posting. (Admin only)
 * @param jobId - The ID of the job to approve.
 * @param data - The approval data, including charges, tax, and optional budget adjustment.
 */
export const approveJob = (jobId: string, data: JobApprovalData) => {
  return apiClient.post<string>(`${BASE_URL}/approve/${jobId}`, data)
}

export default {
  listAvailableAgentJobs,
  listClientCreatedJobs,
  listAllJobsAdmin,
  getJobById,
  postNewJob,
  approveJob
}

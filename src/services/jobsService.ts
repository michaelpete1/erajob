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
      return { success: true, data: jobs, message: `Retrieved ${jobs.length} available jobs` }
    }

    try {
      const altPath = await apiClient.get<ApiResponse<Job[]>>(`${BASE_URL}/agent/available/${start}/${stop}`)
      if (isSuccessfulStatus(altPath.data.status_code)) {
        const jobs = ensureArray(altPath.data.data)
        return { success: true, data: jobs, message: `Retrieved ${jobs.length} available jobs` }
      }
    } catch (_) {}

    try {
      const singleS = await apiClient.get<ApiResponse<Job[]>>(`/v1/jobs/agent/available/${start}/${stop}`)
      if (isSuccessfulStatus(singleS.data.status_code)) {
        const jobs = ensureArray(singleS.data.data)
        return { success: true, data: jobs, message: `Retrieved ${jobs.length} available jobs` }
      }
    } catch (_) {}

    return { success: false, error: response.data.detail || 'Failed to fetch available jobs' }
  } catch (error: any) {
    try {
      const altPath = await apiClient.get<ApiResponse<Job[]>>(`${BASE_URL}/agent/available/${start}/${stop}`)
      if (isSuccessfulStatus(altPath.data.status_code)) {
        const jobs = ensureArray(altPath.data.data)
        return { success: true, data: jobs, message: `Retrieved ${jobs.length} available jobs` }
      }
    } catch (_) {}
    try {
      const singleS = await apiClient.get<ApiResponse<Job[]>>(`/v1/jobs/agent/available/${start}/${stop}`)
      if (isSuccessfulStatus(singleS.data.status_code)) {
        const jobs = ensureArray(singleS.data.data)
        return { success: true, data: jobs, message: `Retrieved ${jobs.length} available jobs` }
      }
    } catch (_) {}
    return { success: false, error: error.response?.data?.detail || error.message || 'Failed to fetch available jobs' }
  }
}

export const listAgentSelectedJobs = async (
  start: number,
  stop: number
): Promise<ServiceResponse<Job[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<Job[]>>(`${BASE_URL}/agent/`, {
      params: { start, stop }
    })
    if (isSuccessfulStatus(response.data.status_code)) {
      const jobs = ensureArray(response.data.data)
      return {
        success: true,
        data: jobs,
        message: `Retrieved ${jobs.length} selected jobs`
      }
    } else {
      return {
        success: false,
        error: response.data.detail || 'Failed to fetch selected jobs'
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'Failed to fetch selected jobs'
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
      try {
        const alt = await apiClient.get<ApiResponse<Job[]>>(`/v1/jobss/client/created/`, { params: { start, stop } })
        if (isSuccessfulStatus(alt.data.status_code)) {
          const jobs = ensureArray(alt.data.data)
          return { success: true, data: jobs, message: `Retrieved ${jobs.length} client jobs` }
        }
      } catch {}
      return {
        success: false,
        error: response.data.detail || 'Failed to fetch client jobs'
      }
    }
  } catch (error: any) {
    try {
      const alt = await apiClient.get<ApiResponse<Job[]>>(`/v1/jobss/client/created/`, { params: { start, stop } })
      if (isSuccessfulStatus(alt.data.status_code)) {
        const jobs = ensureArray(alt.data.data)
        return { success: true, data: jobs, message: `Retrieved ${jobs.length} client jobs` }
      }
    } catch {}
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
    const normalizeIds = (j: Record<string, any>): string[] => {
      const ids: string[] = []
      const push = (v: any) => { if (typeof v === 'string' && v.trim()) ids.push(v.trim()) }
      push(j?.id)
      push(j?.job_id)
      push(j?.agent_job_id)
      return ids
    }

    try {
      const listResp = await apiClient.get<ApiResponse<Job[]>>(`${BASE_URL}/client/created/`, { params: { start: 0, stop: 100 } })
      if (isSuccessfulStatus(listResp.data.status_code)) {
        const jobs = ensureArray(listResp.data.data)
        const found = jobs.find(j => normalizeIds(j as any).includes(id))
        if (found) {
          return { success: true, data: found, message: 'Job retrieved successfully' }
        }
      }
    } catch {}

    try {
      const adminResp = await apiClient.get<ApiResponse<Job[]>>(`${BASE_URL}/admin/`, { params: { start: 0, stop: 100 } })
      if (isSuccessfulStatus(adminResp.data.status_code)) {
        const jobs = ensureArray(adminResp.data.data)
        const found = jobs.find(j => normalizeIds(j as any).includes(id))
        if (found) {
          return { success: true, data: found, message: 'Job retrieved successfully' }
        }
      }
    } catch {}

    return { success: false, error: 'Failed to fetch job' }
  } catch (error: any) {
    return { success: false, error: error.response?.data?.detail || error.message || 'Failed to fetch job' }
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
 * @param data - The approval data, including charges, tax, and optional budget adjustment.
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
    let response = await apiClient.patch<ApiResponse<Job>>(`${BASE_URL}/${id}`, data)
    if (!response?.data || response.data.status_code === 404) {
      response = await apiClient.patch<ApiResponse<Job>>(`${BASE_URL}/update/${id}`, data)
    }
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
 * Marks a job as completed. (Client only)
 * @param jobId - The ID of the job to mark as completed.
 */
export const markJobAsCompleted = async (jobId: string): Promise<ServiceResponse<Job>> => {
  try {
    const response = await apiClient.patch<ApiResponse<Job>>(`${BASE_URL}/mark-completed/${jobId}`)
    if (response.data.status_code === 200) {
      return {
        success: true,
        data: response.data.data,
        message: 'Job marked as completed successfully'
      }
    } else {
      return {
        success: false,
        error: response.data.detail || 'Failed to mark job as completed'
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'Failed to mark job as completed'
    }
  }
}

export const clientAcceptJobProposal = async (
  jobId: string,
  data: { client_approved: true; selected_agents: string[] }
): Promise<ServiceResponse<string>> => {
  try {
    const normalize = (agent: any) => {
      const a = agent || {}
      const skills = Array.isArray(a.skills)
        ? a.skills
        : Array.isArray(a.three_most_commonly_used_tools_or_platforms)
          ? a.three_most_commonly_used_tools_or_platforms
          : []
      return {
        id: String(a.id || a._id || a.user_id || a.agent_id || ''),
        email: String(a.email || a.user_email || ''),
        password: String(a.password || ''),
        full_name: String(a.full_name || a.name || ''),
        phone_number: String(a.phone_number || ''),
        certificate_url: String(a.certificate_url || ''),
        video_url: String(a.video_url || ''),
        personality_url: String(a.personality_url || ''),
        primary_area_of_expertise: String(a.primary_area_of_expertise || ''),
        years_of_experience: Number(a.years_of_experience ?? 0),
        three_most_commonly_used_tools_or_platforms: skills,
        available_hours_agent_can_commit: Number(a.available_hours_agent_can_commit ?? 0),
        time_zone: String(a.time_zone || ''),
        portfolio_link: String(a.portfolio_link || ''),
        is_agent_open_to_calls_and_video_meetings: Boolean(
          typeof a.is_agent_open_to_calls_and_video_meetings === 'boolean'
            ? a.is_agent_open_to_calls_and_video_meetings
            : true
        ),
        does_agent_have_working_computer: Boolean(
          typeof a.does_agent_have_working_computer === 'boolean'
            ? a.does_agent_have_working_computer
            : true
        ),
        does_agent_have_stable_internet: Boolean(
          typeof a.does_agent_have_stable_internet === 'boolean'
            ? a.does_agent_have_stable_internet
            : true
        ),
        is_agent_comfortable_with_time_tracking_tools: Boolean(
          typeof a.is_agent_comfortable_with_time_tracking_tools === 'boolean'
            ? a.is_agent_comfortable_with_time_tracking_tools
            : true
        )
      }
    }
    const selected = Array.isArray(data.selected_agents) ? data.selected_agents : []
    const enriched = await Promise.all(
      selected.map(async (agent: any) => {
        if (agent && typeof agent === 'object') return normalize(agent)
        const id = String(agent || '')
        if (!id) return normalize({})
        try {
          const mod = await import('./agentsService')
          const svc = mod.AgentsService.getInstance()
          const resp = await svc.getAgentById(id)
          const raw = resp.success && resp.data ? resp.data : { id }
          return normalize(raw)
        } catch (_) {
          return normalize({ id })
        }
      })
    )
    const formattedData = { ...data, selected_agents: enriched }
    const response = await apiClient.patch<ApiResponse<string>>(`${BASE_URL}/client/accept-proposal/${jobId}`, formattedData)
    if (isSuccessfulStatus(response.data.status_code)) {
      return {
        success: true,
        data: response.data.data || 'Proposal accepted',
        message: 'Proposal accepted'
      }
    }
    try {
      let upd = await apiClient.patch<ApiResponse<any>>(`${BASE_URL}/${jobId}`, { status: 'active', ...formattedData })
      if (!upd?.data || upd.data.status_code === 404) {
        upd = await apiClient.patch<ApiResponse<any>>(`${BASE_URL}/update/${jobId}`, { status: 'active', ...formattedData })
      }
      if (isSuccessfulStatus(upd.data.status_code)) {
        return { success: true, data: 'Proposal accepted', message: 'Proposal accepted' }
      }
      return { success: false, error: upd.data.detail || response.data.detail || 'Failed to accept proposal' }
    } catch (fallbackErr: any) {
      return { success: false, error: fallbackErr?.response?.data?.detail || response.data.detail || 'Failed to accept proposal' }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'Failed to accept proposal'
    }
  }
}

export const clientRejectJobProposal = async (
  jobId: string,
  data: { client_approved: false; client_rejection_reason: string }
): Promise<ServiceResponse<string>> => {
  try {
    const response = await apiClient.patch<ApiResponse<string>>(`${BASE_URL}/client/reject-proposal/${jobId}`, data)
    if (isSuccessfulStatus(response.data.status_code)) {
      return {
        success: true,
        data: response.data.data || 'Proposal rejected'
      }
    }
    return {
      success: false,
      error: response.data.detail || 'Failed to reject proposal'
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'Failed to reject proposal'
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
  listAgentSelectedJobs,
  listClientCreatedJobs,
  listAdminJobs,
  getJobById,
  postNewJob,
  createJob: postNewJob, // Alias for compatibility
  approveJob,
  rejectJob,
  updateJob,
  markJobAsCompleted,
  deleteJob,
  clientAcceptJobProposal,
  clientRejectJobProposal
}

export default jobsService

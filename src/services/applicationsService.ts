import apiClient from './apiClient'
import type {
  ApiResponse,
  ApplicationApplyPayload,
  ApplicationApprovePayload,
  ApplicationListParams,
  ApplicationOut,
  ApplicationRejectPayload,
  ServiceResponse
} from '../types/api'

const BASE_URL = '/v1/applications'

const buildListParams = (params?: Partial<ApplicationListParams>) => ({
  start: params?.start ?? 0,
  stop: params?.stop ?? 50
})

export const listAgentApplications = async (
  params?: Partial<ApplicationListParams>
): Promise<ServiceResponse<ApplicationOut[]>> => {
  try {
    const query = buildListParams(params)
    const response = await apiClient.get<ApiResponse<ApplicationOut[]>>(`${BASE_URL}/agent/list/`, {
      params: query
    })
    if (response.data.status_code === 200 || response.data.status_code === 0) {
      return {
        success: true,
        data: response.data.data ?? []
      }
    }
    return {
      success: false,
      error: response.data.detail || 'Failed to fetch agent applications'
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.detail || error?.message || 'Failed to fetch agent applications'
    }
  }
}

export const listClientApplications = async (
  jobId: string,
  params?: Partial<ApplicationListParams>
): Promise<ServiceResponse<ApplicationOut[]>> => {
  try {
    const query = buildListParams(params)
    const response = await apiClient.get<ApiResponse<ApplicationOut[]>>(`${BASE_URL}/client/list/`, {
      params: { job_id: jobId, ...query }
    })
    if (response.data.status_code === 200 || response.data.status_code === 0) {
      const payload = Array.isArray(response.data.data) ? response.data.data : []
      const mapped = payload.map(application => {
        if (application.agent_name && application.agent_email) {
          return application
        }

        const raw = application as Record<string, any>
        const agentSource =
          raw.agent ||
          raw.agent_profile ||
          raw.agent_details ||
          raw.agentInfo ||
          raw.agent_data ||
          raw.agentData

        const resolvedName =
          application.agent_name ||
          (typeof raw.agent_name === 'string' ? raw.agent_name : undefined) ||
          (agentSource && typeof agentSource === 'object'
            ? (agentSource.full_name ||
                agentSource.name ||
                agentSource.display_name ||
                agentSource.username ||
                agentSource.email)
            : undefined)

        const resolvedEmail =
          application.agent_email ||
          (typeof raw.agent_email === 'string' ? raw.agent_email : undefined) ||
          (agentSource && typeof agentSource === 'object'
            ? (agentSource.email || agentSource.contact_email || agentSource.user_email)
            : undefined)

        return {
          ...application,
          agent_name: resolvedName,
          agent_email: resolvedEmail
        }
      })

      return {
        success: true,
        data: mapped
      }
    }
    return {
      success: false,
      error: response.data.detail || 'Failed to fetch client applications'
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.detail || error?.message || 'Failed to fetch client applications'
    }
  }
}

export const getAdminApplicationById = async (id: string): Promise<ServiceResponse<ApplicationOut>> => {
  try {
    const response = await apiClient.get<ApiResponse<ApplicationOut>>(`${BASE_URL}/admin/me`, {
      params: { id }
    })
    if (response.data.status_code === 200 || response.data.status_code === 0) {
      return {
        success: true,
        data: response.data.data as ApplicationOut
      }
    }
    return {
      success: false,
      error: response.data.detail || 'Failed to fetch application'
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.detail || error?.message || 'Failed to fetch application'
    }
  }
}

export const listAdminApplicationsForJob = async (
  jobId: string,
  params?: Partial<ApplicationListParams>
): Promise<ServiceResponse<ApplicationOut[]>> => {
  try {
    const query = buildListParams(params)
    const response = await apiClient.get<ApiResponse<ApplicationOut[]>>(`${BASE_URL}/admin/list/`, {
      params: { job_id: jobId, ...query }
    })
    if (response.data.status_code === 200 || response.data.status_code === 0) {
      return {
        success: true,
        data: response.data.data ?? []
      }
    }
    return {
      success: false,
      error: response.data.detail || 'Failed to fetch applications'
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.detail || error?.message || 'Failed to fetch applications'
    }
  }
}

export const getClientApplicationById = async (
  params: { id: string; job_id: string }
): Promise<ServiceResponse<ApplicationOut>> => {
  try {
    const response = await apiClient.get<ApiResponse<ApplicationOut>>(`${BASE_URL}/client/me`, {
      params
    })
    if (response.data.status_code === 200 || response.data.status_code === 0) {
      return {
        success: true,
        data: response.data.data as ApplicationOut
      }
    }
    return {
      success: false,
      error: response.data.detail || 'Failed to fetch application'
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.detail || error?.message || 'Failed to fetch application'
    }
  }
}

export const approveAgentApplication = async (
  jobId: string,
  payload: ApplicationApprovePayload
): Promise<ServiceResponse<ApplicationOut>> => {
  try {
    const response = await apiClient.patch<ApiResponse<ApplicationOut>>(
      `${BASE_URL}/client/select-agent/${jobId}`,
      payload
    )
    if (response.data.status_code === 200) {
      return {
        success: true,
        data: response.data.data as ApplicationOut
      }
    }
    return {
      success: false,
      error: response.data.detail || 'Failed to approve application'
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.detail || error?.message || 'Failed to approve application'
    }
  }
}

export const rejectAgentApplication = async (
  jobId: string,
  payload: ApplicationRejectPayload
): Promise<ServiceResponse<ApplicationOut>> => {
  try {
    const response = await apiClient.patch<ApiResponse<ApplicationOut>>(
      `${BASE_URL}/client/reject-agent/${jobId}`,
      payload
    )
    if (response.data.status_code === 200) {
      return {
        success: true,
        data: response.data.data as ApplicationOut
      }
    }
    return {
      success: false,
      error: response.data.detail || 'Failed to reject application'
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.detail || error?.message || 'Failed to reject application'
    }
  }
}

export const getAgentApplicationById = async (id: string): Promise<ServiceResponse<ApplicationOut>> => {
  try {
    const response = await apiClient.get<ApiResponse<ApplicationOut>>(`${BASE_URL}/agent/me`, {
      params: { id }
    })
    if (response.data.status_code === 200) {
      return {
        success: true,
        data: response.data.data as ApplicationOut
      }
    }
    return {
      success: false,
      error: response.data.detail || 'Failed to fetch application'
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.detail || error?.message || 'Failed to fetch application'
    }
  }
}

export const applyForJob = async (
  payload: ApplicationApplyPayload
): Promise<ServiceResponse<string>> => {
  try {
    const response = await apiClient.post<ApiResponse<string>>(`${BASE_URL}/apply`, payload)
    if (response.data.status_code === 200 || response.data.status_code === 0) {
      return {
        success: true,
        data: response.data.data ?? 'Application submitted successfully'
      }
    }
    return {
      success: false,
      error: response.data.detail || 'Failed to submit application'
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.detail || error?.message || 'Failed to submit application'
    }
  }
}

export const applicationsService = {
  listAgentApplications,
  listClientApplications,
  getAdminApplicationById,
  listAdminApplicationsForJob,
  getClientApplicationById,
  approveAgentApplication,
  rejectAgentApplication,
  getAgentApplicationById,
  applyForJob
}

export default applicationsService

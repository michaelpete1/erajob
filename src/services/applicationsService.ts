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
    const response = await apiClient.get<ApiResponse<ApplicationOut[]>>(`${BASE_URL}/agent/list/`, { params: query })
    if (response.data.status_code === 200 || response.data.status_code === 0) {
      return { success: true, data: response.data.data ?? [] }
    }

    try {
      const altPath = await apiClient.get<ApiResponse<ApplicationOut[]>>(`${BASE_URL}/agent/list/${query.start}/${query.stop}`)
      if (altPath.data.status_code === 200 || altPath.data.status_code === 0) {
        return { success: true, data: altPath.data.data ?? [] }
      }
    } catch (_) {}

    try {
      const simple = await apiClient.get<ApiResponse<ApplicationOut[]>>(`${BASE_URL}/agent/`, { params: query })
      if (simple.data.status_code === 200 || simple.data.status_code === 0) {
        return { success: true, data: simple.data.data ?? [] }
      }
    } catch (_) {}

    return { success: false, error: response.data.detail || 'Failed to fetch agent applications' }
  } catch (error: any) {
    try {
      const query = buildListParams(params)
      const altPath = await apiClient.get<ApiResponse<ApplicationOut[]>>(`${BASE_URL}/agent/list/${query.start}/${query.stop}`)
      if (altPath.data.status_code === 200 || altPath.data.status_code === 0) {
        return { success: true, data: altPath.data.data ?? [] }
      }
    } catch (_) {}
    try {
      const query = buildListParams(params)
      const simple = await apiClient.get<ApiResponse<ApplicationOut[]>>(`${BASE_URL}/agent/`, { params: query })
      if (simple.data.status_code === 200 || simple.data.status_code === 0) {
        return { success: true, data: simple.data.data ?? [] }
      }
    } catch (_) {}
    return { success: false, error: error?.response?.data?.detail || error?.message || 'Failed to fetch agent applications' }
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
    try {
      const query = buildListParams(params)
      const alt1 = await apiClient.get<ApiResponse<ApplicationOut[]>>(`/v1/jobss/admin/list-proposals/`, {
        params: { job_id: jobId, ...query }
      })
      if (alt1.data.status_code === 200 || alt1.data.status_code === 0) {
        return { success: true, data: alt1.data.data ?? [] }
      }
      const alt2 = await apiClient.get<ApiResponse<ApplicationOut[]>>(`/v1/jobss/admin/proposals/`, {
        params: { job_id: jobId, ...query }
      })
      if (alt2.data.status_code === 200 || alt2.data.status_code === 0) {
        return { success: true, data: alt2.data.data ?? [] }
      }
      return {
        success: false,
        error: alt2.data.detail || alt1.data.detail || error?.response?.data?.detail || error?.message || 'Failed to fetch applications'
      }
    } catch (fallbackError: any) {
      return {
        success: false,
        error: fallbackError?.response?.data?.detail || fallbackError?.message || error?.message || 'Failed to fetch applications'
      }
    }
  }
}

export const getClientApplicationById = async (
  params: { id: string; job_id: string }
): Promise<ServiceResponse<ApplicationOut>> => {
  try {
    const jobId = String(params.job_id).split(':')[0]
    const composite = String(params.id)
    const agentPart = composite.includes(':') ? composite.split(':').slice(1).join(':') : ''

    try {
      const listResp = await listClientApplications(jobId, { start: 0, stop: 100 })
      if (listResp.success && listResp.data) {
        const found = listResp.data.find(item => item.id === composite || (agentPart && item.agent_id === agentPart))
        if (found) {
          return { success: true, data: found }
        }
      }
    } catch {}

    try {
      const { jobsService } = await import('./jobsService')
      const jobResp = await jobsService.getJobById(jobId)
      if (jobResp.success && jobResp.data) {
        const raw: Record<string, any> = jobResp.data as any
        const candidates: any[] = []
        if (Array.isArray(raw?.selected_agents)) candidates.push(...raw.selected_agents)
        if (Array.isArray(raw?.recommended_agents)) candidates.push(...raw.recommended_agents)
        if (Array.isArray(raw?.agents)) candidates.push(...raw.agents)
        if (raw?.agent_id) candidates.push(raw.agent_id)
        if (raw?.assigned_agent) candidates.push(raw.assigned_agent)
        if (raw?.agent && typeof raw.agent === 'object') candidates.push(raw.agent)
        const match = candidates.find(c => {
          const idCandidate = typeof c === 'string' ? c : String(c?.id || c?._id || c?.user_id || c?.agent_id || c?.email || '')
          return idCandidate && (idCandidate === agentPart || idCandidate === composite)
        })
        if (match) {
          const created = Number(raw?.date_created || Date.now() / 1000)
          const updated = Number(raw?.last_updated || Date.now() / 1000)
          const proposalText = String(raw?.proposal || raw?.client_proposal || '')
          const active = String(raw?.status || '').toLowerCase().includes('active')
          const status = active || (Array.isArray(raw?.selected_agents) && raw.selected_agents.includes(match)) ? 'accepted' : 'pending_review'
          const name = String(
            (typeof match === 'object' && (match?.full_name || match?.name || match?.display_name || match?.username)) || ''
          ).trim()
          const email = String(
            (typeof match === 'object' && (match?.email || match?.contact_email || match?.user_email)) || ''
          ).trim()
          const agentId = String(
            typeof match === 'string' ? match : (match?.id || match?._id || match?.user_id || match?.agent_id || match?.email || '')
          )
          const item: ApplicationOut = {
            job_id: jobId,
            proposal: proposalText,
            id: composite,
            proposal_status: status as any,
            agent_id: agentId,
            date_created: created > 1_000_000_000_000 ? Math.floor(created / 1000) : Math.floor(created),
            last_updated: updated > 1_000_000_000_000 ? Math.floor(updated / 1000) : Math.floor(updated)
          }
          if (name) (item as any).agent_name = name
          if (email) (item as any).agent_email = email
          return { success: true, data: item }
        }
      }
    } catch {}

    try {
      const raw = localStorage.getItem('selectedClientProposal')
      if (raw) {
        const parsed = JSON.parse(raw)
        const idOk = String(parsed?.id || '') === composite
        const jobOk = String(parsed?.job_id || '') === jobId
        if (idOk && jobOk) {
          const name = String(parsed?.agent_name || '').trim()
          const email = String(parsed?.agent_email || '').trim()
          const agentDir = parsed?.agent_directory || {}
          const agentId = agentPart || ''
          const proposalText = ''
          const nowUnix = Math.floor(Date.now() / 1000)
          const item: ApplicationOut = {
            job_id: jobId,
            proposal: proposalText,
            id: composite,
            proposal_status: 'pending_review',
            agent_id: agentId,
            date_created: nowUnix,
            last_updated: nowUnix
          }
          const dirEntry = agentId && agentDir && typeof agentDir === 'object' ? agentDir[agentId] : undefined
          const dirName = String(dirEntry?.name || '').trim()
          const dirEmail = String(dirEntry?.email || '').trim()
          const finalName = name || dirName
          const finalEmail = email || dirEmail
          if (finalName) (item as any).agent_name = finalName
          if (finalEmail) (item as any).agent_email = finalEmail
          return { success: true, data: item }
        }
      }
    } catch {}

    return {
      success: false,
      error: 'Failed to fetch application'
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
    if (response.data.status_code === 200 || response.data.status_code === 0) {
      return {
        success: true,
        data: response.data.data as ApplicationOut
      }
    }
    try {
        const fallback = await apiClient.patch<ApiResponse<ApplicationOut>>(
        `/v1/jobs/client/accept-proposal/${jobId}`,
        { application_id: payload.id, client_approved: true }
      )
      if (fallback.data.status_code === 200 || fallback.data.status_code === 0) {
        return {
          success: true,
          data: fallback.data.data as ApplicationOut
        }
      }
      return {
        success: false,
        error: fallback.data.detail || 'Failed to approve application'
      }
    } catch (fallbackError: any) {
      return {
        success: false,
        error: fallbackError?.response?.data?.detail || fallbackError?.message || 'Failed to approve application'
      }
    }
  } catch (error: any) {
    try {
      const fallback = await apiClient.patch<ApiResponse<ApplicationOut>>(
        `/v1/jobss/client/accept-proposal/${jobId}`,
        { application_id: payload.id, client_approved: true }
      )
      if (fallback.data.status_code === 200 || fallback.data.status_code === 0) {
        return {
          success: true,
          data: fallback.data.data as ApplicationOut
        }
      }
      return {
        success: false,
        error: fallback.data.detail || 'Failed to approve application'
      }
    } catch (fallbackError: any) {
      return {
        success: false,
        error: fallbackError?.response?.data?.detail || fallbackError?.message || error?.message || 'Failed to approve application'
      }
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
    if (response.data.status_code === 200 || response.data.status_code === 0) {
      return {
        success: true,
        data: response.data.data as ApplicationOut
      }
    }
    try {
        const fallback = await apiClient.patch<ApiResponse<ApplicationOut>>(
        `/v1/jobs/client/reject-proposal/${jobId}`,
        { application_id: payload.application_id, client_approved: false, rejection_reason: payload.rejection_reason }
      )
      if (fallback.data.status_code === 200 || fallback.data.status_code === 0) {
        return {
          success: true,
          data: fallback.data.data as ApplicationOut
        }
      }
      return {
        success: false,
        error: fallback.data.detail || 'Failed to reject application'
      }
    } catch (fallbackError: any) {
      return {
        success: false,
        error: fallbackError?.response?.data?.detail || fallbackError?.message || 'Failed to reject application'
      }
    }
  } catch (error: any) {
    try {
      const fallback = await apiClient.patch<ApiResponse<ApplicationOut>>(
        `/v1/jobss/client/reject-proposal/${jobId}`,
        { application_id: payload.application_id, client_approved: false, rejection_reason: payload.rejection_reason }
      )
      if (fallback.data.status_code === 200 || fallback.data.status_code === 0) {
        return {
          success: true,
          data: fallback.data.data as ApplicationOut
        }
      }
      return {
        success: false,
        error: fallback.data.detail || 'Failed to reject application'
      }
    } catch (fallbackError: any) {
      return {
        success: false,
        error: fallbackError?.response?.data?.detail || fallbackError?.message || error?.message || 'Failed to reject application'
      }
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

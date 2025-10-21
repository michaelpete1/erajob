import apiClient from './apiClient'
import type { ApiResponse, ServiceResponse, WorkLogListParams, WorkLogOut, WorkLogPostPayload } from '@/types/api'

const BASE_URL = '/v1/logss'

const buildListParams = (params?: Partial<WorkLogListParams>) => ({
  start: params?.start ?? 0,
  stop: params?.stop ?? 50
})

export const listAgentLogsForJob = async (
  jobId: string,
  params?: Partial<WorkLogListParams>
): Promise<ServiceResponse<WorkLogOut[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<WorkLogOut[]>>(`${BASE_URL}/agent/list/${jobId}`, {
      params: buildListParams(params)
    })
    if (response.data.status_code === 200 || response.data.status_code === 0) {
      return { success: true, data: response.data.data ?? [] }
    }
    return { success: false, error: response.data.detail || 'Failed to fetch agent work logs' }
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.detail || error?.message || 'Failed to fetch agent work logs'
    }
  }
}

export const listClientLogsForJob = async (
  jobId: string,
  params?: Partial<WorkLogListParams>
): Promise<ServiceResponse<WorkLogOut[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<WorkLogOut[]>>(`${BASE_URL}/client/list/${jobId}`, {
      params: buildListParams(params)
    })
    if (response.data.status_code === 200 || response.data.status_code === 0) {
      return { success: true, data: response.data.data ?? [] }
    }
    return { success: false, error: response.data.detail || 'Failed to fetch client work logs' }
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.detail || error?.message || 'Failed to fetch client work logs'
    }
  }
}

export const getAgentLogById = async (id: string): Promise<ServiceResponse<WorkLogOut>> => {
  try {
    const response = await apiClient.get<ApiResponse<WorkLogOut>>(`${BASE_URL}/agent/view`, {
      params: { id }
    })
    if (response.data.status_code === 200 || response.data.status_code === 0) {
      return { success: true, data: response.data.data as WorkLogOut }
    }
    return { success: false, error: response.data.detail || 'Failed to fetch work log' }
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.detail || error?.message || 'Failed to fetch work log'
    }
  }
}

export const getClientLogById = async (
  params: { id: string; job_id: string }
): Promise<ServiceResponse<WorkLogOut>> => {
  try {
    const response = await apiClient.get<ApiResponse<WorkLogOut>>(`${BASE_URL}/client/view`, {
      params
    })
    if (response.data.status_code === 200 || response.data.status_code === 0) {
      return { success: true, data: response.data.data as WorkLogOut }
    }
    return { success: false, error: response.data.detail || 'Failed to fetch work log' }
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.detail || error?.message || 'Failed to fetch work log'
    }
  }
}

export const postWorkLog = async (payload: WorkLogPostPayload): Promise<ServiceResponse<WorkLogOut>> => {
  try {
    const response = await apiClient.post<ApiResponse<WorkLogOut>>(`${BASE_URL}/post`, payload)
    if (response.data.status_code === 200 || response.data.status_code === 0) {
      return { success: true, data: response.data.data as WorkLogOut }
    }
    return { success: false, error: response.data.detail || 'Failed to submit work log' }
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.detail || error?.message || 'Failed to submit work log'
    }
  }
}

export const approveWorkLog = async (logId: string): Promise<ServiceResponse<WorkLogOut>> => {
  try {
    const response = await apiClient.patch<ApiResponse<WorkLogOut>>(`${BASE_URL}/approve/${logId}`)
    if (response.data.status_code === 200 || response.data.status_code === 0) {
      return { success: true, data: response.data.data as WorkLogOut }
    }
    return { success: false, error: response.data.detail || 'Failed to approve work log' }
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.detail || error?.message || 'Failed to approve work log'
    }
  }
}

export const rejectWorkLog = async (
  logId: string,
  rejectionReason: string
): Promise<ServiceResponse<WorkLogOut>> => {
  try {
    const response = await apiClient.patch<ApiResponse<WorkLogOut>>(`${BASE_URL}/reject/${logId}`, {
      rejection_reason: rejectionReason
    })
    if (response.data.status_code === 200 || response.data.status_code === 0) {
      return { success: true, data: response.data.data as WorkLogOut }
    }
    return { success: false, error: response.data.detail || 'Failed to reject work log' }
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.detail || error?.message || 'Failed to reject work log'
    }
  }
}

export const workLogsService = {
  listAgentLogsForJob,
  listClientLogsForJob,
  getAgentLogById,
  getClientLogById,
  postWorkLog,
  approveWorkLog,
  rejectWorkLog
}

export default workLogsService

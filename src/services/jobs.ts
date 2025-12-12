import type { JobPostData, JobApprovalData } from '../types/api'
import type { JobListApiResponse } from '../types/api/jobs'
import { listAvailableAgentJobs as listAvailableAgentJobsV2, listClientCreatedJobs as listClientCreatedJobsV2, listAdminJobs as listAllJobsAdminV2, getJobById as getJobByIdV2, postNewJob as postNewJobV2 } from './jobsService'
import { approveJob as approveJobV2, clientAcceptJobProposal as clientAcceptJobProposalV2, clientRejectJobProposal as clientRejectJobProposalV2 } from './jobsService'
import apiClient from './apiClient'

const BASE_URL = '/v1/jobs'

export const listAvailableAgentJobs = (start: number, stop: number) => {
  return apiClient.get<JobListApiResponse>(`${BASE_URL}/agent/available/`, { params: { start, stop } })
}

export const listClientCreatedJobs = (start: number, stop: number) => {
  return listClientCreatedJobsV2(start, stop) as any
}

export const listAllJobsAdmin = (start: number, stop: number) => {
  return listAllJobsAdminV2(start, stop) as any
}

export const getJobById = (id: string) => {
  return getJobByIdV2(id) as any
}

export const postNewJob = (data: JobPostData) => {
  return postNewJobV2(data) as any
}

export const approveJob = (jobId: string, data: JobApprovalData) => {
  return approveJobV2(jobId, data) as any
}

export const proposeJob = (
  jobId: string,
  data: {
    agent: any
    timeline?: { start_date: number; deadline: number }
    proposal: string
    break_down: { service?: number; Charges: number; Tax: number }
  }
) => {
  return apiClient.post<string>(`${BASE_URL}/propose/${jobId}`, data, { timeout: 60000 })
    .catch(async (error: any) => {
      const status = error?.response?.status
      if (status === 404) {
        try {
          return await apiClient.post<string>(`/v1/jobs/propose/${jobId}`, data, { timeout: 60000 })
        } catch (e) {
          return Promise.reject(e)
        }
      }
      return Promise.reject(error)
    })
}

export const clientAcceptJobProposal = (jobId: string, data: { client_approved: true; selected_agents: string[] }) => {
  return clientAcceptJobProposalV2(jobId, data) as any
}

export const clientRejectJobProposal = (jobId: string, data: { client_approved: false; client_rejection_reason: string }) => {
  return clientRejectJobProposalV2(jobId, data) as any
}

export default {
  listAvailableAgentJobs,
  listClientCreatedJobs,
  listAllJobsAdmin,
  getJobById,
  postNewJob,
  approveJob,
  proposeJob,
  clientAcceptJobProposal,
  clientRejectJobProposal
}

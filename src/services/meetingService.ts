import { apiClient } from './apiService'
import type { ServiceResponse, ApiResponse } from '../types/api'

export interface MeetingRequest {
  agent_id: string
  client_id: string
  job_id?: string
  meeting_type: 'initial_consultation' | 'project_discussion' | 'follow_up'
  preferred_date?: string
  preferred_time?: string
  timezone?: string
  notes?: string
  client_approved?: boolean
  rejection_reason?: string
}

export interface MeetingResponse {
  id: string
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled'
  meeting_link?: string
  scheduled_at?: string
  created_at: string
}

export class MeetingService {
  private static instance: MeetingService

  private constructor() {}

  public static getInstance(): MeetingService {
    if (!MeetingService.instance) {
      MeetingService.instance = new MeetingService()
    }
    return MeetingService.instance
  }

  /**
   * Request a meeting with an agent (sends notification alerts to agent and admin)
   */
  async requestMeeting(meetingData: MeetingRequest): Promise<ServiceResponse<MeetingResponse>> {
    try {
      // Create alert for the agent about the meeting request
      try {
        const { alertsService } = await import('./notificationsService')
        alertsService.createLocalAlert({
          alert_title: 'New Meeting Request',
          alert_description: `A client has requested a meeting for ${meetingData.meeting_type.replace('_', ' ')}`,
          alert_type: 'meeting',
          alert_primary_action: 'View Details',
          alert_secondary_action: 'Schedule Meeting',
          priority: 'normal',
          alert_target_user_id: meetingData.agent_id
        })

        // Also create alert for admin
        alertsService.createLocalAlert({
          alert_title: 'New Meeting Request',
          alert_description: `A client has requested a meeting with agent for ${meetingData.meeting_type.replace('_', ' ')}`,
          alert_type: 'meeting',
          alert_primary_action: 'View Details',
          alert_secondary_action: 'Monitor',
          priority: 'normal',
          alert_target_user_id: 'admin'
        })
      } catch (alertError) {
        console.warn('[MeetingService] Failed to create meeting alerts:', alertError)
      }

      // Return success without creating actual meeting - just alerts
      const mockResponse: MeetingResponse = {
        id: `meeting_request_${Date.now()}`,
        status: 'pending',
        created_at: new Date().toISOString()
      }

      return { success: true, data: mockResponse, message: 'Meeting request sent successfully' }
    } catch (error: any) {
      const message = error?.message || 'Failed to request meeting'
      if (typeof window !== 'undefined') {
        console.error('[MeetingService] requestMeeting error:', message)
      }
      return { success: false, error: message }
    }
  }

  /**
   * Set a meeting with an agent (client rejecting admin job proposal)
   */
  async setMeeting(meetingData: { job_id: string; agent_id: string; meeting_time: number; client_id?: string; client_approved?: boolean; rejection_reason?: string }): Promise<ServiceResponse<string>> {
    try {
      const clientId = meetingData.client_id || localStorage.getItem('userId') || (() => {
        try {
          const raw = localStorage.getItem('userInfo')
          if (!raw) return ''
          const parsed = JSON.parse(raw)
          return parsed?.id || ''
        } catch {
          return ''
        }
      })()
      const resolvedClientId = typeof clientId === 'string' && clientId.trim().length > 0
        ? clientId
        : (typeof meetingData.client_id === 'string' ? meetingData.client_id : '')
      if (!resolvedClientId || !meetingData.job_id || !meetingData.agent_id || !meetingData.meeting_time) {
        return { success: false, error: 'Missing required meeting details' }
      }

      const clientApproved = typeof meetingData.client_approved === 'boolean' ? meetingData.client_approved : true
      const rejectionReason = typeof meetingData.rejection_reason === 'string' && meetingData.rejection_reason.trim().length > 0
        ? meetingData.rejection_reason
        : ''
      const meetingTimeSeconds = meetingData.meeting_time >= 1000000000000
        ? Math.floor(meetingData.meeting_time / 1000)
        : Math.floor(meetingData.meeting_time)

      const payload: any = {
        ...meetingData,
        client_id: String(resolvedClientId),
        client_approved: clientApproved,
        meeting_time: meetingTimeSeconds
      }
      if (!clientApproved) {
        payload.rejection_reason = rejectionReason || 'Client rejected admin job proposal'
      } else {
        delete payload.rejection_reason
      }

      const response = await apiClient.post<ApiResponse<string>>(`/v1/jobss/client/set-meeting/`, payload)

      if (response.data.status_code === 200 || response.data.status_code === 0) {
        // Create alert for admin about the meeting set and potential rejection
        try {
          const { alertsService } = await import('./notificationsService')
          const { agentsService } = await import('./agentsService')
          const adminEmail = typeof window !== 'undefined' ? localStorage.getItem('adminEmail') : null
          let agentEmail: string | undefined
          try {
            const agentResp = await agentsService.getAgentById(meetingData.agent_id)
            if (agentResp.success && agentResp.data) {
              const a: any = agentResp.data
              agentEmail = String(a?.email || a?.user_email || '') || undefined
            }
          } catch {}
          const { jobsService } = await import('./jobsService')
          let jobTitle: string = ''
          let jobDescription: string = ''
          let jobBudget: number | string = ''
          try {
            const jobResp = await jobsService.getJobById(meetingData.job_id)
            if (jobResp.success && jobResp.data) {
              const j: any = jobResp.data
              jobTitle = String(j?.project_title || j?.job_title || '')
              jobDescription = String(j?.description || '')
              jobBudget = typeof j?.budget === 'number' ? j.budget : (typeof j?.budget === 'string' ? j.budget : '')
            }
          } catch {}
          const meetingDateStr = new Date(Number(meetingTimeSeconds) * 1000).toLocaleDateString('en-US')
          const alertTitle = `Client Created A Meeting to discuss the job: ${jobTitle || meetingData.job_id}`
          const alertDescription = `Client Created A Meeting to discuss the job: ${jobTitle || meetingData.job_id}${jobDescription ? ', ' + jobDescription : ''}${jobBudget !== '' ? ', ' + jobBudget : ''} on ${meetingDateStr}`

          alertsService.createLocalAlert({
            alert_title: alertTitle,
            alert_description: alertDescription,
            alert_type: 'meeting_with_agent_and_client',
            alert_primary_action: 'Mark as Read',
            alert_secondary_action: 'Cancel',
            priority: 'very_high',
            alert_target_user_id: 'admin',
            job_id: meetingData.job_id,
            agent_id: meetingData.agent_id,
            client_id: String(resolvedClientId),
            recipients: [adminEmail, agentEmail].filter((e): e is string => typeof e === 'string' && e.trim().length > 0)
          })
          alertsService.createLocalAlert({
            alert_title: `Client Created A Meeting to discuss the job: ${jobTitle || meetingData.job_id}`,
            alert_description: `Client Created A Meeting to discuss the job: ${jobTitle || meetingData.job_id}${jobDescription ? ', ' + jobDescription : ''}${jobBudget !== '' ? ', ' + jobBudget : ''} on ${meetingDateStr}`,
            alert_type: 'meeting_with_agent_and_client',
            alert_primary_action: 'Mark as Read',
            alert_secondary_action: 'Cancel',
            priority: 'very_high',
            alert_target_user_id: meetingData.agent_id,
            recipients: [agentEmail].filter((e): e is string => typeof e === 'string' && e.trim().length > 0)
          })
        } catch (alertError) {
          console.warn('[MeetingService] Failed to create admin alert:', alertError)
        }

        return { success: true, data: response.data.data as string, message: 'Meeting set successfully' }
      }
      throw new Error((response.data as any).detail || 'Failed to set meeting')
    } catch (error: any) {
      const message = error?.response?.data?.detail || error?.message || 'Failed to set meeting'
      if (typeof window !== 'undefined') {
        console.error('[MeetingService] setMeeting error:', message, 'status:', error?.response?.status, 'data:', error?.response?.data)
      }
      try {
        const { alertsService } = await import('./notificationsService')
        alertsService.createLocalAlert({
          alert_title: 'Meeting Setup Failed',
          alert_description: `A client attempted to set a meeting with an agent, but it failed: ${message}`,
          alert_type: 'meeting',
          alert_primary_action: 'Review',
          alert_secondary_action: 'Investigate',
          priority: 'high',
          alert_target_user_id: 'admin'
        })
      } catch (_) {}
      try {
        const needsMs = typeof meetingData.meeting_time === 'number' && meetingData.meeting_time < 1000000000000
        if (needsMs) {
          const retryPayload = { ...meetingData, client_id: (meetingData as any).client_id, meeting_time: meetingData.meeting_time * 1000 }
          const retry = await apiClient.post<ApiResponse<string>>(`/v1/jobss/client/set-meeting/`, retryPayload)
          if (retry.data.status_code === 200 || retry.data.status_code === 0) {
            try {
              const { alertsService } = await import('./notificationsService')
              const { agentsService } = await import('./agentsService')
              const adminEmail = typeof window !== 'undefined' ? localStorage.getItem('adminEmail') : null
              let agentEmail: string | undefined
              try {
                const agentResp = await agentsService.getAgentById((retryPayload as any).agent_id)
                if (agentResp.success && agentResp.data) {
                  const a: any = agentResp.data
                  agentEmail = String(a?.email || a?.user_email || '') || undefined
                }
              } catch {}
              const { jobsService } = await import('./jobsService')
              let jobTitle: string = ''
              let jobDescription: string = ''
              let jobBudget: number | string = ''
              try {
                const jobResp = await jobsService.getJobById(retryPayload.job_id)
                if (jobResp.success && jobResp.data) {
                  const j: any = jobResp.data
                  jobTitle = String(j?.project_title || j?.job_title || '')
                  jobDescription = String(j?.description || '')
                  jobBudget = typeof j?.budget === 'number' ? j.budget : (typeof j?.budget === 'string' ? j.budget : '')
                }
              } catch {}
              const meetingDateStr = new Date(Number(retryPayload.meeting_time) * 1000).toLocaleDateString('en-US')
              const alertTitle = `Client Created A Meeting to discuss the job: ${jobTitle || retryPayload.job_id}`
              const alertDescription = `Client Created A Meeting to discuss the job: ${jobTitle || retryPayload.job_id}${jobDescription ? ', ' + jobDescription : ''}${jobBudget !== '' ? ', ' + jobBudget : ''} on ${meetingDateStr}`
              alertsService.createLocalAlert({
                alert_title: alertTitle,
                alert_description: alertDescription,
                alert_type: 'meeting_with_agent_and_client',
                alert_primary_action: 'Mark as Read',
                alert_secondary_action: 'Cancel',
                priority: 'very_high',
                alert_target_user_id: 'admin',
                job_id: retryPayload.job_id,
                agent_id: retryPayload.agent_id,
                client_id: String(retryPayload.client_id),
                recipients: [adminEmail, agentEmail].filter((e): e is string => typeof e === 'string' && e.trim().length > 0)
              })
              alertsService.createLocalAlert({
                alert_title: `Client Created A Meeting to discuss the job: ${jobTitle || retryPayload.job_id}`,
                alert_description: `Client Created A Meeting to discuss the job: ${jobTitle || retryPayload.job_id}${jobDescription ? ', ' + jobDescription : ''}${jobBudget !== '' ? ', ' + jobBudget : ''} on ${meetingDateStr}`,
                alert_type: 'meeting_with_agent_and_client',
                alert_primary_action: 'Mark as Read',
                alert_secondary_action: 'Cancel',
                priority: 'very_high',
                alert_target_user_id: retryPayload.agent_id,
                recipients: [agentEmail].filter((e): e is string => typeof e === 'string' && e.trim().length > 0)
              })
            } catch (_) {}
            return { success: true, data: retry.data.data as string, message: 'Meeting set successfully' }
          }
        }
        const looksMs = typeof meetingData.meeting_time === 'number' && meetingData.meeting_time >= 1000000000000
        if (looksMs) {
          const retryPayload = { ...meetingData, client_id: (meetingData as any).client_id, meeting_time: Math.floor(meetingData.meeting_time / 1000) }
          const retry = await apiClient.post<ApiResponse<string>>(`/v1/jobss/client/set-meeting/`, retryPayload)
          if (retry.data.status_code === 200 || retry.data.status_code === 0) {
            try {
              const { alertsService } = await import('./notificationsService')
              const { agentsService } = await import('./agentsService')
              const adminEmail = typeof window !== 'undefined' ? localStorage.getItem('adminEmail') : null
              let agentEmail: string | undefined
              try {
                const agentResp = await agentsService.getAgentById((retryPayload as any).agent_id)
                if (agentResp.success && agentResp.data) {
                  const a: any = agentResp.data
                  agentEmail = String(a?.email || a?.user_email || '') || undefined
                }
              } catch {}
              const { jobsService } = await import('./jobsService')
              let jobTitle: string = ''
              let jobDescription: string = ''
              let jobBudget: number | string = ''
              try {
                const jobResp = await jobsService.getJobById(retryPayload.job_id)
                if (jobResp.success && jobResp.data) {
                  const j: any = jobResp.data
                  jobTitle = String(j?.project_title || j?.job_title || '')
                  jobDescription = String(j?.description || '')
                  jobBudget = typeof j?.budget === 'number' ? j.budget : (typeof j?.budget === 'string' ? j.budget : '')
                }
              } catch {}
              const meetingDateStr = new Date(Number(retryPayload.meeting_time) * 1000).toLocaleDateString('en-US')
              const alertTitle = `Client Created A Meeting to discuss the job: ${jobTitle || retryPayload.job_id}`
              const alertDescription = `Client Created A Meeting to discuss the job: ${jobTitle || retryPayload.job_id}${jobDescription ? ', ' + jobDescription : ''}${jobBudget !== '' ? ', ' + jobBudget : ''} on ${meetingDateStr}`
              alertsService.createLocalAlert({
                alert_title: alertTitle,
                alert_description: alertDescription,
                alert_type: 'meeting_with_agent_and_client',
                alert_primary_action: 'Mark as Read',
                alert_secondary_action: 'Cancel',
                priority: 'very_high',
                alert_target_user_id: 'admin',
                job_id: retryPayload.job_id,
                agent_id: retryPayload.agent_id,
                client_id: String(retryPayload.client_id),
                recipients: [adminEmail, agentEmail].filter((e): e is string => typeof e === 'string' && e.trim().length > 0)
              })
              alertsService.createLocalAlert({
                alert_title: `Client Created A Meeting to discuss the job: ${jobTitle || retryPayload.job_id}`,
                alert_description: `Client Created A Meeting to discuss the job: ${jobTitle || retryPayload.job_id}${jobDescription ? ', ' + jobDescription : ''}${jobBudget !== '' ? ', ' + jobBudget : ''} on ${meetingDateStr}`,
                alert_type: 'meeting_with_agent_and_client',
                alert_primary_action: 'Mark as Read',
                alert_secondary_action: 'Cancel',
                priority: 'very_high',
                alert_target_user_id: retryPayload.agent_id,
                recipients: [agentEmail].filter((e): e is string => typeof e === 'string' && e.trim().length > 0)
              })
            } catch (_) {}
            return { success: true, data: retry.data.data as string, message: 'Meeting set successfully' }
          }
        }
      } catch (_) {}
      return { success: false, error: message }
    }
  }

  /**
   * Get meeting details by ID
   */
  async getMeeting(meetingId: string): Promise<ServiceResponse<MeetingResponse>> {
    try {
      const response = await apiClient.get<ApiResponse<MeetingResponse>>(`/v1/meetings/${meetingId}`)

      if (response.data.status_code === 200) {
        return { success: true, data: response.data.data as MeetingResponse, message: 'Meeting details retrieved' }
      }
      throw new Error((response.data as any).detail || 'Failed to get meeting details')
    } catch (error: any) {
      const message = error?.response?.data?.detail || error?.message || 'Failed to get meeting details'
      if (typeof window !== 'undefined') {
        console.error('[MeetingService] getMeeting error:', message)
      }
      return { success: false, error: message }
    }
  }

  /**
   * Cancel a meeting request
   */
  async cancelMeeting(meetingId: string): Promise<ServiceResponse<void>> {
    try {
      const response = await apiClient.put<ApiResponse<void>>(`/v1/meetings/${meetingId}/cancel`)

      if (response.data.status_code === 200) {
        return { success: true, message: 'Meeting cancelled successfully' }
      }
      throw new Error((response.data as any).detail || 'Failed to cancel meeting')
    } catch (error: any) {
      const message = error?.response?.data?.detail || error?.message || 'Failed to cancel meeting'
      if (typeof window !== 'undefined') {
        console.error('[MeetingService] cancelMeeting error:', message)
      }
      return { success: false, error: message }
    }
  }
}

// Export singleton instance
export const meetingService = MeetingService.getInstance()

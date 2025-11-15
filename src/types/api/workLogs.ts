export interface WorkLogOut {
  job_id: string
  log_comment: string
  files: string[]
  hours: number
  log_title: string
  agent_id: string
  agent_name?: string
  agent_email?: string
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

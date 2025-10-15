/**
 * The main structure for a single Alert object from the API.
 */
export interface Alert {
  id: string
  user_type: 'agent' | 'client' | 'admin'
  user_id: string
  priority: 'very_high' | 'high' | 'medium' | 'low'
  alert_type: string // e.g., 'new_agent'
  alert_title: string
  alert_description: string
  alert_primary_action: string
  alert_secondary_action: string
  date_created: number
  last_updated: number
}

/**
 * Defines the structure of an API response containing a single alert.
 */
export interface AlertApiResponse {
  status_code: number
  data: Alert
  detail: string
}

/**
 * Defines the structure of an API response containing a list of alerts.
 */
export interface AlertListApiResponse {
  status_code: number
  data: Alert[]
  detail: string
}
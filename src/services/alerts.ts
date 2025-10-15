import apiClient from './apiClient'
import type { AlertApiResponse, AlertListApiResponse } from '../types/api/alerts'

// Note: Using '/v1/alerts' assuming 'alertss' in the documentation is a typo.
const BASE_URL = '/v1/alerts'

/**
 * Fetches all alerts that belong to an authenticated agent.
 */
export const getAgentAlerts = () => {
  return apiClient.get<AlertListApiResponse>(`${BASE_URL}/agent`)
}

/**
 * Fetches all alerts that belong to an authenticated client.
 */
export const getClientAlerts = () => {
  return apiClient.get<AlertListApiResponse>(`${BASE_URL}/client`)
}

/**
 * Fetches all alerts in the system. (Admin only)
 */
export const getAllAlertsAdmin = () => {
  return apiClient.get<AlertListApiResponse>(`${BASE_URL}/admin`)
}

/**
 * Fetches a specific alert for the currently authenticated admin.
 * @param id - The ID of the alert to fetch.
 */
export const getMyAdminAlert = (id: string) => {
  return apiClient.get<AlertApiResponse>(`${BASE_URL}/admin/me`, { params: { id } })
}

/**
 * Fetches a specific alert for the currently authenticated client.
 * @param id - The ID of the alert to fetch.
 */
export const getMyClientAlert = (id: string) => {
  return apiClient.get<AlertApiResponse>(`${BASE_URL}/client/me`, { params: { id } })
}

/**
 * Fetches a specific alert for the currently authenticated agent.
 * @param id - The ID of the alert to fetch.
 */
export const getMyAgentAlert = (id: string) => {
  return apiClient.get<AlertApiResponse>(`${BASE_URL}/agent/me`, { params: { id } })
}

export default {
  getAgentAlerts,
  getClientAlerts,
  getAllAlertsAdmin,
  getMyAdminAlert,
  getMyClientAlert,
  getMyAgentAlert
}

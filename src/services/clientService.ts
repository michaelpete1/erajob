import apiClient from './apiClient'
import type {
  ClientLoginCredentials,
  ResetTokenRequest,
  ResetPasswordData,
  ClientApiResponse,
  ClientListApiResponse,
  ResetTokenApiResponse
} from '../types/api/client'

const BASE_URL = '/v1/clients'

/**
 * Retrieves a paginated list of all registered clients. (Admin only)
 * @param start - The starting index for the list.
 * @param stop - The ending index for the list.
 */
export const listClients = (start: number, stop: number) => {
  return apiClient.get<ClientListApiResponse>(`${BASE_URL}/${start}/${stop}`)
}

/**
 * Retrieves the profile information for the currently authenticated client.
 */
export const getMyClientProfile = () => {
  return apiClient.get<ClientApiResponse>(`${BASE_URL}/me`)
}

/**
 * Authenticates a client with their login credentials.
 * @param credentials - The login credentials for the client.
 */
export const loginClient = (credentials: ClientLoginCredentials) => {
  return apiClient.post<ClientApiResponse>(`${BASE_URL}/login`, credentials)
}

/**
 * Generates and sends a password reset token for a client.
 * @param data - The email of the client requesting the reset.
 */
export const sendResetToken = (data: ResetTokenRequest) => {
  return apiClient.post<ResetTokenApiResponse>(`${BASE_URL}/get-reset-token`, data)
}

/**
 * Resets a client's password using a reset token and OTP.
 * @param data - The reset token, OTP, and new password.
 */
export const resetPassword = (data: ResetPasswordData) => {
  return apiClient.patch<ClientApiResponse>(`${BASE_URL}/reset-password`, data)
}

export default {
  listClients,
  getMyClientProfile,
  loginClient,
  sendResetToken,
  resetPassword
}
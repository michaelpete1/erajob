import apiClient from './apiClient'
import type {
  UserSignupData,
  UserLoginCredentials,
  TokenRefreshData,
  UserApiResponse,
  UserListApiResponse,
  SignupApiResponse
} from '../types/api/user'

const BASE_URL = '/v1/users'

/**
 * Retrieves a paginated list of all registered users. (Admin only)
 * @param start - The starting index for the list.
 * @param stop - The ending index for the list.
 */
export const listUsers = (start: number, stop: number) => {
  return apiClient.get<UserListApiResponse>(`${BASE_URL}/${start}/${stop}`)
}

/**
 * Retrieves the profile information for the currently authenticated user.
 */
export const getMyProfile = () => {
  return apiClient.get<UserApiResponse>(`${BASE_URL}/me`)
}

/**
 * Registers a new user (client or agent).
 * @param data - The signup data for the new user.
 */
export const signupUser = (data: UserSignupData) => {
  return apiClient.post<SignupApiResponse>(`${BASE_URL}/signup`, data)
}

/**
 * Authenticates a user with the provided email and password.
 * @param credentials - The login credentials for the user.
 */
export const loginUser = (credentials: UserLoginCredentials) => {
  return apiClient.post<UserApiResponse>(`${BASE_URL}/login`, credentials)
}

/**
 * Refreshes the user's access token.
 * @param data - The refresh token data.
 */
export const refreshUserToken = (data: TokenRefreshData) => {
  return apiClient.post<UserApiResponse>(`${BASE_URL}/refresh`, data)
}

/**
 * Deletes the account associated with the provided access token.
 */
export const deleteUserAccount = () => {
  return apiClient.delete<string>(`${BASE_URL}/account`)
}

export default {
  listUsers,
  getMyProfile,
  signupUser,
  loginUser,
  refreshUserToken,
  deleteUserAccount
}

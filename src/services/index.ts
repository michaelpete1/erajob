// Unified API service export
export { apiService, apiClient } from './apiService'
export type {
  EJApiResponse,
  UserBase,
  UserLogin,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UserRefresh,
  UserOut,
  JobTimeline,
  JobCategories,
  Skills,
  JobsBase,
  JobsOut,
  AlertsOut,
  ValidationError,
  HTTPValidationError,
  ServiceResponse
} from './apiService'

// Legacy exports for backward compatibility
export { default as legacyApiClient } from './apiClient'
export { default as authService } from './authService'
export { jobsService } from './jobsService'
export { usersService } from './usersService'
export { notificationsService } from './notificationsService'
export { agentsService } from './agentsService'

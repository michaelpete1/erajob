import apiService, { api, ApiError, handleApiResponse } from './apiService';
import type {
  EJApiResponse,
  UserBase,
  UserLogin,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UserRefresh,
  UserOut,
  JobsBase,
  JobsOut,
  AlertsOut,
  ServiceResponse
} from '../types/api/openapi';

export { apiService, api, ApiError, handleApiResponse };

export type {
  EJApiResponse,
  UserBase,
  UserLogin,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UserRefresh,
  UserOut,
  JobsBase,
  JobsOut,
  AlertsOut,
  ServiceResponse
};
// Legacy exports for backward compatibility
export { default as legacyApiClient } from './apiClient'
export { default as authService } from './authService'
export { jobsService } from './jobsService'
export { usersService } from './usersService'
export { alertsService, notificationsService } from './notificationsService'
export { agentsService } from './agentsService'
export { apiClient } from './apiService'

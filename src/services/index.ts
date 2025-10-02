// src/services/index.ts

// Export all services
export { authService } from './authService'
export { jobsService } from './jobsService'
export { usersService } from './usersService'
export { apiClient } from './api'

// Export types
export type {
  UserLogin,
  UserBase,
  UserOut,
  JobBase,
  JobOut,
  JobCategory,
  Skill,
  JobTimeline,
  ApiResponse,
  AuthState,
  JobState,
  ServiceResponse,
  PaginationParams,
  JobFilters,
  UserFilters
} from '../types/api'

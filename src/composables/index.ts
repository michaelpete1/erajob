// src/composables/index.ts

export { useAuth } from './useAuth'
export { useJobs } from './useJobs'

// Re-export services for convenience
export {
  authService,
  jobsService,
  usersService,
  apiClient
} from '../services'

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

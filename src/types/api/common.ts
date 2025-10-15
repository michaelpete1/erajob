// Common API response envelope
export interface EJApiResponse<T> {
  data: T
  status: number
  message?: string
}

// Common pagination parameters
export interface EJPaginationParams {
  page?: number
  limit?: number
}

// Error response shape
export interface EJApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
}
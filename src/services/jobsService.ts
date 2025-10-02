// src/services/jobsService.ts

import { apiClient } from './api'
import type {
  JobBase,
  JobOut,
  ApiResponse,
  JobState,
  PaginationParams,
  JobFilters,
  ServiceResponse
} from '../types/api'

export class JobsService {
  private static instance: JobsService
  private jobState: JobState = {
    jobs: [],
    currentJob: null,
    loading: false,
    error: null,
    pagination: {
      start: 0,
      stop: 10,
      hasMore: true
    }
  }

  private constructor() {}

  public static getInstance(): JobsService {
    if (!JobsService.instance) {
      JobsService.instance = new JobsService()
    }
    return JobsService.instance
  }

  /**
   * Get current jobs state
   */
  getJobState(): JobState {
    return { ...this.jobState }
  }

  /**
   * Create new job (Client only)
   */
  async createJob(jobData: JobBase): Promise<ServiceResponse<JobOut>> {
    this.jobState.loading = true
    this.jobState.error = null

    try {
      const response = await apiClient.post<ApiResponse<JobOut>>('/v1/jobss/', jobData)

      if (response.data.status_code === 200) {
        const job = response.data.data

        // Add to jobs list if needed
        if (job) {
          this.jobState.jobs.unshift(job)
        }

        this.jobState.loading = false

        return {
          success: true,
          data: job,
          message: 'Job created successfully'
        }
      } else {
        throw new Error(response.data.detail || 'Failed to create job')
      }
    } catch (error: any) {
      this.jobState.loading = false
      this.jobState.error = error.response?.data?.detail || error.message || 'Failed to create job'

      return {
        success: false,
        error: this.jobState.error || undefined
      }
    }
  }

  /**
   * Get jobs created by current client
   */
  async getClientJobs(params?: PaginationParams & JobFilters): Promise<ServiceResponse<JobOut[]>> {
    this.jobState.loading = true
    this.jobState.error = null

    try {
      const { start = 0, stop = 10 } = params || {}
      const response = await apiClient.get<ApiResponse<JobOut[]>>(
        `/v1/jobss/client/created/${start}/${stop}`
      )

      if (response.data.status_code === 200) {
        const jobs = response.data.data || []

        // Update pagination state
        this.jobState.pagination = {
          start,
          stop,
          hasMore: jobs.length === stop - start
        }

        // Update jobs list
        if (start === 0) {
          this.jobState.jobs = jobs
        } else {
          this.jobState.jobs.push(...jobs)
        }

        this.jobState.loading = false

        return {
          success: true,
          data: jobs,
          message: `Retrieved ${jobs.length} jobs`
        }
      } else {
        throw new Error(response.data.detail || 'Failed to fetch client jobs')
      }
    } catch (error: any) {
      this.jobState.loading = false
      this.jobState.error = error.response?.data?.detail || error.message || 'Failed to fetch client jobs'

      return {
        success: false,
        error: this.jobState.error || undefined
      }
    }
  }

  /**
   * Get jobs available for current agent
   */
  async getAvailableJobs(params?: PaginationParams & JobFilters): Promise<ServiceResponse<JobOut[]>> {
    this.jobState.loading = true
    this.jobState.error = null

    try {
      const { start = 0, stop = 10 } = params || {}
      const response = await apiClient.get<ApiResponse<JobOut[]>>(
        `/v1/jobss/agent/available/${start}/${stop}`
      )

      if (response.data.status_code === 200) {
        const jobs = response.data.data || []

        // Update pagination state
        this.jobState.pagination = {
          start,
          stop,
          hasMore: jobs.length === stop - start
        }

        // Update jobs list
        if (start === 0) {
          this.jobState.jobs = jobs
        } else {
          this.jobState.jobs.push(...jobs)
        }

        this.jobState.loading = false

        return {
          success: true,
          data: jobs,
          message: `Retrieved ${jobs.length} available jobs`
        }
      } else {
        throw new Error(response.data.detail || 'Failed to fetch available jobs')
      }
    } catch (error: any) {
      this.jobState.loading = false
      this.jobState.error = error.response?.data?.detail || error.message || 'Failed to fetch available jobs'

      return {
        success: false,
        error: this.jobState.error || undefined
      }
    }
  }

  /**
   * Get all jobs (Admin only)
   */
  async getAllJobs(params?: PaginationParams & JobFilters): Promise<ServiceResponse<JobOut[]>> {
    this.jobState.loading = true
    this.jobState.error = null

    try {
      const { start = 0, stop = 10 } = params || {}
      const response = await apiClient.get<ApiResponse<JobOut[]>>(
        `/v1/jobss/admin/${start}/${stop}`
      )

      if (response.data.status_code === 200) {
        const jobs = response.data.data || []

        // Update pagination state
        this.jobState.pagination = {
          start,
          stop,
          hasMore: jobs.length === stop - start
        }

        // Update jobs list
        if (start === 0) {
          this.jobState.jobs = jobs
        } else {
          this.jobState.jobs.push(...jobs)
        }

        this.jobState.loading = false

        return {
          success: true,
          data: jobs,
          message: `Retrieved ${jobs.length} jobs`
        }
      } else {
        throw new Error(response.data.detail || 'Failed to fetch all jobs')
      }
    } catch (error: any) {
      this.jobState.loading = false
      this.jobState.error = error.response?.data?.detail || error.message || 'Failed to fetch all jobs'

      return {
        success: false,
        error: this.jobState.error || undefined
      }
    }
  }

  /**
   * Get specific job by ID (Admin only)
   */
  async getJobById(jobId: string): Promise<ServiceResponse<JobOut>> {
    this.jobState.loading = true
    this.jobState.error = null

    try {
      const response = await apiClient.get<ApiResponse<JobOut>>('/v1/jobss/me', {
        params: { id: jobId }
      })

      if (response.data.status_code === 200) {
        const job = response.data.data

        // Update current job
        this.jobState.currentJob = job
        this.jobState.loading = false

        return {
          success: true,
          data: job,
          message: 'Job retrieved successfully'
        }
      } else {
        throw new Error(response.data.detail || 'Failed to fetch job')
      }
    } catch (error: any) {
      this.jobState.loading = false
      this.jobState.error = error.response?.data?.detail || error.message || 'Failed to fetch job'

      return {
        success: false,
        error: this.jobState.error || undefined
      }
    }
  }

  /**
   * Update existing job
   */
  async updateJob(jobId: string, jobData: Partial<JobBase>): Promise<ServiceResponse<JobOut>> {
    this.jobState.loading = true
    this.jobState.error = null

    try {
      const response = await apiClient.put<ApiResponse<JobOut>>(`/v1/jobss/${jobId}`, jobData)

      if (response.data.status_code === 200) {
        const updatedJob = response.data.data

        // Update in jobs list
        const jobIndex = this.jobState.jobs.findIndex(job => job.id === jobId)
        if (jobIndex !== -1) {
          this.jobState.jobs[jobIndex] = updatedJob
        }

        // Update current job if it's the same
        if (this.jobState.currentJob?.id === jobId) {
          this.jobState.currentJob = updatedJob
        }

        this.jobState.loading = false

        return {
          success: true,
          data: updatedJob,
          message: 'Job updated successfully'
        }
      } else {
        throw new Error(response.data.detail || 'Failed to update job')
      }
    } catch (error: any) {
      this.jobState.loading = false
      this.jobState.error = error.response?.data?.detail || error.message || 'Failed to update job'

      return {
        success: false,
        error: this.jobState.error || undefined
      }
    }
  }

  /**
   * Delete job
   */
  async deleteJob(jobId: string): Promise<ServiceResponse<void>> {
    this.jobState.loading = true
    this.jobState.error = null

    try {
      await apiClient.delete(`/v1/jobss/${jobId}`)

      // Remove from jobs list
      this.jobState.jobs = this.jobState.jobs.filter(job => job.id !== jobId)

      // Clear current job if it's the deleted one
      if (this.jobState.currentJob?.id === jobId) {
        this.jobState.currentJob = null
      }

      this.jobState.loading = false

      return {
        success: true,
        message: 'Job deleted successfully'
      }
    } catch (error: any) {
      this.jobState.loading = false
      this.jobState.error = error.response?.data?.detail || error.message || 'Failed to delete job'

      return {
        success: false,
        error: this.jobState.error || undefined
      }
    }
  }

  /**
   * Search jobs with filters
   */
  async searchJobs(filters: JobFilters, params?: PaginationParams): Promise<ServiceResponse<JobOut[]>> {
    // This would typically call a search endpoint
    // For now, we'll filter the existing jobs
    const { start = 0, stop = 10 } = params || {}

    let filteredJobs = [...this.jobState.jobs]

    if (filters.category) {
      filteredJobs = filteredJobs.filter(job => job.category === filters.category)
    }

    if (filters.budgetMin !== undefined) {
      filteredJobs = filteredJobs.filter(job => job.budget >= filters.budgetMin!)
    }

    if (filters.budgetMax !== undefined) {
      filteredJobs = filteredJobs.filter(job => job.budget <= filters.budgetMax!)
    }

    if (filters.skills && filters.skills.length > 0) {
      filteredJobs = filteredJobs.filter(job =>
        filters.skills!.some(skill => job.skills_needed === skill)
      )
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredJobs = filteredJobs.filter(job =>
        job.project_title.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower)
      )
    }

    const paginatedJobs = filteredJobs.slice(start, stop)

    return {
      success: true,
      data: paginatedJobs,
      message: `Found ${filteredJobs.length} jobs matching criteria`
    }
  }

  /**
   * Reset jobs state
   */
  resetState(): void {
    this.jobState = {
      jobs: [],
      currentJob: null,
      loading: false,
      error: null,
      pagination: {
        start: 0,
        stop: 10,
        hasMore: true
      }
    }
  }
}

// Export singleton instance
export const jobsService = JobsService.getInstance()

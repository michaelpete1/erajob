// src/composables/useJobs.ts

import { ref, computed, onMounted } from 'vue'
import { jobsService } from '../services'
import type {
  JobOut,
  JobBase,
  JobState,
  PaginationParams,
  JobFilters,
  ServiceResponse
} from '../types/api'

export function useJobs() {
  const jobState = ref<JobState>({
    jobs: [],
    currentJob: null,
    loading: false,
    error: null,
    pagination: {
      start: 0,
      stop: 10,
      hasMore: true
    }
  })

  // Computed properties
  const jobs = computed(() => jobState.value.jobs)
  const currentJob = computed(() => jobState.value.currentJob)
  const loading = computed(() => jobState.value.loading)
  const error = computed(() => jobState.value.error)
  const hasMore = computed(() => jobState.value.pagination.hasMore)

  // Actions based on user role
  const getClientJobs = async (params?: PaginationParams & JobFilters) => {
    const result = await jobsService.getClientJobs(params)

    if (result.success && result.data) {
      jobState.value.jobs = result.data
      jobState.value.pagination = {
        start: params?.start || 0,
        stop: params?.stop || 10,
        hasMore: result.data.length === (params?.stop || 10) - (params?.start || 0)
      }
    } else {
      jobState.value.error = result.error || 'Failed to fetch client jobs'
    }

    return result
  }

  const getAvailableJobs = async (params?: PaginationParams & JobFilters) => {
    const result = await jobsService.getAvailableJobs(params)

    if (result.success && result.data) {
      jobState.value.jobs = result.data
      jobState.value.pagination = {
        start: params?.start || 0,
        stop: params?.stop || 10,
        hasMore: result.data.length === (params?.stop || 10) - (params?.start || 0)
      }
    } else {
      jobState.value.error = result.error || 'Failed to fetch available jobs'
    }

    return result
  }

  const getAllJobs = async (params?: PaginationParams & JobFilters) => {
    const result = await jobsService.getAllJobs(params)

    if (result.success && result.data) {
      jobState.value.jobs = result.data
      jobState.value.pagination = {
        start: params?.start || 0,
        stop: params?.stop || 10,
        hasMore: result.data.length === (params?.stop || 10) - (params?.start || 0)
      }
    } else {
      jobState.value.error = result.error || 'Failed to fetch all jobs'
    }

    return result
  }

  const createJob = async (jobData: JobBase) => {
    const result = await jobsService.createJob(jobData)

    if (result.success && result.data) {
      // Add to beginning of jobs list
      jobState.value.jobs.unshift(result.data)
    } else {
      jobState.value.error = result.error || 'Failed to create job'
    }

    return result
  }

  const getJobById = async (jobId: string) => {
    const result = await jobsService.getJobById(jobId)

    if (result.success && result.data) {
      jobState.value.currentJob = result.data
    } else {
      jobState.value.error = result.error || 'Failed to fetch job'
    }

    return result
  }

  const updateJob = async (jobId: string, jobData: Partial<JobBase>) => {
    const result = await jobsService.updateJob(jobId, jobData)

    if (result.success && result.data) {
      // Update in jobs list
      const jobIndex = jobState.value.jobs.findIndex(job => job.id === jobId)
      if (jobIndex !== -1) {
        jobState.value.jobs[jobIndex] = result.data!
      }

      // Update current job if it's the same
      if (jobState.value.currentJob?.id === jobId) {
        jobState.value.currentJob = result.data!
      }
    } else {
      jobState.value.error = result.error || 'Failed to update job'
    }

    return result
  }

  const deleteJob = async (jobId: string) => {
    const result = await jobsService.deleteJob(jobId)

    if (result.success) {
      // Remove from jobs list
      jobState.value.jobs = jobState.value.jobs.filter(job => job.id !== jobId)

      // Clear current job if it's the deleted one
      if (jobState.value.currentJob?.id === jobId) {
        jobState.value.currentJob = null
      }
    } else {
      jobState.value.error = result.error || 'Failed to delete job'
    }

    return result
  }

  const searchJobs = async (filters: JobFilters, params?: PaginationParams) => {
    const result = await jobsService.searchJobs(filters, params)

    if (result.success && result.data) {
      jobState.value.jobs = result.data
    } else {
      jobState.value.error = result.error || 'Failed to search jobs'
    }

    return result
  }

  const loadMoreJobs = async (loadMoreFn: () => Promise<ServiceResponse<JobOut[]>>) => {
    if (!hasMore.value || loading.value) return

    const currentStart = jobState.value.pagination.start
    const currentStop = jobState.value.pagination.stop

    const result = await loadMoreFn()

    if (result.success && result.data) {
      jobState.value.pagination.start = currentStart + result.data.length
      jobState.value.pagination.hasMore = result.data.length === currentStop - currentStart
    }

    return result
  }

  const resetJobs = () => {
    jobState.value.jobs = []
    jobState.value.currentJob = null
    jobState.value.pagination = {
      start: 0,
      stop: 10,
      hasMore: true
    }
    jobState.value.error = null
  }

  const clearError = () => {
    jobState.value.error = null
  }

  // Initialize state on mount
  onMounted(() => {
    const currentState = jobsService.getJobState()
    jobState.value = currentState
  })

  return {
    // State
    jobs,
    currentJob,
    loading,
    error,
    hasMore,

    // Actions
    getClientJobs,
    getAvailableJobs,
    getAllJobs,
    createJob,
    getJobById,
    updateJob,
    deleteJob,
    searchJobs,
    loadMoreJobs,
    resetJobs,
    clearError
  }
}

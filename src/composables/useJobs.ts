// src/composables/useJobs.ts

import { ref, computed, onMounted } from 'vue'
import { jobsService } from '../services/jobsService'
import type { PaginationParams } from '../types/api'
import type {
  EJJobOut,
  Job,
  JobFilters,
  ServiceResponse
} from '../types/api'

// Define our job state interface
interface JobState {
  jobs: EJJobOut[];
  currentJob: EJJobOut | null;
  loading: boolean;
  error: string | null;
  pagination: {
    start: number;
    stop: number;
    hasMore: boolean;
  };
}

// Define job category type
type JobCategoryType = string;

// Initialize jobState with proper type casting
const jobState = ref<JobState>({
  jobs: [] as EJJobOut[], // Cast to match expected type
  currentJob: null,
  loading: false,
  error: null,
  pagination: {
    start: 0,
    stop: 10,
    hasMore: true
  }
});

// Helper to normalize job category from API response
function normalizeJobCategory(category: string): JobCategoryType {
  const lowerCategory = category.toLowerCase();
  const validCategories: JobCategoryType[] = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Content Writing',
    'Digital Marketing',
    'Data Analysis',
    'Other'
  ] as const;

  // Try to match with proper case first
  if (validCategories.includes(category as JobCategoryType)) {
    return category as JobCategoryType;
  }
  // Case-insensitive match
  const matched = validCategories.find(c => c.toLowerCase() === lowerCategory)
  return matched || 'Other'
}

// Define our local job type that extends EJJobOut with proper typing
interface LocalJobOut {
  id?: string | null;
  date_created?: number | null;
  last_updated?: number | null;
  admin_approved?: boolean;
  project_title: string;
  description: string;
  category: string;
  skills_needed: string;  // Changed to string to match API
  timeline: {
    start_date: number;
    deadline: number;
  };
  budget: number;
  status: string;
  client_id: string;
  hasMore?: boolean;
  requirement: string;
  break_down?: {
    Charges: number;
    Tax: number;
  };
}

// Helper to parse skills from string to string[]
function parseSkills(skills: string | string[] | undefined): string[] {
  if (!skills) return [];
  
  if (Array.isArray(skills)) {
    return skills.filter(skill => typeof skill === 'string');
  }
  
  if (typeof skills !== 'string') {
    return [];
  }
  
  try {
    const parsed = JSON.parse(skills);
    if (Array.isArray(parsed)) {
      return parsed.filter((s: any) => typeof s === 'string');
    }
  } catch (e) {
    // If not valid JSON, try splitting by comma
    return skills.split(',').map(s => s.trim()).filter(Boolean);
  }
  
  return [];
}

// Convert service job to our local job type
function toLocalJobOut(job: EJJobOut): LocalJobOut {
  // Convert skills array to comma-separated string for API compatibility
  const skillsString = Array.isArray(job.skills_needed) 
    ? job.skills_needed.join(', ')
    : (job.skills_needed || '');

  return {
    id: job.id || null,
    date_created: job.date_created || null,
    last_updated: job.last_updated || null,
    admin_approved: job.admin_approved || false,
    project_title: job.project_title || '',
    description: job.description || '',
    category: job.category as string,
    skills_needed: skillsString, // Now matches API's string type
    timeline: job.timeline || { start_date: 0, deadline: 0 },
    budget: job.budget || 0,
    status: job.status || 'draft',
    client_id: (job as any).client_id || '',
    requirement: (job as any).requirement || '',
    break_down: (job as any).break_down || { Charges: 0, Tax: 0 }
  };
}

// Computed properties for the UI
const jobs = computed<LocalJobOut[]>(() =>
  jobState.value.jobs.map(job => toLocalJobOut(job))
);
const currentJob = computed(() => jobState.value.currentJob ? toLocalJobOut(jobState.value.currentJob) : null);
const loading = computed(() => jobState.value.loading);
const error = computed(() => jobState.value.error);
const hasMore = computed(() => jobState.value.pagination.hasMore);

// Job actions
const getClientJobs = async (start: number = 0, stop: number = 10) => {
  jobState.value.loading = true;
  try {
    const response = await jobsService.listClientCreatedJobs(start, stop);
    if (response.success && response.data) {
      const jobsArray = Array.isArray(response.data) ? response.data : [response.data];
      jobState.value.jobs = jobsArray as unknown as EJJobOut[];
    }
    return response;
  } catch (err) {
    jobState.value.error = err instanceof Error ? err.message : 'Failed to fetch client jobs';
    return { success: false, error: jobState.value.error };
  } finally {
    jobState.value.loading = false;
  }
};

const getAvailableJobs = async (params: { start?: number; stop?: number } = {}) => {
  const { start = 0, stop = 10 } = params;
  jobState.value.loading = true;
  try {
    const response = await jobsService.listAvailableAgentJobs(start, stop);
    if (response.success && response.data) {
      jobState.value.jobs = Array.isArray(response.data) ? response.data as unknown as EJJobOut[] : [response.data as unknown as EJJobOut];
      jobState.value.pagination.hasMore = response.data.length > 0;
    }
    return response;
  } catch (err) {
    jobState.value.error = err instanceof Error ? err.message : 'Failed to fetch available jobs';
    return { success: false, error: jobState.value.error };
  } finally {
    jobState.value.loading = false;
  }
};

const getAllJobs = async (params: { start?: number; stop?: number } = {}) => {
  const { start = 0, stop = 10 } = params;
  jobState.value.loading = true;
  const role = localStorage.getItem('userRole') || '';

  try {
    let response: ServiceResponse<Job[]>
    if (role === 'admin') {
      response = await jobsService.listAdminJobs(start, stop);
    } else if (role === 'agent') {
      response = await jobsService.listAvailableAgentJobs(start, stop);
    } else {
      response = await jobsService.listClientCreatedJobs(start, stop);
    }

    if (response.success && response.data) {
      jobState.value.jobs = Array.isArray(response.data)
        ? (response.data as unknown as EJJobOut[])
        : [response.data as unknown as EJJobOut];
      jobState.value.pagination.hasMore = response.data.length > 0;
    }
    return response;
  } catch (err) {
    jobState.value.error = err instanceof Error ? err.message : 'Failed to fetch jobs';
    return { success: false, error: jobState.value.error };
  } finally {
    jobState.value.loading = false;
  }
};

const createJob = async (jobData: Omit<LocalJobOut, 'id'>) => {
  jobState.value.loading = true;
  try {
    const response = await jobsService.postNewJob(jobData as any);
    if (response.success && response.data) {
      jobState.value.jobs = [...jobState.value.jobs, response.data as unknown as EJJobOut];
    }
    return response;
  } catch (err) {
    jobState.value.error = err instanceof Error ? err.message : 'Failed to create job';
    return { success: false, error: jobState.value.error };
  } finally {
    jobState.value.loading = false;
  }
};

const getJobById = async (id: string) => {
  jobState.value.loading = true;
  try {
    const response = await jobsService.getJobById(id);
    if (response.success && response.data) {
      jobState.value.currentJob = response.data as unknown as EJJobOut;
    }
    return response;
  } catch (err) {
    jobState.value.error = err instanceof Error ? err.message : 'Failed to fetch job';
    return { success: false, error: jobState.value.error };
  } finally {
    jobState.value.loading = false;
  }
};

const updateJob = async (id: string, updates: Partial<LocalJobOut>) => {
  jobState.value.loading = true;
  try {
    const response = await jobsService.updateJob(id, updates as any);
    if (response.success && response.data) {
      jobState.value.jobs = jobState.value.jobs.map(job =>
        job.id === id ? { ...job, ...response.data as unknown as EJJobOut } : job
      );
    }
    return response;
  } catch (err) {
    jobState.value.error = err instanceof Error ? err.message : 'Failed to update job';
    return { success: false, error: jobState.value.error };
  } finally {
    jobState.value.loading = false;
  }
};

const deleteJob = async (id: string) => {
  jobState.value.loading = true;
  try {
    const response = await jobsService.deleteJob(id);
    if (response.success) {
      jobState.value.jobs = jobState.value.jobs.filter(job => job.id !== id);
    }
    return response;
  } catch (err) {
    jobState.value.error = err instanceof Error ? err.message : 'Failed to delete job';
    return { success: false, error: jobState.value.error };
  } finally {
    jobState.value.loading = false;
  }
};

const searchJobs = async (query: string, filters: JobFilters = {}) => {
  jobState.value.loading = true;
  try {
    // Use availableJobs endpoint with search parameters
    const response = await jobsService.listAvailableAgentJobs(0, 10);
    if (response.success && response.data) {
      jobState.value.jobs = Array.isArray(response.data) ? response.data as unknown as EJJobOut[] : [response.data as unknown as EJJobOut];
    }
    return response;
  } catch (err) {
    jobState.value.error = err instanceof Error ? err.message : 'Failed to search jobs';
    return { success: false, error: jobState.value.error };
  } finally {
    jobState.value.loading = false;
  }
};

const loadMoreJobs = async (): Promise<LocalJobOut[]> => {
  if (jobState.value.loading || !jobState.value.pagination.hasMore) {
    return [];
  }

  try {
    jobState.value.loading = true;
    const nextStart = jobState.value.pagination.stop;
    const nextStop = nextStart + 10; // Load 10 more items

    const result = await jobsService.listAvailableAgentJobs(nextStart, nextStop);

    if (result.success && result.data) {
      const serviceJobs = Array.isArray(result.data) ? result.data as unknown as EJJobOut[] : [result.data as unknown as EJJobOut];
      const newJobs = serviceJobs.map(toLocalJobOut);

      jobState.value.jobs = [...jobState.value.jobs, ...serviceJobs];
      jobState.value.pagination = {
        start: nextStart,
        stop: nextStop,
        hasMore: serviceJobs.length > 0
      };

      return newJobs;
    }
    return [];
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load more jobs';
    jobState.value.error = errorMessage;
    return [];
  } finally {
    jobState.value.loading = false;
  }
};

const resetJobs = () => {
  jobState.value = {
    jobs: [],
    currentJob: null,
    loading: false,
    error: null,
    pagination: {
      start: 0,
      stop: 10,
      hasMore: true
    }
  };
};

const clearError = () => {
  jobState.value.error = null;
};

// Export the composable function
export function useJobs() {
  onMounted(() => {
    if (jobState.value.jobs.length === 0) {
      resetJobs();
    }
  });

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
  };
}

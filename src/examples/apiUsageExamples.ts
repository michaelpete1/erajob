  // src/examples/apiUsageExamples.ts
// This file demonstrates the proper way to use the API functions and handle state

import { ref, onMounted, reactive, onUnmounted } from 'vue'
import { useApi, usePagination } from '../composables/useApi'
import type { UserBase, UserLogin, JobsBase } from '../services'

// ========================================
// 1. AUTHENTICATION EXAMPLES
// ========================================

export function useAuthExample() {
  const { auth, authState } = useApi()
  
  // Form data
  const signupForm = ref<UserBase>({
    email: '',
    password: '',
    role: 'client'
  })

  const loginForm = ref<UserLogin>({
    email: '',
    password: ''
  })

  // Signup handler
  const handleSignup = async () => {
    const { result, state } = await auth.signup(signupForm.value)
    
    if (result) {
      console.log('Signup successful:', result)
      // Navigation is handled automatically
    } else {
      console.error('Signup failed:', state.error)
    }
  }

  // Login handler
  const handleLogin = async (role: 'client' | 'agent' = 'client') => {
    const { result, state } = await auth.login(loginForm.value, role)
    
    if (result) {
      console.log('Login successful:', result)
      // Navigation is handled automatically
    } else {
      console.error('Login failed:', state.error)
    }
  }

  // Logout handler
  const handleLogout = async () => {
    await auth.logout()
    console.log('Logged out successfully')
  }

  return {
    signupForm,
    loginForm,
    handleSignup,
    handleLogin,
    handleLogout,
    authState
  }
}

// ========================================
// 2. JOB MANAGEMENT EXAMPLES
// ========================================

export function useJobManagementExample() {
  const { jobs } = useApi()
  
  // Job creation form
  const jobForm = ref<JobsBase>({
    project_title: '',
    primary_area_of_expertise: 'Web Development',
    budget: 1000,
    description: '',
    timeline: {
      start_date: Date.now(),
      deadline: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days from now
    }
  })

  // Create a new job
  const createNewJob = async () => {
    const { result, state } = await jobs.createJob(jobForm.value)
    
    if (result) {
      console.log('Job created successfully:', result)
      // Reset form
      jobForm.value = {
        project_title: '',
        primary_area_of_expertise: 'Web Development',
        budget: 1000,
        description: '',
        timeline: {
          start_date: Date.now(),
          deadline: Date.now() + (30 * 24 * 60 * 60 * 1000)
        }
      }
    } else {
      console.error('Job creation failed:', state.error)
    }
  }

  // Get job details
  const fetchJobDetails = async (jobId: string) => {
    const { result, state } = await jobs.getJob(jobId)
    
    if (result) {
      console.log('Job details:', result)
      return result
    } else {
      console.error('Failed to fetch job details:', state.error)
      return null
    }
  }

  return {
    jobForm,
    createNewJob,
    fetchJobDetails
  }
}

// ========================================
// 3. PAGINATION EXAMPLES
// ========================================

export function useJobListExample() {
  const { jobs } = useApi()
  
  // Use the pagination composable
  const {
    items: jobsList,
    loading,
    error,
    currentPage,
    pageSize,
    hasMore,
    fetchPage,
    loadMore,
    refresh
  } = usePagination((start, stop) => jobs.listJobs(start, stop, 'client'))

  // Load first page on component mount
  onMounted(() => {
    fetchPage(1)
  })

  return {
    jobsList,
    loading,
    error,
    currentPage,
    pageSize,
    hasMore,
    fetchPage,
    loadMore,
    refresh
  }
}

// ========================================
// 4. VUE COMPONENT INTEGRATION EXAMPLES
// ========================================

// Example: SignUp Component
export function useSignUpComponent() {
  const { auth } = useApi()
  
  const form = ref<UserBase>({
    email: '',
    password: '',
    role: 'client'
  })

  const loading = ref(false)
  const error = ref<string | null>(null)

  const onSubmit = async () => {
    loading.value = true
    error.value = null

    try {
      const { result, state } = await auth.signup(form.value)
      
      if (result) {
        console.log('Signup successful')
        // Navigation is handled automatically
      } else {
        error.value = state.error || 'Signup failed'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
    } finally {
      loading.value = false
    }
  }

  return {
    form,
    loading,
    error,
    onSubmit
  }
}

// Example: JobList Component
export function useJobListComponent() {
  const { jobs } = useApi()
  
  const jobsList = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0
  })

  const fetchJobs = async (page: number = 1) => {
    loading.value = true
    error.value = null

    try {
      const start = (page - 1) * pagination.value.limit
      const stop = start + pagination.value.limit
      
      const { result, state } = await jobs.listJobs(start, stop, 'client')
      
      if (result) {
        jobsList.value = result
        pagination.value.page = page
      } else {
        error.value = state.error || 'Failed to fetch jobs'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
    } finally {
      loading.value = false
    }
  }

  const loadMore = async () => {
    await fetchJobs(pagination.value.page + 1)
  }

  // Load initial data
  onMounted(() => {
    fetchJobs(1)
  })

  return {
    jobsList,
    loading,
    error,
    pagination,
    fetchJobs,
    loadMore
  }
}

// ========================================
// 5. ERROR HANDLING EXAMPLES
// ========================================

export function useErrorHandlingExample() {
  const { auth } = useApi()
  
  const handleError = (error: any, context: string) => {
    console.error(`Error in ${context}:`, error)
    
    // You can send errors to a monitoring service
    // monitorError(error, context)
    
    // Show user-friendly error message
    let userMessage = 'An unexpected error occurred'
    
    if (error.message) {
      userMessage = error.message
    } else if (typeof error === 'string') {
      userMessage = error
    }
    
    // You can show this message in a toast/notification
    // showToast(userMessage, 'error')
    
    return userMessage
  }

  const safeApiCall = async () => {
    try {
      const { result, state } = await auth.getCurrentUser()
      
      if (result) {
        return result
      } else {
        throw new Error(state.error || 'Failed to get user')
      }
    } catch (error) {
      const userMessage = handleError(error, 'get current user')
      throw new Error(userMessage)
    }
  }

  return {
    handleError,
    safeApiCall
  }
}

// ========================================
// 6. STATE MANAGEMENT EXAMPLES
// ========================================

export function useGlobalStateExample() {
  // This shows how to manage global state across components
  const globalState = reactive({
    user: null as any,
    jobs: [] as any[],
    notifications: [] as any[]
  })

  const updateUser = (userData: any) => {
    globalState.user = userData
  }

  const addJob = (jobData: any) => {
    globalState.jobs.push(jobData)
  }

  const addNotification = (notification: any) => {
    globalState.notifications.unshift(notification)
    
    // Keep only last 50 notifications
    if (globalState.notifications.length > 50) {
      globalState.notifications = globalState.notifications.slice(0, 50)
    }
  }

  return {
    globalState,
    updateUser,
    addJob,
    addNotification
  }
}

// ========================================
// 7. REAL-TIME DATA EXAMPLES
// ========================================

export function useRealTimeDataExample() {
  const { jobs } = useApi()
  
  const realTimeJobs = ref<any[]>([])
  const isOnline = ref(navigator.onLine)

  // Simulate real-time updates
  const startRealTimeUpdates = () => {
    // In a real app, you would use WebSockets or Server-Sent Events
    const interval = setInterval(async () => {
      if (isOnline.value) {
        const { result } = await jobs.listJobs(0, 5, 'client')
        if (result) {
          realTimeJobs.value = result
        }
      }
    }, 30000) // Update every 30 seconds

    // Cleanup on component unmount
    onUnmounted(() => {
      clearInterval(interval)
    })
  }

  // Handle online/offline status
  const handleOnlineStatus = () => {
    isOnline.value = navigator.onLine
    
    if (isOnline.value) {
      // Refresh data when coming back online
      startRealTimeUpdates()
    }
  }

  onMounted(() => {
    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)
    startRealTimeUpdates()
  })

  onUnmounted(() => {
    window.removeEventListener('online', handleOnlineStatus)
    window.removeEventListener('offline', handleOnlineStatus)
  })

  return {
    realTimeJobs,
    isOnline,
    startRealTimeUpdates
  }
}

// ========================================
// 8. PERFORMANCE OPTIMIZATION EXAMPLES
// ========================================

export function usePerformanceExample() {
  const { jobs } = useApi()
  
  // Cache for API responses
  const cache = new Map<string, { data: any; timestamp: number }>()
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  const cachedApiCall = async (key: string, apiCall: () => Promise<any>) => {
    const now = Date.now()
    const cached = cache.get(key)

    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      return cached.data
    }

    const result = await apiCall()
    cache.set(key, { data: result, timestamp: now })
    return result
  }

  const getJobsWithCache = async (start: number, stop: number) => {
    const key = `jobs-${start}-${stop}`
    return cachedApiCall(key, async () => {
      const response = await jobs.listJobs(start, stop, 'client')
      const { result } = response
      return result
    })
  }

  // Debounced search
  const searchJobs = async (query: string) => {
    // Implement debounced search logic
    // This would typically call a search endpoint
    console.log('Searching for:', query)
  }

  return {
    getJobsWithCache,
    searchJobs
  }
}

// src/composables/useApi.ts
// Fixed TypeScript imports - using type-only imports for types
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  api, 
  ApiError,
  handleApiResponse 
} from '../services/apiService'
import type {
  UserBase,
  UserLogin,
  JobsBase,
  UserOut,
  JobsOut,
  ServiceResponse
} from '../services/apiService'

// Types for state management
export interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export interface AuthState {
  user: UserOut | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

// Main API composable
export function useApi() {
  const router = useRouter()
  
  // Reactive state
  const authState = reactive<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  })

  // Generic state for API calls
  const createState = <T>() => reactive<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  // Utility function for API calls with loading states
  const callApi = async <T>(
    state: ApiState<T>,
    apiCall: () => Promise<ServiceResponse<T>>,
    errorMessage: string = 'API call failed'
  ): Promise<T | null> => {
    try {
      state.loading = true
      state.error = null
      const response = await apiCall()
      const result = handleApiResponse(response)
      state.data = result
      return result
    } catch (error) {
      const message = error instanceof ApiError ? error.message : errorMessage
      state.error = message
      console.error('API Error:', error)
      return null
    } finally {
      state.loading = false
    }
  }

  // Authentication methods
  const auth = {
    // User signup
    signup: async (userData: UserBase) => {
      const state = createState<UserOut>()
      const result = await callApi(state, () =>
        api.user.signup(userData)
      )

      if (result) {
        authState.user = result
        authState.isAuthenticated = true
        api.auth.storeAuthData(result)
        
        // Navigate based on role
        if (userData.role === 'agent') {
          await router.push('/agent/welcome')
        } else {
          await router.push('/client/welcome')
        }
      }

      return { result, state }
    },

    // User login
    login: async (credentials: UserLogin, role: 'client' | 'agent' = 'client') => {
      const state = createState<UserOut>()

      // Choose the appropriate login endpoint based on role
      const loginApi = role === 'agent' ? api.agent.login : api.client.login
      const result = await callApi(state, () =>
        loginApi(credentials)
      )

      if (result) {
        authState.user = result
        authState.isAuthenticated = true
        api.auth.storeAuthData(result)
        
        // Navigate based on role
        if (role === 'agent') {
          await router.push('/agent/explore-gigs')
        } else {
          await router.push('/client/projects')
        }
      }

      return { result, state }
    },

    // Refresh token
    refreshToken: async () => {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const state = createState<UserOut>()
      const result = await callApi(state, () =>
        api.user.refreshToken({ refresh_token: refreshToken })
      )

      if (result) {
        authState.user = result
        authState.isAuthenticated = true
        api.auth.storeAuthData(result)
      }

      return { result, state }
    },

    // Logout
    logout: async () => {
      authState.user = null
      authState.isAuthenticated = false
      authState.loading = false
      authState.error = null
      
      api.auth.clearAuthData()
      await router.push('/sign-in')
    },

    // Check authentication status
    checkAuth: () => {
      const token = localStorage.getItem('erajob_auth_token')
      authState.isAuthenticated = !!token
      authState.loading = false
      
      if (!token) {
        authState.user = null
      }
    },

    // Get current user profile
    getCurrentUser: async () => {
      const state = createState<UserOut>()
      const result = await callApi(state, () =>
        api.user.getCurrentUser()
      )

      if (result) {
        authState.user = result
      }

      return { result, state }
    },

    // Update client profile
    updateClientProfile: async (clientData: any) => {
      const state = createState<UserOut>()
      const result = await callApi(state, () =>
        api.client.updateProfile(clientData)
      )

      if (result) {
        authState.user = result
      }

      return { result, state }
    },

    // Update agent profile
    updateAgentProfile: async (agentData: any) => {
      const state = createState<UserOut>()
      const result = await callApi(state, () =>
        api.agent.updateProfile(agentData)
      )

      if (result) {
        authState.user = result
      }

      return { result, state }
    }
  }

  // Jobs management
  const jobs = {
    // Create new job
    createJob: async (jobData: JobsBase) => {
      const state = createState<JobsOut>()
      const result = await callApi(state, () =>
        api.jobs.createJob(jobData)
      )
      return { result, state }
    },

    // Get job by ID
    getJob: async (id: string) => {
      const state = createState<JobsOut>()
      const result = await callApi(state, () =>
        api.jobs.getJob(id)
      )
      return { result, state }
    },

    // Get my jobs (admin)
    getMyJobs: async () => {
      const state = createState<JobsOut>()
      const result = await callApi(state, () =>
        api.jobs.getMyJobs()
      )
      return { result, state }
    },

    // List jobs with pagination
    listJobs: async (start: number, stop: number, type: 'admin' | 'client' | 'agent' = 'admin') => {
      const state = createState<JobsOut[]>()

      let apiCall
      switch (type) {
        case 'admin':
          apiCall = () => api.jobs.listAdminJobs(start, stop)
          break
        case 'client':
          apiCall = () => api.jobs.listClientJobs(start, stop)
          break
        case 'agent':
          apiCall = () => api.jobs.listAgentAvailableJobs(start, stop)
          break
        default:
          apiCall = () => api.jobs.listAdminJobs(start, stop)
      }

      const result = await callApi(state, apiCall)
      return { result, state }
    }
  }

  // User management
  const users = {
    // List users with pagination
    listUsers: async (start: number, stop: number) => {
      const state = createState<UserOut[]>()
      const result = await callApi(state, () =>
        api.user.listUsers(start, stop)
      )
      return { result, state }
    },

    // Delete user account
    deleteAccount: async () => {
      const state = createState<null>()
      const result = await callApi(state, () =>
        api.user.deleteAccount()
      )

      if (result !== null) {
        await auth.logout()
      }

      return { result, state }
    }
  }

  // Health check
  const health = {
    check: async () => {
      const state = createState<null>()
      const result = await callApi(state, () =>
        api.health.check()
      )
      return { result, state }
    }
  }

  // Initialize authentication state
  const initializeAuth = () => {
    auth.checkAuth()
  }

  return {
    // State
    authState,
    
    // Methods
    auth,
    jobs,
    users,
    health,
    createState,
    callApi,
    initializeAuth,
    
    // Computed properties
    isAuthenticated: computed(() => authState.isAuthenticated),
    currentUser: computed(() => authState.user),
    userRole: computed(() => authState.user?.role || null),
    isLoading: computed(() => authState.loading)
  }
}

// Type-safe composable for specific API endpoints
export function useJobApi() {
  const { jobs } = useApi()
  return jobs
}

export function useUserApi() {
  const { auth, users } = useApi()
  return { auth, users }
}

export function useAuth() {
  const { auth, authState, initializeAuth } = useApi()
  
  // Initialize on composable creation
  if (typeof window !== 'undefined') {
    initializeAuth()
  }

  return {
    ...auth,
    authState,
    isAuthenticated: computed(() => authState.isAuthenticated),
    currentUser: computed(() => authState.user),
    userRole: computed(() => {
      const role = authState.user?.role
      if (typeof role === 'string') return role
      if (typeof role === 'object' && role !== null) {
        return role.type || role.role || 'unknown'
      }
      return null
    })
  }
}

// Pagination helper
export function usePagination<T>(fetchFunction: (start: number, stop: number) => Promise<{ result: T[] | null, state: any }>) {
  const items = ref<T[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const hasMore = ref(true)

  const fetchPage = async (page: number = currentPage.value) => {
    if (loading.value || !hasMore.value) return

    loading.value = true
    error.value = null

    try {
      const start = (page - 1) * pageSize.value
      const stop = start + pageSize.value
      
      const { result } = await fetchFunction(start, stop)
      
      if (result) {
        if (result.length < pageSize.value) {
          hasMore.value = false
        }
        
        if (page === 1) {
          items.value = result as T[]
        } else {
          // Use type assertion to work around Vue's reactivity typing
          const currentItems = items.value as T[]
          const newItems = result as T[]
          items.value = [...currentItems, ...newItems] as any
        }
        
        currentPage.value = page
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch items'
    } finally {
      loading.value = false
    }
  }

  const loadMore = () => {
    if (hasMore.value && !loading.value) {
      fetchPage(currentPage.value + 1)
    }
  }

  const refresh = () => {
    items.value = []
    hasMore.value = true
    currentPage.value = 1
    fetchPage(1)
  }

  return {
    items,
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

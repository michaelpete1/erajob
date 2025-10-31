# API Integration Guide for EraJob Application

This guide provides comprehensive instructions on how to properly use the
 generated API functions and handle state in your Vue.js application.

## 📋 Table of Contents

1. [API Service Structure](#-api-service-structure)
2. [Authentication Flow](#-authentication-flow)
3. [Job Management](#-job-management)
4. [State Management](#-state-management)
5. [Error Handling](#-error-handling-overview)
6. [Performance Optimization](#-performance-optimization)
7. [Best Practices](#-best-practices)
8. [Examples](#-examples)
9. [Getting Started](#-getting-started)

## 🔧 API Service Structure

### Core Files

- **`src/services/api.ts`** - Base HTTP client with interceptors
- **`src/services/apiService.ts`** - All API endpoint functions
- **`src/composables/useApi.ts`** - Vue composables for state management
- **`src/examples/apiUsageExamples.ts`** - Usage examples

### Key Components

#### 1. API Client (`api.ts`)

```typescript
import { apiClient } from './api'

// Automatic token management
// Request/response interceptors
// Error handling
```

#### 2. API Service (`apiService.ts`)

```typescript
import { api, userApi, agentApi, clientApi, jobsApi } from './services/apiService'

// Type-safe API calls
// Authentication management
// Response handling
```

#### 3. Vue Composables (`useApi.ts`)

```typescript
import { useApi, useAuth, useJobApi } from './composables/useApi'

// Reactive state management
// Loading states
// Error handling
```

## 🔐 Authentication Flow

### 1. User Signup

```vue
<template>
  <form @submit.prevent="handleSignup">
    <input v-model="form.email" type="email" placeholder="Email" />
    <input v-model="form.password" type="password" placeholder="Password" />
    <select v-model="form.role">
      <option value="client">Client</option>
      <option value="agent">Agent</option>
    </select>
    <button type="submit" :disabled="loading">
      {{ loading ? 'Signing up...' : 'Sign Up' }}
    </button>
    <div v-if="error" class="error">{{ error }}</div>
  </form>
</template>

<script setup lang="ts">
import { useSignUpComponent } from '../examples/apiUsageExamples'

const { form, loading, error, onSubmit } = useSignUpComponent()
</script>
```

### 2. User Login

```vue
<template>
  <form @submit.prevent="handleLogin">
    <input v-model="credentials.email" type="email" placeholder="Email" />
    <input v-model="credentials.password" type="password"
           placeholder="Password" />
    <div class="role-selection">
      <button 
        type="button"
        @click="selectedRole = 'client'"
        :class="{ active: selectedRole === 'client' }"
      >
        Client
      </button>
      <button 
        type="button"
        @click="selectedRole = 'agent'"
        :class="{ active: selectedRole === 'agent' }"
      >
        Agent
      </button>
    </div>
    <button type="submit" :disabled="loading">
      {{ loading ? 'Signing in...' : 'Sign In' }}
    </button>
    <div v-if="error" class="error">{{ error }}</div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useApi } from '../composables/useApi'

const { auth } = useApi()
const selectedRole = ref<'client' | 'agent'>('client')
const credentials = ref({ email: '', password: '' })
const loading = ref(false)
const error = ref<string | null>(null)

const handleLogin = async () => {
  loading.value = true
  error.value = null

  try {
    const { result, state } = await auth.login(credentials.value, selectedRole.value)
    
    if (result) {
      console.log('Login successful')
      // Navigation is handled automatically
    } else {
      error.value = state.error || 'Login failed'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script>
```

### 3. Authentication State Management

```vue
<template>
  <div v-if="authState.loading">Loading...</div>
  <div v-else-if="authState.isAuthenticated">
    <p>Welcome, {{ currentUser?.email }}</p>
    <p>Role: {{ userRole }}</p>
    <button @click="handleLogout">Logout</button>
  </div>
  <div v-else>
    <p>Please sign in</p>
    <router-link to="/sign-in">Sign In</router-link>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useApi'

const { authState, currentUser, userRole, logout: handleLogout } = useAuth()
</script>
```

## 💼 Job Management

### 1. Create a New Job

```vue
<template>
  <form @submit.prevent="handleCreateJob">
    <input v-model="jobForm.project_title" placeholder="Project Title" />
    <select v-model="jobForm.category">
      <option value="Web Development">Web Development</option>
      <option value="Mobile Development">Mobile Development</option>
      <option value="UI/UX Design">UI/UX Design</option>
    </select>
    <input v-model.number="jobForm.budget" type="number" placeholder="Budget" />
    <textarea v-model="jobForm.description" placeholder="Description"></textarea>
    <textarea v-model="jobForm.requirement" placeholder="Requirements"></textarea>
    <select v-model="jobForm.skills_needed">
      <option value="Web Development">Web Development</option>
      <option value="Mobile Development">Mobile Development</option>
    </select>
    <div>
      <label>Start Date:</label>
      <input v-model.number="jobForm.timeline.start_date" type="number" />
    </div>
    <div>
      <label>Deadline:</label>
      <input v-model.number="jobForm.timeline.deadline" type="number" />
    </div>
    <button type="submit" :disabled="loading">
      {{ loading ? 'Creating...' : 'Create Job' }}
    </button>
    <div v-if="error" class="error">{{ error }}</div>
  </form>
</template>

<script setup lang="ts">
import { useJobManagementExample } from '../examples/apiUsageExamples'

const { jobForm, createNewJob } = useJobManagementExample()
</script>
```

### 2. List Jobs with Pagination

```vue
<template>
  <div class="job-list">
    <div v-if="loading" class="loading">Loading jobs...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div v-for="job in jobsList" :key="job.id" class="job-card">
        <h3>{{ job.project_title }}</h3>
        <p>Category: {{ job.category }}</p>
        <p>Budget: ${{ job.budget }}</p>
        <p>{{ job.description }}</p>
      </div>
      
      <div v-if="hasMore" class="load-more">
        <button @click="loadMore" :disabled="loading">
          {{ loading ? 'Loading...' : 'Load More' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useJobListExample } from '../examples/apiUsageExamples'

const {
  jobsList,
  loading,
  error,
  hasMore,
  loadMore
} = useJobListExample()
</script>
```

## 🔄 State Management

### 1. Using the useApi Composable

```typescript
import { useApi } from '../composables/useApi'

const { auth, jobs, users, authState } = useApi()

// Access reactive state
console.log(authState.isAuthenticated)
console.log(authState.user)

// Make API calls
const handleUserAction = async () => {
  const { result, state } = await auth.getCurrentUser()
  
  if (result) {
    // Success
    console.log('User data:', result)
  } else {
    // Error
    console.error('Error:', state.error)
  }
}
```

### 2. Custom State Management

```typescript
import { reactive, computed } from 'vue'

interface AppState {
  user: any | null
  jobs: any[]
  notifications: any[]
  loading: boolean
  error: string | null
}

const state = reactive<AppState>({
  user: null,
  jobs: [],
  notifications: [],
  loading: false,
  error: null
})

const getters = {
  isAuthenticated: computed(() => !!state.user),
  userRole: computed(() => state.user?.role || null),
  activeJobs: computed(() => state.jobs.filter(job => job.status === 'active'))
}

const actions = {
  setUser(userData: any) {
    state.user = userData
  },
  
  addJob(jobData: any) {
    state.jobs.push(jobData)
  },
  
  setLoading(loading: boolean) {
    state.loading = loading
  },
  
  setError(error: string | null) {
    state.error = error
  }
}

export { state, getters, actions }
```

## ⚠️ Error Handling Overview

### 1. Global Error Handler

```typescript
import { ApiError } from '../services/apiService'

export const handleApiError = (error: any, context: string) => {
  console.error(`API Error in ${context}:`, error)
  
  let userMessage = 'An unexpected error occurred'
  
  if (error instanceof ApiError) {
    userMessage = error.message
    // You can access error.statusCode and error.data if needed
  } else if (error instanceof Error) {
    userMessage = error.message
  }
  
  // Show user-friendly message
  // showToast(userMessage, 'error')
  
  // Log to monitoring service
  // logErrorToService(error, context)
  
  return userMessage
}
```

### 2. Component-Level Error Handling

```vue
<template>
  <div>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="retry">Retry</button>
    </div>
    <div v-else>
      <!-- Your content here -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useApi } from '../composables/useApi'

const { jobs } = useApi()
const loading = ref(false)
const error = ref<string | null>(null)

const fetchData = async () => {
  loading.value = true
  error.value = null

  try {
    const { result, state } = await jobs.listJobs(0, 10, 'client')
    
    if (result) {
      // Handle success
      console.log('Jobs loaded:', result)
    } else {
      error.value = state.error || 'Failed to load jobs'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
  } finally {
    loading.value = false
  }
}

const retry = () => {
  fetchData()
}

// Load data on mount
fetchData()
</script>
```

## ⚡ Performance Optimization

### 1. API Response Caching

```typescript
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

const cachedApiCall = async <T>(
  key: string,
  apiCall: () => Promise<T>
): Promise<T> => {
  const now = Date.now()
  const cached = cache.get(key)

  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.data
  }

  const result = await apiCall()
  cache.set(key, { data: result, timestamp: now })
  return result
}

// Usage
const getJobs = async () => {
  return cachedApiCall('jobs-0-10', () => 
    jobs.listJobs(0, 10, 'client')
  )
}
```

### 2. Debounced Search

```typescript
import { ref, watch } from 'vue'

export function useDebouncedSearch() {
  const searchQuery = ref('')
  const debouncedQuery = ref('')
  let timeoutId: number

  watch(searchQuery, (newValue) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      debouncedQuery.value = newValue
    }, 300) // 300ms debounce
  })

  return {
    searchQuery,
    debouncedQuery
  }
}
```

### 3. Lazy Loading

```vue
<template>
  <div>
    <div v-for="job in visibleJobs" :key="job.id" class="job-card">
      <!-- Job content -->
    </div>
    
    <div ref="loadMoreTrigger" class="load-more-trigger">
      <div v-if="loadingMore" class="loading">Loading more...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useApi } from '../composables/useApi'

const { jobs } = useApi()
const visibleJobs = ref<any[]>([])
const loadingMore = ref(false)
const currentPage = ref(1)
const loadMoreTrigger = ref<HTMLElement>()

const loadMoreJobs = async () => {
  if (loadingMore.value) return
  
  loadingMore.value = true
  try {
    const start = (currentPage.value - 1) * 10
    const { result } = await jobs.listJobs(start, start + 10, 'client')
    
    if (result) {
      visibleJobs.value.push(...result)
      currentPage.value++
    }
  } finally {
    loadingMore.value = false
  }
}

// Intersection Observer for infinite scroll
let observer: IntersectionObserver

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadMoreJobs()
    }
  }, { threshold: 0.1 })

  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>
```

## 📋 Best Practices

### 1. API Call Patterns

```typescript
// ✅ Good: Use composables for state management
const { auth } = useApi()
const { result, state } = await auth.login(credentials)

// ❌ Bad: Direct API calls without state management
import { userApi } from '../services/apiService'
const response = await userApi.login(credentials)
```

### 2. Error Handling

```typescript
// ✅ Good: Comprehensive error handling
try {
  const { result, state } = await auth.login(credentials)
  if (result) {
    // Handle success
  } else {
    // Handle API error
    console.error(state.error)
  }
} catch (error) {
  // Handle network/unknown errors
  console.error('Network error:', error)
}

// ❌ Bad: No error handling
const { result } = await auth.login(credentials)
console.log(result) // Might be null
```

### 3. Loading States

```typescript
// ✅ Good: Show loading states
const loading = ref(false)
const error = ref<string | null>(null)

const fetchData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const { result, state } = await jobs.listJobs(0, 10)
    if (result) {
      // Handle success
    } else {
      error.value = state.error
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// ❌ Bad: No loading feedback
await jobs.listJobs(0, 10) // User doesn't know what's happening
```

### 4. TypeScript Usage

```typescript
// ✅ Good: Use proper TypeScript types
import type { UserLogin, JobsBase } from '../services/apiService'

const loginForm: UserLogin = {
  email: 'user@example.com',
  password: 'password123'
}

const jobForm: JobsBase = {
  project_title: 'New Project',
  category: 'Web Development',
  budget: 1000,
  description: 'Project description',
  requirement: 'Project requirements',
  skills_needed: 'Web Development',
  timeline: {
    start_date: Date.now(),
    deadline: Date.now() + 86400000
  }
}

// ❌ Bad: No type safety
const form = {
  email: 'user@example.com',
  password: 'password123'
  // No type checking
}
```

## 📚 Examples

### Complete Component Example

```vue
<template>
  <div class="job-management">
    <!-- Create Job Form -->
    <div class="create-job">
      <h2>Create New Job</h2>
      <form @submit.prevent="handleCreateJob">
        <input v-model="jobForm.project_title" placeholder="Project Title"
               required />
        <select v-model="jobForm.category" required>
          <option value="">Select Category</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        <input v-model.number="jobForm.budget" type="number"
               placeholder="Budget" required />
        <textarea v-model="jobForm.description" placeholder="Description" required></textarea>
        <textarea v-model="jobForm.requirement" placeholder="Requirements" required></textarea>
        <select v-model="jobForm.skills_needed" required>
          <option value="">Select Skill</option>
          <option v-for="skill in skills" :key="skill" :value="skill">
            {{ skill }}
          </option>
        </select>
        <div class="timeline">
          <div>
            <label>Start Date:</label>
            <input v-model.number="jobForm.timeline.start_date" type="number"
                   required />
          </div>
          <div>
            <label>Deadline:</label>
            <input v-model.number="jobForm.timeline.deadline" type="number"
                   required />
          </div>
        </div>
        <button type="submit" :disabled="createLoading">
          {{ createLoading ? 'Creating...' : 'Create Job' }}
        </button>
      </form>
      <div v-if="createError" class="error">{{ createError }}</div>
    </div>

    <!-- Job List -->
    <div class="job-list">
      <h2>My Jobs</h2>
      <div v-if="listLoading" class="loading">Loading jobs...</div>
      <div v-else-if="listError" class="error">
        <p>{{ listError }}</p>
        <button @click="fetchJobs">Retry</button>
      </div>
      <div v-else-if="jobs.length === 0" class="empty-state">
        <p>No jobs found. Create your first job above!</p>
      </div>
      <div v-else>
        <div v-for="job in jobs" :key="job.id" class="job-card">
          <h3>{{ job.project_title }}</h3>
          <p><strong>Category:</strong> {{ job.category }}</p>
          <p><strong>Budget:</strong> ${{ job.budget }}</p>
          <p><strong>Description:</strong> {{ job.description }}</p>
          <p><strong>Requirements:</strong> {{ job.requirement }}</p>
          <p><strong>Skills Needed:</strong> {{ job.skills_needed }}</p>
          <p><strong>Timeline:</strong>
             {{ formatDate(job.timeline.start_date) }} -
             {{ formatDate(job.timeline.deadline) }}</p>
          <div class="job-actions">
            <button @click="viewJob(job.id)">View Details</button>
            <button @click="editJob(job)">Edit</button>
          </div>
        </div>
        
        <div v-if="hasMore" class="load-more">
          <button @click="loadMore" :disabled="loadingMore">
            {{ loadingMore ? 'Loading more...' : 'Load More' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '../composables/useApi'
import type { JobsBase } from '../services/apiService'

const { jobs } = useApi()

// Form data
const jobForm = ref<JobsBase>({
  project_title: '',
  category: 'Web Development',
  budget: 1000,
  description: '',
  requirement: '',
  skills_needed: 'Web Development',
  timeline: {
    start_date: Date.now(),
    deadline: Date.now() + (30 * 24 * 60 * 60 * 1000)
  }
})

// State
const jobs = ref<any[]>([])
const createLoading = ref(false)
const createError = ref<string | null>(null)
const listLoading = ref(false)
const listError = ref<string | null>(null)
const loadingMore = ref(false)
const currentPage = ref(1)
const hasMore = ref(true)

// Options
const categories = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Content Writing',
  'Digital Marketing',
  'Data Analysis',
  'Other'
]

const skills = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Content Writing',
  'Digital Marketing',
  'Data Analysis',
  'Other'
]

// Methods
const handleCreateJob = async () => {
  createLoading.value = true
  createError.value = null

  try {
    const { result, state } = await jobs.createJob(jobForm.value)
    
    if (result) {
      // Reset form
      jobForm.value = {
        project_title: '',
        category: 'Web Development',
        budget: 1000,
        description: '',
        requirement: '',
        skills_needed: 'Web Development',
        timeline: {
          start_date: Date.now(),
          deadline: Date.now() + (30 * 24 * 60 * 60 * 1000)
        }
      }
      
      // Refresh job list
      await fetchJobs()
    } else {
      createError.value = state.error || 'Failed to create job'
    }
  } catch (err) {
    createError.value = err instanceof Error ? err.message : 'An error occurred'
  } finally {
    createLoading.value = false
  }
}

const fetchJobs = async (page: number = 1) => {
  listLoading.value = true
  listError.value = null

  try {
    const start = (page - 1) * 10
    const { result, state } = await jobs.listJobs(start, start + 10, 'client')
    
    if (result) {
      if (page === 1) {
        jobs.value = result
      } else {
        jobs.value.push(...result)
      }
      
      currentPage.value = page
      hasMore.value = result.length === 10
    } else {
      listError.value = state.error || 'Failed to fetch jobs'
    }
  } catch (err) {
    listError.value = err instanceof Error ? err.message : 'An error occurred'
  } finally {
    listLoading.value = false
  }
}

const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return
  
  loadingMore.value = true
  try {
    await fetchJobs(currentPage.value + 1)
  } finally {
    loadingMore.value = false
  }
}

const viewJob = (jobId: string) => {
  // Navigate to job details
  console.log('View job:', jobId)
}

const editJob = (job: any) => {
  // Populate form with job data for editing
  jobForm.value = {
    project_title: job.project_title,
    category: job.category,
    budget: job.budget,
    description: job.description,
    requirement: job.requirement,
    skills_needed: job.skills_needed,
    timeline: job.timeline
  }
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString()
}

// Initialize
onMounted(() => {
  fetchJobs(1)
})
</script>

<style scoped>
.job-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.create-job, .job-list {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

form {
  display: grid;
  gap: 15px;
}

input, select, textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  color: #dc3545;
  margin-top: 10px;
}

.loading {
  text-align: center;
  padding: 20px;
}

.job-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.job-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.timeline {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.load-more {
  text-align: center;
  margin-top: 20px;
}
</style>
```

## 🚀 Getting Started

1. **Import the necessary composables:**

   ```typescript
   import { useApi, useAuth, useJobApi } from '../composables/useApi'
   ```

2. **Use the API functions:**

   ```typescript
   const { auth, jobs, users } = useApi()
   const { result, state } = await auth.login(credentials)
   ```

3. **Handle loading and error states:**

   ```typescript
   const loading = ref(false)
   const error = ref<string | null>(null)
   
   const fetchData = async () => {
     loading.value = true
     error.value = null
     
     try {
       const { result, state } = await jobs.listJobs(0, 10)
       if (result) {
         // Handle success
       } else {
         error.value = state.error
       }
     } catch (err) {
       error.value = err.message
     } finally {
       loading.value = false
     }
   }
   ```

4. **Display data in your template:**

   ```vue
   <template>
     <div v-if="loading">Loading...</div>
     <div v-else-if="error">{{ error }}</div>
     <div v-else>
       <!-- Your data here -->
     </div>
   </template>
   ```

This comprehensive guide should help you effectively integrate and use the API
 functions in your EraJob application. The generated code follows industry best
 practices for API integration, state management, and error handling in Vue.js
 applications.

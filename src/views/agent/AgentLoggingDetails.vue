<template>
  <div class="min-h-screen bg-gray-50 pb-16 sm:pb-20">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <div class="flex items-center gap-2 sm:gap-3">
          <button @click="$router.back()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-lg sm:text-xl font-semibold text-gray-800">Log Work Hours</h1>
        </div>
        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-teal-500"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 sm:px-6 py-4 sm:py-6 max-w-4xl mx-auto">
      <!-- Job Info Card -->
      <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-2xl">📝</span>
          <div>
            <h3 class="font-semibold text-gray-800">{{ selectedJob?.title || 'Content Writing Project' }}</h3>
            <p class="text-sm text-gray-500">{{ selectedJob?.client || 'TechCorp' }}</p>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-lg font-bold text-teal-500">${{ selectedJob?.price || '14.00' }}</span>
          <span class="text-sm text-gray-500">per hour</span>
        </div>
      </div>

      <!-- Date & Time -->
      <div class="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
        <div class="flex items-center gap-2 mb-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm font-medium text-gray-700">Date & Time</span>
        </div>
        <p class="text-gray-600 text-sm">
          {{ currentDate }} (Time Set Automatically)
        </p>
      </div>

      <!-- Hours Input -->
      <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <label class="block text-gray-700 text-sm font-medium mb-3">Hours Worked</label>
        <div class="flex items-center gap-4">
          <button 
            @click="decreaseHours" 
            class="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <div class="flex-1 text-center">
            <input 
              v-model="hours" 
              type="number" 
              min="0.5" 
              max="24" 
              step="0.5"
              class="w-20 text-2xl font-bold text-center border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg"
            />
            <span class="text-gray-500 ml-1">hours</span>
          </div>
          <button 
            @click="increaseHours" 
            class="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Upload Proof of Work -->
      <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <label class="block text-gray-700 text-sm font-medium mb-3">Upload Proof of Work</label>
        <div
          @click="triggerFileUpload"
          class="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all duration-200"
        >
          <svg
            class="w-10 h-10 mb-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p class="text-sm font-medium mb-1">Upload your files here</p>
          <p class="text-xs text-gray-400">PDF, DOC, JPG, PNG (Max 10MB)</p>
          <input 
            ref="fileInput" 
            type="file" 
            multiple 
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
            class="hidden" 
            @change="handleFileUpload"
          />
        </div>
        
        <!-- Uploaded Files List -->
        <div v-if="uploadedFiles.length > 0" class="mt-4 space-y-2">
          <div 
            v-for="(file, index) in uploadedFiles" 
            :key="index"
            class="flex items-center justify-between bg-gray-50 rounded-lg p-3"
          >
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="text-sm text-gray-700">{{ file.name }}</span>
            </div>
            <button @click="removeFile(index)" class="text-red-500 hover:text-red-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <label class="block text-gray-700 text-sm font-medium mb-3">Notes</label>
        <textarea
          v-model="notes"
          placeholder="Add any additional notes about your work..."
          class="w-full border border-gray-200 rounded-lg p-3 resize-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all duration-200"
          rows="4"
        ></textarea>
      </div>

      <!-- Submit Button -->
      <button
        @click="submitLog"
        class="w-full bg-teal-500 text-white font-medium py-4 rounded-xl hover:bg-teal-600 transition-colors duration-200 shadow-sm hover:shadow-md"
      >
        Log Hours
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Define file type for uploaded files
interface WorkLogFile {
  name: string
  size: number
  type: string
  data: string | null
  lastModified: number
}

// Work logs data with proper typing
interface WorkLog {
  id: string
  title: string
  hours: number
  date: string
  comment: string
  files?: WorkLogFile[]
  projectId?: string
  gigId?: string
  status: 'draft' | 'submitted' | 'approved'
}

const router = useRouter()

// Job data (in a real app, this would come from route params or props)
const selectedJob = ref({
  title: 'Content Writing Project',
  client: 'TechCorp',
  price: '14.00'
})

// Reactive data
const hours = ref(8)
const notes = ref('')
const uploadedFiles = ref<WorkLogFile[]>([])
const currentDate = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Initialize current date
onMounted(() => {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// Hours controls
const decreaseHours = () => {
  if (hours.value > 0.5) {
    hours.value -= 0.5
  }
}

const increaseHours = () => {
  if (hours.value < 24) {
    hours.value += 0.5
  }
}

// File handling
const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  try {
    const files = Array.from(input.files)
    for (const file of files) {
      const base64Data = await fileToBase64(file)
      uploadedFiles.value.push({
        name: file.name,
        size: file.size,
        type: file.type,
        data: base64Data,
        lastModified: file.lastModified
      })
    }
  } catch (err) {
    error.value = 'Failed to process files. Please try again.'
    console.error('File upload error:', err)
  }
}

const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
}

// Form submission
const submitLog = async () => {
  if (hours.value <= 0) {
    error.value = 'Please enter valid hours worked'
    return
  }

  loading.value = true
  error.value = null

  try {
    const workLog: Omit<WorkLog, 'id' | 'status'> = {
      title: `Work log for ${selectedJob.value.title}`,
      hours: hours.value,
      date: new Date().toISOString(),
      comment: notes.value,
      files: [...uploadedFiles.value],
      projectId: 'project-123', // In a real app, get this from route or props
      gigId: 'gig-456' // In a real app, get this from route or props
    }

    const result = await submitWorkLogToAPI(workLog)
    
    if (result.success && result.data) {
      // In a real app, you might want to navigate to a success page or show a success message
      console.log('Work log submitted successfully:', result.data)
      router.push('/agent/explore-gigs')
    } else {
      throw new Error(result.error || 'Failed to submit work log')
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unknown error occurred'
    error.value = `Failed to submit work log: ${message}`
    console.error('Submission error:', err)
  } finally {
    loading.value = false
  }
}

// Define file type for uploaded files
interface WorkLogFile {
  name: string
  size: number
  type: string
  data: string | null
  lastModified: number
}

// Work logs data with proper typing
interface WorkLog {
  id: string
  title: string
  hours: number
  date: string
  comment: string
  files?: WorkLogFile[]
  projectId?: string
  gigId?: string
  status: 'draft' | 'submitted' | 'approved'
}

// Simulate API call for creating work log (replace with real API call)
const submitWorkLogToAPI = async (logData: Omit<WorkLog, 'id' | 'status'>): Promise<{ success: boolean; data?: WorkLog; error?: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In a real implementation, this would call:
  // const result = await workLogsService.createWorkLog(logData)
  // return result
  
  // For now, return a mock response
  return {
    success: true,
    data: {
      ...logData,
      id: 'log-' + Math.random().toString(36).substr(2, 9),
      status: 'submitted' as const
    }
  }
}

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string') {
        resolve(result)
      } else if (result instanceof ArrayBuffer) {
        // Handle ArrayBuffer case if needed
        const decoder = new TextDecoder('utf-8')
        resolve(decoder.decode(result))
      } else {
        reject(new Error('Failed to convert file to base64'))
      }
    }
    reader.onerror = error => reject(error)
  })
}
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>

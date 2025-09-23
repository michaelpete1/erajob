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

const router = useRouter()

// Reactive data
const hours = ref(8)
const notes = ref('')
const uploadedFiles = ref<any[]>([])
const selectedJob = ref<any>(null)
const currentDate = ref('')
const fileInput = ref<any>(null)

// Initialize
onMounted(() => {
  // Get current date and time
  const now = new Date()
  currentDate.value = now.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  
  // Get selected job from localStorage
  try {
    const jobData = localStorage.getItem('selectedGig')
    if (jobData) {
      selectedJob.value = JSON.parse(jobData)
    }
  } catch (e) {
    // ignore
  }
})

// Methods
const increaseHours = () => {
  hours.value = Math.min(24, hours.value + 0.5)
}

const decreaseHours = () => {
  hours.value = Math.max(0.5, hours.value - 0.5)
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: any) => {
  const files = Array.from(event.target.files)
  uploadedFiles.value = [...uploadedFiles.value, ...files]
}

const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
}

const submitLog = async () => {
  // Convert files to base64 for localStorage storage
  const processedFiles = []
  
  if (uploadedFiles.value && uploadedFiles.value.length > 0) {
    for (const file of uploadedFiles.value) {
      try {
        // Convert file to base64 data URL
        const base64Data = await fileToBase64(file)
        processedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          data: base64Data,
          lastModified: file.lastModified
        })
      } catch (error) {
        console.error('Error processing file:', error)
        // Add file without base64 data as fallback
        processedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          data: null,
          lastModified: file.lastModified
        })
      }
    }
  }
  
  // Create log entry
  const logEntry = {
    id: Date.now(),
    date: currentDate.value,
    title: selectedJob.value?.title || 'Work Session',
    comment: notes.value || 'No additional notes',
    hours: hours.value,
    job: selectedJob.value,
    files: processedFiles
  }
  
  // Save to localStorage (in real app, this would be an API call)
  try {
    const existingLogs = JSON.parse(localStorage.getItem('workLogs') || '[]')
    existingLogs.unshift(logEntry)
    localStorage.setItem('workLogs', JSON.stringify(existingLogs))
  } catch (e) {
    console.error('Error saving log:', e)
  }
  
  // Navigate to log work page
  router.push('/agent/log-work')
}

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}
</script>

<style scoped>
/* No custom styles needed - using Tailwind classes */
</style>

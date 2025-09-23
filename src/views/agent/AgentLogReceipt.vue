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
          <h1 class="text-lg sm:text-xl font-semibold text-gray-800">Log Receipt</h1>
        </div>
        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-teal-500"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 sm:px-6 py-4 sm:py-6 max-w-4xl mx-auto">
      <!-- Log Not Found -->
      <div v-if="!logData" class="text-center py-12">
        <div class="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Log not found</h3>
        <p class="text-gray-500">The requested log entry could not be found.</p>
      </div>

      <!-- Log Details -->
      <div v-else class="space-y-4 sm:space-y-6">
        <!-- Log Header Card -->
        <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-sm text-gray-500 font-medium">{{ logData.date }}</span>
                <span class="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full font-semibold">
                  {{ logData.hours }}h
                </span>
              </div>
              <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{{ logData.title }}</h2>
              <p class="text-sm sm:text-base text-gray-600">{{ logData.comment }}</p>
            </div>
            <div class="flex items-center gap-2">
              <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Share">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Images Section -->
        <div v-if="logImages.length > 0" class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm">
          <div class="p-4 sm:p-6 border-b border-gray-100">
            <h3 class="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Attached Images & Screenshots
            </h3>
            <p class="text-sm text-gray-500 mt-1">{{ logImages.length }} image(s) attached</p>
          </div>

          <div class="p-4 sm:p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="(image, index) in logImages" 
                :key="index"
                class="relative group cursor-pointer"
                @click="viewImage(image)"
              >
                <img 
                  :src="getFileUrl(image)" 
                  :alt="image.name || `Image ${index + 1}`"
                  class="w-full h-32 sm:h-40 object-cover rounded-lg border border-gray-200 group-hover:border-teal-300 transition-colors"
                />
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
                <p class="text-xs text-gray-500 mt-1 truncate">{{ image.name || `Image ${index + 1}` }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes Section -->
        <div v-if="logData.comment" class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm">
          <div class="p-4 sm:p-6 border-b border-gray-100">
            <h3 class="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Work Notes
            </h3>
            <p class="text-sm text-gray-500 mt-1">Detailed notes about the work completed</p>
          </div>

          <div class="p-4 sm:p-6">
            <div class="prose prose-sm max-w-none">
              <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ logData.comment }}</p>
            </div>
          </div>
        </div>

        <!-- Log Metadata -->
        <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
          <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Log Information</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-lg p-3">
              <p class="text-xs text-gray-500 mb-1">Date & Time</p>
              <p class="text-sm font-medium text-gray-800">{{ logData.date }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3">
              <p class="text-xs text-gray-500 mb-1">Hours Logged</p>
              <p class="text-sm font-medium text-gray-800">{{ logData.hours }} hours</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3">
              <p class="text-xs text-gray-500 mb-1">Log ID</p>
              <p class="text-sm font-medium text-gray-800">#{{ logData.id }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3">
              <p class="text-xs text-gray-500 mb-1">Status</p>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <p class="text-sm font-medium text-green-600">Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div 
      v-if="selectedImage" 
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      @click="closeImageModal"
    >
      <div class="relative max-w-4xl max-h-full">
        <img 
          :src="getFileUrl(selectedImage)" 
          :alt="selectedImage.name || 'Image'"
          class="max-w-full max-h-full object-contain rounded-lg"
        />
        <button 
          @click="closeImageModal"
          class="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-75 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Agent Bottom Navigation -->
    <AgentBottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AgentBottomNav from '../../components/AgentBottomNav.vue'

const router = useRouter()
const logData = ref<any>(null)
const logImages = ref<any[]>([])
const selectedImage = ref<any>(null)

onMounted(() => {
  try {
    const logId = Array.isArray(router.currentRoute.value.params.id) 
      ? router.currentRoute.value.params.id[0] 
      : router.currentRoute.value.params.id
    if (logId) {
      // Try to get from localStorage first (for demo purposes)
      const logs = localStorage.getItem('workLogs')
      if (logs) {
        const allLogs = JSON.parse(logs)
        const foundLog = allLogs.find((log: any) => log.id === parseInt(logId))
        if (foundLog) {
          logData.value = foundLog
          extractImages(foundLog)
        }
      }
      
      // Fallback to selectedLog if not found by ID
      if (!logData.value) {
        const selectedLog = localStorage.getItem('selectedLog')
        if (selectedLog) {
          logData.value = JSON.parse(selectedLog)
          extractImages(logData.value)
        }
      }
    } else {
      // Get from localStorage if no ID in route
      const selectedLog = localStorage.getItem('selectedLog')
      if (selectedLog) {
        logData.value = JSON.parse(selectedLog)
        extractImages(logData.value)
      }
    }
  } catch (e) {
    console.error('Error loading log data:', e)
  }
})

const extractImages = (log: any) => {
  if (log.files && Array.isArray(log.files)) {
    logImages.value = log.files.filter((file: any) => isImageFile(file.name))
  }
}

const isImageFile = (fileName: string) => {
  if (!fileName || typeof fileName !== 'string') return false
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
  const lowerFileName = fileName.toLowerCase()
  const lastDotIndex = lowerFileName.lastIndexOf('.')
  
  if (lastDotIndex === -1) return false
  
  const extension = lowerFileName.substring(lastDotIndex)
  return imageExtensions.includes(extension)
}

const getFileUrl = (file: any) => {
  // Check if it's a real File object (freshly uploaded)
  if (file instanceof File) {
    return URL.createObjectURL(file)
  }
  
  // Check if it's a file from localStorage with base64 data
  if (file && file.data) {
    return file.data
  }
  
  // Check if it's a file object with URL
  if (file && file.url) {
    return file.url
  }
  
  // For demo purposes, create a placeholder based on file type
  if (file && file.name) {
    const extension = file.name.split('.').pop()?.toLowerCase()
    
    // Create different placeholders for different image types
    if (['jpg', 'jpeg', 'png'].includes(extension || '')) {
      return `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y0ZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7igJx7e2ZpbGUubmFtZX194oCdPC90ZXh0Pjwvc3ZnPg==`
    }
  }
  
  // Default placeholder
  return `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y0ZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBQcmV2aWV3PC90ZXh0Pjwvc3ZnPg==`
}

const viewImage = (image: any) => {
  selectedImage.value = image
}

const closeImageModal = () => {
  selectedImage.value = null
}
</script>

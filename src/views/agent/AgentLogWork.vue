<template>
  <div class="min-h-screen bg-gray-50 pb-16 sm:pb-20">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <button @click="$router.back()" class="text-gray-600 hover:text-gray-800 transition-colors">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-lg sm:text-xl font-semibold text-gray-800">My Logged Work</h1>
        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-teal-500"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 sm:px-6 py-4 sm:py-6 max-w-4xl mx-auto">
      <!-- No Logs Message -->
      <div v-if="workLogs.length === 0" class="text-center py-12">
        <div class="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No work logged yet</h3>
        <p class="text-gray-500">Start logging your work hours to see them here.</p>
      </div>

      <!-- Work Logs List -->
      <div v-else class="space-y-6 sm:space-y-8">
        <!-- Images Section -->
        <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm">
          <div class="p-4 sm:p-6 border-b border-gray-100">
            <h2 class="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Uploaded Images & Screenshots
            </h2>
            <p class="text-sm text-gray-500 mt-1">All images and screenshots from your logged work</p>
          </div>
          
          <div class="p-4 sm:p-6">
            <!-- No Images Message -->
            <div v-if="getAllImages().length === 0" class="text-center py-8">
              <div class="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-sm font-medium text-gray-900 mb-1">No images uploaded yet</h3>
              <p class="text-xs text-gray-500">Upload images when logging work to see them here.</p>
            </div>
            
            <!-- Images Grid -->
            <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <div
                v-for="(image, index) in getAllImages()"
                :key="index"
                class="relative group cursor-pointer"
              >
                <!-- Image Preview -->
                <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    :src="getFileUrl(image.file)"
                    :alt="image.file.name"
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <!-- Image info overlay -->
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex flex-col items-center justify-center p-2">
                  <span class="text-white text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 truncate w-full">
                    {{ image.file.name }}
                  </span>
                  <span class="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1">
                    {{ image.logTitle }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes Section -->
        <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm">
          <div class="p-4 sm:p-6 border-b border-gray-100">
            <h2 class="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Written Notes
            </h2>
            <p class="text-sm text-gray-500 mt-1">All notes from your logged work sessions</p>
          </div>
          
          <div class="p-4 sm:p-6">
            <!-- No Notes Message -->
            <div v-if="getAllNotes().length === 0" class="text-center py-8">
              <div class="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 class="text-sm font-medium text-gray-900 mb-1">No notes written yet</h3>
              <p class="text-xs text-gray-500">Add notes when logging work to see them here.</p>
            </div>
            
            <!-- Notes List -->
            <div v-else class="space-y-4">
              <div
                v-for="(note, index) in getAllNotes()"
                :key="index"
                class="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div class="flex items-start justify-between mb-2">
                  <h4 class="font-medium text-gray-800 text-sm">{{ note.logTitle }}</h4>
                  <div class="flex items-center gap-2">
                    <span class="bg-teal-100 text-teal-800 text-xs font-medium px-2 py-1 rounded-full">
                      {{ note.hours }} hrs
                    </span>
                    <span class="text-xs text-gray-500">{{ note.date }}</span>
                  </div>
                </div>
                <p class="text-gray-700 text-sm leading-relaxed">{{ note.comment }}</p>
              </div>
              
              <!-- Demo Notes with Lorem Ipsum -->
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div class="flex items-start justify-between mb-2">
                  <h4 class="font-medium text-gray-800 text-sm">Content Writing Project</h4>
                  <div class="flex items-center gap-2">
                    <span class="bg-teal-100 text-teal-800 text-xs font-medium px-2 py-1 rounded-full">
                      8 hrs
                    </span>
                    <span class="text-xs text-gray-500">9/23/2024, 11:30 AM</span>
                  </div>
                </div>
                <p class="text-gray-700 text-sm leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div class="flex items-start justify-between mb-2">
                  <h4 class="font-medium text-gray-800 text-sm">UI/UX Design Revamp</h4>
                  <div class="flex items-center gap-2">
                    <span class="bg-teal-100 text-teal-800 text-xs font-medium px-2 py-1 rounded-full">
                      6 hrs
                    </span>
                    <span class="text-xs text-gray-500">9/22/2024, 2:15 PM</span>
                  </div>
                </div>
                <p class="text-gray-700 text-sm leading-relaxed">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Navbar -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 sm:px-4 py-2 sm:py-3 z-50">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-around items-center">
          <button class="flex flex-col items-center text-teal-500 hover:text-teal-600 transition-colors group">
            <span class="text-xl sm:text-2xl mb-1 group-hover:scale-110 transition-transform">📂</span>
            <span class="text-xs sm:text-sm font-medium">Log Work</span>
          </button>
          <button class="flex flex-col items-center text-gray-400 hover:text-gray-600 transition-colors group">
            <span class="text-xl sm:text-2xl mb-1 group-hover:scale-110 transition-transform">💬</span>
            <span class="text-xs sm:text-sm font-medium">Chat</span>
          </button>
          <button class="flex flex-col items-center text-gray-400 hover:text-gray-600 transition-colors group">
            <span class="text-xl sm:text-2xl mb-1 group-hover:scale-110 transition-transform">➕</span>
            <span class="text-xs sm:text-sm font-medium">Add</span>
          </button>
          <button class="flex flex-col items-center text-gray-400 hover:text-gray-600 transition-colors group">
            <span class="text-xl sm:text-2xl mb-1 group-hover:scale-110 transition-transform">🔔</span>
            <span class="text-xs sm:text-sm font-medium">Alerts</span>
          </button>
          <button class="flex flex-col items-center text-gray-400 hover:text-gray-600 transition-colors group">
            <span class="text-xl sm:text-2xl mb-1 group-hover:scale-110 transition-transform">⚙️</span>
            <span class="text-xs sm:text-sm font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const workLogs = ref<any[]>([])

// Load work logs from localStorage
onMounted(() => {
  try {
    const logs = localStorage.getItem('workLogs')
    if (logs) {
      workLogs.value = JSON.parse(logs)
    }
  } catch (e) {
    console.error('Error loading work logs:', e)
  }
})

// Get all images from all work logs
const getAllImages = () => {
  const images: any[] = []
  
  if (!workLogs.value || !Array.isArray(workLogs.value)) return images
  
  workLogs.value.forEach(log => {
    if (!log) return
    
    if (log.files && Array.isArray(log.files) && log.files.length > 0) {
      log.files.forEach((file: any) => {
        if (file && file.name && isImageFile(file.name)) {
          images.push({
            file: file,
            logTitle: log.title || 'Untitled Log',
            logDate: log.date || '',
            hours: log.hours || 0
          })
        }
      })
    }
  })
  
  return images
}

// Get all notes from all work logs
const getAllNotes = () => {
  const notes: any[] = []
  
  if (!workLogs.value || !Array.isArray(workLogs.value)) return notes
  
  workLogs.value.forEach(log => {
    if (!log) return
    
    if (log.comment && typeof log.comment === 'string' && log.comment.trim() !== '') {
      notes.push({
        comment: log.comment,
        logTitle: log.title || 'Untitled Log',
        date: log.date || '',
        hours: log.hours || 0
      })
    }
  })
  
  return notes
}

// Helper functions
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
</script>

<style scoped>
/* No custom styles needed - using Tailwind classes */
</style>

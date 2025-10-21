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
        <!-- Individual Log Entries -->
        <section class="space-y-3 sm:space-y-4">
          <div
            v-for="log in workLogs"
            :key="log.id"
            class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm hover:border-teal-300 hover:shadow-md transition-all cursor-pointer"
            @click="goToLog(log)"
          >
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div class="flex-1 min-w-0">
                <p class="text-xs sm:text-sm text-gray-500 mb-1">{{ log.date || 'Date not available' }}</p>
                <h3 class="text-base sm:text-lg font-semibold text-gray-800 truncate">{{ log.title }}</h3>
                <p v-if="log.comment" class="mt-2 text-sm text-gray-600 line-clamp-2">{{ log.comment }}</p>
              </div>
              <div class="flex items-center sm:flex-col sm:items-end gap-2 sm:gap-3 flex-shrink-0">
                <span class="text-sm sm:text-base font-semibold text-teal-600">{{ log.hours.toFixed(1) }}h</span>
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap',
                    log.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  ]"
                >
                  {{ log.approved ? 'Approved' : 'Pending Review' }}
                </span>
              </div>
            </div>

            <div class="mt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500">
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ log.hours.toFixed(1) }} hrs logged
              </span>
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {{ log.files.length }} attachment{{ log.files.length === 1 ? '' : 's' }}
              </span>
            </div>
          </div>
        </section>

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
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
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
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex flex-col items-center justify-center p-2 sm:p-3">
                  <span class="text-white text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 break-words w-full line-clamp-2">
                    {{ image.file.name }}
                  </span>
                  <span class="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1 break-words text-center">
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
            <div v-else class="space-y-3 sm:space-y-4">
              <div
                v-for="(note, index) in getAllNotes()"
                :key="index"
                class="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200"
              >
                <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-2 sm:mb-3">
                  <h4 class="font-medium text-gray-800 text-sm break-words flex-1 min-w-0">{{ note.logTitle }}</h4>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <span class="bg-teal-100 text-teal-800 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap">
                      {{ note.hours }} hrs
                    </span>
                    <span class="text-xs text-gray-500 whitespace-nowrap">{{ note.date }}</span>
                  </div>
                </div>
                <p class="text-gray-700 text-sm leading-relaxed break-words">{{ note.comment }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { workLogsService } from '@/services/workLogsService'
import type { WorkLogOut } from '@/types/api'

interface WorkLogFile {
  name: string
  url: string
}

interface WorkLogView {
  id: string
  title: string
  hours: number
  date: string
  comment: string
  files: WorkLogFile[]
  approved: boolean
  jobId: string
}

const router = useRouter()

const workLogs = ref<WorkLogView[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const jobId = ref<string>('')

const totalHours = computed(() => workLogs.value.reduce((total, log) => total + log.hours, 0))

const goToLog = (log: WorkLogView) => {
  try {
    localStorage.setItem('selectedLog', JSON.stringify({
      id: log.id,
      title: log.title,
      hours: log.hours,
      date: log.date,
      comment: log.comment,
      files: log.files
    }))
  } catch (error) {
    console.warn('Unable to cache selected log', error)
  }

  router.push({ name: 'agent-log-receipt', params: { id: log.id } })
}

const normalizeLog = (log: WorkLogOut): WorkLogView => {
  const formattedFiles: WorkLogFile[] = Array.isArray(log.files)
    ? log.files.map((entry, index) => {
        if (typeof entry === 'string') {
          return {
            name: `Attachment-${index + 1}`,
            url: entry
          }
        }

        if (entry && typeof entry === 'object') {
          const possibleUrl = (entry as Record<string, unknown>).url
          const possibleName = (entry as Record<string, unknown>).name

          return {
            name: typeof possibleName === 'string' && possibleName.trim().length > 0
              ? possibleName
              : `Attachment-${index + 1}`,
            url: typeof possibleUrl === 'string' ? possibleUrl : ''
          }
        }

        return {
          name: `Attachment-${index + 1}`,
          url: ''
        }
      })
    : []

  return {
    id: log.id,
    title: log.log_title ?? 'Work Log',
    hours: typeof log.hours === 'number' ? log.hours : 0,
    date: formatTimestamp(log.date_created),
    comment: log.log_comment ?? '',
    files: formattedFiles,
    approved: Boolean(log.client_approved),
    jobId: log.job_id
  }
}

const formatTimestamp = (timestamp?: number | null) => {
  if (!timestamp) return ''
  const ms = timestamp > 1_000_000_000_000 ? timestamp : timestamp * 1000
  const date = new Date(ms)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString()
}

const fetchWorkLogs = async () => {
  if (!jobId.value) {
    workLogs.value = []
    return
  }

  loading.value = true
  error.value = null
  try {
    const response = await workLogsService.listAgentLogsForJob(jobId.value)
    if (response.success && response.data) {
      workLogs.value = response.data.map(normalizeLog)
    } else {
      workLogs.value = []
      error.value = response.error || 'Failed to load work logs.'
    }
  } catch (err: any) {
    workLogs.value = []
    error.value = err?.message || 'Failed to load work logs.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const storedGig = localStorage.getItem('selectedGig')
    if (storedGig) {
      const parsed = JSON.parse(storedGig)
      jobId.value = typeof parsed?.id === 'string' ? parsed.id : ''
    }
  } catch (e) {
    console.warn('Unable to read selected gig from storage', e)
  }

  await fetchWorkLogs()
})

// Get all images from all work logs
const getAllImages = () => {
  const images: { file: WorkLogFile; logTitle: string; logDate: string; hours: number }[] = []
  workLogs.value.forEach(log => {
    log.files
      .filter(file => isImageFile(file))
      .forEach(file => {
        images.push({
          file,
          logTitle: log.title || 'Untitled Log',
          logDate: log.date || '',
          hours: log.hours || 0
        })
      })
  })
  return images
}

// Get all notes from all work logs
const getAllNotes = () => {
  const notes: { comment: string; logTitle: string; date: string; hours: number }[] = []
  workLogs.value.forEach(log => {
    if (log.comment && log.comment.trim()) {
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
const isImageFile = (file: WorkLogFile) => {
  if (!file) return false

  if (typeof file.url === 'string' && file.url.startsWith('data:image/')) {
    return true
  }

  if (typeof file.name !== 'string') {
    return false
  }

  const lowerFileName = file.name.toLowerCase()
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
  return imageExtensions.some(ext => lowerFileName.endsWith(ext))
}


const getFileUrl = (file: WorkLogFile) => file.url || ''
</script>

<style scoped>
/* No custom styles needed - using Tailwind classes */
</style>

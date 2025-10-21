<template>
  <div class="min-h-screen bg-gray-100 font-sans antialiased text-gray-800">
    <header class="bg-teal-500 text-white p-4 sm:p-6 flex items-center justify-between shadow-md">
      <div class="flex items-center">
        <button @click="$router.back()" class="text-white hover:bg-teal-600 rounded-lg p-1 transition-colors">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-lg sm:text-xl font-semibold ml-3">Approved Work Logs</h1>
      </div>
    </header>

    <main class="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      <div v-if="loading" class="flex justify-center p-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>

      <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <div v-else-if="logs.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No approved logs yet</h3>
        <p class="mt-1 text-sm text-gray-500">Approved work logs will appear here.</p>
      </div>

      <div v-else class="space-y-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">Approved Time Entries</h2>
          <span class="px-2 py-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full">
            {{ logs.length }} {{ logs.length === 1 ? 'entry' : 'entries' }}
          </span>
        </div>

        <div v-for="log in logs" :key="log.id" class="bg-white overflow-hidden shadow-sm rounded-lg">
          <div class="p-4 sm:p-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-medium text-gray-900 truncate">{{ log.log_title || 'Work Log' }}</h3>
                <p class="mt-1 text-sm text-gray-500">
                  {{ formatDate(log.date_created) }} • {{ log.hours || 0 }} hours
                </p>
                <p v-if="log.log_comment" class="mt-2 text-sm text-gray-600">{{ log.log_comment }}</p>
              </div>
              <div class="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Approved
                </span>
              </div>
            </div>

            <div v-if="log.files && log.files.length" class="mt-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Attachments</h4>
              <div class="flex flex-wrap gap-2">
                <a
                  v-for="(file, index) in log.files"
                  :key="index"
                  :href="file"
                  target="_blank"
                  class="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg class="h-4 w-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  File {{ index + 1 }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { workLogsService } from '@/services/workLogsService'
import type { WorkLogOut } from '@/types/api'

const route = useRoute()

const jobId = ref<string>('')
const logs = ref<WorkLogOut[]>([])
const loading = ref<boolean>(true)
const error = ref<string>('')

const formatDate = (timestamp: number | null | undefined): string => {
  if (!timestamp) return ''
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const fetchLogs = async (): Promise<void> => {
  try {
    loading.value = true
    error.value = ''

    const response = await workLogsService.listClientLogsForJob(jobId.value)
    if (response.success && Array.isArray(response.data)) {
      logs.value = response.data.filter((log) => log.client_approved)
    } else {
      error.value = response.error || 'Failed to load work logs'
      logs.value = []
    }
  } catch (err) {
    console.error('Error fetching logs:', err)
    error.value = 'An error occurred while fetching work logs'
    logs.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const routeJobId = route.params.jobId
  if (typeof routeJobId === 'string') {
    jobId.value = routeJobId
  } else if (Array.isArray(routeJobId) && routeJobId.length > 0) {
    jobId.value = routeJobId[0]
  }

  if (!jobId.value) {
    try {
      const storedProject = localStorage.getItem('selectedProject')
      if (storedProject) {
        const parsedProject = JSON.parse(storedProject) as { id?: string }
        if (parsedProject?.id) {
          jobId.value = parsedProject.id
        }
      }
    } catch (storageError) {
      console.error('Error reading selected project from localStorage:', storageError)
    }
  }

  if (jobId.value) {
    fetchLogs()
  } else {
    error.value = 'No project selected'
    loading.value = false
  }
})
</script>

<style scoped>
</style>

<template>
  <div class="min-h-screen bg-gray-100 pb-24">
    <ClientNavbar />
    <header class="bg-white shadow-sm p-4 sticky top-0 z-10 mt-4">
      <h1 class="text-2xl font-bold text-gray-800">Client Dashboard</h1>
      <p class="text-sm text-gray-500">Manage your projects and agents.</p>
    </header>

    <main class="p-4 space-y-6">
      <section class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">My Projects</h2>
          <button
            @click="$router.push({ name: 'client-create-project' })"
            class="bg-brand-teal text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Post a New Project
          </button>
        </div>

        <div v-if="loading" class="flex justify-center py-10">
          <svg class="w-8 h-8 animate-spin text-brand-teal" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
          </svg>
        </div>

        <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {{ error }}
        </div>

        <div v-else-if="projects.length === 0" class="text-center text-gray-500 py-10">
          <p class="mb-2">You have no active projects yet.</p>
          <p class="text-sm">Post a new project to start receiving proposals.</p>
        </div>

        <div v-else class="space-y-4">
          <article
            v-for="(project, index) in projects"
            :key="project.id ? String(project.id) : `project-${index}`"
            class="border border-gray-200 rounded-lg p-5 hover:border-brand-teal/40 transition-colors"
          >
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <h3 class="text-lg font-semibold text-gray-800">{{ project.project_title }}</h3>
                <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ project.description }}</p>
              </div>
              <div class="text-sm text-gray-500">
                <p><span class="font-semibold text-gray-700">Budget:</span> {{ formatBudget(project.budget) }}</p>
                <p><span class="font-semibold text-gray-700">Status:</span> {{ formatStatus(project.status) }}</p>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 text-sm text-gray-500">
              <p>
                <span class="font-medium text-gray-700">Created:</span>
                {{ formatDate(project.date_created) }}
              </p>
              <div class="flex flex-wrap items-center gap-3">
                <button
                  @click="viewWorkLogs(project)"
                  class="inline-flex items-center gap-2 text-gray-600 hover:text-brand-teal font-medium transition-colors"
                >
                  View Work Logs
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </button>
                <button
                  @click="openProject(project)"
                  class="inline-flex items-center gap-2 text-brand-teal hover:text-teal-700 font-medium"
                >
                  View Proposals
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Recommended Agents</h2>
          <button
            @click="$router.push({ name: 'client-recommended-agents' })"
            class="text-brand-teal hover:text-teal-700 font-medium"
          >
            View All
          </button>
        </div>
        <p class="text-center text-gray-500">
          Visit the recommended agents page to discover specialists curated for your projects.
        </p>
      </section>
    </main>

    <ClientBottomNav />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ClientNavbar from '../../components/navbar/ClientNavbar.vue'
import ClientBottomNav from '../../components/ClientBottomNav.vue'
import { useJobs } from '@/composables/useJobs'

const router = useRouter()
const { jobs, loading, error, getClientJobs } = useJobs()

const pagination = { start: 0, stop: 20 }

const projects = computed(() => jobs.value)

const viewWorkLogs = (project: any) => {
  const projectId = project?.id ? String(project.id) : ''
  if (!projectId) {
    return
  }
  try {
    localStorage.setItem('selectedProject', JSON.stringify({
      id: projectId,
      title: project.project_title,
      job_id: project.job_id || projectId
    }))
    localStorage.setItem('selectedClientProject', JSON.stringify(project))
  } catch (err) {
    console.warn('Unable to cache project for work log view', err)
  }
  router.push({ name: 'client-work-log', params: { jobId: projectId } })
}

onMounted(async () => {
  await getClientJobs(pagination.start, pagination.stop)
})

const formatBudget = (budget: number) => {
  if (!budget || Number.isNaN(budget)) return '$0'
  return `$${(budget / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const formatDate = (timestamp?: number | null) => {
  if (!timestamp) return '—'
  const ms = timestamp > 1_000_000_000_000 ? timestamp : timestamp * 1000
  const date = new Date(ms)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

const formatStatus = (status?: string | null) => {
  if (!status) return 'Pending'
  const normalized = status.replace(/_/g, ' ')
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

const openProject = (project: any) => {
  const projectId = project?.id ? String(project.id) : ''
  if (!projectId) {
    return
  }
  try {
    localStorage.setItem('selectedClientProject', JSON.stringify(project))
  } catch (err) {
    console.warn('Unable to cache project for later use', err)
  }
  router.push({ name: 'client-proposals', query: { jobId: projectId } })
}
</script>
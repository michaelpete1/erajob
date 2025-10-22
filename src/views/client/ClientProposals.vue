<template>
  <div class="client-proposals">
    <header class="header">
      <button class="back-button" @click="goBack" aria-label="Go back">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>
      <div class="header-content">
        <h1>Proposals</h1>
        <p v-if="jobId">Job ID: <span class="job-id">{{ jobId }}</span></p>
      </div>
    </header>

    <main class="content">
      <div v-if="loading" class="state-card">
        <div class="spinner" />
        <p>Loading proposals...</p>
      </div>

      <div v-else-if="error" class="state-card error">
        <h2>Error</h2>
        <p>{{ error }}</p>
      </div>

      <div v-else-if="!jobId" class="state-card">
        <h2>Select a Job</h2>
        <p>Open a job from your dashboard and use the "View Proposals" button to see submissions.</p>
      </div>

      <div v-else-if="proposals.length === 0" class="state-card">
        <h2>No proposals yet</h2>
        <p>You'll see agent submissions here as soon as they apply for this job.</p>
      </div>

      <section v-else class="proposal-list">
        <article
          v-for="proposal in proposals"
          :key="proposal.id"
          class="proposal-card"
          @click="openProposal(proposal)"
        >
          <div class="proposal-header">
            <span class="status-pill" :class="statusClass(proposal.proposal_status)">
              {{ formatStatus(proposal.proposal_status) }}
            </span>
            <time>{{ formatTimestamp(proposal.date_created) }}</time>
          </div>

          <p class="proposal-preview">{{ proposal.proposal }}</p>

          <footer class="proposal-footer">
            <div class="meta">
              <span class="meta-item">
                <strong>Agent:</strong>
                <span>
                  {{ proposal.agent_name || proposal.agent_id || 'Not specified' }}
                  <template v-if="proposal.agent_email">
                    <span class="agent-email">({{ proposal.agent_email }})</span>
                  </template>
                </span>
              </span>
              <span class="meta-item">
                <strong>Email:</strong> {{ proposal.agent_email || 'Not provided' }}
              </span>
              <span class="meta-item">
                <strong>Proposal:</strong> {{ previewProposal(proposal.proposal) }}
              </span>
            </div>
            <button class="view-button" @click.stop="openProposal(proposal)">
              View details
            </button>
          </footer>
        </article>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { applicationsService } from '@/services/applicationsService'
import type { ApplicationOut } from '@/types/api'

const route = useRoute()
const router = useRouter()

interface ClientProposal extends ApplicationOut {
  agent_name?: string
  agent_email?: string
}

const jobId = ref('')
const proposals = ref<ClientProposal[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const pagination = ref({ start: 0, stop: 50 })
const agentDirectory = ref<Record<string, { name: string; email?: string }>>({})

const syncJobIdFromRoute = () => {
  const value = route.query.jobId
  jobId.value = typeof value === 'string' ? value : Array.isArray(value) ? value[0] ?? '' : ''
  loadAgentDirectory()
}

const loadProposals = async () => {
  if (!jobId.value) {
    proposals.value = []
    return
  }

  loading.value = true
  error.value = null

  try {
    const response = await applicationsService.listClientApplications(jobId.value, pagination.value)
    if (response.success && response.data) {
      const fetched = response.data as ClientProposal[]
      proposals.value = enrichProposals(fetched)
    } else {
      error.value = response.error || 'Failed to load proposals.'
    }
  } catch (err: any) {
    error.value = err?.message || 'Failed to load proposals.'
  } finally {
    loading.value = false
  }
}

const loadAgentDirectory = () => {
  try {
    const stored = localStorage.getItem('selectedClientProject') || localStorage.getItem('selectedProject')
    if (!stored) {
      agentDirectory.value = {}
      return
    }
    const parsed = JSON.parse(stored) as Record<string, any>
    const agents = Array.isArray(parsed?.agents) ? parsed.agents : []
    const directory: Record<string, { name: string; email?: string }> = {}
    agents.forEach(agent => {
      const id = String(agent?.id || agent?.agent_id || agent?.user_id || '')
      if (!id) return
      const name =
        agent?.name ||
        agent?.full_name ||
        agent?.display_name ||
        agent?.username ||
        id
      const email = agent?.email || agent?.contact_email || agent?.user_email
      directory[id] = { name, email }
    })
    agentDirectory.value = directory
  } catch (err) {
    console.warn('ClientProposals: unable to parse stored project agent directory', err)
    agentDirectory.value = {}
  }
}

const extractNestedAgentInfo = (proposal: ClientProposal): { name?: string; email?: string } => {
  const raw = proposal as unknown as Record<string, any>
  const candidate = raw.agent || raw.agent_profile || raw.agent_details || raw.agentInfo || raw.agentData
  if (!candidate || typeof candidate !== 'object') {
    return {}
  }
  const name =
    candidate.full_name ||
    candidate.name ||
    candidate.display_name ||
    candidate.username ||
    candidate.email
  const email = candidate.email || candidate.contact_email || candidate.user_email
  return { name, email }
}

const enrichProposals = (items: ClientProposal[]): ClientProposal[] => {
  return items.map(proposal => {
    if (!proposal.agent_id) return proposal

    let agentName = proposal.agent_name
    let agentEmail = proposal.agent_email

    if ((!agentName || !agentEmail) && agentDirectory.value[proposal.agent_id]) {
      agentName = agentName || agentDirectory.value[proposal.agent_id].name
      agentEmail = agentEmail || agentDirectory.value[proposal.agent_id].email
    }

    if (!agentName || !agentEmail) {
      const nested = extractNestedAgentInfo(proposal)
      agentName = agentName || nested.name
      agentEmail = agentEmail || nested.email
    }

    return {
      ...proposal,
      agent_name: agentName,
      agent_email: agentEmail
    }
  })
}

watch(
  () => route.query.jobId,
  () => {
    syncJobIdFromRoute()
    loadProposals()
  },
  { immediate: true }
)

const goBack = () => {
  router.back()
}

const openProposal = (proposal: ClientProposal) => {
  if (!proposal.id || !jobId.value) return
  try {
    localStorage.setItem(
      'selectedClientProposal',
      JSON.stringify({
        id: proposal.id,
        job_id: jobId.value,
        agent_name: proposal.agent_name,
        agent_email: proposal.agent_email
      })
    )
  } catch (err) {
    console.warn('ClientProposals: unable to persist proposal metadata', err)
  }
  router.push({ name: 'client-proposal-detail', params: { id: proposal.id }, query: { jobId: jobId.value } })
}

const formatStatus = (status: string) => {
  const map: Record<string, string> = {
    pending_review: 'Pending Review',
    accepted: 'Accepted',
    rejected: 'Rejected'
  }
  return map[status] || status
}

const statusClass = (status: string) => {
  if (status === 'accepted') return 'accepted'
  if (status === 'rejected') return 'rejected'
  return 'pending'
}

const formatTimestamp = (timestamp?: number | null) => {
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

const previewProposal = (proposalText: string) => {
  if (!proposalText) return 'No proposal content provided.'
  const trimmed = proposalText.trim()
  if (trimmed.length <= 80) return trimmed
  return `${trimmed.slice(0, 80)}...`
}

onMounted(() => {
  syncJobIdFromRoute()
  loadProposals()
})
</script>

<style scoped>
.client-proposals {
  min-height: 100vh;
  background: linear-gradient(130deg, #0fb9a5, #0d8e7d);
  padding-bottom: 2.5rem;
}

.header {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid rgba(15, 185, 165, 0.15);
  backdrop-filter: blur(10px);
  z-index: 10;
}

.back-button {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: rgba(15, 185, 165, 0.1);
  color: #0d8e7d;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
}

.back-button:hover {
  background: rgba(15, 185, 165, 0.2);
}

.header-content h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0d2d29;
}

.header-content p {
  margin: 0.25rem 0 0;
  color: #0d8e7d;
  font-size: 0.875rem;
}

.job-id {
  font-family: 'Fira Code', monospace;
}

.content {
  padding: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}

.state-card {
  background: rgba(255, 255, 255, 0.93);
  border: 1px solid rgba(15, 185, 165, 0.15);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  color: #0d2d29;
  box-shadow: 0 10px 30px rgba(13, 46, 41, 0.08);
}

.state-card.error {
  border-color: rgba(220, 38, 38, 0.25);
  color: #991b1b;
}

.state-card h2 {
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  border: 3px solid rgba(15, 185, 165, 0.2);
  border-top-color: #0fb9a5;
  margin: 0 auto 1rem;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.proposal-list {
  display: grid;
  gap: 1.25rem;
}

.proposal-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(15, 185, 165, 0.12);
  box-shadow: 0 12px 32px rgba(13, 46, 41, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.proposal-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 40px rgba(13, 46, 41, 0.15);
}

.proposal-header,
.proposal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.status-pill {
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-pill.pending {
  background: rgba(249, 168, 37, 0.15);
  color: #b45309;
}

.status-pill.accepted {
  background: rgba(34, 197, 94, 0.15);
  color: #15803d;
}

.status-pill.rejected {
  background: rgba(220, 38, 38, 0.15);
  color: #b91c1c;
}

.proposal-preview {
  color: #1f2937;
  font-size: 0.95rem;
  line-height: 1.5;
  max-height: 4.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: #4b5563;
}

.agent-email {
  color: #0d8e7d;
  font-weight: 500;
}

.view-button {
  padding: 0.5rem 0.9rem;
  border-radius: 9999px;
  border: none;
  background: #0fb9a5;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.view-button:hover {
  background: #0d8e7d;
}

@media (max-width: 640px) {
  .proposal-card {
    padding: 1.25rem;
  }

  .proposal-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .view-button {
    width: 100%;
    text-align: center;
  }
}
</style>

<template>
  <div class="proposal-detail">
    <header class="header">
      <button class="back-button" @click="goBack" aria-label="Back to proposals">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>
      <div>
        <h1>Proposal Details</h1>
        <p v-if="jobId" class="job-id">Job ID: {{ jobId }}</p>
      </div>
    </header>

    <main class="content">
      <div v-if="loading" class="state-card">
        <div class="spinner" />
        <p>Loading proposal...</p>
      </div>

      <div v-else-if="error" class="state-card error">
        <h2>Error</h2>
        <p>{{ error }}</p>
      </div>

      <article v-else-if="proposal" class="detail-card">
        <header class="detail-header">
          <h2>{{ proposalTitle }}</h2>
          <span class="status" :class="statusClass(proposal.proposal_status)">
            {{ formatStatus(proposal.proposal_status) }}
          </span>
        </header>

        <section class="detail-section">
          <h3>Submitted Proposal</h3>
          <p class="proposal-text">{{ proposal.proposal }}</p>
        </section>

        <section class="agent-summary">
          <h3>Agent Overview</h3>
          <div class="agent-details">
            <div>
              <h4>Name</h4>
              <p>{{ agentName }}</p>
            </div>
            <div>
              <h4>Email</h4>
              <p>{{ agentEmail }}</p>
            </div>
            <div>
              <h4>Status</h4>
              <p>{{ agentProfile?.status || 'Unknown' }}</p>
            </div>
          </div>
        </section>

        <section class="detail-grid">
          <div class="detail-box">
            <h4>Submitted</h4>
            <p>{{ formatTimestamp(proposal.date_created) }}</p>
          </div>
          <div class="detail-box">
            <h4>Last Updated</h4>
            <p>{{ formatTimestamp(proposal.last_updated) }}</p>
          </div>
        </section>

        <section class="actions">
          <div v-if="actionSuccess" class="action-message success">{{ actionSuccess }}</div>
          <div v-if="actionError" class="action-message error">{{ actionError }}</div>

          <div class="action-controls">
            <button
              class="approve-btn"
              :disabled="actionLoading || proposal.proposal_status === 'accepted'"
              @click="approveProposal"
            >
              {{ actionLoading && !actionError ? 'Processing...' : 'Approve Proposal' }}
            </button>
            <div
              v-if="proposal.proposal_status !== 'accepted'"
              class="reject-block"
            >
              <textarea
                v-model="rejectionReason"
                rows="2"
                class="reject-reason"
                placeholder="Add rejection reason"
                :disabled="actionLoading"
              />
              <button
                class="reject-btn"
                :disabled="actionLoading || proposal.proposal_status === 'rejected'"
                @click="rejectProposal"
              >
                Reject Proposal
              </button>
            </div>
          </div>
        </section>
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { applicationsService } from '@/services/applicationsService'
import type { ApplicationOut, AgentOut } from '@/types/api'

const route = useRoute()
const router = useRouter()

const jobId = ref('')
const proposalId = ref('')
const proposal = ref<ApplicationOut | null>(null)
const agentProfile = ref<AgentOut | null>(null)
const storedProposalMeta = ref<{ id?: string; job_id?: string; agent_name?: string; agent_email?: string; agent_directory?: Record<string, { name?: string; email?: string }> } | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const actionLoading = ref(false)
const actionError = ref<string | null>(null)
const actionSuccess = ref<string | null>(null)

const proposalTitle = computed(() => {
  const name = agentName.value
  if (name && name !== 'Not provided') {
    return `Proposal from ${name}`
  }
  return 'Proposal'
})

const syncRouteParams = () => {
  const jobValue = route.query.jobId
  jobId.value = typeof jobValue === 'string' ? jobValue : Array.isArray(jobValue) ? jobValue[0] ?? '' : ''
  proposalId.value = typeof route.params.id === 'string' ? route.params.id : ''

  try {
    const stored = localStorage.getItem('selectedClientProposal')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed && typeof parsed === 'object') {
        if (!proposalId.value || parsed.id === proposalId.value) {
          storedProposalMeta.value = parsed
        }
      }
    } else {
      storedProposalMeta.value = null
    }
  } catch (err) {
    console.warn('ClientProposalDetail: unable to read stored proposal metadata', err)
    storedProposalMeta.value = null
  }
}

const loadProposal = async () => {
  if (!proposalId.value || !jobId.value) {
    proposal.value = null
    error.value = 'Missing proposal or job identifier.'
    return
  }

  loading.value = true
  error.value = null

  try {
    const response = await applicationsService.getClientApplicationById({ id: proposalId.value, job_id: jobId.value })
    if (response.success && response.data) {
      const base = response.data
      const meta = storedProposalMeta.value
      proposal.value = {
        ...base,
        agent_name: base.agent_name || meta?.agent_name,
        agent_email: base.agent_email || meta?.agent_email
      }
    } else {
      error.value = response.error || 'Failed to load proposal details.'
    }
  } catch (err: any) {
    error.value = err?.message || 'Failed to load proposal details.'
  } finally {
    loading.value = false
  }
}

const agentName = computed(() => {
  if (agentProfile.value?.full_name) return agentProfile.value.full_name
  if (proposal.value?.agent_name) return proposal.value.agent_name
  if (storedProposalMeta.value?.agent_name) return storedProposalMeta.value.agent_name
  const directory = storedProposalMeta.value?.agent_directory
  if (directory && proposal.value?.agent_id && directory[proposal.value.agent_id]?.name) {
    return directory[proposal.value.agent_id]?.name as string
  }
  return 'Not provided'
})

const agentEmail = computed(() => {
  if (agentProfile.value?.email) return agentProfile.value.email
  if (proposal.value?.agent_email) return proposal.value.agent_email
  if (storedProposalMeta.value?.agent_email) return storedProposalMeta.value.agent_email
  const directory = storedProposalMeta.value?.agent_directory
  if (directory && proposal.value?.agent_id && directory[proposal.value.agent_id]?.email) {
    return directory[proposal.value.agent_id]?.email as string
  }
  return 'Not provided'
})

const approveProposal = async () => {
  if (!jobId.value || !proposalId.value) return
  actionLoading.value = true
  actionError.value = null
  actionSuccess.value = null
  try {
    const response = await applicationsService.approveAgentApplication(jobId.value, { id: proposalId.value })
    if (response.success && response.data) {
      proposal.value = response.data
      actionSuccess.value = 'Proposal approved successfully.'
    } else {
      actionError.value = response.error || 'Failed to approve proposal.'
    }
  } catch (err: any) {
    actionError.value = err?.message || 'Failed to approve proposal.'
  } finally {
    actionLoading.value = false
  }
}

const rejectionReason = ref('')

const rejectProposal = async () => {
  if (!jobId.value || !proposalId.value) return
  if (!rejectionReason.value.trim()) {
    actionError.value = 'Please provide a reason for rejection.'
    return
  }
  actionLoading.value = true
  actionError.value = null
  actionSuccess.value = null
  try {
    const response = await applicationsService.rejectAgentApplication(jobId.value, {
      application_id: proposalId.value,
      rejection_reason: rejectionReason.value.trim()
    })
    if (response.success && response.data) {
      proposal.value = response.data
      actionSuccess.value = 'Proposal rejected successfully.'
    } else {
      actionError.value = response.error || 'Failed to reject proposal.'
    }
  } catch (err: any) {
    actionError.value = err?.message || 'Failed to reject proposal.'
  } finally {
    actionLoading.value = false
  }
}

watch(
  () => ({ id: route.params.id, jobId: route.query.jobId }),
  () => {
    syncRouteParams()
    loadProposal()
  },
  { immediate: true }
)

const goBack = () => {
  router.back()
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

const normalizeTimestamp = (timestamp?: number | null) => {
  if (!timestamp) return 0
  return timestamp > 1_000_000_000_000 ? timestamp : timestamp * 1000
}

const formatTimestamp = (timestamp?: number | null) => {
  if (!timestamp) return '—'
  const date = new Date(normalizeTimestamp(timestamp))
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

onMounted(() => {
  syncRouteParams()
  loadProposal()
})
</script>

<style scoped>
.proposal-detail {
  min-height: 100vh;
  background: linear-gradient(135deg, #0fb9a5, #0d8e7d);
  padding-bottom: 2.5rem;
}

.header {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid rgba(15, 185, 165, 0.15);
  backdrop-filter: blur(10px);
  z-index: 10;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0d2d29;
}

.job-id {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: #0d8e7d;
  font-family: 'Fira Code', monospace;
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

.spinner {
  width: 2rem;
  height: 2rem;
  margin: 0 auto 1rem;
  border-radius: 9999px;
  border: 3px solid rgba(15, 185, 165, 0.2);
  border-top-color: #0fb9a5;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.detail-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.25rem;
  padding: 2rem;
  color: #0d2d29;
  box-shadow: 0 18px 40px rgba(13, 46, 41, 0.12);
  border: 1px solid rgba(15, 185, 165, 0.12);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.detail-header h2 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
}

.status {
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status.pending {
  background: rgba(249, 168, 37, 0.15);
  color: #b45309;
}

.status.accepted {
  background: rgba(34, 197, 94, 0.15);
  color: #15803d;
}

.status.rejected {
  background: rgba(220, 38, 38, 0.15);
  color: #b91c1c;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.proposal-text {
  margin: 0;
  line-height: 1.6;
  white-space: pre-line;
}

.detail-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.agent-summary {
  margin-bottom: 1.5rem;
}

.agent-summary h3 {
  margin-bottom: 0.75rem;
  font-size: 1.15rem;
  font-weight: 600;
  color: #0d8e7d;
}

.agent-details {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.agent-details div {
  padding: 1rem;
  background: rgba(15, 185, 165, 0.05);
  border-radius: 0.9rem;
  border: 1px solid rgba(15, 185, 165, 0.12);
}

.agent-details h4 {
  margin-bottom: 0.35rem;
  font-size: 0.85rem;
  color: #0d8e7d;
  font-weight: 600;
}

.agent-details p {
  margin: 0;
  font-size: 0.95rem;
}

.actions {
  margin-top: 2rem;
  border-top: 1px solid rgba(15, 185, 165, 0.15);
  padding-top: 1.5rem;
}

.action-message {
  margin-bottom: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
}

.action-message.success {
  background: rgba(34, 197, 94, 0.15);
  color: #166534;
  border: 1px solid rgba(34, 197, 94, 0.25);
}

.action-message.error {
  background: rgba(220, 38, 38, 0.1);
  color: #b91c1c;
  border: 1px solid rgba(220, 38, 38, 0.2);
}

.action-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.approve-btn,
.reject-btn {
  border-radius: 9999px;
  font-weight: 600;
  padding: 0.85rem 1.75rem;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.approve-btn {
  background: linear-gradient(135deg, #0fb9a5, #0d8e7d);
  color: white;
  box-shadow: 0 10px 25px rgba(15, 185, 165, 0.25);
}

.approve-btn:disabled {
  background: rgba(15, 185, 165, 0.35);
  cursor: not-allowed;
  box-shadow: none;
}

.reject-block {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: flex-start;
}

.reject-reason {
  flex: 1 1 200px;
  min-width: 0;
  border-radius: 0.75rem;
  border: 1px solid rgba(15, 185, 165, 0.25);
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  resize: vertical;
}

.reject-btn {
  background: rgba(220, 38, 38, 0.15);
  color: #b91c1c;
  border: 1px solid rgba(220, 38, 38, 0.2);
}

.reject-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.detail-box {
  padding: 1rem;
  background: rgba(15, 185, 165, 0.05);
  border-radius: 0.9rem;
  border: 1px solid rgba(15, 185, 165, 0.12);
}

.detail-box h4 {
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: #0d8e7d;
  font-weight: 600;
}

.detail-box p {
  margin: 0;
  font-size: 0.95rem;
  word-break: break-word;
}
</style>

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
          <h2 class="inline">{{ proposalTitle }}</h2>
        <span class="ml-3 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
          :class="(proposal as any).proposer_type === 'admin' ? 'bg-indigo-100 text-indigo-800' : (proposal as any).proposer_type === 'agent' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
          :title="(proposal as any).proposer_type === 'admin' ? 'Recommended by admin' : (proposal as any).proposer_type === 'agent' ? 'Submitted by agent' : 'Unknown proposer'">
          <svg v-if="(proposal as any).proposer_type === 'admin'" class="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M10 2l2.09 4.24L17 7.27l-3.5 2.86L14.18 16 10 13.77 5.82 16l.68-5.87L3 7.27l4.91-.98L10 2z"/></svg>
          <svg v-else-if="(proposal as any).proposer_type === 'agent'" class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          {{ (proposal as any).proposer_type === 'admin' ? 'Proposed by Admin' : (proposal as any).proposer_type === 'agent' ? 'Submitted by Agent' : 'Unknown' }}
        </span>
        <span class="status" :class="statusClass(resolveProposalStatus(proposal as any))">
          {{ formatStatus(resolveProposalStatus(proposal as any)) }}
        </span>
        <p class="text-sm text-gray-600 mt-1" v-if="(proposal as any).proposer_type === 'admin'">Recommended by an admin - this is a curated suggestion intended to speed up hiring.</p>
        <p class="text-sm text-gray-600 mt-1" v-else-if="(proposal as any).proposer_type === 'agent'">Submitted directly by the agent who applied for this job.</p>
        </header>

        <section class="detail-section">
          <h3>Submitted Proposal</h3>
          <p class="proposal-text">{{ proposal.proposal }}</p>
        </section>

        <section v-if="hasAgentInfo" class="agent-summary">
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
          <div class="detail-box">
            <h4>Proposed Budget</h4>
            <p v-if="displayBudget !== null">${{ displayBudget }}</p>
            <p v-else>Not provided</p>
          </div>
          <div class="detail-box" v-if="serviceAmount !== null || chargesAmount !== null || taxAmount !== null">
            <h4>Service / Charges / Tax</h4>
            <p>Service: {{ serviceAmount !== null ? serviceAmount : 'Not provided' }}</p>
            <p>Charges: {{ chargesAmount !== null ? chargesAmount : 'Not provided' }}</p>
            <p>Tax: {{ taxAmount !== null ? taxAmount : 'Not provided' }}</p>
          </div>
          <div class="detail-box">
            <h4>Start Date</h4>
            <p>{{ displayTimelineStart }}</p>
          </div>
          <div class="detail-box">
            <h4>Deadline</h4>
            <p>{{ displayTimelineDeadline }}</p>
          </div>
        </section>

        <section class="actions">
          <div v-if="actionSuccess" class="action-message success">{{ actionSuccess }}</div>
          <div v-if="actionError" class="action-message error">{{ actionError }}</div>

          <div class="action-controls">
            <button
              class="approve-btn"
              :disabled="actionLoading || proposal.proposal_status === 'accepted'"
              @click="approveProposalDirectly"
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
import { useToast } from 'vue-toastification'
import { useRoute, useRouter } from 'vue-router' 
import { applicationsService, acceptAdminProposal, rejectAdminProposal } from '@/services/applicationsService'
import apiClient from '@/services/apiClient'
import { agentsService } from '@/services/agentsService'
import { jobsService } from '@/services/jobsService'

import type { ApplicationOut, AgentOut, Job } from '@/types/api'

type JobLike = Partial<Job> & {
  break_down?: {
    Charges?: number
    Tax?: number
    service?: number
    Service?: number
    charges?: number
    tax?: number
  }
  timeline?: {
    start_date?: number | string | null
    deadline?: number | string | null
    startDate?: number | string | null
    endDate?: number | string | null
  }
  agents?: any[]
  recommended_agents?: any[]
  selected_agents?: any[]
  project_title?: string
}

const route = useRoute()
const router = useRouter()
const toast = useToast()

const jobId = ref('')
const proposalId = ref('')
const proposal = ref<(ApplicationOut & Record<string, any>) | null>(null)
const cachedJob = ref<JobLike | null>(null)
const agentProfile = ref<AgentOut | null>(null)
const storedProposalMeta = ref<{
  id?: string
  job_id?: string
  agent_name?: string
  agent_email?: string
  budget?: number | string
  break_down?: {
    Charges?: number
    Tax?: number
    service?: number
    Service?: number
    charges?: number
    tax?: number
  }
  agent_directory?: Record<string, { name?: string; email?: string }>
} | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const actionLoading = ref(false)
const actionError = ref<string | null>(null)
const actionSuccess = ref<string | null>(null)
const rejectionReason = ref('')


const proposalTitle = computed(() => {
  const proposerType = (proposal.value as any)?.proposer_type
  const name = agentName.value && agentName.value !== 'Not provided' ? agentName.value : ''
  if (proposerType === 'admin') {
    return name ? `Admin recommendation for ${name}` : 'Admin recommendation'
  }
  if (proposerType === 'agent') {
    return name ? `Proposal from ${name}` : 'Agent proposal'
  }
  if (name) {
    return `Proposal from ${name}`
  }
  if (cachedJob.value?.title || cachedJob.value?.project_title) {
    return `Proposal for ${cachedJob.value.title || cachedJob.value.project_title}`
  }
  return 'Proposal'
})

const hasAgentInfo = computed(() => {
  return Boolean(
    (agentName.value && agentName.value !== 'Not provided') ||
    (agentEmail.value && agentEmail.value !== 'Not provided') ||
    proposal.value?.agent_id
  )
})

const resolveNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) return null
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

const resolveAmount = (value: unknown): number | null => {
  const num = resolveNumber(value)
  if (num === null) return null
  return num > 0 ? num : null
}

const resolveBreakdown = (source: Record<string, any> | null | undefined) => {
  if (!source || typeof source !== 'object') return null
  const breakdown =
    source.break_down ||
    source.breakdown ||
    source.breakDown ||
    source.proposal_break_down ||
    source.proposal_breakdown ||
    source.pricing ||
    source.cost_breakdown
  if (breakdown && typeof breakdown === 'object') {
    return breakdown as Record<string, any>
  }
  return null
}

const computeProposerType = (raw: Record<string, any>): 'agent'|'admin'|'unknown' => {
  const role = String(raw.proposal_created_by_role || raw.created_by_role || raw.proposer_role || raw.created_by || '').toLowerCase()
  if (role.includes('admin')) return 'admin'
  if (role.includes('agent')) return 'agent'

  const via = String(raw.proposal_created_via || raw.created_via || raw.proposer_via || '').toLowerCase()
  if (via.includes('admin')) return 'admin'
  if (via.includes('agent')) return 'agent'

  const nested = raw.agent || raw.agent_profile || raw.agent_details || raw.agentInfo || raw.agentData
  if (raw.agent_id) return 'agent'
  if (nested && (nested.full_name || nested.name || nested.email)) return 'admin'
  return 'unknown'
}

const displayBudget = computed(() => {
  const proposalBudget = resolveAmount((proposal.value as any)?.budget ?? (proposal.value as any)?.amount)
  if (proposalBudget !== null) return proposalBudget

  const proposalBreakdown = resolveBreakdown(proposal.value as any) || resolveBreakdown(storedProposalMeta.value as any)
  const proposalService = resolveAmount(
    proposalBreakdown?.service ??
    proposalBreakdown?.Service ??
    proposalBreakdown?.service_amount ??
    proposalBreakdown?.ServiceAmount ??
    proposalBreakdown?.amount ??
    proposalBreakdown?.total
  )
  if (proposalService !== null) return proposalService

  const jobBudget = resolveAmount((cachedJob.value as any)?.budget)
  if (jobBudget !== null) return jobBudget

  const jobBreakdown = resolveBreakdown(cachedJob.value as any)
  const jobService = resolveAmount(jobBreakdown?.service ?? jobBreakdown?.Service ?? jobBreakdown?.service_amount ?? jobBreakdown?.ServiceAmount)
  return jobService
})

const serviceAmount = computed(() => {
  const breakdown = resolveBreakdown(proposal.value as any) || resolveBreakdown(storedProposalMeta.value as any)
  const proposalService = resolveAmount(breakdown?.service ?? breakdown?.Service ?? breakdown?.service_amount ?? breakdown?.ServiceAmount)
  if (proposalService !== null) return proposalService
  const jobBreakdown = resolveBreakdown(cachedJob.value as any)
  const jobService = resolveAmount(jobBreakdown?.service ?? jobBreakdown?.Service ?? jobBreakdown?.service_amount ?? jobBreakdown?.ServiceAmount)
  return jobService
})

const chargesAmount = computed(() => {
  const breakdown = resolveBreakdown(proposal.value as any) || resolveBreakdown(storedProposalMeta.value as any)
  const proposalCharges = resolveNumber(breakdown?.Charges ?? breakdown?.charges ?? breakdown?.charges_amount ?? breakdown?.chargesAmount)
  if (proposalCharges !== null) return proposalCharges
  const jobBreakdown = resolveBreakdown(cachedJob.value as any)
  const jobCharges = resolveNumber(jobBreakdown?.Charges ?? jobBreakdown?.charges ?? jobBreakdown?.charges_amount ?? jobBreakdown?.chargesAmount)
  return jobCharges
})

const taxAmount = computed(() => {
  const breakdown = resolveBreakdown(proposal.value as any) || resolveBreakdown(storedProposalMeta.value as any)
  const proposalTax = resolveNumber(breakdown?.Tax ?? breakdown?.tax ?? breakdown?.tax_amount ?? breakdown?.taxAmount)
  if (proposalTax !== null) return proposalTax
  const jobBreakdown = resolveBreakdown(cachedJob.value as any)
  const jobTax = resolveNumber(jobBreakdown?.Tax ?? jobBreakdown?.tax ?? jobBreakdown?.tax_amount ?? jobBreakdown?.taxAmount)
  return jobTax
})

const extractTimestamp = (input?: any): number | null => {
  if (!input) return null
  if (typeof input === 'number') return input
  const maybeNumber = Number(input)
  if (Number.isFinite(maybeNumber)) return maybeNumber
  const parsed = Date.parse(input)
  return Number.isFinite(parsed) ? parsed : null
}

const timelineStart = computed(() => {
  const fromProposal = extractTimestamp((proposal.value as any)?.timeline?.start_date ?? (proposal.value as any)?.timeline?.startDate)
  if (fromProposal) return fromProposal
  const fromJob = extractTimestamp(
    cachedJob.value?.timeline?.start_date ??
    cachedJob.value?.timeline?.startDate
  )
  return fromJob
})

const timelineDeadline = computed(() => {
  const fromProposal = extractTimestamp((proposal.value as any)?.timeline?.deadline ?? (proposal.value as any)?.timeline?.endDate)
  if (fromProposal) return fromProposal
  const fromJob = extractTimestamp(
    cachedJob.value?.timeline?.deadline ??
    cachedJob.value?.timeline?.endDate
  )
  return fromJob
})

const displayTimelineStart = computed(() => {
  return timelineStart.value ? formatTimestamp(timelineStart.value) : 'Not provided'
})

const displayTimelineDeadline = computed(() => {
  return timelineDeadline.value ? formatTimestamp(timelineDeadline.value) : 'Not provided'
})

const agentFromCachedJob = computed(() => {
  if (!cachedJob.value) return null
  const candidateLists = [
    cachedJob.value.selected_agents,
    cachedJob.value.agents,
    cachedJob.value.recommended_agents
  ].filter(Boolean) as any[][]

  const flatList = candidateLists.flat().filter(Boolean)
  if (!flatList.length) return null

  if (proposal.value?.agent_id) {
    const matched = flatList.find(agent => String(agent?.id || agent?.agent_id || agent?._id) === String(proposal.value?.agent_id))
    if (matched) return matched
  }
  return flatList[0]
})

const agentName = computed(() => {
  if (agentProfile.value?.full_name) return agentProfile.value.full_name
  if (proposal.value?.agent_name) return proposal.value.agent_name
  if (storedProposalMeta.value?.agent_name) return storedProposalMeta.value.agent_name
  if (agentFromCachedJob.value) {
    return (
      agentFromCachedJob.value.full_name ||
      agentFromCachedJob.value.name ||
      agentFromCachedJob.value.display_name ||
      agentFromCachedJob.value.username ||
      agentFromCachedJob.value.email ||
      'Not provided'
    )
  }
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
  if (agentFromCachedJob.value) {
    return (
      agentFromCachedJob.value.email ||
      agentFromCachedJob.value.contact_email ||
      agentFromCachedJob.value.user_email ||
      'Not provided'
    )
  }
  const directory = storedProposalMeta.value?.agent_directory
  if (directory && proposal.value?.agent_id && directory[proposal.value.agent_id]?.email) {
    return directory[proposal.value.agent_id]?.email as string
  }
  return 'Not provided'
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

const hydrateJobFromStorage = () => {
  try {
    const stored = localStorage.getItem('selectedClientProject') || localStorage.getItem('selectedProject')
    if (!stored) return
    const parsed = JSON.parse(stored)
    const id = String(parsed?.id || parsed?.job_id || '')
    if (id && jobId.value && id === jobId.value) {
      cachedJob.value = parsed
    }
  } catch (err) {
    console.warn('ClientProposalDetail: unable to hydrate job from storage', err)
  }
}

const hydrateJob = async () => {
  if (!jobId.value) return
  hydrateJobFromStorage()
  if (cachedJob.value) {
    const breakdown = cachedJob.value?.break_down
    const hasBreakdown =
      resolveNumber(breakdown?.service ?? breakdown?.Service) !== null ||
      resolveNumber(breakdown?.Charges ?? breakdown?.charges) !== null ||
      resolveNumber(breakdown?.Tax ?? breakdown?.tax) !== null
    const hasBudget = resolveNumber((cachedJob.value as any)?.budget) !== null
    if (hasBreakdown || hasBudget) return
  }

  const response = await jobsService.getJobById(jobId.value)
  if (response.success && response.data) {
    cachedJob.value = response.data as unknown as JobLike
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
    // Ensure we have a client token; try refreshing if missing or wrong role
    let token = localStorage.getItem('access_token')
    let role = (localStorage.getItem('userRole') || '').toLowerCase()
    if (!token || role !== 'client') {
      try {
        const { refreshSession } = await import('@/utils/auth')
        const refreshed = await refreshSession()
        console.debug('loadProposal: refreshSession result', refreshed)
        token = localStorage.getItem('access_token')
        role = (localStorage.getItem('userRole') || '').toLowerCase()
      } catch (refreshErr) {
        console.warn('loadProposal: refresh attempt failed', refreshErr)
      }
    }

    if (!token || role !== 'client') {
      error.value = 'Session expired. Please sign in again.'
      try { toast.error('Session expired. Please sign in again.') } catch {}
      return
    }

    const response = await applicationsService.getClientApplicationById({ id: proposalId.value, job_id: jobId.value })
    if (response.success && response.data) {
      const base = response.data
      const meta = storedProposalMeta.value
      const metaBreakdown = resolveBreakdown(meta as Record<string, any> | null)
      const baseBreakdown = resolveBreakdown(base as Record<string, any>)
      proposal.value = {
        ...base,
        agent_name: base.agent_name || meta?.agent_name,
        agent_email: base.agent_email || meta?.agent_email,
        budget: (base as any).budget ?? meta?.budget,
        break_down: baseBreakdown || metaBreakdown || (base as any).break_down
      }
      ;(proposal.value as any).proposer_type = computeProposerType(base)
      await hydrateJob()

      // Proactively fetch agent profile so UI can display Name / Email / Status
      try {
        if (!agentProfile.value) {
          // Skip fetching agent details when unauthenticated to avoid 401/500 errors
          const token = localStorage.getItem('access_token')
          if (!token) {
            console.warn('Skipping agent fetch: no access token present')
          } else {
            let fetchedAgent: Record<string, any> | null = null
            if (proposal.value?.agent_id) {
              try {
                const fetched = await fetchAgentById(String(proposal.value.agent_id))
                if (fetched) {
                  agentProfile.value = fetched as AgentOut
                  fetchedAgent = fetched
                }
              } catch (e) {
                console.warn('Agent fetch by id failed:', e)
              }
            }

            if (!fetchedAgent && proposal.value?.agent_email) {
              try {
                const fetched = await fetchAgentByEmail(String(proposal.value.agent_email))
                if (fetched) {
                  agentProfile.value = fetched as AgentOut
                  fetchedAgent = fetched
                }
              } catch (e) {
                console.warn('Agent fetch by email failed:', e)
              }
            }

            if (fetchedAgent) {
              // populate missing display fields from fetched profile
              if (!proposal.value.agent_name && (fetchedAgent.full_name || fetchedAgent.name)) {
                ;(proposal.value as any).agent_name = fetchedAgent.full_name || fetchedAgent.name
              }
              if (!proposal.value.agent_email && fetchedAgent.email) {
                ;(proposal.value as any).agent_email = fetchedAgent.email
              }

              ;(agentProfile.value as any).status = (agentProfile.value as any).status || ((agentProfile.value as any).verified ? 'Verified' : 'Unknown')
            }
          }
        }
      } catch (e) {
        // Non-fatal: keep the UI working even if agent fetch fails
        console.warn('Failed to fetch agent profile for proposal:', e)
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

const approveProposalDirectly = async () => {
  if (!jobId.value || !proposalId.value) return

  actionError.value = null
  actionSuccess.value = null
  actionLoading.value = true

  try {
    // Ensure we have a client token; try refreshing if missing or wrong role
    let token = localStorage.getItem('access_token')
    let role = (localStorage.getItem('userRole') || '').toLowerCase()
    if (!token || role !== 'client') {
      try {
        const { refreshSession } = await import('@/utils/auth')
        const refreshed = await refreshSession()
        console.debug('approveProposalDirectly: refreshSession result', refreshed)
        token = localStorage.getItem('access_token')
        role = (localStorage.getItem('userRole') || '').toLowerCase()
      } catch (refreshErr) {
        console.warn('approveProposalDirectly: refresh attempt failed', refreshErr)
      }
    }

    if (!token || role !== 'client') {
      actionError.value = 'Session expired. Please sign in again.'
      try { toast.error('Session expired. Please sign in again.') } catch {}
      return
    }

    let agentPayload = await resolveAgentForApproval()
    if (!agentPayload) {
      actionError.value = 'Unable to resolve agent identifier required for approval.'
      try { toast.error(actionError.value) } catch {}
      return
    }

    const response = await acceptAdminProposal(jobId.value, [agentPayload])
    if (response.success) {
      proposal.value = { ...(proposal.value as any), proposal_status: 'accepted' }
      actionSuccess.value = 'Proposal approved successfully.'
      try { toast.success('Proposal approved successfully.') } catch {}
    } else {
      actionError.value = response.error || 'Failed to approve proposal.'
      try { toast.error(actionError.value) } catch {}
    }
  } catch (err: any) {
    actionError.value = err?.message || 'Failed to approve proposal.'
    try { toast.error(actionError.value) } catch {}
  } finally {
    actionLoading.value = false
  }
}



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
    const response = await rejectAdminProposal(jobId.value, rejectionReason.value.trim())
    if (response.success) {
      proposal.value = { ...(proposal.value as any), proposal_status: 'rejected' }
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

const resolveAgentForApproval = async (): Promise<Record<string, any> | null> => {
  const cachedAgent = agentFromCachedJob.value && typeof agentFromCachedJob.value === 'object'
    ? (agentFromCachedJob.value as any)
    : null

  const cachedEmail = cachedAgent?.email || cachedAgent?.user_email || cachedAgent?.contact_email
  const cachedName =
    cachedAgent?.full_name ||
    cachedAgent?.name ||
    cachedAgent?.display_name ||
    cachedAgent?.username ||
    cachedAgent?.email
  const cachedId = cachedAgent?.id || cachedAgent?._id || cachedAgent?.uuid || cachedAgent?.agent_id

  const fallbackEmail =
    proposal.value?.agent_email ||
    storedProposalMeta.value?.agent_email ||
    cachedEmail ||
    agentProfile.value?.email
  const fallbackName =
    proposal.value?.agent_name ||
    storedProposalMeta.value?.agent_name ||
    cachedName ||
    agentProfile.value?.full_name ||
    (agentProfile.value as any)?.name
  const fallbackId =
    proposal.value?.agent_id ||
    cachedId ||
    agentProfile.value?.id ||
    (agentProfile.value as any)?._id ||
    (agentProfile.value as any)?.uuid ||
    (agentProfile.value as any)?.agent_id
  const safeEmail = fallbackEmail || (fallbackId ? `agent-${fallbackId}@example.com` : '')
  const safeName = fallbackName || (fallbackId ? `Agent ${String(fallbackId).slice(-6)}` : '')

  const minimalPayload = buildAgentPayload({
    id: fallbackId,
    email: safeEmail,
    full_name: safeName,
    name: safeName
  })
  if (minimalPayload) return minimalPayload

  // Prefer full agent data from cached job details
  if (cachedAgent) {
    const payload = buildAgentPayload({
      ...cachedAgent,
      email: cachedAgent?.email || fallbackEmail
    })
    if (payload) return payload
  }

  // If we already hydrated agent profile elsewhere, use it
  if (agentProfile.value) {
    const payload = buildAgentPayload({
      ...agentProfile.value,
      email: agentProfile.value?.email || fallbackEmail
    })
    if (payload) return payload
  }

  const agentId = proposal.value?.agent_id
  if (agentId) {
    const fetched = await fetchAgentById(String(agentId))
    if (fetched) {
      agentProfile.value = fetched as AgentOut
      const payload = buildAgentPayload({
        ...fetched,
        email: fetched?.email || fallbackEmail
      })
      if (payload) return payload
    }
  }

  // Try to fetch agent profile by email when no identifier is available
  const agentEmailValue = fallbackEmail
  if (agentEmailValue) {
    const fetched = await fetchAgentByEmail(String(agentEmailValue))
    if (fetched) {
      agentProfile.value = fetched as AgentOut
      const payload = buildAgentPayload({
        ...fetched,
        email: fetched?.email || agentEmailValue
      })
      if (payload) return payload
    }
  }

  return null
}

const fetchAgentById = async (id: string): Promise<Record<string, any> | null> => {
  const role = (localStorage.getItem('userRole') || '').toLowerCase()

  if (role === 'client') {
    try {
      const resp = await apiClient.get('/v1/agents/client/me', { params: { agent_id: id } })
      const data = resp?.data?.data
      if (data && typeof data === 'object') {
        return data
      }
    } catch (err: any) {
      const status = err?.response?.status
      if (status === 404 || status === 422 || status === 500) {
        try {
          const retryResp = await apiClient.get('/v1/agents/client/me', { params: { id } })
          const retryData = retryResp?.data?.data
          if (retryData && typeof retryData === 'object') {
            return retryData
          }
        } catch (retryErr) {
          console.warn('fetchAgentById (client) retry failed:', retryErr)
        }
      } else {
        console.warn('fetchAgentById (client) failed:', err)
      }
    }
    return null
  }

  try {
    const response = await agentsService.getAgentById(id)
    if (response.success && response.data) {
      return response.data
    }
  } catch (err) {
    console.warn('fetchAgentById failed:', err)
  }

  if (role !== 'admin') {
    return null
  }

  try {
    const resp = await apiClient.get('/v1/users/', { params: { role: 'agent', id, start: 0, stop: 1 } })
    const data = resp?.data?.data
    const list = Array.isArray(data) ? data : data ? [data] : []
    return list[0] || null
  } catch (err: any) {
    if (err?.response?.status && err.response.status !== 401) {
      console.warn('fetchAgentById fallback (/v1/users) failed:', err)
    }
  }
  return null
}

const fetchAgentByEmail = async (email: string): Promise<Record<string, any> | null> => {
  const role = (localStorage.getItem('userRole') || '').toLowerCase()
  if (role !== 'admin') return null

  try {
    const resp = await apiClient.get('/v1/users/', { params: { role: 'agent', email, start: 0, stop: 1 } })
    const data = resp?.data?.data
    const list = Array.isArray(data) ? data : data ? [data] : []
    let result = list[0] || null

    // If result present but missing profile fields, try to fetch by id if available
    if (result && (!result.full_name || !result.email || Object.keys(result).length <= 2) && result.id) {
      try {
        console.debug('fetchAgentByEmail: list response missing fields — trying /v1/users/{id} fallback', { id: result.id })
        const detailedResp = await apiClient.get(`/v1/users/${result.id}`)
        const detailed = detailedResp?.data?.data
        if (detailed && typeof detailed === 'object') {
          result = detailed
        }
      } catch (fallbackErr) {
        console.warn('fetchAgentByEmail fallback to /v1/users/{id} failed:', fallbackErr)
      }
    }

    return result
  } catch (err: any) {
    console.error('fetchAgentByEmail failed:', err)
    if (err.response) {
      console.error('Error response data:', err.response.data)
      console.error('Error response status:', err.response.status)
      if (err.response.status === 401) {
        try {
          const { refreshSession, isRefreshRecentlyFailed } = await import('@/utils/auth')
          if (isRefreshRecentlyFailed()) {
            console.warn('Skipping refresh attempt because a recent refresh has failed')
            try { toast.info('Unable to refresh session right now. Please sign in to see agent details.') } catch {}
            return null
          }

          const refreshed = await refreshSession()
          if (refreshed) {
            const retryResp = await apiClient.get('/v1/users/', { params: { role: 'agent', email, start: 0, stop: 1 } })
            const data2 = retryResp?.data?.data
            const list2 = Array.isArray(data2) ? data2 : data2 ? [data2] : []
            let retryResult = list2[0] || null
            if (retryResult && (!retryResult.full_name || !retryResult.email || Object.keys(retryResult).length <= 2) && retryResult.id) {
              try {
                const detailedResp = await apiClient.get(`/v1/users/${retryResult.id}`)
                const detailed = detailedResp?.data?.data
                if (detailed && typeof detailed === 'object') {
                  retryResult = detailed
                }
              } catch (fallbackErr) {
                console.warn('fetchAgentByEmail retry fallback to /v1/users/{id} failed:', fallbackErr)
              }
            }
            return retryResult || null
          }
        } catch (e) {
          console.error('Token refresh and retry failed:', e)
          try { toast.error('Session refresh failed. Please sign in to continue.') } catch {}
        }
      }
    }
    return null
  }
}

const buildAgentPayload = (raw: Record<string, any>): Record<string, any> | null => {
  const ts = Math.floor(Date.now() / 1000)
  const email = String(raw?.email || raw?.user_email || '').trim()
  if (!email.includes('@')) {
    return null
  }
  const normalizeExpertise = (value: unknown): string => {
    const allowed = [
      'Web Development',
      'Mobile Development',
      'Sales',
      'Customer Service',
      'Editing',
      'Book Keeping',
      'Executive Assistant',
      'Appointment Setting',
      'Digital Marketing',
      'Data Analysis'
    ]
    if (typeof value === 'string') {
      const v = value.replace(/\xa0/g, ' ').trim().toLowerCase()
      const map: Record<string, string> = {
        'web development': 'Web Development',
        'mobile development': 'Mobile Development',
        'sales': 'Sales',
        'customer service': 'Customer Service',
        'editing': 'Editing',
        'book keeping': 'Book Keeping',
        'executive assistant': 'Executive Assistant',
        'appointment setting': 'Appointment Setting',
        'digital marketing': 'Digital Marketing',
        'data analysis': 'Data Analysis'
      }
      if (map[v]) return map[v]
      const matched = allowed.find(a => a.toLowerCase() === v)
      if (matched) return matched
    }
    return 'Web Development'
  }

  const normalizeHours = (value: unknown): number => {
    const allowed = new Set([160, 80, 40, 20])
    if (typeof value === 'number') {
      return allowed.has(value) ? value : 40
    }
    if (typeof value === 'string') {
      const v = value.trim().toLowerCase()
      const num = parseInt(v.replace(/[^0-9]/g, ''), 10)
      if (allowed.has(num)) return num
      if (v.includes('160')) return 160
      if (v.includes('80')) return 80
      if (v.includes('40')) return 40
      if (v.includes('20')) return 20
    }
    return 40
  }

  const normalizeTimezone = (value: unknown): string => {
    const allowed = [
      'UTC-12:00','UTC-11:00','UTC-10:00','UTC-09:30','UTC-09:00','UTC-08:00','UTC-07:00','UTC-06:00','UTC-05:00',
      'UTC-04:30','UTC-04:00','UTC-03:30','UTC-03:00','UTC-02:00','UTC-01:00','UTC+00:00','UTC+01:00','UTC+02:00',
      'UTC+03:00','UTC+03:30','UTC+04:00','UTC+05:00','UTC+05:30','UTC+05:45','UTC+06:00','UTC+06:30','UTC+07:00',
      'UTC+08:00','UTC+08:45','UTC+09:00','UTC+09:30','UTC+10:00','UTC+10:30','UTC+11:00','UTC+11:30','UTC+12:00',
      'UTC+12:45','UTC+13:00','UTC+14:00'
    ]
    if (typeof value === 'string') {
      const v = value.trim().toUpperCase()
      if (allowed.includes(v)) return v
    }
    return 'UTC+00:00'
  }

  return {
    id: String(raw?.id || raw?._id || raw?.uuid || ''),
    admin_approved: Boolean(raw?.admin_approved ?? true),
    full_name: String(raw?.full_name || raw?.name || ''),
    email,
    role: raw?.role || 'agent',
    phone_number: String(raw?.phone_number || raw?.contact_phone || ''),
    certificate_url: Array.isArray(raw?.certificate_url) ? raw.certificate_url : (raw?.certificates ? [].concat(raw.certificates) : []),
    video_url: String(raw?.video_url || ''),
    personality_url: String(raw?.personality_url || ''),
    company_name: String(raw?.company_name || ''),
    company_email: String(raw?.company_email || ''),
    company_address: String(raw?.company_address || ''),
    client_reason_for_signing_up: String(raw?.client_reason_for_signing_up || ''),
    client_need_agent_work_hours_to_be: String(raw?.client_need_agent_work_hours_to_be || ''),
    primary_area_of_expertise: normalizeExpertise(raw?.primary_area_of_expertise ?? raw?.expertise),
    years_of_experience: Number(raw?.years_of_experience ?? raw?.experience_years ?? 0),
    three_most_commonly_used_tools_or_platforms: Array.isArray(raw?.three_most_commonly_used_tools_or_platforms)
      ? raw.three_most_commonly_used_tools_or_platforms
      : (Array.isArray(raw?.tools) ? raw.tools.slice(0, 3) : []),
    available_hours_agent_can_commit: normalizeHours(raw?.available_hours_agent_can_commit ?? raw?.availability_hours),
    time_zone: normalizeTimezone(raw?.time_zone),
    portfolio_link: String(raw?.portfolio_link || raw?.portfolio || ''),
    is_agent_open_to_calls_and_video_meetings: Boolean(raw?.is_agent_open_to_calls_and_video_meetings ?? true),
    does_agent_have_working_computer: Boolean(raw?.does_agent_have_working_computer ?? true),
    does_agent_have_stable_internet: Boolean(raw?.does_agent_have_stable_internet ?? true),
    is_agent_comfortable_with_time_tracking_tools: Boolean(raw?.is_agent_comfortable_with_time_tracking_tools ?? true),
    date_created: Number(raw?.date_created ?? ts),
    last_updated: Number(raw?.last_updated ?? ts),
    refresh_token: String(raw?.refresh_token || ''),
    access_token: String(raw?.access_token || ''),
    password: String(raw?.password || 'masked')
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

const resolveProposalStatus = (raw: Record<string, any> | null): string => {
  if (!raw) return 'pending_review'
  return String(raw.proposal_status || raw.status || raw.proposalStatus || raw.application_status || raw.state || 'pending_review')
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

const normalizeTimestamp = (timestamp?: number | string | null) => {
  if (timestamp === null || timestamp === undefined) return 0
  if (typeof timestamp === 'string') {
    const asNumber = Number(timestamp)
    if (Number.isFinite(asNumber)) {
      timestamp = asNumber
    } else {
      const parsed = Date.parse(timestamp)
      if (Number.isFinite(parsed)) {
        return parsed
      }
      return 0
    }
  }
  const num = timestamp as number
  if (!Number.isFinite(num)) return 0
  return num > 1_000_000_000_000 ? num : num * 1000
}

const formatTimestamp = (timestamp?: number | string | null) => {
  if (!timestamp) return 'Not provided'
  const date = new Date(normalizeTimestamp(timestamp))
  if (Number.isNaN(date.getTime())) return 'Not provided'
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
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.detail-header h2 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  flex: 1 1 100%;
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

@media (max-width: 640px) {
  .detail-card {
    padding: 1.5rem;
  }

  .detail-header {
    align-items: flex-start;
  }

  .detail-header h2 {
    font-size: 1.4rem;
  }

  .detail-header .ml-3 {
    margin-left: 0;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .agent-details {
    grid-template-columns: 1fr;
  }
}
</style>

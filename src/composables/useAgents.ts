// src/composables/useAgents.ts

import { ref, computed, onMounted } from 'vue'
import { agentsService } from '../services'
import type { ApplicationOut } from '../types/api'
import type {
  AgentOut,
  AgentState,
  AgentFilters,
  PaginationParams
} from '../types/api'

interface RecommendedSeed {
  applications?: ApplicationOut[]
}

export function useAgents(seed?: RecommendedSeed) {
  const agentState = ref<AgentState>({
    agents: [],
    currentAgent: null,
    loading: false,
    error: null,
    pagination: {
      start: 0,
      stop: 10,
      hasMore: true
    }
  })

  // Computed properties
  const agents = computed(() => agentState.value.agents)
  const currentAgent = computed(() => agentState.value.currentAgent)
  const loading = computed(() => agentState.value.loading)
  const error = computed(() => agentState.value.error)
  const hasMore = computed(() => agentState.value.pagination.hasMore)

  // Get recommended agents
  const getRecommendedAgents = async (params?: PaginationParams & AgentFilters) => {
    const result = await agentsService.getRecommendedAgents(params)

    if (result.success && result.data) {
      agentState.value.agents = result.data
      agentState.value.pagination = {
        start: params?.start || 0,
        stop: params?.stop || 10,
        hasMore: result.data.length === (params?.stop || 10) - (params?.start || 0)
      }
    } else {
      agentState.value.error = result.error || 'Failed to fetch recommended agents'
    }

    return result
  }

  // Get agent by ID
  const getAgentById = async (agentId: string) => {
    const result = await agentsService.getAgentById(agentId)

    if (result.success && result.data) {
      agentState.value.currentAgent = result.data
    } else {
      agentState.value.error = result.error || 'Failed to fetch agent'
    }

    return result
  }

  // Search agents with filters
  const searchAgents = async (filters: AgentFilters, params?: PaginationParams) => {
    const result = await agentsService.searchAgents(filters, params)

    if (result.success && result.data) {
      agentState.value.agents = result.data
      agentState.value.pagination = {
        start: params?.start || 0,
        stop: params?.stop || 10,
        hasMore: result.data.length === (params?.stop || 10) - (params?.start || 0)
      }
    } else {
      agentState.value.error = result.error || 'Failed to search agents'
    }

    return result
  }

  // Get agents by skills
  const getAgentsBySkills = async (skills: string[], params?: PaginationParams) => {
    return searchAgents({ skills }, params)
  }

  // Get agents by location
  const getAgentsByLocation = async (location: string, params?: PaginationParams) => {
    return searchAgents({ location }, params)
  }

  // Get available agents
  const getAvailableAgents = async (params?: PaginationParams) => {
    return searchAgents({ status: 'Available' }, params)
  }

  // Reset state
  const resetAgents = () => {
    agentState.value.agents = []
    agentState.value.currentAgent = null
    agentState.value.pagination = {
      start: 0,
      stop: 10,
      hasMore: true
    }
    agentState.value.error = null
  }

  const clearError = () => {
    agentState.value.error = null
  }

  const seedRecommendedAgents = async (applications: ApplicationOut[]) => {
    if (!applications?.length) return

    try {
      const uniqueAgentIds = Array.from(
        new Set(
          applications
            .map(application => application.agent_id)
            .filter((id): id is string => typeof id === 'string' && id.trim().length > 0)
        )
      )

      if (!uniqueAgentIds.length) return

      const fetchedAgents: AgentOut[] = []
      for (const agentId of uniqueAgentIds) {
        const response = await agentsService.getAgentById(agentId)
        if (response.success && response.data) {
          fetchedAgents.push(response.data)
        }
      }

      if (fetchedAgents.length) {
        agentState.value.agents = fetchedAgents
        agentState.value.pagination = {
          start: 0,
          stop: fetchedAgents.length,
          hasMore: false
        }
        agentState.value.error = null
      }
    } catch (error) {
      console.error('Error seeding recommended agents:', error)
    }
  }

  // Initialize state on mount
  onMounted(async () => {
    const currentState = agentsService.getAgentState()
    agentState.value = currentState

    if (seed?.applications?.length) {
      await seedRecommendedAgents(seed.applications)
    }
  })

  return {
    // State
    agents,
    currentAgent,
    loading,
    error,
    hasMore,

    // Actions
    getRecommendedAgents,
    getAgentById,
    searchAgents,
    getAgentsBySkills,
    getAgentsByLocation,
    getAvailableAgents,
    resetAgents,
    clearError,
    seedRecommendedAgents
  }
}

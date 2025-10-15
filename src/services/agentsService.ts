// src/services/agentsService.ts
import api from './api'
import type {
  AgentOut,
  AgentState,
  AgentFilters,
  PaginationParams,
  ServiceResponse,
  ApiResponse
} from '../types/api'
export class AgentsService {
  private static instance: AgentsService
  private agentState: AgentState = {
    agents: [],
    currentAgent: null,
    loading: false,
    error: null,
    pagination: {
      start: 0,
      stop: 10,
      hasMore: true
    }
  }
  private constructor() {}
  public static getInstance(): AgentsService {
    if (!AgentsService.instance) {
      AgentsService.instance = new AgentsService()
    }
    return AgentsService.instance
  }

  /**
   * Get current agents state
   */
  getAgentState(): AgentState {
    return { ...this.agentState }
  }

  /**
   * Get recommended agents for clients
   */
  async getRecommendedAgents(params?: PaginationParams & AgentFilters): Promise<ServiceResponse<AgentOut[]>> {
    this.agentState.loading = true
    this.agentState.error = null
    try {
      const { start = 0, stop = 10 } = params || {}
      const response = await api.get<ApiResponse<AgentOut[]>>(
        `/v1/agents/recommended/${start}/${stop}`
      )
      if (response.data.status_code === 200) {
        const agents = response.data.data || []
        // Update pagination state
        this.agentState.pagination = {
          start,
          stop,
          hasMore: agents.length === stop - start
        }
        // Update agents list
        if (start === 0) {
          this.agentState.agents = agents
        } else {
          this.agentState.agents.push(...agents)
        }
        this.agentState.loading = false
        return {
          success: true,
          data: agents,
          message: `Retrieved ${agents.length} recommended agents`
        }
      } else {
        throw new Error(response.data.detail || 'Failed to fetch recommended agents')
      }
    } catch (error: any) {
      this.agentState.loading = false
      this.agentState.error = error.response?.data?.detail || error.message || 'Failed to fetch recommended agents'
      return {
        success: false,
        error: this.agentState.error || undefined
      }
    }
  }

  /**
   * Get specific agent by ID
   */
  async getAgentById(agentId: string): Promise<ServiceResponse<AgentOut>> {
    this.agentState.loading = true
    this.agentState.error = null
    try {
      const response = await api.get<ApiResponse<AgentOut>>('/v1/agents/me', {
        params: { id: agentId }
      })
      if (response.data.status_code === 200) {
        const agent = response.data.data
        // Update current agent
        this.agentState.currentAgent = agent
        this.agentState.loading = false
        return {
          success: true,
          data: agent,
          message: 'Agent retrieved successfully'
        }
      } else {
        throw new Error(response.data.detail || 'Failed to fetch agent')
      }
    } catch (error: any) {
      this.agentState.loading = false
      this.agentState.error = error.response?.data?.detail || error.message || 'Failed to fetch agent'
      return {
        success: false,
        error: this.agentState.error || undefined
      }
    }
  }

  /**
   * Get currently authenticated agent profile (no ID required)
   */
  async getCurrentAgent(): Promise<ServiceResponse<AgentOut>> {
    this.agentState.loading = true
    this.agentState.error = null
    try {
      const response = await api.get<ApiResponse<AgentOut>>('/v1/agents/me')
      if (response.data.status_code === 200) {
        const agent = response.data.data
        this.agentState.currentAgent = agent
        this.agentState.loading = false
        return {
          success: true,
          data: agent,
          message: 'Current agent retrieved successfully'
        }
      } else {
        throw new Error(response.data.detail || 'Failed to fetch current agent')
      }
    } catch (error: any) {
      this.agentState.loading = false
      this.agentState.error = error.response?.data?.detail || error.message || 'Failed to fetch current agent'
      return {
        success: false,
        error: this.agentState.error || undefined
      }
    }
  }

  /**
   * Search agents with filters
   */
  async searchAgents(filters: AgentFilters, params?: PaginationParams): Promise<ServiceResponse<AgentOut[]>> {
    this.agentState.loading = true
    this.agentState.error = null
    try {
      const { start = 0, stop = 10 } = params || {}
      const response = await api.post<ApiResponse<AgentOut[]>>(
        `/v1/agents/search/${start}/${stop}`,
        filters
      )
      if (response.data.status_code === 200) {
        const agents = response.data.data || []
        // Update pagination state
        this.agentState.pagination = {
          start,
          stop,
          hasMore: agents.length === stop - start
        }
        // Update agents list
        if (start === 0) {
          this.agentState.agents = agents
        } else {
          this.agentState.agents.push(...agents)
        }
        this.agentState.loading = false
        return {
          success: true,
          data: agents,
          message: `Found ${agents.length} agents matching criteria`
        }
      } else {
        throw new Error(response.data.detail || 'Failed to search agents')
      }
    } catch (error: any) {
      this.agentState.loading = false
      this.agentState.error = error.response?.data?.detail || error.message || 'Failed to search agents'
      return {
        success: false,
        error: this.agentState.error || undefined
      }
    }
  }

  /**
   * Get agents by skills
   */
  async getAgentsBySkills(skills: string[], params?: PaginationParams): Promise<ServiceResponse<AgentOut[]>> {
    return this.searchAgents({ skills }, params)
  }

  /**
   * Get agents by location
   */
  async getAgentsByLocation(location: string, params?: PaginationParams): Promise<ServiceResponse<AgentOut[]>> {
    return this.searchAgents({ location }, params)
  }

  /**
   * Get available agents
   */
  async getAvailableAgents(params?: PaginationParams): Promise<ServiceResponse<AgentOut[]>> {
    return this.searchAgents({ status: 'Available' }, params)
  }

  /**
   * Reset agents state
   */
  resetState(): void {
    this.agentState = {
      agents: [],
      currentAgent: null,
      loading: false,
      error: null,
      pagination: {
        start: 0,
        stop: 10,
        hasMore: true
      }
    }
  }
}

export const agentsService = AgentsService.getInstance()

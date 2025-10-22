// src/services/agentsService.ts
import api from './api'
import type {
  AgentOut,
  AgentState,
  AgentFilters,
  PaginationParams,
  ServiceResponse,
  ApiResponse,
  UserOut
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

  private hasAgentRole(role: unknown): boolean {
    if (!role || typeof role !== 'object') return false
    const roleValues = Object.values(role as Record<string, unknown>)
    return roleValues.some(value => String(value).toLowerCase() === 'agent')
  }

  private mapUserToAgent(user: UserOut): AgentOut {
    const raw = user as Record<string, any>

    const skills = Array.isArray(raw?.skills)
      ? raw.skills
      : Array.isArray(raw?.three_most_commonly_used_tools_or_platforms)
        ? raw.three_most_commonly_used_tools_or_platforms
        : []

    return {
      ...user,
      full_name: user.full_name || raw?.name || 'Agent',
      email: user.email,
      role: user.role,
      status: raw?.status || (raw?.is_agent_open_to_calls_and_video_meetings ? 'available' : 'unavailable'),
      bio: raw?.bio || raw?.client_reason_for_signing_up || '',
      skills,
      experience: Array.isArray(raw?.experience) ? raw.experience : [],
      portfolio: Array.isArray(raw?.portfolio) ? raw.portfolio : [],
      company_name: raw?.company_name || raw?.business_name || null,
      time_zone: raw?.time_zone || null
    }
  }

  private getMockRecommendedAgents(): AgentOut[] {
    const generateId = () => Math.random().toString(36).slice(2, 12)

    const createAgent = (overrides: Partial<AgentOut>): AgentOut => ({
      full_name: 'Agent',
      email: 'agent@example.com',
      role: { agent: 'agent' },
      status: 'available',
      bio: 'Experienced professional ready to support your team.',
      skills: [],
      experience: [],
      portfolio: [],
      company_name: 'Independent Contractor',
      time_zone: 'Remote',
      id: generateId(),
      ...overrides
    })

    return [
      createAgent({
        full_name: 'Ava Thompson',
        email: 'ava.thompson@example.com',
        bio: 'Operations-focused virtual assistant helping founders stay organized and scale.',
        skills: ['Operations Management', 'Executive Assistance', 'CRM'],
        company_name: 'Thompson Virtual Assistance',
        time_zone: 'UTC-08:00'
      }),
      createAgent({
        full_name: 'Miguel Alvarez',
        email: 'miguel.alvarez@example.com',
        bio: 'Marketing technologist specializing in automated funnels that convert.',
        skills: ['Marketing Automation', 'Lead Generation', 'Copywriting'],
        company_name: 'Alvarez Growth Studio',
        time_zone: 'UTC+01:00'
      }),
      createAgent({
        full_name: 'Zuri Okafor',
        email: 'zuri.okafor@example.com',
        bio: 'Customer success specialist building playbooks that keep NPS high.',
        skills: ['Customer Support', 'Knowledge Base', 'QA Testing'],
        company_name: 'Okafor Digital Solutions',
        time_zone: 'UTC+01:00'
      })
    ]
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
      const start = params?.start ?? 0
      const stop = params?.stop ?? 10
      const filters: AgentFilters = {
        role: params?.role,
        skills: params?.skills,
        location: params?.location,
        status: params?.status
      }
      const queryParams: Record<string, unknown> = {
        start,
        stop
      }

      if (Array.isArray(filters.skills) && filters.skills.length > 0) {
        queryParams.skills = filters.skills.join(',')
      }
      if (typeof filters.location === 'string' && filters.location.trim().length > 0) {
        queryParams.location = filters.location
      }
      if (typeof filters.status === 'string' && filters.status.trim().length > 0) {
        queryParams.status = filters.status
      }
      if (typeof filters.role === 'string' && filters.role.trim().length > 0) {
        queryParams.role = filters.role
      }

      const endpoint = '/v1/users'
      const response = await api.get<ApiResponse<UserOut[] | UserOut>>(endpoint, {
        params: queryParams
      })

      if (response.data.status_code !== 200 && response.data.status_code !== 0) {
        throw new Error(response.data.detail || 'Failed to fetch recommended agents')
      }

      const responseData = response.data.data
      const rawAgents = Array.isArray(responseData)
        ? responseData
        : responseData
          ? [responseData]
          : []

      const approvedAgents = rawAgents.filter(user => {
        if (!user) return false
        const record = user as Record<string, any>
        const approved = Boolean(record?.admin_approved)
        return approved && this.hasAgentRole(record?.role)
      })

      const agents = approvedAgents.map(agent => this.mapUserToAgent(agent))

      const pageSize = Math.max(0, stop - start)
      const hasMore = pageSize > 0 ? rawAgents.length === pageSize : false

      this.agentState.pagination = {
        start,
        stop,
        hasMore
      }

      if (start === 0) {
        this.agentState.agents = agents
      } else {
        const existingById = new Map(this.agentState.agents.map(agent => [agent.id, agent]))
        for (const agent of agents) {
          if (!agent.id || !existingById.has(agent.id)) {
            existingById.set(agent.id ?? Math.random().toString(36).slice(2), agent)
          } else {
            existingById.set(agent.id, { ...existingById.get(agent.id)!, ...agent })
          }
        }
        this.agentState.agents = Array.from(existingById.values())
      }

      this.agentState.loading = false
      this.agentState.error = null

      return {
        success: true,
        data: agents,
        message: `Retrieved ${agents.length} recommended agents`
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

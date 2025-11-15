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

  /**
   * Get recommended agents based on current user's expertise
   */
  async getRecommendedAgentsByExpertise(
    currentUser: UserOut,
    params?: PaginationParams
  ): Promise<ServiceResponse<AgentOut[]>> {
    this.agentState.loading = true;
    this.agentState.error = null;
    
    try {
      // Get current user's primary area of expertise
      const userExpertise = (currentUser as any)?.primary_area_of_expertise;
      if (!userExpertise) {
        this.agentState.loading = false;
        return {
          success: false,
          error: 'No expertise specified for the current user'
        };
      }

      // Get agents with matching expertise
      const response = await api.get<ApiResponse<UserOut[]>>('/v1/users/', {
        params: {
          role: 'agent',
          expertise: userExpertise,
          start: params?.start || 0,
          stop: params?.stop || 10
        }
      });

      if (response.data.status_code !== 200) {
        throw new Error(response.data.detail || 'Failed to fetch recommended agents');
      }

      const rawAgents = Array.isArray(response.data.data) 
        ? response.data.data 
        : response.data.data 
          ? [response.data.data]
          : [];

      // Filter out current user and map to AgentOut
      const agents = rawAgents
        .filter(user => user.id !== currentUser.id)
        .map(agent => this.mapUserToAgent(agent));

      // Update pagination state
      this.agentState.pagination = {
        start: params?.start || 0,
        stop: (params?.start || 0) + agents.length,
        hasMore: agents.length === ((params?.stop || 10) - (params?.start || 0))
      };

      // Update agents list
      if ((params?.start || 0) === 0) {
        this.agentState.agents = agents;
      } else {
        this.agentState.agents = [...this.agentState.agents, ...agents];
      }

      this.agentState.loading = false;
      return {
        success: true,
        data: agents,
        message: `Found ${agents.length} agents with matching expertise`
      };
    } catch (error: any) {
      this.agentState.loading = false;
      this.agentState.error = error.response?.data?.detail || error.message || 'Failed to fetch recommended agents';
      return {
        success: false,
        error: this.agentState.error || 'An unknown error occurred'
      } as const;
    }
  }

  private normalizeCategory(value: string): string {
    const v = String(value || '').trim().toLowerCase()
    const map: Record<string, string> = {
      'web development': 'Web Development',
      'web devlopment': 'Web Development',
      'mobile development': 'Mobile Development',
      'sales': 'Sales',
      'customer service': 'Customer Service',
      'editing': 'Editing',
      'book keeping': 'Book Keeping',
      'bookkeeping': 'Book Keeping',
      'executive assistant': 'Executive Assistant',
      'appointment setting': 'Appointment Setting',
      'digital marketing': 'Digital Marketing',
      'data analysis': 'Data Analysis'
    }
    return map[v] || String(value || '').trim()
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
      time_zone: raw?.time_zone || null,
      primary_area_of_expertise: raw?.primary_area_of_expertise || null,
      years_of_experience: raw?.years_of_experience || null,
      available_hours_agent_can_commit: raw?.available_hours_agent_can_commit || null
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

      const endpoint = '/v1/users/'
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
      const response = await api.get<ApiResponse<AgentOut>>(`/v1/agents/${agentId}`)
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
      const start = params?.start ?? 0
      const stop = params?.stop ?? 10
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

      const response = await api.get<ApiResponse<UserOut[] | UserOut>>('/v1/users/', {
        params: queryParams
      })

      if (response.data.status_code !== 200 && response.data.status_code !== 0) {
        throw new Error(response.data.detail || 'Failed to search agents')
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

      this.agentState.agents = agents
      this.agentState.loading = false
      this.agentState.error = null

      return {
        success: true,
        data: agents,
        message: `Found ${agents.length} agents matching criteria`
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
   * Get agents by primary area of expertise using job-based recommendations
   * For clients, this fetches recommended agents from jobs they've created
   */
  async getAgentsByCategory(category: string, params?: PaginationParams & { jobId?: string }): Promise<ServiceResponse<AgentOut[]>> {
    this.agentState.loading = true
    this.agentState.error = null
    try {
      // If a specific jobId is provided, try to get recommended agents from the client's created jobs
      if (params?.jobId) {
        const createdJobsResp = await api.get<ApiResponse<any[]>>(`/v1/jobss/client/created/`, {
          params: { start: 0, stop: 100 }
        })

        if ((createdJobsResp.data.status_code === 200 || createdJobsResp.data.status_code === 0) && createdJobsResp.data.data) {
          const jobs = Array.isArray(createdJobsResp.data.data) ? createdJobsResp.data.data : []
          const targetJobId = String(params.jobId)
          const targetJob = jobs.find(job => {
            const j = job as Record<string, any>
            const ids: string[] = [j?.job_id, j?.agent_job_id, j?.id].filter(v => typeof v === 'string').map(String)
            return ids.includes(targetJobId)
          })

          if (targetJob && Array.isArray((targetJob as any).recommended_agents)) {
            const recommendedAgents = (targetJob as any).recommended_agents as any[]
            const uniqueAgents = recommendedAgents.filter((agent, index, self) => index === self.findIndex(a => a?.email === agent?.email))
            const agents = uniqueAgents.map(agent => this.mapUserToAgent(agent))

            this.agentState.agents = agents
            this.agentState.loading = false
            this.agentState.error = null

            return {
              success: true,
              data: agents,
              message: `Found ${agents.length} recommended agents for job ${targetJobId}`
            }
          }
        }
      }

      // Fallback: Get all client-created jobs and extract recommended agents for the category
      const jobsResponse = await api.get<ApiResponse<any[]>>(`/v1/jobss/client/created/`, {
        params: { start: 0, stop: 100 } // Get a reasonable number of jobs
      })

      if (jobsResponse.data.status_code === 200 && jobsResponse.data.data) {
        const jobs = Array.isArray(jobsResponse.data.data) ? jobsResponse.data.data : []

        // Find jobs with matching category and collect their recommended agents
        const matchingJobs = jobs.filter(job =>
          job.primary_area_of_expertise === category ||
          this.normalizeCategory(job.primary_area_of_expertise || '') === this.normalizeCategory(category)
        )

        const allRecommendedAgents: any[] = []
        matchingJobs.forEach(job => {
          if (job.recommended_agents && Array.isArray(job.recommended_agents)) {
            allRecommendedAgents.push(...job.recommended_agents)
          }
        })

        // Remove duplicates based on email
        const uniqueAgents = allRecommendedAgents.filter((agent, index, self) =>
          index === self.findIndex(a => a.email === agent.email)
        )

        const agents = uniqueAgents.map(agent => this.mapUserToAgent(agent))

        this.agentState.agents = agents
        this.agentState.loading = false
        this.agentState.error = null

        return {
          success: true,
          data: agents,
          message: `Found ${agents.length} agents in category ${category}`
        }
      }

      // Fallback 2: Query users by expertise when job sources don't return data
      const normalized = this.normalizeCategory(category)
      try {
        const start = params?.start ?? 0
        const stop = params?.stop ?? 10
        const resp = await api.get<ApiResponse<UserOut[] | UserOut>>('/v1/users/', {
          params: { role: 'agent', expertise: normalized, start, stop }
        })
        if (resp.data.status_code === 200 || resp.data.status_code === 0) {
          const raw = resp.data.data
          const users = Array.isArray(raw) ? raw : raw ? [raw] : []
          const approvedAgents = users.filter(u => {
            const r = u as Record<string, any>
            return Boolean(r?.admin_approved) && this.hasAgentRole(r?.role)
          })
          const agents = approvedAgents.map(u => this.mapUserToAgent(u))
          this.agentState.agents = agents
          this.agentState.pagination = { start, stop, hasMore: agents.length === Math.max(0, stop - start) }
          this.agentState.loading = false
          this.agentState.error = null
          return { success: true, data: agents, message: `Found ${agents.length} agents for ${normalized}` }
        }
      } catch (_) {
        // continue to final fallback
      }

      // Final fallback: Get general recommended agents
      return this.getRecommendedAgents(params)
    } catch (error: any) {
      this.agentState.loading = false
      this.agentState.error = error.response?.data?.detail || error.message || 'Failed to fetch agents by category'
      return {
        success: false,
        error: this.agentState.error || undefined
      }
    }
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

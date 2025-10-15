<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useJobs } from '../../composables/useJobs'
import type { JobOut, Skill, JobTimeline } from '@/types/api'

// Extended job interface for component use
interface ExtendedJobOut {
  id?: string | null
  project_title: string
  description: string
  category: string
  budget: number
  requirement: string
  skills_needed: Skill[]
  timeline: JobTimeline
  date_created?: number | null
  last_updated?: number | null
  admin_approved?: boolean
  break_down?: {
    Charges: number
    Tax: number
  }
  status?: string
  // Additional component-specific properties
  timeLeft?: string
  client?: string
  agents?: Array<{ id: string }>
  currentDate?: number
  progress?: number
}


const route = useRoute()
const { getJobById, loading, error } = useJobs()

// Define the return type for getJobById
interface JobResponse {
  success: boolean
  data?: any
  error?: string
}

const project = ref<ExtendedJobOut | null>(null)

const defaultRequirements = [
  'Modern, clean UI design',
  'Improved user experience',
  'Mobile-responsive layout',
  'Performance optimization',
  'Accessibility compliance'
]

// Computed properties
const projectTitle = computed(() => project.value?.project_title || 'Project Title')
const projectDescription = computed(
  () =>
    project.value?.description ||
    'Complete redesign and revamp of the freelancer application UI/UX. This project involves creating a modern, user-friendly interface that improves the overall user experience and engagement.'
)
const projectCategory = computed(() => project.value?.category || 'UI/UX Design')
const projectBudget = computed(() => {
  const budget = project.value?.budget ?? 0
  return budget.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
})
const projectStatus = computed(() => project.value?.status || 'In Progress')

// Format date
const formatDate = (timestamp: number | null): string => {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Parse requirements
const parsedRequirements = computed(() => {
  if (!project.value?.requirement) return defaultRequirements
  return project.value.requirement.split(',').map(req => req.trim()).filter(Boolean)
})

// Load project
onMounted(async () => {
  const projectId = route.params.id as string

  if (projectId) {
    try {
      const result = await getJobById(projectId)

      if (result && 'success' in result && result.success && 'data' in result && result.data) {
        const data = result.data as any

        // Safely cast skills_needed
        const skills: Skill[] =
          typeof data.skills_needed === 'string'
            ? data.skills_needed.split(',').map(skill => skill.trim())
            : (data.skills_needed as Skill[]) || []

        // Build the extended object
        const extended: ExtendedJobOut = {
          id: data.id,
          project_title: data.project_title || '',
          description: data.description || '',
          category: data.category || '',
          budget: data.budget || 0,
          requirement: data.requirement || '',
          skills_needed: skills,
          timeline: data.timeline || { start_date: 0, deadline: 0 },
          date_created: data.date_created,
          last_updated: data.last_updated,
          admin_approved: data.admin_approved,
          break_down: data.break_down,
          status: data.status || 'active',
          timeLeft: '',
          client: '',
          agents: [],
          currentDate: Date.now(),
          progress: (data as any).progress || 0
        }

        project.value = extended
      } else {
        console.error('Failed to load project:', ('error' in result && result.error) || 'Unknown error')
      }
    } catch (err) {
      console.error('Error loading project:', err)
    }
  } else {
    console.error('No project ID in route')
  }
})
</script>

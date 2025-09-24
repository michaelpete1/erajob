<template>
  <div class="min-h-screen bg-gray-50 pb-16 sm:pb-20">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <div class="flex items-center gap-2 sm:gap-3">
          <button @click="$router.back()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-lg sm:text-xl font-semibold text-gray-800">Create Project</h1>
        </div>
        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 sm:px-6 py-4 sm:py-6 max-w-7xl mx-auto">
      <!-- Project Title -->
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
        <label class="block text-gray-700 text-sm font-medium mb-2 sm:mb-3">Project Title</label>
        <input
          v-model="project.title"
          type="text"
          placeholder="Enter project title..."
          class="w-full border border-gray-200 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200"
        />
      </div>

      <!-- Category -->
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
        <label class="block text-gray-700 text-sm font-medium mb-2 sm:mb-3">Category</label>
        <select
          v-model="project.category"
          class="w-full border border-gray-200 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200"
        >
          <option value="">Select a category</option>
          <option value="Web Development">Web Development</option>
          <option value="Mobile App">Mobile App</option>
          <option value="UI/UX Design">UI/UX Design</option>
          <option value="Content Writing">Content Writing</option>
          <option value="Digital Marketing">Digital Marketing</option>
          <option value="Data Analysis">Data Analysis</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <!-- Budget -->
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
        <label class="block text-gray-700 text-sm font-medium mb-2 sm:mb-3">Budget</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
          <input
            v-model="project.budget"
            type="number"
            placeholder="0.00"
            class="w-full border border-gray-200 rounded-lg p-3 pl-8 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200"
          />
        </div>
      </div>

      <!-- Timeline -->
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
        <label class="block text-gray-700 text-sm font-medium mb-2 sm:mb-3">Timeline</label>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label class="block text-xs text-gray-500 mb-2">Start Date</label>
            <input
              v-model="project.startDate"
              type="date"
              class="w-full border border-gray-200 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-2">Deadline</label>
            <input
              v-model="project.deadline"
              type="date"
              class="w-full border border-gray-200 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200"
            />
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
        <label class="block text-gray-700 text-sm font-medium mb-2 sm:mb-3">Description</label>
        <textarea
          v-model="project.description"
          placeholder="Describe your project in detail..."
          class="w-full border border-gray-200 rounded-lg p-3 resize-none text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200"
          rows="4"
        ></textarea>
      </div>

      <!-- Requirements -->
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
        <label class="block text-gray-700 text-sm font-medium mb-2 sm:mb-3">Requirements</label>
        <div class="space-y-3">
          <div
            v-for="(requirement, index) in project.requirements"
            :key="index"
            class="flex items-center gap-2 sm:gap-3"
          >
            <input
              v-model="requirement.text"
              type="text"
              placeholder="Enter requirement..."
              class="flex-1 border border-gray-200 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200"
            />
            <button
              @click="removeRequirement(index)"
              class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button
            @click="addRequirement"
            class="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 text-sm sm:text-base text-gray-500 hover:border-green-500 hover:text-green-500 transition-colors duration-200"
          >
            + Add Requirement
          </button>
        </div>
      </div>

      <!-- Skills Needed -->
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
        <label class="block text-gray-700 text-sm font-medium mb-2 sm:mb-3">Skills Needed</label>
        <div class="flex flex-wrap gap-1 sm:gap-2 mb-3">
          <span
            v-for="(skill, index) in project.skills"
            :key="index"
            class="px-2 sm:px-3 py-1 bg-green-100 text-green-600 text-xs sm:text-sm rounded-full flex items-center gap-1"
          >
            {{ skill }}
            <button @click="removeSkill(index)" class="text-green-600 hover:text-green-800 flex-shrink-0">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        </div>
        <div class="flex gap-2">
          <input
            v-model="newSkill"
            type="text"
            placeholder="Add skill..."
            class="flex-1 border border-gray-200 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200"
            @keyup.enter="addSkill"
          />
          <button
            @click="addSkill"
            class="px-3 sm:px-4 py-3 bg-green-500 text-white text-sm sm:text-base rounded-lg hover:bg-green-600 transition-colors flex-shrink-0"
          >
            Add
          </button>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        @click="submitProject"
        class="w-full bg-green-500 text-white font-medium py-3 sm:py-4 rounded-lg sm:rounded-xl hover:bg-green-600 transition-colors duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
      >
        Create Project
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const project = reactive({
  title: '',
  category: '',
  budget: '',
  startDate: '',
  deadline: '',
  description: '',
  requirements: [{ text: '' }],
  skills: [] as string[]
})

const newSkill = ref('')

// Methods
const addRequirement = () => {
  project.requirements.push({ text: '' })
}

const removeRequirement = (index: number) => {
  if (project.requirements.length > 1) {
    project.requirements.splice(index, 1)
  }
}

const addSkill = () => {
  if (newSkill.value.trim() && !project.skills.includes(newSkill.value.trim())) {
    project.skills.push(newSkill.value.trim())
    newSkill.value = ''
  }
}

const removeSkill = (index: number) => {
  project.skills.splice(index, 1)
}

const submitProject = () => {
  // Filter out empty requirements
  const filteredRequirements = project.requirements
    .filter(req => req.text.trim())
    .map(req => req.text.trim())

  // Create project object
  const newProject = {
    id: Date.now(),
    title: project.title,
    category: project.category,
    budget: project.budget,
    startDate: project.startDate,
    deadline: project.deadline,
    description: project.description,
    requirements: filteredRequirements,
    skills: project.skills,
    status: 'Active',
    postedTime: 'Just now',
    proposals: '0',
    agents: []
  }

  // Save to localStorage (in real app, this would be an API call)
  try {
    const existingProjects = JSON.parse(localStorage.getItem('clientProjects') || '[]')
    existingProjects.unshift(newProject)
    localStorage.setItem('clientProjects', JSON.stringify(existingProjects))
  } catch (e) {
    // ignore
  }

  // Navigate back to projects page
  router.push('/client/projects')
}
</script>

<style scoped>
/* No custom styles needed - using Tailwind classes */
</style>

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
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-700 font-medium">{{ error }}</p>
        </div>
      </div>

      <!-- Form Content (only show when not loading) -->
      <div v-if="!loading">
        <!-- Project Title -->
        <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
          <label class="block text-gray-700 text-sm font-medium mb-2 sm:mb-3">Project Title</label>
          <input
            v-model="project.project_title"
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
            <option value="" disabled>Select a category</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Content Writing">Content Writing</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="Data Analysis">Data Analysis</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <!-- Budget -->
        <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
          <label class="block text-gray-700 text-sm font-medium mb-2 sm:mb-3">Budget ($)</label>
          <input
            v-model="project.budget"
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter budget..."
            class="w-full border border-gray-200 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200"
          />
        </div>

        <!-- Timeline -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 sm:mb-6">
          <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
            <label class="block text-gray-700 text-sm font-medium mb-2 sm:mb-3">Start Date</label>
            <input
              v-model="formData.startDate"
              type="date"
              class="w-full border border-gray-200 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200"
              @change="(e: Event) => updateTimeline('start_date', (e.target as HTMLInputElement).value)"
            />
          </div>
          <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
            <label class="block text-gray-700 text-sm font-medium mb-2 sm:mb-3">Deadline</label>
            <input
              v-model="formData.deadline"
              type="date"
              class="w-full border border-gray-200 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200"
              @change="(e: Event) => updateTimeline('deadline', (e.target as HTMLInputElement).value)"
            />
          </div>
        </div>

        <!-- Description -->
        <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
          <label class="block text-gray-700 text-sm font-medium mb-2 sm:mb-3">Project Description</label>
          <textarea
            v-model="project.description"
            rows="4"
            placeholder="Describe your project in detail..."
            class="w-full border border-gray-200 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200"
          ></textarea>
        </div>
        <!-- Requirements -->
        <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
          <label class="block text-gray-700 text-sm font-medium mb-2 sm:mb-3">Requirements</label>
          <div class="space-y-3">
            <div v-for="(requirement, index) in formData.requirements" :key="index" class="flex items-center gap-2">
              <input
                v-model="requirement.text"
                type="text"
                :placeholder="`Requirement ${index + 1}`"
                class="flex-1 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200"
              />
              <button
                @click="removeRequirement(index)"
                type="button"
                class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                :disabled="formData.requirements.length <= 1"
                :class="{ 'opacity-50 cursor-not-allowed': formData.requirements.length <= 1 }"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <button
              @click="addRequirement"
              type="button"
              class="mt-2 flex items-center text-sm text-green-600 hover:text-green-700 font-medium"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Requirement
            </button>
          </div>
        </div>

        <!-- Skills -->
        <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
          <label class="block text-gray-700 text-sm font-medium mb-2 sm:mb-3">Required Skills</label>
          <div class="flex flex-wrap gap-2 mb-3">
            <span
              v-for="(skill, index) in formData.skills"
              :key="index"
              class="inline-flex items-center bg-green-100 text-green-800 text-xs sm:text-sm px-2.5 py-1 rounded-full"
            >
              {{ skill }}
              <button
                @click="removeSkill(index)"
                type="button"
                class="ml-1.5 text-green-500 hover:text-green-700 focus:outline-none"
              >
                <span class="sr-only">Remove skill</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          </div>
          <div class="flex gap-2">
            <input
              v-model="newSkill"
              type="text"
              placeholder="Add a skill..."
              @keyup.enter="addSkill"
              class="flex-1 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200"
            />
            <button
              @click="addSkill"
              type="button"
              class="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Add
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="sticky bottom-0 bg-white border-t border-gray-200 py-3 px-4 sm:px-6 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 rounded-b-xl">
          <button
            @click="submitProject"
            type="button"
            :disabled="!isFormValid || loading"
            class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Project...
            </span>
            <span v-else>Create Project</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { jobsService } from '@/services/jobsService';
import type { JobBase } from '@/types/api';

interface FormData {
  requirements: Array<{ text: string }>;
  skills: string[];
  startDate: string;
  deadline: string;
}

const router = useRouter();
const loading = ref(false);
const error = ref('');
const newSkill = ref('');

const formData = ref<FormData>({
  requirements: [{ text: '' }],
  skills: [],
  startDate: '',
  deadline: ''
});

const project = ref<JobBase>({
  project_title: '',
  category: 'Other', // Default to 'Other' which is a valid JobCategory
  budget: 0,
  description: '',
  requirement: '',
  skills_needed: '',
  timeline: {
    start_date: 0,
    deadline: 0
  }
});

const isFormValid = computed(() => {
  return (
    project.value.project_title.trim() !== '' &&
    project.value.category && project.value.category !== 'Other' &&
    project.value.budget > 0 &&
    project.value.description.trim() !== '' &&
    project.value.requirement.trim() !== '' &&
    formData.value.skills.length > 0 &&
    formData.value.requirements.every(req => req.text.trim() !== '') &&
    formData.value.startDate &&
    formData.value.deadline
  );
});

const updateTimeline = (field: 'start_date' | 'deadline', value: string) => {
  if (field === 'start_date') {
    project.value.timeline.start_date = new Date(value).getTime();
  } else {
    project.value.timeline.deadline = new Date(value).getTime();
  }
};

const addRequirement = () => {
  formData.value.requirements.push({ text: '' });
};

const removeRequirement = (index: number) => {
  if (formData.value.requirements.length > 1) {
    formData.value.requirements.splice(index, 1);
  }
};

const addSkill = () => {
  if (newSkill.value.trim() && !formData.value.skills.includes(newSkill.value.trim())) {
    formData.value.skills.push(newSkill.value.trim());
    project.value.skills_needed = formData.value.skills.join(',');
    newSkill.value = '';
  }
};

const removeSkill = (index: number) => {
  formData.value.skills.splice(index, 1);
  project.value.skills_needed = formData.value.skills.join(',');
};

const submitProject = async () => {
  if (!isFormValid.value) return;

  loading.value = true;
  error.value = '';

  try {
    // Update project data from form
    project.value.requirement = formData.value.requirements
      .map(req => req.text.trim())
      .filter(text => text !== '')
      .join('\n');

    // Transform to JobPostData format
    const jobData = {
      title: project.value.project_title,
      description: project.value.description,
      category: project.value.category,
      budget: project.value.budget,
      skills_needed: formData.value.skills,
      timeline: {
        startDate: new Date(project.value.timeline.start_date).toISOString(),
        endDate: new Date(project.value.timeline.deadline).toISOString()
      }
    };

    const response = await jobsService.createJob(jobData);

    if (response.success && response.data) {
      router.push('/client/projects');
    } else {
      error.value = response.error || 'Failed to create project';
    }
  } catch (err) {
    console.error('Error creating project:', err);
    error.value = 'An error occurred while creating the project';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>

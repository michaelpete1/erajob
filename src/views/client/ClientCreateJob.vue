<template>
  <div class="min-h-screen bg-gray-50 pb-28 sm:pb-32 lg:pb-20">
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
          <div class="flex items-center justify-between mb-2 sm:mb-3">
            <label class="block text-gray-700 text-sm font-medium">Project Title</label>
            <span class="text-xs text-gray-500">{{ titleLength }}/{{ TITLE_MAX_LENGTH }}</span>
          </div>
          <input
            v-model="project.job_title"
            type="text"
            placeholder="Enter project title..."
            :maxlength="TITLE_MAX_LENGTH"
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
            <option value="" disabled>Please select</option>
            <option
              v-for="option in categoryOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
          <p class="text-xs text-gray-500 mt-2">Jobs are matched to agents based on their expertise in this category.</p>
        </div>

        <!-- Budget -->
        <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
          <label class="block text-gray-700 text-sm font-medium mb-2 sm:mb-3">Budget ($)</label>
          <input
            v-model="project.budget"
            type="number"
            min="0"
            step="1"
            placeholder="Enter budget..."
            @blur="normalizeBudget"
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
          <div class="flex items-center justify-between mb-2 sm:mb-3">
            <label class="block text-gray-700 text-sm font-medium">Project Description</label>
            <span class="text-xs text-gray-500">{{ descriptionLength }}/{{ DESCRIPTION_MAX_LENGTH }}</span>
          </div>
          <textarea
            v-model="project.description"
            rows="4"
            placeholder="Describe your project in detail..."
            :maxlength="DESCRIPTION_MAX_LENGTH"
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
          <p class="text-xs text-gray-500 mb-3">Select skills that match the agents' expertise. Jobs are matched based on these skills.</p>
          <div class="flex flex-wrap gap-2 mb-3">
            <span
              v-for="(skill, index) in formData.skills"
              :key="index"
              class="inline-flex items-center bg-green-100 text-green-800 text-xs sm:text-sm px-2.5 py-1 rounded-full"
            >
              {{ getOptionLabel(skill) }}
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
            <select
              v-model="selectedSkill"
              class="flex-1 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200"
            >
              <option value="" disabled>Please select</option>
              <option
                v-for="option in skillOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <button
              @click="addSkill"
              type="button"
              :disabled="!selectedSkill"
              :class="[
                'px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
                selectedSkill ? 'bg-green-500 hover:bg-green-600' : 'bg-green-300 cursor-not-allowed'
              ]"
            >
              Add
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="sticky bottom-28 sm:bottom-32 lg:bottom-6 bg-white border-t border-gray-200 py-3 px-4 sm:px-6 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 rounded-b-xl shadow-lg">
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
import { api } from '@/services/apiService';
import type { JobsBase } from '@/types/api/openapi';

interface FormData {
  requirements: Array<{ text: string }>;
  skills: JobsBase['skills_needed'][];
  startDate: string;
  deadline: string;
}

const router = useRouter();
const loading = ref(false);
const error = ref('');

const TITLE_MAX_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 2000;
const selectedSkill = ref<JobsBase['skills_needed'] | ''>('');

const categoryOptions: Array<{ value: JobsBase['category']; label: string }> = [
  { value: 'Web Development', label: 'Web Development' },
  { value: 'Mobile Development', label: 'Mobile Development' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Customer Service', label: 'Customer Service' },
  { value: 'Editing', label: 'Editing' },
  { value: 'Book Keeping', label: 'Book Keeping' },
  { value: 'Executive Assistant', label: 'Executive Assistant' },
  { value: 'Appointment Setting', label: 'Appointment Setting' },
  { value: 'UI/UX Design', label: 'UI/UX Design' },
  { value: 'Content Writing', label: 'Content Writing' },
  { value: 'Digital Marketing', label: 'Digital Marketing' },
  { value: 'Data Analysis', label: 'Data Analysis' },
  { value: 'Other', label: 'Other' }
];

const skillOptions: Array<{ value: JobsBase['skills_needed']; label: string }> = [
  { value: 'Web Devlopment', label: 'Web Development' },
  { value: 'Mobile Development', label: 'Mobile Development' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Customer Service', label: 'Customer Service' },
  { value: 'Editing', label: 'Editing' },
  { value: 'Book Keeping', label: 'Book Keeping' },
  { value: 'Executive Assitant', label: 'Executive Assistant' },
  { value: 'Appointment Setting', label: 'Appointment Setting' },
  { value: 'Digital Marketing', label: 'Digital Marketing' },
  { value: 'Data Analysis', label: 'Data Analysis' },
  { value: 'Other', label: 'Other' }
];

const formData = ref<FormData>({
  requirements: [{ text: '' }],
  skills: [],
  startDate: '',
  deadline: ''
});

const getOptionLabel = (value: JobsBase['category'] | JobsBase['skills_needed']) => {
  const match = categoryOptions.find(option => option.value === value);
  return match?.label ?? value;
};

const project = ref<JobsBase>({
  job_title: '',
  category: '' as JobsBase['category'],
  budget: 0,
  description: '',
  requirement: '',
  skills_needed: '' as JobsBase['skills_needed'],
  timeline: {
    start_date: 0,
    deadline: 0
  }
});

const titleLength = computed(() => project.value.job_title?.length || 0);
const descriptionLength = computed(() => project.value.description?.length || 0);

const isFormValid = computed(() => {
  const hasValidRequirements =
    formData.value.requirements.length > 0 &&
    formData.value.requirements.every(req => req.text.trim() !== '');

  return (
    (project.value.job_title?.trim() || '') !== '' &&
    project.value.category.trim() !== '' &&
    project.value.budget > 0 &&
    project.value.description.trim() !== '' &&
    hasValidRequirements &&
    formData.value.skills.length > 0 &&
    formData.value.startDate &&
    formData.value.deadline
  );
});

const updateTimeline = (field: 'start_date' | 'deadline', value: string) => {
  const timestamp = value ? Math.floor(new Date(value).getTime() / 1000) : 0;
  if (field === 'start_date') {
    project.value.timeline.start_date = timestamp;
  } else {
    project.value.timeline.deadline = timestamp;
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
  if (selectedSkill.value && !formData.value.skills.includes(selectedSkill.value)) {
    formData.value.skills.push(selectedSkill.value);
    const primarySkill = formData.value.skills[0];
    project.value.skills_needed = (primarySkill ?? '') as JobsBase['skills_needed'];
    selectedSkill.value = '';
  }
};

const removeSkill = (index: number) => {
  formData.value.skills.splice(index, 1);
  const primarySkill = formData.value.skills[0];
  project.value.skills_needed = (primarySkill ?? '') as JobsBase['skills_needed'];
};

const normalizeBudget = () => {
  if (typeof project.value.budget === 'number' && !Number.isNaN(project.value.budget)) {
    project.value.budget = Math.max(0, Math.floor(project.value.budget));
  } else {
    project.value.budget = 0;
  }
};

const submitProject = async () => {
  if (!isFormValid.value) return;

  loading.value = true;
  error.value = '';

  try {
    normalizeBudget();

    // Update project data from form
    project.value.requirement = formData.value.requirements
      .map(req => req.text.trim())
      .filter(text => text !== '')
      .join('\n');

    // Transform to JobPostData format
    const jobPayload: JobsBase = {
      project_title: project.value.job_title?.trim() || '',
      category: project.value.category,
      budget: project.value.budget,
      description: project.value.description.trim(),
      requirement: project.value.requirement,
      skills_needed: project.value.skills_needed,
      timeline: {
        start_date: project.value.timeline.start_date,
        deadline: project.value.timeline.deadline
      }
    };

    const response = await api.jobs.createJob(jobPayload);

    if (response.success && response.data) {
      router.push({ name: 'client-jobs' });
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

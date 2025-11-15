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
          <h1 class="text-lg sm:text-xl font-semibold text-gray-800">Create Job</h1>
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
            <span class="text-xs text-gray-500">{{ projectTitleLength }}/{{ TITLE_MAX_LENGTH }}</span>
          </div>
          <input
            v-model="job.project_title"
            type="text"
            placeholder="Enter project title..."
            :maxlength="TITLE_MAX_LENGTH"
            class="w-full border border-gray-200 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200"
          />
        </div>



        

        <!-- Primary Area of Expertise -->
        <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
          <label class="block text-gray-700 text-sm font-medium mb-2 sm:mb-3">Primary Area of Expertise</label>
          <select
            v-model="job.primary_area_of_expertise"
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
            v-model="job.budget"
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
            <label class="block text-gray-700 text-sm font-medium">Job Description</label>
            <span class="text-xs text-gray-500">{{ descriptionLength }}/{{ DESCRIPTION_MAX_LENGTH }}</span>
          </div>
          <textarea
            v-model="job.description"
            rows="4"
            placeholder="Describe your job in detail..."
            :maxlength="DESCRIPTION_MAX_LENGTH"
            class="w-full border border-gray-200 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200"
          ></textarea>
        </div>
        

        <!-- Submit Button -->
        <div class="sticky bottom-28 sm:bottom-32 lg:bottom-6 bg-white border-t border-gray-200 py-3 px-4 sm:px-6 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 rounded-b-xl shadow-lg">
          <button
            @click="submitJob"
            type="button"
            :disabled="!isFormValid || loading"
            class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Job...
            </span>
            <span v-else>Create Job</span>
          </button>
          <div v-if="!loading && !isFormValid && disabledReasons.length" class="mt-3 text-xs text-red-600">
            <p class="font-semibold">Please fix the following:</p>
            <ul class="list-disc ml-4 mt-1">
              <li v-for="r in disabledReasons" :key="r">{{ r }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/services/apiService';
import type { JobsBase, JobCategories, JobsOut } from '@/types/api/openapi';
import type { ServiceResponse } from '@/types/api';

interface FormData {
  startDate: string;
  deadline: string;
}



const router = useRouter();
const loading = ref(false);
const error = ref('');

const TITLE_MAX_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 2000;

const categoryOptions: Array<{ value: JobCategories; label: string }> = [
  { value: 'Web Development', label: 'Web Development' },
  { value: 'Mobile Development', label: 'Mobile Development' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Customer Service', label: 'Customer Service' },
  { value: 'Editing', label: 'Editing' },
  { value: 'Book Keeping', label: 'Book Keeping' },
  { value: 'Executive Assistant', label: 'Executive Assistant' },
  { value: 'Appointment Setting', label: 'Appointment Setting' },
  { value: 'Digital Marketing', label: 'Digital Marketing' },
  { value: 'Data Analysis', label: 'Data Analysis' }
];


const formData = ref<FormData>({
  startDate: '',
  deadline: ''
});

const getOptionLabel = (value: JobCategories) => {
  const match = categoryOptions.find(option => option.value === value);
  return match?.label ?? value;
};

const job = ref<JobsBase>({
  project_title: '',
  primary_area_of_expertise: '' as JobCategories,
  budget: 0,
  description: '',
  timeline: {
    start_date: 0,
    deadline: 0
  },
  selected_agents: []
});

const projectTitleLength = computed(() => job.value.project_title?.length || 0);
const descriptionLength = computed(() => job.value.description?.length || 0);

const disabledReasons = computed(() => {
  const reasons: string[] = []
  if ((job.value.project_title?.trim() || '').length < 5) reasons.push('Title must be at least 5 characters')
  if (!(job.value.primary_area_of_expertise || '').toString().trim()) reasons.push('Select a primary expertise')
  if (!(job.value.budget > 0)) reasons.push('Budget must be greater than 0')
  if (job.value.description.trim().length < 20) reasons.push('Description must be at least 20 characters')

  const startDate = formData.value.startDate ? new Date(formData.value.startDate) : null
  const deadline = formData.value.deadline ? new Date(formData.value.deadline) : null
  if (!startDate) reasons.push('Start date is required')
  if (!deadline) reasons.push('Deadline is required')
  if (startDate && deadline) {
    const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
    const deadlineOnly = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate())
    if (deadlineOnly < startDateOnly) reasons.push('Deadline must be after start date')
  }
  return reasons
})

const isFormValid = computed(() => disabledReasons.value.length === 0)

const validationErrors = ref<Record<string, string>>({});

const validateField = (field: string, value: any) => {
  switch (field) {
    case 'project_title':
      if (!value || value.trim().length < 5) {
        validationErrors.value[field] = 'Title must be at least 5 characters long';
      } else {
        delete validationErrors.value[field];
      }
      break;
    case 'description':
      if (!value || value.trim().length < 20) {
        validationErrors.value[field] = 'Description must be at least 20 characters long';
      } else {
        delete validationErrors.value[field];
      }
      break;
    case 'budget':
      if (!value || value <= 0) {
        validationErrors.value[field] = 'Budget must be greater than 0';
      } else {
        delete validationErrors.value[field];
      }
      break;
    case 'primary_area_of_expertise':
      if (!value) {
        validationErrors.value[field] = 'Please select a category';
      } else {
        delete validationErrors.value[field];
      }
      break;
  }
};

const updateTimeline = (field: 'start_date' | 'deadline', value: string) => {
  const timestamp = value ? Math.floor(new Date(value).getTime() / 1000) : 0;
  if (field === 'start_date') {
    job.value.timeline.start_date = timestamp;
  } else {
    job.value.timeline.deadline = timestamp;
  }
};


const normalizeBudget = () => {
  if (typeof job.value.budget === 'number' && !Number.isNaN(job.value.budget)) {
    job.value.budget = Math.max(0, Math.floor(job.value.budget));
  } else {
    job.value.budget = 0;
  }
};

const saveSelectedAgentsToJob = async () => {
  try {
    const storedProject = localStorage.getItem('selectedClientProject') || localStorage.getItem('selectedProject')
    let jobId = ''
    if (storedProject) {
      try {
        const parsed = JSON.parse(storedProject)
        jobId = String(parsed?.job_id || parsed?.id || '')
      } catch {}
    }

    if (!jobId) {
      alert('No active job found. Create a job first, then save agents.')
      return
    }

    if (!(job.value.selected_agents && job.value.selected_agents.length > 0)) {
      alert('Select at least one agent to save to this job')
      return
    }

    const resp = await api.jobs.updateJob(jobId, { selected_agents: job.value.selected_agents })
    if (resp.success) {
      alert('Selected agents saved to your job successfully')
    } else {
      alert(resp.error || 'Failed to save selected agents')
    }
  } catch (e: any) {
    console.error('Error saving selected agents:', e)
    alert(e?.message || 'Error saving selected agents')
  }
}

const submitJob = async () => {
  // Validate all fields before submission
  validateField('project_title', job.value.project_title);
  validateField('description', job.value.description);
  validateField('budget', job.value.budget);
  validateField('primary_area_of_expertise', job.value.primary_area_of_expertise);
  
  if (Object.keys(validationErrors.value).length > 0 || !isFormValid.value) {
    error.value = 'Please fix the validation errors before submitting';
    return;
  }

  loading.value = true;
  error.value = '';
  validationErrors.value = {};

  try {
    normalizeBudget();

    // Transform to JobPostData format expected by the service
    const jobPayload: any = {
      project_title: job.value.project_title?.trim() || '',
      description: job.value.description.trim(),
      primary_area_of_expertise: job.value.primary_area_of_expertise,
      budget: job.value.budget,
      timeline: {
        start_date: job.value.timeline.start_date,
        deadline: job.value.timeline.deadline
      },
      selected_agents: job.value.selected_agents || []
    };

    const response = await api.jobs.createJob(jobPayload);

    if (response.success && response.data) {
      try {
        const jobId = String((response.data as any)?.id || response.data || '');
        if (jobId) {
          const cache = {
            id: jobId,
            job_id: jobId,
            title: job.value.project_title,
            project_title: job.value.project_title,
            primary_area_of_expertise: job.value.primary_area_of_expertise
          };
          
          // Store job data in localStorage
          localStorage.setItem('selectedProject', JSON.stringify(cache));
          localStorage.setItem('selectedClientProject', JSON.stringify(cache));

          // Update job with selected agents if any
          if ((job.value.selected_agents?.length || 0) > 0) {
            try { 
              await api.jobs.updateJob(jobId, { 
                selected_agents: job.value.selected_agents 
              }); 
            } catch (e) {
              console.warn('Failed to update job with selected agents:', e);
            }
          }
          
          // Show success message before redirect
          alert('Job created successfully!');
          router.push({ name: 'client-dashboard' });
        }
      } catch (e) {
        console.error('Error processing job creation:', e);
        error.value = 'Job was created, but there was an error processing additional details.';
      }
    } else {
      // Handle API validation errors
      const typedResponse = response as ServiceResponse<JobsOut>;
      if (typedResponse.errors) {
        validationErrors.value = Object.entries(typedResponse.errors).reduce((acc, [field, messages]) => {
          acc[field] = Array.isArray(messages) ? messages.join(', ') : String(messages);
          return acc;
        }, {} as Record<string, string>);
        error.value = 'Please fix the validation errors below.';
      } else {
        error.value = typedResponse.error || 'Failed to create job. Please try again.';
      }
    }
  } catch (err: any) {
    console.error('Error creating job:', err);
    error.value = err.response?.data?.message || 
                 err.message || 
                 'An unexpected error occurred while creating the job. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>

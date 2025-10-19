<template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 overflow-hidden">
    <div class="absolute top-0 right-0 h-24 w-24 sm:h-32 sm:w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow"></div>
    <div class="absolute bottom-0 left-0 h-20 w-20 sm:h-24 sm:w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse"></div>
    <div class="absolute top-1/2 left-1/2 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float"></div>
    
    <div class="absolute top-16 left-16 sm:top-20 sm:left-20 w-2 h-2 bg-white/20 rounded-full animate-float-delayed-1"></div>
    <div class="absolute top-32 right-24 sm:top-40 sm:right-32 w-1 h-1 bg-white/30 rounded-full animate-float-delayed-2"></div>
    <div class="absolute bottom-24 left-32 sm:bottom-32 sm:left-40 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-delayed-3"></div>
    <div class="absolute bottom-16 right-16 sm:bottom-20 sm:right-20 w-2.5 h-2.5 bg-white/15 rounded-full animate-float-delayed-4"></div>

    <div class="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-24">
      <header class="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 w-[90%] sm:w-[92%] max-w-3xl bg-brand-teal text-white rounded-xl px-3 sm:px-4 py-2 sm:py-3 z-50 shadow-md flex items-center justify-between">
        <div class="flex items-center gap-2 sm:gap-3">
          <button @click="goBack" aria-label="Back" class="p-1.5 sm:p-2 text-white/95 hover:text-white rounded-md hover:bg-white/10 transition-colors">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-sm sm:text-base font-semibold display-font">Job Rejection</h1>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/90" />
        </div>
      </header>

      <div class="mt-16 sm:mt-20 max-w-2xl mx-auto">
        <!-- Job Information Card -->
        <div class="bg-white/95 backdrop-blur-sm rounded-xl p-5 sm:p-6 shadow-lg mb-6 animate-slide-up-fade">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 display-font">Job Details</h2>
            <span class="px-3 py-1 bg-red-100 text-red-800 text-xs sm:text-sm font-medium rounded-full">Pending</span>
          </div>
          
          <div class="space-y-3">
            <div>
              <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1 display-font">{{ job?.title }}</h3>
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>{{ job?.agentName }} ({{ job?.agentUsername }})</span>
              </div>
            </div>
            
            <div class="flex items-center text-green-600 font-semibold">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-3.293 8.707a1 1 0 011.414 0L10 12.586l3.879-3.879a1 1 0 011.414 1.414l-4.5 4.5a1 1 0 01-1.414 0l-4.5-4.5a1 1 0 010-1.414z" />
              </svg>
              <span>{{ job?.pay }}</span>
            </div>
            
            <div class="flex items-center text-gray-500">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{{ job?.timeAgo }}</span>
            </div>
          </div>
        </div>

        <!-- Rejection Reason Form -->
        <div class="bg-white/95 backdrop-blur-sm rounded-xl p-5 sm:p-6 shadow-lg animate-slide-up-fade">
          <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 display-font">Rejection Reason</h2>
          
          <form @submit.prevent="submitRejection" class="space-y-4">
            <!-- Reason Type Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Reason Type</label>
              <select 
                v-model="rejectionReason.type" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-colors"
                required
              >
                <option value="">Select a reason type</option>
                <option value="incomplete_profile">Incomplete Agent Profile</option>
                <option value="inappropriate_content">Inappropriate Content</option>
                <option value="pricing_issues">Pricing Issues</option>
                <option value="quality_concerns">Quality Concerns</option>
                <option value="policy_violation">Policy Violation</option>
                <option value="duplicate_listing">Duplicate Listing</option>
                <option value="other">Other</option>
              </select>
            </div>

            <!-- Detailed Reason -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Detailed Reason</label>
              <textarea 
                v-model="rejectionReason.details" 
                rows="4" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-colors resize-none"
                placeholder="Please provide detailed explanation for the rejection..."
                required
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">{{ rejectionReason.details.length }}/500 characters</p>
            </div>

            <!-- Notify Agent -->
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="notifyAgent" 
                v-model="rejectionReason.notifyAgent" 
                class="w-4 h-4 text-brand-teal border-gray-300 rounded focus:ring-brand-teal"
              >
              <label for="notifyAgent" class="ml-2 text-sm text-gray-700">
                Notify agent via email
              </label>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-3 pt-4">
              <button 
                type="button" 
                @click="goBack"
                class="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300 min-h-[44px] touch-manipulation btn-pressable hover:shadow-lg hover:scale-[1.02]"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                :disabled="!isFormValid"
                class="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-300 min-h-[44px] touch-manipulation btn-pressable hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="flex items-center justify-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  Reject Job
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { api } from '../../services/apiService';
 

const router = useRouter();
const route = useRoute();

interface Job {
  id?: string | number | null;
  title?: string | null;
  agentName?: string | null;
  agentUsername?: string | null;
  pay?: string | null;
  timeAgo?: string | null;
  status?: string | null;
  [key: string]: any;
}

interface RejectionReason {
  type: string;
  details: string;
  notifyAgent: boolean;
}

const job = ref<Job | null>(null);
const rejectionReason = ref<RejectionReason>({
  type: '',
  details: '',
  notifyAgent: true
});

const ADMIN_JOBS_STORAGE_KEY = 'adminJobs';
const SELECTED_ADMIN_JOB_STORAGE_KEY = 'selectedAdminJob';

// Mock job data - retained as a final fallback
const mockJobs: Job[] = [
  { id: 1, status: 'Approved', timeAgo: '8 hours ago', title: 'Complete Freelancer Application UI/UX Revamp', agentName: 'Jenny Wilson', agentUsername: 'jennyson', pay: '$2,500' },
  { id: 2, status: 'Pending', timeAgo: '41 minutes ago', title: 'Create a Social Media Banner for a Fitness Brand', agentName: 'Matt Barrie', agentUsername: 'matt', pay: '$68/hr' },
  { id: 3, status: 'Pending', timeAgo: '1 hour ago', title: 'Write SEO Content for a Tech Blog', agentName: 'Matt Barrie', agentUsername: 'matt', pay: '$80 -120' },
];

const normaliseId = (value: string | number | null | undefined) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') return value.toString();
  return value;
};

const loadJobFromStorage = (id: number): Job | null => {
  const stringId = id.toString();

  try {
    const selected = localStorage.getItem(SELECTED_ADMIN_JOB_STORAGE_KEY);
    if (selected) {
      const parsedSelected: Job = JSON.parse(selected);
      if (normaliseId(parsedSelected.id) === stringId) {
        return parsedSelected;
      }
    }
  } catch (error) {
    console.error('Error parsing selected admin job from storage:', error);
  }

  try {
    const storedJobs = localStorage.getItem(ADMIN_JOBS_STORAGE_KEY);
    if (storedJobs) {
      const parsedJobs: Job[] = JSON.parse(storedJobs);
      const found = parsedJobs.find(storedJob => normaliseId(storedJob.id) === stringId);
      if (found) {
        return found;
      }
    }
  } catch (error) {
    console.error('Error parsing admin jobs from storage:', error);
  }

  return null;
};

const loadJobFromApi = async (id: number): Promise<Job | null> => {
  try {
    const response = await api.jobs.listAdminJobs(0, 100);
    if (response.success && response.data) {
      const found = response.data.find(apiJob => normaliseId(apiJob.id) === id.toString());
      if (found) {
        return found as Job;
      }
    }
  } catch (error) {
    console.error('Error fetching admin jobs from API:', error);
  }
  return null;
};

const initialiseJob = async (id: number) => {
  if (!id) {
    router.push('/admin/job-approval');
    return;
  }

  const storedJob = loadJobFromStorage(id);
  if (storedJob) {
    job.value = storedJob;
    return;
  }

  const apiJob = await loadJobFromApi(id);
  if (apiJob) {
    job.value = apiJob;
    return;
  }

  const fallback = mockJobs.find(mockJob => normaliseId(mockJob.id) === id.toString()) || null;
  if (fallback) {
    job.value = fallback;
    return;
  }

  router.push('/admin/job-approval');
};

const isFormValid = computed(() => {
  return rejectionReason.value.type.trim() !== '' && 
         rejectionReason.value.details.trim() !== '' &&
         rejectionReason.value.details.length <= 500;
});

onMounted(() => {
  const jobId = parseInt(route.params.id as string, 10) || 0;
  initialiseJob(jobId);
});

const goBack = () => {
  router.push('/admin/job-approval');
};

const submitRejection = () => {
  if (!job.value || !isFormValid.value) return;

  // In a real app, this would call an API to submit the rejection
  console.log('Submitting rejection for job:', job.value.id);
  console.log('Rejection reason:', rejectionReason.value);

  // Show success message
  const successMessage = `Job "${job.value.title}" has been rejected successfully.`;
  
  if (rejectionReason.value.notifyAgent) {
    console.log('Agent will be notified via email');
  }

  // You could replace this with a toast notification in a real app
  alert(successMessage);

  // Navigate back to job approval page
  router.push('/admin/job-approval');
};
</script>

<style scoped>
/* Scoped styles can be added here */
</style>

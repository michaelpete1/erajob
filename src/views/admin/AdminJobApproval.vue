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
          <button @click="confirmLogout" aria-label="Logout" class="p-1.5 sm:p-2 text-white/95 hover:text-white rounded-md hover:bg-white/10 transition-colors">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-sm sm:text-base font-semibold display-font">Job Approval</h1>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/90" />
        </div>
      </header>

      <div class="mt-2 mb-4 sm:mb-6 flex items-center justify-between">
        <div class="flex items-center text-sm sm:text-base text-white/90">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
          Total: {{ filteredJobs.length }}
          <span v-if="loading" class="ml-2 text-xs">(Loading...)</span>
          <span v-if="error" class="ml-2 text-xs text-red-300">({{ error }})</span>
        </div>
        <button @click="deleteSelectedJobs" aria-label="Delete selected job offers" class="p-1.5 sm:p-2 text-white/95 hover:text-white rounded-md hover:bg-white/10 transition-colors">
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>

      <div class="mb-4 sm:mb-6 flex items-center justify-center">
        <div class="bg-white/95 backdrop-blur-sm rounded-full p-1 flex items-center gap-1 shadow-sm w-full max-w-xs">
          <button 
            @click="currentTab = 'Approved'" 
            :class="currentTab === 'Approved' ? 'bg-brand-teal text-white animate-pulse-subtle' : 'text-gray-700 hover:bg-gray-100'"
            class="flex-1 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 min-h-[40px] touch-manipulation btn-pressable"
          >
            Approved
          </button>
          <button 
            @click="currentTab = 'Pending'" 
            :class="currentTab === 'Pending' ? 'bg-brand-teal text-white animate-pulse-subtle' : 'text-gray-700 hover:bg-gray-100'"
            class="flex-1 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 min-h-[40px] touch-manipulation btn-pressable"
          >
            Pending
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>

      <div v-else-if="error" class="text-center py-8">
        <p class="text-white/80">{{ error }}</p>
        <button @click="fetchJobs" class="mt-4 px-4 py-2 bg-white/20 rounded-md hover:bg-white/30 transition-colors">
          Retry
        </button>
      </div>

      <div v-else-if="filteredJobs.length === 0" class="text-center py-8">
        <p class="text-white/80">No jobs found.</p>
      </div>

      <div v-else class="space-y-3 sm:space-y-4">
        <div v-for="(job, index) in filteredJobs" :key="job.id || index" :class="`animate-stagger-${(index % 4) + 1}`" class="bg-white/95 backdrop-blur-sm p-4 sm:p-5 rounded-xl shadow-lg border-l-4 border-white/30 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">

          <div class="flex items-center text-xs text-gray-500 mb-2">
            <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{{ job.date_created ? new Date(job.date_created * 1000).toLocaleDateString() : 'N/A' }}</span>
          </div>

          <h4 class="text-sm sm:text-lg font-bold mb-3 text-gray-900 display-font">{{ job.project_title }}</h4>

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
            <div class="flex items-center text-gray-600">
              <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span class="text-xs sm:text-sm">{{ job.category }}</span>
            </div>
            <div class="flex items-center text-green-600 font-semibold">
              <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-3.293 8.707a1 1 0 011.414 0L10 12.586l3.879-3.879a1 1 0 011.414 1.414l-4.5 4.5a1 1 0 01-1.414 0l-4.5-4.5a1 1 0 010-1.414z" />
              </svg>
              <span class="text-xs sm:text-sm">${{ job.budget }}</span>
            </div>
          </div>

          <!-- Admin Action Buttons -->
          <div class="mt-4 pt-4 border-t border-gray-100">
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                @click="approveJob(job.id!)"
                :disabled="approvingJobs.has(job.id!)"
                class="flex-1 inline-flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-md bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-xs sm:text-sm font-medium transition-all duration-300 min-h-[44px] touch-manipulation btn-pressable hover:shadow-lg hover:scale-[1.02]"
              >
                <svg v-if="approvingJobs.has(job.id!)" class="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <svg v-else class="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {{ approvingJobs.has(job.id!) ? 'Approving...' : 'Approve' }}
              </button>
              <button
                @click="rejectJob(job)"
                class="flex-1 inline-flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-medium transition-all duration-300 min-h-[44px] touch-manipulation btn-pressable hover:shadow-lg hover:scale-[1.02]"
              >
                <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Reject
              </button>
              <button
                @click="viewJobDetails(job)"
                class="flex-1 inline-flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-md bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs sm:text-sm font-medium transition-all duration-300 min-h-[44px] touch-manipulation btn-pressable hover:shadow-lg hover:scale-[1.02]"
              >
                <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    <!-- Admin Bottom Navigation -->
    <AdminBottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminBottomNav from '../../components/AdminBottomNav.vue';
import { api } from '../../services/apiService';
import type { JobsOut } from '../../types/api/openapi';

type AdminJob = JobsOut & {
  admin_approved?: boolean | null;
  status?: string | null;
  id?: string | null;
};

const router = useRouter();
const currentTab = ref<'Approved' | 'Pending'>('Pending');
const allJobs = ref<AdminJob[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const approvingJobs = ref<Set<string>>(new Set());

const ADMIN_JOBS_STORAGE_KEY = 'adminJobs';
const SELECTED_ADMIN_JOB_STORAGE_KEY = 'selectedAdminJob';

const APPROVED_STATUS_LABEL = 'Approved';
const PENDING_STATUS_LABEL = 'Pending';

const normaliseJob = (job: AdminJob): AdminJob => {
    const isApproved = Boolean(job.admin_approved);

    return {
        ...job,
        admin_approved: isApproved,
        status: job.status ?? (isApproved ? APPROVED_STATUS_LABEL : PENDING_STATUS_LABEL)
    };
};

const persistAdminJobs = () => {
    try {
        localStorage.setItem(ADMIN_JOBS_STORAGE_KEY, JSON.stringify(allJobs.value));
    } catch (storageError) {
        console.error('Error persisting admin jobs to storage:', storageError);
    }
};

const loadJobsFromStorage = () => {
    try {
        const storedJobs = localStorage.getItem(ADMIN_JOBS_STORAGE_KEY);
        if (storedJobs) {
            const parsedJobs: AdminJob[] = JSON.parse(storedJobs);
            allJobs.value = parsedJobs.map(job => normaliseJob(job));
        }
    } catch (storageError) {
        console.error('Error loading admin jobs from storage:', storageError);
    }
};

// Fetch jobs on component mount
const fetchJobs = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await api.jobs.listAdminJobs(0, 50);
        if (response.success && response.data) {
            allJobs.value = response.data.map(job => normaliseJob(job as AdminJob));
            persistAdminJobs();
        } else {
            error.value = response.error || 'Failed to fetch jobs';
        }
    } catch (err: any) {
        error.value = err.message || 'Failed to fetch jobs';
    } finally {
        loading.value = false;
    }
};

const filteredJobs = computed<AdminJob[]>(() => {
    if (currentTab.value === 'Approved') {
        return allJobs.value.filter(job => job.admin_approved);
    }
    return allJobs.value.filter(job => !job.admin_approved);
});

// Admin action functions
const approveJob = async (jobId: string) => {
    if (!jobId) return;

    const jobIdStr = String(jobId);

    approvingJobs.value.add(jobIdStr);

    const markApprovedLocally = (message?: string) => {
        allJobs.value = allJobs.value.map(job => {
            if (String(job.id) === jobIdStr) {
                return normaliseJob({
                    ...job,
                    admin_approved: true,
                    status: APPROVED_STATUS_LABEL
                });
            }
            return job;
        });
        persistAdminJobs();
        currentTab.value = 'Approved';
        if (message) {
            alert(message);
        }
    };

    try {
        const response = await api.jobs.approveJob(jobId);
        if (response.success) {
            markApprovedLocally('Job approved successfully');
        } else {
            console.error('Approve job failed with response:', response.error);
            markApprovedLocally('Job approved locally (API request failed).');
        }
    } catch (error: any) {
        console.error('Error approving job:', error);
        markApprovedLocally(`Job approved locally (API error: ${error?.message || 'unknown error'}).`);
    } finally {
        approvingJobs.value.delete(jobIdStr);
    }
};

const rejectJob = (job: AdminJob) => {
    if (!job?.id) return;

    try {
        localStorage.setItem(SELECTED_ADMIN_JOB_STORAGE_KEY, JSON.stringify(job));
    } catch (storageError) {
        console.error('Error storing selected admin job for rejection:', storageError);
    }

    router.push(`/admin/job/${job.id}/reject`);
};

const viewJobDetails = (job: AdminJob) => {
    if (!job?.id) return;

    try {
        localStorage.setItem(SELECTED_ADMIN_JOB_STORAGE_KEY, JSON.stringify(job));
    } catch (storageError) {
        console.error('Error storing selected admin job for details view:', storageError);
    }

    console.log('Viewing details for job:', job.id);
    router.push(`/admin/job/${job.id}`);
};

const deleteSelectedJobs = () => {
    const jobsToDelete = filteredJobs.value;

    if (jobsToDelete.length === 0) {
        alert('No job offers to delete in the current tab.');
        return;
    }

    const confirmMessage = `Are you sure you want to delete ${jobsToDelete.length} job offer${jobsToDelete.length > 1 ? 's' : ''} from the ${currentTab.value} tab?\n\nThis action cannot be undone.`;

    if (confirm(confirmMessage)) {
        // Remove jobs from the current tab
        jobsToDelete.forEach(job => {
            if (job.id) {
                const jobIndex = allJobs.value.findIndex(j => j.id === job.id);
                if (jobIndex !== -1) {
                    allJobs.value.splice(jobIndex, 1);
                }
            }
        });

        persistAdminJobs();

        // Show success message
        const successMessage = `Successfully deleted ${jobsToDelete.length} job offer${jobsToDelete.length > 1 ? 's' : ''}.`;

        // You could replace this with a toast notification in a real app
        alert(successMessage);

        console.log('Deleted jobs:', jobsToDelete.map(job => job.id));
    }
};

const confirmLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
        // Clear admin data and redirect to sign-in
        localStorage.removeItem('userRole');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // In a real app, you might also clear admin-specific data
        window.location.href = '/sign-in';
    }
};

// Initialize component
onMounted(() => {
    loadJobsFromStorage();
    fetchJobs();
});
</script>

<style scoped>
/* Scoped styles can be added here */
</style>
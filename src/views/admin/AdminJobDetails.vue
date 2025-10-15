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
          <button @click="goBack" aria-label="Go back" class="p-1.5 sm:p-2 text-white/95 hover:text-white rounded-md hover:bg-white/10 transition-colors">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-sm sm:text-base font-semibold">Job Details</h1>
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
          Job #{{ jobId }}
        </div>
        <div class="flex items-center gap-2">
          <span :class="getStatusClass(job?.status)" class="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
            {{ job?.status }}
          </span>
        </div>
      </div>

      <div v-if="job" class="space-y-4 sm:space-y-6 animate-fade-in">
        <!-- Job Information Card -->
        <div class="bg-white/95 backdrop-blur-sm p-5 sm:p-6 rounded-xl shadow-lg">
          <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-4">Job Information</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <p class="text-sm sm:text-base text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{{ job.title }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Posted Time</label>
              <p class="text-sm sm:text-base text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{{ job.timeAgo }}</p>
            </div>
          </div>
        </div>

        <!-- Agent Information Card -->
        <div class="bg-white/95 backdrop-blur-sm p-5 sm:p-6 rounded-xl shadow-lg">
          <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-4">Agent Information</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
              <p class="text-sm sm:text-base text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{{ job.agentName }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Agent Username</label>
              <p class="text-sm sm:text-base text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{{ job.agentUsername }}</p>
            </div>
          </div>
        </div>

        <!-- Payment Information Card (Editable only for pending jobs) -->
        <div class="bg-white/95 backdrop-blur-sm p-5 sm:p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg sm:text-xl font-bold text-gray-900">Payment Information</h3>
            <button 
              v-if="job?.status === 'Pending'"
              @click="toggleEditMode" 
              :class="isEditing ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-teal hover:bg-teal-700'"
              class="px-3 sm:px-4 py-2 rounded-md text-white text-xs sm:text-sm font-medium transition-colors min-h-[36px] touch-manipulation"
            >
              {{ isEditing ? 'Cancel' : 'Edit Payment' }}
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label for="payment-amount" class="block text-sm font-medium text-gray-700 mb-1">
                Payment Amount
              </label>
              <div v-if="job?.status !== 'Pending' || !isEditing" class="relative">
                <p class="text-sm sm:text-base text-gray-900 bg-gray-50 px-3 py-2 rounded-md font-semibold text-green-600">
                  {{ job.pay }}
                </p>
              </div>
              <div v-else-if="job?.status === 'Pending' && isEditing" class="space-y-3">
                <input
                  id="payment-amount"
                  v-model="editedPayment"
                  type="text"
                  placeholder="Enter payment amount (e.g., $2,500 or $68/hr)"
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all"
                />
                <div class="flex gap-2 sm:gap-3">
                  <button 
                    @click="savePayment" 
                    class="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors min-h-[44px] touch-manipulation"
                  >
                    <svg class="w-4 h-4 inline mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Save Changes
                  </button>
                  <button 
                    @click="cancelEdit" 
                    class="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors min-h-[44px] touch-manipulation"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            
            <div v-if="isEditing" class="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div class="flex items-start">
                <svg class="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
                <div class="text-sm text-blue-800">
                  <p class="font-medium">Payment Format Examples:</p>
                  <ul class="mt-1 list-disc list-inside text-blue-700">
                    <li>Fixed price: <code class="bg-blue-100 px-1 rounded">$2,500</code></li>
                    <li>Hourly rate: <code class="bg-blue-100 px-1 rounded">$68/hr</code></li>
                    <li>Price range: <code class="bg-blue-100 px-1 rounded">$80 - $120</code></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="bg-white/95 backdrop-blur-sm p-5 sm:p-6 rounded-xl shadow-lg">
          <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-4">Actions</h3>
          
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button 
              v-if="job.status === 'Pending'"
              @click="approveJob" 
              class="flex-1 inline-flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-md bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-medium transition-colors min-h-[44px] touch-manipulation"
            >
              <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Approve Job
            </button>
            <button 
              v-if="job.status === 'Pending'"
              @click="rejectJob" 
              class="flex-1 inline-flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-medium transition-colors min-h-[44px] touch-manipulation"
            >
              <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Reject Job
            </button>
            <button 
              @click="deleteJob" 
              class="flex-1 inline-flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-md bg-gray-600 hover:bg-gray-700 text-white text-xs sm:text-sm font-medium transition-colors min-h-[44px] touch-manipulation"
            >
              <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Delete Job
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <div class="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-lg">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Job Not Found</h3>
          <p class="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
          <button @click="goBack" class="bg-brand-teal hover:bg-teal-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
            Go Back
          </button>
        </div>
      </div>
    </div>
    
    <!-- Rejection Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeRejectModal">
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900">Reject Job Offer</h3>
            <button @click="closeRejectModal" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="mb-6">
            <p class="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this job offer. This will be shared with the agent to help them understand the decision.
            </p>
            
            <div class="space-y-4">
              <div>
                <label for="rejection-reason" class="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="rejection-reason"
                  v-model="rejectionReason"
                  rows="4"
                  placeholder="Please explain why this job offer is being rejected..."
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
                  :disabled="isSubmittingRejection"
                ></textarea>
                <p class="mt-1 text-xs text-gray-500">
                  Be specific and constructive to help the agent improve their future applications.
                </p>
              </div>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              @click="closeRejectModal"
              :disabled="isSubmittingRejection"
              class="flex-1 px-4 py-2.5 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium transition-colors min-h-[44px] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              @click="submitRejection"
              :disabled="isSubmittingRejection || !rejectionReason.trim()"
              class="flex-1 px-4 py-2.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors min-h-[44px] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg v-if="isSubmittingRejection" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              {{ isSubmittingRejection ? 'Rejecting...' : 'Reject Job' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
 

const route = useRoute();
const router = useRouter();

const jobId = ref<number>(0);
const job = ref<any>(null);
const isEditing = ref(false);
const editedPayment = ref('');
const showRejectModal = ref(false);
const rejectionReason = ref('');
const isSubmittingRejection = ref(false);

// Mock job data - in a real app, this would come from an API
const mockJobs = [
    { id: 1, status: 'Approved', timeAgo: '8 hours ago', title: 'Complete Freelancer Application UI/UX Revamp', agentName: 'Jenny Wilson', agentUsername: 'jennyson', pay: '$2,500' },
    { id: 2, status: 'Pending', timeAgo: '41 minutes ago', title: 'Create a Social Media Banner for a Fitness Brand', agentName: 'Matt Barrie', agentUsername: 'matt', pay: '$68/hr' },
    { id: 3, status: 'Pending', timeAgo: '1 hour ago', title: 'Write SEO Content for a Tech Blog', agentName: 'Matt Barrie', agentUsername: 'matt', pay: '$80 -120' },
];

onMounted(() => {
  // Get job ID from route params
  jobId.value = parseInt(route.params.id as string) || 0;
  
  // Find the job
  job.value = mockJobs.find(j => j.id === jobId.value) || null;
  
  if (job.value) {
    editedPayment.value = job.value.pay;
  }
});

function getStatusClass(status: string) {
  switch (status) {
    case 'Approved':
      return 'bg-green-100 text-green-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function toggleEditMode() {
  isEditing.value = !isEditing.value;
  if (isEditing.value) {
    editedPayment.value = job.value.pay;
  }
}

function savePayment() {
  if (job.value && editedPayment.value.trim()) {
    // In a real app, this would call an API to update the payment
    job.value.pay = editedPayment.value.trim();
    
    // Show success message
    alert('Payment amount updated successfully!');
    
    // Exit edit mode
    isEditing.value = false;
    
    console.log('Payment updated for job', jobId.value, ':', editedPayment.value);
  } else {
    alert('Please enter a valid payment amount.');
  }
}

function cancelEdit() {
  isEditing.value = false;
  editedPayment.value = job.value.pay;
}

function goBack() {
  router.push('/admin/job-approval');
}

function approveJob() {
  if (job.value) {
    job.value.status = 'Approved';
    alert('Job approved successfully!');
    console.log('Job approved:', jobId.value);
  }
}

function rejectJob() {
  showRejectModal.value = true;
  rejectionReason.value = '';
}

function closeRejectModal() {
  showRejectModal.value = false;
  rejectionReason.value = '';
}

function submitRejection() {
  if (!rejectionReason.value.trim()) {
    alert('Please provide a reason for rejection.');
    return;
  }
  
  if (confirm('Are you sure you want to reject this job? This action cannot be undone.')) {
    isSubmittingRejection.value = true;
    
    // Simulate API call
    setTimeout(() => {
      if (job.value) {
        job.value.status = 'Rejected';
        job.value.rejectionReason = rejectionReason.value.trim();
        
        alert('Job rejected successfully! The agent will be notified with your reason.');
        console.log('Job rejected:', jobId.value, 'Reason:', rejectionReason.value);
        
        router.push('/admin/job-approval');
      }
      isSubmittingRejection.value = false;
    }, 500);
  }
}

function deleteJob() {
  if (confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
    // In a real app, this would call an API to delete the job
    alert('Job deleted successfully!');
    router.push('/admin/job-approval');
    console.log('Job deleted:', jobId.value);
  }
}
</script>

<style scoped>
/* Scoped styles can be added here */
</style>

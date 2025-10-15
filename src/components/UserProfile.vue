<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { UserOut } from '@/types/api';

// Props definition
const props = defineProps<{
  userId?: string; // Optional: If not provided, will fetch current user
  isAdminView?: boolean; // If true, shows additional admin actions
}>();

// Reactive state
const userProfile = ref<UserOut | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Status badge styling
const statusBadgeClass = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

// Format date for display
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

// Fetch user profile
const fetchUserProfile = async () => {
  try {
    isLoading.value = true;
    // TODO: Replace with actual API call
    // const response = await apiService.getUserProfile(props.userId);
    // userProfile.value = response.data;
    
    // Mock data for demonstration
    userProfile.value = {
      id: props.userId || '123',
      email: 'user@example.com',
      full_name: 'John Doe',
      role: 'client',
      status: 'approved',
      is_admin: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      approved_at: new Date().toISOString(),
      rejected_at: undefined,
      rejection_reason: undefined,
    };
  } catch (err) {
    error.value = 'Failed to load user profile';
    console.error('Error fetching user profile:', err);
  } finally {
    isLoading.value = false;
  }
};

// Fetch profile when component mounts
onMounted(() => {
  fetchUserProfile();
});
</script>

<template>
  <div class="bg-white shadow rounded-lg p-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
      <p class="mt-2 text-gray-600">Loading profile...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-md">
      {{ error }}
    </div>

    <!-- Profile Content -->
    <div v-else-if="userProfile" class="space-y-6">
      <!-- Header with Name and Status -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ userProfile.full_name || 'No name provided' }}</h1>
          <div class="mt-1 flex items-center">
            <span class="text-gray-600">{{ userProfile.email }}</span>
            <span 
              v-if="userProfile.role"
              class="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
            >
              {{ userProfile.role }}
            </span>
          </div>
        </div>
        <span 
          v-if="userProfile.status"
          class="mt-2 sm:mt-0 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium"
          :class="statusBadgeClass[userProfile.status] || 'bg-gray-100 text-gray-800'"
        >
          {{ userProfile.status }}
        </span>
      </div>

      <!-- Profile Details -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Account Information -->
        <div>
          <h2 class="text-lg font-medium text-gray-900 mb-3">Account Information</h2>
          <dl class="space-y-3">
            <div class="sm:grid sm:grid-cols-3 sm:gap-4">
              <dt class="text-sm font-medium text-gray-500">Member Since</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2">
                {{ formatDate(userProfile.created_at) }}
              </dd>
            </div>
            <div class="sm:grid sm:grid-cols-3 sm:gap-4">
              <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2">
                {{ formatDate(userProfile.updated_at) }}
              </dd>
            </div>
            <div v-if="userProfile.status === 'approved'" class="sm:grid sm:grid-cols-3 sm:gap-4">
              <dt class="text-sm font-medium text-gray-500">Approved On</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2">
                {{ formatDate(userProfile.approved_at || undefined) }}
              </dd>
            </div>
            <div v-if="userProfile.status === 'rejected'" class="sm:grid sm:grid-cols-3 sm:gap-4">
              <dt class="text-sm font-medium text-gray-500">Rejection Reason</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2">
                {{ userProfile.rejection_reason || 'No reason provided' }}
              </dd>
            </div>
          </dl>
        </div>

        <!-- Additional Profile Information -->
        <div>
          <h2 class="text-lg font-medium text-gray-900 mb-3">Contact Information</h2>
          <dl class="space-y-3">
            <div class="sm:grid sm:grid-cols-3 sm:gap-4">
              <dt class="text-sm font-medium text-gray-500">Email</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2">
                {{ userProfile.email }}
              </dd>
            </div>
            <!-- Additional contact fields can be added here -->
          </dl>
        </div>
      </div>

      <!-- Admin Actions -->
      <div v-if="isAdminView" class="pt-4 border-t">
        <h2 class="text-lg font-medium text-gray-900 mb-3">Admin Actions</h2>
        <div class="flex space-x-3">
          <button 
            v-if="userProfile.status !== 'approved'"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            @click="$emit('approve', userProfile.id)"
          >
            Approve User
          </button>
          <button 
            v-if="userProfile.status !== 'rejected'"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            @click="$emit('reject', userProfile.id)"
          >
            Reject User
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

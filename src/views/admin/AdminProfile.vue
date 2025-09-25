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
          <h1 class="text-sm sm:text-base font-semibold">Admin Profile</h1>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/90" />
        </div>
      </header>

      <div class="mt-2 mb-4 sm:mb-6 flex items-center justify-between">
        <div class="flex items-center text-sm sm:text-base text-white/90">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Admin Profile
        </div>
        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white/90 cursor-pointer hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      </div>

      <div class="space-y-4 sm:space-y-6 animate-fade-in">
        <!-- Profile Card -->
        <div class="bg-white/95 backdrop-blur-sm p-5 sm:p-6 rounded-xl shadow-lg">
          <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
              A
            </div>
            <div class="text-center sm:text-left flex-1">
              <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Admin User</h2>
              <p class="text-sm sm:text-base text-gray-600 mb-2">admin@erajob.com</p>
              <div class="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-teal-100 text-teal-800">
                <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                </svg>
                Administrator
              </div>
            </div>
          </div>

          <!-- Profile Information -->
          <div class="space-y-4">
            <div class="border-t border-gray-200 pt-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Account Information</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <p class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">Admin User</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <p class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">admin@erajob.com</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <p class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">Administrator</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                  <p class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">January 2024</p>
                </div>
              </div>
            </div>

            <!-- Admin Statistics -->
            <div class="border-t border-gray-200 pt-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Admin Statistics</h3>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div class="text-center p-3 bg-blue-50 rounded-lg">
                  <div class="text-2xl font-bold text-blue-600">24</div>
                  <div class="text-xs text-blue-600">Total Jobs</div>
                </div>
                <div class="text-center p-3 bg-green-50 rounded-lg">
                  <div class="text-2xl font-bold text-green-600">18</div>
                  <div class="text-xs text-green-600">Approved</div>
                </div>
                <div class="text-center p-3 bg-yellow-50 rounded-lg">
                  <div class="text-2xl font-bold text-yellow-600">4</div>
                  <div class="text-xs text-yellow-600">Pending</div>
                </div>
                <div class="text-center p-3 bg-red-50 rounded-lg">
                  <div class="text-2xl font-bold text-red-600">2</div>
                  <div class="text-xs text-red-600">Rejected</div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="border-t border-gray-200 pt-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div class="flex flex-col sm:flex-row gap-3">
                <button @click="$router.push('/admin/job-approval')" class="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-md transition-colors min-h-[44px] touch-manipulation">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2h2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6"></path>
                  </svg>
                  View Job Offers
                </button>
                <button @click="$router.push('/admin/notifications')" class="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-sm font-medium rounded-md transition-colors min-h-[44px] touch-manipulation">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-2.81a6.002 6.002 0 00-1.238-3.037l-.95-.95a2.5 2.5 0 01-3.536 0L10 11.414l-1.414 1.414a2.5 2.5 0 01-3.536 0L3 11.414V17h12zm-4-9a1 1 0 100-2 1 1 0 000 2z"></path>
                  </svg>
                  View Notifications
                </button>
              </div>
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
import AdminBottomNav from '../../components/AdminBottomNav.vue';

const confirmLogout = () => {
  if (confirm('Are you sure you want to logout?')) {
    // Clear admin data and redirect to sign-in
    localStorage.removeItem('userRole');
    localStorage.removeItem('userInfo');
    // In a real app, you might also clear admin-specific data
    window.location.href = '/sign-in';
  }
};
</script>

<style scoped>
/* Scoped styles can be added here */
</style>

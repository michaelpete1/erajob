<template>
  <div class="fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-white shadow-lg flex justify-around items-center border-t border-gray-200 z-50" style="padding-bottom: env(safe-area-inset-bottom, 0)">
    <div class="text-center flex-1" :class="{ 'text-teal-500': $route.path === '/admin/job-approval', 'text-gray-500': $route.path !== '/admin/job-approval' }">
      <router-link to="/admin/job-approval" class="flex flex-col items-center justify-center w-full py-1 min-h-[44px] touch-manipulation">
        <svg class="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2h2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6"></path>
        </svg>
        <p class="text-xs sm:text-sm mt-0.5">Job Review</p>
      </router-link>
    </div>
    <div class="text-center flex-1" :class="{ 'text-teal-500': $route.path === '/admin/user-approvals', 'text-gray-500': $route.path !== '/admin/user-approvals' }">
      <router-link to="/admin/user-approvals" class="flex flex-col items-center justify-center w-full py-1 min-h-[44px] touch-manipulation">
        <svg class="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <p class="text-xs sm:text-sm mt-0.5">Approvals</p>
      </router-link>
    </div>
    <div class="text-center flex-1" :class="{ 'text-teal-500': $route.path === '/admin/notifications', 'text-gray-500': $route.path !== '/admin/notifications' }">
      <router-link to="/admin/notifications" class="flex flex-col items-center justify-center w-full py-1 min-h-[44px] touch-manipulation">
        <svg class="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-2.81a6.002 6.002 0 00-1.238-3.037l-.95-.95a2.5 2.5 0 01-3.536 0L10 11.414l-1.414 1.414a2.5 2.5 0 01-3.536 0L3 11.414V17h12zm-4-9a1 1 0 100-2 1 1 0 000 2z"></path>
        </svg>
        <p class="text-xs sm:text-sm mt-0.5">Notifications</p>
      </router-link>
    </div>
    <div class="text-center flex-1" :class="{ 'text-teal-500': $route.path === '/admin/profile', 'text-gray-500': $route.path !== '/admin/profile' }">
      <router-link to="/admin/profile" class="flex flex-col items-center justify-center w-full py-1 min-h-[44px] touch-manipulation">
        <svg class="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        <p class="text-xs sm:text-sm mt-0.5">Profile</p>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

const BODY_CLASS = 'admin-bottom-nav-safe'

onMounted(() => {
  if (typeof document !== 'undefined') {
    document.body.classList.add(BODY_CLASS)
  }
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.body.classList.remove(BODY_CLASS)
  }
})
</script>

<style scoped>
.admin-bottom-nav-safe {
  padding-bottom: 80px;
}
</style>

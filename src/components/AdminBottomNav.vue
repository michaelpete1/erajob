<template>
  <div class="fixed bottom-0 left-0 right-0 px-2 py-1 sm:px-3 sm:py-1.5 bg-white shadow flex justify-around items-center border-t border-gray-200 z-50" style="padding-bottom: env(safe-area-inset-bottom, 0)">
    <div class="text-center flex-1" :class="{ 'text-teal-500': $route.path === '/admin/user-approvals', 'text-gray-500': $route.path !== '/admin/user-approvals' }">
      <router-link to="/admin/user-approvals" class="flex flex-col items-center justify-center w-full py-0.5 min-h-[32px] touch-manipulation">
        <svg class="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5V4h-5M7 20H2V10h5m0 0l5 5m-5-5l5-5" />
        </svg>
        <p class="text-[11px] sm:text-xs mt-0.5">User Approval</p>
      </router-link>
    </div>
    <div class="text-center flex-1" :class="{ 'text-teal-500': $route.path === '/admin/alerts', 'text-gray-500': $route.path !== '/admin/alerts' }">
      <router-link to="/admin/alerts" class="flex flex-col items-center justify-center w-full py-0.5 min-h-[32px] touch-manipulation">
        <svg class="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-2.81a6.002 6.002 0 00-1.238-3.037l-.95-.95a2.5 2.5 0 01-3.536 0L10 11.414l-1.414 1.414a2.5 2.5 0 01-3.536 0L3 11.414V17h12zm-4-9a1 1 0 100-2 1 1 0 000 2z"></path>
        </svg>
        <p class="text-[11px] sm:text-xs mt-0.5">Notifications</p>
      </router-link>
  </div>
  <div class="text-center flex-1" :class="{ 'text-teal-500': $route.path === '/admin/profile', 'text-gray-500': $route.path !== '/admin/profile' }">
    <router-link to="/admin/profile" class="flex flex-col items-center justify-center w-full py-0.5 min-h-[32px] touch-manipulation">
      <svg class="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
      </svg>
      <p class="text-[11px] sm:text-xs mt-0.5">Profile</p>
    </router-link>
  </div>
  <div class="text-center flex-1" :class="{ 'text-teal-500': $route.path === '/admin/jobs', 'text-gray-500': $route.path !== '/admin/jobs' }">
    <router-link to="/admin/jobs" class="flex flex-col items-center justify-center w-full py-0.5 min-h-[32px] touch-manipulation">
      <svg class="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18M3 17h18" />
      </svg>
      <p class="text-[11px] sm:text-xs mt-0.5">Jobs</p>
    </router-link>
  </div>
</div>
</template>

<script setup lang="ts">
</script>

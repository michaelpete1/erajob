<template>
  <div class="min-h-screen bg-gray-50 font-sans antialiased text-gray-800">
    <!-- Header -->
    <header class="bg-teal-500 text-white px-4 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between shadow-md sticky top-0 z-30 backdrop-blur-sm bg-opacity-95">
      <div class="flex items-center">
        <button @click="$router.back()" class="p-2 -ml-2 sm:p-2 sm:-ml-2 md:p-2.5 md:-ml-2.5 rounded-full hover:bg-white hover:bg-opacity-10 active:bg-opacity-20 transition-all duration-200 touch-manipulation" aria-label="Go back">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <h1 class="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight ml-1 sm:ml-2">Account</h1>
      </div>
    </header>

    <main class="px-3 sm:px-4 md:px-6 py-4 sm:py-6 pb-24 sm:pb-28 max-w-4xl mx-auto">
      <!-- Profile Section -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm mb-6 sm:mb-8 p-4 sm:p-6 border border-gray-100">
        <div class="flex flex-col items-center text-center">
          <div class="relative mb-4">
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg">
              {{ userInitials }}
            </div>
            <button class="absolute bottom-0 right-0 w-8 h-8 sm:w-9 sm:h-9 bg-teal-500 text-white rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors shadow-md">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </button>
          </div>
          
          <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">{{ userName }}</h2>
          <p class="text-sm sm:text-base text-gray-500 mb-3">{{ userEmail }}</p>
          <div class="inline-flex items-center px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Client Account
          </div>
        </div>
      </div>

      <!-- Account Details -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm mb-6 sm:mb-8 border border-gray-100">
        <div class="p-4 sm:p-6 border-b border-gray-100">
          <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Account Details</h3>
          
          <div class="space-y-4 sm:space-y-6">
            <!-- Full Name -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4 border-b border-gray-50">
              <div class="flex items-center gap-3 mb-2 sm:mb-0">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-600">Full Name</p>
                  <p class="text-sm text-gray-500">Your legal name</p>
                </div>
              </div>
              <p class="text-sm font-medium text-gray-900">{{ userProfile.name || userName }}</p>
            </div>

            <!-- Email Address -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4 border-b border-gray-50">
              <div class="flex items-center gap-3 mb-2 sm:mb-0">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-600">Email Address</p>
                  <p class="text-sm text-gray-500">Primary email for notifications</p>
                </div>
              </div>
              <p class="text-sm font-medium text-gray-900">{{ userProfile.email || userEmail }}</p>
            </div>

            <!-- Phone Number -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4 border-b border-gray-50">
              <div class="flex items-center gap-3 mb-2 sm:mb-0">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-600">Phone Number</p>
                  <p class="text-sm text-gray-500">Contact number for communication</p>
                </div>
              </div>
              <p class="text-sm font-medium text-gray-900">{{ userProfile.phone || 'Not provided' }}</p>
            </div>

          </div>
        </div>
      </div>

      <!-- Account Status -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm mb-6 sm:mb-8 border border-gray-100">
        <div class="p-4 sm:p-6 border-b border-gray-100">
          <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Account Status</h3>
          
          <div class="space-y-4 sm:space-y-6">
            <!-- Account Type -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4 border-b border-gray-50">
              <div class="flex items-center gap-3 mb-2 sm:mb-0">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-600">Account Type</p>
                  <p class="text-sm text-gray-500">Your account role</p>
                </div>
              </div>
              <div class="inline-flex items-center px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                Client
              </div>
            </div>

            <!-- Member Since -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4">
              <div class="flex items-center gap-3 mb-2 sm:mb-0">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-600">Member Since</p>
                  <p class="text-sm text-gray-500">When you joined EraJob</p>
                </div>
              </div>
              <p class="text-sm font-medium text-gray-900">{{ memberSince }}</p>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '../../services/api'

const router = useRouter()

// User data
const userName = ref('John Doe')
const userEmail = ref('john.doe@example.com')

// User profile data
const userProfile = ref({
  name: '',
  email: '',
  phone: '',
  bio: ''
})

// Member since date
const memberSince = ref('January 2024')

// Computed user initials
const userInitials = computed(() => {
  return userName.value
    .split(' ')
    .map(name => name.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
})

onMounted(() => {
  console.log('ClientAccount component mounted')
  
  // Load user data from localStorage if available
  const savedUserName = localStorage.getItem('userName')
  const savedUserEmail = localStorage.getItem('userEmail')
  
  if (savedUserName) userName.value = savedUserName
  if (savedUserEmail) userEmail.value = savedUserEmail
  
  // Load profile data
  try {
    const savedProfile = localStorage.getItem('clientProfile')
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile)
      userProfile.value = { ...userProfile.value, ...parsed }
    }
    
    // Load user info from localStorage if available
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo)
      if (!userProfile.value.name && parsedUserInfo.name) {
        userProfile.value.name = parsedUserInfo.name
      }
      if (!userProfile.value.email && parsedUserInfo.email) {
        userProfile.value.email = parsedUserInfo.email
      }
      if (parsedUserInfo.createdAt) {
        const createdDate = new Date(parsedUserInfo.createdAt)
        memberSince.value = createdDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        })
      }
    }
  } catch (error) {
    console.error('Error loading profile:', error)
  }

  // Fetch real client profile from API
  fetchClientProfile()
})

async function fetchClientProfile() {
  try {
    const resp = await apiService.getClientProfile()
    if (resp.success && resp.data) {
      const payload = resp.data
      const data = (payload && typeof payload === 'object') ? (payload.data || payload) : null
      if (data) {
        // Map fields from API
        const fullName = data.full_name || data.name || ''
        const email = data.email || ''
        const phone = data.phone_number || ''
        const created = data.date_created

        if (fullName) userName.value = fullName
        if (email) userEmail.value = email
        userProfile.value = {
          ...userProfile.value,
          name: fullName || userProfile.value.name,
          email: email || userProfile.value.email,
          phone: phone || userProfile.value.phone,
        }

        if (typeof created === 'number' && !Number.isNaN(created)) {
          const createdDate = new Date(created * 1000)
          memberSince.value = createdDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
        }
      }
    } else if (!resp.success) {
      console.warn('Failed to fetch client profile:', resp.error)
    }
  } catch (e) {
    console.error('Error fetching client profile:', e)
  }
}
</script>

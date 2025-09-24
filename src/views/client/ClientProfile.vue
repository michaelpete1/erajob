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
        <h1 class="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight ml-1 sm:ml-2">Profile</h1>
      </div>
      <button @click="goToSettings" class="p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors" aria-label="Settings">
        <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      </button>
    </header>

    <main class="px-3 sm:px-4 md:px-6 py-4 sm:py-6 pb-24 sm:pb-28 max-w-4xl mx-auto">
      <!-- Profile Header Section -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm mb-6 sm:mb-8 p-4 sm:p-6 border border-gray-100">
        <div class="flex flex-col items-center text-center">
          <div class="relative mb-4">
            <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg">
              {{ userInitials }}
            </div>
            <button @click="triggerFileInput" class="absolute bottom-0 right-0 w-8 h-8 sm:w-9 sm:h-9 bg-teal-500 text-white rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors shadow-md">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </button>
            <input 
              ref="fileInput" 
              type="file" 
              class="hidden" 
              accept="image/*" 
              @change="handleImageUpload"
            >
          </div>
          
          <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">{{ userProfile.name || 'Your Name' }}</h2>
          <p class="text-sm sm:text-base text-gray-500 mb-3">{{ userProfile.email || 'your.email@example.com' }}</p>
          <div class="inline-flex items-center px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Client Account
          </div>
          <p class="text-xs sm:text-sm text-gray-400 mt-2">Member since {{ memberSince }}</p>
        </div>
      </div>

      <!-- Profile Information Display -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm mb-6 sm:mb-8 border border-gray-100">
        <div class="p-4 sm:p-6">
          <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Profile Information</h3>
          
          <div class="space-y-4 sm:space-y-6">
            <!-- Full Name -->
            <div class="flex items-center justify-between py-2">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-500">Full Name</div>
                  <div class="text-gray-900">{{ userProfile.name || 'Not provided' }}</div>
                </div>
              </div>
              <button @click="goToSettings" class="text-teal-600 hover:text-teal-700 text-sm font-medium">
                Edit
              </button>
            </div>

            <!-- Email -->
            <div class="flex items-center justify-between py-2">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-500">Email Address</div>
                  <div class="text-gray-900">{{ userProfile.email || 'Not provided' }}</div>
                </div>
              </div>
              <button @click="goToSettings" class="text-teal-600 hover:text-teal-700 text-sm font-medium">
                Edit
              </button>
            </div>

            <!-- Phone -->
            <div class="flex items-center justify-between py-2">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-500">Phone Number</div>
                  <div class="text-gray-900">{{ userProfile.phone || 'Not provided' }}</div>
                </div>
              </div>
              <button @click="goToSettings" class="text-teal-600 hover:text-teal-700 text-sm font-medium">
                Edit
              </button>
            </div>

            <!-- Location -->
            <div class="flex items-center justify-between py-2">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-500">Location</div>
                  <div class="text-gray-900">{{ userProfile.location || 'Not provided' }}</div>
                </div>
              </div>
              <button @click="goToSettings" class="text-teal-600 hover:text-teal-700 text-sm font-medium">
                Edit
              </button>
            </div>

            <!-- Bio -->
            <div class="pt-4 border-t border-gray-100">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-500">Bio</div>
                  <div class="text-gray-900">{{ userProfile.bio || 'No bio provided' }}</div>
                </div>
              </div>
              <button @click="goToSettings" class="text-teal-600 hover:text-teal-700 text-sm font-medium ml-11">
                Edit Bio
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Statistics -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm mb-6 sm:mb-8 border border-gray-100">
        <div class="p-4 sm:p-6">
          <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Account Statistics</h3>
          
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div class="text-center">
              <div class="text-2xl sm:text-3xl font-bold text-teal-600">{{ userProfile.stats?.activeProjects || 0 }}</div>
              <div class="text-xs sm:text-sm text-gray-500">Active Projects</div>
            </div>
            <div class="text-center">
              <div class="text-2xl sm:text-3xl font-bold text-teal-600">{{ userProfile.stats?.completedProjects || 0 }}</div>
              <div class="text-xs sm:text-sm text-gray-500">Completed</div>
            </div>
            <div class="text-center">
              <div class="text-2xl sm:text-3xl font-bold text-teal-600">{{ userProfile.stats?.totalSpent || 0 }}</div>
              <div class="text-xs sm:text-sm text-gray-500">Total Spent</div>
            </div>
            <div class="text-center">
              <div class="text-2xl sm:text-3xl font-bold text-teal-600">{{ userProfile.stats?.agentsHired || 0 }}</div>
              <div class="text-xs sm:text-sm text-gray-500">Agents Hired</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
        <div class="p-4 sm:p-6">
          <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          
          <div class="space-y-3 sm:space-y-4">
            <button 
              @click="goToProjects" 
              class="w-full flex items-center justify-between p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
                <div class="text-left">
                  <div class="font-medium text-gray-900">My Projects</div>
                  <div class="text-xs sm:text-sm text-gray-500">View and manage your projects</div>
                </div>
              </div>
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>

            <button 
              @click="goToNotifications" 
              class="w-full flex items-center justify-between p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                </div>
                <div class="text-left">
                  <div class="font-medium text-gray-900">Notifications</div>
                  <div class="text-xs sm:text-sm text-gray-500">Manage your notifications</div>
                </div>
              </div>
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>

            <button 
              @click="goToSettings" 
              class="w-full flex items-center justify-between p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div class="text-left">
                  <div class="font-medium text-gray-900">Account Settings</div>
                  <div class="text-xs sm:text-sm text-gray-500">Manage account preferences</div>
                </div>
              </div>
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const fileInput = ref(null)

// User profile data
const userProfile = ref({
  name: '',
  email: '',
  phone: '',
  location: '',
  bio: '',
  avatar: null,
  stats: {
    activeProjects: 0,
    completedProjects: 0,
    totalSpent: 0,
    agentsHired: 0
  }
})


// Computed properties
const userInitials = computed(() => {
  if (!userProfile.value.name) return 'U'
  return userProfile.value.name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
})

const memberSince = computed(() => {
  const date = new Date()
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})


// Methods
const triggerFileInput = () => {
  fileInput.value.click()
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      userProfile.value.avatar = e.target.result
      // Save the updated avatar
      localStorage.setItem('clientProfile', JSON.stringify(userProfile.value))
    }
    reader.readAsDataURL(file)
  }
}

const goToSettings = () => {
  router.push('/client/settings')
}

const goToProjects = () => {
  router.push('/client/projects')
}

const goToNotifications = () => {
  router.push('/client/notifications')
}

// Load profile data on mount
onMounted(() => {
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
    }
  } catch (error) {
    console.error('Error loading profile:', error)
  }
})
</script>

<style scoped>
/* Custom animations and transitions */
input:focus, textarea:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
}

button:disabled {
  transform: none;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .grid {
    gap: 1rem;
  }
}
</style>

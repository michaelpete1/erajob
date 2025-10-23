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
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-700 font-medium">{{ error }}</p>
        </div>
      </div>

      <!-- Profile Content (only show when not loading and no error) -->
      <div v-else>
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
                <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleImageUpload">
              </button>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900">{{ displayName }}</h2>
            <p class="text-gray-600 mt-1">{{ userProfile.title || 'Client' }}</p>
            <p class="text-gray-500 text-sm mt-2 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {{ userProfile.location || 'Unknown location' }}
            </p>
          </div>
        </div>

        <!-- Rest of your template content -->
        <!-- ... -->

      </div>
    </main>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usersService, apiService } from '../../services'
import type { EJUserOut } from '@/types/api'

const router = useRouter()
const fileInput = ref<HTMLInputElement | null>(null)

// User profile data
type ClientProfile = {
  name: string
  email: string
  phone: string
  location: string
  bio: string
  avatar: string | null
  title?: string
  stats: {
    activeProjects: number
    completedProjects: number
    totalSpent: number
    agentsHired: number
  }
}

const userProfile = ref<ClientProfile>({
  name: '',
  email: '',
  phone: '',
  location: '',
  bio: '',
  avatar: null,
  title: '',
  stats: {
    activeProjects: 0,
    completedProjects: 0,
    totalSpent: 0,
    agentsHired: 0
  }
})

const resetEmail = ref('')
const resetToken = ref('')
const resetOtp = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const resetTokenLoading = ref(false)
const resetSubmitting = ref(false)
const resetSuccess = ref('')
const resetError = ref('')

// Loading and error states
const loading = ref(false)
const error = ref<string | null>(null)

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

const displayName = computed(() => userProfile.value.name || 'Your Name')
const displayEmail = computed(() => userProfile.value.email || 'your.email@example.com')
const canSubmitReset = computed(() => {
  return (
    resetToken.value.trim() !== '' &&
    resetOtp.value.trim() !== '' &&
    newPassword.value.length >= 8 &&
    newPassword.value === confirmPassword.value
  )
})

// Methods
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  const file = target?.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      userProfile.value.avatar = typeof e.target?.result === 'string' ? e.target.result : null
      if (userProfile.value.avatar) {
        localStorage.setItem('clientProfile', JSON.stringify(userProfile.value))
      }
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

const syncResetEmail = () => {
  if (userProfile.value.email) {
    resetEmail.value = userProfile.value.email
  }
}

const requestResetToken = async () => {
  resetError.value = ''
  resetSuccess.value = ''

  const email = resetEmail.value.trim()
  if (!email) {
    resetError.value = 'Please enter your account email before requesting a reset token.'
    return
  }

  resetTokenLoading.value = true
  try {
    const response = await apiService.forgotPassword({ email })
    if (!response.success) {
      resetError.value = response.error || 'Unable to generate reset token. Please try again.'
      return
    }

    resetSuccess.value = response.data?.message || 'Reset token generated. Check your email for details.'
  } catch (error) {
    resetError.value = error instanceof Error ? error.message : 'Unable to generate reset token. Please try again.'
  } finally {
    resetTokenLoading.value = false
  }
}

const submitPasswordReset = async () => {
  resetError.value = ''
  resetSuccess.value = ''

  if (!canSubmitReset.value) {
    resetError.value = 'Please provide all required details. Passwords must match and be at least 8 characters.'
    return
  }

  resetSubmitting.value = true
  try {
    const response = await apiService.resetPassword({
      token: resetToken.value.trim(),
      new_password: newPassword.value
    })
    if (!response.success) {
      resetError.value = response.error || 'Unable to reset password. Please verify the token and OTP.'
      return
    }

    resetSuccess.value = response.data?.message || 'Password updated successfully. You can now sign in with the new password.'
    newPassword.value = ''
    confirmPassword.value = ''
    resetOtp.value = ''
  } catch (error) {
    resetError.value = error instanceof Error ? error.message : 'Unable to reset password. Please verify the token and OTP.'
  } finally {
    resetSubmitting.value = false
  }
}

// Load profile data on mount
onMounted(async () => {
  loading.value = true
  error.value = null

  try {
    const result = await usersService.getCurrentUser()

    if (result.success && result.data) {
      const rawData = result.data as EJUserOut & Record<string, unknown>
      const stats = (rawData.stats as Partial<ClientProfile['stats']> | undefined) ?? {}

      userProfile.value = {
        name: typeof rawData.full_name === 'string' ? rawData.full_name : typeof rawData.name === 'string' ? rawData.name : '',
        email: typeof rawData.email === 'string' ? rawData.email : '',
        phone: typeof rawData.phone === 'string' ? rawData.phone : '',
        location: typeof rawData.location === 'string' ? rawData.location : '',
        bio: typeof rawData.bio === 'string' ? rawData.bio : '',
        avatar: typeof rawData.avatar === 'string' ? rawData.avatar : null,
        title: typeof rawData.title === 'string' ? rawData.title : '',
        stats: {
          activeProjects: typeof stats.activeProjects === 'number' ? stats.activeProjects : 0,
          completedProjects: typeof stats.completedProjects === 'number' ? stats.completedProjects : 0,
          totalSpent: typeof stats.totalSpent === 'number' ? stats.totalSpent : 0,
          agentsHired: typeof stats.agentsHired === 'number' ? stats.agentsHired : 0
        }
      }

      // Save to localStorage as backup
      localStorage.setItem('clientProfile', JSON.stringify(userProfile.value))
      syncResetEmail()
    } else {
      // Fallback to localStorage if API fails
      const savedProfile = localStorage.getItem('clientProfile')
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile)
        userProfile.value = { ...userProfile.value, ...parsed }
      }
      error.value = result.error || 'Failed to load profile'
      syncResetEmail()
    }
  } catch (caughtError) {
    console.error('Error loading profile:', caughtError)
    error.value = caughtError instanceof Error ? caughtError.message : 'Failed to load profile data'

    // Fallback to localStorage
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
    } catch (localStorageError) {
      console.error('Error loading profile from localStorage:', localStorageError)
    }
    syncResetEmail()
  } finally {
    loading.value = false
  }
})

watch(
  () => userProfile.value.email,
  () => {
    syncResetEmail()
  }
)
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

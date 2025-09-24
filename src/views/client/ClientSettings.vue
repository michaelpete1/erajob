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
        <h1 class="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight ml-1 sm:ml-2">Settings</h1>
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

      <!-- Account Settings Form (shown when Account Settings is clicked) -->
      <div v-if="showAccountSettings" class="bg-white rounded-lg sm:rounded-xl shadow-sm mb-6 sm:mb-8 border border-gray-100">
        <div class="p-4 sm:p-6 border-b border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg sm:text-xl font-semibold text-gray-900">Account Settings</h3>
            <button @click="showAccountSettings = false" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="space-y-4 sm:space-y-6">
            <!-- Full Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input 
                v-model="userProfile.name" 
                type="text" 
                class="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                placeholder="Enter your full name"
              >
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input 
                v-model="userProfile.email" 
                type="email" 
                class="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                placeholder="Enter your email address"
              >
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input 
                v-model="userProfile.phone" 
                type="tel" 
                class="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                placeholder="Enter your phone number"
              >
            </div>

            <!-- Location -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input 
                v-model="userProfile.location" 
                type="text" 
                class="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                placeholder="Enter your location"
              >
            </div>

            <!-- Bio -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea 
                v-model="userProfile.bio" 
                rows="4" 
                class="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="p-4 sm:p-6 bg-gray-50 rounded-b-lg sm:rounded-b-xl">
          <button 
            @click="saveProfile" 
            :disabled="!hasProfileChanges"
            class="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>

      <!-- Settings Options -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <!-- Account Settings -->
        <div 
          class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100"
          @click="handleSectionClick('account')"
        >
          <div class="flex items-center gap-3 sm:gap-4">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div class="text-left">
              <h3 class="font-medium text-gray-900 text-sm sm:text-base">Account Settings</h3>
              <p class="text-xs sm:text-sm text-gray-500">Update your personal information and security</p>
            </div>
          </div>
          <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>



        <!-- Payment Settings -->
        <div 
          class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100"
          @click="handleSectionClick('payment')"
        >
          <div class="flex items-center gap-3 sm:gap-4">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
            </div>
            <div class="text-left">
              <h3 class="font-medium text-gray-900 text-sm sm:text-base">Payment Settings</h3>
              <p class="text-xs sm:text-sm text-gray-500">Manage payment methods and billing</p>
            </div>
          </div>
          <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>

        <!-- Language -->
        <div class="relative">
          <div 
            class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100"
            @click="toggleLanguageDropdown"
          >
            <div class="flex items-center gap-3 sm:gap-4">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                </svg>
              </div>
              <div class="text-left">
                <h3 class="font-medium text-gray-900 text-sm sm:text-base">Language</h3>
                <p class="text-xs sm:text-sm text-gray-500">Change app language</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500">{{ currentLanguage }}</span>
              <svg 
                class="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 transform transition-transform duration-200"
                :class="{ 'rotate-180': showLanguageDropdown }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>

          <div 
            v-if="showLanguageDropdown"
            class="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10 max-h-60 overflow-y-auto"
            @click.stop
          >
            <div 
              v-for="language in languages" 
              :key="language"
              class="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
              @click="selectLanguage(language)"
            >
              <span class="text-gray-900 text-sm sm:text-base" :class="{ 'font-medium text-teal-600': language === currentLanguage }">
                {{ language }}
              </span>
              <svg 
                v-if="language === currentLanguage"
                class="w-5 h-5 text-teal-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Privacy & Security -->
        <div 
          class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100"
          @click="handleSectionClick('privacy')"
        >
          <div class="flex items-center gap-3 sm:gap-4">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <div class="text-left">
              <h3 class="font-medium text-gray-900 text-sm sm:text-base">Privacy & Security</h3>
              <p class="text-xs sm:text-sm text-gray-500">Manage your privacy and security settings</p>
            </div>
          </div>
          <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>

        <!-- Help & Support -->
        <div 
          class="flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100"
          @click="handleSectionClick('help')"
        >
          <div class="flex items-center gap-3 sm:gap-4">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="text-left">
              <h3 class="font-medium text-gray-900 text-sm sm:text-base">Help & Support</h3>
              <p class="text-xs sm:text-sm text-gray-500">Get help and contact support</p>
            </div>
          </div>
          <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
      </div>

      <!-- Sign Out Button -->
      <div class="mt-6 sm:mt-8">
        <button 
          @click="handleSignOut"
          class="w-full bg-red-500 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base hover:bg-red-600 active:bg-red-700 transition-colors duration-200 touch-manipulation shadow-sm"
        >
          Sign Out
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Account settings visibility
const showAccountSettings = ref(false)

// User data
const userName = ref('John Doe')
const userEmail = ref('john.doe@example.com')

// User profile data for account settings
const userProfile = ref({
  name: '',
  email: '',
  phone: '',
  location: '',
  bio: ''
})

// Original profile for change detection
const originalProfile = ref({})

// Computed user initials
const userInitials = computed(() => {
  return userName.value
    .split(' ')
    .map(name => name.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
})

// Computed property for change detection
const hasProfileChanges = computed(() => {
  return JSON.stringify(userProfile.value) !== JSON.stringify(originalProfile.value)
})

// Language dropdown state
const showLanguageDropdown = ref(false)
const currentLanguage = ref('English (US)')

// Languages list
const languages = ref([
  'English (US)',
  'English (UK)',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Chinese',
  'Japanese',
  'Korean',
  'Arabic',
  'Hindi'
])

// Methods
const toggleLanguageDropdown = () => {
  showLanguageDropdown.value = !showLanguageDropdown.value
}

const selectLanguage = (language) => {
  currentLanguage.value = language
  showLanguageDropdown.value = false
  console.log('Language selected:', language)
  // In a real app, this would save the preference
}

const handleSectionClick = (section) => {
  console.log('Section clicked:', section)
  if (section === 'account') {
    showAccountSettings.value = !showAccountSettings.value
  } else {
    alert(`Opening ${section} settings...`)
  }
}

const saveProfile = () => {
  try {
    // Save to localStorage
    localStorage.setItem('clientProfile', JSON.stringify(userProfile.value))
    
    // Update original profile
    originalProfile.value = JSON.parse(JSON.stringify(userProfile.value))
    
    // Update header user info
    userName.value = userProfile.value.name
    userEmail.value = userProfile.value.email
    
    // Save to localStorage for header
    localStorage.setItem('userName', userProfile.value.name)
    localStorage.setItem('userEmail', userProfile.value.email)
    
    // Show success message
    alert('Profile updated successfully!')
  } catch (error) {
    console.error('Error saving profile:', error)
    alert('Error saving profile. Please try again.')
  }
}

const handleSignOut = () => {
  if (confirm('Are you sure you want to sign out?')) {
    // Clear user data from localStorage
    localStorage.removeItem('userRole')
    localStorage.removeItem('userToken')
    
    // Navigate to sign in page
    router.push('/sign-in')
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showLanguageDropdown.value = false
  }
}

onMounted(() => {
  console.log('ClientSettings component mounted')
  
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
      originalProfile.value = JSON.parse(JSON.stringify(userProfile.value))
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
  
  // Add click outside listener
  document.addEventListener('click', handleClickOutside)
})

// Clean up event listener
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Component-specific styles if needed */
</style>

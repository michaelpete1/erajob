<template>
  <div class="min-h-screen bg-white">
    <header class="bg-brand-teal text-white px-4 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button @click="$router.back()" aria-label="Back" class="p-1 text-white/95 hover:text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-lg font-semibold">Settings</h1>
      </div>
    </header>

  <main class="p-4 pb-24">
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex flex-col items-center text-center">
          <div class="relative mb-4">
            <div class="w-24 h-24 rounded-full bg-brand-teal flex items-center justify-center text-white text-2xl font-bold">
              {{ userInitials }}
            </div>
            <button class="absolute bottom-0 right-0 w-8 h-8 bg-brand-teal text-white rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          
          <h2 class="text-xl font-semibold text-gray-900 mb-1">{{ userName }}</h2>
          <p class="text-gray-500">{{ userEmail }}</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div 
          class="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
          @click="handleSectionClick('account')"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-brand-teal/10 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-900">Account</h3>
              <p class="text-sm text-gray-500">View your account overview</p>
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <!-- Language -->
        <div class="relative">
          <div 
            class="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
            @click="toggleLanguageDropdown"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Language</h3>
                <p class="text-sm text-gray-500">Change app language</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500">{{ currentLanguage }}</span>
              <svg 
                class="w-5 h-5 text-gray-400 transform transition-transform duration-200"
                :class="{ 'rotate-180': showLanguageDropdown }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
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
              <span class="text-gray-900" :class="{ 'font-medium text-brand-teal': language === currentLanguage }">
                {{ language }}
              </span>
              <svg 
                v-if="language === currentLanguage"
                class="w-5 h-5 text-brand-teal"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>


        <div 
          class="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
          @click="handleSectionClick('terms')"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-900">Terms & Conditions</h3>
              <p class="text-sm text-gray-500">View terms and earnings information</p>
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <div 
          class="flex items-center justify-between p-4 hover:bg-red-50 transition-colors cursor-pointer"
          @click="handleSectionClick('logout')"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-red-600">Logout</h3>
              <p class="text-sm text-red-500">Sign out of your account</p>
            </div>
          </div>
          <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { agentsService } from '@/services/agentsService'
import authService from '@/services/authService'

const router = useRouter()

const userRole = ref<string>(localStorage.getItem('userRole') || '')
const userName = ref<string>('')
const userEmail = ref<string>('')
const currentLanguage = ref<string>('English')
const showLanguageDropdown = ref<boolean>(false)
const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Portuguese', 'Italian', 'Russian']
const loading = ref(false)
const saving = ref(false)
const error = ref<string | null>(null)

const userInitials = computed(() => {
  if (!userName.value) return 'AG'
  return userName.value
    .split(' ')
    .map(name => name.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
})

const hydrateFromLocalStorage = () => {
  try {
    const storedName = localStorage.getItem('userName')
    if (storedName) userName.value = storedName

    const storedEmail = localStorage.getItem('userEmail')
    if (storedEmail) userEmail.value = storedEmail

    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      const parsed = JSON.parse(userInfo)
      if (parsed?.name) userName.value = parsed.name
      if (parsed?.email) userEmail.value = parsed.email
    }
  } catch (err) {
    console.error('Error hydrating user info:', err)
  }
}

const loadUserProfile = async () => {
  if (userRole.value !== 'agent') return

  loading.value = true
  error.value = null

  try {
    const result = await agentsService.getCurrentAgent()
    if (result.success && result.data) {
      const profile = result.data
      userName.value = profile.full_name || profile.company_name || 'Agent'
      userEmail.value = profile.email || ''
      if (profile.time_zone) {
        currentLanguage.value = profile.time_zone
      }
    } else {
      error.value = result.error || 'Failed to load agent profile'
    }
  } catch (caughtError) {
    console.error('Error loading agent profile:', caughtError)
    error.value = 'Failed to load agent profile'
  } finally {
    loading.value = false
  }
}

const saveUserProfile = async () => {
  saving.value = true
  error.value = null

  try {
    const currentAgent = agentsService.getAgentState().currentAgent
    if (!currentAgent || !currentAgent.id) {
      throw new Error('No agent profile to update')
    }

    const payload = {
      id: currentAgent.id,
      full_name: userName.value,
      email: userEmail.value,
      time_zone: currentLanguage.value
    }

    console.warn('Update profile not implemented for agents; payload prepared:', payload)
    alert('Profile updates are not yet wired to the backend. Data was prepared in console.')
  } catch (caughtError) {
    console.error('Error preparing profile update:', caughtError)
    error.value = 'Failed to update profile'
  } finally {
    saving.value = false
  }
}

const saveLanguagePreference = async (language: string) => {
  currentLanguage.value = language
  showLanguageDropdown.value = false
  console.warn('Language update API not implemented. Stored locally only.')
}

const toggleLanguageDropdown = () => {
  showLanguageDropdown.value = !showLanguageDropdown.value
}

const selectLanguage = (language: string) => {
  saveLanguagePreference(language)
}

const closeDropdown = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showLanguageDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
  userRole.value = localStorage.getItem('userRole') || ''
  hydrateFromLocalStorage()
  loadUserProfile()
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

const handleSectionClick = (section: string) => {
  switch (section) {
    case 'terms':
      router.push('/terms-and-conditions')
      break
    case 'account':
      if (userRole.value === 'agent') {
        router.push('/agent/account')
      } else if (userRole.value === 'client') {
        router.push('/client/account')
      } else {
        router.push('/profile-settings')
      }
      break
    case 'language':
      toggleLanguageDropdown()
      break
    case 'support':
      alert(' Support clicked! This would open support page or contact options.')
      break
    case 'logout':
      if (confirm('🚪 Are you sure you want to logout?\n\nYou will need to sign in again to access your account.')) {
        authService.logout()
        localStorage.removeItem('userToken')
        localStorage.removeItem('selectedClientServices')
        localStorage.removeItem('selectedAgentServices')
        localStorage.removeItem('selectedGig')
        router.replace('/sign-in')
      }
      break
    default:
      console.log('Unknown section:', section)
  }
}
</script>

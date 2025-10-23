  <template>
  <PageContainer bg="bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 min-h-svh">
    <!-- decorative circles (unchanged) -->
    <div class="absolute top-0 right-0 h-32 w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow"></div>
    <div class="absolute bottom-0 left-0 h-24 w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse"></div>
    <div class="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float"></div>
    <div class="absolute top-16 left-16 w-2 h-2 sm:top-20 sm:left-20 bg-white/20 rounded-full animate-float-delayed-1"></div>
    <div class="absolute top-32 right-24 w-1 h-1 sm:top-40 sm:right-32 bg-white/30 rounded-full animate-float-delayed-2"></div>
    <div class="absolute bottom-24 left-32 w-1.5 h-1.5 sm:bottom-32 sm:left-40 bg-white/25 rounded-full animate-float-delayed-3"></div>
    <div class="absolute bottom-16 right-16 w-2.5 h-2.5 sm:bottom-20 sm:right-20 bg-white/15 rounded-full animate-float-delayed-4"></div>

    <div class="mx-auto w-full max-w-md sm:max-w-lg px-4 py-8 pb-32 relative z-10">
      <header class="text-center mb-6 animate-fade-up-delay-1">
        <h1 class="text-3xl font-extrabold text-white tracking-tight">Client Onboarding</h1>
        <p class="text-white/80 text-sm mt-1">Complete your profile to connect with top agents.</p>
      </header>

      <form class="space-y-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-2xl animate-fade-up-delay-2" @submit.prevent="onSubmit">
        <!-- Error Messages -->
        <div v-if="generalError" class="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-white text-sm animate-fade-in">
          {{ generalError }}
        </div>

        <!-- Client Reason for Signing Up (enum) -->
        <div class="space-y-2 animate-slide-in-left">
          <label class="form-label">What do you need help with?</label>
          <div class="grid grid-cols-1 gap-2">
            <label class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:border-teal-500 cursor-pointer">
              <input type="radio" class="accent-teal-600" value="Just hire me someone" v-model="form.clientReason" />
              <span class="text-sm text-gray-700">Just hire me someone</span>
            </label>
            <label class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:border-teal-500 cursor-pointer">
              <input type="radio" class="accent-teal-600" value="Need assistance with hiring, training, onboarding and management for first month" v-model="form.clientReason" />
              <span class="text-sm text-gray-700">Need assistance with hiring, training, onboarding and management for first month</span>
            </label>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input v-model="form.email" type="email" placeholder="Email (Personal)" class="w-full rounded-full border border-gray-300 px-4 py-3 text-sm text-gray-700 transition-all duration-150 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/10 animate-slide-in-left" />
            <p v-if="fieldErrors.email" class="mt-1 text-xs text-red-200 text-left pl-2">{{ fieldErrors.email }}</p>
          </div>
          <div>
            <input v-model="form.phone" type="tel" placeholder="Phone Number" class="w-full rounded-full border border-gray-300 px-4 py-3 text-sm text-gray-700 transition-all duration-150 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/10 animate-slide-in-right" />
            <p v-if="fieldErrors.phone_number" class="mt-1 text-xs text-red-200 text-left pl-2">{{ fieldErrors.phone_number }}</p>
          </div>
          <div>
            <input v-model="form.fullName" type="text" placeholder="Full Name" class="w-full rounded-full border border-gray-300 px-4 py-3 text-sm text-gray-700 transition-all duration-150 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/10 animate-slide-in-left" />
            <p v-if="fieldErrors.full_name" class="mt-1 text-xs text-red-200 text-left pl-2">{{ fieldErrors.full_name }}</p>
          </div>
          <div>
            <input v-model="form.companyName" type="text" placeholder="Company Name" class="w-full rounded-full border border-gray-300 px-4 py-3 text-sm text-gray-700 transition-all duration-150 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/10 animate-slide-in-right" />
            <p v-if="fieldErrors.company_name" class="mt-1 text-xs text-red-200 text-left pl-2">{{ fieldErrors.company_name }}</p>
          </div>
          <div>
            <input v-model="form.companyEmail" type="email" placeholder="Company Email" class="w-full rounded-full border border-gray-300 px-4 py-3 text-sm text-gray-700 transition-all duration-150 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/10 animate-slide-in-left" />
            <p v-if="fieldErrors.company_email" class="mt-1 text-xs text-red-200 text-left pl-2">{{ fieldErrors.company_email }}</p>
          </div>
          <div>
            <input v-model="form.companyWebsite" type="url" placeholder="Company Website (URL)" class="w-full rounded-full border border-gray-300 px-4 py-3 text-sm text-gray-700 transition-all duration-150 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/10 animate-slide-in-right" />
            <p v-if="fieldErrors.company_website" class="mt-1 text-xs text-red-200 text-left pl-2">{{ fieldErrors.company_website }}</p>
          </div>
        </div>

        <div>
          <input v-model="form.companyAddress" type="text" placeholder="Company Address" class="w-full rounded-full border border-gray-300 px-4 py-3 text-sm text-gray-700 transition-all duration-150 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/10 animate-slide-in-left" />
          <p v-if="fieldErrors.company_address" class="mt-1 text-xs text-red-200 text-left pl-2">{{ fieldErrors.company_address }}</p>
        </div>

        <div class="animate-slide-in-left">
          <button type="button" class="modal-trigger" @click="openTimezoneModal">
            <div class="modal-trigger__label">
              <span class="modal-trigger__tag">Time Zone · Location</span>
              <span class="modal-trigger__value">{{ timezoneLabel }}</span>
            </div>
            <span class="modal-trigger__icon" aria-hidden="true">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
        </div>
        <teleport to="body">
          <transition name="fade">
            <div v-if="showTimezoneModal" class="timezone-modal" @click.self="closeTimezoneModal">
              <div class="timezone-modal__panel">
                <header class="timezone-modal__header">
                  <div>
                    <h3 class="timezone-modal__title">Select your time zone</h3>
                    <p class="timezone-modal__subtitle">Choose the city or offset that best matches your operating hours.</p>
                  </div>
                  <button type="button" class="timezone-modal__close" @click="closeTimezoneModal" aria-label="Close">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </header>
                <div class="timezone-modal__search">
                  <svg class="w-5 h-5 text-brand-teal/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7 7 0 1010.65 7a7 7 0 006 9.65z" />
                  </svg>
                  <input
                    v-model="timezoneQuery"
                    type="text"
                    class="timezone-modal__input"
                    placeholder="Search city, country, or UTC offset"
                  />
                </div>
                <div class="timezone-modal__list">
                  <button
                    v-for="option in filteredTimezones"
                    :key="option.value"
                    type="button"
                    class="timezone-option"
                    :class="{ 'timezone-option--active': form.timezone === option.value }"
                    @click="selectTimezone(option)"
                  >
                    <div class="timezone-option__label">
                      <span class="timezone-option__primary">{{ option.label }}</span>
                      <span class="timezone-option__secondary">{{ option.meta }}</span>
                    </div>
                    <div class="timezone-option__offset">{{ option.value }}</div>
                  </button>
                  <div v-if="!filteredTimezones.length" class="timezone-modal__empty">No matches found. Try another city or offset.</div>
                </div>
              </div>
            </div>
          </transition>
        </teleport>

        <!-- Preferred project type selector -->
        <div class="space-y-2 animate-slide-in-left">
          <label for="expertise-select" class="form-label">What types of projects do you prefer?</label>

          <!-- Selected item -->
          <div v-if="form.primaryAreaOfExpertise" class="flex flex-wrap gap-2 mb-3">
            <div class="inline-flex items-center px-2.5 py-1 bg-teal-600 text-white text-xs font-medium rounded-full shadow-sm group max-w-full">
              <span class="truncate max-w-[10rem] block">{{ form.primaryAreaOfExpertise }}</span>
              <button
                type="button"
                @click="removeExpertise"
                class="ml-2 text-white/80 hover:text-white transition-colors"
                aria-label="Remove expertise"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- container has a ref and proper z-index -->
          <div class="relative" ref="expertiseRef" style="z-index: 100;">
            <div
              @click="toggleExpertiseDropdown"
              role="button"
              tabindex="0"
              class="w-full rounded-full border border-gray-300 px-4 py-3 text-sm text-gray-700 transition-all duration-150 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/10 cursor-pointer flex items-center justify-between bg-white min-h-[44px]"
            >
              <span class="text-gray-500">
                {{ form.primaryAreaOfExpertise ? form.primaryAreaOfExpertise : 'Select your preferred project type' }}
              </span>
              <svg
                class="w-4 h-4 text-gray-400 transition-transform duration-200"
                :class="{ 'rotate-180': showExpertiseDropdown }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <!-- Modal Popup Box will be teleported to body -->
            <teleport to="body">
              <div
                v-if="showExpertiseDropdown"
                class="fixed inset-0 z-[9999] bg-black/30 flex items-start pt-16 justify-center sm:items-start sm:justify-center sm:bg-transparent"
                @click="showExpertiseDropdown = false"
              >
                <div
                  class="w-[85%] max-w-sm bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden mt-0 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:top-20"
                  @click.stop
                >
                  <!-- Modal Header -->
                  <div class="bg-brand-teal text-white p-3 sm:p-4">
                    <h3 class="text-base font-semibold">Select Project Types</h3>
                    <p class="text-teal-100 text-xs">
                      Choose project types you're interested in
                    </p>
                  </div>

                  <!-- Modal Body -->
                  <div class="p-3 max-h-[50vh] overflow-y-auto">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      <div
                        v-for="projectType in expertiseOptions"
                        :key="projectType"
                        @click="toggleExpertise(projectType)"
                        class="px-2.5 py-1.5 cursor-pointer hover:bg-brand-teal/5 rounded-md transition-colors flex items-center justify-between text-xs"
                      >
                        <span class="text-gray-700">{{ projectType }}</span>
                        <svg
                          v-if="form.primaryAreaOfExpertise === projectType"
                          class="w-4 h-4 text-brand-teal flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </teleport>
          </div>
          <p v-if="fieldErrors.primary_area_of_expertise" class="mt-1 text-xs text-red-200 text-left pl-2">{{ fieldErrors.primary_area_of_expertise }}</p>
        </div>

        <!-- File inputs and rest unchanged -->
        <div class="rounded-lg border border-brand-teal/50 bg-brand-teal/5 p-3 text-xs text-gray-700 animate-fade-up-delay-3">
          <strong class="text-brand-teal text-sm">Background Check Consent:</strong>
          <p class="mt-1">By proceeding, you consent to EBA's onboarding process, including a background check as required for financial capability and project management positions.</p>
        </div>

        <div class="space-y-3 pt-4 animate-fade-up-delay-4">
          <button type="submit" :disabled="isSubmitting" class="btn-primary">
            {{ isSubmitting ? 'Submitting...' : 'Next Step' }}
          </button>
          <button type="button" class="btn-secondary" @click="$router.back()">Back</button>
        </div>
      </form>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import PageContainer from '../../components/PageContainer.vue'
import type { ClientWelcomeData } from '../../services/authService'
import { useTimezones } from '../../composables/useTimezones'

const router = useRouter()
const isSubmitting = ref(false)
const showExpertiseDropdown = ref(false)
const expertiseRef = ref<HTMLElement | null>(null)
const showTimezoneModal = ref(false)
const generalError = ref('')
const fieldErrors = reactive<Record<string, string>>({})

const form = reactive({
  email: '',
  phone: '',
  companyName: '',
  companyEmail: '',
  companyAddress: '',
  companyWebsite: '',
  fullName: '',
  primaryAreaOfExpertise: '',
  timezone: '',
  clientReason: '',
  shortVideo: '',
  urlLink: '',
  certificates: [] as string[],
  personalityTest: '',
})

const expertiseOptions = [
  'Sales',
  'Customer Service',
  'Editing',
  'Book Keeping',
  'Executive Assitant',
  'Appointment Setting',
  'Other'
]

const timezoneOptions = useTimezones()
const timezoneQuery = ref('')
const filteredTimezones = computed(() => {
  const query = timezoneQuery.value.trim().toLowerCase()
  const base = timezoneOptions.map(option => ({
    value: option.value,
    label: option.label.split('•')[0]?.trim() ?? option.label,
    meta: option.label.split('•')[1]?.trim() ?? ''
  }))
  if (!query) return base
  return base.filter(option => {
    const searchText = `${option.label} ${option.meta} ${option.value}`.toLowerCase()
    return searchText.includes(query)
  })
})

const timezoneLabel = computed(() => {
  if (!form.timezone) return 'Tap to choose your time zone'
  const match = timezoneOptions.find(option => option.value === form.timezone)
  return match ? match.label : form.timezone
})

const updateExpertiseDropdownPosition = async () => {
  await nextTick()
  if (!expertiseRef.value) return
  const rect = expertiseRef.value.getBoundingClientRect()
  document.documentElement.style.setProperty('--dropdown-top', `${rect.bottom + window.scrollY}px`)
}

const toggleExpertiseDropdown = async () => {
  if (!showExpertiseDropdown.value) {
    await updateExpertiseDropdownPosition()
  }
  showExpertiseDropdown.value = !showExpertiseDropdown.value
}

const toggleExpertise = (projectType: string) => {
  form.primaryAreaOfExpertise = form.primaryAreaOfExpertise === projectType ? '' : projectType
}

const removeExpertise = () => { form.primaryAreaOfExpertise = '' }

const openTimezoneModal = () => {
  timezoneQuery.value = ''
  showTimezoneModal.value = true
}

const closeTimezoneModal = () => {
  showTimezoneModal.value = false
}

const selectTimezone = (option: { label: string; value: string }) => {
  form.timezone = option.value
  timezoneQuery.value = option.label
  closeTimezoneModal()
}

watch(() => form.timezone, (newVal) => {
  if (!newVal) {
    timezoneQuery.value = ''
    return
  }
  const match = timezoneOptions.find(option => option.value === newVal)
  if (match) timezoneQuery.value = match.label
})

const loadSavedData = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('clientWelcomeData') || '{}')
    form.email = saved.email || form.email
    form.phone = saved.phone || form.phone
    form.companyName = saved.companyName || form.companyName
    form.companyEmail = saved.companyEmail || form.companyEmail
    form.companyAddress = saved.companyAddress || form.companyAddress
    form.companyWebsite = saved.companyWebsite || form.companyWebsite
    form.fullName = saved.fullName || form.fullName
    form.primaryAreaOfExpertise = saved.primaryAreaOfExpertise || form.primaryAreaOfExpertise
    form.timezone = saved.timezone || form.timezone
    form.clientReason = saved.clientReason || form.clientReason
    form.shortVideo = saved.shortVideo || form.shortVideo
    form.urlLink = saved.urlLink || form.urlLink
    form.certificates = Array.isArray(saved.certificates) ? saved.certificates : form.certificates
    form.personalityTest = saved.personalityTest || form.personalityTest
    if (saved.timezone) {
      const match = timezoneOptions.find(option => option.value === saved.timezone)
      if (match) timezoneQuery.value = match.label
    }
  } catch {}
}

watch(form, (val) => {
  try {
    const payload = {
      email: val.email,
      phone: val.phone,
      companyName: val.companyName,
      companyEmail: val.companyEmail,
      companyAddress: val.companyAddress,
      companyWebsite: val.companyWebsite,
      fullName: val.fullName,
      primaryAreaOfExpertise: val.primaryAreaOfExpertise,
      timezone: val.timezone,
      clientReason: val.clientReason,
      shortVideo: val.shortVideo,
      urlLink: val.urlLink,
      certificates: val.certificates,
      personalityTest: val.personalityTest,
    }
    localStorage.setItem('clientWelcomeData', JSON.stringify(payload))
  } catch {}
}, { deep: true })

const formatErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error
  if (Array.isArray(error)) {
    return error.map(item => {
      if (typeof item === 'string') return item
      if (item && typeof item === 'object') {
        const err = item as Record<string, unknown>
        return String(err.message || err.detail || err.error || JSON.stringify(err))
      }
      return String(item)
    }).join(', ')
  }
  if (error && typeof error === 'object') {
    const err = error as Record<string, unknown>
    return String(err.message || err.detail || err.error || JSON.stringify(err))
  }
  return String(error)
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    showTimezoneModal.value = false
    if (showExpertiseDropdown.value) showExpertiseDropdown.value = false
  }
}

onMounted(() => {
  loadSavedData()
  if (form.timezone) {
    const match = timezoneOptions.find(option => option.value === form.timezone)
    if (match) timezoneQuery.value = match.label
  }
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})

const onSubmit = async () => {
  isSubmitting.value = true
  generalError.value = ''
  Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key])

  try {
    const basicData = JSON.parse(localStorage.getItem('signupBasicData') || '{}')
    if (!basicData.email) {
      alert('Signup information not found. Please start the signup process again.')
      router.push('/sign-up')
      return
    }

    const welcomeData: ClientWelcomeData = {
      email: form.email,
      phone: form.phone,
      companyName: form.companyName,
      companyEmail: form.companyEmail,
      companyAddress: form.companyAddress,
      companyWebsite: form.companyWebsite,
      fullName: form.fullName,
      primaryAreaOfExpertise: form.primaryAreaOfExpertise,
      timezone: form.timezone,
      clientReason: form.clientReason,
      shortVideo: form.shortVideo,
      urlLink: form.urlLink,
      certificates: form.certificates,
      personalityTest: form.personalityTest,
    }
    localStorage.setItem('clientWelcomeData', JSON.stringify(welcomeData))
    router.push('/client/congrats')
  } catch (error) {
    console.error('Error submitting form:', error)
    generalError.value = 'An unexpected error occurred. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Modal trigger shared styling */
.modal-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(13, 148, 136, 0.35);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.08);
  transition: all 0.2s ease-in-out;
  backdrop-filter: blur(6px);
}

.modal-trigger:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(13, 148, 136, 0.16);
  border-color: rgba(13, 148, 136, 0.6);
}

.modal-trigger__label {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
}

.modal-trigger__tag {
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(13, 148, 136, 0.75);
}

.modal-trigger__value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.3;
}

.modal-trigger__icon {
  display: inline-flex;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  align-items: center;
  justify-content: center;
  background: rgba(13, 148, 136, 0.08);
  color: #0d9488;
  transition: background 0.2s ease-in-out;
}

.modal-trigger:hover .modal-trigger__icon {
  background: rgba(13, 148, 136, 0.12);
}

/* Timezone modal styling */
.timezone-modal {
  position: fixed;
  inset: 0;
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(8px);
}

.timezone-modal__panel {
  width: min(560px, 100%);
  max-height: 80vh;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 24px 48px rgba(2, 132, 199, 0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.timezone-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem 1.75rem 1.25rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
}

.timezone-modal__title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
}

.timezone-modal__subtitle {
  margin-top: 0.35rem;
  font-size: 0.85rem;
  color: #64748b;
}

.timezone-modal__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: rgba(148, 163, 184, 0.08);
  color: #475569;
  transition: all 0.2s ease-in-out;
}

.timezone-modal__close:hover {
  border-color: rgba(15, 23, 42, 0.3);
  background: rgba(15, 23, 42, 0.08);
  color: #0f172a;
}

.timezone-modal__search {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1rem 1.75rem 0;
  padding: 0.75rem 1rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(241, 245, 249, 0.6);
}

.timezone-modal__input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  color: #0f172a;
}

.timezone-modal__input:focus {
  outline: none;
}

.timezone-modal__list {
  padding: 1rem 0;
  overflow-y: auto;
  max-height: 55vh;
}

.timezone-option {
  width: 100%;
  text-align: left;
  padding: 0.85rem 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  transition: all 0.2s ease-in-out;
  border: none;
  background: transparent;
  cursor: pointer;
}

.timezone-option:hover {
  background: rgba(13, 148, 136, 0.1);
}

.timezone-option__label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.95rem;
  color: #0f172a;
}

.timezone-option__secondary {
  font-size: 0.78rem;
  color: #64748b;
}

.timezone-option__offset {
  font-size: 0.82rem;
  color: #0d9488;
  font-weight: 600;
}

.timezone-option--active {
  background: rgba(13, 148, 136, 0.14);
}

.timezone-modal__empty {
  padding: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: #64748b;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Base inputs/button styles (unchanged) */
.form-input {
  width: 100%;
  border-radius: 9999px;
  border: 1px solid #e5e7eb;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  color: #374151;
  transition: all 0.15s ease-in-out;
}

.form-input:focus {
  outline: none;
  border-color: #0d9488;
  box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.1);
}

/* ensure select removes native arrow across browsers */
.form-select {
  width: 100%;
  border-radius: 9999px;
  border: 1px solid #e5e7eb;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  font-size: 0.875rem;
  color: #374151;
  transition: all 0.15s ease-in-out;
  background-color: white;
  text-align: left;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.form-select:focus {
  outline: none;
  border-color: #0d9488;
  box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.1);
}

/* hide IE/Edge native arrow */
.form-select::-ms-expand {
  display: none;
}

/* File Input Style */
.form-file-input {
  width: 100%;
  border-radius: 9999px;
  border: 1px solid #e5e7eb;
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  transition: all 0.15s ease-in-out;
}

.form-file-input:focus {
  outline: none;
  border-color: #0d9488;
  box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.1);
}

/* File List Container */
.file-list {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background-color: rgba(13, 148, 136, 0.05);
  border: 1px solid rgba(13, 148, 136, 0.2);
  border-radius: 0.5rem;
}

/* Buttons */
.btn-primary {
  display: block;
  width: 100%;
  border-radius: 9999px;
  background-color: #0d9488;
  padding: 0.75rem 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease-in-out;
}

.btn-primary:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: scale(1.01);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  display: block;
  width: 100%;
  border-radius: 9999px;
  border: 1px solid #d1d5db;
  background-color: #f3f4f6;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  color: #374151;
  transition: all 0.3s ease-in-out;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

/* Tag pills */
.tag-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  background-color: #0d9488;
  color: white;
  font-size: 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

/* dropdown item tweaks */
[role="button"] {
  outline: none;
}

/* small helpers */
.truncate {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* Responsive padding */
@media (min-width: 640px) {
  .form-input {
    padding: 0.75rem 1.25rem;
  }
}
</style>

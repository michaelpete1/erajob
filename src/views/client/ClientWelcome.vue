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

// Load persisted welcome data on mount and autosave on change
onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem('clientWelcomeData') || '{}')
    form.email = saved.email || form.email
    form.phone = saved.phone || form.phone
    form.companyName = saved.companyName || form.companyName
    form.companyEmail = saved.companyEmail || form.companyEmail
    form.companyAddress = saved.companyAddress || form.companyAddress
    form.companyWebsite = saved.companyWebsite || form.companyWebsite
    form.fullName = saved.fullName || form.fullName
    form.shortVideo = saved.shortVideo || form.shortVideo
    form.urlLink = saved.urlLink || form.urlLink
    form.primaryAreaOfExpertise = saved.primaryAreaOfExpertise || form.primaryAreaOfExpertise
    form.clientReason = saved.clientReason || form.clientReason
  } catch {}
})

watch(form, (val) => {
  try {
    const out = {
      email: val.email,
      phone: val.phone,
      companyName: val.companyName,
      companyEmail: val.companyEmail,
      companyAddress: val.companyAddress,
      companyWebsite: val.companyWebsite,
      fullName: val.fullName,
      shortVideo: val.shortVideo,
      urlLink: val.urlLink,
      primaryAreaOfExpertise: val.primaryAreaOfExpertise,
      timezone: val.timezone,
      clientReason: val.clientReason,
    }
    const existing = JSON.parse(localStorage.getItem('clientWelcomeData') || '{}')
    localStorage.setItem('clientWelcomeData', JSON.stringify({ ...existing, ...out }))
  } catch {}
}, { deep: true })
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

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input v-model="form.shortVideo" type="url" placeholder="1min Video (URL)" class="w-full rounded-full border border-gray-300 px-4 py-3 text-sm text-gray-700 transition-all duration-150 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/10 animate-slide-in-right" />
            <p v-if="fieldErrors.video_url" class="mt-1 text-xs text-red-200 text-left pl-2">{{ fieldErrors.video_url }}</p>
          </div>
          <div>
            <input v-model="form.urlLink" type="url" placeholder="Portfolio/Social URL" class="w-full rounded-full border border-gray-300 px-4 py-3 text-sm text-gray-700 transition-all duration-150 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/10 animate-slide-in-left" />
            <p v-if="fieldErrors.portfolio_link" class="mt-1 text-xs text-red-200 text-left pl-2">{{ fieldErrors.portfolio_link }}</p>
          </div>
        </div>

        <!-- TIMEZONE: fixed to have single arrow, padding-right for custom icon -->
        <!-- EXPERTISE MULTI-SELECT (fixed stacking, click-outside) -->
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
        <div class="space-y-2 animate-slide-in-left">
          <label class="form-label">Certificates (Max 10MB/file)</label>
          <div class="relative">
            <input
              type="file"
              ref="certificatesInput"
              @change="handleCertificatesUpload"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              class="w-full rounded-full border border-gray-300 px-4 py-3 text-sm text-gray-700 transition-all duration-150 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/10"
            />
          </div>
          <div v-if="certificatesFiles.length > 0" class="file-list">
            <p class="text-sm font-medium text-brand-teal mb-1">Selected Certificates:</p>
            <ul class="space-y-1">
              <li v-for="(file, index) in certificatesFiles" :key="index" class="text-xs text-gray-700 flex items-center justify-between">
                <span class="truncate">{{ file.name }} ({{ formatFileSize(file.size) }})</span>
                <button type="button" @click="removeCertificate(index)" class="text-red-500 hover:text-red-700 text-xs">Remove</button>
              </li>
            </ul>
          </div>
          <p v-if="fieldErrors.certificate_url" class="mt-1 text-xs text-red-200 text-left pl-2">{{ fieldErrors.certificate_url }}</p>
        </div>

        <div class="space-y-2 animate-slide-in-right">
          <label class="form-label">Personality Test Screenshot (Max 5MB)</label>
          <div class="relative">
            <input
              type="file"
              ref="personalityTestInput"
              @change="handlePersonalityTestUpload"
              accept=".jpg,.jpeg,.png,.webp"
              class="w-full rounded-full border border-gray-300 px-4 py-3 text-sm text-gray-700 transition-all duration-150 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/10"
            />
          </div>
          <div v-if="personalityTestFile" class="file-list">
            <p class="text-sm font-medium text-brand-teal mb-1">Selected Screenshot:</p>
            <div class="text-xs text-gray-700 flex items-center justify-between">
              <span class="truncate">{{ personalityTestFile.name }} ({{ formatFileSize(personalityTestFile.size) }})</span>
              <button type="button" @click="removePersonalityTest" class="text-red-500 hover:text-red-700 text-xs">Remove</button>
            </div>
          </div>
          <p v-if="fieldErrors.personality_url" class="mt-1 text-xs text-red-200 text-left pl-2">{{ fieldErrors.personality_url }}</p>
        </div>

        <div class="rounded-lg border border-brand-teal/50 bg-brand-teal/5 p-3 text-xs text-gray-700 animate-fade-up-delay-3">
          <strong class="text-brand-teal text-sm">Background Check Consent:</strong>
          <p class="mt-1">By proceeding, you consent to ERA's onboarding process, including a background check as required for financial capability and project management positions.</p>
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
import { reactive, ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import PageContainer from '../../components/PageContainer.vue'
import authService, { type ClientWelcomeData } from '../../services/authService'
import type { SignupData } from '../../types/api/auth'

const router = useRouter()
const isSubmitting = ref(false)
const showExpertiseDropdown = ref(false)
const expertiseRef = ref<HTMLElement | null>(null)
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
  shortVideo: '',
  urlLink: '',
  primaryAreaOfExpertise: '',
  timezone: '',
  openToCalls: '',
  hasWorkingComputer: '',
  hasStableInternet: '',
  comfortableWithTimeTracking: '',
  clientReason: '',
})

// expertise methods
const updateDropdownPosition = async () => {
  await nextTick()
  if (expertiseRef.value) {
    const rect = expertiseRef.value.getBoundingClientRect()
    document.documentElement.style.setProperty('--dropdown-top', `${rect.bottom + window.scrollY}px`)
  }
}

const toggleExpertiseDropdown = async () => {
  if (!showExpertiseDropdown.value) {
    await updateDropdownPosition()
  }
  showExpertiseDropdown.value = !showExpertiseDropdown.value
}
const toggleExpertise = (projectType: string) => {
  form.primaryAreaOfExpertise = form.primaryAreaOfExpertise === projectType ? '' : projectType
}
const removeExpertise = () => { form.primaryAreaOfExpertise = '' }

const expertiseOptions = [
        'Web Devlopment', 'Mobile Development', 'UI/UX Design', 'Content Writing', 'Digital Marketing', 'Data Analysis', 'Other'
]

const timezoneOptions = [
  { label: 'UTC-12:00', value: 'UTC-12:00', offset: 'UTC-12:00' },
  { label: 'UTC-11:00', value: 'UTC-11:00', offset: 'UTC-11:00' },
  { label: 'UTC-10:00', value: 'UTC-10:00', offset: 'UTC-10:00' },
  { label: 'UTC-09:30', value: 'UTC-09:30', offset: 'UTC-09:30' },
  { label: 'UTC-09:00', value: 'UTC-09:00', offset: 'UTC-09:00' },
  { label: 'UTC-08:00', value: 'UTC-08:00', offset: 'UTC-08:00' },
  { label: 'UTC-07:00', value: 'UTC-07:00', offset: 'UTC-07:00' },
  { label: 'UTC-06:00', value: 'UTC-06:00', offset: 'UTC-06:00' },
  { label: 'UTC-05:00', value: 'UTC-05:00', offset: 'UTC-05:00' },
  { label: 'UTC-04:30', value: 'UTC-04:30', offset: 'UTC-04:30' },
  { label: 'UTC-04:00', value: 'UTC-04:00', offset: 'UTC-04:00' },
  { label: 'UTC-03:30', value: 'UTC-03:30', offset: 'UTC-03:30' },
  { label: 'UTC-03:00', value: 'UTC-03:00', offset: 'UTC-03:00' },
  { label: 'UTC-02:00', value: 'UTC-02:00', offset: 'UTC-02:00' },
  { label: 'UTC-01:00', value: 'UTC-01:00', offset: 'UTC-01:00' },
  { label: 'UTC+00:00', value: 'UTC+00:00', offset: 'UTC+00:00' },
  { label: 'UTC+01:00', value: 'UTC+01:00', offset: 'UTC+01:00' },
  { label: 'UTC+02:00', value: 'UTC+02:00', offset: 'UTC+02:00' },
  { label: 'UTC+03:00', value: 'UTC+03:00', offset: 'UTC+03:00' },
  { label: 'UTC+03:30', value: 'UTC+03:30', offset: 'UTC+03:30' },
  { label: 'UTC+04:00', value: 'UTC+04:00', offset: 'UTC+04:00' },
  { label: 'UTC+05:00', value: 'UTC+05:00', offset: 'UTC+05:00' },
  { label: 'UTC+05:30', value: 'UTC+05:30', offset: 'UTC+05:30' },
  { label: 'UTC+05:45', value: 'UTC+05:45', offset: 'UTC+05:45' },
  { label: 'UTC+06:00', value: 'UTC+06:00', offset: 'UTC+06:00' },
  { label: 'UTC+06:30', value: 'UTC+06:30', offset: 'UTC+06:30' },
  { label: 'UTC+07:00', value: 'UTC+07:00', offset: 'UTC+07:00' },
  { label: 'UTC+08:00', value: 'UTC+08:00', offset: 'UTC+08:00' },
  { label: 'UTC+08:45', value: 'UTC+08:45', offset: 'UTC+08:45' },
  { label: 'UTC+09:00', value: 'UTC+09:00', offset: 'UTC+09:00' },
  { label: 'UTC+09:30', value: 'UTC+09:30', offset: 'UTC+09:30' },
  { label: 'UTC+10:00', value: 'UTC+10:00', offset: 'UTC+10:00' },
  { label: 'UTC+10:30', value: 'UTC+10:30', offset: 'UTC+10:30' },
  { label: 'UTC+11:00', value: 'UTC+11:00', offset: 'UTC+11:00' },
  { label: 'UTC+11:30', value: 'UTC+11:30', offset: 'UTC+11:30' },
  { label: 'UTC+12:00', value: 'UTC+12:00', offset: 'UTC+12:00' },
  { label: 'UTC+12:45', value: 'UTC+12:45', offset: 'UTC+12:45' },
  { label: 'UTC+13:00', value: 'UTC+13:00', offset: 'UTC+13:00' },
  { label: 'UTC+14:00', value: 'UTC+14:00', offset: 'UTC+14:00' },
]

// files and handlers (unchanged)
const certificatesFiles = ref<File[]>([])
const personalityTestFile = ref<File | null>(null)
const certificatesInput = ref<HTMLInputElement | null>(null)
const personalityTestInput = ref<HTMLInputElement | null>(null)

const handleCertificatesUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const newFiles = Array.from(target.files)
    const maxSize = 10 * 1024 * 1024 // 10MB
    const validFiles = newFiles.filter(file => file.size <= maxSize)
    if (validFiles.length < newFiles.length) {
      alert(`Some files were too large and were not added. Maximum size is 10MB per file.`)
    }
    certificatesFiles.value = [...certificatesFiles.value, ...validFiles]
    // Persist filenames
    try {
      const existing = JSON.parse(localStorage.getItem('clientWelcomeData') || '{}')
      existing.certificates = certificatesFiles.value.map(f => f.name)
      localStorage.setItem('clientWelcomeData', JSON.stringify(existing))
    } catch {}
  }
}
const removeCertificate = (index: number) => { certificatesFiles.value.splice(index, 1) }

const handlePersonalityTestUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert('File is too large. Maximum size is 5MB.')
      if (personalityTestInput.value) personalityTestInput.value.value = ''
      return
    }
    personalityTestFile.value = file
    // Persist filename
    try {
      const existing = JSON.parse(localStorage.getItem('clientWelcomeData') || '{}')
      existing.personalityTest = personalityTestFile.value?.name
      localStorage.setItem('clientWelcomeData', JSON.stringify(existing))
    } catch {}
  }
}
const removePersonalityTest = () => {
  personalityTestFile.value = null
  if (personalityTestInput.value) personalityTestInput.value.value = ''
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Helper function to format error messages
const formatErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error
  if (Array.isArray(error)) {
    return error.map(item => {
      if (typeof item === 'string') return item
      if (typeof item === 'object' && item !== null) {
        // Extract error message from object
        return item.message || item.detail || item.error || JSON.stringify(item)
      }
      return String(item)
    }).join(', ')
  }
  if (typeof error === 'object' && error !== null) {
    return error.message || error.detail || error.error || JSON.stringify(error)
  }
  return String(error)
}

// click outside only for expertise dropdown
const onDocumentClick = (e: MouseEvent) => {
  if (showExpertiseDropdown.value && expertiseRef.value && !expertiseRef.value.contains(e.target as Node)) {
    showExpertiseDropdown.value = false
  }
}

onMounted(() => { document.addEventListener('click', onDocumentClick) })
onUnmounted(() => { document.removeEventListener('click', onDocumentClick) })

// submission: only save welcome data and navigate to services
const onSubmit = async () => {
  isSubmitting.value = true
  generalError.value = ''
  // Clear previous field errors
  Object.keys(fieldErrors).forEach(key => delete fieldErrors[key as keyof typeof fieldErrors])

  try {
    // Get basic signup data from localStorage (created in SignUp.vue)
    const basicData = JSON.parse(localStorage.getItem('signupBasicData') || '{}')
    if (!basicData.email) {
      alert('Signup information not found. Please start the signup process again.')
      router.push('/sign-up')
      return
    }

    // Store welcome form data and navigate to services selection
    const welcomeData = {
      email: form.email,
      phone: form.phone,
      companyName: form.companyName,
      companyEmail: form.companyEmail,
      companyAddress: form.companyAddress,
      companyWebsite: form.companyWebsite,
      fullName: form.fullName,
      shortVideo: form.shortVideo,
      urlLink: form.urlLink,
      primaryAreaOfExpertise: form.primaryAreaOfExpertise,
      timezone: form.timezone,
      clientReason: form.clientReason,
      openToCalls: form.openToCalls,
      hasWorkingComputer: form.hasWorkingComputer,
      hasStableInternet: form.hasStableInternet,
      comfortableWithTimeTracking: form.comfortableWithTimeTracking,
      certificates: certificatesFiles.value.map(f => f.name),
      personalityTest: personalityTestFile.value?.name
    }
    localStorage.setItem('clientWelcomeData', JSON.stringify(welcomeData))
    router.push('/client/congrats')
  } catch (error: any) {
    console.error('Error submitting form:', error)
    generalError.value = 'An unexpected error occurred. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
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

<template>
  <PageContainer bg="bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 min-h-svh">
    <!-- decorative circles (unchanged) -->
    <div class="absolute top-0 right-0 h-32 w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-24 w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />
    <div class="absolute top-16 left-16 w-2 h-2 sm:top-20 sm:left-20 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-32 right-24 w-1 h-1 sm:top-40 sm:right-32 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-24 left-32 w-1.5 h-1.5 sm:bottom-32 sm:left-40 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-16 right-16 w-2.5 h-2.5 sm:bottom-20 sm:right-20 bg-white/15 rounded-full animate-float-delayed-4" />

    <div class="mx-auto w-full max-w-md sm:max-w-lg px-4 py-8 pb-32 relative z-10">
      <header class="text-center mb-6 animate-fade-up-delay-1">
        <h1 class="text-3xl font-extrabold text-white tracking-tight">Client Onboarding</h1>
        <p class="text-white/80 text-sm mt-1">Complete your profile to connect with top agents.</p>
      </header>

      <form class="space-y-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-2xl animate-fade-up-delay-2" @submit.prevent="onSubmit">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input v-model="form.email" type="email" placeholder="Email (Personal)" class="form-input animate-slide-in-left" />
          <input v-model="form.phone" type="tel" placeholder="Phone Number" class="form-input animate-slide-in-right" />
          <input v-model="form.fullName" type="text" placeholder="Full Name" class="form-input animate-slide-in-left" />
          <input v-model="form.companyName" type="text" placeholder="Company Name" class="form-input animate-slide-in-right" />
          <input v-model="form.companyEmail" type="email" placeholder="Company Email" class="form-input animate-slide-in-left" />
          <input v-model="form.companyWebsite" type="url" placeholder="Company Website (URL)" class="form-input animate-slide-in-right" />
        </div>

        <input v-model="form.companyAddress" type="text" placeholder="Company Address" class="form-input animate-slide-in-left" />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input v-model="form.shortVideo" type="url" placeholder="1min Video (URL)" class="form-input animate-slide-in-right" />
          <input v-model="form.urlLink" type="url" placeholder="Portfolio/Social URL" class="form-input animate-slide-in-left" />
        </div>

        <!-- TIMEZONE: fixed to have single arrow, padding-right for custom icon -->
        <div class="space-y-2 animate-slide-in-right">
          <label for="timezone-select" class="form-label">Time Zone Location</label>
          <div class="relative">
            <select
              id="timezone-select"
              v-model="form.timezone"
              class="form-select pr-10"
            >
              <option value="" disabled>Select your time zone</option>
              <option
                v-for="timezone in timezoneOptions"
                :key="timezone.value"
                :value="timezone.value"
              >
                {{ timezone.label }} ({{ timezone.offset }})
              </option>
            </select>

            <!-- custom arrow (single) -->
            <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <!-- EXPERTISE MULTI-SELECT (fixed stacking, click-outside) -->
        <div class="space-y-2 animate-slide-in-left">
          <label for="expertise-select" class="form-label">What types of projects do you prefer?</label>

          <!-- Selected items -->
          <div v-if="form.primaryAreaOfExpertise.length > 0" class="flex flex-wrap gap-2 mb-3">
            <div
              v-for="(selectedType, index) in form.primaryAreaOfExpertise"
              :key="index"
              class="tag-pill group max-w-full"
            >
              <span class="truncate max-w-[10rem] block">{{ selectedType }}</span>
              <button
                type="button"
                @click="removeExpertise(index)"
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
              class="form-input cursor-pointer flex items-center justify-between bg-white min-h-[44px]"
            >
              <span class="text-gray-500">
                {{ form.primaryAreaOfExpertise.length === 0 ? 'Select your preferred project types' : `${form.primaryAreaOfExpertise.length} type${form.primaryAreaOfExpertise.length > 1 ? 's' : ''} selected` }}
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

            <!-- Modal Popup Box -->
            <div
              v-if="showExpertiseDropdown"
              class="absolute top-0 right-full mr-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 z-[99999] overflow-hidden"
              @click.stop
            >
              <!-- Modal Header -->
              <div class="bg-brand-teal text-white p-6">
                <h3 class="text-xl font-bold">Select Your Preferred Project Types</h3>
                <p class="text-teal-100 mt-1">Choose all the types of projects you're interested in</p>
              </div>
              
              <!-- Modal Body -->
              <div class="p-6 max-h-96 overflow-y-auto">
                <div
                  v-for="projectType in expertiseOptions"
                  :key="projectType"
                  @click.stop="toggleExpertise(projectType)"
                  class="px-4 py-3 cursor-pointer hover:bg-brand-teal/5 transition-colors flex items-center justify-between leading-relaxed"
                >
                  <span class="text-sm text-gray-700 whitespace-normal break-words">{{ projectType }}</span>
                  <svg
                    v-if="form.primaryAreaOfExpertise.includes(projectType)"
                    class="w-4 h-4 text-brand-teal"
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

        <!-- Remaining selects: ensure single arrow and space for arrow -->
        <div class="space-y-4 animate-slide-in-right">
          <div class="space-y-2">
            <label for="calls-select" class="form-label">Are you open to calls or video meetings?</label>
            <div class="relative">
              <select id="calls-select" v-model="form.openToCalls" class="form-select pr-10">
                <option value="" disabled>Select an option</option>
                <option value="yes">Yes, I am comfortable with calls</option>
                <option value="no">No, I prefer to review proposals asynchronously</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label for="computer-select" class="form-label">Do you have a working computer?</label>
            <div class="relative">
              <select id="computer-select" v-model="form.hasWorkingComputer" class="form-select pr-10">
                <option value="" disabled>Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label for="internet-select" class="form-label">Do you have access to stable internet?</label>
            <div class="relative">
              <select id="internet-select" v-model="form.hasStableInternet" class="form-select pr-10">
                <option value="" disabled>Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label for="tracking-select" class="form-label">Are you comfortable using time tracking tools?</label>
            <div class="relative">
              <select id="tracking-select" v-model="form.comfortableWithTimeTracking" class="form-select pr-10">
                <option value="" disabled>Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
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
              class="form-file-input"
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
        </div>

        <div class="space-y-2 animate-slide-in-right">
          <label class="form-label">Personality Test Screenshot (Max 5MB)</label>
          <div class="relative">
            <input
              type="file"
              ref="personalityTestInput"
              @change="handlePersonalityTestUpload"
              accept=".jpg,.jpeg,.png,.webp"
              class="form-file-input"
            />
          </div>
          <div v-if="personalityTestFile" class="file-list">
            <p class="text-sm font-medium text-brand-teal mb-1">Selected Screenshot:</p>
            <div class="text-xs text-gray-700 flex items-center justify-between">
              <span class="truncate">{{ personalityTestFile.name }} ({{ formatFileSize(personalityTestFile.size) }})</span>
              <button type="button" @click="removePersonalityTest" class="text-red-500 hover:text-red-700 text-xs">Remove</button>
            </div>
          </div>
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
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import PageContainer from '../../components/PageContainer.vue'

const router = useRouter()
const isSubmitting = ref(false)
const showExpertiseDropdown = ref(false)
const expertiseRef = ref<HTMLElement | null>(null)
const dropdownPosition = ref({ top: 0, left: 0, width: 0 })

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
  primaryAreaOfExpertise: [] as string[],
  timezone: '',
  openToCalls: '',
  hasWorkingComputer: '',
  hasStableInternet: '',
  comfortableWithTimeTracking: '',
})

// expertise methods
const toggleExpertiseDropdown = () => {
  console.log('toggleExpertiseDropdown called, current value:', showExpertiseDropdown.value)
  if (!showExpertiseDropdown.value && expertiseRef.value) {
    const rect = expertiseRef.value.getBoundingClientRect()
    dropdownPosition.value = {
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
      width: rect.width
    }
    console.log('Dropdown position calculated:', dropdownPosition.value)
  }
  showExpertiseDropdown.value = !showExpertiseDropdown.value
  console.log('toggleExpertiseDropdown new value:', showExpertiseDropdown.value)
}
const toggleExpertise = (projectType: string) => {
  const index = form.primaryAreaOfExpertise.indexOf(projectType)
  if (index > -1) form.primaryAreaOfExpertise.splice(index, 1)
  else form.primaryAreaOfExpertise.push(projectType)
}
const removeExpertise = (index: number) => { form.primaryAreaOfExpertise.splice(index, 1) }

const expertiseOptions = [
  'Software Development', 'Web Development', 'Mobile App Development', 'Data Science & Analytics',
  'Artificial Intelligence & Machine Learning', 'Cloud Computing & DevOps', 'Cybersecurity',
  'Digital Marketing', 'Project Management', 'UI/UX Design', 'Graphic Design',
  'Content Writing & Copywriting', 'Business Consulting', 'Financial Services',
  'Human Resources', 'Customer Service', 'Sales & Business Development',
  'Accounting & Finance', 'Legal Services', 'Healthcare & Medical Services',
  'Education & Training', 'Real Estate', 'Construction & Engineering',
  'Manufacturing & Operations', 'Logistics & Supply Chain', 'Other'
]

const timezoneOptions = [
  { label: 'Baker Island, Howland Island', value: 'UTC-12:00', offset: 'UTC-12:00' },
  { label: 'American Samoa, Niue', value: 'UTC-11:00', offset: 'UTC-11:00' },
  { label: 'Hawaii, Cook Islands', value: 'UTC-10:00', offset: 'UTC-10:00' },
  { label: 'Alaska', value: 'UTC-09:00', offset: 'UTC-09:00' },
  { label: 'Pacific Time (US & Canada)', value: 'UTC-08:00', offset: 'UTC-08:00' },
  { label: 'Mountain Time (US & Canada)', value: 'UTC-07:00', offset: 'UTC-07:00' },
  { label: 'Central Time (US & Canada)', value: 'UTC-06:00', offset: 'UTC-06:00' },
  { label: 'Eastern Time (US & Canada)', value: 'UTC-05:00', offset: 'UTC-05:00' },
  { label: 'Atlantic Time (Canada)', value: 'UTC-04:00', offset: 'UTC-04:00' },
  { label: 'Buenos Aires, Greenland', value: 'UTC-03:00', offset: 'UTC-03:00' },
  { label: 'Mid-Atlantic', value: 'UTC-02:00', offset: 'UTC-02:00' },
  { label: 'Azores, Cape Verde', value: 'UTC-01:00', offset: 'UTC-01:00' },
  { label: 'London, Dublin, Lisbon', value: 'UTC+00:00', offset: 'UTC+00:00' },
  { label: 'Berlin, Paris, Rome', value: 'UTC+01:00', offset: 'UTC+01:00' },
  { label: 'Cairo, Johannesburg, Kiev', value: 'UTC+02:00', offset: 'UTC+02:00' },
  { label: 'Moscow, Istanbul, Riyadh', value: 'UTC+03:00', offset: 'UTC+03:00' },
  { label: 'Dubai, Baku, Tbilisi', value: 'UTC+04:00', offset: 'UTC+04:00' },
  { label: 'Karachi, Tashkent, Maldives', value: 'UTC+05:00', offset: 'UTC+05:00' },
  { label: 'Mumbai, New Delhi, Chennai', value: 'UTC+05:30', offset: 'UTC+05:30' },
  { label: 'Dhaka, Almaty, Omsk', value: 'UTC+06:00', offset: 'UTC+06:00' },
  { label: 'Bangkok, Jakarta, Hanoi', value: 'UTC+07:00', offset: 'UTC+07:00' },
  { label: 'Beijing, Hong Kong, Singapore', value: 'UTC+08:00', offset: 'UTC+08:00' },
  { label: 'Tokyo, Seoul, Pyongyang', value: 'UTC+09:00', offset: 'UTC+09:00' },
  { label: 'Sydney, Melbourne, Brisbane', value: 'UTC+10:00', offset: 'UTC+10:00' },
  { label: 'Solomon Islands, New Caledonia', value: 'UTC+11:00', offset: 'UTC+11:00' },
  { label: 'Auckland, Wellington, Fiji', value: 'UTC+12:00', offset: 'UTC+12:00' },
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

// click outside only for expertise dropdown
const onDocumentClick = (e: MouseEvent) => {
  if (showExpertiseDropdown.value && expertiseRef.value && !expertiseRef.value.contains(e.target as Node)) {
    showExpertiseDropdown.value = false
  }
}

onMounted(() => { document.addEventListener('click', onDocumentClick) })
onUnmounted(() => { document.removeEventListener('click', onDocumentClick) })

// submission (unchanged testing mode)
const onSubmit = async () => {
  isSubmitting.value = true
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    if (!userInfo.email) {
      const testUserInfo = { email: 'test@example.com', name: 'Test User', id: 'test-user-id' }
      Object.assign(userInfo, testUserInfo)
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    }
    const clientData = {
      email: form.email || userInfo.email,
      phone: form.phone,
      company_name: form.companyName,
      company_email: form.companyEmail,
      company_address: form.companyAddress,
      company_website: form.companyWebsite,
      full_name: form.fullName,
      short_video: form.shortVideo,
      url_link: form.urlLink,
      primary_area_of_expertise: form.primaryAreaOfExpertise,
      timezone: form.timezone,
      open_to_calls: form.openToCalls,
      has_working_computer: form.hasWorkingComputer,
      has_stable_internet: form.hasStableInternet,
      comfortable_with_time_tracking: form.comfortableWithTimeTracking,
      certificates: certificatesFiles.value.map(f => f.name),
      personality_test: personalityTestFile.value?.name
    }
    console.log('Submitting client welcome form:', clientData)
    console.log('Testing mode: Bypassing API call')
    const result = true
    if (result) {
      const welcomeFormData = { ...form, certificates: certificatesFiles.value.map(f => f.name), personalityTest: personalityTestFile.value?.name }
      userInfo.welcomeFormData = welcomeFormData
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      router.push('/client/additional')
    } else {
      alert('Failed to update profile. Please try again.')
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('An error occurred while submitting the form. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Base inputs/button styles (unchanged) */
.form-input {
  @apply w-full rounded-full border border-gray-200 px-4 sm:px-5 py-2.5 sm:py-3 text-sm text-gray-700
         focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all;
}

/* ensure select removes native arrow across browsers and leaves room for custom arrow */
.form-select {
  @apply form-input bg-white text-left;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* hide IE/Edge native arrow */
.form-select::-ms-expand { display: none; }

/* ensure right padding for our custom SVG arrow (use utility too) */
.pr-10 { padding-right: 2.5rem !important; }

/* improved option line height so long labels don't overlap */
.leading-relaxed { line-height: 1.4; }

/* File Input Style */
.form-file-input {
  @apply w-full rounded-full border border-gray-200 px-5 py-3 text-sm
         file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
         file:text-sm file:font-semibold file:bg-brand-teal file:text-white
         hover:file:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all;
}

/* File List Container */
.file-list {
  @apply mt-2 p-3 bg-brand-teal/5 rounded-lg border border-brand-teal/20;
}

/* Buttons */
.btn-primary {
  @apply block w-full rounded-full bg-brand-teal px-6 py-3 text-center
         text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-[1.01]
         transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed;
}
.btn-secondary {
  @apply block w-full rounded-full border border-gray-300
         bg-gray-100 px-6 py-3 text-sm text-gray-700 hover:bg-gray-200
         transition-all duration-300;
}

/* Tag pills */
.tag-pill {
  @apply inline-flex items-center px-2.5 py-1 bg-brand-teal text-white text-xs rounded-full font-medium shadow-sm;
  max-width: 100%;
}

/* dropdown item tweaks (prevent overlapping & improve readability) */
[role="button"] { outline: none; }
.z-\[1000\] { z-index: 1000; } /* in case utility isn't present */

/* small helpers */
.truncate { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
</style>

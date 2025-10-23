<template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 flex items-center justify-center overflow-hidden">
    <div class="absolute top-0 right-0 h-32 w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-24 w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />
    
    <div class="absolute top-16 left-16 w-2 h-2 sm:top-20 sm:left-20 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-32 right-24 w-1 h-1 sm:top-40 sm:right-32 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-24 left-32 w-1.5 h-1.5 sm:bottom-32 sm:left-40 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-16 right-16 w-2.5 h-2.5 sm:bottom-20 sm:right-20 bg-white/15 rounded-full animate-float-delayed-4" />

    <div class="relative z-10 w-full max-w-md sm:max-w-lg px-4 py-6">
      <form class="space-y-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl animate-fade-up-delay-2">
        <div class="animate-slide-in-left">
          <input v-model="form.primaryExpertise" type="text" placeholder="What is your Primary area of expertise" class="w-full rounded-full border border-gray-200 px-4 sm:px-5 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
          <div class="mt-2 flex flex-wrap gap-2">
            <button v-for="opt in expertiseOptions" :key="opt" type="button" @click="form.primaryExpertise = opt" class="px-3 py-1 text-xs rounded-full border border-gray-200 hover:border-brand-teal hover:text-brand-teal transition">{{ opt }}</button>
          </div>
        </div>
        <div class="animate-slide-in-right">
          <input 
            v-model="form.personalityUrl"
            type="url"
            placeholder="Or paste personality screenshot URL"
            class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-right">
          <input v-model.number="form.yearsOfExperience" type="number" min="0" placeholder="Years of Experience" class="w-full rounded-full border border-gray-200 px-4 sm:px-5 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
          <div class="mt-2 flex flex-wrap gap-2">
            <button v-for="opt in yearsOptions" :key="opt" type="button" @click="form.yearsOfExperience = opt" class="px-3 py-1 text-xs rounded-full border border-gray-200 hover:border-brand-teal hover:text-brand-teal transition">{{ opt }}</button>
          </div>
        </div>
        <div class="animate-slide-in-left">
          <input v-model="form.tools" type="text" placeholder="3 most used tools or platforms" class="w-full rounded-full border border-gray-200 px-4 sm:px-5 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
          <div class="mt-2 flex flex-wrap gap-2">
            <button v-for="opt in toolsOptions" :key="opt" type="button" @click="form.tools = form.tools ? `${form.tools}, ${opt}` : opt" class="px-3 py-1 text-xs rounded-full border border-gray-200 hover:border-brand-teal hover:text-brand-teal transition">{{ opt }}</button>
          </div>
        </div>

        <div class="animate-slide-in-right">
          <input 
            v-model="form.phoneNumber"
            type="tel"
            placeholder="Phone Number"
            class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>

        <div class="space-y-2 animate-slide-in-left">
          <label class="text-sm font-medium text-brand-teal">Certifications</label>
          <div class="relative">
            <input 
              type="file" 
              multiple 
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              @change="handleCertificationsUpload"
              class="hidden" 
              ref="certificationsInput"
              id="certifications-upload"
            />
            <label 
              for="certifications-upload" 
              class="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition-all hover:border-brand-teal hover:bg-brand-teal/5 animate-pulse"
            >
              <svg class="mb-2 h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span class="text-sm text-gray-600">Click to upload certifications</span>
              <span class="text-xs text-gray-500">PDF, DOC, JPG, PNG (max 10MB each)</span>
              <div v-if="certificationsFiles.length > 0" class="mt-2 text-xs text-brand-teal font-medium">
                {{ certificationsFiles.length }} file(s) selected
              </div>
            </label>
          </div>
          <div class="mt-2">
            <input 
              v-model="form.certificateUrls"
              type="text"
              placeholder="Or paste certificate URLs (comma-separated)"
              class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
          </div>
        </div>

        <div class="animate-slide-in-left">
          <select v-model.number="form.hoursPerWeek" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all bg-white">
            <option :value="undefined" disabled selected>How many hours can you commit per week</option>
            <option :value="80">80</option>
            <option :value="160">160</option>
          </select>
        </div>
        <div class="animate-slide-in-right">
          <select v-model="form.timezone" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all bg-white">
            <option value="" disabled selected>Time Zone / Location</option>
            <option v-for="tz in timezoneOptions" :key="tz.value" :value="tz.value">{{ tz.label }}</option>
          </select>
        </div>
        <div class="animate-slide-in-left">
          <div class="relative" ref="projectsRef" style="z-index: 100;">
            <div
              @click="toggleProjectsDropdown"
              role="button"
              tabindex="0"
              class="form-input cursor-pointer flex items-center justify-between bg-white min-h-[44px]"
            >
              <span class="text-gray-500">
                {{ form.preferredProjects.length === 0 ? 'Select your preferred projects' : `${form.preferredProjects.length} project${form.preferredProjects.length > 1 ? 's' : ''} selected` }}
              </span>
              <svg
                class="w-4 h-4 text-gray-400 transition-transform duration-200"
                :class="{ 'rotate-180': showProjectsDropdown }"
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
                v-if="showProjectsDropdown"
                class="fixed inset-0 z-[9999] bg-black/30 flex items-start pt-16 justify-center sm:items-start sm:justify-center sm:bg-transparent"
                @click="showProjectsDropdown = false"
              >
                <div
                  class="w-[85%] max-w-sm bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden mt-0 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:top-20"
                  @click.stop
                >
                  <!-- Modal Header -->
                  <div class="bg-brand-teal text-white p-3 sm:p-4">
                    <h3 class="text-base font-semibold">Select Project Types</h3>
                    <p class="text-teal-100 text-xs">
                      Choose project types you're interested in working on
                    </p>
                  </div>
                  
                  <!-- Modal Body -->
                  <div class="p-3 max-h-[50vh] overflow-y-auto">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      <div
                        v-for="project in projectOptions"
                        :key="project"
                        @click="toggleProject(project)"
                        class="px-2.5 py-1.5 cursor-pointer hover:bg-brand-teal/5 rounded-md transition-colors flex items-center justify-between text-xs"
                      >
                        <span class="text-gray-700">{{ project }}</span>
                        <svg
                          v-if="form.preferredProjects.includes(project)"
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
        </div>
        <div class="animate-slide-in-right">
          <select v-model="form.openToCalls" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all bg-white">
            <option :value="undefined" disabled selected>Are you open to calls or video meetings?</option>
            <option :value="true">Yes, I am comfortable with calls</option>
            <option :value="false">No, I prefer asynchronous communication</option>
          </select>
        </div>
        <div class="animate-slide-in-left">
          <select v-model="form.hasComputer" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all bg-white">
            <option :value="undefined" disabled selected>Do you have a working computer/laptop?</option>
            <option :value="true">Yes, I have a working computer/laptop</option>
            <option :value="false">No, I don't have a working computer/laptop</option>
          </select>
        </div>
        <div class="animate-slide-in-right">
          <select v-model="form.hasInternet" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all bg-white">
            <option :value="undefined" disabled selected>Do you have access to stable internet?</option>
            <option :value="true">Yes, I have stable internet access</option>
            <option :value="false">No, I don't have stable internet access</option>
          </select>
        </div>
        <div class="animate-slide-in-left">
          <select v-model="form.comfortableWithTracking" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all bg-white">
            <option :value="undefined" disabled selected>Are you comfortable using time-tracking tools?</option>
            <option :value="true">Yes, I am comfortable with time-tracking</option>
            <option :value="false">No, I am not comfortable with time-tracking</option>
          </select>
        </div>
        <div class="animate-slide-in-right">
          <input v-model="form.videoUrl" type="url" placeholder="Submit your 1min video (URL)" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>

        <div class="animate-slide-in-left">
          <input v-model="form.portfolioLink" type="url" placeholder="Portfolio link (URL)" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>

        <div class="space-y-2 animate-slide-in-left">
          <label class="text-sm font-medium text-brand-teal">Personality Test Screenshot</label>
          <div class="relative">
            <input 
              type="file" 
              accept=".jpg,.jpeg,.png,.webp"
              @change="handlePersonalityTestUpload"
              class="hidden" 
              ref="personalityTestInput"
              id="personality-test-upload"
            />
            <label 
              for="personality-test-upload" 
              class="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition-all hover:border-brand-teal hover:bg-brand-teal/5 animate-pulse"
            >
              <svg class="mb-2 h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-sm text-gray-600">Click to upload screenshot</span>
              <span class="text-xs text-gray-500">JPG, PNG, WebP (max 5MB)</span>
              <div v-if="personalityTestFile" class="mt-2 text-xs text-brand-teal font-medium">
                {{ personalityTestFile.name }}
              </div>
            </label>
          </div>
        </div>

      </form>
      <div class="space-y-3 pt-4 animate-fade-up-delay-4">
        <button
          @click="onSubmit"
          :disabled="isSubmitting"
          class="btn-pressable block w-full rounded-full bg-brand-teal px-6 py-3 text-center text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'Submitting...' : 'Next' }}
        </button>
        <button class="btn-pressable block w-full rounded-full border border-brand-teal/30 bg-brand-teal/10 px-6 py-3 text-sm text-brand-teal hover:bg-brand-teal/20 transition-all duration-300" @click="$router.back()">Back</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import authService, { type AgentWelcomeData } from '../../services/authService'
import type { SignupData } from '../../types/api/auth'

const router = useRouter()
const isSubmitting = ref(false)
const showProjectsDropdown = ref(false)
const projectsRef = ref<HTMLElement | null>(null)

const form = reactive({
  primaryExpertise: '',
  yearsOfExperience: 0 as number,
  tools: '',
  phoneNumber: '',
  hoursPerWeek: undefined as number | undefined,
  timezone: '',
  preferredProjects: [] as string[],
  openToCalls: undefined as boolean | undefined,
  hasComputer: undefined as boolean | undefined,
  hasInternet: undefined as boolean | undefined,
  comfortableWithTracking: undefined as boolean | undefined,
  videoUrl: '',
  portfolioLink: '',
  certificateUrls: '',
  personalityUrl: ''
})

const certificationsFiles = ref<File[]>([])
const personalityTestFile = ref<File | null>(null)
const certificationsInput = ref<HTMLInputElement | null>(null)
const personalityTestInput = ref<HTMLInputElement | null>(null)

const projectOptions = [
  'Software Development', 'Web Development', 'Mobile App Development', 'Data Science & Analytics',
  'Artificial Intelligence & Machine Learning', 'Cloud Computing & DevOps', 'Cybersecurity',
  'Digital Marketing', 'Project Management', 'UI/UX Design', 'Graphic Design',
  'Content Writing & Copywriting', 'Business Consulting', 'Financial Services',
  'Human Resources', 'Customer Service', 'Sales & Business Development',
  'Accounting & Finance', 'Legal Services', 'Healthcare & Medical Services',
  'Education & Training', 'Real Estate', 'Construction & Engineering',
  'Manufacturing & Operations', 'Logistics & Supply Chain', 'Other'
]

const expertiseOptions = [
  'Web Devlopment',
  'Mobile Development',
  'UI/UX Design',
  'Content Writing',
  'Digital Marketing',
  'Data Analysis',
  'Other'
]

const yearsOptions = [0,1,2,3,5,7,10,15]

const toolsOptions = [
  'Figma','Adobe Photoshop','Illustrator','VS Code','GitHub','Jira','Notion','Excel','Canva','Python','React','Node.js'
]

const timezoneOptions = [
  { label: 'UTC-12:00', value: 'UTC-12:00' },
  { label: 'UTC-11:00', value: 'UTC-11:00' },
  { label: 'UTC-10:00', value: 'UTC-10:00' },
  { label: 'UTC-09:30', value: 'UTC-09:30' },
  { label: 'UTC-09:00', value: 'UTC-09:00' },
  { label: 'UTC-08:00', value: 'UTC-08:00' },
  { label: 'UTC-07:00', value: 'UTC-07:00' },
  { label: 'UTC-06:00', value: 'UTC-06:00' },
  { label: 'UTC-05:00', value: 'UTC-05:00' },
  { label: 'UTC-04:30', value: 'UTC-04:30' },
  { label: 'UTC-04:00', value: 'UTC-04:00' },
  { label: 'UTC-03:30', value: 'UTC-03:30' },
  { label: 'UTC-03:00', value: 'UTC-03:00' },
  { label: 'UTC-02:00', value: 'UTC-02:00' },
  { label: 'UTC-01:00', value: 'UTC-01:00' },
  { label: 'UTC+00:00', value: 'UTC+00:00' },
  { label: 'UTC+01:00', value: 'UTC+01:00' },
  { label: 'UTC+02:00', value: 'UTC+02:00' },
  { label: 'UTC+03:00', value: 'UTC+03:00' },
  { label: 'UTC+03:30', value: 'UTC+03:30' },
  { label: 'UTC+04:00', value: 'UTC+04:00' },
  { label: 'UTC+05:00', value: 'UTC+05:00' },
  { label: 'UTC+05:30', value: 'UTC+05:30' },
  { label: 'UTC+05:45', value: 'UTC+05:45' },
  { label: 'UTC+06:00', value: 'UTC+06:00' },
  { label: 'UTC+06:30', value: 'UTC+06:30' },
  { label: 'UTC+07:00', value: 'UTC+07:00' },
  { label: 'UTC+08:00', value: 'UTC+08:00' },
  { label: 'UTC+08:45', value: 'UTC+08:45' },
  { label: 'UTC+09:00', value: 'UTC+09:00' },
  { label: 'UTC+09:30', value: 'UTC+09:30' },
  { label: 'UTC+10:00', value: 'UTC+10:00' },
  { label: 'UTC+10:30', value: 'UTC+10:30' },
  { label: 'UTC+11:00', value: 'UTC+11:00' },
  { label: 'UTC+11:30', value: 'UTC+11:30' },
  { label: 'UTC+12:00', value: 'UTC+12:00' },
  { label: 'UTC+12:45', value: 'UTC+12:45' },
  { label: 'UTC+13:00', value: 'UTC+13:00' },
  { label: 'UTC+14:00', value: 'UTC+14:00' },
]

const handleCertificationsUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    certificationsFiles.value = Array.from(target.files)
    
    const maxSize = 10 * 1024 * 1024 // 10MB
    const oversizedFiles = certificationsFiles.value.filter(file => file.size > maxSize)
    
    if (oversizedFiles.length > 0) {
      alert(`Some files are too large. Maximum size is 10MB per file.`)
      certificationsFiles.value = certificationsFiles.value.filter(file => file.size <= maxSize)
    }
    // Persist filenames
    try {
      const existing = JSON.parse(localStorage.getItem('agentWelcomeData') || '{}')
      existing.certifications = certificationsFiles.value.map(f => f.name)
      localStorage.setItem('agentWelcomeData', JSON.stringify(existing))
    } catch {}
  }
}

const handlePersonalityTestUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert('File is too large. Maximum size is 5MB.')
      if (personalityTestInput.value) {
        personalityTestInput.value.value = ''
      }
      return
    }
    
    personalityTestFile.value = file
    // Persist filename
    try {
      const existing = JSON.parse(localStorage.getItem('agentWelcomeData') || '{}')
      existing.personalityTest = personalityTestFile.value?.name
      localStorage.setItem('agentWelcomeData', JSON.stringify(existing))
    } catch {}
  }
}

// Project selection methods
const updateDropdownPosition = async () => {
  await nextTick()
  if (projectsRef.value) {
    const rect = projectsRef.value.getBoundingClientRect()
    document.documentElement.style.setProperty('--dropdown-top', `${rect.bottom + window.scrollY}px`)
  }
}

const toggleProjectsDropdown = async () => {
  if (!showProjectsDropdown.value) {
    await updateDropdownPosition()
  }
  showProjectsDropdown.value = !showProjectsDropdown.value
  console.log('toggleProjectsDropdown new value:', showProjectsDropdown.value)
}

const toggleProject = (project: string) => {
  const index = form.preferredProjects.indexOf(project)
  if (index > -1) {
    form.preferredProjects.splice(index, 1)
  } else {
    form.preferredProjects.push(project)
  }
}

const onSubmit = async () => {
  isSubmitting.value = true

  try {
    const basicData = JSON.parse(localStorage.getItem('signupBasicData') || '{}')
    if (!basicData.email) {
      alert('Signup information not found. Please start the signup process again.')
      router.push('/sign-up')
      return
    }

    const welcomeData = {
      primaryExpertise: form.primaryExpertise,
      yearsOfExperience: form.yearsOfExperience,
      tools: form.tools,
      phoneNumber: form.phoneNumber,
      hoursPerWeek: form.hoursPerWeek,
      timezone: form.timezone,
      preferredProjects: form.preferredProjects,
      openToCalls: form.openToCalls,
      hasComputer: form.hasComputer,
      hasInternet: form.hasInternet,
      comfortableWithTracking: form.comfortableWithTracking,
      videoUrl: form.videoUrl,
      certifications: certificationsFiles.value.map(f => f.name),
      personalityTest: personalityTestFile.value?.name,
      portfolioLink: form.portfolioLink,
      certificateUrls: form.certificateUrls,
      personalityUrl: form.personalityUrl
    }
    localStorage.setItem('agentWelcomeData', JSON.stringify(welcomeData))
    router.push('/agent/congrats')
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('There was an error saving your information. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

</script>
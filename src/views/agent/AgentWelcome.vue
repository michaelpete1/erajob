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
        </div>
        <div class="animate-slide-in-right">
          <input v-model="form.yearsOfExperience" type="text" placeholder="Years of Experience" class="w-full rounded-full border border-gray-200 px-4 sm:px-5 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-left">
          <input v-model="form.tools" type="text" placeholder="3 most used tools or platforms" class="w-full rounded-full border border-gray-200 px-4 sm:px-5 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>

        <div class="space-y-2 animate-slide-in-right">
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
        </div>

        <div class="animate-slide-in-left">
          <select v-model="form.hoursPerWeek" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all bg-white">
            <option value="" disabled selected>How many hours can you commit per week</option>
            <option value="80 hours part time">80 hours part time</option>
            <option value="160 hours part time">160 hours part time</option>
          </select>
        </div>
        <div class="animate-slide-in-right">
          <select v-model="form.timezone" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all bg-white">
            <option value="" disabled selected>Time Zone / Location</option>
            <option value="EST (Eastern Time)">EST (Eastern Time)</option>
            <option value="CST (Central Time)">CST (Central Time)</option>
            <option value="MST (Mountain Time)">MST (Mountain Time)</option>
            <option value="PST (Pacific Time)">PST (Pacific Time)</option>
            <option value="GMT (Greenwich Mean Time)">GMT (Greenwich Mean Time)</option>
            <option value="CET (Central European Time)">CET (Central European Time)</option>
            <option value="EET (Eastern European Time)">EET (Eastern European Time)</option>
            <option value="IST (India Standard Time)">IST (India Standard Time)</option>
            <option value="CST (China Standard Time)">CST (China Standard Time)</option>
            <option value="JST (Japan Standard Time)">JST (Japan Standard Time)</option>
            <option value="AEST (Australian Eastern Time)">AEST (Australian Eastern Time)</option>
            <option value="Other">Other</option>
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

            <!-- Modal Popup Box -->
            <div
              v-if="showProjectsDropdown"
              class="absolute top-0 right-full mr-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 z-[99999] overflow-hidden"
              @click.stop
            >
                <!-- Modal Header -->
                <div class="bg-brand-teal text-white p-6">
                  <h3 class="text-xl font-bold">Select Your Preferred Projects</h3>
                  <p class="text-teal-100 mt-1">Choose all the types of projects you're interested in working on</p>
                </div>
                
                <!-- Modal Body -->
                <div class="p-6 max-h-96 overflow-y-auto">
                  <div
                    v-for="project in projectOptions"
                    :key="project"
                    @click.stop="toggleProject(project)"
                    class="px-4 py-3 cursor-pointer hover:bg-brand-teal/5 transition-colors flex items-center justify-between leading-relaxed"
                  >
                    <span class="text-sm text-gray-700 whitespace-normal break-words">{{ project }}</span>
                    <svg
                      v-if="form.preferredProjects.includes(project)"
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
        <div class="animate-slide-in-right">
          <select v-model="form.openToCalls" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all bg-white">
            <option value="" disabled selected>Are you open to calls or video meetings?</option>
            <option value="yes">Yes, I am comfortable with calls</option>
            <option value="no">No, I prefer asynchronous communication</option>
          </select>
        </div>
        <div class="animate-slide-in-left">
          <select v-model="form.hasComputer" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all bg-white">
            <option value="" disabled selected>Do you have a working computer/laptop?</option>
            <option value="yes">Yes, I have a working computer/laptop</option>
            <option value="no">No, I don't have a working computer/laptop</option>
          </select>
        </div>
        <div class="animate-slide-in-right">
          <select v-model="form.hasInternet" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all bg-white">
            <option value="" disabled selected>Do you have access to stable internet?</option>
            <option value="yes">Yes, I have stable internet access</option>
            <option value="no">No, I don't have stable internet access</option>
          </select>
        </div>
        <div class="animate-slide-in-left">
          <select v-model="form.comfortableWithTracking" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all bg-white">
            <option value="" disabled selected>Are you comfortable using time-tracking tools?</option>
            <option value="yes">Yes, I am comfortable with time-tracking</option>
            <option value="no">No, I am not comfortable with time-tracking</option>
          </select>
        </div>
        <div class="animate-slide-in-right">
          <input v-model="form.videoUrl" type="url" placeholder="Submit your 1min video (URL)" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
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
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isSubmitting = ref(false)
const showProjectsDropdown = ref(false)
const projectsRef = ref<HTMLElement | null>(null)

const form = reactive({
  primaryExpertise: '',
  yearsOfExperience: '',
  tools: '',
  hoursPerWeek: '',
  timezone: '',
  preferredProjects: [] as string[],
  openToCalls: '',
  hasComputer: '',
  hasInternet: '',
  comfortableWithTracking: '',
  videoUrl: ''
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
  }
}

// Project selection methods
const toggleProjectsDropdown = () => {
  console.log('toggleProjectsDropdown called, current value:', showProjectsDropdown.value)
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
    // Simulate form submission - in a real app, this would be an API call
    console.log('Agent welcome form submitted:', {
      formData: form,
      certifications: certificationsFiles.value.map(f => f.name),
      personalityTest: personalityTestFile.value?.name
    })
    
    // Save form data to localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    userInfo.welcomeFormData = form
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    
    // Navigate to next page
    await router.push('/agent/services')

  } catch (error) {
    console.error('Form submission error:', error)
    alert('There was an error submitting your form. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

</script>

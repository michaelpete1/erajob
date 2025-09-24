<template>
  <PageContainer bg="bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 min-h-svh">
    <div class="absolute top-0 right-0 h-32 w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-24 w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />
    
    <div class="absolute top-16 left-16 w-2 h-2 sm:top-20 sm:left-20 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-32 right-24 w-1 h-1 sm:top-40 sm:right-32 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-24 left-32 w-1.5 h-1.5 sm:bottom-32 sm:left-40 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-16 right-16 w-2.5 h-2.5 sm:bottom-20 sm:right-20 bg-white/15 rounded-full animate-float-delayed-4" />
    
    <header class="sticky top-0 z-10 flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 bg-teal-500 text-white animate-fade-up">
      <button @click="$router.push('/landing')" class="text-white/80 hover:text-white transition-colors flex items-center gap-2 text-sm animate-bounce-in">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Home
      </button>
      <div class="flex items-center gap-2 animate-fade-up-delay-1">
        <div class="w-2 h-2 rounded-full bg-white/60"></div>
        <div class="w-2 h-2 rounded-full bg-white"></div>
        <div class="w-2 h-2 rounded-full bg-white/60"></div>
        <div class="w-2 h-2 rounded-full bg-white/60"></div>
      </div>
      <div class="w-8 h-8 rounded-full bg-white" />
    </header>

    <div class="mx-auto w-full max-w-md sm:max-w-lg px-4 py-6 pb-32">
      <form class="space-y-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl animate-fade-up-delay-2">
        <div class="animate-slide-in-left">
          <input v-model="form.email" type="email" placeholder="Email" class="w-full rounded-full border border-gray-200 px-4 sm:px-5 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-right">
          <input v-model="form.phone" type="tel" placeholder="Phone Number" class="w-full rounded-full border border-gray-200 px-4 sm:px-5 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-left">
          <input v-model="form.companyName" type="text" placeholder="Company Name" class="w-full rounded-full border border-gray-200 px-4 sm:px-5 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-right">
          <input v-model="form.companyEmail" type="email" placeholder="Company email" class="w-full rounded-full border border-gray-200 px-4 sm:px-5 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-left">
          <input v-model="form.companyAddress" type="text" placeholder="Company Address" class="w-full rounded-full border border-gray-200 px-4 sm:px-5 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-right">
          <input v-model="form.companyWebsite" type="url" placeholder="Company Website" class="w-full rounded-full border border-gray-200 px-4 sm:px-5 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-left">
          <input v-model="form.fullName" type="text" placeholder="Full Name" class="w-full rounded-full border border-gray-200 px-4 sm:px-5 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-right">
          <input v-model="form.shortVideo" type="url" placeholder="Submit your 1min video (URL)" class="w-full rounded-full border border-gray-200 px-4 sm:px-5 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-left">
          <input v-model="form.urlLink" type="url" placeholder="URL Link" class="w-full rounded-full border border-gray-200 px-4 sm:px-5 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        
        <div class="space-y-2 animate-slide-in-right">
          <label class="text-sm font-medium text-brand-teal">Certificates</label>
          <div class="relative">
            <input 
              type="file" 
              ref="certificatesInput"
              @change="handleCertificatesUpload"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-teal file:text-white hover:file:bg-brand-teal/90 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all"
            />
          </div>
          <div v-if="certificatesFiles.length > 0" class="mt-2 p-3 bg-brand-teal/5 rounded-lg border border-brand-teal/20">
            <p class="text-sm font-medium text-brand-teal mb-1">Selected Certificates:</p>
            <ul class="space-y-1">
              <li v-for="(file, index) in certificatesFiles" :key="index" class="text-xs text-gray-700 flex items-center justify-between">
                <span>{{ file.name }} ({{ formatFileSize(file.size) }})</span>
                <button @click="removeCertificate(index)" class="text-red-500 hover:text-red-700 text-xs">Remove</button>
              </li>
            </ul>
          </div>
        </div>

        <div class="space-y-2 animate-slide-in-left">
          <label class="text-sm font-medium text-brand-teal">Personality Test Screenshot</label>
          <div class="relative">
            <input 
              type="file" 
              ref="personalityTestInput"
              @change="handlePersonalityTestUpload"
              accept=".jpg,.jpeg,.png,.webp"
              class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-teal file:text-white hover:file:bg-brand-teal/90 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all"
            />
          </div>
          <div v-if="personalityTestFile" class="mt-2 p-3 bg-brand-teal/5 rounded-lg border border-brand-teal/20">
            <p class="text-sm font-medium text-brand-teal mb-1">Selected Screenshot:</p>
            <div class="text-xs text-gray-700 flex items-center justify-between">
              <span>{{ personalityTestFile.name }} ({{ formatFileSize(personalityTestFile.size) }})</span>
              <button @click="removePersonalityTest" class="text-red-500 hover:text-red-700 text-xs">Remove</button>
            </div>
          </div>
        </div>

        <div class="rounded-md border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700 animate-fade-up-delay-3">
          <strong class="text-brand-teal">Background Check Consent:</strong>
          <p class="mt-1">Consent to ERA onboarding, conducting a background check as required by financial capability and project management.</p>
        </div>

      </form>
      <div class="space-y-3 pt-4 animate-fade-up-delay-4">
        <router-link
          to="/client/services"
          class="btn-pressable block w-full rounded-full bg-brand-teal px-6 py-3 text-center text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          Next
        </router-link>
        <button class="btn-pressable block w-full rounded-full border border-brand-teal/30 md:border-brand-teal bg-brand-teal/10 md:bg-brand-teal/5 px-6 py-3 text-sm text-brand-teal hover:bg-brand-teal/20 md:hover:bg-brand-teal/10 transition-all duration-300" @click="$router.back()">Back</button>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import PageContainer from '../../components/PageContainer.vue'

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
})

const certificatesFiles = ref<File[]>([])
const personalityTestFile = ref<File | null>(null)
const certificatesInput = ref<HTMLInputElement | null>(null)
const personalityTestInput = ref<HTMLInputElement | null>(null)

const handleCertificatesUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const newFiles = Array.from(target.files)
    
    const maxSize = 10 * 1024 * 1024 // 10MB
    const oversizedFiles = newFiles.filter(file => file.size > maxSize)
    
    if (oversizedFiles.length > 0) {
      alert(`Some files are too large. Maximum size is 10MB per file.`)
        const validFiles = newFiles.filter(file => file.size <= maxSize)
      certificatesFiles.value = [...certificatesFiles.value, ...validFiles]
    } else {
      certificatesFiles.value = [...certificatesFiles.value, ...newFiles]
    }
  }
}

const removeCertificate = (index: number) => {
  certificatesFiles.value.splice(index, 1)
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

const removePersonalityTest = () => {
  personalityTestFile.value = null
  if (personalityTestInput.value) {
    personalityTestInput.value.value = ''
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>


<template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 flex items-center justify-center overflow-hidden">
    <div class="absolute top-0 right-0 h-32 w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-24 w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />
    
    <div class="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-40 right-32 w-1 h-1 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-32 left-40 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-20 right-20 w-2.5 h-2.5 bg-white/15 rounded-full animate-float-delayed-4" />

    <div class="relative z-10 w-full max-w-md px-4 py-6">
      <form class="space-y-4 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl animate-fade-up-delay-2">
        <div class="animate-slide-in-left">
          <input type="text" placeholder="What is your Primary area of expertise" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-right">
          <input type="text" placeholder="Years of Experience" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-left">
          <input type="text" placeholder="3 most used tools or platforms" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
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
          <input type="text" placeholder="How many hours can you commit per week" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-right">
          <input type="text" placeholder="Time Zone / Location" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-left">
          <input type="text" placeholder="Preferred projects" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-right">
          <input type="text" placeholder="Are you open to calls or video meetings?" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-left">
          <input type="text" placeholder="Do you have a working computer/laptop?" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-right">
          <input type="text" placeholder="Do you have access to stable internet?" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-left">
          <input type="text" placeholder="Are you comfortable using time-tracking tools?" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-right">
          <input type="url" placeholder="Submit your 1min video (URL)" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
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
        <router-link
          to="/agent/services"
          class="btn-pressable block w-full rounded-full bg-brand-teal px-6 py-3 text-center text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          Next
        </router-link>
        <button class="btn-pressable block w-full rounded-full border border-brand-teal/30 bg-brand-teal/10 px-6 py-3 text-sm text-brand-teal hover:bg-brand-teal/20 transition-all duration-300" @click="$router.back()">Back</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const certificationsFiles = ref<File[]>([])
const personalityTestFile = ref<File | null>(null)
const certificationsInput = ref<HTMLInputElement | null>(null)
const personalityTestInput = ref<HTMLInputElement | null>(null)

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

</script>

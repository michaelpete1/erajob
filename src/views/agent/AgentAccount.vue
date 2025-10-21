<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <header class="sticky top-0 z-30 flex items-center justify-between bg-brand-teal text-white px-4 sm:px-6 py-4 shadow-lg">
      <div class="flex items-center gap-3">
        <button
          class="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition"
          @click="$router.back()"
          aria-label="Back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div>
          <h1 class="text-xl font-semibold">Account</h1>
          <p class="text-sm text-white/80">Manage your agent details</p>
        </div>
      </div>
    </header>

    <main class="px-4 sm:px-6 py-6 pb-24 max-w-4xl mx-auto space-y-6">
      <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center gap-4">
        <div class="relative">
          <div class="w-24 h-24 rounded-full bg-brand-teal text-white font-semibold text-2xl flex items-center justify-center shadow-md">
            {{ agentInitials }}
          </div>
          <button class="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-brand-teal text-white flex items-center justify-center shadow hover:bg-brand-teal-dark transition">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828m-2.828-2.828l1.414-1.414a2 2 0 112.828 2.828L18 9.828" />
            </svg>
          </button>
        </div>
        <div>
          <h2 class="text-2xl font-semibold">{{ agentName }}</h2>
          <p class="text-sm text-gray-500">{{ agentEmail }}</p>
        </div>
        <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wide">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 11.25c-1.148 0-2.25-.563-2.25-1.688v-.375c0-.563.188-.938.563-1.313l1.312-1.312c.563-.563.75-1.313.75-2.25 0-1.688-1.313-3-3-3s-3 1.312-3 3" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21.75c-6.213 0-9.75-3.083-9.75-7.313 0-2.438 1.5-4.5 3.75-5.813" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 14.438c0 4.23-3.537 7.312-9.75 7.312" />
          </svg>
          Agent Account
        </span>
      </section>

      <section class="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div class="border-b border-gray-100 px-6 py-4">
          <h3 class="text-lg font-semibold text-gray-900">Profile details</h3>
        </div>
        <div class="p-6 space-y-5">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Full name</p>
                <p class="text-sm text-gray-500">Displayed on proposals</p>
              </div>
            </div>
            <p class="text-sm font-semibold text-gray-900">{{ agentProfile.name || agentName }}</p>
          </div>
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Email address</p>
                <p class="text-sm text-gray-500">For notifications</p>
              </div>
            </div>
            <p class="text-sm font-semibold text-gray-900 break-all">{{ agentProfile.email || agentEmail }}</p>
          </div>
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Phone number</p>
                <p class="text-sm text-gray-500">Share availability updates</p>
              </div>
            </div>
            <p class="text-sm font-semibold text-gray-900">{{ agentProfile.phone || 'Not provided' }}</p>
          </div>
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 12A9 9 0 113 12a9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Member since</p>
                <p class="text-sm text-gray-500">Joined EraJob</p>
              </div>
            </div>
            <p class="text-sm font-semibold text-gray-900">{{ memberSince }}</p>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div class="border-b border-gray-100 px-6 py-4">
          <h3 class="text-lg font-semibold text-gray-900">Professional snapshot</h3>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 7h18M3 12h18M3 17h18" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Primary expertise</p>
                <p class="text-sm text-gray-500">Top skill category</p>
              </div>
            </div>
            <p class="text-sm font-semibold text-gray-900">{{ agentProfile.primaryExpertise || 'Not set' }}</p>
          </div>
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-lime-100 text-lime-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Verification status</p>
                <p class="text-sm text-gray-500">Identity and certification</p>
              </div>
            </div>
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
              :class="agentProfile.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'">
              <span class="w-2 h-2 rounded-full" :class="agentProfile.verified ? 'bg-emerald-500' : 'bg-gray-400'"></span>
              {{ agentProfile.verified ? 'Verified' : 'Pending verification' }}
            </span>
          </div>
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 12a8.25 8.25 0 11-16.5 0 8.25 8.25 0 0116.5 0z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Experience level</p>
                <p class="text-sm text-gray-500">Years in practice</p>
              </div>
            </div>
            <p class="text-sm font-semibold text-gray-900">{{ agentProfile.experience || 'Not set' }}</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apiService } from '../../services/api'

const agentName = ref('')
const agentEmail = ref('')
const memberSince = ref('')

const agentProfile = ref({
  name: '',
  email: '',
  phone: '',
  primaryExpertise: '',
  experience: '',
  verified: false
})

const agentInitials = computed(() => {
  return agentName.value
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
})

onMounted(async () => {
  loadFromLocalStorage()
  await fetchAgentProfile()
  ensureMemberSinceFallback()
})

function loadFromLocalStorage() {
  const storedInfo = localStorage.getItem('userInfo')
  if (storedInfo) {
    try {
      const parsed = JSON.parse(storedInfo)
      if (parsed.full_name || parsed.name) {
        agentName.value = parsed.full_name || parsed.name || agentName.value
      }
      if (parsed.email) {
        agentEmail.value = parsed.email
      }
      if (parsed.createdAt) {
        const createdDate = new Date(parsed.createdAt)
        memberSince.value = createdDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      }
      const agentData = parsed.agentProfile || parsed.profile
      if (agentData && typeof agentData === 'object') {
        agentProfile.value = {
          name: agentData.name || parsed.full_name || parsed.name || agentProfile.value.name,
          email: agentData.email || parsed.email || agentProfile.value.email,
          phone: agentData.phone_number || agentData.phone || parsed.phone_number || parsed.phone || agentProfile.value.phone,
          primaryExpertise: agentData.primary_expertise || agentData.primaryExpertise || parsed.primary_expertise || agentProfile.value.primaryExpertise,
          experience: agentData.experience || agentData.years_of_experience || parsed.years_of_experience || agentProfile.value.experience,
          verified: Boolean((agentData.verified ?? parsed.verified) ?? agentProfile.value.verified)
        }
      }
      if (!agentProfile.value.phone && (parsed.phone_number || parsed.phone)) {
        agentProfile.value.phone = parsed.phone_number || parsed.phone
      }
    } catch (error) {
      console.error('Error parsing agent info', error)
    }
  }

  const storedAgentProfile = localStorage.getItem('agentProfile')
  if (storedAgentProfile) {
    try {
      const parsedProfile = JSON.parse(storedAgentProfile)
      agentProfile.value = {
        name: parsedProfile.name || agentProfile.value.name,
        email: parsedProfile.email || agentProfile.value.email,
        phone: parsedProfile.phone || agentProfile.value.phone,
        primaryExpertise: parsedProfile.primaryExpertise || agentProfile.value.primaryExpertise,
        experience: parsedProfile.experience || agentProfile.value.experience,
        verified: Boolean(parsedProfile.verified ?? agentProfile.value.verified)
      }
    } catch (error) {
      console.error('Error loading agent profile', error)
    }
  }
}

async function fetchAgentProfile() {
  try {
    const response = await apiService.getCurrentUser()
    if (response.success && response.data) {
      const payload = response.data
      const data = payload?.data || payload

      if (data) {
        const fullName = data.full_name || data.name || agentName.value
        const email = data.email || agentEmail.value
        const profile = data.agent_profile || data.agentProfile || {}

        if (fullName) agentName.value = fullName
        if (email) agentEmail.value = email

        agentProfile.value = {
          name: profile.name || fullName || agentProfile.value.name,
          email: profile.email || email || agentProfile.value.email,
          phone: profile.phone_number || profile.phone || data.phone_number || data.phone || agentProfile.value.phone,
          primaryExpertise: profile.primary_expertise || profile.primaryExpertise || data.primary_expertise || agentProfile.value.primaryExpertise,
          experience: profile.experience || profile.years_of_experience || data.years_of_experience || agentProfile.value.experience,
          verified: Boolean((profile.verified ?? data.verified) ?? agentProfile.value.verified)
        }

        const created = data.date_created || data.created_at || data.createdAt
        if (created) {
          const createdDate = typeof created === 'number'
            ? new Date(created * 1000)
            : new Date(created)
          if (!Number.isNaN(createdDate.getTime())) {
            memberSince.value = createdDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
          }
        }
        if (!agentProfile.value.phone && (data.phone_number || data.phone)) {
          agentProfile.value.phone = data.phone_number || data.phone
        }
      }
    } else if (!response.success) {
      console.warn('Failed to fetch agent profile:', response.error)
    }
  } catch (error) {
    console.error('Error fetching agent profile:', error)
  }
}

function ensureMemberSinceFallback() {
  if (!memberSince.value) {
    memberSince.value = 'Not available'
  }
}
</script>

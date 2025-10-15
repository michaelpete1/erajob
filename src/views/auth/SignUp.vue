onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem('signupBasicData') || '{}')
    if (saved) {
      form.firstName = saved.firstName || form.firstName
      form.lastName = saved.lastName || form.lastName
      form.email = saved.email || form.email
      form.phone = saved.phone || form.phone
      form.password = saved.password || form.password
      form.role = saved.role || form.role
    }
  } catch {}
})

watch(form, (val) => {
  try {
    localStorage.setItem('signupBasicData', JSON.stringify({
      firstName: val.firstName,
      lastName: val.lastName,
      email: val.email,
      phone: val.phone,
      password: val.password,
      role: val.role
    }))
  } catch {}
}, { deep: true })
 <template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 flex items-center justify-center overflow-hidden py-12">
    <!-- Background elements -->
    <div class="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
    <div class="absolute top-0 left-0 w-64 h-64 bg-teal-400/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
    <div class="absolute bottom-0 right-0 w-64 h-64 bg-teal-300/30 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-4000"></div>

    <div class="relative z-50 w-full max-w-md mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <!-- Navigation Header -->
      <div class="absolute top-4 left-4 right-4 z-20 flex justify-between items-center animate-fade-up">
        <router-link to="/sign-in" class="text-white/80 hover:text-white transition-colors text-sm font-medium">
          Sign In
        </router-link>
      </div>
      
      <div class="flex flex-col items-center justify-center text-center py-12">
        <BrandLogo size="lg" class="mb-8 [filter:brightness(0)_invert(1)] animate-bounce-in" />
        <h2 class="mb-6 sm:mb-8 text-2xl sm:text-3xl font-extrabold text-white animate-fade-up-delay-1">Create Your Account</h2>
      
        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-white text-sm animate-fade-in w-full">
          {{ error }}
        </div>
      
        <form @submit.prevent="onSubmit" class="space-y-4 w-full animate-fade-up-delay-2">
          <!-- Role Selector -->
          <div class="pt-2">
            <label class="block text-sm font-medium text-white/80 mb-2 animate-fade-in">I am a:</label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="form.role = 'client'"
                :class="[
                  'py-2 px-3 rounded-full border-2 transition-all duration-300 text-sm font-medium',
                  form.role === 'client'
                    ? 'bg-white text-brand-teal border-white shadow-lg'
                    : 'bg-transparent text-white/80 border-white/30 hover:border-white/60 hover:bg-white/10'
                ]"
              >
                Client
              </button>
              <button
                type="button"
                @click="form.role = 'agent'"
                :class="[
                  'py-2 px-3 rounded-full border-2 transition-all duration-300 text-sm font-medium',
                  form.role === 'agent'
                    ? 'bg-white text-brand-teal border-white shadow-lg'
                    : 'bg-transparent text-white/80 border-white/30 hover:border-white/60 hover:bg-white/10'
                ]"
              >
                Agent
              </button>
            </div>
            <p v-if="fieldErrors.role" class="mt-1 text-xs text-red-200">{{ fieldErrors.role }}</p>
          </div>

          <!-- Name Fields -->
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="relative w-full animate-slide-in-left">
              <input
                v-model="form.firstName"
                type="text"
                placeholder="First Name"
                required
                class="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                :class="{ 'border-red-500': fieldErrors.firstName }"
              />
              <p v-if="fieldErrors.firstName" class="mt-1 text-xs text-red-200 text-left pl-2">{{ fieldErrors.firstName }}</p>
            </div>
            <div class="relative w-full animate-slide-in-right">
              <input
                v-model="form.lastName"
                type="text"
                placeholder="Last Name"
                required
                class="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                :class="{ 'border-red-500': fieldErrors.lastName }"
              />
              <p v-if="fieldErrors.lastName" class="mt-1 text-xs text-red-200 text-left pl-2">{{ fieldErrors.lastName }}</p>
            </div>
          </div>

          <!-- Email Field -->
          <div class="relative animate-slide-in-right">
            <input
              v-model="form.email"
              type="email"
              placeholder="Email"
              required
              class="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              :class="{ 'border-red-500': fieldErrors.email }"
            />
            <p v-if="fieldErrors.email" class="mt-1 text-xs text-red-200">{{ fieldErrors.email }}</p>
          </div>

          <!-- Phone Field (optional) -->
          <div class="relative animate-slide-in-left">
            <input
              v-model="form.phone"
              type="tel"
              placeholder="Phone Number (optional)"
              class="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>

          <!-- Password Field -->
          <div class="relative animate-slide-in-left">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              required
              minlength="8"
              class="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 pr-12"
              :class="{ 'border-red-500': fieldErrors.password }"
            />
            <p v-if="fieldErrors.password" class="mt-1 text-xs text-red-200">{{ fieldErrors.password }}</p>
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
            >
              <!-- Eye icons -->
              <svg v-if="!showPassword" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
            </button>
          </div>





          <div class="pt-4">
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full bg-white text-brand-teal hover:bg-gray-100 font-medium py-3 px-4 rounded-full transition-colors duration-300 flex items-center justify-center"
                :class="{ 'opacity-70 cursor-not-allowed': isLoading }"
              >
                <span v-if="isLoading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-brand-teal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing...
                </span>
                <span v-else>Next</span>
              </button>
          </div>
        </form>

        <p class="mt-6 text-sm sm:text-base text-white/80 animate-fade-up-delay-4">
          Already have an account? 
          <router-link to="/sign-in" class="font-semibold text-white hover:text-teal-100 underline transition-colors">Sign in</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import BrandLogo from '../../components/BrandLogo.vue'
import type { SignupData } from '../../types/api/auth'

const router = useRouter()

// Form state
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  role: 'client' as 'client' | 'agent',
})

// UI state
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')
const fieldErrors = reactive<Record<string, string>>({})

// Basic validation
const validateForm = (): boolean => {
  // Clear previous errors
  Object.keys(fieldErrors).forEach(key => delete fieldErrors[key as keyof typeof fieldErrors]);
  let isValid = true

  if (!form.firstName.trim()) {
    fieldErrors.firstName = 'First name is required'
    isValid = false
  }
  if (!form.lastName.trim()) {
    fieldErrors.lastName = 'Last name is required'
    isValid = false
  }
  if (!form.email) {
    fieldErrors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    fieldErrors.email = 'Please enter a valid email address'
    isValid = false
  }
  if (!form.password) {
    fieldErrors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 8) {
    fieldErrors.password = 'Password must be at least 8 characters'
    isValid = false
  }
  return isValid
}

// Form submission - only store basic data and route to welcome forms
const onSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true
  error.value = ''

  try {
    // Persist basic data for subsequent welcome forms
    const basicData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      password: form.password,
      role: form.role
    }
    localStorage.setItem('signupBasicData', JSON.stringify(basicData))

    // Navigate to role-specific welcome form
    if (form.role === 'agent') {
      router.push('/agent/welcome')
    } else {
      router.push('/client/welcome')
    }
  } catch (err: any) {
    error.value = err?.response?.data?.detail || err.message || 'An unexpected error occurred.'
    console.error('Signup error:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Add any custom styles here */
.animate-bounce-in {
  animation: bounceIn 0.6s;
}

.animate-fade-up-delay-1 {
  animation: fadeInUp 0.5s ease-out 0.1s both;
}

.animate-fade-up-delay-2 {
  animation: fadeInUp 0.5s ease-out 0.2s both;
}

.animate-slide-in-left {
  animation: slideInLeft 0.5s ease-out;
}

.animate-slide-in-right {
  animation: slideInRight 0.5s ease-out;
}

@keyframes bounceIn {
  from, 20%, 40%, 60%, 80%, to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }
  40% {
    transform: scale3d(0.9, 0.9, 0.9);
  }
  60% {
    opacity: 1;
    transform: scale3d(1.03, 1.03, 1.03);
  }
  80% {
    transform: scale3d(0.97, 0.97, 0.97);
  }
  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
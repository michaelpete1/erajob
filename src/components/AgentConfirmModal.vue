<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="close">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">Confirm Agent Details</h3>
          <button @click="close" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="onConfirm" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
              <input v-model.trim="form.full_name" type="text" class="w-full rounded-lg border px-3 py-2" />
              <p v-if="errors.full_name" class="text-xs text-red-600 mt-1">{{ errors.full_name }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input v-model.trim="form.email" type="email" class="w-full rounded-lg border px-3 py-2" />
              <p v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input v-model.trim="form.phone_number" type="text" class="w-full rounded-lg border px-3 py-2" />
              <p v-if="errors.phone_number" class="text-xs text-red-600 mt-1">{{ errors.phone_number }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Primary expertise *</label>
              <input v-model.trim="form.primary_area_of_expertise" type="text" class="w-full rounded-lg border px-3 py-2" />
              <p v-if="errors.primary_area_of_expertise" class="text-xs text-red-600 mt-1">{{ errors.primary_area_of_expertise }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Years of experience *</label>
              <input v-model.number="form.years_of_experience" type="number" min="0" class="w-full rounded-lg border px-3 py-2" />
              <p v-if="errors.years_of_experience" class="text-xs text-red-600 mt-1">{{ errors.years_of_experience }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Hours per week *</label>
              <select v-model.number="form.available_hours_agent_can_commit" class="w-full rounded-lg border px-3 py-2">
                <option :value="160">160</option>
                <option :value="80">80</option>
                <option :value="40">40</option>
                <option :value="20">20</option>
              </select>
              <p v-if="errors.available_hours_agent_can_commit" class="text-xs text-red-600 mt-1">{{ errors.available_hours_agent_can_commit }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Timezone *</label>
              <input v-model.trim="form.time_zone" type="text" class="w-full rounded-lg border px-3 py-2" />
              <p v-if="errors.time_zone" class="text-xs text-red-600 mt-1">{{ errors.time_zone }}</p>
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Tools / Platforms (comma separated) *</label>
              <input v-model.trim="tools" type="text" class="w-full rounded-lg border px-3 py-2" placeholder="e.g. Slack,Notion,GitHub" />
              <p v-if="errors.three_most_commonly_used_tools_or_platforms" class="text-xs text-red-600 mt-1">{{ errors.three_most_commonly_used_tools_or_platforms }}</p>
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Portfolio link</label>
              <input v-model.trim="form.portfolio_link" type="text" class="w-full rounded-lg border px-3 py-2" />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Certificate URLs (comma separated)</label>
              <input v-model.trim="certs" type="text" class="w-full rounded-lg border px-3 py-2" placeholder="https://... , https://..." />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Open to calls?</label>
              <select v-model="form.is_agent_open_to_calls_and_video_meetings" class="w-full rounded-lg border px-3 py-2">
                <option :value="true">Yes</option>
                <option :value="false">No</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Has working computer?</label>
              <select v-model="form.does_agent_have_working_computer" class="w-full rounded-lg border px-3 py-2">
                <option :value="true">Yes</option>
                <option :value="false">No</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Stable internet?</label>
              <select v-model="form.does_agent_have_stable_internet" class="w-full rounded-lg border px-3 py-2">
                <option :value="true">Yes</option>
                <option :value="false">No</option>
              </select>
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
              <input v-model.trim="form.video_url" type="text" class="w-full rounded-lg border px-3 py-2" />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Personality URL</label>
              <input v-model.trim="form.personality_url" type="text" class="w-full rounded-lg border px-3 py-2" />
            </div>

          </div>

          <div class="flex items-center justify-end gap-3 pt-4">
            <button type="button" @click="close" class="px-4 py-2 rounded-md bg-gray-200 text-gray-800">Cancel</button>
            <button type="submit" :disabled="submitting || !isValid" class="px-4 py-2 rounded-md bg-teal-600 text-white disabled:opacity-50">{{ submitting ? 'Saving...' : 'Confirm & Approve' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { AgentOut } from '@/types/api'

const props = defineProps<{ isOpen: boolean; agent: Partial<AgentOut> | null }>()
const emit = defineEmits<{ close: []; confirm: [agent: Record<string, any>] }>()

const isOpen = computed(() => props.isOpen)
const initial = ref<Partial<AgentOut>>(props.agent || {})

watch(() => props.agent, () => {
  initial.value = props.agent || {}
  resetForm()
})

const form = ref<any>({
  id: '',
  full_name: '',
  email: '',
  phone_number: '',
  certificate_url: [],
  video_url: '',
  personality_url: '',
  primary_area_of_expertise: '',
  years_of_experience: 0,
  three_most_commonly_used_tools_or_platforms: [],
  available_hours_agent_can_commit: 40,
  time_zone: 'UTC+00:00',
  portfolio_link: '',
  is_agent_open_to_calls_and_video_meetings: true,
  does_agent_have_working_computer: true,
  does_agent_have_stable_internet: true,
  is_agent_comfortable_with_time_tracking_tools: true
})

const tools = ref('')
const certs = ref('')
const submitting = ref(false)

const errors = ref<Record<string, string>>({})

const resetForm = () => {
  const a = initial.value || {}
  const aa = a as any
  form.value = {
    id: String(aa.id || aa._id || aa.uuid || ''),
    full_name: aa.full_name || aa.name || '',
    email: aa.email || aa.user_email || '',
    phone_number: aa.phone_number || aa.contact_phone || '',
    certificate_url: Array.isArray(aa.certificate_url) ? aa.certificate_url : (aa.certificates ? [].concat(aa.certificates) : []),
    video_url: aa.video_url || aa.video || '',
    personality_url: aa.personality_url || '',
    primary_area_of_expertise: aa.primary_area_of_expertise || aa.expertise || '',
    years_of_experience: Number(aa.years_of_experience ?? aa.experience_years ?? 0),
    three_most_commonly_used_tools_or_platforms: Array.isArray(aa.three_most_commonly_used_tools_or_platforms) ? aa.three_most_commonly_used_tools_or_platforms : (Array.isArray(aa.tools) ? aa.tools.slice(0,3) : []),
    available_hours_agent_can_commit: Number(aa.available_hours_agent_can_commit ?? aa.availability_hours ?? 40),
    time_zone: aa.time_zone || 'UTC+00:00',
    portfolio_link: aa.portfolio_link || aa.portfolio || '',
    is_agent_open_to_calls_and_video_meetings: Boolean(aa.is_agent_open_to_calls_and_video_meetings ?? true),
    does_agent_have_working_computer: Boolean(aa.does_agent_have_working_computer ?? true),
    does_agent_have_stable_internet: Boolean(aa.does_agent_have_stable_internet ?? true),
    is_agent_comfortable_with_time_tracking_tools: Boolean(aa.is_agent_comfortable_with_time_tracking_tools ?? true)
  }
  tools.value = (form.value.three_most_commonly_used_tools_or_platforms || []).join(',')
  certs.value = (form.value.certificate_url || []).join(',')
  errors.value = {}
}

resetForm()

const validate = () => {
  const e: Record<string,string> = {}
  if (!form.value.full_name) e.full_name = 'Full name is required'
  if (!form.value.email) e.email = 'Email is required'
  if (!form.value.phone_number) e.phone_number = 'Phone number is required'
  if (!form.value.primary_area_of_expertise) e.primary_area_of_expertise = 'Primary expertise is required'
  if (!Number.isFinite(form.value.years_of_experience) || form.value.years_of_experience < 0) e.years_of_experience = 'Years of experience is required'
  if (!Array.isArray(form.value.three_most_commonly_used_tools_or_platforms) || form.value.three_most_commonly_used_tools_or_platforms.length === 0) e.three_most_commonly_used_tools_or_platforms = 'At least one tool is required'
  if (!form.value.available_hours_agent_can_commit) e.available_hours_agent_can_commit = 'Hours commitment is required'
  if (!form.value.time_zone) e.time_zone = 'Timezone is required'
  errors.value = e
  return Object.keys(e).length === 0
}

const isValid = computed(() => validate())

const close = () => {
  emit('close')
}

const onConfirm = async () => {
  if (!validate()) return
  submitting.value = true
  try {
    // normalize tools / certs
    form.value.three_most_commonly_used_tools_or_platforms = tools.value.split(',').map(s => s.trim()).filter(Boolean)
    form.value.certificate_url = certs.value.split(',').map(s => s.trim()).filter(Boolean)
    emit('confirm', { ...form.value })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* minimal styling; rely on Tailwind in project */
</style>

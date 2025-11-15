<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-800">Agent Memo</h1>
        <div class="text-sm text-gray-600">Admin</div>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm text-gray-700 mb-1">Agent ID</label>
            <input :value="agentId" readonly class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50" />
          </div>
          <div>
            <label class="block text-sm text-gray-700 mb-1">Subject</label>
            <input v-model="subject" placeholder="Memo subject" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm text-gray-700 mb-1">Message</label>
            <textarea v-model="message" rows="6" placeholder="Write your memo to the agent" class="w-full border border-gray-300 rounded-lg px-3 py-2"></textarea>
          </div>
          <div class="flex items-center justify-end gap-2">
            <button @click="cancel" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700">Cancel</button>
            <button :disabled="submitting || !canSubmit" @click="submitMemo" class="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50">Send Memo</button>
          </div>
          <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
          <p v-if="successMessage" class="text-sm text-green-600">{{ successMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const agentId = computed(() => String(route.params.agentId || route.query.agentId || ''))

const subject = ref('')
const message = ref('')
const submitting = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const canSubmit = computed(() => {
  return !!agentId.value && subject.value.trim().length > 0 && message.value.trim().length > 0
})

const submitMemo = async () => {
  if (submitting.value) return
  error.value = null
  successMessage.value = null
  if (!canSubmit.value) {
    error.value = 'Please enter subject and message'
    return
  }
  submitting.value = true
  try {
    const { alertsService } = await import('@/services/notificationsService')
    alertsService.createLocalAlert({
      alert_title: 'Memo Sent To Agent',
      alert_description: `A memo was sent to agent ${agentId.value}: ${subject.value}`,
      alert_type: 'info',
      alert_primary_action: 'Agent',
      alert_secondary_action: 'Client',
      priority: 'medium',
      alert_target_user_id: 'admin',
      agent_id: agentId.value
    } as any)
    alertsService.createLocalAlert({
      alert_title: 'New Memo From Admin',
      alert_description: subject.value,
      alert_type: 'info',
      alert_primary_action: 'View Details',
      alert_secondary_action: 'Acknowledge',
      priority: 'medium',
      alert_target_user_id: agentId.value
    } as any)
    successMessage.value = 'Memo sent successfully'
    setTimeout(() => {
      router.push('/admin/notifications')
    }, 800)
  } catch (e: any) {
    error.value = e?.message || 'Failed to send memo'
  } finally {
    submitting.value = false
  }
}

const cancel = () => {
  router.back()
}
</script>

<style scoped>
</style>
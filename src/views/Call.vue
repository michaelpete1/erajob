<template>
  <div class="min-h-screen bg-gray-900 flex flex-col">
    <!-- Call Header -->
    <header class="bg-black/50 backdrop-blur-sm text-white px-4 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button @click="endCall" aria-label="End call" class="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div class="flex items-center gap-3">
          <div class="relative">
            <img 
              :src="currentConversation?.avatar" 
              :alt="currentConversation?.name"
              class="w-10 h-10 rounded-full object-cover"
            >
            <div 
              v-if="currentConversation?.online" 
              class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black"
            ></div>
          </div>
          <div>
            <h1 class="text-lg font-semibold">{{ currentConversation?.name }}</h1>
            <p class="text-xs text-white/70">
              <span v-if="callStatus === 'connecting'">Connecting...</span>
              <span v-else-if="callStatus === 'active'">{{ callDuration }}</span>
              <span v-else-if="callStatus === 'ended'">Call ended</span>
            </p>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-white/70 bg-white/10 px-2 py-1 rounded-full">
          {{ callType === 'video' ? 'Video Call' : 'Voice Call' }}
        </span>
      </div>
    </header>

    <!-- Main Call Area -->
    <div class="flex-1 flex items-center justify-center relative">
      <!-- Remote Video (for video calls) -->
      <div v-if="callType === 'video'" class="absolute inset-0 bg-black">
        <div class="w-full h-full flex items-center justify-center">
          <img 
            :src="currentConversation?.avatar" 
            :alt="currentConversation?.name"
            class="w-32 h-32 rounded-full object-cover opacity-50"
          >
        </div>
        
        <!-- Remote user info overlay -->
        <div class="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
          <p class="text-white font-medium">{{ currentConversation?.name }}</p>
          <p class="text-white/70 text-sm">{{ currentConversation?.role }}</p>
        </div>
      </div>

      <!-- Local Video (for video calls) -->
      <div v-if="callType === 'video'" class="absolute bottom-4 right-4 w-32 h-48 bg-gray-800 rounded-lg overflow-hidden shadow-2xl border-2 border-white/20">
        <div class="w-full h-full flex items-center justify-center bg-gray-900">
          <div class="text-center">
            <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
              <span class="text-white font-medium text-sm">ME</span>
            </div>
            <p class="text-white/70 text-xs">You</p>
          </div>
        </div>
      </div>

      <!-- Voice Call UI -->
      <div v-if="callType === 'audio'" class="text-center">
        <div class="relative mb-8">
          <img 
            :src="currentConversation?.avatar" 
            :alt="currentConversation?.name"
            class="w-32 h-32 rounded-full object-cover mx-auto mb-4"
          >
          <div 
            v-if="currentConversation?.online" 
            class="absolute bottom-4 right-1/2 transform translate-x-16 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-900"
          ></div>
          
          <!-- Animated sound waves for active call -->
          <div v-if="callStatus === 'active'" class="flex justify-center items-center gap-1 mt-6">
            <div 
              v-for="i in 5" 
              :key="i"
              class="w-1 bg-brand-teal rounded-full animate-pulse"
              :style="{
                height: `${20 + Math.random() * 40}px`,
                animationDelay: `${i * 0.1}s`
              }"
            ></div>
          </div>
        </div>
        
        <h2 class="text-2xl font-bold text-white mb-2">{{ currentConversation?.name }}</h2>
        <p class="text-white/70 mb-4">{{ currentConversation?.role }}</p>
        <p class="text-white/50 text-lg">{{ callDuration }}</p>
      </div>

      <!-- Call Status Overlay -->
      <div v-if="callStatus === 'connecting'" class="absolute inset-0 bg-black/70 flex items-center justify-center">
        <div class="text-center">
          <div class="w-16 h-16 bg-brand-teal/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg class="w-8 h-8 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <p class="text-white text-lg font-medium">Calling {{ currentConversation?.name }}...</p>
          <p class="text-white/70 text-sm mt-1">{{ callType === 'video' ? 'Video' : 'Voice' }} call</p>
        </div>
      </div>

      <!-- Call Ended Overlay -->
      <div v-if="callStatus === 'ended'" class="absolute inset-0 bg-black/80 flex items-center justify-center">
        <div class="text-center">
          <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p class="text-white text-lg font-medium">Call Ended</p>
          <p class="text-white/70 text-sm mt-1">Duration: {{ callDuration }}</p>
          <button 
            @click="goBack"
            class="mt-4 bg-brand-teal text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-teal/90 transition-colors"
          >
            Back to Chat
          </button>
        </div>
      </div>
    </div>

    <!-- Call Controls -->
    <div v-if="callStatus !== 'ended'" class="bg-black/50 backdrop-blur-sm px-4 py-6">
      <div class="flex items-center justify-center gap-4">
        <!-- Mute Button -->
        <button 
          @click="toggleMute"
          :class="[
            'p-4 rounded-full transition-all',
            isMuted 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-white/20 text-white hover:bg-white/30'
          ]"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path 
              v-if="!isMuted"
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
            />
            <path 
              v-else
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" 
            />
            <path 
              v-if="isMuted"
              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" 
            />
          </svg>
        </button>

        <!-- Video Toggle (only for video calls) -->
        <button 
          v-if="callType === 'video'"
          @click="toggleVideo"
          :class="[
            'p-4 rounded-full transition-all',
            isVideoOff 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-white/20 text-white hover:bg-white/30'
          ]"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path 
              v-if="!isVideoOff"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
            />
            <path 
              v-else
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" 
            />
            <path 
              v-if="isVideoOff"
              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" 
            />
          </svg>
        </button>

        <!-- End Call Button -->
        <button 
          @click="endCall"
          class="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all transform hover:scale-105"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Speaker Toggle -->
        <button 
          @click="toggleSpeaker"
          :class="[
            'p-4 rounded-full transition-all',
            isSpeakerOn 
              ? 'bg-brand-teal text-white hover:bg-brand-teal/90' 
              : 'bg-white/20 text-white hover:bg-white/30'
          ]"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path 
              v-if="isSpeakerOn"
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" 
            />
            <path 
              v-else
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" 
            />
          </svg>
        </button>

        <!-- More Options -->
        <button class="p-4 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const conversationId = computed(() => route.params.id as string)
const callType = computed(() => route.query.type as 'audio' | 'video' || 'audio')

// Mock conversation data
const conversations = ref([
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://picsum.photos/seed/sarah/100/100.jpg',
    role: 'Web Developer',
    lastMessage: "Hi! I'm interested in your project. Can we discuss the details?",
    time: '2m ago',
    unreadCount: 2,
    online: true
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar: 'https://picsum.photos/seed/mike/100/100.jpg',
    role: 'UI/UX Designer',
    lastMessage: 'Thanks for the feedback! I\'ll make those changes right away.',
    time: '1h ago',
    unreadCount: 0,
    online: false
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    avatar: 'https://picsum.photos/seed/emily/100/100.jpg',
    role: 'Mobile Developer',
    lastMessage: 'The app is ready for testing. When would you like to review it?',
    time: '3h ago',
    unreadCount: 1,
    online: true
  },
  {
    id: '4',
    name: 'David Kim',
    avatar: 'https://picsum.photos/seed/david/100/100.jpg',
    role: 'Backend Developer',
    lastMessage: 'API integration is complete. Let me know if you need any adjustments.',
    time: 'Yesterday',
    unreadCount: 0,
    online: false
  }
])

const currentConversation = computed(() => {
  return conversations.value.find(c => c.id === conversationId.value)
})

// Call state
const callStatus = ref<'connecting' | 'active' | 'ended'>('connecting')
const callDuration = ref('00:00')
const callStartTime = ref<Date | null>(null)
const isMuted = ref(false)
const isVideoOff = ref(false)
const isSpeakerOn = ref(true)

let callTimer: number | null = null

const updateCallDuration = () => {
  if (callStartTime.value) {
    const now = new Date()
    const diff = Math.floor((now.getTime() - callStartTime.value.getTime()) / 1000)
    const minutes = Math.floor(diff / 60)
    const seconds = diff % 60
    callDuration.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
}

const startCall = () => {
  callStatus.value = 'connecting'
  
  // Simulate connection delay
  setTimeout(() => {
    callStatus.value = 'active'
    callStartTime.value = new Date()
    
    // Start call timer
    callTimer = setInterval(updateCallDuration, 1000)
  }, 2000)
}

const endCall = () => {
  callStatus.value = 'ended'
  
  if (callTimer) {
    clearInterval(callTimer)
    callTimer = null
  }
  
  // Auto-redirect after 3 seconds
  setTimeout(() => {
    goBack()
  }, 3000)
}

const goBack = () => {
  router.push(`/chat/${conversationId.value}`)
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
}

const toggleVideo = () => {
  isVideoOff.value = !isVideoOff.value
}

const toggleSpeaker = () => {
  isSpeakerOn.value = !isSpeakerOn.value
}

onMounted(() => {
  startCall()
})

onUnmounted(() => {
  if (callTimer) {
    clearInterval(callTimer)
  }
})
</script>

<style scoped>
/* Custom animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Sound wave animation */
@keyframes soundWave {
  0%, 100% {
    height: 20px;
  }
  50% {
    height: 60px;
  }
}

.animate-sound-wave {
  animation: soundWave 1s ease-in-out infinite;
}
</style>

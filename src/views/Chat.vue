<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Chat Header -->
    <header class="bg-brand-teal text-white px-4 py-4 flex items-center justify-between sticky top-0 z-10">
      <div class="flex items-center gap-3">
        <button @click="$router.back()" aria-label="Back" class="p-1 text-white/95 hover:text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
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
              class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"
            ></div>
          </div>
          <div>
            <h1 class="text-lg font-semibold">{{ currentConversation?.name }}</h1>
            <p class="text-xs text-white/80">{{ currentConversation?.role }}</p>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button @click="startCall" class="p-2 text-white/95 hover:text-white hover:bg-white/20 rounded-full transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>
        <button @click="startVideoCall" class="p-2 text-white/95 hover:text-white hover:bg-white/20 rounded-full transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Messages Container -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4" ref="messagesContainer">
      <!-- Date Separator -->
      <div class="flex items-center justify-center my-4">
        <div class="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
          Today
        </div>
      </div>

      <!-- Messages -->
      <div 
        v-for="message in messages" 
        :key="message.id"
        :class="[
          'flex gap-3 max-w-[80%]',
          message.sender === 'me' ? 'ml-auto' : 'mr-auto'
        ]"
      >
        <div 
          v-if="message.sender !== 'me'"
          class="w-8 h-8 rounded-full object-cover flex-shrink-0"
        >
          <img 
            :src="currentConversation?.avatar" 
            :alt="currentConversation?.name"
            class="w-full h-full rounded-full object-cover"
          >
        </div>
        
        <div 
          :class="[
            'rounded-2xl px-4 py-2',
            message.sender === 'me' 
              ? 'bg-brand-teal text-white rounded-br-sm' 
              : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
          ]"
        >
          <p class="text-sm">{{ message.text }}</p>
          <p 
            :class="[
              'text-xs mt-1',
              message.sender === 'me' ? 'text-white/70' : 'text-gray-500'
            ]"
          >
            {{ message.time }}
          </p>
        </div>
        
        <div 
          v-if="message.sender === 'me'"
          class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0"
        >
          <span class="text-xs font-medium text-gray-600">ME</span>
        </div>
      </div>

      <!-- Typing Indicator -->
      <div v-if="isTyping" class="flex items-center gap-2">
        <img 
          :src="currentConversation?.avatar" 
          :alt="currentConversation?.name"
          class="w-8 h-8 rounded-full object-cover"
        >
        <div class="bg-white rounded-2xl px-4 py-2 shadow-sm">
          <div class="flex gap-1">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message Input -->
    <div class="bg-white border-t border-gray-200 p-4 sticky bottom-0">
      <div class="flex items-end gap-3">
        <button class="p-2 text-gray-500 hover:text-gray-700 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>
        
        <div class="flex-1 relative">
          <textarea 
            v-model="newMessage"
            @keydown.enter.prevent="sendMessage"
            @input="handleTyping"
            placeholder="Type a message..."
            class="w-full px-4 py-2 bg-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-teal focus:bg-white transition-all"
            rows="1"
            style="min-height: 44px; max-height: 120px;"
          ></textarea>
        </div>
        
        <button 
          @click="sendMessage"
          :disabled="!newMessage.trim()"
          class="p-2 bg-brand-teal text-white rounded-full hover:bg-brand-teal/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const messagesContainer = ref<HTMLElement | null>(null)

const conversationId = computed(() => route.params.id as string)

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

// Mock messages data
const messages = ref([
  {
    id: '1',
    text: "Hi! I'm interested in your project. Can we discuss the details?",
    sender: 'other',
    time: '10:30 AM'
  },
  {
    id: '2',
    text: "Hello Sarah! I'd be happy to discuss the project with you. What aspects are you most interested in?",
    sender: 'me',
    time: '10:32 AM'
  },
  {
    id: '3',
    text: "I'm particularly interested in the frontend development part. I have experience with React and Vue.js.",
    sender: 'other',
    time: '10:35 AM'
  },
  {
    id: '4',
    text: "That's great! The project is built with Vue.js, so your experience would be perfect. Let me share more details about the requirements.",
    sender: 'me',
    time: '10:36 AM'
  }
])

const newMessage = ref('')
const isTyping = ref(false)
let typingTimeout: number | null = null

const sendMessage = () => {
  if (!newMessage.value.trim()) return
  
  const message = {
    id: Date.now().toString(),
    text: newMessage.value,
    sender: 'me',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  messages.value.push(message)
  newMessage.value = ''
  
  // Auto-scroll to bottom
  nextTick(() => {
    scrollToBottom()
  })
  
  // Simulate response
  setTimeout(() => {
    simulateResponse()
  }, 1000 + Math.random() * 2000)
}

const simulateResponse = () => {
  const responses = [
    "That sounds good to me!",
    "I understand. Let me think about that.",
    "Great! I can work with that.",
    "Thanks for the information.",
    "I have some questions about that.",
    "Perfect! When can we start?",
    "I agree with your approach."
  ]
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)]
  
  isTyping.value = true
  
  setTimeout(() => {
    isTyping.value = false
    
    const message = {
      id: Date.now().toString(),
      text: randomResponse,
      sender: 'other',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    messages.value.push(message)
    
    // Auto-scroll to bottom
    nextTick(() => {
      scrollToBottom()
    })
  }, 1500 + Math.random() * 1500)
}

const handleTyping = () => {
  // Clear existing timeout
  if (typingTimeout) {
    clearTimeout(typingTimeout)
  }
  
  // Set new timeout
  typingTimeout = setTimeout(() => {
    // Typing stopped
  }, 1000)
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const startCall = () => {
  router.push(`/call/${conversationId.value}?type=audio`)
}

const startVideoCall = () => {
  router.push(`/call/${conversationId.value}?type=video`)
}

// Auto-scroll to bottom when messages change
watch(messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })

onMounted(() => {
  // Load messages from localStorage or API
  const savedMessages = localStorage.getItem(`messages_${conversationId.value}`)
  if (savedMessages) {
    messages.value = JSON.parse(savedMessages)
  }
  
  // Auto-scroll to bottom
  nextTick(() => {
    scrollToBottom()
  })
})
</script>

<style scoped>
/* Custom scrollbar for messages container */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Auto-resize textarea */
textarea {
  transition: all 0.2s ease;
}

textarea:focus {
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
}
</style>

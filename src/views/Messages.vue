<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-brand-teal text-white px-4 py-4 flex items-center justify-between sticky top-0 z-10">
      <div class="flex items-center gap-3">
        <button @click="$router.back()" aria-label="Back" class="p-1 text-white/95 hover:text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-lg font-semibold">Messages</h1>
      </div>
      <button @click="startNewConversation" class="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors">
        <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New
      </button>
    </header>
    
    <main class="p-4 pb-24">
      <!-- Search Bar -->
      <div class="mb-4">
        <div class="relative">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search conversations..." 
            class="w-full px-4 py-2 pl-10 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
          >
          <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Conversation List -->
      <div class="space-y-2">
        <div 
          v-for="conversation in filteredConversations" 
          :key="conversation.id"
          @click="openConversation(conversation)"
          class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
        >
          <div class="flex items-start gap-3">
            <div class="relative">
              <img 
                :src="conversation.avatar" 
                :alt="conversation.name"
                class="w-12 h-12 rounded-full object-cover"
              >
              <div 
                v-if="conversation.online" 
                class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
              ></div>
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <h3 class="font-semibold text-gray-900 truncate">{{ conversation.name }}</h3>
                <span class="text-xs text-gray-500">{{ conversation.time }}</span>
              </div>
              
              <p class="text-sm text-gray-600 truncate">{{ conversation.lastMessage }}</p>
              
              <div class="flex items-center justify-between mt-2">
                <span class="text-xs text-gray-500">{{ conversation.role }}</span>
                <div 
                  v-if="conversation.unreadCount > 0" 
                  class="bg-brand-teal text-white text-xs font-medium px-2 py-0.5 rounded-full"
                >
                  {{ conversation.unreadCount }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredConversations.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
        <p class="text-gray-500 mb-4">Start a conversation with an agent or client</p>
        <button @click="startNewConversation" class="bg-brand-teal text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-teal/90 transition-colors">
          Start Conversation
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

// Mock conversation data
const conversations = ref([
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://picsum.photos/seed/sarah/100/100.jpg',
    role: 'Web Developer',
    lastMessage: 'Hi! I\'m interested in your project. Can we discuss the details?',
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

const filteredConversations = computed(() => {
  if (!searchQuery.value) return conversations.value
  
  return conversations.value.filter(conversation => 
    conversation.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    conversation.role.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const openConversation = (conversation: any) => {
  // Navigate to chat page with conversation ID
  router.push(`/chat/${conversation.id}`)
}

const startNewConversation = () => {
  // Navigate to new conversation page or open modal
  alert('New conversation feature coming soon!')
}

onMounted(() => {
  // Load conversations from localStorage or API
  const savedConversations = localStorage.getItem('conversations')
  if (savedConversations) {
    conversations.value = JSON.parse(savedConversations)
  }
})
</script>

<style scoped>
/* Custom scrollbar for conversation list */
main {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

main::-webkit-scrollbar {
  width: 6px;
}

main::-webkit-scrollbar-track {
  background: #f1f5f9;
}

main::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

main::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>

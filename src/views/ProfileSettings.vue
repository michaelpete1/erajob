<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="bg-brand-teal text-white px-4 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button @click="$router.back()" aria-label="Back" class="p-1 text-white/95 hover:text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-lg font-semibold">Profile Settings</h1>
      </div>
    </header>

  <main class="p-4 pb-24">
      <!-- Profile Header Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-4">
            <!-- Profile Picture -->
            <div class="relative">
              <div class="w-20 h-20 rounded-full bg-brand-teal flex items-center justify-center text-white text-2xl font-bold">
                {{ userInitials }}
              </div>
              <button 
                @click="handleEditProfilePicture"
                class="absolute bottom-0 right-0 w-7 h-7 bg-brand-teal text-white rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors border-2 border-white"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            
            <!-- User Info -->
            <div>
              <h2 class="text-xl font-semibold text-gray-900">{{ userName }}</h2>
              <p class="text-sm text-gray-500 mb-2">@{{ userHandle }}</p>
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 7.085l6.572-.955L10 0l2.939 6.13 6.572.955-4.756 4.46 1.123 6.545L10 15z" />
                  </svg>
                  <span class="text-sm font-medium text-gray-700">{{ userRating }}</span>
                </div>
                <span class="text-sm text-green-600 font-semibold">{{ completionRate }}%</span>
              </div>
              <div class="flex items-center gap-1 mt-1 text-gray-600">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 20a10 10 0 110-20 10 10 0 010 20zm0-18a8 8 0 100 16 8 8 0 000-16z" />
                </svg>
                <span class="text-sm">{{ userLocation }}</span>
              </div>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-2">
            <button 
              @click="handleSaveProfile"
              class="bg-brand-teal text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-teal-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <!-- Profile Navigation Tabs -->
      <nav class="flex border-b border-gray-200 mb-6 bg-white rounded-t-lg">
        <button 
          v-for="tab in profileTabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex-1 text-center py-3 font-medium text-sm transition-colors',
            activeTab === tab.id 
              ? 'text-brand-teal border-b-2 border-brand-teal' 
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>

      <!-- Tab Content -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <!-- About Tab -->
        <div v-if="activeTab === 'about'" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
            <input 
              v-model="profileData.title"
              type="text" 
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              placeholder="e.g., Top 2% UI/UX Designer"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea 
              v-model="profileData.bio"
              rows="4"
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent resize-none"
              placeholder="Tell clients about yourself, your experience, and what you do..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Skills & Services</label>
            <div class="space-y-2">
              <div v-for="(_, index) in profileData.skills" :key="index" class="flex items-center gap-2">
                <input 
                  v-model="profileData.skills[index]"
                  type="text" 
                  class="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                  placeholder="Enter a skill or service"
                />
                <button 
                  @click="removeSkill(index)"
                  class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <button 
                @click="addSkill"
                class="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-brand-teal hover:text-brand-teal transition-colors"
              >
                + Add Skill
              </button>
            </div>
          </div>
        </div>

        <!-- Portfolio Tab -->
        <div v-if="activeTab === 'portfolio'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">Portfolio Items</h3>
            <button 
              @click="handleAddPortfolio"
              class="bg-brand-teal text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-teal-600 transition-colors"
            >
              Add Portfolio Item
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="(item, index) in portfolioItems" :key="index" class="border border-gray-200 rounded-lg p-4">
              <div class="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                <img 
                  v-if="item.image" 
                  :src="item.image" 
                  alt="Portfolio item"
                  class="w-full h-full object-cover rounded-lg"
                />
                <div v-else class="text-gray-400 text-center">
                  <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="text-sm">No image</p>
                </div>
              </div>
              <input 
                v-model="item.title"
                type="text" 
                class="w-full p-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                placeholder="Portfolio title"
              />
              <input 
                v-model="item.url"
                type="url" 
                class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                placeholder="Project URL"
              />
            </div>
          </div>
        </div>

        <!-- Reviews Tab -->
        <div v-if="activeTab === 'reviews'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">Client Reviews</h3>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500">Average Rating:</span>
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 7.085l6.572-.955L10 0l2.939 6.13 6.572.955-4.756 4.46 1.123 6.545L10 15z" />
                </svg>
                <span class="font-medium">{{ userRating }}</span>
              </div>
            </div>
          </div>
          
          <div class="space-y-4">
            <div v-for="review in reviews" :key="review.id" class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                    {{ review.clientInitials }}
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900">{{ review.clientName }}</h4>
                    <div class="flex items-center gap-1">
                      <div class="flex">
                        <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 7.085l6.572-.955L10 0l2.939 6.13 6.572.955-4.756 4.46 1.123 6.545L10 15z" />
                        </svg>
                      </div>
                      <span class="text-sm text-gray-500">{{ review.date }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p class="text-gray-700">{{ review.comment }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
// This page uses role-based navigation from App.vue

// User data
const userName = ref('Jacob Jones')
const userHandle = ref('jacobdesigns4u')
const userRating = ref('5.0')
const completionRate = ref('100')
const userLocation = ref('Lucienow, India')

// Computed user initials
const userInitials = computed(() => {
  return userName.value
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
})

// Profile tabs
const profileTabs = [
  { id: 'about', label: 'About' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'reviews', label: 'Reviews' }
]

const activeTab = ref('about')

// Profile data
const profileData = ref({
  title: 'Top 2% UI/UX | Website & App Design | Figma',
  bio: 'Hi, I\'m Amanant. With over 6 years of experience in UI/UX design, I\'m passionate about creating intuitive, user-friendly interfaces that are also visually stunning. I use Figma to bring your ideas to life, designing beautiful user interfaces and interactive prototypes that ensure your project is on track and looks amazing.',
  skills: [
    'UI/UX Design',
    'Wireframes & Prototypes',
    'User Research & Testing',
    'Figma Design Systems'
  ]
})

// Portfolio items
const portfolioItems = ref([
  {
    title: 'Mobile App Design',
    image: '',
    url: ''
  }
])

// Reviews data
const reviews = ref([
  {
    id: '1',
    clientName: 'Sarah Johnson',
    clientInitials: 'SJ',
    rating: 5,
    date: '2 days ago',
    comment: 'Excellent work! Very professional and delivered exactly what I needed. Highly recommend!'
  },
  {
    id: '2',
    clientName: 'Mike Turner',
    clientInitials: 'MT',
    rating: 5,
    date: '1 week ago',
    comment: 'Great designer with amazing attention to detail. The project was completed on time and exceeded expectations.'
  }
])

// Methods
const handleEditProfilePicture = () => {
  alert('📷 Profile picture upload feature coming soon!')
}

const handleSaveProfile = () => {
  alert('✅ Profile saved successfully!')
}

const addSkill = () => {
  profileData.value.skills.push('')
}

const removeSkill = (index: number) => {
  profileData.value.skills.splice(index, 1)
}

const handleAddPortfolio = () => {
  portfolioItems.value.push({
    title: '',
    image: '',
    url: ''
  })
}
</script>

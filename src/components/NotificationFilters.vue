<template>
  <div class="bg-white border-b border-gray-200 px-4 py-3">
    <!-- Filter Tabs -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-1">
        <button
          v-for="filter in filters"
          :key="filter.id"
          @click="activeFilter = filter.id"
          :class="[
            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors relative',
            activeFilter === filter.id
              ? 'bg-teal-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          ]"
        >
          {{ filter.name }}
          <span
            v-if="filter.count > 0"
            :class="[
              'ml-1.5 px-1.5 py-0.5 text-xs rounded-full',
              activeFilter === filter.id
                ? 'bg-white/20 text-white'
                : 'bg-gray-200 text-gray-600'
            ]"
          >
            {{ filter.count }}
          </span>
        </button>
      </div>

      <!-- Sort Dropdown -->
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600">Sort:</span>
        <select
          v-model="sortBy"
          @change="handleSortChange"
          class="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="priority">Priority</option>
        </select>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="relative">
      <input
        v-model="searchQuery"
        @input="handleSearch"
        type="text"
        placeholder="Search notifications..."
        class="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
      >
      <svg class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

export interface FilterOption {
  id: string
  name: string
  count: number
}

interface Props {
  filters: FilterOption[]
  initialFilter?: string
  initialSort?: string
  onFilterChange?: (filterId: string) => void
  onSortChange?: (sortBy: string) => void
  onSearch?: (query: string) => void
}

const props = withDefaults(defineProps<Props>(), {
  initialFilter: 'all',
  initialSort: 'newest'
})

const activeFilter = ref(props.initialFilter)
const sortBy = ref(props.initialSort)
const searchQuery = ref('')

const handleSortChange = () => {
  if (props.onSortChange) {
    props.onSortChange(sortBy.value)
  }
}

const handleSearch = () => {
  if (props.onSearch) {
    props.onSearch(searchQuery.value)
  }
}

// Watch for filter changes
watch(activeFilter, (newFilter) => {
  if (props.onFilterChange) {
    props.onFilterChange(newFilter)
  }
})

// Watch for prop changes
watch(() => props.initialFilter, (newFilter) => {
  activeFilter.value = newFilter
})

watch(() => props.initialSort, (newSort) => {
  sortBy.value = newSort
})
</script>

<style scoped>
/* Additional styles if needed */
</style>

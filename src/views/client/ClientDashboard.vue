<template>
  <div class="min-h-screen bg-gray-100 pb-24">
    <ClientNavbar />
    <header class="bg-white shadow-sm p-4 sticky top-0 z-10 mt-4">
      <h1 class="text-2xl font-bold text-gray-800">Client Dashboard</h1>
      <p class="text-sm text-gray-500">Manage your projects and agents.</p>
    </header>

    <main class="p-4 space-y-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">My Projects</h2>
        <div class="text-center text-gray-500">
          <p>You have no active projects yet.</p>
          <button
            @click="$router.push({ name: 'client-create-project' })"
            class="mt-4 bg-brand-teal text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Post a New Project
          </button>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Recommended Agents</h2>
        <div class="text-center text-gray-500">
          <p>Agent recommendations will appear here.</p>
        </div>
      </div>
    </main>

    <ClientBottomNav />
  </div>
</template>

<script setup lang="ts">
import ClientNavbar from '../../components/navbar/ClientNavbar.vue'
import ClientBottomNav from '../../components/ClientBottomNav.vue'
</script>
<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Navbar -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-3">
            <img src="~/assets/images/logo-sekolah.jpg" alt="Logo" class="h-10 w-10 rounded-full" />
            <div>
              <h1 class="text-lg font-bold text-red-600">PINTU</h1>
              <p class="text-xs text-gray-500">SDN Sukapura 01</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <!-- User Info -->
            <div class="text-right hidden sm:block">
              <p class="text-sm font-semibold text-gray-900">{{ user?.nama }}</p>
              <p class="text-xs text-gray-500">{{ user?.role_name }}</p>
            </div>

            <!-- Logout Button -->
            <button
              @click="handleLogout"
              :disabled="isLoading"
              class="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading" class="inline-block mr-2 h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              {{ isLoading ? 'Keluar...' : 'Keluar' }}
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900">Selamat Datang 👋</h2>
        <p class="text-gray-600 mt-2">{{ user?.nama }}, Anda login sebagai {{ user?.role_name }}</p>
      </div>

      <!-- User Info Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Informasi Pengguna</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-gray-600">Username</p>
            <p class="text-lg font-medium text-gray-900">{{ user?.username }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Nama</p>
            <p class="text-lg font-medium text-gray-900">{{ user?.nama }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Role</p>
            <p class="text-lg font-medium text-gray-900">{{ user?.role_name }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Status</p>
            <div class="flex items-center gap-2 mt-1">
              <span class="h-2 w-2 rounded-full bg-green-500"></span>
              <p class="text-lg font-medium text-gray-900 capitalize">{{ user?.status }}</p>
            </div>
          </div>
          <div>
            <p class="text-sm text-gray-600">Sistem yang Bisa Diakses</p>
            <div class="flex gap-2 flex-wrap mt-2">
              <span
                v-for="system in user?.accessible_system"
                :key="system"
                class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
              >
                {{ system }}
              </span>
            </div>
          </div>
          <div>
            <p class="text-sm text-gray-600">Tanggal Dibuat</p>
            <p class="text-lg font-medium text-gray-900">{{ formatDate(user?.created_at) }}</p>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center gap-4 mb-4">
            <div class="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900">Dashboard</h4>
              <p class="text-sm text-gray-600">Kelola sistem sekolah</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center gap-4 mb-4">
            <div class="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900">Data Valid</h4>
              <p class="text-sm text-gray-600">Sistem terintegrasi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useAuthStore } from '~/stores/AuthStore'

definePageMeta({
  layout: 'default',
})

const { getCurrentUser, performLogout, isLoading } = useAuth()

const user = computed(() => getCurrentUser())

const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const handleLogout = async () => {
  const result = await performLogout()
  if (result.success) {
    console.log('Logout successful')
  }
}
</script>

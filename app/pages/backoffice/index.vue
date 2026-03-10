<template>
  <DashboardLayout>
    <!-- Welcome Section -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900">Selamat Datang 👋</h2>
      <!-- Using sanitized computed properties for security -->
      <p class="text-gray-600 mt-2">{{ getSafeUserName }}, Anda login sebagai {{ getSafeRoleName }}</p>
    </div>

    <!-- User Info Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Informasi Pengguna</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p class="text-sm text-gray-600">Username</p>
          <!-- Sanitized username to prevent XSS -->
          <p class="text-lg font-medium text-gray-900">{{ getSafeUsername }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">Nama</p>
          <!-- Sanitized name to prevent XSS -->
          <p class="text-lg font-medium text-gray-900">{{ getSafeUserName }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">Role</p>
          <!-- Sanitized role to prevent XSS -->
          <p class="text-lg font-medium text-gray-900">{{ getSafeRoleName }}</p>
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
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { sanitizeText } from '~/utils/sanitizer'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const { getCurrentUser } = useAuth()

const user = computed(() => getCurrentUser())

/**
 * Format date string to Indonesian locale
 * Includes input validation and safe fallback
 */
const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return '-'
  }
}

/**
 * Get safe user name - Vue auto-escapes but we add extra layer
 */
const getSafeUserName = computed(() => {
  // Vue automatically escapes {{ }} interpolations
  // Additional escaping here is defense in depth
  return user.value?.nama ? user.value.nama.replace(/[<>"']/g, (char) => {
    const map: Record<string, string> = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }
    return map[char]
  }) : '-'
})

/**
 * Get safe user role name
 */
const getSafeRoleName = computed(() => {
  return user.value?.role_name ? user.value.role_name.replace(/[<>"']/g, (char) => {
    const map: Record<string, string> = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }
    return map[char]
  }) : '-'
})

/**
 * Get safe username
 */
const getSafeUsername = computed(() => {
  return user.value?.username ? user.value.username.replace(/[<>"']/g, (char) => {
    const map: Record<string, string> = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }
    return map[char]
  }) : '-'
})
</script>

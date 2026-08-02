<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <!-- Sidebar -->
    <StudentSidebar
      :is-open="isSidebarOpen"
      :is-loading="isLoggingOut"
      @close="isSidebarOpen = false"
      @logout="handleLogout"
    />

    <!-- Main Content -->
    <div :class="[
      'flex-1 flex flex-col transition-all duration-300 overflow-hidden',
      'md:ml-20',
      isSidebarOpen ? 'md:ml-72' : 'md:ml-20'
    ]">
      <!-- Navbar -->
      <StudentNavbar
        :student="student"
        :is-loading="isLoggingOut"
        page-title="Buku Panduan"
        @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
        @logout="handleLogout"
      />

      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto overflow-x-hidden w-full">
        <div class="p-6 w-full max-w-full">
          <!-- Header -->
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Buku Panduan</h2>
            <p class="text-gray-600 mt-1">Panduan penggunaan sistem dan informasi penting</p>
          </div>

          <!-- Empty State / Coming Soon -->
          <div class="bg-white rounded-lg shadow p-8 text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <i class="fa-solid fa-book text-3xl text-gray-400"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Belum Ada Buku Panduan Tersedia</h3>
            <p class="text-gray-600 max-w-md mx-auto">
              Saat ini belum ada buku panduan yang tersedia. Buku panduan akan muncul di sini ketika admin menambahkannya.
            </p>
          </div>

          <!-- Example of Future Guide List -->
          <!-- <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer">
              <div class="bg-gradient-to-r from-purple-500 to-purple-600 h-32 flex items-center justify-center">
                <i class="fa-solid fa-book text-white text-5xl"></i>
              </div>
              <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-1">Panduan Penggunaan Portal</h3>
                    <p class="text-sm text-gray-600">Diperbarui: 15 Januari 2025</p>
                  </div>
                </div>
                <p class="text-gray-600 text-sm mb-4">
                  Panduan lengkap untuk menggunakan Portal Peserta Didik PINTU SDN Sukapura 01.
                </p>
                <div class="flex gap-2">
                  <button class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium text-sm">
                    <i class="fa-solid fa-eye mr-2"></i>Lihat
                  </button>
                  <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium text-sm">
                    <i class="fa-solid fa-download"></i>
                  </button>
                </div>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: false
})

useHead({
  title: 'Buku Panduan | Portal Peserta Didik',
  link: [
    {
      rel: 'icon',
      type: 'image/jpeg',
      href: '/logo-sekolah.jpg'
    }
  ]
})

const router = useRouter()
const isSidebarOpen = ref(true)
const isLoggingOut = ref(false)
const student = ref<any>(null)

onMounted(() => {
  const studentData = localStorage.getItem('student_user')
  if (studentData) {
    student.value = JSON.parse(studentData)
  } else {
    router.replace('/peserta-didik/login')
  }
})

const handleLogout = async () => {
  isLoggingOut.value = true
  
  try {
    localStorage.removeItem('student_token')
    localStorage.removeItem('student_user')
    localStorage.removeItem('student_permissions')
    localStorage.removeItem('student_expires_at')
    
    await router.replace('/peserta-didik/login')
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    isLoggingOut.value = false
  }
}
</script>

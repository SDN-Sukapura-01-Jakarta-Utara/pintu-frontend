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
        page-title="Kehadiran Ekstrakurikuler"
        @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
        @logout="handleLogout"
      />

      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto overflow-x-hidden w-full">
        <div class="p-6 w-full max-w-full">
          <!-- Header -->
          <div class="mb-6">
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Kehadiran Ekstrakurikuler</h1>
            <p class="text-sm sm:text-base text-gray-600 mt-1">Lihat rekap kehadiran ekstrakurikuler yang Anda ikuti</p>
          </div>

          <!-- Under Development State -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div class="text-center max-w-2xl mx-auto">
              <div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full mb-6 animate-pulse">
                <i class="fa-solid fa-tools text-5xl text-yellow-600"></i>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-3">Fitur Dalam Pengembangan</h3>
              <p class="text-gray-600 mb-6 leading-relaxed">
                Fitur kehadiran ekstrakurikuler sedang dalam tahap pengembangan. 
                Anda akan dapat melihat rekap kehadiran, statistik, dan riwayat kehadiran ekstrakurikuler di sini.
              </p>
              
              <!-- Feature Preview -->
              <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 mb-6">
                <h4 class="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Fitur yang Akan Tersedia:</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div class="flex items-start gap-3">
                    <i class="fa-solid fa-check-circle text-green-600 text-lg flex-shrink-0 mt-1"></i>
                    <div>
                      <p class="font-semibold text-gray-800 text-sm">Statistik Kehadiran</p>
                      <p class="text-xs text-gray-600">Total kehadiran, izin, dan alpa</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <i class="fa-solid fa-check-circle text-green-600 text-lg flex-shrink-0 mt-1"></i>
                    <div>
                      <p class="font-semibold text-gray-800 text-sm">Riwayat Kehadiran</p>
                      <p class="text-xs text-gray-600">Detail per pertemuan ekstrakurikuler</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <i class="fa-solid fa-check-circle text-green-600 text-lg flex-shrink-0 mt-1"></i>
                    <div>
                      <p class="font-semibold text-gray-800 text-sm">Filter & Pencarian</p>
                      <p class="text-xs text-gray-600">Berdasarkan ekstrakurikuler, bulan, tahun</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <i class="fa-solid fa-check-circle text-green-600 text-lg flex-shrink-0 mt-1"></i>
                    <div>
                      <p class="font-semibold text-gray-800 text-sm">Notifikasi</p>
                      <p class="text-xs text-gray-600">Pengingat jadwal ekstrakurikuler</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="inline-flex items-center gap-2 text-sm text-gray-500">
                <i class="fa-solid fa-info-circle"></i>
                <span>Terima kasih atas kesabaran Anda</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMediaQuery } from '@vueuse/core'

definePageMeta({
  layout: false
})

useHead({
  title: 'Kehadiran Ekstrakurikuler | Portal Peserta Didik',
  link: [
    {
      rel: 'icon',
      type: 'image/jpeg',
      href: '/logo-sekolah.jpg'
    }
  ]
})

const router = useRouter()
const isMd = useMediaQuery('(min-width: 768px)')

const isSidebarOpen = ref(isMd.value)
const isLoggingOut = ref(false)
const student = ref<any>(null)

onMounted(() => {
  const studentData = localStorage.getItem('student_user')
  const token = localStorage.getItem('student_token')
  
  if (studentData && token) {
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

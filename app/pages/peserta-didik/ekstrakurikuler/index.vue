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
        page-title="Ekstrakurikuler"
        @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
        @logout="handleLogout"
      />

      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto overflow-x-hidden w-full">
        <div class="p-6 w-full max-w-full">
          <!-- Header -->
          <div class="mb-6">
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Ekstrakurikuler</h1>
            <p class="text-sm sm:text-base text-gray-600 mt-1">Daftar kegiatan ekstrakurikuler yang tersedia</p>
          </div>

          <!-- Empty State -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div class="text-center">
              <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <i class="fa-solid fa-futbol text-4xl text-gray-400"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Belum Ada Data Ekstrakurikuler</h3>
              <p class="text-gray-600 max-w-md mx-auto">
                Informasi kegiatan ekstrakurikuler akan ditampilkan di sini.
              </p>
            </div>
          </div>
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
  title: 'Ekstrakurikuler | Portal Peserta Didik',
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

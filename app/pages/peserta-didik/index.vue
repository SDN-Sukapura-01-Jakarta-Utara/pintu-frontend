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
        page-title="Dashboard"
        @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
        @logout="handleLogout"
      />

      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto overflow-x-hidden w-full">
        <div class="p-6 w-full max-w-full">
          <!-- Welcome Card -->
          <div class="bg-gradient-to-r from-red-600 to-pink-500 rounded-xl p-6 sm:p-8 text-white shadow-lg mb-6">
            <h1 class="text-2xl sm:text-3xl font-bold mb-2">
              Selamat Datang, {{ student?.nama }}! 👋
            </h1>
            <p class="text-red-50">
              Portal Informasi Terpadu SDN Sukapura 01
            </p>
          </div>

          <!-- Info Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <!-- Card Kelas -->
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i class="fa-solid fa-school text-blue-600 text-xl"></i>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Kelas</p>
                  <p class="text-xl font-bold text-gray-900">
                    {{ student?.rombel?.[0]?.rombel_name || '-' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Card NIS -->
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i class="fa-solid fa-id-card text-green-600 text-xl"></i>
                </div>
                <div>
                  <p class="text-sm text-gray-600">NIS</p>
                  <p class="text-xl font-bold text-gray-900">{{ student?.nis || '-' }}</p>
                </div>
              </div>
            </div>

            <!-- Card NISN -->
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i class="fa-solid fa-hashtag text-purple-600 text-xl"></i>
                </div>
                <div>
                  <p class="text-sm text-gray-600">NISN</p>
                  <p class="text-xl font-bold text-gray-900">{{ student?.nisn || '-' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity / Info Section -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Informasi</h2>
            <p class="text-gray-600">
              Selamat datang di Portal Peserta Didik PINTU SDN Sukapura 01. Gunakan menu di sidebar untuk mengakses berbagai fitur yang tersedia.
            </p>
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
  title: 'Dashboard | Portal Peserta Didik',
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
  // Load student data from localStorage
  const studentData = localStorage.getItem('student_user')
  if (studentData) {
    student.value = JSON.parse(studentData)
  } else {
    // Redirect to login if no student data
    router.replace('/peserta-didik/login')
  }
})

const handleLogout = async () => {
  isLoggingOut.value = true
  
  try {
    // Clear student data from localStorage
    localStorage.removeItem('student_token')
    localStorage.removeItem('student_user')
    localStorage.removeItem('student_permissions')
    localStorage.removeItem('student_expires_at')
    
    // Redirect to login
    await router.replace('/peserta-didik/login')
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    isLoggingOut.value = false
  }
}
</script>

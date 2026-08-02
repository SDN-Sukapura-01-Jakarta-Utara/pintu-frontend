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
        page-title="Formulir & Survei"
        @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
        @logout="handleLogout"
      />

      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto overflow-x-hidden w-full">
        <div class="p-6 w-full max-w-full">
          <!-- Header Section -->
          <div class="mb-6 sm:mb-8">
            <div class="flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
              <div>
                <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                  Formulir & Survei
                </h1>
                <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
                  Daftar formulir dan survei yang tersedia untuk diisi
                </p>
              </div>
            </div>
          </div>

          <!-- Filter Section -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Formulir</h3>

            <!-- Filter Form -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- Judul Filter -->
              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                  Judul Formulir
                </label>
                <input
                  v-model="filters.judul"
                  type="text"
                  placeholder="Cari judul..."
                  class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                />
              </div>

              <!-- Start Date Filter -->
              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                  Tanggal Mulai
                </label>
                <input
                  v-model="filters.start_date"
                  type="date"
                  class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                />
              </div>

              <!-- End Date Filter -->
              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                  Tanggal Akhir
                </label>
                <input
                  v-model="filters.end_date"
                  type="date"
                  class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

            <!-- Filter Buttons -->
            <div class="flex gap-3 mt-4 flex-wrap">
              <button
                @click="applyFilter"
                class="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors duration-200 cursor-pointer"
              >
                <i class="fa-solid fa-magnifying-glass w-4 h-4"></i>
                Cari
              </button>
              <button
                @click="clearFilter"
                class="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
              >
                <i class="fa-solid fa-rotate-left w-4 h-4"></i>
                Reset Filter
              </button>
            </div>
          </div>

          <!-- Table Section -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <!-- Loading State -->
            <div v-if="isLoading" class="flex items-center justify-center py-12">
              <div class="flex flex-col items-center gap-3 sm:gap-4">
                <div class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
                <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data formulir...</p>
              </div>
            </div>

            <!-- Table Content -->
            <div v-else-if="formulirList.length > 0">
              <Table 
                :items="formulirList" 
                :columns="tableColumns"
                :current-page="pagination.page"
                :current-limit="pagination.limit"
                :total="pagination.total"
                :is-loading="isLoading"
                @pageChange="changePage"
                @limitChange="changeLimit"
              >
                <!-- Custom cell for Judul -->
                <template #cell-judul="{ item }">
                  <div class="text-sm font-semibold text-gray-900">{{ item.judul }}</div>
                </template>

                <!-- Custom cell for Tanggal Pengisian -->
                <template #cell-tanggal_pengisian="{ item }">
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ formatDate(item.start_date) }} - {{ formatDate(item.end_date) }}
                    </div>
                    <div v-if="getCountdown(item.end_date)" class="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-md bg-orange-50 border border-orange-200">
                      <i class="fa-solid fa-clock text-orange-600 text-xs"></i>
                      <span class="text-xs font-semibold text-orange-700">{{ getCountdown(item.end_date) }}</span>
                    </div>
                  </div>
                </template>

                <!-- Custom cell for Status -->
                <template #cell-status="{ item }">
                  <span :class="[
                    'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold',
                    isFormOpen(item) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]">
                    <span :class="['w-2 h-2 rounded-full', isFormOpen(item) ? 'bg-green-600' : 'bg-red-600']"></span>
                    {{ isFormOpen(item) ? 'Dibuka' : 'Ditutup' }}
                  </span>
                </template>

                <!-- Custom actions slot -->
                <template #actions="{ item }">
                  <div class="flex items-center justify-center">
                    <button
                      @click="isiFormulir(item)"
                      :disabled="!isFormOpen(item)"
                      class="inline-flex items-center justify-center gap-1.5 px-3 sm:px-2.5 py-2 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 font-semibold text-xs border border-blue-200 shadow-sm hover:shadow-md hover:from-blue-100 hover:to-blue-200 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm cursor-pointer"
                      :title="isFormOpen(item) ? 'Isi Formulir' : 'Formulir Ditutup'"
                    >
                      <i class="fa-solid fa-pen-to-square text-xs sm:text-sm"></i>
                      <span v-if="isFormOpen(item)" class="hidden sm:inline leading-none">Isi Formulir</span>
                    </button>
                  </div>
                </template>
              </Table>
            </div>

            <!-- Empty State -->
            <div v-else class="flex flex-col items-center justify-center py-16">
              <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <i class="fa-solid fa-file-lines text-4xl text-gray-400"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Tidak Ada Data</h3>
              <p class="text-gray-600 text-center max-w-md">
                Belum ada formulir yang tersedia saat ini.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: false
})

useHead({
  title: 'Formulir & Survei | Portal Peserta Didik',
  link: [
    {
      rel: 'icon',
      type: 'image/jpeg',
      href: '/logo-sekolah.jpg'
    }
  ]
})

const router = useRouter()
const config = useRuntimeConfig()
const { error } = useToast()

// Check if screen is md or larger
const isMd = useMediaQuery('(min-width: 768px)')

// Sidebar closed on mobile by default, open on desktop
const isSidebarOpen = ref(isMd.value)
const isLoggingOut = ref(false)
const isLoading = ref(false)
const student = ref<any>(null)
const formulirList = ref<any[]>([])
const filters = ref({
  judul: '',
  start_date: '',
  end_date: ''
})

const pagination = ref({
  limit: 10,
  page: 1,
  total: 0,
  total_pages: 0
})

const tableColumns = [
  { key: 'judul', label: 'Judul' },
  { key: 'tanggal_pengisian', label: 'Tanggal Pengisian' },
  { key: 'status', label: 'Status', align: 'center' as const }
]

let countdownInterval: any = null

const loadFormulir = async () => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('student_token')
    
    // Get rombel_id from student data
    const rombelId = student.value?.rombel?.[0]?.rombel_id || null
    
    const response: any = await $fetch(
      `${config.public.apiBase}/api/v1/formulir/get-formulir`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: {
          search: {
            judul: filters.value.judul,
            start_date: filters.value.start_date,
            end_date: filters.value.end_date,
            access_type: 'authenticated',
            target_user_types: ['murid'],
            role: '',
            rombel_id: rombelId
          },
          pagination: {
            limit: pagination.value.limit,
            page: pagination.value.page
          }
        }
      }
    )
    
    if (response.data) {
      // Filter hanya yang is_active = true
      const activeData = (response.data.data || []).filter((item: any) => item.is_active === true)
      formulirList.value = activeData
      pagination.value = {
        ...pagination.value,
        total: activeData.length,
        total_pages: Math.ceil(activeData.length / pagination.value.limit)
      }
    }
  } catch (err: any) {
    console.error('Error loading formulir:', err)
    
    // Check if it's a 401 error (invalid or expired token)
    if (err.status === 401 || err.statusCode === 401 || 
        (err.data && (err.data.error === 'invalid or expired token' || err.data.error?.includes('token')))) {
      error('Sesi Habis', 'Sesi login Anda telah habis. Silakan login kembali.')
      localStorage.removeItem('student_token')
      localStorage.removeItem('student_user')
      localStorage.removeItem('student_permissions')
      localStorage.removeItem('student_expires_at')
      await router.replace('/peserta-didik/login')
      return
    }
  } finally {
    isLoading.value = false
  }
}

const applyFilter = () => {
  pagination.value.page = 1
  loadFormulir()
}

const clearFilter = () => {
  filters.value = {
    judul: '',
    start_date: '',
    end_date: ''
  }
  pagination.value.page = 1
  loadFormulir()
}

const changePage = (page: number) => {
  pagination.value.page = page
  loadFormulir()
}

const changeLimit = (limit: number) => {
  pagination.value.limit = limit
  pagination.value.page = 1
  loadFormulir()
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const isFormOpen = (item: any) => {
  const now = new Date()
  const startDate = new Date(item.start_date)
  const endDate = new Date(item.end_date)
  return now >= startDate && now <= endDate
}

const getCountdown = (endDateString: string) => {
  if (!endDateString) return ''
  
  const now = new Date()
  const endDate = new Date(endDateString)
  const diff = endDate.getTime() - now.getTime()
  
  if (diff <= 0) return 'Waktu habis'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  const parts = []
  if (days > 0) parts.push(`${days} hari`)
  if (hours > 0) parts.push(`${hours} jam`)
  if (minutes > 0) parts.push(`${minutes} menit`)
  if (seconds > 0) parts.push(`${seconds} detik`)
  
  return parts.length > 0 ? parts.join(', ') : 'Segera berakhir'
}

const isiFormulir = (item: any) => {
  console.log('Isi formulir:', item)
  // TODO: Navigate to form filling page
}

onMounted(() => {
  const studentData = localStorage.getItem('student_user')
  if (studentData) {
    student.value = JSON.parse(studentData)
    loadFormulir()
    
    // Update countdown setiap detik
    countdownInterval = setInterval(() => {
      // Force re-render untuk update countdown
      formulirList.value = [...formulirList.value]
    }, 1000)
  } else {
    router.replace('/peserta-didik/login')
  }
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
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

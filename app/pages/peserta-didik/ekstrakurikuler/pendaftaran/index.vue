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
        page-title="Pendaftaran Ekstrakurikuler"
        @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
        @logout="handleLogout"
      />

      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto overflow-x-hidden w-full">
        <div class="p-6 w-full max-w-full">
          <!-- Header -->
          <div class="mb-6">
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Pendaftaran Ekstrakurikuler</h1>
            <p class="text-sm sm:text-base text-gray-600 mt-1">Pilih dan daftar ekstrakurikuler sesuai minat Anda</p>
          </div>

          <!-- Loading State -->
          <div v-if="isLoadingData" class="flex justify-center items-center py-20">
            <div class="text-center">
              <div class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600 mb-4"></div>
              <p class="text-gray-600 font-medium">Memuat data...</p>
            </div>
          </div>

          <!-- Form Pendaftaran -->
          <div v-else class="space-y-6">
            <!-- Info Siswa -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-user text-red-600"></i>
                Informasi Siswa
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                    <i class="fa-solid fa-user text-red-600"></i>
                    Nama Lengkap
                  </label>
                  <p class="text-gray-900 font-semibold">{{ student?.nama || '-' }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                    <i class="fa-solid fa-school text-red-600"></i>
                    Kelas
                  </label>
                  <p class="text-gray-900 font-semibold">{{ currentRombel?.rombel_name || '-' }}</p>
                </div>
              </div>
            </div>

            <!-- Ekstrakurikuler yang Sudah Didaftarkan -->
            <div v-if="registeredEkskulList.length > 0" class="bg-green-50 border border-green-200 rounded-lg p-6">
              <div class="flex items-start gap-3">
                <i class="fa-solid fa-check-circle text-green-600 text-2xl flex-shrink-0"></i>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-green-900 mb-2">
                    Anda Sudah Mendaftar Ekstrakurikuler
                  </h3>
                  <p class="text-sm text-green-800 mb-3">
                    Ekstrakurikuler yang telah didaftarkan:
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="ekskul in registeredEkskulList" 
                      :key="ekskul.ekstrakurikuler_id"
                      :class="[
                        'px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-2',
                        ekskul.ekstrakurikuler.kategori === 'wajib' 
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      ]"
                    >
                      <i :class="[
                        'fa-solid',
                        ekskul.ekstrakurikuler.kategori === 'wajib' ? 'fa-star' : 'fa-heart'
                      ]"></i>
                      {{ ekskul.ekstrakurikuler.name }}
                      <span class="text-xs opacity-75">({{ ekskul.ekstrakurikuler.kategori }})</span>
                    </span>
                  </div>
                  <p class="text-xs text-green-700 mt-3">
                    <i class="fa-solid fa-info-circle mr-1"></i>
                    Anda dapat mengubah pilihan ekstrakurikuler dengan memilih ulang dan menekan tombol "Daftarkan Ekstrakurikuler" di bawah.
                  </p>
                </div>
              </div>
            </div>

            <!-- Daftar Ekstrakurikuler -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-futbol text-red-600"></i>
                Pilih Ekstrakurikuler
              </h2>

              <!-- Alert Info -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div class="flex gap-3">
                  <i class="fa-solid fa-info-circle text-blue-600 text-xl flex-shrink-0"></i>
                  <div class="text-sm text-blue-800">
                    <p class="font-semibold mb-1">Informasi:</p>
                    <ul class="list-disc list-inside space-y-1">
                      <li>Ekstrakurikuler <strong>Wajib</strong> sudah otomatis terpilih dan harus diikuti</li>
                      <li>Anda <strong>wajib memilih minimal 1</strong> ekstrakurikuler <strong>Pilihan</strong> sesuai minat</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Ekstrakurikuler Wajib -->
              <div v-if="ekskulWajib.length > 0" class="mb-6">
                <h3 class="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <i class="fa-solid fa-star text-yellow-500"></i>
                  Ekstrakurikuler Wajib
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div 
                    v-for="ekskul in ekskulWajib" 
                    :key="ekskul.id"
                    class="border-2 border-yellow-300 bg-yellow-50 rounded-lg p-4"
                  >
                    <label class="flex items-start gap-3 cursor-not-allowed">
                      <input 
                        type="checkbox" 
                        :value="ekskul.id"
                        :checked="true"
                        disabled
                        class="mt-1 w-5 h-5 text-yellow-600 rounded focus:ring-yellow-500 cursor-not-allowed"
                      />
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                          <h4 class="font-semibold text-gray-900">{{ ekskul.name }}</h4>
                          <span class="px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs font-medium rounded">
                            Wajib
                          </span>
                        </div>
                        <p class="text-xs text-gray-600">
                          <i class="fa-solid fa-users text-gray-400 mr-1"></i>
                          Kelas: {{ ekskul.kelas.map((k: any) => k.name).join(', ') }}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Ekstrakurikuler Tidak Wajib -->
              <div v-if="ekskulTidakWajib.length > 0">
                <h3 class="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <i class="fa-solid fa-heart text-red-500"></i>
                  Ekstrakurikuler Pilihan
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div 
                    v-for="ekskul in ekskulTidakWajib" 
                    :key="ekskul.id"
                    :class="[
                      'border-2 rounded-lg p-4 transition-all cursor-pointer hover:shadow-md',
                      selectedEkskul.includes(ekskul.id) 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-200 bg-white hover:border-red-300'
                    ]"
                  >
                    <label class="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        :value="ekskul.id"
                        v-model="selectedEkskul"
                        class="mt-1 w-5 h-5 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                      />
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                          <h4 class="font-semibold text-gray-900">{{ ekskul.name }}</h4>
                          <span class="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            Pilihan
                          </span>
                        </div>
                        <p class="text-xs text-gray-600">
                          <i class="fa-solid fa-users text-gray-400 mr-1"></i>
                          Kelas: {{ ekskul.kelas.map((k: any) => k.name).join(', ') }}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="ekskulWajib.length === 0 && ekskulTidakWajib.length === 0" class="text-center py-12">
                <i class="fa-solid fa-inbox text-6xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">Tidak ada ekstrakurikuler tersedia untuk kelas Anda</p>
              </div>

              <!-- Action Buttons -->
              <div v-if="hasPermission('CREATE_EKSTRAKURIKULER_PESERTA_DIDIK') && (ekskulWajib.length > 0 || ekskulTidakWajib.length > 0)" class="mt-6 pt-6 border-t border-gray-200">
                <div class="flex justify-end gap-3">
                  <button
                    @click="handleSubmit"
                    :disabled="isSaving"
                    class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                  >
                    <i v-if="isSaving" class="fa-solid fa-spinner fa-spin"></i>
                    <i v-else class="fa-solid fa-save"></i>
                    <span>{{ isSaving ? 'Menyimpan...' : 'Daftarkan Ekstrakurikuler' }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useToast } from '~/composables/useToast'
import { useAuth } from '~/composables/useAuth'
import { getEkstrakurikulerList, getEkskulPesertaDidik, registerEkskulPesertaDidik } from '~/services/ekstrakurikuler'

definePageMeta({
  layout: false
})

useHead({
  title: 'Pendaftaran Ekstrakurikuler | Portal Peserta Didik',
  link: [
    {
      rel: 'icon',
      type: 'image/jpeg',
      href: '/logo-sekolah.jpg'
    }
  ]
})

const router = useRouter()
const { success, error } = useToast()
const { hasPermission } = useAuth()
const isMd = useMediaQuery('(min-width: 768px)')

const isSidebarOpen = ref(isMd.value)
const isLoggingOut = ref(false)
const isLoadingData = ref(true)
const isSaving = ref(false)
const student = ref<any>(null)
const currentRombel = ref<any>(null)
const allEkskul = ref<any[]>([])
const selectedEkskul = ref<number[]>([])
const registeredEkskulList = ref<any[]>([])

// Filter ekstrakurikuler berdasarkan kategori
const ekskulWajib = computed(() => {
  return allEkskul.value.filter(e => e.kategori === 'wajib')
})

const ekskulTidakWajib = computed(() => {
  return allEkskul.value.filter(e => e.kategori === 'tidak wajib')
})

const loadData = async () => {
  const studentData = localStorage.getItem('student_user')
  const token = localStorage.getItem('student_token')
  
  if (!studentData || !token) {
    await router.replace('/peserta-didik/login')
    return
  }

  try {
    student.value = JSON.parse(studentData)
    
    // Get rombel aktif di tahun pelajaran saat ini
    const activeRombel = student.value.rombel?.find((r: any) => r.status === 'active')
    if (!activeRombel) {
      error('Data Tidak Lengkap', 'Data rombel tidak ditemukan. Silakan hubungi admin.')
      isLoadingData.value = false
      return
    }
    currentRombel.value = activeRombel

    // Get daftar ekstrakurikuler
    const ekskulResponse = await getEkstrakurikulerList(1, 50, { status: 'active' })
    
    // Filter ekstrakurikuler berdasarkan kelas siswa
    const kelasId = activeRombel.kelas_id
    allEkskul.value = ekskulResponse.data.filter((ekskul: any) => 
      ekskul.kelas_ids.includes(kelasId)
    )

    // Get ekstrakurikuler yang sudah didaftarkan
    try {
      const registeredResponse = await getEkskulPesertaDidik(activeRombel.id)
      registeredEkskulList.value = registeredResponse.ekstrakurikuler
      const registeredIds = registeredResponse.ekstrakurikuler.map((e: any) => e.ekstrakurikuler_id)
      
      // Set selected ekskul (hanya yang tidak wajib, wajib sudah otomatis)
      selectedEkskul.value = registeredIds.filter((id: number) => {
        const ekskul = allEkskul.value.find(e => e.id === id)
        return ekskul && ekskul.kategori === 'tidak wajib'
      })
    } catch (err) {
      // Jika belum pernah daftar, biarkan kosong
      console.log('Belum ada pendaftaran ekstrakurikuler')
    }
  } catch (err: any) {
    console.error('Error loading data:', err)
    
    if (err.status === 401 || err.statusCode === 401 || 
        (err.data && (err.data.error === 'user not authenticated' || err.data.error?.includes('token')))) {
      error('Sesi Habis', 'Sesi login Anda telah habis. Silakan login kembali.')
      localStorage.removeItem('student_token')
      localStorage.removeItem('student_user')
      localStorage.removeItem('student_permissions')
      localStorage.removeItem('student_expires_at')
      await router.replace('/peserta-didik/login')
      return
    }
    
    error('Gagal Memuat Data', err.data?.message || 'Terjadi kesalahan saat memuat data')
  } finally {
    isLoadingData.value = false
  }
}

const handleSubmit = async () => {
  if (!currentRombel.value) {
    error('Validasi Gagal', 'Data rombel tidak ditemukan')
    return
  }

  // Validasi minimal 1 ekstrakurikuler pilihan harus dipilih
  if (selectedEkskul.value.length === 0) {
    error('Validasi Gagal', 'Anda harus memilih minimal 1 ekstrakurikuler pilihan')
    return
  }

  isSaving.value = true
  
  try {
    // Gabungkan ekstrakurikuler wajib dan yang dipilih
    const wajibIds = ekskulWajib.value.map(e => e.id)
    const allSelectedIds = [...wajibIds, ...selectedEkskul.value]
    
    const response = await registerEkskulPesertaDidik(
      currentRombel.value.id,
      allSelectedIds
    )
    
    success('Berhasil', response.message || 'Pendaftaran ekstrakurikuler berhasil disimpan')
    
    // Reload data untuk update tampilan
    await loadData()
  } catch (err: any) {
    console.error('Error registering ekstrakurikuler:', err)
    
    if (err.status === 401 || err.statusCode === 401 || 
        (err.data && err.data.error === 'user not authenticated')) {
      error('Sesi Habis', 'Sesi login Anda telah habis. Silakan login kembali.')
      localStorage.removeItem('student_token')
      localStorage.removeItem('student_user')
      localStorage.removeItem('student_permissions')
      localStorage.removeItem('student_expires_at')
      await router.replace('/peserta-didik/login')
      return
    }
    
    error('Gagal Menyimpan', err.data?.message || 'Terjadi kesalahan saat menyimpan pendaftaran')
  } finally {
    isSaving.value = false
  }
}

const handleLogout = async () => {
  isLoggingOut.value = true
  
  try {
    localStorage.removeItem('student_token')
    localStorage.removeItem('student_user')
    localStorage.removeItem('student_permissions')
    localStorage.removeItem('student_expires_at')
    
    await router.replace('/peserta-didik/login')
  } catch (err) {
    console.error('Logout error:', err)
  } finally {
    isLoggingOut.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <DashboardLayout>
    <!-- Header Section -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Pendaftaran Ekstrakurikuler</h1>
      <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
        Kelola pendaftaran ekstrakurikuler siswa berdasarkan rombel dan tahun pelajaran
      </p>
    </div>

    <!-- Main Content -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="p-4 sm:p-6 md:p-8">
        <!-- Filter Section -->
        <div class="mb-8 pb-8 border-b border-gray-200">
          <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <i class="fa-solid fa-filter text-red-600"></i>
            Filter Data
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Rombel -->
            <div>
              <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
                Rombel <span class="text-red-600">*</span>
              </label>
              <select
                v-model.number="selectedRombelId"
                @change="loadData"
                class="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                :disabled="isLoading"
              >
                <option :value="0">Pilih Rombel</option>
                <option v-for="rombel in filteredRombelList" :key="rombel.id" :value="rombel.id">
                  {{ rombel.name }}
                </option>
              </select>
            </div>

            <!-- Tahun Pelajaran -->
            <div>
              <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
                Tahun Pelajaran <span class="text-red-600">*</span>
              </label>
              <select
                v-model.number="selectedTahunPelajaranId"
                @change="loadData"
                class="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                :disabled="isLoading"
              >
                <option v-for="tahun in tahunPelajaranList" :key="tahun.id" :value="tahun.id">
                  {{ tahun.tahun_pelajaran }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <div class="flex flex-col items-center gap-3">
            <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
            <p class="text-sm text-gray-600 font-medium">Memuat data...</p>
          </div>
        </div>

        <!-- Table Section -->
        <div v-else-if="siswaList.length > 0 && ekstrakurikulerList.length > 0" class="mb-8">
          <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fa-solid fa-users text-red-600"></i>
            Daftar Siswa dan Ekstrakurikuler
          </h2>

          <!-- Info Box -->
          <div class="mb-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex gap-2 sm:gap-3">
              <i class="fa-solid fa-info-circle text-blue-600 text-sm sm:text-base flex-shrink-0 mt-0.5"></i>
              <div class="flex-1 text-xs sm:text-sm">
                <p class="font-semibold text-blue-900 mb-1">Informasi:</p>
                <ul class="list-disc list-inside space-y-1 text-blue-800">
                  <li>Centang ekstrakurikuler yang ingin didaftarkan untuk setiap siswa</li>
                  <li>Kolom dengan latar <span class="inline-block px-2 py-0.5 bg-yellow-100 border border-yellow-300 rounded text-xs font-semibold">kuning</span> adalah ekstrakurikuler <strong>Wajib</strong></li>
                  <li>Klik "Simpan Pendaftaran Ekstrakurikuler" untuk menyimpan perubahan</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full border-collapse text-xs">
              <thead>
                <tr style="background-color: #1f2937;">
                  <th class="px-3 py-3 text-center text-xs font-semibold border border-gray-700" style="color: white;">NO</th>
                  <th class="px-3 py-3 text-left text-xs font-semibold border border-gray-700" style="color: white;">NAMA</th>
                  <th class="px-3 py-3 text-center text-xs font-semibold border border-gray-700" style="color: white;">NIS</th>
                  <th class="px-3 py-3 text-center text-xs font-semibold border border-gray-700" style="color: white;">P/L</th>
                  <th 
                    v-for="ekskul in sortedEkstrakurikulerList" 
                    :key="ekskul.id" 
                    :class="[
                      'px-2 py-3 text-center text-xs font-semibold border border-gray-700',
                      ekskul.kategori === 'wajib' ? 'bg-yellow-700' : ''
                    ]"
                    style="color: white; min-width: 100px;"
                  >
                    {{ ekskul.name }}
                    <span v-if="ekskul.kategori === 'wajib'" class="block text-[10px] opacity-75">(Wajib)</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(siswa, index) in siswaList" :key="siswa.peserta_didik_rombel_id" class="hover:bg-gray-50">
                  <td class="px-3 py-3 text-center border border-gray-200 text-gray-900">{{ index + 1 }}</td>
                  <td class="px-3 py-3 border border-gray-200 text-gray-900">{{ siswa.nama_lengkap }}</td>
                  <td class="px-3 py-3 text-center border border-gray-200 text-gray-900">{{ getNIS(siswa) }}</td>
                  <td class="px-3 py-3 text-center border border-gray-200 text-gray-900">{{ getJenisKelamin(siswa) }}</td>
                  <td 
                    v-for="ekskul in sortedEkstrakurikulerList" 
                    :key="ekskul.id" 
                    :class="[
                      'px-2 py-3 text-center border border-gray-200',
                      ekskul.kategori === 'wajib' ? 'bg-yellow-50' : ''
                    ]"
                  >
                    <input
                      type="checkbox"
                      v-model="registrationData[siswa.peserta_didik_rombel_id]"
                      :value="ekskul.id"
                      class="w-4 h-4 text-red-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-red-100 cursor-pointer"
                      :disabled="isSaving"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!isLoading && (selectedRombelId === 0 || !siswaList.length)" class="flex flex-col items-center justify-center py-12">
          <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <i class="fa-solid fa-users text-2xl text-gray-400"></i>
          </div>
          <h3 class="text-base font-semibold text-gray-900 mb-1">
            {{ selectedRombelId === 0 ? 'Belum ada data' : 'Tidak ada siswa' }}
          </h3>
          <p class="text-sm text-gray-600 text-center px-4">
            {{ selectedRombelId === 0 ? 'Pilih rombel dan tahun pelajaran untuk memuat data' : 'Tidak ada data siswa untuk rombel dan tahun pelajaran yang dipilih' }}
          </p>
        </div>

        <!-- Empty State: Tidak ada ekstrakurikuler -->
        <div v-else-if="!isLoading && siswaList.length > 0 && ekstrakurikulerList.length === 0" class="flex flex-col items-center justify-center py-12">
          <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <i class="fa-solid fa-exclamation-circle text-2xl text-gray-400"></i>
          </div>
          <h3 class="text-base font-semibold text-gray-900 mb-1">Tidak ada ekstrakurikuler</h3>
          <p class="text-sm text-gray-600 text-center px-4">Tidak ada ekstrakurikuler yang tersedia untuk kelas ini. Silakan hubungi administrator untuk menambahkan ekstrakurikuler.</p>
        </div>

        <!-- Submit Button -->
        <div v-if="siswaList.length > 0 && ekstrakurikulerList.length > 0" class="flex justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="handleSubmit"
            :disabled="isSaving"
            class="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
          >
            <svg v-if="isSaving" class="w-3 h-3 sm:w-4 sm:h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isSaving ? 'Menyimpan...' : 'Simpan Pendaftaran Ekstrakurikuler' }}</span>
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useToast } from '~/composables/useToast'
import { useAuth } from '~/composables/useAuth'
import { getPemetaanRombelList } from '~/services/peserta-didik'
import { getEkstrakurikulerList, getAllEkstrakurikulerSiswa, registerAllEkstrakurikulerSiswa } from '~/services/ekstrakurikuler'
import DashboardLayout from '~/components/DashboardLayout.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

useHead({
  title: 'Pendaftaran Ekstrakurikuler | PINTU SDN Sukapura 01',
  link: [
    {
      rel: 'icon',
      type: 'image/jpeg',
      href: '/logo-sekolah.jpg'
    }
  ]
})

const { success: showToast, error: showErrorToast } = useToast()
const { getCurrentUser } = useAuth()

// Get current user data
const currentUser = getCurrentUser()

// Check if user is superadmin (user ID 1)
const isSuperAdmin = computed(() => currentUser?.id === 1)

// State
const isLoading = ref(false)
const isSaving = ref(false)
const selectedRombelId = ref(0)
const selectedTahunPelajaranId = ref(0)
const rombelList = ref<any[]>([])
const tahunPelajaranList = ref<any[]>([])
const siswaList = ref<any[]>([])
const ekstrakurikulerList = ref<any[]>([])
const registrationData = reactive<Record<number, number[]>>({})

// Computed - Sort ekstrakurikuler: pilihan first, then wajib
const sortedEkstrakurikulerList = computed(() => {
  const pilihan = ekstrakurikulerList.value.filter((e: any) => e.kategori !== 'wajib')
  const wajib = ekstrakurikulerList.value.filter((e: any) => e.kategori === 'wajib')
  return [...pilihan, ...wajib]
})

// Computed - Filter rombel list based on user's assignment
const filteredRombelList = computed(() => {
  const filtered = rombelList.value.filter((r: any) => r.status === 'active')
  
  // Superadmin has access to all rombel
  if (isSuperAdmin.value) {
    return filtered
  }
  
  // Collect all rombel IDs that user has access to
  const rombelIds = new Set<number>()
  
  // Add rombel guru kelas if exists
  if (currentUser?.rombel_guru_kelas_id) {
    rombelIds.add(currentUser.rombel_guru_kelas_id)
  }
  
  // Add rombel bidang studi if exists
  if (currentUser?.rombel_bidang_studi && Array.isArray(currentUser.rombel_bidang_studi) && currentUser.rombel_bidang_studi.length > 0) {
    currentUser.rombel_bidang_studi.forEach((id: number) => rombelIds.add(id))
  }
  
  // If user has specific rombel assignments, filter by those
  if (rombelIds.size > 0) {
    return filtered.filter((r: any) => rombelIds.has(r.id))
  }
  
  // Default: show all active rombel (for users without specific rombel assignments)
  return filtered
})

// Load initial data
onMounted(async () => {
  await loadRombel()
  await loadTahunPelajaran()
  
  // Auto-select rombel if user has only one assigned rombel
  if (!isSuperAdmin.value && currentUser?.rombel_guru_kelas_id && !currentUser?.rombel_bidang_studi) {
    // User only has rombel_guru_kelas_id (no rombel_bidang_studi)
    selectedRombelId.value = currentUser.rombel_guru_kelas_id
    // Auto-load data if both rombel and tahun pelajaran are selected
    if (selectedTahunPelajaranId.value !== 0) {
      await loadData()
    }
  }
})

// Load rombel list
async function loadRombel() {
  try {
    const config = useRuntimeConfig()
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    const response = await $fetch<any>(
      `${config.public.apiBase}/api/v1/rombel/get-rombel`,
      {
        method: 'POST',
        body: {
          search: {
            name: null,
            status: 'active',
            kelas_id: null
          },
          pagination: {
            limit: 50,
            page: 1
          }
        },
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    )

    rombelList.value = response.data || []
  } catch (error: any) {
    console.error('Error loading rombel:', error)
    showErrorToast('Gagal Memuat Data', 'Gagal memuat data rombel. Silakan coba lagi.')
  }
}

// Load tahun pelajaran list
async function loadTahunPelajaran() {
  try {
    const config = useRuntimeConfig()
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    const response = await $fetch<any>(
      `${config.public.apiBase}/api/v1/tahun-pelajaran/get-tahun-pelajaran`,
      {
        method: 'POST',
        body: {
          search: {
            tahun_pelajaran: null,
            status: null
          },
          pagination: {
            limit: 25,
            page: 1
          }
        },
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    )

    tahunPelajaranList.value = response.data || []
    
    // Set default to active tahun pelajaran
    const activeTahun = tahunPelajaranList.value.find((t: any) => t.status === 'active')
    if (activeTahun) {
      selectedTahunPelajaranId.value = activeTahun.id
    }
  } catch (error: any) {
    console.error('Error loading tahun pelajaran:', error)
    showErrorToast('Gagal Memuat Data', 'Gagal memuat data tahun pelajaran. Silakan coba lagi.')
  }
}

// Load data when rombel or tahun pelajaran changes
async function loadData() {
  if (selectedRombelId.value === 0 || selectedTahunPelajaranId.value === 0) {
    siswaList.value = []
    ekstrakurikulerList.value = []
    return
  }

  isLoading.value = true

  try {
    // Load siswa
    await loadSiswa()
    
    // Load ekstrakurikuler
    await loadEkstrakurikuler()
    
    // Load existing registrations
    await loadExistingRegistrations()
  } catch (error: any) {
    console.error('Error loading data:', error)
    const errorMessage = error?.data?.message || error?.message || 'Terjadi kesalahan saat memuat data'
    showErrorToast('Gagal Memuat Data', errorMessage)
  } finally {
    isLoading.value = false
  }
}

// Load siswa list
async function loadSiswa() {
  try {
    const result = await getPemetaanRombelList(
      {
        rombel_id: selectedRombelId.value,
        tahun_pelajaran_id: selectedTahunPelajaranId.value,
        status: 'active'
      },
      1,
      100
    )

    siswaList.value = result.data.map((item: any) => ({
      peserta_didik_rombel_id: item.id,
      peserta_didik_id: item.peserta_didik_id,
      nama_lengkap: item.peserta_didik?.nama || '',
      nisn: item.peserta_didik?.nisn || '',
      nis: item.peserta_didik?.nis || '',
      jenis_kelamin: item.peserta_didik?.jenis_kelamin || ''
    }))

    // Initialize registration data for each siswa
    siswaList.value.forEach((siswa: any) => {
      if (!registrationData[siswa.peserta_didik_rombel_id]) {
        registrationData[siswa.peserta_didik_rombel_id] = []
      }
    })
  } catch (error: any) {
    console.error('Error loading siswa:', error)
    throw error
  }
}

// Load ekstrakurikuler list
async function loadEkstrakurikuler() {
  try {
    // Get kelas_id from selected rombel
    const selectedRombel = rombelList.value.find((r: any) => r.id === selectedRombelId.value)
    const kelasId = selectedRombel?.kelas?.id || selectedRombel?.kelas_id || null

    const result = await getEkstrakurikulerList(1, 100, {
      name: null,
      kelas_id: kelasId,
      kategori: null,
      status: 'active'
    })

    ekstrakurikulerList.value = result.data || []
  } catch (error: any) {
    console.error('Error loading ekstrakurikuler:', error)
    throw error
  }
}

// Load existing registrations
async function loadExistingRegistrations() {
  try {
    const result = await getAllEkstrakurikulerSiswa(
      selectedRombelId.value,
      selectedTahunPelajaranId.value
    )

    // Map existing registrations to checkbox state
    if (result.siswa && result.siswa.length > 0) {
      result.siswa.forEach((siswa: any) => {
        const ekskulIds = siswa.ekstrakurikuler.map((e: any) => e.ekstrakurikuler_id)
        registrationData[siswa.peserta_didik_rombel_id] = ekskulIds
      })
    }
  } catch (error: any) {
    console.error('Error loading existing registrations:', error)
    // Don't throw - just log, as this might be empty for new registrations
  }
}

// Get NIS from siswa
function getNIS(siswa: any) {
  return siswa.nis || siswa.nisn || '-'
}

// Get jenis kelamin
function getJenisKelamin(siswa: any) {
  return siswa.jenis_kelamin || '-'
}

// Handle form submit
async function handleSubmit() {
  if (isSaving.value) return

  isSaving.value = true

  try {
    // Prepare data for API
    const siswaData = Object.keys(registrationData).map((key) => ({
      peserta_didik_rombel_id: parseInt(key),
      ekstrakurikuler_ids: registrationData[parseInt(key)] || []
    }))

    // Call API
    const response = await registerAllEkstrakurikulerSiswa(siswaData)

    // Show success message with details
    const summary = response.summary
    const successDetail = `${summary.total_siswa} siswa diproses. ${summary.total_added} pendaftaran ditambahkan, ${summary.total_removed} dihapus, ${summary.total_kept} tetap.`
    
    showToast('Berhasil', successDetail)

    // Reload data
    await loadExistingRegistrations()
  } catch (error: any) {
    console.error('Error saving registration:', error)
    const errorMessage = error?.data?.message || error?.message || 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.'
    showErrorToast('Gagal Menyimpan', errorMessage)
  } finally {
    isSaving.value = false
  }
}
</script>

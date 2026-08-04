<template>
  <DashboardLayout>
    <!-- Header Section -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Monitoring Ekstrakurikuler</h1>
      <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
        Dashboard monitoring dan statistik ekstrakurikuler siswa
      </p>
    </div>

    <!-- Main Content -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <div class="px-4 sm:px-6">
          <div class="flex gap-1 overflow-x-auto -mb-px" style="scrollbar-width: thin;">
            <button
              @click="activeTab = 'dashboard-siswa'"
              :class="[
                'px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 border-b-2 relative cursor-pointer',
                activeTab === 'dashboard-siswa'
                  ? 'text-red-600 border-b-red-600'
                  : 'text-gray-600 border-b-transparent hover:text-gray-900 hover:border-b-gray-300'
              ]"
            >
              <span class="flex items-center gap-2">
                <i class="fas fa-chart-pie w-4 h-4"></i>
                Dashboard Ekskul Siswa
              </span>
            </button>
            <button
              @click="activeTab = 'dashboard-absensi'"
              :class="[
                'px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 border-b-2 relative cursor-pointer',
                activeTab === 'dashboard-absensi'
                  ? 'text-red-600 border-b-red-600'
                  : 'text-gray-600 border-b-transparent hover:text-gray-900 hover:border-b-gray-300'
              ]"
            >
              <span class="flex items-center gap-2">
                <i class="fas fa-calendar-check w-4 h-4"></i>
                Dashboard Absensi Ekskul
              </span>
            </button>
            <button
              @click="activeTab = 'dashboard-penilaian'"
              :class="[
                'px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 border-b-2 relative cursor-pointer',
                activeTab === 'dashboard-penilaian'
                  ? 'text-red-600 border-b-red-600'
                  : 'text-gray-600 border-b-transparent hover:text-gray-900 hover:border-b-gray-300'
              ]"
            >
              <span class="flex items-center gap-2">
                <i class="fas fa-star w-4 h-4"></i>
                Dashboard Penilaian Ekskul
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Content: Dashboard Ekskul Siswa -->
      <div v-if="activeTab === 'dashboard-siswa'" class="p-4 sm:p-6 md:p-8">
        <!-- Filter Section -->
        <div class="mb-6 pb-6 border-b border-gray-200">
          <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-filter text-red-600"></i>
            Filter Data
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Tahun Pelajaran -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Tahun Pelajaran <span class="text-red-600">*</span>
              </label>
              <select
                v-model.number="selectedTahunPelajaranId"
                @change="loadStatistics"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                :disabled="isLoading"
              >
                <option v-for="tahun in tahunPelajaranList" :key="tahun.id" :value="tahun.id">
                  {{ tahun.tahun_pelajaran }}
                </option>
              </select>
            </div>

            <!-- Rombel -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Rombel <span class="text-gray-500 text-xs">(Kosongkan untuk semua rombel)</span>
              </label>
              <select
                v-model.number="selectedRombelId"
                @change="loadStatistics"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                :disabled="isLoading"
              >
                <option :value="null">Semua Rombel</option>
                <option v-for="rombel in filteredRombelList" :key="rombel.id" :value="rombel.id">
                  {{ rombel.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <div class="flex flex-col items-center gap-3">
            <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
            <p class="text-sm text-gray-600 font-medium">Memuat statistik...</p>
          </div>
        </div>

        <!-- Statistics Content -->
        <div v-else-if="statisticsData">
          <!-- Summary Section -->
          <div class="mb-8">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Ringkasan</h2>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Card 1: Total Siswa -->
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
                    <i class="fas fa-users text-white text-xl"></i>
                  </div>
                  <div>
                    <p class="text-xs font-medium text-blue-600 uppercase tracking-wide">Total Siswa</p>
                    <p class="text-3xl font-bold text-blue-900 mt-1">{{ statisticsData.summary.total_siswa }}</p>
                  </div>
                </div>
                <div class="pt-3 border-t border-blue-200">
                  <p class="text-xs text-blue-700">Siswa terdaftar</p>
                </div>
              </div>

              <!-- Card 2: Ikut Ekstrakurikuler -->
              <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md flex-shrink-0">
                    <i class="fas fa-check-circle text-white text-xl"></i>
                  </div>
                  <div>
                    <p class="text-xs font-medium text-green-600 uppercase tracking-wide">Ikut Ekskul</p>
                    <p class="text-3xl font-bold text-green-900 mt-1">{{ statisticsData.summary.total_siswa_ikut_ekskul }}</p>
                  </div>
                </div>
                <div class="pt-3 border-t border-green-200">
                  <p class="text-xs text-green-700">{{ statisticsData.summary.persentase_ikut_ekskul.toFixed(1) }}% dari total siswa</p>
                </div>
              </div>

              <!-- Card 3: Belum Daftar -->
              <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border-2 border-red-200 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md flex-shrink-0">
                    <i class="fas fa-user-xmark text-white text-xl"></i>
                  </div>
                  <div>
                    <p class="text-xs font-medium text-red-600 uppercase tracking-wide">Belum Daftar</p>
                    <p class="text-3xl font-bold text-red-900 mt-1">{{ statisticsData.summary.total_siswa_tidak_ikut_ekskul }}</p>
                  </div>
                </div>
                <div class="pt-3 border-t border-red-200">
                  <p class="text-xs text-red-700">Siswa belum terdaftar</p>
                </div>
              </div>

              <!-- Card 4: Total Ekstrakurikuler -->
              <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border-2 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-md flex-shrink-0">
                    <i class="fas fa-futbol text-white text-xl"></i>
                  </div>
                  <div>
                    <p class="text-xs font-medium text-purple-600 uppercase tracking-wide">Total Ekskul</p>
                    <p class="text-3xl font-bold text-purple-900 mt-1">{{ statisticsData.summary.total_ekstrakurikuler }}</p>
                  </div>
                </div>
                <div class="pt-3 border-t border-purple-200">
                  <p class="text-xs text-purple-700">Ekstrakurikuler aktif</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Charts Section -->
          <div v-if="statisticsData.statistik_per_ekskul && statisticsData.statistik_per_ekskul.length > 0" class="mb-8">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Statistik Per Ekstrakurikuler</h2>
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Pie Chart -->
              <div class="lg:col-span-2 bg-white border-2 border-gray-200 rounded-lg p-6">
                <h3 class="text-base font-semibold text-gray-900 mb-4">Distribusi Siswa per Ekskul</h3>
                <div class="flex items-center justify-center" style="height: 400px;">
                  <canvas ref="pieChartCanvas"></canvas>
                </div>
              </div>

              <!-- Ekstrakurikuler List - More Compact -->
              <div class="space-y-2 overflow-y-auto" style="max-height: 450px;">
                <div
                  v-for="(ekskul, index) in statisticsData.statistik_per_ekskul"
                  :key="ekskul.ekstrakurikuler_id"
                  class="bg-white border-2 border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                >
                  <div class="flex items-center gap-2 mb-1">
                    <div 
                      class="w-3 h-3 rounded-full flex-shrink-0"
                      :style="{ backgroundColor: getColor(index) }"
                    ></div>
                    <h4 class="font-semibold text-gray-900 text-xs flex-1">{{ ekskul.nama_ekstrakurikuler }}</h4>
                    <div class="text-lg font-bold text-red-600">{{ ekskul.total_siswa }}</div>
                  </div>
                  <div class="flex items-center justify-between pl-5">
                    <span
                      :class="[
                        'inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold',
                        ekskul.kategori === 'wajib'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      ]"
                    >
                      {{ ekskul.kategori }}
                    </span>
                    <span class="text-[10px] text-gray-500">siswa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty State: No Ekstrakurikuler Data -->
          <div v-else class="mb-8 flex flex-col items-center justify-center py-12 px-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
            <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <i class="fas fa-futbol text-3xl text-gray-400"></i>
            </div>
            <h3 class="text-base font-semibold text-gray-900 mb-1">Belum Ada Data Ekstrakurikuler</h3>
            <p class="text-sm text-gray-600 text-center">Tidak ada siswa yang terdaftar di ekstrakurikuler pada periode ini</p>
          </div>

          <!-- Statistik Per Rombel -->
          <div v-if="statisticsData.statistik_per_rombel && statisticsData.statistik_per_rombel.length > 0" class="mb-8">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Statistik Per Rombel</h2>
            
            <div class="space-y-4">
              <div
                v-for="rombel in statisticsData.statistik_per_rombel"
                :key="rombel.rombel_id"
                class="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                  <div>
                    <h3 class="text-base font-bold text-gray-900">{{ rombel.nama_rombel }}</h3>
                    <p class="text-sm text-gray-600 mt-1">
                      {{ rombel.siswa_ikut_ekskul }} dari {{ rombel.total_siswa }} siswa
                      ({{ rombel.persentase_ikut_ekskul.toFixed(1) }}%)
                    </p>
                  </div>
                  <div class="flex gap-2">
                    <div class="text-center px-3 py-2 bg-green-50 border-2 border-green-200 rounded-lg">
                      <div class="text-xl font-bold text-green-600">{{ rombel.siswa_ikut_ekskul }}</div>
                      <div class="text-[10px] text-green-700">Terdaftar</div>
                    </div>
                    <div class="text-center px-3 py-2 bg-red-50 border-2 border-red-200 rounded-lg">
                      <div class="text-xl font-bold text-red-600">{{ rombel.siswa_tidak_ikut_ekskul }}</div>
                      <div class="text-[10px] text-red-700">Belum</div>
                    </div>
                  </div>
                </div>

                <!-- Progress Bar -->
                <div class="mb-3">
                  <div class="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Partisipasi</span>
                    <span>{{ rombel.persentase_ikut_ekskul.toFixed(1) }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      class="bg-green-500 h-full transition-all"
                      :style="{ width: `${rombel.persentase_ikut_ekskul}%` }"
                    ></div>
                  </div>
                </div>

                <!-- Ekstrakurikuler List -->
                <div class="flex flex-wrap gap-2">
                  <div
                    v-for="ekskul in rombel.ekstrakurikuler"
                    :key="ekskul.ekstrakurikuler_id"
                    class="px-3 py-1 bg-gray-50 border border-gray-300 rounded-full text-xs"
                  >
                    <span class="font-medium text-gray-700">{{ ekskul.nama_ekstrakurikuler }}:</span>
                    <span class="font-bold text-gray-900 ml-1">{{ ekskul.jumlah_siswa }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty State: No Rombel Data -->
          <div v-else class="mb-8 flex flex-col items-center justify-center py-12 px-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
            <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <i class="fas fa-users-rectangle text-3xl text-gray-400"></i>
            </div>
            <h3 class="text-base font-semibold text-gray-900 mb-1">Belum Ada Data Rombel</h3>
            <p class="text-sm text-gray-600 text-center">Tidak ada data statistik per rombel pada periode ini</p>
          </div>

          <!-- Siswa Tidak Ikut Ekskul -->
          <div v-if="statisticsData.siswa_tidak_ikut_ekskul && statisticsData.siswa_tidak_ikut_ekskul.length > 0" class="mb-8">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Siswa Belum Daftar Ekstrakurikuler</h2>
            
            <div class="overflow-x-auto bg-white border-2 border-gray-200 rounded-lg">
              <table class="w-full text-sm">
                <thead class="bg-gray-700 border-b-2 border-gray-600">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">No</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Nama Lengkap</th>
                    <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Rombel</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="(siswa, index) in statisticsData.siswa_tidak_ikut_ekskul" :key="siswa.peserta_didik_rombel_id" class="hover:bg-gray-50 transition-colors">
                    <td class="px-4 py-3 text-gray-900">{{ index + 1 }}</td>
                    <td class="px-4 py-3 text-gray-900 font-medium">{{ siswa.nama_lengkap }}</td>
                    <td class="px-4 py-3 text-center">
                      <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {{ siswa.nama_rombel }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Empty State: Semua Siswa Sudah Daftar -->
          <div v-else class="flex flex-col items-center justify-center py-12 px-4 bg-green-50 border-2 border-green-200 rounded-lg">
            <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <i class="fas fa-check-circle text-3xl text-green-600"></i>
            </div>
            <h3 class="text-base font-semibold text-green-900 mb-1">Semua Siswa Sudah Terdaftar!</h3>
            <p class="text-sm text-green-700 text-center">Tidak ada siswa yang belum mendaftar ekstrakurikuler</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-12">
          <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <i class="fas fa-chart-bar text-2xl text-gray-400"></i>
          </div>
          <h3 class="text-base font-semibold text-gray-900 mb-1">Belum Ada Data</h3>
          <p class="text-sm text-gray-600">Pilih tahun pelajaran untuk melihat statistik</p>
        </div>
      </div>

      <!-- Tab Content: Dashboard Absensi (Under Development) -->
      <div v-if="activeTab === 'dashboard-absensi'" class="p-4 sm:p-6 md:p-8">
        <div class="flex flex-col items-center justify-center py-16 px-4">
          <div class="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mb-6">
            <i class="fas fa-tools text-3xl text-yellow-600"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Dalam Pengembangan</h3>
          <p class="text-sm text-gray-600 text-center max-w-md">
            Fitur Dashboard Absensi Ekstrakurikuler sedang dalam tahap pengembangan dan akan segera tersedia.
          </p>
        </div>
      </div>

      <!-- Tab Content: Dashboard Penilaian (Under Development) -->
      <div v-if="activeTab === 'dashboard-penilaian'" class="p-4 sm:p-6 md:p-8">
        <div class="flex flex-col items-center justify-center py-16 px-4">
          <div class="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-6">
            <i class="fas fa-wrench text-3xl text-purple-600"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Dalam Pengembangan</h3>
          <p class="text-sm text-gray-600 text-center max-w-md">
            Fitur Dashboard Penilaian Ekstrakurikuler sedang dalam tahap pengembangan dan akan segera tersedia.
          </p>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from 'vue'
import { useToast } from '~/composables/useToast'
import { useAuth } from '~/composables/useAuth'
import { useAuthGuard } from '~/composables/useAuthGuard'
import { getAllStatisticEkstrakurikulerSiswa } from '~/services/ekstrakurikuler'
import DashboardLayout from '~/components/DashboardLayout.vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

useHead({
  title: 'Monitoring Ekstrakurikuler | PINTU SDN Sukapura 01',
  link: [
    {
      rel: 'icon',
      type: 'image/jpeg',
      href: '/logo-sekolah.jpg'
    },
    {
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    }
  ]
})

const { success: showToast, error: showErrorToast } = useToast()
const { getCurrentUser } = useAuth()
const { handle401 } = useAuthGuard()

const currentUser = getCurrentUser()
const isSuperAdmin = computed(() => currentUser?.id === 1)

// State
const activeTab = ref('dashboard-siswa')
const isLoading = ref(false)
const selectedTahunPelajaranId = ref(0)
const selectedRombelId = ref<number | null>(null)
const rombelList = ref<any[]>([])
const tahunPelajaranList = ref<any[]>([])
const statisticsData = ref<any>(null)
const pieChartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

// Colors for pie chart
const colors = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', 
  '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#84CC16'
]

const getColor = (index: number) => colors[index % colors.length]

// Computed - Filter rombel
const filteredRombelList = computed(() => {
  const filtered = rombelList.value.filter((r: any) => r.status === 'active')
  
  if (isSuperAdmin.value) return filtered
  
  const rombelIds = new Set<number>()
  
  if (currentUser?.rombel_guru_kelas_id) {
    rombelIds.add(currentUser.rombel_guru_kelas_id)
  }
  
  if (currentUser?.rombel_bidang_studi && Array.isArray(currentUser.rombel_bidang_studi)) {
    currentUser.rombel_bidang_studi.forEach((id: number) => rombelIds.add(id))
  }
  
  if (rombelIds.size > 0) {
    return filtered.filter((r: any) => rombelIds.has(r.id))
  }
  
  return filtered
})

onMounted(async () => {
  await loadRombel()
  await loadTahunPelajaran()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})

// Watch for statistics data changes to redraw chart
watch(() => statisticsData.value, async () => {
  if (statisticsData.value) {
    await nextTick()
    drawPieChart()
  }
})

async function loadRombel() {
  try {
    const config = useRuntimeConfig()
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    const response = await $fetch<any>(
      `${config.public.apiBase}/api/v1/rombel/get-rombel`,
      {
        method: 'POST',
        body: {
          search: { name: null, status: 'active', kelas_id: null },
          pagination: { limit: 50, page: 1 }
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
    
    // Check if it's a 401 error (invalid or expired token)
    if (error.status === 401 || error.statusCode === 401 || 
        (error.data && error.data.error && error.data.error.includes('token'))) {
      await handle401()
      return
    }
    
    showErrorToast('Gagal Memuat Data', 'Gagal memuat data rombel.')
  }
}

async function loadTahunPelajaran() {
  try {
    const config = useRuntimeConfig()
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    const response = await $fetch<any>(
      `${config.public.apiBase}/api/v1/tahun-pelajaran/get-tahun-pelajaran`,
      {
        method: 'POST',
        body: {
          search: { tahun_pelajaran: null, status: null },
          pagination: { limit: 25, page: 1 }
        },
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    )

    tahunPelajaranList.value = response.data || []
    
    const activeTahun = tahunPelajaranList.value.find((t: any) => t.status === 'active')
    if (activeTahun) {
      selectedTahunPelajaranId.value = activeTahun.id
      await loadStatistics()
    }
  } catch (error: any) {
    console.error('Error loading tahun pelajaran:', error)
    
    // Check if it's a 401 error (invalid or expired token)
    if (error.status === 401 || error.statusCode === 401 || 
        (error.data && error.data.error && error.data.error.includes('token'))) {
      await handle401()
      return
    }
    
    showErrorToast('Gagal Memuat Data', 'Gagal memuat data tahun pelajaran.')
  }
}

async function loadStatistics() {
  if (selectedTahunPelajaranId.value === 0) {
    statisticsData.value = null
    return
  }

  isLoading.value = true

  try {
    const result = await getAllStatisticEkstrakurikulerSiswa(
      selectedTahunPelajaranId.value,
      selectedRombelId.value
    )

    statisticsData.value = result
  } catch (error: any) {
    console.error('Error loading statistics:', error)
    
    // Check if it's a 401 error (invalid or expired token)
    if (error.status === 401 || error.statusCode === 401 || 
        (error.data && error.data.error && error.data.error.includes('token'))) {
      await handle401()
      return
    }
    
    const errorMessage = error?.data?.message || error?.message || 'Terjadi kesalahan saat memuat statistik'
    showErrorToast('Gagal Memuat Data', errorMessage)
  } finally {
    isLoading.value = false
  }
}

function drawPieChart() {
  if (!pieChartCanvas.value || !statisticsData.value) return

  const data = statisticsData.value.statistik_per_ekskul
  if (!data || !Array.isArray(data) || data.length === 0) return

  // Destroy existing chart instance
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = pieChartCanvas.value.getContext('2d')
  if (!ctx) return

  const labels = data.map((item: any) => item.nama_ekstrakurikuler)
  const values = data.map((item: any) => item.total_siswa)
  const backgroundColors = data.map((_: any, index: number) => getColor(index))

  chartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: backgroundColors,
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverOffset: 20
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            padding: 15,
            font: {
              size: 12,
              weight: '600'
            },
            color: '#374151',
            usePointStyle: true,
            pointStyle: 'circle',
            generateLabels: (chart) => {
              const data = chart.data
              if (data.labels && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const value = data.datasets[0].data[i]
                  return {
                    text: `${label}: ${value} siswa`,
                    fillStyle: backgroundColors[i],
                    strokeStyle: '#ffffff',
                    lineWidth: 2,
                    hidden: false,
                    index: i
                  }
                })
              }
              return []
            }
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function(context) {
              const label = context.label || ''
              const value = context.parsed || 0
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
              const percentage = ((value / total) * 100).toFixed(1)
              return `${label}: ${value} siswa (${percentage}%)`
            }
          }
        }
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1000,
        easing: 'easeInOutQuart'
      },
      interaction: {
        mode: 'nearest',
        intersect: true
      }
    }
  })
}
</script>

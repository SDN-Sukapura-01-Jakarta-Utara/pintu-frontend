<template>
  <DashboardLayout>
    <!-- Header Section -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Rekap Kehadiran</h1>
      <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
        Rekap kehadiran siswa per bulan sebagai guru kelas atau guru bidang studi
      </p>
    </div>

    <!-- Detail Absensi Modal -->
    <DetailAbsensiModal
      :is-open="isDetailModalOpen"
      :detail-data="selectedDetailData"
      :bidang-studi-nama="selectedBidangStudiNama"
      @close="closeDetailModal"
      @updated="handleDataUpdated"
    />

    <!-- Main Content -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <div class="px-4 sm:px-6">
          <div class="flex gap-1 overflow-x-auto -mb-px" style="scrollbar-width: thin;">
            <button
              @click="activeTab = 'guru-kelas'"
              :class="[
                'px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 border-b-2 relative cursor-pointer',
                activeTab === 'guru-kelas'
                  ? 'text-red-600 border-b-red-600'
                  : 'text-gray-600 border-b-transparent hover:text-gray-900 hover:border-b-gray-300'
              ]"
            >
              <span class="flex items-center gap-2">
                <i class="fa-solid fa-chalkboard-user w-4 h-4"></i>
                Rekap Kehadiran sebagai Guru Kelas
              </span>
            </button>
            <button
              @click="activeTab = 'guru-mapel'"
              :class="[
                'px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 border-b-2 relative cursor-pointer',
                activeTab === 'guru-mapel'
                  ? 'text-red-600 border-b-red-600'
                  : 'text-gray-600 border-b-transparent hover:text-gray-900 hover:border-b-gray-300'
              ]"
            >
              <span class="flex items-center gap-2">
                <i class="fa-solid fa-book-open w-4 h-4"></i>
                Rekap Kehadiran sebagai Guru Bidang Studi
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Content: Guru Kelas -->
      <div v-if="activeTab === 'guru-kelas'" class="p-4 sm:p-6 md:p-8">
        <!-- Filter Section -->
        <div class="mb-6 pb-6 border-b border-gray-200">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Tahun Pelajaran -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Tahun Pelajaran <span class="text-red-600">*</span>
              </label>
              <select
                v-model.number="filterKelas.tahun_pelajaran_id"
                @change="loadRekapKelas"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              >
                <option :value="0" disabled>Pilih Tahun Pelajaran</option>
                <option v-for="tahun in activeTahunPelajaranList" :key="tahun.id" :value="tahun.id">
                  {{ tahun.tahun_pelajaran }}
                </option>
              </select>
            </div>

            <!-- Rombel -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Rombel <span class="text-red-600">*</span>
              </label>
              <select
                v-model.number="filterKelas.rombel_id"
                @change="loadRekapKelas"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              >
                <option :value="0" disabled>Pilih Rombel</option>
                <option v-for="rombel in activeRombelList" :key="rombel.id" :value="rombel.id">
                  {{ rombel.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Month Navigation -->
        <div v-if="rekapDataKelas" class="mb-6 flex items-center justify-between">
          <button
            @click="prevMonth('kelas')"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-sm cursor-pointer transition-colors"
          >
            <i class="fa-solid fa-chevron-left mr-2"></i>
            Bulan Sebelumnya
          </button>
          <h3 class="text-lg font-bold text-gray-900">
            {{ getMonthName(filterKelas.bulan) }} {{ filterKelas.tahun }}
          </h3>
          <button
            @click="nextMonth('kelas')"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-sm cursor-pointer transition-colors"
          >
            Bulan Selanjutnya
            <i class="fa-solid fa-chevron-right ml-2"></i>
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <div class="flex flex-col items-center gap-3">
            <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
            <p class="text-sm text-gray-600 font-medium">Memuat data rekap...</p>
          </div>
        </div>

        <!-- Rekap Table -->
        <div v-else-if="rekapDataKelas" class="overflow-x-auto">
          <table class="w-full border-collapse text-xs">
            <thead>
              <tr style="background-color: #1f2937;">
                <th rowspan="2" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white;">NO</th>
                <th rowspan="2" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white;">NAMA SISWA</th>
                <th rowspan="2" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white;">P/L</th>
                <th :colspan="daysInMonth" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white;">
                  {{ getMonthName(filterKelas.bulan).toUpperCase() }}
                </th>
                <th colspan="3" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white;">JUMLAH ABSEN</th>
                <th rowspan="2" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white;">JUMLAH</th>
              </tr>
              <tr style="background-color: #1f2937;">
                <th v-for="day in daysInMonth" :key="day" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white; min-width: 40px;">
                  {{ day }}
                </th>
                <th class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white; min-width: 40px;">S</th>
                <th class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white; min-width: 40px;">I</th>
                <th class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white; min-width: 40px;">A</th>
              </tr>
            </thead>
            <tbody v-if="rekapDataKelas.data_siswa && rekapDataKelas.data_siswa.length > 0">
              <tr v-for="(siswa, index) in rekapDataKelas.data_siswa" :key="siswa.peserta_didik_id" class="hover:bg-gray-50">
                <td class="px-2 py-2 text-center border border-gray-200">{{ Number(index) + 1 }}</td>
                <td class="px-2 py-2 border border-gray-200">{{ siswa.nama }}</td>
                <td class="px-2 py-2 text-center border border-gray-200">{{ siswa.jenis_kelamin }}</td>
                <td 
                  v-for="day in daysInMonth" 
                  :key="day" 
                  :class="[
                    'px-2 py-2 text-center border font-semibold', 
                    getStatusForDate(siswa, day).color,
                    getStatusForDate(siswa, day).hasData ? 'border-gray-200 cursor-pointer hover:border-gray-900 hover:border-2 transition-all' : 'border-gray-200'
                  ]" 
                  style="min-width: 40px;"
                  @click="getStatusForDate(siswa, day).hasData && openDetailModal(siswa, getStatusForDate(siswa, day))"
                >
                  {{ getStatusForDate(siswa, day).text }}
                </td>
                <td class="px-2 py-2 text-center border border-gray-200 font-semibold" style="min-width: 40px;">{{ siswa.total_sakit }}</td>
                <td class="px-2 py-2 text-center border border-gray-200 font-semibold" style="min-width: 40px;">{{ siswa.total_izin }}</td>
                <td class="px-2 py-2 text-center border border-gray-200 font-semibold" style="min-width: 40px;">{{ siswa.total_alpa }}</td>
                <td class="px-2 py-2 text-center border border-gray-200 font-bold bg-gray-50">{{ siswa.total_absen }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td :colspan="daysInMonth + 7" class="px-4 py-8 text-center text-gray-500">
                  Belum ada data siswa
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-12">
          <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <i class="fa-solid fa-calendar-xmark text-2xl text-gray-400"></i>
          </div>
          <h3 class="text-base font-semibold text-gray-900 mb-1">Belum ada data rekap</h3>
          <p class="text-sm text-gray-600">Pilih tahun pelajaran dan rombel untuk melihat rekap kehadiran</p>
        </div>
      </div>

      <!-- Tab Content: Guru Mapel -->
      <div v-if="activeTab === 'guru-mapel'" class="p-4 sm:p-6 md:p-8">
        <!-- Filter Section -->
        <div class="mb-6 pb-6 border-b border-gray-200">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <!-- Bidang Studi -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Bidang Studi <span class="text-red-600">*</span>
              </label>
              <select
                v-model.number="filterMapel.bidang_studi_id"
                @change="loadRekapMapel"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              >
                <option :value="0" disabled>Pilih Bidang Studi</option>
                <option v-for="bidang in activeBidangStudiList" :key="bidang.id" :value="bidang.id">
                  {{ bidang.name }}
                </option>
              </select>
            </div>

            <!-- Tahun Pelajaran -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Tahun Pelajaran <span class="text-red-600">*</span>
              </label>
              <select
                v-model.number="filterMapel.tahun_pelajaran_id"
                @change="loadRekapMapel"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              >
                <option :value="0" disabled>Pilih Tahun Pelajaran</option>
                <option v-for="tahun in activeTahunPelajaranList" :key="tahun.id" :value="tahun.id">
                  {{ tahun.tahun_pelajaran }}
                </option>
              </select>
            </div>

            <!-- Rombel -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Rombel <span class="text-red-600">*</span>
              </label>
              <select
                v-model.number="filterMapel.rombel_id"
                @change="loadRekapMapel"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              >
                <option :value="0" disabled>Pilih Rombel</option>
                <option v-for="rombel in activeRombelList" :key="rombel.id" :value="rombel.id">
                  {{ rombel.name }}
                </option>
              </select>
            </div>

            <!-- Tampilan Dropdown -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Tampilan <span class="text-red-600">*</span>
              </label>
              <select
                v-model="filterMapel.view_type"
                @change="changeViewType"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              >
                <option value="per_bulan">Per Bulan</option>
                <option value="per_semester">Per Semester</option>
              </select>
            </div>

            <!-- Semester Dropdown (conditional) -->
            <div v-if="filterMapel.view_type === 'per_semester'">
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Semester <span class="text-red-600">*</span>
              </label>
              <select
                v-model.number="filterMapel.semester"
                @change="loadRekapMapel"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              >
                <option :value="1">Semester 1 (Juli - Desember)</option>
                <option :value="2">Semester 2 (Januari - Juni)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Month Navigation (only for per_bulan) -->
        <div v-if="rekapDataMapel && filterMapel.view_type === 'per_bulan'" class="mb-6 flex items-center justify-between">
          <button
            @click="prevMonth('mapel')"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-sm cursor-pointer transition-colors"
          >
            <i class="fa-solid fa-chevron-left mr-2"></i>
            Bulan Sebelumnya
          </button>
          <h3 class="text-lg font-bold text-gray-900">
            {{ getMonthName(filterMapel.bulan!) }} {{ filterMapel.tahun }}
          </h3>
          <button
            @click="nextMonth('mapel')"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-sm cursor-pointer transition-colors"
          >
            Bulan Selanjutnya
            <i class="fa-solid fa-chevron-right ml-2"></i>
          </button>
        </div>

        <!-- Semester Display (only for per_semester) -->
        <div v-if="rekapDataMapel && filterMapel.view_type === 'per_semester'" class="mb-6 text-center">
          <h3 class="text-lg font-bold text-gray-900">
            Semester {{ filterMapel.semester }} - Tahun {{ filterMapel.tahun }}
          </h3>
          <p class="text-sm text-gray-600 mt-1">
            {{ filterMapel.semester === 1 ? 'Juli - Desember' : 'Januari - Juni' }}
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <div class="flex flex-col items-center gap-3">
            <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
            <p class="text-sm text-gray-600 font-medium">Memuat data rekap...</p>
          </div>
        </div>

        <!-- Rekap Table -->
        <div v-else-if="rekapDataMapel" class="overflow-x-auto">
          <table class="w-full border-collapse text-xs">
            <thead>
              <!-- Row 1: Month Names -->
              <tr style="background-color: #1f2937;">
                <th rowspan="3" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white;">NO</th>
                <th rowspan="3" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white;">NAMA SISWA</th>
                <th rowspan="3" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white;">P/L</th>
                <th v-for="month in getMonthsStructureMapel" :key="month.monthKey" :colspan="month.columns.length" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white;">
                  {{ month.monthName.toUpperCase() }}
                </th>
                <th colspan="3" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white;">JUMLAH ABSEN</th>
                <th rowspan="3" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white;">JUMLAH</th>
              </tr>
              <!-- Row 2: Pertemuan Ke -->
              <tr style="background-color: #1f2937;">
                <th v-for="(dateInfo, idx) in getDateListMapel" :key="idx" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white; min-width: 40px;">
                  {{ dateInfo.pertemuan_ke ? `P${dateInfo.pertemuan_ke}` : '-' }}
                </th>
                <th rowspan="2" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white; min-width: 40px;">S</th>
                <th rowspan="2" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white; min-width: 40px;">I</th>
                <th rowspan="2" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white; min-width: 40px;">A</th>
              </tr>
              <!-- Row 3: Date Numbers -->
              <tr style="background-color: #1f2937;">
                <th v-for="(dateInfo, idx) in getDateListMapel" :key="idx" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white; min-width: 40px;">
                  {{ dateInfo.day || '-' }}
                </th>
              </tr>
            </thead>
            <tbody v-if="rekapDataMapel.data_siswa && rekapDataMapel.data_siswa.length > 0">
              <tr v-for="(siswa, index) in rekapDataMapel.data_siswa" :key="siswa.peserta_didik_id" class="hover:bg-gray-50">
                <td class="px-2 py-2 text-center border border-gray-200">{{ Number(index) + 1 }}</td>
                <td class="px-2 py-2 border border-gray-200">{{ siswa.nama }}</td>
                <td class="px-2 py-2 text-center border border-gray-200">{{ siswa.jenis_kelamin }}</td>
                <td 
                  v-for="(dateInfo, idx) in getDateListMapel" 
                  :key="idx" 
                  :class="[
                    'px-2 py-2 text-center border font-semibold', 
                    getStatusForDateMapel(siswa, dateInfo.date).color,
                    getStatusForDateMapel(siswa, dateInfo.date).hasData ? 'border-gray-200 cursor-pointer hover:border-gray-900 hover:border-2 transition-all' : 'border-gray-200'
                  ]" 
                  style="min-width: 40px;"
                  @click="getStatusForDateMapel(siswa, dateInfo.date).hasData && openDetailModal(siswa, getStatusForDateMapel(siswa, dateInfo.date), rekapDataMapel.bidang_studi_nama)"
                >
                  {{ getStatusForDateMapel(siswa, dateInfo.date).text }}
                </td>
                <td class="px-2 py-2 text-center border border-gray-200 font-semibold" style="min-width: 40px;">{{ siswa.total_sakit }}</td>
                <td class="px-2 py-2 text-center border border-gray-200 font-semibold" style="min-width: 40px;">{{ siswa.total_izin }}</td>
                <td class="px-2 py-2 text-center border border-gray-200 font-semibold" style="min-width: 40px;">{{ siswa.total_alpa }}</td>
                <td class="px-2 py-2 text-center border border-gray-200 font-bold bg-gray-50">{{ siswa.total_absen }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td :colspan="getTotalDatesMapel + 7" class="px-4 py-8 text-center text-gray-500">
                  Belum ada data siswa
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-12">
          <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <i class="fa-solid fa-calendar-xmark text-2xl text-gray-400"></i>
          </div>
          <h3 class="text-base font-semibold text-gray-900 mb-1">Belum ada data rekap</h3>
          <p class="text-sm text-gray-600">Pilih bidang studi, tahun pelajaran, dan rombel untuk melihat rekap kehadiran</p>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRombelStore } from '~/stores/RombelStore'
import { useTahunPelajaranStore } from '~/stores/TahunPelajaranStore'
import { useBidangStudiStore } from '~/stores/BidangStudiStore'
import { getRekapAbsensi } from '~/services/absensi'
import DashboardLayout from '~/components/DashboardLayout.vue'
import DetailAbsensiModal from '~/components/modals/DetailAbsensiModal.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

useHead({
  title: 'Rekap Kehadiran | PINTU SDN Sukapura 01',
  link: [
    {
      rel: 'icon',
      type: 'image/jpeg',
      href: '/logo-sekolah.jpg'
    }
  ]
})

const route = useRoute()
const rombelStore = useRombelStore()
const tahunPelajaranStore = useTahunPelajaranStore()
const bidangStudiStore = useBidangStudiStore()

// State
const activeTab = ref('guru-kelas')
const isLoading = ref(false)

const rombelList = ref<any[]>([])
const tahunPelajaranList = ref<any[]>([])
const bidangStudiList = ref<any[]>([])
const rekapDataKelas = ref<any>(null)
const rekapDataMapel = ref<any>(null)

// Modal state
const isDetailModalOpen = ref(false)
const selectedDetailData = ref<any>(null)
const selectedBidangStudiNama = ref<string>('')

// Get current date
const today = new Date()
const currentMonth = today.getMonth() + 1 // 1-12
const currentYear = today.getFullYear()
// Semester 1: Juli-Desember (7-12), Semester 2: Januari-Juni (1-6)
const currentSemester = currentMonth >= 7 && currentMonth <= 12 ? 1 : 2

const filterKelas = ref({
  tahun_pelajaran_id: 0,
  rombel_id: 0,
  tanggal_mulai: '',
  tanggal_selesai: '',
  bulan: currentMonth,
  tahun: currentYear,
  bidang_studi_id: null
})

const filterMapel = ref({
  tahun_pelajaran_id: 0,
  rombel_id: 0,
  tanggal_mulai: '',
  tanggal_selesai: '',
  bulan: currentMonth,
  tahun: currentYear,
  bidang_studi_id: 0,
  semester: currentSemester,
  view_type: 'per_bulan' as 'per_bulan' | 'per_semester'
})

// Computed
const activeRombelList = computed(() => {
  return rombelList.value.filter((r: any) => r.status === 'active')
})

const activeTahunPelajaranList = computed(() => {
  return tahunPelajaranList.value.filter((t: any) => t.status === 'active')
})

const activeBidangStudiList = computed(() => {
  return bidangStudiList.value.filter((b: any) => b.status === 'active')
})

const daysInMonth = computed(() => {
  return new Date(filterKelas.value.tahun, filterKelas.value.bulan, 0).getDate()
})

const daysInMonthMapel = computed(() => {
  if (filterMapel.value.view_type === 'per_bulan' && filterMapel.value.bulan) {
    return new Date(filterMapel.value.tahun, filterMapel.value.bulan, 0).getDate()
  }
  return 0
})

// Get header title for mapel table
const getHeaderTitleMapel = computed(() => {
  if (filterMapel.value.view_type === 'per_bulan' && filterMapel.value.bulan) {
    return getMonthName(filterMapel.value.bulan).toUpperCase()
  } else if (filterMapel.value.view_type === 'per_semester') {
    return `SEMESTER ${filterMapel.value.semester}`
  }
  return ''
})

// Get grouped months structure for mapel table
const getMonthsStructureMapel = computed(() => {
  // Determine which months to show based on view type
  let monthsToShow: number[] = []
  
  if (filterMapel.value.view_type === 'per_bulan' && filterMapel.value.bulan) {
    monthsToShow = [filterMapel.value.bulan]
  } else if (filterMapel.value.view_type === 'per_semester' && filterMapel.value.semester) {
    // Always show all 6 months in the semester
    monthsToShow = filterMapel.value.semester === 1 
      ? [7, 8, 9, 10, 11, 12] // Juli - Desember
      : [1, 2, 3, 4, 5, 6] // Januari - Juni
  }
  
  // If no data, create default structure
  if (!rekapDataMapel.value || !rekapDataMapel.value.data_siswa || rekapDataMapel.value.data_siswa.length === 0) {
    const monthsArray: any[] = []
    monthsToShow.forEach(month => {
      const monthName = getMonthName(month)
      const columns = []
      for (let i = 1; i <= 5; i++) {
        columns.push({
          date: null,
          day: null,
          pertemuan_ke: i,
          monthName: monthName
        })
      }
      monthsArray.push({
        monthKey: `${filterMapel.value.tahun}-${String(month).padStart(2, '0')}`,
        monthName: monthName,
        columns
      })
    })
    return monthsArray
  }
  
  const firstStudent = rekapDataMapel.value.data_siswa[0]
  
  // If detail_per_tanggal is empty, create default structure
  if (!firstStudent.detail_per_tanggal || firstStudent.detail_per_tanggal.length === 0) {
    const monthsArray: any[] = []
    monthsToShow.forEach(month => {
      const monthName = getMonthName(month)
      const columns = []
      for (let i = 1; i <= 5; i++) {
        columns.push({
          date: null,
          day: null,
          pertemuan_ke: i,
          monthName: monthName
        })
      }
      monthsArray.push({
        monthKey: `${filterMapel.value.tahun}-${String(month).padStart(2, '0')}`,
        monthName: monthName,
        columns
      })
    })
    return monthsArray
  }
  
  // Group existing data by month
  const monthsMap = new Map<string, any[]>()
  
  firstStudent.detail_per_tanggal.forEach((detail: any) => {
    const date = new Date(detail.tanggal)
    const month = date.getMonth() + 1
    const monthKey = `${date.getFullYear()}-${String(month).padStart(2, '0')}`
    const monthName = getMonthName(month)
    
    if (!monthsMap.has(monthKey)) {
      monthsMap.set(monthKey, [])
    }
    
    monthsMap.get(monthKey)!.push({
      date: detail.tanggal,
      day: date.getDate(),
      pertemuan_ke: detail.pertemuan_ke || null,
      monthName: monthName
    })
  })
  
  // Build structure for all months that should be shown
  const monthsArray: any[] = []
  
  monthsToShow.forEach(month => {
    const monthKey = `${filterMapel.value.tahun}-${String(month).padStart(2, '0')}`
    const monthName = getMonthName(month)
    
    // Check if we have data for this month
    const monthData = monthsMap.get(monthKey)
    
    if (monthData && monthData.length > 0) {
      // Sort by pertemuan_ke
      monthData.sort((a, b) => (a.pertemuan_ke || 0) - (b.pertemuan_ke || 0))
      
      // Ensure minimum 5 columns per month
      const minPertemuan = 5
      const maxPertemuan = Math.max(minPertemuan, monthData.length)
      
      const columns = []
      for (let i = 1; i <= maxPertemuan; i++) {
        const existingData = monthData.find(d => d.pertemuan_ke === i)
        if (existingData) {
          columns.push(existingData)
        } else {
          // Add placeholder for missing pertemuan
          columns.push({
            date: null,
            day: null,
            pertemuan_ke: i,
            monthName: monthName
          })
        }
      }
      
      monthsArray.push({
        monthKey,
        monthName: monthName,
        columns
      })
    } else {
      // No data for this month, create default structure with 5 pertemuan
      const columns = []
      for (let i = 1; i <= 5; i++) {
        columns.push({
          date: null,
          day: null,
          pertemuan_ke: i,
          monthName: monthName
        })
      }
      monthsArray.push({
        monthKey,
        monthName: monthName,
        columns
      })
    }
  })
  
  return monthsArray
})

// Get total columns for mapel table
const getTotalDatesMapel = computed(() => {
  return getMonthsStructureMapel.value.reduce((total, month) => total + month.columns.length, 0)
})

// Get flat date list for mapel table
const getDateListMapel = computed(() => {
  const flatList: any[] = []
  getMonthsStructureMapel.value.forEach(month => {
    flatList.push(...month.columns)
  })
  return flatList
})

// Methods
const getMonthName = (month: number | undefined) => {
  if (!month) return ''
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  return months[month - 1] || ''
}

const getStatusForDate = (siswa: any, day: number) => {
  const dateStr = `${filterKelas.value.tahun}-${String(filterKelas.value.bulan).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const detail = siswa.detail_per_tanggal?.find((d: any) => d.tanggal === dateStr)
  
  if (!detail) return { text: '-', color: '', hasData: false, detail: null }
  
  const result = {
    hasData: true,
    detail: detail
  }
  
  switch (detail.status) {
    case 'hadir': return { ...result, text: '✓', color: 'bg-green-100' }
    case 'izin': return { ...result, text: 'I', color: 'bg-yellow-100' }
    case 'sakit': return { ...result, text: 'S', color: 'bg-blue-100' }
    case 'alpa': return { ...result, text: 'A', color: 'bg-red-100' }
    default: return { ...result, text: '-', color: '' }
  }
}

const getStatusForDateMapel = (siswa: any, dateStr: string | null) => {
  if (!dateStr) return { text: '-', color: '', hasData: false, detail: null }
  
  const detail = siswa.detail_per_tanggal?.find((d: any) => d.tanggal === dateStr)
  
  if (!detail) return { text: '-', color: '', hasData: false, detail: null }
  
  const result = {
    hasData: true,
    detail: detail
  }
  
  switch (detail.status) {
    case 'hadir': return { ...result, text: '✓', color: 'bg-green-100' }
    case 'izin': return { ...result, text: 'I', color: 'bg-yellow-100' }
    case 'sakit': return { ...result, text: 'S', color: 'bg-blue-100' }
    case 'alpa': return { ...result, text: 'A', color: 'bg-red-100' }
    default: return { ...result, text: '-', color: '' }
  }
}

const openDetailModal = (siswa: any, statusData: any, bidangStudiNama?: string) => {
  if (!statusData.hasData || !statusData.detail) return
  
  selectedDetailData.value = {
    id: statusData.detail.id,
    nama: siswa.nama,
    nis: siswa.nis,
    jenis_kelamin: siswa.jenis_kelamin,
    tanggal: statusData.detail.tanggal,
    pertemuan_ke: statusData.detail.pertemuan_ke,
    status: statusData.detail.status,
    waktu_absen: statusData.detail.waktu_absen,
    metode_input: statusData.detail.metode_input,
    keterangan: statusData.detail.keterangan,
    file_surat: statusData.detail.file_surat,
    dicatat_oleh: statusData.detail.dicatat_oleh,
    dicatat_oleh_id: statusData.detail.dicatat_oleh_id
  }
  
  selectedBidangStudiNama.value = bidangStudiNama || ''
  isDetailModalOpen.value = true
}

const closeDetailModal = () => {
  isDetailModalOpen.value = false
  selectedDetailData.value = null
  selectedBidangStudiNama.value = ''
}

const handleDataUpdated = () => {
  // Reload data based on active tab
  if (activeTab.value === 'guru-kelas') {
    loadRekapKelas()
  } else {
    loadRekapMapel()
  }
}

const loadRombelList = async () => {
  try {
    const result = await rombelStore.fetchRombels(1, 100, { status: 'active' })
    if (result.success) {
      rombelList.value = rombelStore.rombels
    }
  } catch (err) {
    console.error('Error loading rombel:', err)
  }
}

const loadTahunPelajaranList = async () => {
  try {
    const result = await tahunPelajaranStore.fetchTahunPelajarans(1, 100)
    if (result.success) {
      tahunPelajaranList.value = tahunPelajaranStore.tahunPelajarans
      // Set default to active tahun pelajaran
      const activeTahun = activeTahunPelajaranList.value[0]
      if (activeTahun) {
        filterKelas.value.tahun_pelajaran_id = activeTahun.id
        filterMapel.value.tahun_pelajaran_id = activeTahun.id
      }
    }
  } catch (err) {
    console.error('Error loading tahun pelajaran:', err)
  }
}

const loadBidangStudiList = async () => {
  try {
    const result = await bidangStudiStore.fetchBidangStudis(1, 100, { status: 'active' })
    if (result.success) {
      bidangStudiList.value = bidangStudiStore.bidangStudis
    }
  } catch (err) {
    console.error('Error loading bidang studi:', err)
  }
}

const loadRekapKelas = async () => {
  if (!filterKelas.value.tahun_pelajaran_id || !filterKelas.value.rombel_id) {
    rekapDataKelas.value = null
    return
  }

  isLoading.value = true
  try {
    const response = await getRekapAbsensi(filterKelas.value)
    rekapDataKelas.value = response.data || { data_siswa: [] }
  } catch (err) {
    console.error('Error loading rekap kelas:', err)
    // Set empty data instead of null to show table
    rekapDataKelas.value = { data_siswa: [] }
  } finally {
    isLoading.value = false
  }
}

const loadRekapMapel = async () => {
  if (!filterMapel.value.tahun_pelajaran_id || !filterMapel.value.rombel_id || !filterMapel.value.bidang_studi_id) {
    rekapDataMapel.value = null
    return
  }

  isLoading.value = true
  try {
    const requestData: any = {
      tahun_pelajaran_id: filterMapel.value.tahun_pelajaran_id,
      rombel_id: filterMapel.value.rombel_id,
      bidang_studi_id: filterMapel.value.bidang_studi_id,
      tahun: filterMapel.value.tahun,
      tanggal_mulai: '',
      tanggal_selesai: ''
    }

    if (filterMapel.value.view_type === 'per_bulan') {
      requestData.bulan = filterMapel.value.bulan
      requestData.semester = null
    } else {
      requestData.bulan = null
      requestData.semester = filterMapel.value.semester
    }

    const response = await getRekapAbsensi(requestData)
    rekapDataMapel.value = response.data || { data_siswa: [] }
  } catch (err) {
    console.error('Error loading rekap mapel:', err)
    // Set empty data instead of null to show table
    rekapDataMapel.value = { data_siswa: [] }
  } finally {
    isLoading.value = false
  }
}

const changeViewType = () => {
  if (filterMapel.value.view_type === 'per_bulan') {
    filterMapel.value.bulan = currentMonth
    filterMapel.value.semester = currentSemester
  } else {
    filterMapel.value.bulan = currentMonth
    filterMapel.value.semester = currentSemester
  }
  loadRekapMapel()
}

const prevMonth = (type: 'kelas' | 'mapel') => {
  if (type === 'kelas') {
    if (filterKelas.value.bulan === 1) {
      filterKelas.value.bulan = 12
      filterKelas.value.tahun--
    } else {
      filterKelas.value.bulan--
    }
    loadRekapKelas()
  } else {
    if (filterMapel.value.view_type === 'per_bulan') {
      if (filterMapel.value.bulan === 1) {
        filterMapel.value.bulan = 12
        filterMapel.value.tahun--
      } else {
        filterMapel.value.bulan--
      }
      loadRekapMapel()
    }
  }
}

const nextMonth = (type: 'kelas' | 'mapel') => {
  if (type === 'kelas') {
    if (filterKelas.value.bulan === 12) {
      filterKelas.value.bulan = 1
      filterKelas.value.tahun++
    } else {
      filterKelas.value.bulan++
    }
    loadRekapKelas()
  } else {
    if (filterMapel.value.view_type === 'per_bulan') {
      if (filterMapel.value.bulan === 12) {
        filterMapel.value.bulan = 1
        filterMapel.value.tahun++
      } else {
        filterMapel.value.bulan++
      }
      loadRekapMapel()
    }
  }
}

onMounted(async () => {
  await Promise.all([loadRombelList(), loadTahunPelajaranList(), loadBidangStudiList()])
  
  // Check for query parameters from input kehadiran redirect
  if (route.query.tab) {
    activeTab.value = route.query.tab as string
  }
  
  if (route.query.tab === 'guru-kelas' && route.query.rombel_id) {
    filterKelas.value.rombel_id = Number(route.query.rombel_id)
    if (route.query.tahun_pelajaran_id) {
      filterKelas.value.tahun_pelajaran_id = Number(route.query.tahun_pelajaran_id)
    }
    // Load data after filters are set
    setTimeout(() => {
      loadRekapKelas()
    }, 500)
  }
  
  if (route.query.tab === 'guru-mapel' && route.query.rombel_id && route.query.bidang_studi_id) {
    filterMapel.value.rombel_id = Number(route.query.rombel_id)
    filterMapel.value.bidang_studi_id = Number(route.query.bidang_studi_id)
    if (route.query.tahun_pelajaran_id) {
      filterMapel.value.tahun_pelajaran_id = Number(route.query.tahun_pelajaran_id)
    }
    // Load data after filters are set
    setTimeout(() => {
      loadRekapMapel()
    }, 500)
  }
})
</script>

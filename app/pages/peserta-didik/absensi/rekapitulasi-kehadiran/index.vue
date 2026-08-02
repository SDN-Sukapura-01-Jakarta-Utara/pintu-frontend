<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <StudentSidebar :is-open="isSidebarOpen" :is-loading="isLoggingOut" @close="isSidebarOpen = false" @logout="handleLogout" />
    <div :class="['flex-1 flex flex-col transition-all duration-300 overflow-hidden', 'md:ml-20', isSidebarOpen ? 'md:ml-72' : 'md:ml-20']">
      <StudentNavbar :student="student" :is-loading="isLoggingOut" page-title="Rekapitulasi Kehadiran" @toggle-sidebar="isSidebarOpen = !isSidebarOpen" @logout="handleLogout" />
      <div class="flex-1 overflow-y-auto overflow-x-hidden w-full">
        <div class="p-4 sm:p-6 w-full max-w-full">
          <div class="mb-6">
            <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Rekapitulasi Kehadiran</h1>
            <p class="text-xs sm:text-sm md:text-base text-gray-600 mt-1">Rekapitulasi data kehadiran dan ketepatan waktu siswa</p>
          </div>
          
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8">
            <!-- Filter Section -->
            <div class="mb-6 pb-6 border-b border-gray-200">
              <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-filter text-red-600"></i>Filter Data
              </h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">Tahun Pelajaran <span class="text-red-600">*</span></label>
                  <select v-model.number="filters.tahun_pelajaran_id" @change="loadRekapData" class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm">
                    <option v-for="tp in tahunPelajaranList" :key="tp.tahun_pelajaran_id" :value="tp.tahun_pelajaran_id">{{ tp.tahun_pelajaran }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">Semester <span class="text-red-600">*</span></label>
                  <select v-model.number="filters.semester" @change="loadRekapData" class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm">
                    <option :value="1">Semester 1</option>
                    <option :value="2">Semester 2</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">Rombel <span class="text-red-600">*</span></label>
                  <select v-model.number="filters.rombel_id" @change="loadRekapData" class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm">
                    <option v-for="rombel in rombelList" :key="rombel.rombel_id" :value="rombel.rombel_id">{{ rombel.rombel_name }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">Bulan <span class="text-red-600">*</span></label>
                  <select v-model.number="filters.bulan" @change="loadRekapData" class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm">
                    <option :value="1">Januari</option>
                    <option :value="2">Februari</option>
                    <option :value="3">Maret</option>
                    <option :value="4">April</option>
                    <option :value="5">Mei</option>
                    <option :value="6">Juni</option>
                    <option :value="7">Juli</option>
                    <option :value="8">Agustus</option>
                    <option :value="9">September</option>
                    <option :value="10">Oktober</option>
                    <option :value="11">November</option>
                    <option :value="12">Desember</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">Tahun <span class="text-red-600">*</span></label>
                  <input v-model.number="filters.tahun" type="number" @change="loadRekapData" class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">Peserta Didik</label>
                  <input type="text" :value="student?.nama || '-'" disabled class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-700 text-sm cursor-not-allowed" />
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="flex items-center justify-center py-12">
              <div class="flex flex-col items-center gap-3">
                <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
                <p class="text-sm text-gray-600 font-medium">Memuat data rekapitulasi...</p>
              </div>
            </div>

            <!-- Data Content -->
            <div v-else-if="rekapData" class="space-y-6">
              <!-- Informasi Hari Ini -->
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="fa-solid fa-calendar-day text-blue-600"></i>
                  Kehadiran Hari Ini
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="bg-white rounded-lg p-4 border border-blue-200">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                        <i class="fa-solid fa-sign-in-alt text-green-600 text-xl"></i>
                      </div>
                      <div>
                        <p class="text-xs text-gray-600 font-semibold">Jam Kedatangan</p>
                        <p class="text-2xl font-bold text-gray-900">{{ rekapData.hari_ini?.jam_datang || '-' }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="bg-white rounded-lg p-4 border border-blue-200">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                        <i class="fa-solid fa-sign-out-alt text-red-600 text-xl"></i>
                      </div>
                      <div>
                        <p class="text-xs text-gray-600 font-semibold">Jam Kepulangan</p>
                        <p class="text-2xl font-bold text-gray-900">{{ rekapData.hari_ini?.jam_pulang || '-' }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Summary Ketepatan Waktu -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center">
                      <i class="fa-solid fa-clock text-white text-xl"></i>
                    </div>
                    <div>
                      <p class="text-xs text-green-600 font-semibold uppercase">Total Tepat Waktu</p>
                      <p class="text-3xl font-bold text-green-900">{{ rekapData.summary?.total_tepat_waktu || 0 }}</p>
                    </div>
                  </div>
                  <div class="pt-3 border-t border-green-200">
                    <p class="text-xs text-green-700">Kehadiran tepat waktu bulan ini</p>
                  </div>
                </div>
                <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border-2 border-red-200">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-12 h-12 rounded-lg bg-red-500 flex items-center justify-center">
                      <i class="fa-solid fa-clock text-white text-xl"></i>
                    </div>
                    <div>
                      <p class="text-xs text-red-600 font-semibold uppercase">Total Terlambat</p>
                      <p class="text-3xl font-bold text-red-900">{{ rekapData.summary?.total_terlambat || 0 }}</p>
                    </div>
                  </div>
                  <div class="pt-3 border-t border-red-200">
                    <p class="text-xs text-red-700">Keterlambatan bulan ini</p>
                  </div>
                </div>
              </div>

              <!-- Summary Kehadiran -->
              <div class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b-2 border-gray-200">
                  <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <i class="fa-solid fa-chart-pie text-red-600"></i>
                    Ringkasan Kehadiran Bulan Ini
                  </h3>
                </div>
                <div class="p-6">
                  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 border-2 border-green-200">
                      <div class="flex items-center gap-2 mb-2">
                        <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <i class="fa-solid fa-check text-green-600"></i>
                        </div>
                        <div>
                          <p class="text-xs text-green-600 font-semibold">Hadir</p>
                          <p class="text-2xl font-bold text-green-900">{{ rekapData.summary?.total_hadir || 0 }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border-2 border-blue-200">
                      <div class="flex items-center gap-2 mb-2">
                        <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <i class="fa-solid fa-notes-medical text-blue-600"></i>
                        </div>
                        <div>
                          <p class="text-xs text-blue-600 font-semibold">Sakit</p>
                          <p class="text-2xl font-bold text-blue-900">{{ rekapData.summary?.total_sakit || 0 }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="bg-gradient-to-br from-yellow-50 to-white rounded-lg p-4 border-2 border-yellow-200">
                      <div class="flex items-center gap-2 mb-2">
                        <div class="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                          <i class="fa-solid fa-hand-paper text-yellow-600"></i>
                        </div>
                        <div>
                          <p class="text-xs text-yellow-600 font-semibold">Izin</p>
                          <p class="text-2xl font-bold text-yellow-900">{{ rekapData.summary?.total_izin || 0 }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="bg-gradient-to-br from-red-50 to-white rounded-lg p-4 border-2 border-red-200">
                      <div class="flex items-center gap-2 mb-2">
                        <div class="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                          <i class="fa-solid fa-times text-red-600"></i>
                        </div>
                        <div>
                          <p class="text-xs text-red-600 font-semibold">Alpa</p>
                          <p class="text-2xl font-bold text-red-900">{{ rekapData.summary?.total_alpa || 0 }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Tabel Rekap Absensi -->
              <div class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b-2 border-gray-200">
                  <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <i class="fa-solid fa-table text-red-600"></i>
                    Detail Rekap Absensi
                  </h3>
                </div>
                <div class="overflow-x-auto">
                  <table class="w-full border-collapse">
                    <thead class="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">Hari</th>
                        <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">Tanggal</th>
                        <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">Jam Kedatangan</th>
                        <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">Jam Kepulangan</th>
                        <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">Status Kedatangan</th>
                        <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">Status Kehadiran</th>
                        <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">Keterangan</th>
                        <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">Surat</th>
                        <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Metode Input</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      <tr v-for="(absensi, index) in rekapData.detail_absensi" :key="index" :class="[
                        'transition-colors',
                        isWeekend(absensi.tanggal) ? 'bg-red-50' : 'hover:bg-gray-50'
                      ]">
                        <!-- Kolom Hari -->
                        <td class="px-4 py-3 text-sm font-semibold text-gray-900 whitespace-nowrap border-r border-gray-200">
                          {{ getHari(absensi.tanggal) }}
                        </td>
                        <!-- Kolom Tanggal -->
                        <td class="px-4 py-3 text-sm font-semibold text-gray-900 whitespace-nowrap border-r border-gray-200">
                          {{ formatTanggalOnly(absensi.tanggal) }}
                        </td>
                        
                        <!-- Jika weekend, tampilkan LIBUR -->
                        <template v-if="isWeekend(absensi.tanggal)">
                          <td colspan="7" class="px-4 py-4 text-center">
                            <span class="text-gray-500 italic text-sm">Libur</span>
                          </td>
                        </template>
                        
                        <!-- Jika bukan weekend, tampilkan data normal -->
                        <template v-else>
                          <td class="px-4 py-3 text-sm text-center text-gray-700 whitespace-nowrap border-r border-gray-200">
                            {{ absensi.jam_kedatangan || '-' }}
                          </td>
                          <td class="px-4 py-3 text-sm text-center text-gray-700 whitespace-nowrap border-r border-gray-200">
                            {{ absensi.jam_kepulangan || '-' }}
                          </td>
                          <td class="px-4 py-3 text-center whitespace-nowrap border-r border-gray-200">
                            <span v-if="absensi.status_kedatangan" class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold" :class="{
                              'bg-green-100 text-green-800': absensi.status_kedatangan === 'Tepat Waktu',
                              'bg-red-100 text-red-800': absensi.status_kedatangan === 'Terlambat'
                            }">
                              <i class="fa-solid" :class="absensi.status_kedatangan === 'Tepat Waktu' ? 'fa-check' : 'fa-clock'"></i>
                              {{ absensi.status_kedatangan }}
                            </span>
                            <span v-else class="text-sm text-gray-400">-</span>
                          </td>
                          <td class="px-4 py-3 text-center whitespace-nowrap border-r border-gray-200">
                            <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold uppercase" :class="{
                              'bg-green-100 text-green-800': absensi.status_kehadiran === 'hadir',
                              'bg-blue-100 text-blue-800': absensi.status_kehadiran === 'sakit',
                              'bg-yellow-100 text-yellow-800': absensi.status_kehadiran === 'izin',
                              'bg-red-100 text-red-800': absensi.status_kehadiran === 'alpa'
                            }">
                              <i class="fa-solid" :class="{
                                'fa-check': absensi.status_kehadiran === 'hadir',
                                'fa-notes-medical': absensi.status_kehadiran === 'sakit',
                                'fa-hand-paper': absensi.status_kehadiran === 'izin',
                                'fa-times': absensi.status_kehadiran === 'alpa'
                              }"></i>
                              {{ absensi.status_kehadiran }}
                            </span>
                          </td>
                          <td class="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">
                            <span v-if="absensi.keterangan">{{ absensi.keterangan }}</span>
                            <span v-else class="text-gray-400">-</span>
                          </td>
                          <td class="px-4 py-3 text-center whitespace-nowrap border-r border-gray-200">
                            <a v-if="absensi.file_surat" :href="absensi.file_surat" target="_blank" class="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-semibold">
                              <i class="fa-solid fa-file-pdf"></i>
                              Lihat
                            </a>
                            <span v-else class="text-gray-400">-</span>
                          </td>
                          <td class="px-4 py-3 text-center whitespace-nowrap">
                            <span class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold" :class="{
                              'bg-purple-100 text-purple-800': absensi.metode_input === 'auto',
                              'bg-gray-100 text-gray-800': absensi.metode_input === 'manual'
                            }">
                              <i class="fa-solid" :class="absensi.metode_input === 'auto' ? 'fa-robot' : 'fa-keyboard'"></i>
                              {{ absensi.metode_input }}
                            </span>
                          </td>
                        </template>
                      </tr>
                      <tr v-if="!rekapData.detail_absensi || rekapData.detail_absensi.length === 0">
                        <td colspan="9" class="px-4 py-8 text-center text-gray-500">
                          <i class="fa-solid fa-inbox text-4xl mb-2"></i>
                          <p>Belum ada data absensi</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="flex flex-col items-center justify-center py-16">
              <div class="relative mb-6">
                <div class="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                  <i class="fa-solid fa-calendar-xmark text-4xl text-gray-400"></i>
                </div>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Tidak Ada Data</h3>
              <p class="text-gray-600 text-center max-w-md mb-4">Belum ada data rekapitulasi untuk periode yang dipilih.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: false })
useHead({ title: 'Rekapitulasi Kehadiran | Portal Peserta Didik', link: [{ rel: 'icon', type: 'image/jpeg', href: '/logo-sekolah.jpg' }] })

const router = useRouter()
const { success, error } = useToast()
const config = useRuntimeConfig()
// Check if screen is md or larger
const isMd = useMediaQuery('(min-width: 768px)')

// Sidebar closed on mobile by default, open on desktop
const isSidebarOpen = ref(isMd.value)
const isLoggingOut = ref(false)
const isLoading = ref(false)
const student = ref<any>(null)
const rekapData = ref<any>(null)
const tahunPelajaranList = ref<any[]>([])
const rombelList = ref<any[]>([])

// Get current date
const today = new Date()
const currentMonth = today.getMonth() + 1 // 1-12
const currentYear = today.getFullYear()
const defaultSemester = currentMonth >= 7 && currentMonth <= 12 ? 1 : 2

const filters = ref({
  tahun_pelajaran_id: 0,
  semester: defaultSemester,
  rombel_id: 0,
  bulan: currentMonth,
  tahun: currentYear,
  peserta_didik_id: 0,
  peserta_didik_rombel_id: 0
})

onMounted(() => { initializeData() })

const initializeData = () => {
  const studentData = localStorage.getItem('student_user')
  const token = localStorage.getItem('student_token')
  if (studentData && token) {
    student.value = JSON.parse(studentData)
    
    // Set peserta_didik_id
    filters.value.peserta_didik_id = student.value.id
    
    if (student.value.rombel && Array.isArray(student.value.rombel)) {
      rombelList.value = student.value.rombel
      
      // Build tahun pelajaran list
      const tahunPelajaranMap = new Map()
      student.value.rombel.forEach((r: any) => {
        if (!tahunPelajaranMap.has(r.tahun_pelajaran_id)) {
          tahunPelajaranMap.set(r.tahun_pelajaran_id, {
            tahun_pelajaran_id: r.tahun_pelajaran_id,
            tahun_pelajaran: r.tahun_pelajaran,
            status: r.status
          })
        }
      })
      tahunPelajaranList.value = Array.from(tahunPelajaranMap.values())
      
      // Find active rombel
      const activeRombel = student.value.rombel.find((r: any) => r.status === 'active')
      if (activeRombel) {
        filters.value.tahun_pelajaran_id = activeRombel.tahun_pelajaran_id
        filters.value.rombel_id = activeRombel.rombel_id
        filters.value.peserta_didik_rombel_id = activeRombel.id
      } else if (student.value.rombel.length > 0) {
        filters.value.tahun_pelajaran_id = student.value.rombel[0].tahun_pelajaran_id
        filters.value.rombel_id = student.value.rombel[0].rombel_id
        filters.value.peserta_didik_rombel_id = student.value.rombel[0].id
      }
    }
    
    if (filters.value.rombel_id > 0 && filters.value.peserta_didik_rombel_id > 0) {
      loadRekapData()
    }
  } else {
    router.replace('/peserta-didik/login')
  }
}

const loadRekapData = async () => {
  if (!filters.value.tahun_pelajaran_id || !filters.value.rombel_id || !filters.value.peserta_didik_rombel_id) return
  
  isLoading.value = true
  rekapData.value = null
  
  try {
    const token = localStorage.getItem('student_token')
    const response: any = await $fetch(
      `${config.public.apiBase}/api/v1/absensi-siswa/get-rekap-absensi-by-peserta-didik`,
      {
        method: 'POST',
        body: {
          tahun_pelajaran_id: filters.value.tahun_pelajaran_id,
          rombel_id: filters.value.rombel_id,
          bulan: filters.value.bulan,
          tahun: filters.value.tahun,
          semester: filters.value.semester,
          peserta_didik_id: filters.value.peserta_didik_id,
          peserta_didik_rombel_id: filters.value.peserta_didik_rombel_id
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      }
    )
    
    if (response.data) {
      rekapData.value = response.data
    }
  } catch (err: any) {
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
    
    const errorMessage = err.data?.error || err.data?.message || ''
    if (!errorMessage.toLowerCase().includes('tidak ditemukan') && !errorMessage.toLowerCase().includes('not found')) {
      error('Gagal', errorMessage || 'Gagal memuat data rekapitulasi')
    }
    rekapData.value = null
  } finally {
    isLoading.value = false
  }
}

const updatePesertaDidikRombelId = () => {
  if (filters.value.rombel_id && student.value?.rombel) {
    const selectedRombel = student.value.rombel.find((r: any) => r.rombel_id === filters.value.rombel_id)
    if (selectedRombel) {
      filters.value.peserta_didik_rombel_id = selectedRombel.id
      filters.value.tahun_pelajaran_id = selectedRombel.tahun_pelajaran_id
    }
  }
}

watch(() => filters.value.rombel_id, () => {
  updatePesertaDidikRombelId()
  if (filters.value.peserta_didik_rombel_id) {
    loadRekapData()
  }
})

const formatTanggal = (tanggal: string) => {
  if (!tanggal) return '-'
  const date = new Date(tanggal)
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

const getHari = (tanggal: string) => {
  if (!tanggal) return '-'
  const date = new Date(tanggal)
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  return days[date.getDay()]
}

const formatTanggalOnly = (tanggal: string) => {
  if (!tanggal) return '-'
  const date = new Date(tanggal)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

const isWeekend = (tanggal: string) => {
  if (!tanggal) return false
  const date = new Date(tanggal)
  const day = date.getDay()
  return day === 0 || day === 6 // 0 = Minggu, 6 = Sabtu
}

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

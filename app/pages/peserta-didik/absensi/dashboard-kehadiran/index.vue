<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <StudentSidebar :is-open="isSidebarOpen" :is-loading="isLoggingOut" @close="isSidebarOpen = false" @logout="handleLogout" />
    <div :class="['flex-1 flex flex-col transition-all duration-300 overflow-hidden', 'md:ml-20', isSidebarOpen ? 'md:ml-72' : 'md:ml-20']">
      <StudentNavbar :student="student" :is-loading="isLoggingOut" page-title="Dashboard Kehadiran" @toggle-sidebar="isSidebarOpen = !isSidebarOpen" @logout="handleLogout" />
      <div class="flex-1 overflow-y-auto overflow-x-hidden w-full">
        <div class="p-4 sm:p-6 w-full max-w-full">
          <div class="mb-6">
            <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Dashboard Kehadiran</h1>
            <p class="text-xs sm:text-sm md:text-base text-gray-600 mt-1">Dashboard monitoring kehadiran siswa secara real-time</p>
          </div>
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8">
            <div class="mb-6 pb-6 border-b border-gray-200">
              <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><i class="fa-solid fa-filter text-red-600"></i>Filter Data</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div><label class="block text-sm font-semibold text-gray-900 mb-2">Tahun Pelajaran <span class="text-red-600">*</span></label>
                  <select v-model.number="filters.tahun_pelajaran_id" @change="loadDashboardData" class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm">
                    <option v-for="tp in tahunPelajaranList" :key="tp.tahun_pelajaran_id" :value="tp.tahun_pelajaran_id">{{ tp.tahun_pelajaran }}</option>
                  </select>
                </div>
                <div><label class="block text-sm font-semibold text-gray-900 mb-2">Semester <span class="text-red-600">*</span></label>
                  <select v-model.number="filters.semester" @change="loadDashboardData" class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm">
                    <option :value="1">Semester 1</option><option :value="2">Semester 2</option>
                  </select>
                </div>
                <div><label class="block text-sm font-semibold text-gray-900 mb-2">Rombel <span class="text-red-600">*</span></label>
                  <select v-model.number="filters.rombel_id" @change="loadDashboardData" class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm">
                    <option v-for="rombel in rombelList" :key="rombel.rombel_id" :value="rombel.rombel_id">{{ rombel.rombel_name }}</option>
                  </select>
                </div>
                <div><label class="block text-sm font-semibold text-gray-900 mb-2">Peserta Didik</label>
                  <input type="text" :value="student?.nama || '-'" disabled class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-700 text-sm cursor-not-allowed" />
                </div>
                <div><label class="block text-sm font-semibold text-gray-900 mb-2">Tanggal Mulai <span class="text-red-600">*</span></label>
                  <input v-model="filters.tanggal_mulai" type="date" @change="loadDashboardData" class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm" />
                </div>
                <div><label class="block text-sm font-semibold text-gray-900 mb-2">Tanggal Selesai <span class="text-red-600">*</span></label>
                  <input v-model="filters.tanggal_selesai" type="date" @change="loadDashboardData" class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm" />
                </div>
              </div>
            </div>
            <div v-if="isLoading" class="flex items-center justify-center py-12">
              <div class="flex flex-col items-center gap-3">
                <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
                <p class="text-sm text-gray-600 font-medium">Memuat dashboard siswa...</p>
              </div>
            </div>
            <div v-else-if="dashboardData && dashboardData.summary" class="space-y-6">
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6">
                <div class="flex items-center gap-4">
                  <div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {{ dashboardData.siswa?.nama?.charAt(0) || '?' }}
                  </div>
                  <div class="flex-1">
                    <h3 class="text-2xl font-bold text-gray-900">{{ dashboardData.siswa?.nama || student?.nama }}</h3>
                    <div class="flex flex-wrap gap-3 mt-2">
                      <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
                        <i class="fa-solid fa-id-card text-xs"></i>NIS: {{ dashboardData.siswa?.nis || student?.nis }}
                      </span>
                      <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-semibold">
                        <i class="fa-solid fa-users text-xs"></i>{{ dashboardData.siswa?.rombel_nama || rombelList.find(r => r.rombel_id === filters.rombel_id)?.rombel_name }}
                      </span>
                      <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold" :class="{'bg-pink-100 text-pink-800': dashboardData.siswa?.jenis_kelamin === 'P', 'bg-cyan-100 text-cyan-800': dashboardData.siswa?.jenis_kelamin === 'L'}">
                        <i class="fa-solid" :class="dashboardData.siswa?.jenis_kelamin === 'P' ? 'fa-venus' : 'fa-mars'"></i>
                        {{ dashboardData.siswa?.jenis_kelamin === 'P' ? 'Perempuan' : 'Laki-laki' }}
                      </span>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-5xl font-bold" :class="{'text-green-600': dashboardData.summary.persentase_hadir >= 90, 'text-yellow-600': dashboardData.summary.persentase_hadir >= 75 && dashboardData.summary.persentase_hadir < 90, 'text-red-600': dashboardData.summary.persentase_hadir < 75}">
                      {{ dashboardData.summary.persentase_hadir.toFixed(1) }}%
                    </div>
                    <p class="text-sm font-semibold mt-1" :class="{'text-green-700': dashboardData.summary.persentase_hadir >= 90, 'text-yellow-700': dashboardData.summary.persentase_hadir >= 75 && dashboardData.summary.persentase_hadir < 90, 'text-red-700': dashboardData.summary.persentase_hadir < 75}">
                      {{ dashboardData.summary.status_kehadiran }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center"><i class="fa-solid fa-calendar-days text-white"></i></div>
                    <div><p class="text-xs text-blue-600 font-semibold">Pertemuan</p><p class="text-2xl font-bold text-blue-900">{{ dashboardData.summary.total_pertemuan }}</p></div>
                  </div>
                </div>
                <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center"><i class="fa-solid fa-check text-white"></i></div>
                    <div><p class="text-xs text-green-600 font-semibold">Hadir</p><p class="text-2xl font-bold text-green-900">{{ dashboardData.summary.total_hadir }}</p></div>
                  </div>
                </div>
                <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center"><i class="fa-solid fa-notes-medical text-white"></i></div>
                    <div><p class="text-xs text-blue-600 font-semibold">Sakit</p><p class="text-2xl font-bold text-blue-900">{{ dashboardData.summary.total_sakit }}</p></div>
                  </div>
                </div>
                <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border-2 border-yellow-200">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center"><i class="fa-solid fa-hand-paper text-white"></i></div>
                    <div><p class="text-xs text-yellow-600 font-semibold">Izin</p><p class="text-2xl font-bold text-yellow-900">{{ dashboardData.summary.total_izin }}</p></div>
                  </div>
                </div>
                <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border-2 border-red-200">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center"><i class="fa-solid fa-times text-white"></i></div>
                    <div><p class="text-xs text-red-600 font-semibold">Alpa</p><p class="text-2xl font-bold text-red-900">{{ dashboardData.summary.total_alpa }}</p></div>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b-2 border-gray-200">
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2"><i class="fa-solid fa-chart-line text-red-600"></i>Grafik Kehadiran</h3>
                    <select v-model="filters.periode" @change="loadDashboardData" class="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm font-semibold">
                      <option value="harian">Harian</option>
                      <option value="mingguan">Mingguan</option>
                      <option value="bulanan">Bulanan</option>
                    </select>
                  </div>
                </div>
                <div class="p-6">
                  <div v-if="grafikData" class="h-80">
                    <Line :data="grafikData" :options="chartOptions" />
                  </div>
                  <div v-else class="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4"><i class="fa-solid fa-chart-bar text-3xl text-gray-400"></i></div>
                    <p class="text-gray-600 font-medium">Tidak ada data grafik</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="flex flex-col items-center justify-center py-16">
              <div class="relative mb-6">
                <div class="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-4 border-white shadow-lg"><i class="fa-solid fa-calendar-xmark text-4xl text-gray-400"></i></div>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Tidak Ada Data Absensi</h3>
              <p class="text-gray-600 text-center max-w-md mb-4">Belum ada data absensi untuk periode yang dipilih. Silakan coba ubah filter atau periode waktu.</p>
              <div class="flex flex-wrap gap-3 justify-center text-sm">
                <div class="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200"><i class="fa-solid fa-calendar text-gray-500"></i><span class="text-gray-700 font-medium">Periode: {{ filters.tanggal_mulai }} s/d {{ filters.tanggal_selesai }}</span></div>
                <div class="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200"><i class="fa-solid fa-users text-gray-500"></i><span class="text-gray-700 font-medium">{{ rombelList.find(r => r.rombel_id === filters.rombel_id)?.rombel_name || '-' }}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useToast } from '~/composables/useToast'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

definePageMeta({ layout: false })
useHead({ title: 'Dashboard Kehadiran | Portal Peserta Didik', link: [{ rel: 'icon', type: 'image/jpeg', href: '/logo-sekolah.jpg' }] })

const router = useRouter()
const { success, error } = useToast()
const config = useRuntimeConfig()
const isSidebarOpen = ref(true)
const isLoggingOut = ref(false)
const isLoading = ref(false)
const student = ref<any>(null)
const dashboardData = ref<any>(null)
const tahunPelajaranList = ref<any[]>([])
const rombelList = ref<any[]>([])
const filters = ref({ tahun_pelajaran_id: 0, semester: 1, rombel_id: 0, peserta_didik_rombel_id: 0, periode: 'harian', tanggal_mulai: '', tanggal_selesai: '' })

const grafikData = computed(() => {
  if (!dashboardData.value?.grafik) return null
  return {
    labels: dashboardData.value.grafik.labels,
    datasets: [
      { label: 'Hadir', data: dashboardData.value.grafik.hadir, borderColor: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.1)', tension: 0.4, fill: true, pointRadius: 5, pointHoverRadius: 7, pointBackgroundColor: '#22c55e', pointBorderColor: '#fff', pointBorderWidth: 2 },
      { label: 'Sakit', data: dashboardData.value.grafik.sakit, borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', tension: 0.4, fill: true, pointRadius: 5, pointHoverRadius: 7, pointBackgroundColor: '#3b82f6', pointBorderColor: '#fff', pointBorderWidth: 2 },
      { label: 'Izin', data: dashboardData.value.grafik.izin, borderColor: '#eab308', backgroundColor: 'rgba(234, 179, 8, 0.1)', tension: 0.4, fill: true, pointRadius: 5, pointHoverRadius: 7, pointBackgroundColor: '#eab308', pointBorderColor: '#fff', pointBorderWidth: 2 },
      { label: 'Alpa', data: dashboardData.value.grafik.alpa, borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', tension: 0.4, fill: true, pointRadius: 5, pointHoverRadius: 7, pointBackgroundColor: '#ef4444', pointBorderColor: '#fff', pointBorderWidth: 2 },
    ],
  }
})

const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' as const }, tooltip: { mode: 'index' as const, intersect: false, backgroundColor: 'rgba(0, 0, 0, 0.8)', titleColor: '#fff', bodyColor: '#fff', borderColor: '#ddd', borderWidth: 1, padding: 12, displayColors: true, callbacks: { label: function(context: any) { return context.dataset.label + ': ' + context.parsed.y } } } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(0, 0, 0, 0.05)' } }, x: { grid: { display: false } } } }

onMounted(() => { initializeData() })

const initializeData = () => {
  const studentData = localStorage.getItem('student_user')
  const token = localStorage.getItem('student_token')
  if (studentData && token) {
    student.value = JSON.parse(studentData)
    if (student.value.rombel && Array.isArray(student.value.rombel)) {
      rombelList.value = student.value.rombel
      const tahunPelajaranMap = new Map()
      student.value.rombel.forEach((r: any) => {
        if (!tahunPelajaranMap.has(r.tahun_pelajaran_id)) {
          tahunPelajaranMap.set(r.tahun_pelajaran_id, { tahun_pelajaran_id: r.tahun_pelajaran_id, tahun_pelajaran: r.tahun_pelajaran, status: r.status })
        }
      })
      tahunPelajaranList.value = Array.from(tahunPelajaranMap.values())
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
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    filters.value.tanggal_mulai = firstDay.toISOString().split('T')[0] || ''
    filters.value.tanggal_selesai = lastDay.toISOString().split('T')[0] || ''
    if (filters.value.rombel_id > 0 && filters.value.peserta_didik_rombel_id > 0) { loadDashboardData() }
  } else { router.replace('/peserta-didik/login') }
}

const loadDashboardData = async () => {
  if (!filters.value.tahun_pelajaran_id || !filters.value.rombel_id || !filters.value.peserta_didik_rombel_id) return
  isLoading.value = true
  dashboardData.value = null
  try {
    const token = localStorage.getItem('student_token')
    const response: any = await $fetch(`${config.public.apiBase}/api/v1/absensi-siswa/dashboard-siswa`, {
      method: 'POST', body: { peserta_didik_rombel_id: filters.value.peserta_didik_rombel_id, tahun_pelajaran_id: filters.value.tahun_pelajaran_id, rombel_id: filters.value.rombel_id, semester: filters.value.semester, bidang_studi_id: null, periode: filters.value.periode, tanggal_mulai: filters.value.tanggal_mulai, tanggal_selesai: filters.value.tanggal_selesai },
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, credentials: 'include'
    })
    if (response.data) { dashboardData.value = response.data }
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
      error('Gagal', errorMessage || 'Gagal memuat data dashboard')
    }
    dashboardData.value = null
  } finally { isLoading.value = false }
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
  if (filters.value.peserta_didik_rombel_id) { loadDashboardData() }
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
  } finally { isLoggingOut.value = false }
}
</script>

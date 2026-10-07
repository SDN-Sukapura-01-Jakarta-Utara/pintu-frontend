<template>
    <DashboardLayout>
        <!-- Modal -->
        <BuatLaporanBulananModal v-model="showCreateModal"
            :anakInklusiData="selectedAnakInklusi"
            :guruList="guruList"
            :currentMonth="currentMonth"
            :currentYear="currentYear"
            @success="handleSuccess" />
        <ViewMonitoringBulananModal v-model="showViewModal" :dataId="selectedDataId" />
        <EditMonitoringBulananModal v-model="showEditModal" 
            :dataId="selectedDataId"
            :guruList="guruList"
            @success="handleSuccess" />

        <!-- Header Section -->
        <div class="mb-6 sm:mb-8">
            <div class="flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
                <div>
                    <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Monitoring Inklusi Bulanan</h1>
                    <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
                        Monitor dan buat laporan perkembangan bulanan siswa inklusi
                    </p>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <!-- Summary Statistics -->
            <div v-if="summaryData" class="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 border-b border-gray-200">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Total Siswa Inklusi -->
                    <div class="group bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500 relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-20 h-20 bg-blue-500 opacity-5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-300"></div>
                        <div class="flex items-start justify-between relative z-10">
                            <div class="flex-1">
                                <div class="text-xs sm:text-sm text-gray-600 font-semibold mb-2">Total Siswa Inklusi</div>
                                <div class="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">{{ summaryData.total_anak_inklusi }}</div>
                                <div class="text-xs text-gray-500">Siswa terdaftar</div>
                            </div>
                            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 shadow-lg">
                                <i class="fas fa-users text-white text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Total PPI -->
                    <div class="group bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-green-500 relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-20 h-20 bg-green-500 opacity-5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-300"></div>
                        <div class="flex items-start justify-between relative z-10">
                            <div class="flex-1">
                                <div class="text-xs sm:text-sm text-gray-600 font-semibold mb-2">Total PPI</div>
                                <div class="text-3xl sm:text-4xl font-bold text-green-600 mb-1">{{ summaryData.total_ppi }}</div>
                                <div class="text-xs text-gray-500">Program aktif</div>
                            </div>
                            <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 shadow-lg">
                                <i class="fas fa-book-open text-white text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Monitoring Bulan Ini -->
                    <div class="group bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-orange-500 relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-20 h-20 bg-orange-500 opacity-5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-300"></div>
                        <div class="flex items-start justify-between relative z-10">
                            <div class="flex-1">
                                <div class="text-xs sm:text-sm text-gray-600 font-semibold mb-2">Monitoring Bulan Ini</div>
                                <div class="text-3xl sm:text-4xl font-bold text-orange-600 mb-1">{{ summaryData.total_monitoring }}</div>
                                <div class="text-xs text-gray-500">Laporan dibuat</div>
                            </div>
                            <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-3 shadow-lg">
                                <i class="fas fa-clipboard-check text-white text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Rata-rata per PPI -->
                    <div class="group bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500 relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-20 h-20 bg-purple-500 opacity-5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-300"></div>
                        <div class="flex items-start justify-between relative z-10">
                            <div class="flex-1">
                                <div class="text-xs sm:text-sm text-gray-600 font-semibold mb-2">Rata-rata per PPI</div>
                                <div class="text-3xl sm:text-4xl font-bold text-purple-600 mb-1">{{ summaryData.rata_rata_monitoring_per_ppi?.toFixed(2) || '0.00' }}</div>
                                <div class="text-xs text-gray-500">Monitoring/PPI</div>
                            </div>
                            <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 shadow-lg">
                                <i class="fas fa-chart-line text-white text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Optional: Progress Bar -->
                <div v-if="summaryData.total_ppi > 0" class="mt-4 bg-white rounded-lg p-3 shadow-sm">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-semibold text-gray-700">Progress Monitoring</span>
                        <span class="text-xs font-bold text-blue-600">{{ Math.round((summaryData.total_monitoring / summaryData.total_ppi) * 100) }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                             :style="{ width: Math.min((summaryData.total_monitoring / summaryData.total_ppi) * 100, 100) + '%' }">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Filter and Month Navigation Section -->
            <div class="bg-white p-3 border-b border-gray-200">
                <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <!-- Filter Rombel -->
                    <div class="w-full sm:w-auto sm:flex-1 max-w-xs">
                        <select v-model="filters.rombel_id" @change="handleFilterChange"
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer">
                            <option value="">Semua Rombel</option>
                            <option v-for="rombel in rombelList" :key="rombel.id" :value="rombel.id">
                                {{ rombel.name }}
                            </option>
                        </select>
                    </div>

                    <!-- Month Navigation - Centered -->
                    <div class="flex items-center gap-2">
                        <button @click="previousMonth"
                            class="p-2 bg-white border-2 border-gray-300 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                            <i class="fa-solid fa-chevron-left text-gray-700 text-sm"></i>
                        </button>
                        <div class="text-sm sm:text-base font-bold text-gray-900 min-w-[140px] text-center">
                            {{ monthName }} {{ currentYear }}
                        </div>
                        <button @click="nextMonth"
                            class="p-2 bg-white border-2 border-gray-300 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                            <i class="fa-solid fa-chevron-right text-gray-700 text-sm"></i>
                        </button>
                    </div>

                    <!-- Spacer for alignment -->
                    <div class="hidden sm:block sm:flex-1 max-w-xs"></div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="flex items-center justify-center py-12 px-4 sm:px-6">
                <div class="flex flex-col items-center gap-3">
                    <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                    <p class="text-sm text-gray-600 font-medium">Memuat data...</p>
                </div>
            </div>

            <!-- Table Section -->
            <div v-else-if="dataList && dataList.length > 0">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-gray-700 border-b-2 border-gray-600">
                            <tr>
                                <th class="px-3 py-2 text-center text-xs font-semibold text-white uppercase tracking-wider">No</th>
                                <th class="px-3 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">Nama Siswa</th>
                                <th class="px-3 py-2 text-center text-xs font-semibold text-white uppercase tracking-wider">NISN</th>
                                <th class="px-3 py-2 text-center text-xs font-semibold text-white uppercase tracking-wider">Rombel</th>
                                <th class="px-3 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">Jenis Hambatan</th>
                                <th class="px-3 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">Perkembangan</th>
                                <th class="px-3 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">Kendala</th>
                                <th class="px-3 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">Tindak Lanjut</th>
                                <th class="px-3 py-2 text-center text-xs font-semibold text-white uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <tr v-for="(item, index) in dataList" :key="item.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-3 py-2 text-center text-gray-900 text-xs">
                                    {{ index + 1 }}
                                </td>
                                <td class="px-3 py-2">
                                    <div class="text-xs font-medium text-gray-900">{{ item.anak_inklusi?.peserta_didik?.nama || '-' }}</div>
                                </td>
                                <td class="px-3 py-2 text-center text-gray-600 text-xs">
                                    {{ item.anak_inklusi?.peserta_didik?.nisn || '-' }}
                                </td>
                                <td class="px-3 py-2 text-center text-gray-600 text-xs">
                                    {{ item.peserta_didik_rombel?.rombel?.name || '-' }}
                                </td>
                                <td class="px-3 py-2">
                                    <span class="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">
                                        {{ item.anak_inklusi?.jenis_hambatan || '-' }}
                                    </span>
                                </td>
                                <td class="px-3 py-2">
                                    <div v-if="item.monitoring_data" class="max-w-xs text-xs text-gray-900 line-clamp-2">
                                        {{ item.monitoring_data.deskripsi_perkembangan }}
                                    </div>
                                    <span v-else class="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs font-medium">
                                        Belum buat laporan
                                    </span>
                                </td>
                                <td class="px-3 py-2">
                                    <div v-if="item.monitoring_data" class="max-w-xs text-xs text-gray-600 line-clamp-2">
                                        {{ item.monitoring_data.kendala_ditemui || '-' }}
                                    </div>
                                    <span v-else class="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs font-medium">
                                        Belum buat laporan
                                    </span>
                                </td>
                                <td class="px-3 py-2">
                                    <div v-if="item.monitoring_data" class="max-w-xs text-xs text-gray-600 line-clamp-2">
                                        {{ item.monitoring_data.tindak_lanjut || '-' }}
                                    </div>
                                    <span v-else class="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs font-medium">
                                        Belum buat laporan
                                    </span>
                                </td>
                                <td class="px-3 py-2">
                                    <div class="flex items-center justify-center gap-1">
                                        <!-- Buat Laporan / Edit Button -->
                                        <button v-if="!item.monitoring_data" @click="buatLaporan(item)"
                                            class="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded text-xs font-semibold shadow-sm transition-all"
                                            title="Buat Laporan">
                                            <i class="fas fa-plus mr-1"></i>
                                            Buat
                                        </button>
                                        <EditButton v-else title="Edit Laporan" @click="editData(item)" />
                                        
                                        <!-- Lihat Detail Button (only if has monitoring data) -->
                                        <ViewButton v-if="item.monitoring_data" title="Lihat Detail" @click="viewDetail(item)" />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="flex flex-col items-center justify-center py-12 px-4 bg-gray-50">
                <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <i class="fas fa-users text-3xl text-gray-400"></i>
                </div>
                <h3 class="text-base font-semibold text-gray-900 mb-1">Tidak Ada Data</h3>
                <p class="text-sm text-gray-600 text-center">
                    Belum ada data anak inklusi untuk periode ini
                </p>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from '~/composables/useToast'
import { useAuthGuard } from '~/composables/useAuthGuard'
import DashboardLayout from '~/components/DashboardLayout.vue'
import BuatLaporanBulananModal from '~/components/modals/BuatLaporanBulananModal.vue'
import ViewMonitoringBulananModal from '~/components/modals/ViewMonitoringBulananModal.vue'
import EditMonitoringBulananModal from '~/components/modals/EditMonitoringBulananModal.vue'
import ViewButton from '~/components/common/ViewButton.vue'
import EditButton from '~/components/common/EditButton.vue'

definePageMeta({
    layout: 'default',
    middleware: 'auth',
})

useHead({
    title: 'Monitoring Inklusi Bulanan | PINTU SDN Sukapura 01',
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

const { error: showErrorToast } = useToast()
const { handle401 } = useAuthGuard()

// State
const isLoading = ref(false)
const dataList = ref<any[]>([])
const rombelList = ref<any[]>([])
const guruList = ref<any[]>([])
const summaryData = ref<any>(null)
const showCreateModal = ref(false)
const showViewModal = ref(false)
const showEditModal = ref(false)
const selectedDataId = ref<number | null>(null)
const selectedAnakInklusi = ref<any>(null)

const currentMonth = ref(new Date().getMonth() + 1) // 1-12
const currentYear = ref(new Date().getFullYear())

const filters = ref({
    rombel_id: '' as string | number
})

const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

const monthName = computed(() => monthNames[currentMonth.value - 1])

onMounted(async () => {
    await loadRombel()
    await loadGuru()
    await loadSummary()
    await loadData()
})

// Load Rombel
async function loadRombel() {
    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const response = await $fetch<any>(
            `${config.public.apiBase}/api/v1/rombel/get-rombel`,
            {
                method: 'POST',
                body: {
                    search: {},
                    pagination: {
                        limit: 100,
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

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }
    }
}

// Load Summary
async function loadSummary() {
    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        // If specific rombel is selected, fetch for that rombel
        if (filters.value.rombel_id) {
            const rombelId = typeof filters.value.rombel_id === 'string'
                ? parseInt(filters.value.rombel_id)
                : filters.value.rombel_id

            const response = await $fetch<any>(
                `${config.public.apiBase}/api/v1/monitoring-inklusi/get-summary-monitoring-bulanan`,
                {
                    method: 'POST',
                    body: {
                        tahun: currentYear.value,
                        bulan: currentMonth.value,
                        rombel_id: rombelId
                    },
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                }
            )

            summaryData.value = response.data || null
        } else {
            // If no specific rombel, aggregate data from all rombels
            if (rombelList.value.length === 0) {
                summaryData.value = null
                return
            }

            let totalAnakInklusi = 0
            let totalPPI = 0
            let totalMonitoring = 0
            let totalRataRata = 0

            // Fetch summary for each rombel and aggregate
            for (const rombel of rombelList.value) {
                try {
                    const response = await $fetch<any>(
                        `${config.public.apiBase}/api/v1/monitoring-inklusi/get-summary-monitoring-bulanan`,
                        {
                            method: 'POST',
                            body: {
                                tahun: currentYear.value,
                                bulan: currentMonth.value,
                                rombel_id: rombel.id
                            },
                            headers: {
                                'Authorization': token ? `Bearer ${token}` : '',
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include',
                        }
                    )

                    if (response.data) {
                        totalAnakInklusi += response.data.total_anak_inklusi || 0
                        totalPPI += response.data.total_ppi || 0
                        totalMonitoring += response.data.total_monitoring || 0
                    }
                } catch (error) {
                    console.error(`Error fetching summary for rombel ${rombel.id}:`, error)
                }
            }

            // Calculate average
            const rataRata = totalPPI > 0 ? totalMonitoring / totalPPI : 0

            summaryData.value = {
                total_anak_inklusi: totalAnakInklusi,
                total_ppi: totalPPI,
                total_monitoring: totalMonitoring,
                rata_rata_monitoring_per_ppi: rataRata
            }
        }
    } catch (error: any) {
        console.error('Error loading summary:', error)
        summaryData.value = null

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }
    }
}

// Load Guru
async function loadGuru() {
    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const response = await $fetch<any>(
            `${config.public.apiBase}/api/v1/kepegawaian/get-kepegawaian`,
            {
                method: 'POST',
                body: {
                    search: {
                        status: 'active'
                    },
                    pagination: {
                        limit: 100,
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

        guruList.value = response.data || []
    } catch (error: any) {
        console.error('Error loading guru:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }
    }
}

// Load Data - Get data induk inklusi and check monitoring
async function loadData() {
    isLoading.value = true
    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        // Get current active tahun pelajaran
        const tahunPelajaranResponse = await $fetch<any>(
            `${config.public.apiBase}/api/v1/tahun-pelajaran/get-tahun-pelajaran`,
            {
                method: 'POST',
                body: {
                    search: {
                        status: 'active'
                    },
                    pagination: {
                        limit: 1,
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

        const activeTahunPelajaran = tahunPelajaranResponse.data?.[0]
        if (!activeTahunPelajaran) {
            dataList.value = []
            return
        }

        // Get data induk inklusi rombel
        const searchBody: any = {}
        if (filters.value.rombel_id) {
            searchBody.rombel_id = typeof filters.value.rombel_id === 'string'
                ? parseInt(filters.value.rombel_id)
                : filters.value.rombel_id
        }

        const anakInklusiResponse = await $fetch<any>(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/get-data-induk-inklusi-rombel`,
            {
                method: 'POST',
                body: {
                    tahun_pelajaran_id: activeTahunPelajaran.id,
                    search: searchBody,
                    pagination: {
                        limit: 1000,
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

        const anakInklusiList = anakInklusiResponse.data || []

        // Get monitoring data for current month/year
        const monitoringRequestBody: any = {
            bulan: currentMonth.value,
            tahun: currentYear.value
        }

        if (filters.value.rombel_id) {
            monitoringRequestBody.rombel_id = typeof filters.value.rombel_id === 'string'
                ? parseInt(filters.value.rombel_id)
                : filters.value.rombel_id
        }

        const monitoringResponse = await $fetch<any>(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/get-monitoring-bulanan`,
            {
                method: 'POST',
                body: monitoringRequestBody,
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }
        )

        const monitoringData = monitoringResponse.data?.data || []

        // Combine data: for each anak inklusi, check if has monitoring data
        dataList.value = anakInklusiList.map((anak: any) => {
            const monitoring = monitoringData.find((m: any) => 
                m.ppi_inklusi?.anak_inklusi_rombel_id === anak.id
            )
            
            return {
                ...anak,
                monitoring_data: monitoring || null
            }
        })

    } catch (error: any) {
        console.error('Error loading data:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }

        showErrorToast('Gagal Memuat Data', 'Gagal memuat data monitoring bulanan.')
        dataList.value = []
    } finally {
        isLoading.value = false
    }
}

function previousMonth() {
    if (currentMonth.value === 1) {
        currentMonth.value = 12
        currentYear.value--
    } else {
        currentMonth.value--
    }
    loadSummary()
    loadData()
}

function nextMonth() {
    if (currentMonth.value === 12) {
        currentMonth.value = 1
        currentYear.value++
    } else {
        currentMonth.value++
    }
    loadSummary()
    loadData()
}

function handleFilterChange() {
    loadSummary()
    loadData()
}

function buatLaporan(item: any) {
    selectedAnakInklusi.value = item
    showCreateModal.value = true
}

function viewDetail(item: any) {
    if (item.monitoring_data) {
        selectedDataId.value = item.monitoring_data.id
        showViewModal.value = true
    }
}

function editData(item: any) {
    if (item.monitoring_data) {
        selectedDataId.value = item.monitoring_data.id
        showEditModal.value = true
    }
}

function handleSuccess() {
    loadSummary()
    loadData()
}
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>

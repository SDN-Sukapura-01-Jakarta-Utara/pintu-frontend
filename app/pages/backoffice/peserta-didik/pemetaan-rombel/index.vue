<template>
    <DashboardLayout>
        <!-- Create Pemetaan Rombel Modal -->
        <CreatePemetaanRombelModal v-model="showCreateModal" @success="handleCreateSuccess" />
        
        <!-- Import Pemetaan Rombel Modal -->
        <ImportPemetaanRombelModal v-model="showImportModal" @success="handleImportSuccess" />
        
        <!-- Reset Pemetaan Rombel Modal -->
        <ResetPemetaanRombelModal v-model="showResetModal" @success="handleResetSuccess" />
        
        <!-- Search Pemetaan Rombel Modal -->
        <SearchPemetaanRombelModal v-model="showSearchModal" @edit="handleEdit" @delete="handleDelete" />
        
        <!-- View Pemetaan Rombel Modal -->
        <ViewPemetaanRombelModal v-model="showViewModal" :pemetaanId="selectedPemetaanId" />

        <!-- Header Section -->
        <div class="mb-6 sm:mb-8">
            <div class="flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
                <div>
                    <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                        Pemetaan Rombel
                    </h1>
                    <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
                        Data pemetaan siswa per rombongan belajar
                    </p>
                </div>
                <div class="flex items-center gap-2 sm:gap-3">
                    <button @click="openSearchModal"
                        class="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-xs sm:text-sm hover:bg-blue-700 transition-colors duration-200 cursor-pointer">
                        <i class="fa-solid fa-search"></i>
                        <span class="hidden sm:inline">Cari Pemetaan Rombel</span>
                        <span class="sm:hidden">Cari</span>
                    </button>
                    <button @click="openResetModal"
                        class="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-orange-600 text-white font-semibold text-xs sm:text-sm hover:bg-orange-700 transition-colors duration-200 cursor-pointer">
                        <i class="fa-solid fa-rotate-left"></i>
                        <span class="hidden sm:inline">Reset Data</span>
                        <span class="sm:hidden">Reset</span>
                    </button>
                    <button @click="openImportModal"
                        class="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-green-600 text-white font-semibold text-xs sm:text-sm hover:bg-green-700 transition-colors duration-200 cursor-pointer">
                        <i class="fa-solid fa-file-import"></i>
                        <span class="hidden sm:inline">Import Data</span>
                        <span class="sm:hidden">Import</span>
                    </button>
                    <button @click="openCreateModal"
                        class="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-[#2e45a7] text-white font-semibold text-xs sm:text-sm hover:bg-[#002d89] transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer">
                        <i class="fa-solid fa-plus"></i>
                        <span class="hidden sm:inline">Tambah Pemetaan Rombel</span>
                        <span class="sm:hidden">Tambah</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading Rombel -->
        <div v-if="isLoadingRombel" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div class="flex items-center justify-center">
                <div class="flex flex-col items-center gap-3">
                    <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
                    <p class="text-sm text-gray-600 font-medium">Memuat data rombel...</p>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200">
            <!-- Tabs -->
            <div class="border-b border-gray-200">
                <nav class="flex overflow-x-auto" aria-label="Tabs">
                    <button
                        v-for="rombel in rombelList"
                        :key="rombel.id"
                        @click="activeTab = rombel.id"
                        :class="[
                            'flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer',
                            activeTab === rombel.id
                                ? 'border-red-600 text-red-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                        ]"
                    >
                        <i class="fa-solid fa-users"></i>
                        <span>{{ rombel.name }}</span>
                    </button>
                </nav>
            </div>

            <!-- Filters -->
            <div class="p-4 sm:p-6 border-b border-gray-200">
                <div class="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-4">
                    <!-- Tahun Pelajaran Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            Tahun Pelajaran
                        </label>
                        <select v-model="filters.tahun_pelajaran_id"
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                            <option v-for="tp in tahunPelajaranList" :key="tp.id" :value="tp.id">
                                {{ tp.tahun_pelajaran }}
                            </option>
                        </select>
                    </div>

                    <!-- Status Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            Status
                        </label>
                        <select v-model="filters.status"
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                            <option value="">Semua Status</option>
                            <option value="active">Aktif</option>
                            <option value="inactive">Nonaktif</option>
                        </select>
                    </div>

                    <!-- Nama Siswa Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            Nama Siswa
                        </label>
                        <input v-model="filters.nama" @keyup.enter="applyFilter" type="text" placeholder="Cari nama siswa..."
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                    </div>

                    <!-- Search Button -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 invisible">Cari</label>
                        <div class="flex gap-2">
                            <button @click="applyFilter"
                                class="flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap h-[42px]">
                                <i class="fa-solid fa-search"></i>
                                <span>Cari</span>
                            </button>
                            <button @click="exportExcel" :disabled="isExportingExcel"
                                class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold text-xs sm:text-sm hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap h-[42px] disabled:opacity-50 disabled:cursor-not-allowed">
                                <i v-if="!isExportingExcel" class="fa-solid fa-file-excel"></i>
                                <i v-else class="fa-solid fa-spinner fa-spin"></i>
                            </button>
                            <button @click="exportPdf" :disabled="isExportingPdf"
                                class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold text-xs sm:text-sm hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap h-[42px] disabled:opacity-50 disabled:cursor-not-allowed">
                                <i v-if="!isExportingPdf" class="fa-solid fa-file-pdf"></i>
                                <i v-else class="fa-solid fa-spinner fa-spin"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="p-8 sm:p-12 flex items-center justify-center">
                <div class="flex flex-col items-center gap-3 sm:gap-4">
                    <div class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
                    <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data siswa...</p>
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="p-4 sm:p-6">
                <div class="rounded-xl border-2 border-red-200 bg-red-50 p-4 sm:p-6 flex items-start gap-3 sm:gap-4">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 sm:h-6 sm:w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="flex-1">
                        <h3 class="text-base sm:text-lg font-semibold text-red-900">Gagal memuat data</h3>
                        <p class="mt-1 text-sm sm:text-base text-red-800">{{ error }}</p>
                        <button @click="fetchPemetaanRombel"
                            class="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors">
                            <i class="fa-solid fa-rotate-right w-3 h-3 sm:w-4 sm:h-4"></i>
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </div>

            <!-- Table Section -->
            <template v-else>
                <div v-if="siswaList.length > 0">
                    <Table :items="siswaList" :columns="tableColumns" :current-page="pagination.page"
                        :current-limit="pagination.limit" :total="totalData" :is-loading="isLoading"
                        @pageChange="onPageChange" @limitChange="onLimitChange">

                        <!-- Custom cell for Nama -->
                        <template #cell-nama="{ item }">
                            <span class="text-xs sm:text-sm font-medium text-gray-700">
                                {{ item.peserta_didik?.nama || '-' }}
                            </span>
                        </template>

                        <!-- Custom cell for NIS -->
                        <template #cell-nis="{ item }">
                            <span class="text-xs sm:text-sm font-medium text-gray-700">
                                {{ item.peserta_didik?.nis || '-' }}
                            </span>
                        </template>

                        <!-- Custom cell for Jenis Kelamin -->
                        <template #cell-jenis_kelamin="{ item }">
                            <span class="text-xs sm:text-sm font-medium text-gray-700">
                                {{ item.peserta_didik?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}
                            </span>
                        </template>

                        <!-- Custom cell for NISN -->
                        <template #cell-nisn="{ item }">
                            <span class="text-xs sm:text-sm font-medium text-gray-700">
                                {{ item.peserta_didik?.nisn || '-' }}
                            </span>
                        </template>

                        <!-- Custom cell for NIK -->
                        <template #cell-nik="{ item }">
                            <span class="text-xs sm:text-sm font-medium text-gray-700">
                                {{ item.peserta_didik?.nik || '-' }}
                            </span>
                        </template>

                        <!-- Custom cell for Tempat Lahir -->
                        <template #cell-tempat_lahir="{ item }">
                            <span class="text-xs sm:text-sm font-medium text-gray-700">
                                {{ item.peserta_didik?.tempat_lahir || '-' }}
                            </span>
                        </template>

                        <!-- Custom cell for Tanggal Lahir -->
                        <template #cell-tanggal_lahir="{ item }">
                            <span class="text-xs sm:text-sm font-medium text-gray-700">
                                {{ item.peserta_didik?.tanggal_lahir || '-' }}
                            </span>
                        </template>

                        <!-- Custom cell for Agama -->
                        <template #cell-agama="{ item }">
                            <span class="text-xs sm:text-sm font-medium text-gray-700">
                                {{ item.peserta_didik?.agama || '-' }}
                            </span>
                        </template>

                        <!-- Custom cell for Alamat -->
                        <template #cell-alamat="{ item }">
                            <span class="text-xs sm:text-sm font-medium text-gray-700">
                                {{ item.peserta_didik?.alamat || '-' }}
                            </span>
                        </template>

                        <!-- Custom cell for RT -->
                        <template #cell-rt="{ item }">
                            <span class="text-xs sm:text-sm font-medium text-gray-700">
                                {{ item.peserta_didik?.rt || '-' }}
                            </span>
                        </template>

                        <!-- Custom cell for RW -->
                        <template #cell-rw="{ item }">
                            <span class="text-xs sm:text-sm font-medium text-gray-700">
                                {{ item.peserta_didik?.rw || '-' }}
                            </span>
                        </template>

                        <!-- Custom cell for Kelurahan -->
                        <template #cell-kelurahan="{ item }">
                            <span class="text-xs sm:text-sm font-medium text-gray-700">
                                {{ item.peserta_didik?.kelurahan || '-' }}
                            </span>
                        </template>

                        <!-- Custom cell for Kecamatan -->
                        <template #cell-kecamatan="{ item }">
                            <span class="text-xs sm:text-sm font-medium text-gray-700">
                                {{ item.peserta_didik?.kecamatan || '-' }}
                            </span>
                        </template>

                        <!-- Custom cell for Kode Pos -->
                        <template #cell-kode_pos="{ item }">
                            <span class="text-xs sm:text-sm font-medium text-gray-700">
                                {{ item.peserta_didik?.kode_pos || '-' }}
                            </span>
                        </template>

                        <!-- Custom cell for Nama Ayah -->
                        <template #cell-nama_ayah="{ item }">
                            <span class="text-xs sm:text-sm font-medium text-gray-700">
                                {{ item.peserta_didik?.nama_ayah || '-' }}
                            </span>
                        </template>

                        <!-- Custom cell for Nama Ibu -->
                        <template #cell-nama_ibu="{ item }">
                            <span class="text-xs sm:text-sm font-medium text-gray-700">
                                {{ item.peserta_didik?.nama_ibu || '-' }}
                            </span>
                        </template>

                        <!-- Custom cell for Status -->
                        <template #cell-status="{ item }">
                            <span :class="[
                                'inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold',
                                item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            ]">
                                {{ item.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                            </span>
                        </template>

                        <!-- Custom actions slot -->
                        <template #actions="{ item }">
                            <div class="flex items-center justify-center gap-1.5 sm:gap-2">
                                <ViewButton title="Lihat Detail" label="Lihat" @click="viewDetail(item)" />
                            </div>
                        </template>
                    </Table>
                </div>

                <!-- Empty State -->
                <div v-else class="flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-6">
                    <div class="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 sm:mb-6">
                        <i class="fa-solid fa-users text-2xl sm:text-4xl text-gray-400"></i>
                    </div>
                    <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                        Belum ada data siswa
                    </h3>
                    <p class="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 max-w-sm">
                        Belum ada siswa yang dipetakan di rombel ini
                    </p>
                </div>
            </template>
        </div>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useToastStore } from '~/stores/ToastStore'
import { useAuthGuard } from '~/composables/useAuthGuard'
import DashboardLayout from '~/components/DashboardLayout.vue'
import CreatePemetaanRombelModal from '~/components/modals/CreatePemetaanRombelModal.vue'
import ImportPemetaanRombelModal from '~/components/modals/ImportPemetaanRombelModal.vue'
import ResetPemetaanRombelModal from '~/components/modals/ResetPemetaanRombelModal.vue'
import SearchPemetaanRombelModal from '~/components/modals/SearchPemetaanRombelModal.vue'
import ViewPemetaanRombelModal from '~/components/modals/ViewPemetaanRombelModal.vue'
import Table from '~/components/Table.vue'
import ViewButton from '~/components/common/ViewButton.vue'

useHead({
    title: 'Pemetaan Rombel | PINTU SDN Sukapura 01',
    link: [
        {
            rel: 'icon',
            type: 'image/jpeg',
            href: '/logo-sekolah.jpg'
        }
    ]
})

const toastStore = useToastStore()
const config = useRuntimeConfig()
const { handle401 } = useAuthGuard()

const isLoadingRombel = ref(false)
const isLoading = ref(false)
const error = ref('')
const rombelList = ref<any[]>([])
const tahunPelajaranList = ref<any[]>([])
const siswaList = ref<any[]>([])
const totalData = ref(0)
const activeTab = ref(0)
const showCreateModal = ref(false)
const showImportModal = ref(false)
const showResetModal = ref(false)
const showSearchModal = ref(false)
const showViewModal = ref(false)
const selectedPemetaanId = ref(0)
const isExportingExcel = ref(false)
const isExportingPdf = ref(false)

const pagination = ref({
    page: 1,
    limit: 10
})

const filters = ref({
    tahun_pelajaran_id: 0,
    status: '',
    nama: ''
})

const tableColumns = [
    { key: 'nama', label: 'Nama' },
    { key: 'nis', label: 'NIS' },
    { key: 'jenis_kelamin', label: 'Jenis Kelamin' },
    { key: 'nisn', label: 'NISN' },
    { key: 'nik', label: 'NIK' },
    { key: 'tempat_lahir', label: 'Tempat Lahir' },
    { key: 'tanggal_lahir', label: 'Tanggal Lahir' },
    { key: 'agama', label: 'Agama' },
    { key: 'alamat', label: 'Alamat' },
    { key: 'rt', label: 'RT' },
    { key: 'rw', label: 'RW' },
    { key: 'kelurahan', label: 'Kelurahan' },
    { key: 'kecamatan', label: 'Kecamatan' },
    { key: 'kode_pos', label: 'Kode Pos' },
    { key: 'nama_ayah', label: 'Nama Ayah' },
    { key: 'nama_ibu', label: 'Nama Ibu' },
    { key: 'status', label: 'Status' }
]

// Fetch Rombel
const fetchRombel = async () => {
    isLoadingRombel.value = true

    try {
        const response = await $fetch<any>(`${config.public.apiBase}/api/v1/rombel/get-rombel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            credentials: 'include',
            body: {
                search: {},
                pagination: { limit: 100, page: 1 }
            }
        })

        rombelList.value = response.data || []
        if (rombelList.value.length > 0) {
            activeTab.value = rombelList.value[0].id
        }
    } catch (err: any) {
        console.error('Error fetching rombel:', err)
        if (err.status === 401 || err.statusCode === 401) {
            await handle401()
        }
    } finally {
        isLoadingRombel.value = false
    }
}

// Fetch Tahun Pelajaran
const fetchTahunPelajaran = async () => {
    try {
        const response = await $fetch<any>(`${config.public.apiBase}/api/v1/tahun-pelajaran/get-tahun-pelajaran`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            credentials: 'include',
            body: {
                search: {},
                pagination: { limit: 100, page: 1 }
            }
        })

        tahunPelajaranList.value = response.data || []
        
        // Set default to active tahun pelajaran
        const activeTp = tahunPelajaranList.value.find((tp: any) => tp.status === 'active')
        if (activeTp) {
            filters.value.tahun_pelajaran_id = activeTp.id
        }
    } catch (err: any) {
        console.error('Error fetching tahun pelajaran:', err)
        if (err.status === 401 || err.statusCode === 401) {
            await handle401()
        }
    }
}

// Fetch Pemetaan Rombel
const fetchPemetaanRombel = async () => {
    if (!activeTab.value || !filters.value.tahun_pelajaran_id) return

    isLoading.value = true
    error.value = ''

    try {
        const search: any = {
            rombel_id: activeTab.value,
            tahun_pelajaran_id: filters.value.tahun_pelajaran_id
        }

        if (filters.value.status) {
            search.status = filters.value.status
        }

        if (filters.value.nama) {
            search.nama = filters.value.nama
        }

        const response = await $fetch<any>(`${config.public.apiBase}/api/v1/peserta-didik/get-pemetaan-rombel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            credentials: 'include',
            body: {
                search,
                pagination: {
                    limit: pagination.value.limit,
                    page: pagination.value.page
                }
            }
        })

        siswaList.value = response.data || []
        totalData.value = response.pagination?.total || 0
    } catch (err: any) {
        console.error('Error fetching pemetaan rombel:', err)
        
        if (err.status === 401 || err.statusCode === 401) {
            await handle401()
            return
        }
        
        error.value = err.data?.message || 'Gagal memuat data siswa'
        toastStore.error('Gagal', error.value)
    } finally {
        isLoading.value = false
    }
}

const applyFilter = async () => {
    pagination.value.page = 1
    await fetchPemetaanRombel()
}

const onPageChange = (page: number) => {
    pagination.value.page = page
    fetchPemetaanRombel()
}

const onLimitChange = (limit: number) => {
    pagination.value.limit = limit
    pagination.value.page = 1
    fetchPemetaanRombel()
}

const openCreateModal = () => {
    showCreateModal.value = true
}

const openImportModal = () => {
    showImportModal.value = true
}

const openResetModal = () => {
    showResetModal.value = true
}

const openSearchModal = () => {
    showSearchModal.value = true
}

const handleCreateSuccess = () => {
    fetchPemetaanRombel()
}

const handleImportSuccess = () => {
    fetchPemetaanRombel()
}

const handleResetSuccess = () => {
    fetchPemetaanRombel()
}

const handleEdit = (item: any) => {
    // Close search modal
    showSearchModal.value = false
    
    // Open view modal to show details (since we don't have edit functionality yet)
    selectedPemetaanId.value = item.id
    showViewModal.value = true
    
    toastStore.success('Info', 'Fitur edit akan segera tersedia')
}

const handleDelete = async (item: any) => {
    // Close search modal
    showSearchModal.value = false
    
    if (!confirm(`Apakah Anda yakin ingin menghapus pemetaan rombel untuk ${item.peserta_didik?.nama}?`)) {
        return
    }

    try {
        await $fetch(`${config.public.apiBase}/api/v1/peserta-didik/delete-pemetaan-rombel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            credentials: 'include',
            body: {
                id: item.id
            }
        })

        toastStore.success('Berhasil', 'Pemetaan rombel berhasil dihapus')
        await fetchPemetaanRombel()
    } catch (err: any) {
        if (err.status === 401 || err.statusCode === 401) {
            await handle401()
            return
        }
        
        const errorMessage = err.data?.message || 'Gagal menghapus pemetaan rombel'
        toastStore.error('Gagal', errorMessage)
    }
}

const viewDetail = (item: any) => {
    selectedPemetaanId.value = item.id
    showViewModal.value = true
}

const exportExcel = async () => {
    if (!activeTab.value) {
        toastStore.error('Gagal', 'Pilih rombel terlebih dahulu')
        return
    }

    if (!filters.value.tahun_pelajaran_id) {
        toastStore.error('Gagal', 'Pilih tahun pelajaran terlebih dahulu')
        return
    }

    isExportingExcel.value = true

    try {
        // Get current rombel name
        const currentRombel = rombelList.value.find(r => r.id === activeTab.value)
        const rombelName = currentRombel ? currentRombel.name : 'rombel'
        
        const response = await fetch(`${config.public.apiBase}/api/v1/peserta-didik/export-pemetaan-rombel-excel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            credentials: 'include',
            body: JSON.stringify({ 
                rombel_id: activeTab.value,
                tahun_pelajaran_id: filters.value.tahun_pelajaran_id
            })
        })

        if (response.status === 401) {
            await handle401()
            return
        }

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Gagal export data Excel')
        }

        const contentDisposition = response.headers.get('Content-Disposition')
        let filename = `daftar-siswa-${rombelName}.xlsx`
        if (contentDisposition) {
            const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition)
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '')
            }
        }

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toastStore.success('Sukses', 'Data berhasil diexport ke Excel')
    } catch (err: any) {
        console.error('Error exporting Excel:', err)
        toastStore.error('Gagal', err.message || 'Gagal export data Excel')
    } finally {
        isExportingExcel.value = false
    }
}

const exportPdf = async () => {
    if (!activeTab.value) {
        toastStore.error('Gagal', 'Pilih rombel terlebih dahulu')
        return
    }

    if (!filters.value.tahun_pelajaran_id) {
        toastStore.error('Gagal', 'Pilih tahun pelajaran terlebih dahulu')
        return
    }

    isExportingPdf.value = true

    try {
        // Get current rombel name
        const currentRombel = rombelList.value.find(r => r.id === activeTab.value)
        const rombelName = currentRombel ? currentRombel.name : 'rombel'
        
        const response = await fetch(`${config.public.apiBase}/api/v1/peserta-didik/export-pemetaan-rombel-pdf`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            credentials: 'include',
            body: JSON.stringify({ 
                rombel_id: activeTab.value,
                tahun_pelajaran_id: filters.value.tahun_pelajaran_id
            })
        })

        if (response.status === 401) {
            await handle401()
            return
        }

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Gagal export data PDF')
        }

        const contentDisposition = response.headers.get('Content-Disposition')
        let filename = `daftar-siswa-${rombelName}.pdf`
        if (contentDisposition) {
            const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition)
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '')
            }
        }

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toastStore.success('Sukses', 'Data berhasil diexport ke PDF')
    } catch (err: any) {
        console.error('Error exporting PDF:', err)
        toastStore.error('Gagal', err.message || 'Gagal export data PDF')
    } finally {
        isExportingPdf.value = false
    }
}

// Watch active tab changes
watch(activeTab, () => {
    pagination.value.page = 1
    fetchPemetaanRombel()
})

// Load initial data
onMounted(async () => {
    await fetchTahunPelajaran()
    await fetchRombel()
    if (activeTab.value && filters.value.tahun_pelajaran_id) {
        await fetchPemetaanRombel()
    }
})
</script>

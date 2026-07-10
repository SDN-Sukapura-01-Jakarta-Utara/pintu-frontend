<template>
    <DashboardLayout>
        <!-- Create Master Data Siswa Modal -->
        <CreateMasterDataSiswaModal v-model="showCreateModal" @success="handleCreateSuccess" />
        
        <!-- Import Master Data Siswa Modal -->
        <ImportMasterDataSiswaModal v-model="showImportModal" @success="handleImportSuccess" />
        
        <!-- Download Kartu Pelajar Modal -->
        <DownloadKartuPelajarModal v-model="showDownloadKartuModal" @success="handleDownloadKartuSuccess" />
        
        <!-- Setting Siswa Lulus Modal -->
        <SettingSiswaLulusModal v-model="showSettingSiswaLulusModal" @success="handleSettingSiswaLulusSuccess" />
        
        <!-- Generate Barcode Confirmation Modal -->
        <ConfirmationGenerateBarcodeModal v-model="showGenerateBarcodeModal" @success="handleGenerateBarcodeSuccess" />
        
        <!-- Regenerate Barcode Confirmation Modal -->
        <ConfirmationRegenerateBarcodeModal v-model="showRegenerateBarcodeModal" :siswaId="selectedSiswaId" 
            :siswaName="selectedSiswaName" @success="handleRegenerateBarcodeSuccess" />
        
        <!-- Edit Master Data Siswa Modal -->
        <EditMasterDataSiswaModal v-model="showEditModal" :siswaId="selectedSiswaId" @success="handleEditSuccess" />
        
        <!-- View Master Data Siswa Modal -->
        <ViewMasterDataSiswaModal v-model="showViewModal" :siswaId="selectedSiswaId" />
        
        <!-- Delete Confirmation Modal -->
        <ConfirmationDeleteMasterDataSiswaModal v-model="showDeleteModal" :siswaId="selectedSiswaId" 
            :siswaName="selectedSiswaName" @success="handleDeleteSuccess" />

        <!-- Header Section -->
        <div class="mb-6 sm:mb-8">
            <div class="flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
                <div>
                    <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                        Data Induk Siswa
                    </h1>
                    <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
                        Data induk siswa dengan barcode permanen untuk absensi
                    </p>
                </div>
                <div class="flex items-center gap-2 sm:gap-3">
                    <button v-if="hasPermission('CREATE_PESERTA_DIDIK')" @click="openSettingSiswaLulusModal"
                        class="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-purple-600 text-white font-semibold text-xs sm:text-sm hover:bg-purple-700 transition-colors duration-200 cursor-pointer">
                        <i class="fa-solid fa-user-graduate"></i>
                        <span class="hidden sm:inline">Setting Siswa Lulus</span>
                        <span class="sm:hidden">Lulus</span>
                    </button>
                    <button v-if="hasPermission('CREATE_PESERTA_DIDIK')" @click="openGenerateBarcodeModal"
                        class="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-xs sm:text-sm hover:bg-blue-700 transition-colors duration-200 cursor-pointer">
                        <i class="fa-solid fa-qrcode"></i>
                        <span class="hidden sm:inline">Generate Barcode</span>
                        <span class="sm:hidden">Barcode</span>
                    </button>
                    <button v-if="hasPermission('CREATE_PESERTA_DIDIK')" @click="openImportModal"
                        class="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-green-600 text-white font-semibold text-xs sm:text-sm hover:bg-green-700 transition-colors duration-200 cursor-pointer">
                        <i class="fa-solid fa-file-import"></i>
                        <span class="hidden sm:inline">Import Data</span>
                        <span class="sm:hidden">Import</span>
                    </button>
                    <AddButton v-if="hasPermission('CREATE_PESERTA_DIDIK')" label="Tambah Data Siswa" iconClass="fa-solid fa-plus" @click="openCreateModal" />
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <!-- Tabs -->
            <div class="border-b border-gray-200">
                <nav class="flex overflow-x-auto" aria-label="Tabs">
                    <button
                        @click="activeTab = 'aktif'"
                        :class="[
                            'flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer',
                            activeTab === 'aktif'
                                ? 'border-red-600 text-red-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                        ]"
                    >
                        <i class="fa-solid fa-user-check"></i>
                        <span>Peserta Didik Aktif</span>
                    </button>
                    <button
                        @click="activeTab = 'tidak-aktif'"
                        :class="[
                            'flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer',
                            activeTab === 'tidak-aktif'
                                ? 'border-red-600 text-red-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                        ]"
                    >
                        <i class="fa-solid fa-user-xmark"></i>
                        <span>Peserta Didik Tidak Aktif</span>
                    </button>
                    <button
                        @click="activeTab = 'mutasi'"
                        :class="[
                            'flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer',
                            activeTab === 'mutasi'
                                ? 'border-red-600 text-red-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                        ]"
                    >
                        <i class="fa-solid fa-user-minus"></i>
                        <span>Peserta Didik Mutasi</span>
                    </button>
                    <button
                        @click="activeTab = 'lulus'"
                        :class="[
                            'flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer',
                            activeTab === 'lulus'
                                ? 'border-red-600 text-red-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                        ]"
                    >
                        <i class="fa-solid fa-user-graduate"></i>
                        <span>Peserta Didik Lulus</span>
                    </button>
                </nav>
            </div>

            <!-- Filter Section -->
            <div class="bg-white p-4 sm:p-6 border-b border-gray-200">
                <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Data Siswa</h3>

                <!-- Filter Form -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <!-- Nama Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            Nama
                        </label>
                        <input v-model="filters.nama" type="text" placeholder="Cari nama..."
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                    </div>

                    <!-- NIS Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            NIS
                        </label>
                        <input v-model="filters.nis" type="text" placeholder="Cari NIS..."
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                    </div>

                    <!-- Jenis Kelamin Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            Jenis Kelamin
                        </label>
                        <select v-model="filters.jenis_kelamin"
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                            <option value="">Semua Jenis Kelamin</option>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                        </select>
                    </div>

                    <!-- NISN Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            NISN
                        </label>
                        <input v-model="filters.nisn" type="text" placeholder="Cari NISN..."
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                    </div>

                    <!-- Tempat Lahir Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            Tempat Lahir
                        </label>
                        <input v-model="filters.tempat_lahir" type="text" placeholder="Cari tempat lahir..."
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                    </div>

                    <!-- Tanggal Lahir Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            Tanggal Lahir
                        </label>
                        <input v-model="filters.tanggal_lahir" type="date"
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                    </div>

                    <!-- NIK Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            NIK
                        </label>
                        <input v-model="filters.nik" type="text" placeholder="Cari NIK..."
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                    </div>

                    <!-- Agama Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            Agama
                        </label>
                        <select v-model="filters.agama"
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                            <option value="">Semua Agama</option>
                            <option value="Islam">Islam</option>
                            <option value="Kristen">Kristen</option>
                            <option value="Katolik">Katolik</option>
                            <option value="Hindu">Hindu</option>
                            <option value="Buddha">Buddha</option>
                            <option value="Konghucu">Konghucu</option>
                        </select>
                    </div>


                </div>

                <!-- Filter Buttons -->
                <div class="flex gap-3 mt-4 flex-wrap">
                    <button @click="applyFilter"
                        class="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors duration-200 cursor-pointer">
                        <i class="fa-solid fa-magnifying-glass w-4 h-4"></i>
                        Cari
                    </button>
                    <button @click="clearFilter"
                        class="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                        <i class="fa-solid fa-rotate-left w-4 h-4"></i>
                        Reset Filter
                    </button>
                    <button @click="exportExcel" :disabled="isExportingExcel"
                        class="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold text-xs sm:text-sm hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        <i v-if="!isExportingExcel" class="fa-solid fa-file-excel w-4 h-4"></i>
                        <i v-else class="fa-solid fa-spinner fa-spin w-4 h-4"></i>
                        Export Excel
                    </button>
                    <button @click="exportPdf" :disabled="isExportingPdf"
                        class="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold text-xs sm:text-sm hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        <i v-if="!isExportingPdf" class="fa-solid fa-file-pdf w-4 h-4"></i>
                        <i v-else class="fa-solid fa-spinner fa-spin w-4 h-4"></i>
                        Export PDF
                    </button>
                    <button v-if="activeTab === 'aktif'" @click="openDownloadKartuModal"
                        class="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-700 text-white font-semibold text-xs sm:text-sm hover:bg-amber-800 transition-colors duration-200 cursor-pointer">
                        <i class="fa-solid fa-id-card w-4 h-4"></i>
                        Download Kartu Pelajar
                    </button>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="p-8 sm:p-12 flex items-center justify-center">
                <div class="flex flex-col items-center gap-3 sm:gap-4">
                    <div
                        class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
                    </div>
                    <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data siswa...</p>
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="p-4 sm:p-6">
                <div class="rounded-xl border-2 border-red-200 bg-red-50 p-4 sm:p-6 flex items-start gap-3 sm:gap-4">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 sm:h-6 sm:w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="flex-1">
                        <h3 class="text-base sm:text-lg font-semibold text-red-900">Gagal memuat data</h3>
                        <p class="mt-1 text-sm sm:text-base text-red-800">{{ error }}</p>
                        <button @click="fetchMasterDataSiswa"
                            class="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors">
                            <i class="fa-solid fa-rotate-right w-3 h-3 sm:w-4 sm:h-4"></i>
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </div>

            <!-- Table Section -->
            <template v-else>
                <!-- Data Table -->
                <div v-if="siswaList.length > 0">
                    <Table :items="siswaList" :columns="tableColumns" :current-page="pagination.page"
                        :current-limit="pagination.limit" :total="totalData" :is-loading="isLoading"
                        @pageChange="onPageChange" @limitChange="onLimitChange">

                        <!-- Custom cell for Jenis Kelamin -->
                        <template #cell-jenis_kelamin="{ item }">
                            <span class="text-xs sm:text-sm font-medium text-gray-700">
                                {{ item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}
                            </span>
                        </template>

                        <!-- Custom cell for Status -->
                        <template #cell-status="{ item }">
                            <span :class="[
                                'inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold',
                                item.status === 'active' ? 'bg-green-100 text-green-800' : 
                                item.status === 'inactive' ? 'bg-red-100 text-red-800' :
                                item.status === 'mutasi' ? 'bg-orange-100 text-orange-800' :
                                item.status === 'lulus' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                            ]">
                                {{ 
                                    item.status === 'active' ? 'Aktif' : 
                                    item.status === 'inactive' ? 'Nonaktif' :
                                    item.status === 'mutasi' ? 'Mutasi' :
                                    item.status === 'lulus' ? 'Lulus' :
                                    item.status
                                }}
                            </span>
                        </template>

                        <!-- Custom cell for Photo -->
                        <template #cell-photo="{ item }">
                            <div v-if="item.photo" class="flex justify-center">
                                <img :src="item.photo" alt="Foto Siswa" class="w-16 h-20 object-cover rounded border-2 border-gray-300 shadow-sm" />
                            </div>
                            <span v-else class="text-xs text-gray-500 italic">Belum ada foto</span>
                        </template>

                        <!-- Custom cell for Barcode -->
                        <template #cell-barcode="{ item }">
                            <BarcodeDisplay :value="item.barcode" :size="80" />
                        </template>

                        <!-- Custom actions slot -->
                        <template #actions="{ item }">
                            <div class="flex items-center justify-center gap-1.5 sm:gap-2">
                                <!-- View Button -->
                                <ViewButton title="Lihat Detail" label="Lihat" @click="viewDetail(item)" />

                                <!-- Edit Button -->
                                <EditButton v-if="hasPermission('UPDATE_PESERTA_DIDIK')" title="Edit" label="Edit" @click="editSiswa(item)" />

                                <!-- Barcode Button -->
                                <button v-if="hasPermission('UPDATE_PESERTA_DIDIK')" @click="generateBarcodeById(item)" :disabled="isGeneratingBarcode"
                                    :title="item.barcode ? 'Generate Ulang Barcode' : 'Generate Barcode'"
                                    class="inline-flex items-center justify-center gap-1.5 px-3 sm:px-2.5 py-2 sm:pt-2.5 sm:pb-1.5 rounded-lg bg-gradient-to-br from-cyan-50 to-teal-100 text-cyan-700 font-semibold text-xs border border-cyan-200 shadow-sm hover:shadow-md hover:from-cyan-100 hover:to-teal-200 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm cursor-pointer">
                                    <i class="fa-solid fa-qrcode w-3.5 h-3.5 sm:w-5 sm:h-5 text-sm sm:text-base"></i>
                                </button>

                                <!-- Delete Button -->
                                <DeleteButton v-if="hasPermission('DELETE_PESERTA_DIDIK')" title="Hapus" label="Hapus" @click="deleteSiswa(item)" />
                            </div>
                        </template>
                    </Table>
                </div>

                <!-- Empty State -->
                <div v-else class="flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-6">
                    <div
                        class="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 sm:mb-6">
                        <i :class="[
                            hasActiveFilters ? 'fa-solid fa-magnifying-glass' : 'fa-solid fa-users',
                            'text-2xl sm:text-4xl text-gray-400'
                        ]"></i>
                    </div>
                    <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                        {{ hasActiveFilters ? 'Data tidak ditemukan' : 'Belum ada data siswa' }}
                    </h3>
                    <p class="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 max-w-sm">
                        {{ hasActiveFilters ? 'Data tidak ditemukan dalam pencarian' : 'Belum ada data siswa yang terdaftar' }}
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
import { useAuth } from '~/composables/useAuth'
import DashboardLayout from '~/components/DashboardLayout.vue'
import CreateMasterDataSiswaModal from '~/components/modals/CreateMasterDataSiswaModal.vue'
import ImportMasterDataSiswaModal from '~/components/modals/ImportMasterDataSiswaModal.vue'
import SettingSiswaLulusModal from '~/components/modals/SettingSiswaLulusModal.vue'
import ConfirmationGenerateBarcodeModal from '~/components/modals/ConfirmationGenerateBarcodeModal.vue'
import ConfirmationRegenerateBarcodeModal from '~/components/modals/ConfirmationRegenerateBarcodeModal.vue'
import EditMasterDataSiswaModal from '~/components/modals/EditMasterDataSiswaModal.vue'
import ViewMasterDataSiswaModal from '~/components/modals/ViewMasterDataSiswaModal.vue'
import ConfirmationDeleteMasterDataSiswaModal from '~/components/modals/ConfirmationDeleteMasterDataSiswaModal.vue'
import DownloadKartuPelajarModal from '~/components/modals/DownloadKartuPelajarModal.vue'
import BarcodeDisplay from '~/components/common/BarcodeDisplay.vue'
import AddButton from '~/components/common/AddButton.vue'
import Table from '~/components/Table.vue'
import ViewButton from '~/components/common/ViewButton.vue'
import EditButton from '~/components/common/EditButton.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'

useHead({
    title: 'Data Induk Siswa | PINTU SDN Sukapura 01',
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
const { hasPermission } = useAuth()

const isLoading = ref(false)
const error = ref('')
const siswaList = ref<any[]>([])
const totalData = ref(0)
const activeTab = ref('aktif')
const showCreateModal = ref(false)
const showImportModal = ref(false)
const showSettingSiswaLulusModal = ref(false)
const showGenerateBarcodeModal = ref(false)
const showRegenerateBarcodeModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const showDeleteModal = ref(false)
const showDownloadKartuModal = ref(false)
const selectedSiswaId = ref(0)
const selectedSiswaName = ref('')
const isGeneratingBarcode = ref(false)
const isExportingExcel = ref(false)
const isExportingPdf = ref(false)

const pagination = ref({
    page: 1,
    limit: 10
})

const filters = ref({
    nama: '',
    nis: '',
    jenis_kelamin: '',
    nisn: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    nik: '',
    agama: '',
    status: ''
})

const tableColumns = [
    { key: 'nama', label: 'Nama', sortable: true },
    { key: 'nis', label: 'NIS', sortable: true },
    { key: 'jenis_kelamin', label: 'Jenis Kelamin', sortable: true },
    { key: 'nisn', label: 'NISN', sortable: true },
    { key: 'tempat_lahir', label: 'Tempat Lahir', sortable: true },
    { key: 'tanggal_lahir', label: 'Tanggal Lahir', sortable: true },
    { key: 'nik', label: 'NIK', sortable: true },
    { key: 'agama', label: 'Agama', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'photo', label: 'Foto', sortable: false },
    { key: 'barcode', label: 'Barcode', sortable: false }
]

// Computed
const hasActiveFilters = computed(() => {
    return filters.value.nama !== '' ||
        filters.value.nis !== '' ||
        filters.value.nisn !== '' ||
        filters.value.jenis_kelamin !== '' ||
        filters.value.tempat_lahir !== '' ||
        filters.value.tanggal_lahir !== '' ||
        filters.value.nik !== '' ||
        filters.value.agama !== '' ||
        filters.value.status !== ''
})

// Methods
const fetchMasterDataSiswa = async () => {
    isLoading.value = true
    error.value = ''

    try {
        const search: any = {}

        // Apply tab-based status filter
        if (activeTab.value === 'aktif') {
            search.status = 'active'
        } else if (activeTab.value === 'tidak-aktif') {
            search.status = 'inactive'
        } else if (activeTab.value === 'mutasi') {
            search.status = 'mutasi'
        } else if (activeTab.value === 'lulus') {
            search.status = 'lulus'
        }

        // Apply other filters
        if (filters.value.nama) search.nama = filters.value.nama
        if (filters.value.nis) search.nis = filters.value.nis
        if (filters.value.jenis_kelamin) search.jenis_kelamin = filters.value.jenis_kelamin
        if (filters.value.nisn) search.nisn = filters.value.nisn
        if (filters.value.tempat_lahir) search.tempat_lahir = filters.value.tempat_lahir
        if (filters.value.tanggal_lahir) search.tanggal_lahir = filters.value.tanggal_lahir
        if (filters.value.nik) search.nik = filters.value.nik
        if (filters.value.agama) search.agama = filters.value.agama

        const response = await $fetch<any>(`${config.public.apiBase}/api/v1/peserta-didik/get-peserta-didik`, {
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
        console.error('Error fetching master data siswa:', err)
        
        // Handle 401 Unauthorized - session expired
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
    await fetchMasterDataSiswa()
}

const clearFilter = async () => {
    filters.value = {
        nama: '',
        nis: '',
        jenis_kelamin: '',
        nisn: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        nik: '',
        agama: '',
        status: ''
    }
    pagination.value.page = 1
    await fetchMasterDataSiswa()
}

const onPageChange = (page: number) => {
    pagination.value.page = page
    fetchMasterDataSiswa()
}

const onLimitChange = (limit: number) => {
    pagination.value.limit = limit
    pagination.value.page = 1
    fetchMasterDataSiswa()
}

const openCreateModal = () => {
    showCreateModal.value = true
}

const openImportModal = () => {
    showImportModal.value = true
}

const openSettingSiswaLulusModal = () => {
    showSettingSiswaLulusModal.value = true
}

const openGenerateBarcodeModal = () => {
    showGenerateBarcodeModal.value = true
}

const handleCreateSuccess = () => {
    pagination.value.page = 1
    fetchMasterDataSiswa()
}

const handleImportSuccess = () => {
    pagination.value.page = 1
    fetchMasterDataSiswa()
}

const handleSettingSiswaLulusSuccess = () => {
    fetchMasterDataSiswa()
}

const handleGenerateBarcodeSuccess = () => {
    fetchMasterDataSiswa()
}

const handleRegenerateBarcodeSuccess = () => {
    fetchMasterDataSiswa()
}

const handleEditSuccess = () => {
    fetchMasterDataSiswa()
}

const handleDeleteSuccess = () => {
    fetchMasterDataSiswa()
}

const generateBarcodeById = async (item: any) => {
    // If barcode already exists, show confirmation modal
    if (item.barcode) {
        selectedSiswaId.value = item.id
        selectedSiswaName.value = item.nama
        showRegenerateBarcodeModal.value = true
        return
    }

    // If no barcode, generate directly
    isGeneratingBarcode.value = true

    try {
        await $fetch(`${config.public.apiBase}/api/v1/peserta-didik/generate-barcode-peserta-didik-by-id`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: {
                id: item.id
            }
        })

        toastStore.success('Sukses', 'Barcode berhasil digenerate')
        await fetchMasterDataSiswa()
    } catch (err: any) {
        console.error('Error generating barcode:', err)
        
        if (err.status === 401 || err.statusCode === 401) {
            await handle401()
            return
        }
        
        const errorMessage = err.data?.message || 'Gagal generate barcode'
        toastStore.error('Gagal', errorMessage)
    } finally {
        isGeneratingBarcode.value = false
    }
}

const viewDetail = (item: any) => {
    selectedSiswaId.value = item.id
    showViewModal.value = true
}

const editSiswa = (item: any) => {
    selectedSiswaId.value = item.id
    showEditModal.value = true
}

const deleteSiswa = (item: any) => {
    selectedSiswaId.value = item.id
    selectedSiswaName.value = item.nama
    showDeleteModal.value = true
}

const openDownloadKartuModal = () => {
    showDownloadKartuModal.value = true
}

const handleDownloadKartuSuccess = () => {
    // Optional: refresh data if needed
}

const exportExcel = async () => {
    isExportingExcel.value = true

    try {
        let status = 'active'
        if (activeTab.value === 'aktif') {
            status = 'active'
        } else if (activeTab.value === 'tidak-aktif') {
            status = 'inactive'
        } else if (activeTab.value === 'mutasi') {
            status = 'mutasi'
        } else if (activeTab.value === 'lulus') {
            status = 'lulus'
        }

        const response = await fetch(`${config.public.apiBase}/api/v1/peserta-didik/export-data-induk-siswa-excel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            credentials: 'include',
            body: JSON.stringify({ status })
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
        let filename = 'data-induk-siswa.xlsx'
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
    isExportingPdf.value = true

    try {
        let status = 'active'
        if (activeTab.value === 'aktif') {
            status = 'active'
        } else if (activeTab.value === 'tidak-aktif') {
            status = 'inactive'
        } else if (activeTab.value === 'mutasi') {
            status = 'mutasi'
        } else if (activeTab.value === 'lulus') {
            status = 'lulus'
        }

        const response = await fetch(`${config.public.apiBase}/api/v1/peserta-didik/export-data-induk-siswa-pdf`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            credentials: 'include',
            body: JSON.stringify({ status })
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
        let filename = 'data-induk-siswa.pdf'
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
    fetchMasterDataSiswa()
})

// Load initial data
onMounted(async () => {
    await fetchMasterDataSiswa()
})
</script>

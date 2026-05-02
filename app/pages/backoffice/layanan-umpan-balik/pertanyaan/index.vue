<template>
    <DashboardLayout>
        <!-- Detail Modal -->
        <PertanyaanDetailModal 
            :isOpen="showDetailModal" 
            :data="selectedPertanyaan"
            :isLoading="isLoadingDetail"
            @close="closeDetailModal"
            @refresh="handleRefreshFromModal"
        />

        <!-- Delete Confirmation Modal -->
        <ConfirmationDeleteModal 
            v-model="showDeleteModal" 
            title="Hapus Pertanyaan"
            :message="`Apakah Anda yakin ingin menghapus pertanyaan dari '${selectedPertanyaan?.nama}' dengan ID Tiket '${selectedPertanyaan?.id_tiket}'? Tindakan ini tidak dapat dibatalkan.`"
            :is-loading="isDeleting"
            @confirm="handleDelete"
        />

        <!-- Header Section -->
        <div class="mb-6 sm:mb-8">
            <div class="flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
                <div>
                    <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                        Pertanyaan
                    </h1>
                    <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
                        Kelola pertanyaan dari masyarakat
                    </p>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <!-- Loading State -->
            <div v-if="isLoading" class="flex items-center justify-center py-8 sm:py-12">
                <div class="flex flex-col items-center gap-3 sm:gap-4">
                    <div class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
                    <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data pertanyaan...</p>
                </div>
            </div>

            <!-- Success State: Filter & Table Section -->
            <template v-else>
                <!-- Filter Section -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                    <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Data Pertanyaan</h3>

                    <!-- Filter Form -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <!-- ID Tiket -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                ID Tiket
                            </label>
                            <input 
                                v-model="filters.id_tiket" 
                                type="text" 
                                placeholder="Cari ID Tiket..."
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                            />
                        </div>

                        <!-- Start Date -->
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

                        <!-- End Date -->
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

                        <!-- Nama -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                Nama
                            </label>
                            <input 
                                v-model="filters.nama" 
                                type="text" 
                                placeholder="Cari Nama..."
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                            />
                        </div>

                        <!-- Email -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                Email
                            </label>
                            <input 
                                v-model="filters.email" 
                                type="text" 
                                placeholder="Cari Email..."
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                            />
                        </div>

                        <!-- Kategori -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                Kategori
                            </label>
                            <select 
                                v-model="filters.kategori" 
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                            >
                                <option value="">Semua Kategori</option>
                                <option value="Akademik">Akademik</option>
                                <option value="Non-Akademik">Non-Akademik</option>
                                <option value="Kegiatan Sekolah">Kegiatan Sekolah</option>
                                <option value="Penerimaan Murid Baru (SPMB)">Penerimaan Murid Baru (SPMB)</option>
                                <option value="Mutasi Siswa">Mutasi Siswa</option>
                                <option value="KJP">KJP</option>
                                <option value="PIP">PIP</option>
                                <option value="Administrasi">Administrasi</option>
                                <option value="Informasi Umum">Informasi Umum</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>

                        <!-- Prioritas -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                Prioritas
                            </label>
                            <select 
                                v-model="filters.prioritas" 
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                            >
                                <option value="">Semua Prioritas</option>
                                <option value="Tinggi">Tinggi</option>
                                <option value="Sedang">Sedang</option>
                                <option value="Rendah">Rendah</option>
                            </select>
                        </div>

                        <!-- Judul -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                Judul
                            </label>
                            <input 
                                v-model="filters.judul" 
                                type="text" 
                                placeholder="Cari Judul..."
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                            />
                        </div>

                        <!-- Status -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                Status
                            </label>
                            <select 
                                v-model="filters.status" 
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                            >
                                <option value="">Semua Status</option>
                                <option value="pending">Pending</option>
                                <option value="processed">Processed</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                    </div>

                    <!-- Filter Buttons -->
                    <div class="flex gap-3 mt-4">
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
                    <!-- Data Table -->
                    <div v-if="pertanyaanList && pertanyaanList.length > 0">
                        <Table 
                            :items="pertanyaanList" 
                            :columns="tableColumns"
                            :current-page="pagination.page" 
                            :current-limit="pagination.limit"
                            :total="totalData" 
                            :is-loading="isLoading" 
                            @pageChange="onPageChange" 
                            @limitChange="onLimitChange"
                        >
                            <!-- Custom cell for tanggal_pengajuan -->
                            <template #cell-tanggal_pengajuan="{ item }">
                                <span class="text-xs sm:text-sm md:text-[15px] text-gray-700">
                                    {{ formatDate(item.tanggal_pengajuan) }}
                                </span>
                            </template>

                            <!-- Custom cell for prioritas -->
                            <template #cell-prioritas="{ item }">
                                <span 
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                    :class="{
                                        'bg-green-100 text-green-800': item.prioritas === 'Rendah',
                                        'bg-yellow-100 text-yellow-800': item.prioritas === 'Sedang',
                                        'bg-red-100 text-red-800': item.prioritas === 'Tinggi'
                                    }"
                                >
                                    {{ item.prioritas }}
                                </span>
                            </template>

                            <!-- Custom cell for judul -->
                            <template #cell-judul="{ item }">
                                <p class="text-xs sm:text-sm md:text-[15px] text-gray-700 line-clamp-2">
                                    {{ truncateText(item.judul, 50) }}
                                </p>
                            </template>

                            <!-- Custom cell for email_terkirim -->
                            <template #cell-email_terkirim="{ item }">
                                <span 
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                    :class="item.email_terkirim ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                                >
                                    {{ item.email_terkirim ? 'Ya' : 'Tidak' }}
                                </span>
                            </template>

                            <!-- Custom cell for tanggal_proses -->
                            <template #cell-tanggal_proses="{ item }">
                                <span class="text-xs sm:text-sm md:text-[15px] text-gray-700">
                                    {{ item.tanggal_proses ? formatDate(item.tanggal_proses) : '-' }}
                                </span>
                            </template>

                            <!-- Custom cell for tanggal_selesai -->
                            <template #cell-tanggal_selesai="{ item }">
                                <span class="text-xs sm:text-sm md:text-[15px] text-gray-700">
                                    {{ item.tanggal_selesai ? formatDate(item.tanggal_selesai) : '-' }}
                                </span>
                            </template>

                            <!-- Custom cell for status -->
                            <template #cell-status="{ item }">
                                <span 
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                    :class="{
                                        'bg-orange-100 text-orange-800': item.status === 'pending',
                                        'bg-blue-100 text-blue-800': item.status === 'processed',
                                        'bg-gray-100 text-gray-800': item.status === 'closed'
                                    }"
                                >
                                    {{ getStatusLabel(item.status) }}
                                </span>
                            </template>

                            <!-- Custom actions slot -->
                            <template #actions="{ item }">
                                <div class="flex items-center justify-center gap-1.5 sm:gap-2">
                                    <!-- View Button -->
                                    <ViewButton title="Lihat Detail" label="Lihat" @click="viewDetail(item)" />

                                    <!-- Delete Button -->
                                    <DeleteButton title="Hapus" label="Hapus" @click="confirmDelete(item)" />
                                </div>
                            </template>
                        </Table>
                    </div>

                    <!-- Empty State -->
                    <div v-else class="flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-6">
                        <div class="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 sm:mb-6">
                            <i :class="[
                                hasActiveFilters ? 'fa-solid fa-magnifying-glass' : 'fa-solid fa-question-circle',
                                'text-2xl sm:text-4xl text-gray-400'
                            ]"></i>
                        </div>
                        <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                            {{ hasActiveFilters ? 'Data tidak ditemukan' : 'Belum ada pertanyaan' }}
                        </h3>
                        <p class="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 max-w-sm">
                            {{ hasActiveFilters ? 'Data tidak ditemukan dalam pencarian' : 'Belum ada pertanyaan yang masuk dari masyarakat' }}
                        </p>
                    </div>
                </div>
            </template>
        </div>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from '~/composables/useToast'
import DashboardLayout from '~/components/DashboardLayout.vue'
import PertanyaanDetailModal from '~/components/modals/PertanyaanDetailModal.vue'
import ConfirmationDeleteModal from '~/components/modals/ConfirmationDeleteModal.vue'
import ViewButton from '~/components/common/ViewButton.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'
import Table from '~/components/Table.vue'

definePageMeta({
    middleware: 'auth'
})

const { success, error } = useToast()
const config = useRuntimeConfig()

// State
const isLoading = ref(false)
const pertanyaanList = ref<any[]>([])
const totalData = ref(0)
const showDetailModal = ref(false)
const selectedPertanyaan = ref<any>(null)
const isLoadingDetail = ref(false)
const showDeleteModal = ref(false)
const isDeleting = ref(false)

// Filters
const filters = ref({
    id_tiket: '',
    start_date: '',
    end_date: '',
    nama: '',
    email: '',
    kategori: '',
    prioritas: '',
    judul: '',
    status: ''
})

// Pagination
const pagination = ref({
    page: 1,
    limit: 10
})

// Table columns
const tableColumns = [
    { key: 'id_tiket', label: 'ID Tiket', sortable: false },
    { key: 'tanggal_pengajuan', label: 'Tanggal Pengajuan', sortable: true },
    { key: 'nama', label: 'Nama', sortable: false },
    { key: 'email', label: 'Email', sortable: false },
    { key: 'telepon', label: 'Telepon', sortable: false },
    { key: 'kategori', label: 'Kategori', sortable: false },
    { key: 'prioritas', label: 'Prioritas', sortable: false },
    { key: 'judul', label: 'Judul', sortable: false },
    { key: 'email_terkirim', label: 'Email Terkirim', sortable: false },
    { key: 'tanggal_proses', label: 'Tanggal Proses', sortable: true },
    { key: 'tanggal_selesai', label: 'Tanggal Selesai', sortable: true },
    { key: 'status', label: 'Status', sortable: false },
]

// Computed
const hasActiveFilters = computed(() => {
    return filters.value.id_tiket !== '' || 
           filters.value.start_date !== '' || 
           filters.value.end_date !== '' ||
           filters.value.nama !== '' ||
           filters.value.email !== '' ||
           filters.value.kategori !== '' ||
           filters.value.prioritas !== '' ||
           filters.value.judul !== '' ||
           filters.value.status !== ''
})

// Helper functions
const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return '-'
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
}

const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric'
    })
}

const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
        pending: 'Menunggu',
        processed: 'Diproses',
        closed: 'Ditutup'
    }
    return labels[status] || status
}

// Methods
const fetchData = async () => {
    isLoading.value = true
    try {
        const token = localStorage.getItem('auth_token')
        
        const response = await fetch(`${config.public.apiBase}/api/v1/pertanyaan/get-pertanyaan`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                search: {
                    id_tiket: filters.value.id_tiket,
                    start_date: filters.value.start_date,
                    end_date: filters.value.end_date,
                    nama: filters.value.nama,
                    email: filters.value.email,
                    kategori: filters.value.kategori,
                    prioritas: filters.value.prioritas,
                    judul: filters.value.judul,
                    status: filters.value.status
                },
                pagination: {
                    limit: pagination.value.limit,
                    page: pagination.value.page
                }
            })
        })

        if (!response.ok) {
            throw new Error('Failed to fetch pertanyaan')
        }

        const result = await response.json()
        pertanyaanList.value = result.data || []
        totalData.value = result.pagination?.total || 0
    } catch (err: any) {
        error('Gagal Memuat Data', err.message || 'Terjadi kesalahan saat memuat data pertanyaan')
        pertanyaanList.value = []
        totalData.value = 0
    } finally {
        isLoading.value = false
    }
}

const applyFilter = () => {
    pagination.value.page = 1
    fetchData()
}

const clearFilter = () => {
    filters.value = {
        id_tiket: '',
        start_date: '',
        end_date: '',
        nama: '',
        email: '',
        kategori: '',
        prioritas: '',
        judul: '',
        status: ''
    }
    pagination.value.page = 1
    fetchData()
}

const onPageChange = (page: number) => {
    pagination.value.page = page
    fetchData()
}

const onLimitChange = (limit: number) => {
    pagination.value.limit = limit
    pagination.value.page = 1
    fetchData()
}

const viewDetail = async (item: any) => {
    isLoadingDetail.value = true
    showDetailModal.value = true
    selectedPertanyaan.value = null
    
    try {
        const token = localStorage.getItem('auth_token')
        
        const response = await fetch(`${config.public.apiBase}/api/v1/pertanyaan/get-pertanyaan-by-id`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id: item.id })
        })

        if (!response.ok) {
            throw new Error('Failed to fetch pertanyaan detail')
        }

        const result = await response.json()
        selectedPertanyaan.value = result.data
    } catch (err: any) {
        error('Gagal Memuat Detail', 'Gagal memuat detail pertanyaan')
        showDetailModal.value = false
    } finally {
        isLoadingDetail.value = false
    }
}

const closeDetailModal = () => {
    showDetailModal.value = false
    selectedPertanyaan.value = null
}

const handleRefreshFromModal = () => {
    // Refresh table data when modal emits refresh event
    fetchData()
}

const confirmDelete = (item: any) => {
    selectedPertanyaan.value = item
    showDeleteModal.value = true
}

const handleDelete = async () => {
    if (!selectedPertanyaan.value) return
    
    isDeleting.value = true
    
    try {
        const token = localStorage.getItem('auth_token')
        
        const response = await fetch(`${config.public.apiBase}/api/v1/pertanyaan/delete-pertanyaan`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id: selectedPertanyaan.value.id })
        })

        if (!response.ok) {
            throw new Error('Failed to delete pertanyaan')
        }

        success('Pertanyaan Berhasil Dihapus', 'Data pertanyaan berhasil dihapus')
        showDeleteModal.value = false
        selectedPertanyaan.value = null
        
        // Refresh data
        await fetchData()
    } catch (err: any) {
        const errorMessage = err.message || 'Gagal menghapus pertanyaan'
        error('Gagal Menghapus Data', errorMessage)
    } finally {
        isDeleting.value = false
    }
}

// Lifecycle
onMounted(() => {
    fetchData()
})
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

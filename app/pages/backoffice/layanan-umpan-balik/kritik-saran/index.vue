<template>
    <DashboardLayout>
        <!-- Detail Modal -->
        <KritikSaranDetailModal 
            :isOpen="showDetailModal" 
            :data="selectedKritikSaran"
            :isLoading="isLoadingDetail"
            @close="closeDetailModal"
        />

        <!-- Delete Confirmation Modal -->
        <ConfirmationDeleteModal 
            v-model="showDeleteModal" 
            title="Hapus Kritik & Saran"
            :message="`Apakah Anda yakin ingin menghapus kritik dan saran dari '${selectedKritikSaran?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
            :is-loading="isDeleting"
            @confirm="handleDelete"
        />

        <!-- Header Section -->
        <div class="mb-6 sm:mb-8">
            <div class="flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
                <div>
                    <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                        Kritik & Saran
                    </h1>
                    <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
                        Kelola kritik dan saran dari masyarakat
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
                    <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data kritik & saran...</p>
                </div>
            </div>

            <!-- Success State: Filter & Table Section -->
            <template v-else>
                <!-- Filter Section -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                    <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Data Kritik & Saran</h3>

                    <!-- Filter Form -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <div v-if="store.kritikSaranList && store.kritikSaranList.length > 0">
                        <Table 
                            :items="store.kritikSaranList" 
                            :columns="tableColumns"
                            :current-page="pagination.page" 
                            :current-limit="pagination.limit"
                            :total="store.pagination.total" 
                            :is-loading="isLoading" 
                            @pageChange="onPageChange" 
                            @limitChange="onLimitChange"
                        >
                            <!-- Custom cell for kritik_saran column -->
                            <template #cell-kritik_saran="{ item }">
                                <p class="text-xs sm:text-sm md:text-[15px] text-gray-700 line-clamp-2">
                                    {{ truncateText(item.kritik_saran, 100) }}
                                </p>
                            </template>

                            <!-- Custom cell for created_at column -->
                            <template #cell-created_at="{ item }">
                                <span class="text-xs sm:text-sm md:text-[15px] text-gray-700">
                                    {{ formatDate(item.created_at) }}
                                </span>
                            </template>

                            <!-- Custom actions slot -->
                            <template #actions="{ item }">
                                <div class="flex items-center justify-center gap-1.5 sm:gap-2">
                                    <!-- View Button -->
                                    <ViewButton title="Lihat Detail" label="Lihat" @click="viewDetail(item.id)" />

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
                                hasActiveFilters ? 'fa-solid fa-magnifying-glass' : 'fa-solid fa-comment-dots',
                                'text-2xl sm:text-4xl text-gray-400'
                            ]"></i>
                        </div>
                        <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                            {{ hasActiveFilters ? 'Data tidak ditemukan' : 'Belum ada kritik & saran' }}
                        </h3>
                        <p class="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 max-w-sm">
                            {{ hasActiveFilters ? 'Data tidak ditemukan dalam pencarian' : 'Belum ada kritik dan saran yang masuk dari masyarakat' }}
                        </p>
                    </div>
                </div>
            </template>
        </div>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useKritikSaranStore } from '~/stores/kritik-saran'
import { useToast } from '~/composables/useToast'
import DashboardLayout from '~/components/DashboardLayout.vue'
import KritikSaranDetailModal from '~/components/modals/KritikSaranDetailModal.vue'
import ConfirmationDeleteModal from '~/components/modals/ConfirmationDeleteModal.vue'
import ViewButton from '~/components/common/ViewButton.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'
import Table from '~/components/Table.vue'

definePageMeta({
    middleware: 'auth'
})

const store = useKritikSaranStore()
const { success, error } = useToast()

// State
const isLoading = ref(false)
const showDetailModal = ref(false)
const showDeleteModal = ref(false)
const selectedKritikSaran = ref<any>(null)
const isLoadingDetail = ref(false)
const isDeleting = ref(false)

// Filters
const filters = ref({
    start_date: '',
    end_date: ''
})

// Pagination
const pagination = ref({
    page: 1,
    limit: 10
})

// Table columns
const tableColumns = [
    { key: 'nama', label: 'Nama', sortable: false },
    { key: 'kritik_saran', label: 'Kritik & Saran', sortable: false },
    { key: 'created_at', label: 'Tanggal', sortable: true },
]

// Computed
const hasActiveFilters = computed(() => {
    return filters.value.start_date !== '' || filters.value.end_date !== ''
})

// Helper function to truncate text
const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return '-'
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
}

// Helper function to format date
const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric'
    })
}

// Methods
const fetchData = async () => {
    isLoading.value = true
    try {
        await store.fetchKritikSaran({
            start_date: filters.value.start_date,
            end_date: filters.value.end_date
        }, pagination.value.page, pagination.value.limit)
    } catch (err: any) {
        error('Gagal Memuat Data', err.message || 'Terjadi kesalahan saat memuat data kritik & saran')
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
        start_date: '',
        end_date: ''
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

const viewDetail = async (id: number) => {
    isLoadingDetail.value = true
    showDetailModal.value = true
    selectedKritikSaran.value = null
    
    try {
        const data = await store.fetchKritikSaranById(id)
        selectedKritikSaran.value = data
    } catch (err: any) {
        error('Gagal Memuat Detail', 'Gagal memuat detail kritik saran')
        showDetailModal.value = false
    } finally {
        isLoadingDetail.value = false
    }
}

const closeDetailModal = () => {
    showDetailModal.value = false
    selectedKritikSaran.value = null
}

const confirmDelete = (item: any) => {
    selectedKritikSaran.value = item
    showDeleteModal.value = true
}

const handleDelete = async () => {
    if (!selectedKritikSaran.value) return
    
    isDeleting.value = true
    
    try {
        await store.deleteKritikSaran(selectedKritikSaran.value.id)
        success('Kritik & Saran Berhasil Dihapus', 'Data kritik dan saran berhasil dihapus')
        showDeleteModal.value = false
        selectedKritikSaran.value = null
        
        // Refresh data
        await fetchData()
    } catch (err: any) {
        const errorMessage = err.message || 'Gagal menghapus kritik saran'
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
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>

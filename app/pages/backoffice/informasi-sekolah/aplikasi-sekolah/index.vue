<template>
    <DashboardLayout>
        <!-- Create Application Modal -->
        <CreateApplicationModal v-model="showCreateModal" @success="handleCreateSuccess" @error="handleCreateError" />

        <!-- Edit Application Modal -->
        <EditApplicationModal v-model="showEditModal" :application-data="selectedApplication"
            @success="handleEditSuccess" @error="handleEditError" />

        <!-- Delete Confirmation Modal -->
        <ConfirmationDeleteModal v-model="showDeleteConfirm" title="Hapus Aplikasi Sekolah"
            :message="`Apakah Anda yakin ingin menghapus aplikasi '${selectedApplication?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
            :is-loading="isDeleting" @confirm="handleDeleteConfirm" />

        <!-- Header Section -->
        <div class="mb-6 sm:mb-8">
            <div class="flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
                <div>
                    <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                        Aplikasi Sekolah
                    </h1>
                    <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
                        Kelola aplikasi sekolah yang ditampilkan di website
                    </p>
                </div>
                <AddButton label="Tambah Aplikasi" iconClass="fa-solid fa-plus" @click="openCreateModal" />
            </div>
        </div>

        <!-- Main Content -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <!-- Loading State -->
            <div v-if="isLoading" class="flex items-center justify-center py-8 sm:py-12">
                <div class="flex flex-col items-center gap-3 sm:gap-4">
                    <div
                        class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
                    </div>
                    <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data aplikasi...</p>
                </div>
            </div>

            <!-- Success State: Filter & Table Section -->
            <template v-else>
                <!-- Filter Section -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                    <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Data Aplikasi</h3>

                    <!-- Filter Form -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <!-- Nama Filter -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                Nama Aplikasi
                            </label>
                            <input v-model="filters.nama" type="text" placeholder="Cari nama aplikasi..."
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
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

                        <!-- Jumbotron Filter -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                Ditampilkan Jumbotron
                            </label>
                            <select v-model="filters.show_in_jumbotron"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                                <option :value="null">Semua</option>
                                <option :value="true">Ya</option>
                                <option :value="false">Tidak</option>
                            </select>
                        </div>
                    </div>

                    <!-- Filter Buttons -->
                    <div class="flex gap-3 mt-4">
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
                    </div>
                </div>

                <!-- Table Section -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                    <!-- Data Table -->
                    <div v-if="applicationStore.applications && applicationStore.applications.length > 0">
                        <Table :items="applicationStore.applications" :columns="tableColumns"
                            :current-page="pagination.page" :current-limit="pagination.limit"
                            :total="applicationStore.pagination.total" :is-loading="isLoading" @edit="openEditModal"
                            @delete="openDeleteConfirm" @pageChange="onPageChange" @limitChange="onLimitChange">
                            <!-- Custom cell for show_in_jumbotron column -->
                            <template #cell-show_in_jumbotron="{ item }">
                                <span :class="[
                                    'inline-flex items-center rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm md:text-[15px] font-semibold',
                                    item.show_in_jumbotron
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-800'
                                ]">
                                    {{ item.show_in_jumbotron ? 'Ya' : 'Tidak' }}
                                </span>
                            </template>

                            <!-- Custom cell for Status column -->
                            <template #cell-status="{ item }">
                                <span :class="[
                                    'inline-flex items-center rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm md:text-[15px] font-semibold',
                                    item.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                ]">
                                    <span :class="[
                                        'inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full mr-1 sm:mr-2',
                                        item.status === 'active' ? 'bg-green-600' : 'bg-red-600'
                                    ]"></span>
                                    {{ item.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                </span>
                            </template>

                            <!-- Custom actions slot -->
                            <template #actions="{ item }">
                                <div class="flex items-center justify-center gap-1.5 sm:gap-2">
                                    <!-- Edit Button -->
                                    <EditButton title="Edit" label="Edit" @click="openEditModal(item)" />

                                    <!-- Delete Button -->
                                    <DeleteButton title="Hapus" label="Hapus" @click="openDeleteConfirm(item)" />
                                </div>
                            </template>
                        </Table>
                    </div>

                    <!-- Empty State -->
                    <div v-else class="flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-6">
                        <div
                            class="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 sm:mb-6">
                            <i :class="[
                                hasActiveFilters ? 'fa-solid fa-magnifying-glass' : 'fa-solid fa-laptop-code',
                                'text-2xl sm:text-4xl text-gray-400'
                            ]"></i>
                        </div>
                        <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                            {{ hasActiveFilters ? 'Data tidak ditemukan' : 'Belum ada aplikasi' }}
                        </h3>
                        <p class="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 max-w-sm">
                            {{ hasActiveFilters ? 'Data tidak ditemukan dalam pencarian' : 'Mulai dengan menambahkan aplikasi sekolah baru ke sistem' }}
                        </p>
                    </div>
                </div>
            </template>
        </div>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApplicationStore } from '~/stores/application'
import { useToast } from '~/composables/useToast'
import type { Application } from '~/stores/application'
import DashboardLayout from '~/components/DashboardLayout.vue'
import CreateApplicationModal from '~/components/modals/CreateApplicationModal.vue'
import EditApplicationModal from '~/components/modals/EditApplicationModal.vue'
import ConfirmationDeleteModal from '~/components/modals/ConfirmationDeleteModal.vue'
import AddButton from '~/components/common/AddButton.vue'
import EditButton from '~/components/common/EditButton.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'
import Table from '~/components/Table.vue'

definePageMeta({
    middleware: 'auth'
})

const applicationStore = useApplicationStore()
const { success, error } = useToast()

// State
const isLoading = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteConfirm = ref(false)
const isDeleting = ref(false)
const selectedApplication = ref<Application | null>(null)

// Filters
const filters = ref({
    nama: '',
    status: '',
    show_in_jumbotron: null as boolean | null
})

// Pagination
const pagination = ref({
    page: 1,
    limit: 10
})

// Table columns
const tableColumns = [
    { key: 'nama', label: 'Nama Aplikasi', sortable: true },
    { key: 'link', label: 'Link', sortable: false },
    { key: 'show_in_jumbotron', label: 'Ditampilkan Jumbotron', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
]

// Computed
const hasActiveFilters = computed(() => {
    return (
        filters.value.nama !== '' ||
        filters.value.status !== '' ||
        filters.value.show_in_jumbotron !== null
    )
})

// Methods
const fetchData = async () => {
    isLoading.value = true
    try {
        await applicationStore.fetchApplications({
            search: {
                nama: filters.value.nama,
                status: filters.value.status,
                show_in_jumbotron: filters.value.show_in_jumbotron
            },
            pagination: {
                limit: pagination.value.limit,
                page: pagination.value.page
            }
        })
    } catch (err: any) {
        error('Gagal Memuat Data', err.message || 'Terjadi kesalahan saat memuat data aplikasi')
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
        nama: '',
        status: '',
        show_in_jumbotron: null
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

const openCreateModal = () => {
    showCreateModal.value = true
}

const openEditModal = (item: Application) => {
    selectedApplication.value = item
    showEditModal.value = true
}

const openDeleteConfirm = (item: Application) => {
    selectedApplication.value = item
    showDeleteConfirm.value = true
}

const handleCreateSuccess = (message: string) => {
    success('Aplikasi Berhasil Ditambahkan', message)
    pagination.value.page = 1
    fetchData()
}

const handleCreateError = (errorMessage: string) => {
    error('Gagal Menambahkan Aplikasi', errorMessage)
}

const handleEditSuccess = (message: string) => {
    success('Aplikasi Berhasil Diperbarui', message)
    fetchData()
}

const handleEditError = (errorMessage: string) => {
    error('Gagal Memperbarui Aplikasi', errorMessage)
}

const handleDeleteConfirm = async () => {
    if (!selectedApplication.value) return

    isDeleting.value = true
    try {
        const { deleteApplication } = await import('~/services/application')
        await deleteApplication(selectedApplication.value.id)
        
        success('Aplikasi Berhasil Dihapus', 'Aplikasi sekolah berhasil dihapus')
        showDeleteConfirm.value = false
        selectedApplication.value = null
        
        // Refresh data
        await fetchData()
    } catch (err: any) {
        const errorMessage = err.data?.message || err.data?.error || err.message || 'Gagal menghapus aplikasi'
        error('Gagal Menghapus Aplikasi', errorMessage)
    } finally {
        isDeleting.value = false
    }
}

// Lifecycle
onMounted(() => {
    fetchData()
})
</script>

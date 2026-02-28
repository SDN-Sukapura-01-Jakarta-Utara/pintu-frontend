<template>
    <DashboardLayout>
        <!-- Create Gallery Modal -->
        <CreateActivityGalleryModal v-model="showCreateModal" @success="handleCreateSuccess"
            @error="handleCreateError" />

        <!-- Edit Gallery Modal -->
        <EditActivityGalleryModal v-model="showEditModal" :gallery-data="selectedGallery"
            @success="handleEditSuccess" @error="handleEditError" />

        <!-- Gallery Detail Modal -->
        <ActivityGalleryDetailModal v-model="showDetailModal" :gallery-id="selectedGalleryId" />

        <!-- Delete Confirmation Modal -->
        <ConfirmationDeleteModal v-model="showDeleteConfirm" title="Hapus Galeri Kegiatan"
            :message="`Apakah Anda yakin ingin menghapus galeri kegiatan '${selectedGallery?.judul}'? Tindakan ini tidak dapat dibatalkan.`"
            :is-loading="isDeletingGallery" @confirm="handleDeleteConfirm" />

        <!-- Header Section -->
        <div class="mb-6 sm:mb-8">
            <div class="flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
                <div>
                    <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                        Manajemen Galeri Kegiatan
                    </h1>
                    <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
                        Kelola foto dan dokumentasi kegiatan sekolah
                    </p>
                </div>
                <AddButton label="Tambah Galeri Kegiatan" iconClass="fa-solid fa-plus"
                    @click="openCreateModal" />
            </div>
        </div>

        <!-- Filter Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Galeri Kegiatan</h3>

            <!-- Filter Form -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Judul Filter -->
                <div>
                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                        Judul Kegiatan
                    </label>
                    <input v-model="filters.judul" type="text" placeholder="Cari judul..."
                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                </div>

                <!-- Start Date Filter -->
                <div>
                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                        Tanggal Mulai
                    </label>
                    <input v-model="filters.start_date" type="date"
                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                </div>

                <!-- End Date Filter -->
                <div>
                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                        Tanggal Akhir
                    </label>
                    <input v-model="filters.end_date" type="date"
                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                </div>

                <!-- Status Publikasi Filter -->
                <div>
                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                        Status Publikasi
                    </label>
                    <select v-model="filters.status_publikasi"
                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                        <option value="">Semua Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
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
            </div>
        </div>

        <!-- Table Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <!-- Loading State -->
            <div v-if="galleryStore.isLoading" class="flex items-center justify-center py-12">
                <div class="flex flex-col items-center gap-3 sm:gap-4">
                    <div class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
                    </div>
                    <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data galeri kegiatan...</p>
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="galleryStore.error && !hasActiveFilters"
                class="rounded-xl border-2 border-red-200 bg-red-50 p-4 sm:p-6 m-4 sm:m-6">
                <div class="flex items-start gap-3 sm:gap-4">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 sm:h-6 sm:w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="flex-1">
                        <h3 class="text-base sm:text-lg font-semibold text-red-900">Gagal memuat data</h3>
                        <p class="mt-1 text-sm sm:text-base text-red-800">{{ galleryStore.error }}</p>
                        <button @click="fetchGalleries"
                            class="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors">
                            <i class="fa-solid fa-rotate-right w-3 h-3 sm:w-4 sm:h-4"></i>
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </div>

            <!-- Data Table -->
            <div v-else>
                <div v-if="galleryStore.galleries.length > 0">
                    <Table :items="galleryStore.galleries" :columns="tableColumns"
                        :current-page="galleryStore.pagination.page"
                        :current-limit="galleryStore.pagination.limit" :total="galleryStore.pagination.total"
                        :is-loading="galleryStore.isLoading" @edit="openEditModal" @delete="openDeleteConfirm"
                        @pageChange="onPageChange" @limitChange="onLimitChange">
                        <!-- Tanggal Column -->
                        <template #cell-tanggal="{ item }">
                            {{ formatDate(item.tanggal) }}
                        </template>

                        <!-- Foto Column -->
                        <template #cell-foto="{ item }">
                            <div class="flex items-center gap-1">
                                <i class="fa-solid fa-image text-gray-400 text-sm"></i>
                                <span class="text-xs sm:text-sm font-medium text-gray-700">{{ item.foto.length }} foto</span>
                            </div>
                        </template>

                        <!-- Status Publikasi Column -->
                        <template #cell-status_publikasi="{ item }">
                            <span :class="[
                                'inline-flex items-center rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm md:text-[15px] font-semibold',
                                item.status_publikasi === 'published'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800',
                            ]">
                                <span :class="[
                                    'inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full mr-1 sm:mr-2',
                                    item.status_publikasi === 'published' ? 'bg-green-600' : 'bg-yellow-600',
                                ]"></span>
                                {{ item.status_publikasi === 'published' ? 'Published' : 'Draft' }}
                            </span>
                        </template>

                        <!-- Status Column -->
                        <template #cell-status="{ item }">
                            <span :class="[
                                'inline-flex items-center rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm md:text-[15px] font-semibold',
                                item.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800',
                            ]">
                                <span :class="[
                                    'inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full mr-1 sm:mr-2',
                                    item.status === 'active' ? 'bg-green-600' : 'bg-red-600',
                                ]"></span>
                                {{ item.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                            </span>
                        </template>

                        <!-- Actions Column -->
                        <template #actions="{ item }">
                            <div class="flex items-center justify-center gap-1.5 sm:gap-2">
                                <ViewButton title="Lihat Detail" label="Lihat"
                                    @click="openDetailModal(item)" />
                                <EditButton title="Edit" label="Edit"
                                    @click="openEditModal(item)" />
                                <DeleteButton title="Hapus" label="Hapus"
                                    @click="openDeleteConfirm(item)" />
                            </div>
                        </template>
                    </Table>
                </div>

                <!-- Empty State -->
                <div v-else class="flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-6">
                    <div class="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 sm:mb-6">
                        <i :class="[
                            hasActiveFilters ? 'fa-solid fa-magnifying-glass' : 'fa-solid fa-image',
                            'text-2xl sm:text-4xl text-gray-400'
                        ]"></i>
                    </div>
                    <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                        {{ hasActiveFilters ? 'Data tidak ditemukan' : 'Belum ada galeri kegiatan' }}
                    </h3>
                    <p class="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 max-w-sm">
                        {{ hasActiveFilters ? 'Data tidak ditemukan dalam pencarian' : 'Mulai dengan menambahkan galeri kegiatan baru ke portal' }}
                    </p>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { ActivityGalleryData, ActivityGallerySearchFilter } from '~/types/ActivityGalleryType'
import { useActivityGalleryStore } from '~/stores/ActivityGalleryStore'
import { useToastStore } from '~/stores/ToastStore'
import DashboardLayout from '~/components/DashboardLayout.vue'
import CreateActivityGalleryModal from '~/components/modals/CreateActivityGalleryModal.vue'
import EditActivityGalleryModal from '~/components/modals/EditActivityGalleryModal.vue'
import ActivityGalleryDetailModal from '~/components/modals/ActivityGalleryDetailModal.vue'
import ConfirmationDeleteModal from '~/components/modals/ConfirmationDeleteModal.vue'
import AddButton from '~/components/common/AddButton.vue'
import Table from '~/components/Table.vue'
import ViewButton from '~/components/common/ViewButton.vue'
import EditButton from '~/components/common/EditButton.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'

const galleryStore = useActivityGalleryStore()
const toastStore = useToastStore()

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const showDeleteConfirm = ref(false)

// Selected gallery
const selectedGallery = ref<ActivityGalleryData | null>(null)
const selectedGalleryId = ref(0)
const isDeletingGallery = ref(false)

// Filters
const filters = ref<ActivityGallerySearchFilter>({
    judul: '',
    start_date: '',
    end_date: '',
    status_publikasi: '',
    status: '',
})

// Table columns
const tableColumns = [
    { key: 'judul', label: 'Judul Kegiatan', sortable: true },
    { key: 'tanggal', label: 'Tanggal', sortable: true },
    { key: 'foto', label: 'Foto', sortable: false },
    { key: 'status_publikasi', label: 'Status Publikasi', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
]

// Computed
const hasActiveFilters = computed(() => {
    return Object.values(filters.value).some(value => value)
})

// Methods
const fetchGalleries = async () => {
    await galleryStore.fetchGalleries(
        filters.value,
        galleryStore.pagination.page,
        galleryStore.pagination.limit
    )
}

const applyFilter = async () => {
    galleryStore.pagination.page = 1
    await fetchGalleries()
}

const clearFilter = async () => {
    filters.value = {
        judul: '',
        start_date: '',
        end_date: '',
        status_publikasi: '',
        status: '',
    }
    await fetchGalleries()
}

const onPageChange = async (page: number) => {
    galleryStore.pagination.page = page
    await fetchGalleries()
}

const onLimitChange = async (limit: number) => {
    galleryStore.pagination.limit = limit
    galleryStore.pagination.page = 1
    await fetchGalleries()
}

const openCreateModal = () => {
    selectedGallery.value = null
    showCreateModal.value = true
}

const openEditModal = (gallery: ActivityGalleryData) => {
    selectedGallery.value = gallery
    showEditModal.value = true
}

const openDetailModal = (gallery: ActivityGalleryData) => {
    selectedGalleryId.value = gallery.id
    showDetailModal.value = true
}

const openDeleteConfirm = (gallery: ActivityGalleryData) => {
    selectedGallery.value = gallery
    showDeleteConfirm.value = true
}

const handleDeleteConfirm = async () => {
    if (!selectedGallery.value) return

    isDeletingGallery.value = true
    const result = await galleryStore.removeGallery(selectedGallery.value.id)

    if (result.success) {
        toastStore.success('Sukses', result.message)
        showDeleteConfirm.value = false
    } else {
        toastStore.error('Gagal', result.message)
    }

    isDeletingGallery.value = false
}

const handleCreateSuccess = () => {
    fetchGalleries()
}

const handleCreateError = (error: string) => {
    // Error already handled in modal
}

const handleEditSuccess = () => {
    fetchGalleries()
}

const handleEditError = (error: string) => {
    // Error already handled in modal
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

// Lifecycle
onMounted(async () => {
    await fetchGalleries()
})
</script>

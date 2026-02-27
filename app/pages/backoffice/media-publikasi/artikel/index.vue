<template>
    <DashboardLayout>
        <!-- Create Article Modal -->
        <CreateArticleModal v-model="showCreateModal" @success="handleCreateSuccess"
            @error="handleCreateError" />

        <!-- Edit Article Modal -->
        <EditArticleModal v-model="showEditModal" :article-data="selectedArticle"
            @success="handleEditSuccess" @error="handleEditError" />

        <!-- Article Detail Modal -->
        <ArticleDetailModal v-model="showDetailModal" :article-id="selectedArticleId" />

        <!-- Delete Confirmation Modal -->
        <ConfirmationDeleteModal v-model="showDeleteConfirm" title="Hapus Artikel"
            :message="`Apakah Anda yakin ingin menghapus artikel '${selectedArticle?.judul}'? Tindakan ini tidak dapat dibatalkan.`"
            :is-loading="isDeletingArticle" @confirm="handleDeleteConfirm" />

        <!-- Header Section -->
        <div class="mb-6 sm:mb-8">
            <div class="flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
                <div>
                    <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                        Manajemen Artikel
                    </h1>
                    <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
                        Kelola artikel dan berita di portal sekolah
                    </p>
                </div>
                <AddButton label="Tambah Artikel" iconClass="fa-solid fa-plus"
                    @click="openCreateModal" />
            </div>
        </div>

        <!-- Filter Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Artikel</h3>

            <!-- Filter Form -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Judul Filter -->
                <div>
                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                        Judul Artikel
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

                <!-- Kategori Filter -->
                <div>
                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                        Kategori
                    </label>
                    <select v-model="filters.kategori"
                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                        <option value="">Semua Kategori</option>
                        <option value="Berita Sekolah">Berita Sekolah</option>
                        <option value="Kegiatan Siswa">Kegiatan Siswa</option>
                        <option value="Prestasi">Prestasi</option>
                        <option value="Informasi Akademik">Informasi Akademik</option>
                        <option value="Informasi Non-Akademik">Informasi Non-Akademik</option>
                        <option value="Kegiatan Guru dan Staf">Kegiatan Guru dan Staf</option>
                        <option value="Edukasi">Edukasi</option>
                    </select>
                </div>

                <!-- Penulis Filter -->
                <div>
                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                        Penulis
                    </label>
                    <input v-model="filters.penulis" type="text" placeholder="Cari penulis..."
                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
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
            <div v-if="articleStore.isLoading" class="flex items-center justify-center py-12">
                <div class="flex flex-col items-center gap-3 sm:gap-4">
                    <div class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
                    </div>
                    <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data artikel...</p>
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="articleStore.error && !hasActiveFilters"
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
                        <p class="mt-1 text-sm sm:text-base text-red-800">{{ articleStore.error }}</p>
                        <button @click="fetchArticles"
                            class="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors">
                            <i class="fa-solid fa-rotate-right w-3 h-3 sm:w-4 sm:h-4"></i>
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </div>

            <!-- Data Table -->
            <div v-else>
                <div v-if="articleStore.articles.length > 0">
                    <Table :items="articleStore.articles" :columns="tableColumns"
                        :current-page="articleStore.pagination.page"
                        :current-limit="articleStore.pagination.limit" :total="articleStore.pagination.total"
                        :is-loading="articleStore.isLoading" @edit="openEditModal" @delete="openDeleteConfirm"
                        @pageChange="onPageChange" @limitChange="onLimitChange">
                        <!-- Gambar Column -->
                        <template #cell-gambar="{ item }">
                            <img :src="item.gambar" :alt="item.judul"
                                class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover border border-gray-200" />
                        </template>

                        <!-- Tanggal Column -->
                        <template #cell-tanggal="{ item }">
                            {{ formatDate(item.tanggal) }}
                        </template>

                        <!-- Kategori Column -->
                        <template #cell-kategori="{ item }">
                            <span
                                class="inline-flex items-center rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm md:text-[15px] font-semibold bg-blue-100 text-blue-800">
                                {{ item.kategori }}
                            </span>
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
                            hasActiveFilters ? 'fa-solid fa-magnifying-glass' : 'fa-solid fa-newspaper',
                            'text-2xl sm:text-4xl text-gray-400'
                        ]"></i>
                    </div>
                    <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                        {{ hasActiveFilters ? 'Data tidak ditemukan' : 'Belum ada artikel' }}
                    </h3>
                    <p class="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 max-w-sm">
                        {{ hasActiveFilters ? 'Data tidak ditemukan dalam pencarian' : 'Mulai dengan menambahkan artikel baru ke portal' }}
                    </p>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { ArticleData, ArticleSearchFilter } from '~/types/ArticleType'
import { useArticleStore } from '~/stores/ArticleStore'
import { useToastStore } from '~/stores/ToastStore'
import DashboardLayout from '~/components/DashboardLayout.vue'
import CreateArticleModal from '~/components/modals/CreateArticleModal.vue'
import EditArticleModal from '~/components/modals/EditArticleModal.vue'
import ArticleDetailModal from '~/components/modals/ArticleDetailModal.vue'
import ConfirmationDeleteModal from '~/components/modals/ConfirmationDeleteModal.vue'
import AddButton from '~/components/common/AddButton.vue'
import Table from '~/components/Table.vue'
import ViewButton from '~/components/common/ViewButton.vue'
import EditButton from '~/components/common/EditButton.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'

const articleStore = useArticleStore()
const toastStore = useToastStore()

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const showDeleteConfirm = ref(false)

// Selected article
const selectedArticle = ref<ArticleData | null>(null)
const selectedArticleId = ref(0)
const isDeletingArticle = ref(false)

// Filters
const filters = ref<ArticleSearchFilter>({
    judul: '',
    start_date: '',
    end_date: '',
    kategori: '',
    penulis: '',
    status_publikasi: '',
    status: '',
})

// Table columns
const tableColumns = [
    { key: 'gambar', label: 'Gambar', sortable: false },
    { key: 'judul', label: 'Judul', sortable: true },
    { key: 'tanggal', label: 'Tanggal', sortable: true },
    { key: 'kategori', label: 'Kategori', sortable: true },
    { key: 'penulis', label: 'Penulis', sortable: true },
    { key: 'status_publikasi', label: 'Status Publikasi', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
]

// Computed
const hasActiveFilters = computed(() => {
    return Object.values(filters.value).some(value => value)
})

// Methods
const fetchArticles = async () => {
    await articleStore.fetchArticles(
        filters.value,
        articleStore.pagination.page,
        articleStore.pagination.limit
    )
}

const applyFilter = async () => {
    articleStore.pagination.page = 1
    await fetchArticles()
}

const clearFilter = async () => {
    filters.value = {
        judul: '',
        start_date: '',
        end_date: '',
        kategori: '',
        penulis: '',
        status_publikasi: '',
        status: '',
    }
    await fetchArticles()
}

const onPageChange = async (page: number) => {
    articleStore.pagination.page = page
    await fetchArticles()
}

const onLimitChange = async (limit: number) => {
    articleStore.pagination.limit = limit
    articleStore.pagination.page = 1
    await fetchArticles()
}

const openCreateModal = () => {
    selectedArticle.value = null
    showCreateModal.value = true
}

const openEditModal = (article: ArticleData) => {
    selectedArticle.value = article
    showEditModal.value = true
}

const openDetailModal = (article: ArticleData) => {
    selectedArticleId.value = article.id
    showDetailModal.value = true
}

const openDeleteConfirm = (article: ArticleData) => {
    selectedArticle.value = article
    showDeleteConfirm.value = true
}

const handleDeleteConfirm = async () => {
    if (!selectedArticle.value) return

    isDeletingArticle.value = true
    const result = await articleStore.removeArticle(selectedArticle.value.id)

    if (result.success) {
        toastStore.addToast({
            message: result.message,
            type: 'success',
        })
        showDeleteConfirm.value = false
    } else {
        toastStore.addToast({
            message: result.message,
            type: 'error',
        })
    }

    isDeletingArticle.value = false
}

const handleCreateSuccess = () => {
    fetchArticles()
}

const handleCreateError = (error: string) => {
    // Error already handled in modal
}

const handleEditSuccess = () => {
    fetchArticles()
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
    await fetchArticles()
})
</script>

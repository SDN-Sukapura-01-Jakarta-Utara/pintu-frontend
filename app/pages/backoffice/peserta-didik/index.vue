<template>
    <DashboardLayout>
        <!-- Create Peserta Didik Modal -->
        <CreatePesertaDidikModal v-model="showCreateModal" @success="handleCreateSuccess"
            @error="handleCreateError" />

        <!-- View Peserta Didik Modal -->
        <ViewPesertaDidikModal v-model="showViewModal" :peserta-didik-id="selectedPesertaDidikId" />

        <!-- Edit Peserta Didik Modal -->
        <EditPesertaDidikModal v-model="showEditModal" :peserta-didik="selectedPesertaDidik"
            @success="handleEditSuccess" @error="handleEditError" />

        <!-- Import Excel Modal -->
        <ImportPesertaDidikModal v-model="showImportModal" @success="handleImportSuccess" />

        <!-- Delete Confirmation Modal -->
        <ConfirmationDeleteModal v-model="showDeleteConfirm" title="Hapus Peserta Didik"
            :message="`Apakah Anda yakin ingin menghapus peserta didik '${selectedPesertaDidik?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
            :is-loading="isDeletingPesertaDidik" @confirm="handleDeleteConfirm" />

        <!-- Header Section -->
        <div class="mb-6 sm:mb-8">
            <div class="flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
                <div>
                    <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                        Data Peserta Didik
                    </h1>
                    <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
                        Kelola data peserta didik SDN Sukapura 01
                    </p>
                </div>
                <div class="flex items-center gap-2 sm:gap-3">
                    <button @click="showImportModal = true"
                        class="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border-2 border-green-600 bg-green-600 text-white font-semibold text-xs sm:text-sm hover:bg-green-700 hover:border-green-700 transition-colors duration-200 cursor-pointer">
                        <i class="fa-solid fa-file-excel w-3.5 h-3.5 sm:w-4 sm:h-4"></i>
                        <span class="hidden sm:inline">Import Data Peserta Didik</span>
                        <span class="sm:hidden">Import</span>
                    </button>
                    <AddButton label="Tambah Peserta Didik" iconClass="fa-solid fa-plus"
                        @click="openCreateModal" />
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <!-- Rombel Tabs Section -->
            <div v-if="rombelList.length > 0" class="border-b border-gray-200">
                <div class="px-4 sm:px-6 pt-0">
                    <div class="flex gap-1 overflow-x-auto -mb-px" style="scrollbar-width: thin;">
                        <button v-for="rombel in rombelList" :key="rombel.id" @click="selectRombel(rombel)"
                            :class="[
                                'px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 border-b-2 relative',
                                selectedRombel?.id === rombel.id
                                    ? 'text-red-600 border-b-red-600'
                                    : 'text-gray-600 border-b-transparent hover:text-gray-900 hover:border-b-gray-300'
                            ]">
                            <span class="flex items-center gap-2">
                                <i class="fa-solid fa-users w-4 h-4"></i>
                                {{ rombel.name }}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Filter Section -->
            <div class="bg-white p-4 sm:p-6 border-b border-gray-200">
                <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Data Peserta Didik</h3>

                <!-- Filter Form -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <!-- Tahun Pelajaran Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            Tahun Pelajaran
                        </label>
                        <select v-model.number="filters.tahun_pelajaran_id"
                            @change="applyFilter"
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                            <option v-for="tahun in tahunPelajaranList" :key="tahun.id" :value="tahun.id">
                                {{ tahun.tahun_pelajaran }}
                            </option>
                        </select>
                    </div>

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

            <!-- Loading State -->
            <div v-if="pesertaDidikStore.isLoading" class="p-8 sm:p-12 flex items-center justify-center">
                <div class="flex flex-col items-center gap-3 sm:gap-4">
                    <div
                        class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
                    </div>
                    <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data peserta didik...</p>
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="pesertaDidikStore.error && !hasActiveFilters"
                class="p-4 sm:p-6">
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
                        <p class="mt-1 text-sm sm:text-base text-red-800">{{ pesertaDidikStore.error }}</p>
                        <button @click="fetchPesertaDidikData"
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
                    <div v-if="pesertaDidikStore.pesertaDidiks.length > 0">
                        <Table :items="pesertaDidikStore.pesertaDidiks" :columns="tableColumns"
                            :current-page="pagination.page" :current-limit="pagination.limit"
                            :total="pesertaDidikStore.total" :is-loading="pesertaDidikStore.isLoading"
                            @pageChange="onPageChange" @limitChange="onLimitChange">

                            <!-- Custom cell for Jenis Kelamin -->
                            <template #cell-jenis_kelamin="{ item }">
                                <span class="text-xs sm:text-sm font-medium text-gray-700">
                                    {{ item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}
                                </span>
                            </template>

                            <!-- Custom cell for Status column -->
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

                            <!-- Custom actions slot -->
                            <template #actions="{ item }">
                                <div class="flex items-center justify-center gap-1.5 sm:gap-2">
                                    <!-- View Button -->
                                    <ViewButton title="Lihat Detail" label="Lihat"
                                        @click="openDetailPesertaDidik(item)" />

                                    <!-- Edit Button -->
                                    <EditButton title="Edit" label="Edit"
                                        @click="openEditPesertaDidik(item)" />

                                    <!-- Delete Button -->
                                    <DeleteButton title="Hapus" label="Hapus"
                                        @click="openDeletePesertaDidik(item)" />
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
                            {{ hasActiveFilters ? 'Data tidak ditemukan' : 'Belum ada peserta didik' }}
                        </h3>
                        <p class="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 max-w-sm">
                            {{ hasActiveFilters ? 'Data tidak ditemukan dalam pencarian' : 'Mulai dengan menambahkan peserta didik baru' }}</p>
                    </div>
            </template>
        </div>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePesertaDidikStore } from '~/stores/PesertaDidikStore'
import { useToastStore } from '~/stores/ToastStore'
import { useRombelStore } from '~/stores/RombelStore'
import { useTahunPelajaranStore } from '~/stores/TahunPelajaranStore'
import { getPesertaDidikById } from '~/services/peserta-didik'
import DashboardLayout from '~/components/DashboardLayout.vue'
import CreatePesertaDidikModal from '~/components/modals/CreatePesertaDidikModal.vue'
import ViewPesertaDidikModal from '~/components/modals/ViewPesertaDidikModal.vue'
import EditPesertaDidikModal from '~/components/modals/EditPesertaDidikModal.vue'
import ConfirmationDeleteModal from '~/components/modals/ConfirmationDeleteModal.vue'
import ImportPesertaDidikModal from '~/components/modals/ImportPesertaDidikModal.vue'
import AddButton from '~/components/common/AddButton.vue'
import Table from '~/components/Table.vue'
import ViewButton from '~/components/common/ViewButton.vue'
import EditButton from '~/components/common/EditButton.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'

const pesertaDidikStore = usePesertaDidikStore()
const rombelStore = useRombelStore()
const tahunPelajaranStore = useTahunPelajaranStore()
const toastStore = useToastStore()

const showCreateModal = ref(false)
const showViewModal = ref(false)
const showEditModal = ref(false)
const showDeleteConfirm = ref(false)
const showImportModal = ref(false)
const selectedPesertaDidik = ref<any>(null)
const selectedPesertaDidikId = ref(0)
const isDeletingPesertaDidik = ref(false)

const selectedRombel = ref<any>(null)
const rombelList = ref<any[]>([])
const tahunPelajaranList = ref<any[]>([])

const pagination = ref({
    page: 1,
    limit: 10
})

const filters = ref({
    tahun_pelajaran_id: 0,
    rombel_id: 0,
    nama: '',
    nis: '',
    jenis_kelamin: '',
    nisn: '',
    tempat_lahir: '',
    nik: '',
    agama: '',
    status: '',
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
    { key: 'rombel.name', label: 'Rombel', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
]

// Computed
const hasActiveFilters = computed(() => {
    return filters.value.nama !== '' ||
        filters.value.nis !== '' ||
        filters.value.nisn !== '' ||
        filters.value.jenis_kelamin !== '' ||
        filters.value.tempat_lahir !== '' ||
        filters.value.nik !== '' ||
        filters.value.agama !== '' ||
        filters.value.status !== ''
})

// Methods
const loadRombelList = async () => {
    try {
        const result = await rombelStore.fetchRombels(1, 100, { status: 'active' })
        if (result.success) {
            rombelList.value = rombelStore.rombels
            // Select first rombel by default (don't fetch yet, wait for tahun pelajaran)
            if (rombelList.value.length > 0) {
                selectedRombel.value = rombelList.value[0]
                filters.value.rombel_id = rombelList.value[0].id
            }
        }
    } catch (err) {
        console.error('Error loading rombel:', err)
    }
}

const loadTahunPelajaranList = async () => {
    try {
        const result = await tahunPelajaranStore.fetchTahunPelajarans(1, 100)
        if (result.success) {
            tahunPelajaranList.value = tahunPelajaranStore.tahunPelajarans
            // Set default to active tahun pelajaran
            const activeTahun = tahunPelajaranList.value.find((t: any) => t.status === 'active')
            if (activeTahun) {
                filters.value.tahun_pelajaran_id = activeTahun.id
            }
            // Fetch data setelah both rombel dan tahun pelajaran sudah di-set
            await fetchPesertaDidikData()
        }
    } catch (err) {
        console.error('Error loading tahun pelajaran:', err)
    }
}

const selectRombel = (rombel: any) => {
    selectedRombel.value = rombel
    filters.value.rombel_id = rombel.id
    pagination.value.page = 1
    fetchPesertaDidikData()
}

const fetchPesertaDidikData = async () => {
    const search = {
        tahun_pelajaran_id: filters.value.tahun_pelajaran_id || undefined,
        rombel_id: filters.value.rombel_id || undefined,
        nama: filters.value.nama || undefined,
        nis: filters.value.nis || undefined,
        jenis_kelamin: filters.value.jenis_kelamin || undefined,
        nisn: filters.value.nisn || undefined,
        tempat_lahir: filters.value.tempat_lahir || undefined,
        nik: filters.value.nik || undefined,
        agama: filters.value.agama || undefined,
        status: filters.value.status || undefined,
    }

    await pesertaDidikStore.fetchPesertaDidik(
        search,
        pagination.value.page,
        pagination.value.limit
    )
}

const applyFilter = async () => {
    pagination.value.page = 1
    await fetchPesertaDidikData()
}

const clearFilter = async () => {
    filters.value = {
        tahun_pelajaran_id: filters.value.tahun_pelajaran_id,
        rombel_id: filters.value.rombel_id,
        nama: '',
        nis: '',
        jenis_kelamin: '',
        nisn: '',
        tempat_lahir: '',
        nik: '',
        agama: '',
        status: '',
    }
    pagination.value.page = 1
    await fetchPesertaDidikData()
}

const onPageChange = (page: number) => {
    pagination.value.page = page
    fetchPesertaDidikData()
}

const onLimitChange = (limit: number) => {
    pagination.value.limit = limit
    pagination.value.page = 1
    fetchPesertaDidikData()
}

const openCreateModal = () => {
    showCreateModal.value = true
}

const handleCreateSuccess = () => {
    pagination.value.page = 1
    fetchPesertaDidikData()
}

const handleCreateError = () => {
    // Error already shown via toast
}

const handleImportSuccess = () => {
    pagination.value.page = 1
    fetchPesertaDidikData()
}

const handleEditSuccess = () => {
    pagination.value.page = 1
    fetchPesertaDidikData()
}

const handleEditError = () => {
    // Error already shown via toast
}

const openDetailPesertaDidik = (item: any) => {
    selectedPesertaDidikId.value = item.id
    showViewModal.value = true
}

const openEditPesertaDidik = async (item: any) => {
    try {
        const response = await getPesertaDidikById(item.id)
        selectedPesertaDidik.value = response.data
        showEditModal.value = true
    } catch (err: any) {
        console.error('Error loading peserta didik detail:', err)
        selectedPesertaDidik.value = item
        showEditModal.value = true
    }
}

const openDeletePesertaDidik = (item: any) => {
    selectedPesertaDidik.value = item
    showDeleteConfirm.value = true
}

const handleDeleteConfirm = async () => {
    if (!selectedPesertaDidik.value) return

    isDeletingPesertaDidik.value = true
    const result = await pesertaDidikStore.removePesertaDidik(selectedPesertaDidik.value.id)

    if (result.success) {
        toastStore.success('Sukses', result.message)
        showDeleteConfirm.value = false
    } else {
        toastStore.error('Gagal', result.message)
    }

    isDeletingPesertaDidik.value = false
}

// Load initial data
onMounted(async () => {
    // Clear any previous error state
    pesertaDidikStore.clearError()
    await loadRombelList()
    await loadTahunPelajaranList()
})
</script>

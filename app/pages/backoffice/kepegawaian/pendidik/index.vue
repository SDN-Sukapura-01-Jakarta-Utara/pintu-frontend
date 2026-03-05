<template>
    <DashboardLayout>
        <!-- Create Pendidik Modal -->
        <CreatePendidikModal v-model="showCreatePendidikModal" @success="handleCreatePendidikSuccess"
            @error="handleCreatePendidikError" />

        <!-- Edit Pendidik Modal -->
        <EditPendidikModal v-model="showEditPendidikModal" :pendidik="selectedPendidik" @success="handleEditPendidikSuccess"
            @error="handleEditPendidikError" />

        <!-- Header Section -->
        <div class="mb-6 sm:mb-8">
            <div class="flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
                <div>
                    <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                        Data Pendidik
                    </h1>
                    <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
                        Kelola data pendidik SDN Sukapura 01
                    </p>
                </div>
                <AddButton label="Tambah Pendidik" iconClass="fa-solid fa-plus"
                    @click="openCreatePendidikModal" />
            </div>
        </div>

        <!-- Main Content -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <!-- Filter Section -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Data Pendidik</h3>

                <!-- Filter Form -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <!-- Nama Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            Nama
                        </label>
                        <input v-model="filters.nama" type="text" placeholder="Cari nama..."
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                    </div>

                    <!-- Username Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            Username
                        </label>
                        <input v-model="filters.username" type="text" placeholder="Cari username..."
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                    </div>

                    <!-- NIP Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            NIP
                        </label>
                        <input v-model="filters.nip" type="text" placeholder="Cari NIP..."
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                    </div>

                    <!-- NKKI Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            NKKI
                        </label>
                        <input v-model="filters.nkki" type="text" placeholder="Cari NKKI..."
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                    </div>

                    <!-- Jabatan Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            Jabatan
                        </label>
                        <select v-model="filters.jabatan"
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                            <option value="">Semua Jabatan</option>
                            <option value="Guru Kelas">Guru Kelas</option>
                            <option value="Guru Bidang Studi">Guru Bidang Studi</option>
                            <option value="Guru Kelas dan Guru Bidang Studi">Guru Kelas dan Bidang Studi</option>
                        </select>
                    </div>

                    <!-- Role Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            Role
                        </label>
                        <select v-model.number="filters.role_id"
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                            <option :value="0">Semua Role</option>
                            <option v-for="role in roles" :key="role.id" :value="role.id">
                                {{ role.name }}
                            </option>
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
            <div v-if="kepegawaianStore.isLoading" class="flex items-center justify-center py-8 sm:py-12">
                <div class="flex flex-col items-center gap-3 sm:gap-4">
                    <div
                        class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
                    </div>
                    <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data pendidik...</p>
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="kepegawaianStore.error && !hasActiveFilters"
                class="rounded-xl border-2 border-red-200 bg-red-50 p-4 sm:p-6">
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
                        <p class="mt-1 text-sm sm:text-base text-red-800">{{ kepegawaianStore.error }}</p>
                        <button @click="fetchPendidikData"
                            class="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors">
                            <i class="fa-solid fa-rotate-right w-3 h-3 sm:w-4 sm:h-4"></i>
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </div>

            <!-- Table Section -->
            <template v-else>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                    <!-- Data Table -->
                    <div v-if="kepegawaianStore.kepegawaians.length > 0">
                        <Table :items="kepegawaianStore.kepegawaians" :columns="tableColumns"
                            :current-page="pagination.page" :current-limit="pagination.limit"
                            :total="kepegawaianStore.total" :is-loading="kepegawaianStore.isLoading"
                            @pageChange="onPageChange" @limitChange="onLimitChange">

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
                                        @click="openDetailPendidik(item)" />

                                    <!-- Edit Button -->
                                    <EditButton title="Edit" label="Edit"
                                        @click="openEditPendidik(item)" />

                                    <!-- Delete Button -->
                                    <DeleteButton title="Hapus" label="Hapus"
                                        @click="openDeletePendidik(item)" />
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
                            {{ hasActiveFilters ? 'Data tidak ditemukan' : 'Belum ada pendidik' }}
                        </h3>
                        <p class="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 max-w-sm">
                            {{ hasActiveFilters ? 'Data tidak ditemukan dalam pencarian' : 'Mulai dengan menambahkan pendidik baru' }}</p>
                    </div>
                </div>
            </template>
        </div>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useKepegawaianStore } from '~/stores/KepegawaianStore'
import { getRoleList } from '~/services/user'
import { getKepegawaianById } from '~/services/kepegawaian'
import DashboardLayout from '~/components/DashboardLayout.vue'
import CreatePendidikModal from '~/components/modals/CreatePendidikModal.vue'
import EditPendidikModal from '~/components/modals/EditPendidikModal.vue'
import AddButton from '~/components/common/AddButton.vue'
import Table from '~/components/Table.vue'
import ViewButton from '~/components/common/ViewButton.vue'
import EditButton from '~/components/common/EditButton.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'

const kepegawaianStore = useKepegawaianStore()

const showCreatePendidikModal = ref(false)
const showEditPendidikModal = ref(false)
const selectedPendidik = ref<any>(null)

const roles = ref<any[]>([])

const pagination = ref({
    page: 1,
    limit: 10
})

const filters = ref({
    nama: '',
    username: '',
    nip: '',
    nkki: '',
    jabatan: '',
    role_id: 0,
    status: 'active'
})

const tableColumns = [
    { key: 'nama', label: 'Nama', sortable: true },
    { key: 'username', label: 'Username', sortable: true },
    { key: 'nip', label: 'NIP', sortable: true },
    { key: 'nkki', label: 'NKKI', sortable: true },
    { key: 'jabatan', label: 'Jabatan', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
]

// Computed
const hasActiveFilters = computed(() => {
    return filters.value.nama !== '' ||
        filters.value.username !== '' ||
        filters.value.nip !== '' ||
        filters.value.nkki !== '' ||
        filters.value.jabatan !== '' ||
        filters.value.role_id !== 0
})

// Methods
const fetchPendidikData = async () => {
    const search = {
        nama: filters.value.nama,
        username: filters.value.username,
        nip: filters.value.nip,
        nkki: filters.value.nkki,
        jabatan: filters.value.jabatan,
        role_id: filters.value.role_id || undefined,
        status: filters.value.status
    }

    await kepegawaianStore.fetchKepegawaian(
        pagination.value.page,
        pagination.value.limit,
        search
    )
}

const applyFilter = async () => {
    pagination.value.page = 1
    await fetchPendidikData()
}

const clearFilter = async () => {
    filters.value = {
        nama: '',
        username: '',
        nip: '',
        nkki: '',
        jabatan: '',
        role_id: 0,
        status: 'active'
    }
    pagination.value.page = 1
    await fetchPendidikData()
}

const onPageChange = (page: number) => {
    pagination.value.page = page
    fetchPendidikData()
}

const onLimitChange = (limit: number) => {
    pagination.value.limit = limit
    pagination.value.page = 1
    fetchPendidikData()
}

const openCreatePendidikModal = () => {
    showCreatePendidikModal.value = true
}

const handleCreatePendidikSuccess = () => {
    pagination.value.page = 1
    fetchPendidikData()
}

const handleCreatePendidikError = () => {
    // Error already shown via toast
}

const handleEditPendidikSuccess = () => {
    pagination.value.page = 1
    fetchPendidikData()
}

const handleEditPendidikError = () => {
    // Error already shown via toast
}

const openDetailPendidik = (item: any) => {
    // TODO: Implement detail modal
    console.log('View detail:', item)
}

const openEditPendidik = async (item: any) => {
    try {
        // Fetch full pendidik data including roles
        const response = await getKepegawaianById(item.id)
        selectedPendidik.value = response.data
        showEditPendidikModal.value = true
    } catch (err: any) {
        console.error('Error loading pendidik detail:', err)
        // Fallback to item if API call fails
        selectedPendidik.value = item
        showEditPendidikModal.value = true
    }
}

const openDeletePendidik = (item: any) => {
    // TODO: Implement delete confirmation
    console.log('Delete:', item)
}

const loadRoles = async () => {
    try {
        const response = await getRoleList()
        roles.value = response.data || []
    } catch (err) {
        console.error('Error loading roles:', err)
    }
}

// Load initial data
onMounted(() => {
    fetchPendidikData()
    loadRoles()
})
</script>

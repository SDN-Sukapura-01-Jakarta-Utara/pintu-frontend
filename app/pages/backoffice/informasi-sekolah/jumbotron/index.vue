<template>
    <DashboardLayout>
        <!-- Create Jumbotron Modal -->
        <CreateJumbotronModal v-model="showCreateModal" @success="handleCreateSuccess" @error="handleCreateError" />

        <!-- Edit Jumbotron Modal -->
        <EditJumbotronModal v-model="showEditModal" :jumbotron-data="selectedItem" @success="handleEditSuccess"
            @error="handleEditError" />

        <!-- Delete Confirmation Modal -->
        <ConfirmationDeleteModal 
            v-model="showDeleteModal"
            title="Hapus Jumbotron?"
            message="Anda yakin ingin menghapus jumbotron ini? Tindakan ini tidak dapat dibatalkan."
            :is-loading="isDeleting"
            @confirm="confirmDelete"
        />

        <!-- Header Section -->
        <div class="mb-6 sm:mb-8">
            <div class="flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
                <div>
                    <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                        Jumbotron
                    </h1>
                    <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">Kelola gambar jumbotron
                        untuk halaman utama sekolah</p>
                </div>
                <AddButton label="Tambah Data" iconClass="fa-solid fa-plus" @click="openCreateModal" />
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-8 sm:py-12">
            <div class="flex flex-col items-center gap-3 sm:gap-4">
                <div
                    class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
                </div>
                <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data jumbotron...</p>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="rounded-xl border-2 border-red-200 bg-red-50 p-4 sm:p-6">
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
                    <p class="mt-1 text-sm sm:text-base text-red-800">{{ error }}</p>
                    <button @click="fetchJumbotronData"
                        class="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors">
                        <i class="fa-solid fa-rotate-right w-3 h-3 sm:w-4 sm:h-4"></i>
                        Coba Lagi
                    </button>
                </div>
            </div>
        </div>

        <!-- Table Section -->
        <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200">
            <!-- Data Table -->
            <div v-if="jumbotronList.length > 0">
                <Table :items="jumbotronList" :total="total" :columns="tableColumns" @edit="openEditModal"
                    @delete="openDeleteConfirm">
                    <!-- Custom cell for Gambar column -->
                    <template #cell-file="{ item }">
                        <img :src="item.file" :alt="`Jumbotron ${item.id}`"
                            class="h-12 w-16 sm:h-16 sm:w-24 rounded-lg object-cover shadow-sm border border-gray-200 hover:shadow-md transition-shadow" />
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

                    <!-- Custom cell for Created Date column -->
                    <template #cell-created_at="{ item }">
                        {{ formatDate(item.created_at) }}
                    </template>
                </Table>
            </div>

            <!-- Empty State -->
            <div v-else class="flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-6">
                <div
                    class="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 sm:mb-6">
                    <i class="fa-solid fa-image text-2xl sm:text-4xl text-gray-400"></i>
                </div>
                <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1">Belum ada jumbotron</h3>
                <p class="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 max-w-sm">
                    Mulai dengan menambahkan gambar jumbotron untuk halaman utama sekolah Anda
                </p>
            </div>
        </div>


    </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { JumbotronData } from '~/types/JumbotronType'
import type { TableColumn } from '~/components/Table.vue'
import { getJumbotronList, deleteJumbotron } from '~/services/jumbotron'
import AddButton from '~/components/common/AddButton.vue'
import CreateJumbotronModal from '~/components/modals/CreateJumbotronModal.vue'
import EditJumbotronModal from '~/components/modals/EditJumbotronModal.vue'
import ConfirmationDeleteModal from '~/components/modals/ConfirmationDeleteModal.vue'
import { useToast } from '~/composables/useToast'

const { success } = useToast()

definePageMeta({
    layout: 'default',
    middleware: 'auth',
})

// State
const jumbotronList = ref<JumbotronData[]>([])
const isLoading = ref(false)
const isDeleting = ref(false)
const error = ref<string | null>(null)
const total = ref(0)
const showDeleteModal = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedItem = ref<JumbotronData | null>(null)

// Table columns configuration
const tableColumns: TableColumn[] = [
    {
        key: 'file',
        label: 'Gambar',
        width: '32',
    },
    {
        key: 'status',
        label: 'Status',
    },
    {
        key: 'created_at',
        label: 'Dibuat',
    },
]

// Fetch jumbotron data
const fetchJumbotronData = async () => {
    isLoading.value = true
    error.value = null

    try {
        const response = await getJumbotronList(100, 0)
        // Sort by created_at descending (newest first)
        const sortedData = response.data.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime()
            const dateB = new Date(b.created_at).getTime()
            return dateB - dateA // descending order
        })
        jumbotronList.value = sortedData
        total.value = response.total
    } catch (err: any) {
        // Handle 401 Unauthorized - redirect to login
        if (err.status === 401) {
            const { handle401 } = useAuthGuard()
            await handle401()
            return
        }

        error.value = err.data?.message || err.message || 'Gagal memuat data jumbotron'
        console.error('Error fetching jumbotron:', err)
    } finally {
        isLoading.value = false
    }
}

// Open create modal
const openCreateModal = () => {
    showCreateModal.value = true
}

// Handle successful create
const handleCreateSuccess = async (message: string) => {
    console.log('Create success:', message)
    // Show toast
    success('Data Berhasil Ditambahkan', 'Jumbotron baru telah ditambahkan ke sistem')
    // Refresh data
    await fetchJumbotronData()
}

// Handle create error
const handleCreateError = (error: string) => {
    console.error('Create error:', error)
}

// Open edit modal
const openEditModal = (item: JumbotronData) => {
    selectedItem.value = item
    showEditModal.value = true
}

// Handle successful edit
const handleEditSuccess = async (message: string) => {
    console.log('Edit success:', message)
    // Show toast
    success('Data Berhasil Diperbarui', 'Perubahan jumbotron telah disimpan')
    // Refresh data
    await fetchJumbotronData()
}

// Handle edit error
const handleEditError = (error: string) => {
    console.error('Edit error:', error)
}

// Open delete confirmation
const openDeleteConfirm = (item: JumbotronData) => {
    selectedItem.value = item
    showDeleteModal.value = true
}

// Confirm delete
const confirmDelete = async () => {
    if (!selectedItem.value) return

    isDeleting.value = true
    try {
        await deleteJumbotron(selectedItem.value.id)

        // Remove from list
        jumbotronList.value = jumbotronList.value.filter(
            item => item.id !== selectedItem.value!.id
        )
        total.value--

        showDeleteModal.value = false
        selectedItem.value = null

        // Show success toast
        success('Data Berhasil Dihapus', 'Jumbotron telah dihapus dari sistem')
    } catch (err: any) {
        // Handle 401 Unauthorized - redirect to login
        if (err.status === 401) {
            const { handle401 } = useAuthGuard()
            await handle401()
            return
        }

        error.value = err.data?.message || err.message || 'Gagal menghapus jumbotron'
        console.error('Error deleting jumbotron:', err)
    } finally {
        isDeleting.value = false
    }
}

// Format date helper
const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

// Lifecycle
onMounted(() => {
    fetchJumbotronData()
})
</script>

<style scoped>
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-slide-up {
    animation: slideUp 0.3s ease-out;
}
</style>

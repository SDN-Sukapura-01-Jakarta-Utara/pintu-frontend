<template>
    <DashboardLayout>
        <!-- Header Section -->
        <div class="mb-6 sm:mb-8">
            <div class="flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
              <div>
                 <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                   Jumbotron
                 </h1>
                     <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">Kelola gambar jumbotron untuk halaman utama sekolah</p>
                 </div>
                <button @click="openCreateModal"
                   class="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-[#2e45a7] text-white font-semibold text-[13px] sm:text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:bg-[#002d89]">
                   <i class="fa-solid fa-plus w-3 h-3 sm:w-4 sm:h-4"></i>
                   Tambah Data
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-8 sm:py-12">
            <div class="flex flex-col items-center gap-3 sm:gap-4">
                <div class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
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
            <!-- Empty State -->
            <div v-if="jumbotronList.length === 0" class="flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-6">
                <div class="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 sm:mb-4">
                    <i class="fa-solid fa-image w-6 h-6 sm:w-8 sm:h-8 text-gray-400"></i>
                </div>
                <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1">Belum ada jumbotron</h3>
                <p class="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 max-w-sm">
                    Mulai dengan menambahkan gambar jumbotron untuk halaman utama sekolah Anda
                </p>
                <button @click="openCreateModal"
                    class="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-[#2e45a7] text-white font-semibold text-[13px] sm:text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:bg-[#002d89]">
                    <i class="fa-solid fa-plus w-3 h-3 sm:w-4 sm:h-4"></i>
                    Tambah Data
                </button>
            </div>

            <!-- Data Table -->
            <Table 
                :items="jumbotronList" 
                :total="total"
                @edit="openEditModal"
                @delete="openDeleteConfirm"
            />
        </div>

        <!-- Delete Confirmation Modal -->
        <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-4">
            <div v-if="showDeleteModal"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 animate-slide-up">
                    <!-- Icon -->
                    <div class="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <i class="fa-solid fa-trash w-6 h-6 text-red-600"></i>
                    </div>

                    <!-- Title -->
                    <h3 class="text-lg sm:text-xl font-bold text-gray-900 text-center mb-2">Hapus Jumbotron?</h3>

                    <!-- Message -->
                    <p class="text-base sm:text-lg text-gray-600 text-center mb-6">
                        Anda yakin ingin menghapus jumbotron ini? Tindakan ini tidak dapat dibatalkan.
                    </p>

                    <!-- Buttons -->
                    <div class="flex gap-3">
                        <button @click="showDeleteModal = false"
                            class="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                            Batal
                        </button>
                        <button @click="confirmDelete" :disabled="isDeleting"
                            class="flex-1 px-4 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            <i v-if="isDeleting" class="fa-solid fa-spinner w-4 h-4 animate-spin"></i>
                            {{ isDeleting ? 'Menghapus...' : 'Hapus' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- Backdrop -->
        <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="showDeleteModal" @click="showDeleteModal = false" class="fixed inset-0 z-40 bg-black/40"></div>
        </Transition>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { JumbotronData } from '~/types/JumbotronType'
import { getJumbotronList, deleteJumbotron } from '~/services/jumbotron'

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
const selectedItem = ref<JumbotronData | null>(null)

// Fetch jumbotron data
const fetchJumbotronData = async () => {
    isLoading.value = true
    error.value = null

    try {
        const response = await getJumbotronList(100, 0)
        jumbotronList.value = response.data
        total.value = response.total
    } catch (err: any) {
        error.value = err.data?.message || err.message || 'Gagal memuat data jumbotron'
        console.error('Error fetching jumbotron:', err)
    } finally {
        isLoading.value = false
    }
}

// Open create modal
const openCreateModal = () => {
    // TODO: Implement modal for create
    console.log('Open create modal')
}

// Open edit modal
const openEditModal = (item: JumbotronData) => {
    // TODO: Implement modal for edit
    console.log('Open edit modal for:', item)
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

        // Show success message
        console.log('Jumbotron berhasil dihapus')
    } catch (err: any) {
        error.value = err.data?.message || err.message || 'Gagal menghapus jumbotron'
        console.error('Error deleting jumbotron:', err)
    } finally {
        isDeleting.value = false
    }
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

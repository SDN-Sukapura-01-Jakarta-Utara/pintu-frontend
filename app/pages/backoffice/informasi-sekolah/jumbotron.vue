<template>
    <DashboardLayout>
        <!-- Header Section -->
        <div class="mb-8">
            <div class="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">
                  Jumbotron
                </h1>
                    <p class="text-gray-600 mt-2">Kelola gambar jumbotron untuk halaman utama sekolah</p>
                </div>
                <button @click="openCreateModal"
                    class="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:bg-blue-700">
                    <i class="fa-solid fa-plus w-4 h-4"></i>
                    Tambah Data
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-12">
            <div class="flex flex-col items-center gap-4">
                <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
                <p class="text-gray-600 font-medium">Memuat data jumbotron...</p>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="rounded-xl border-2 border-red-200 bg-red-50 p-6">
            <div class="flex items-start gap-4">
                <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-red-900">Gagal memuat data</h3>
                    <p class="mt-1 text-red-800">{{ error }}</p>
                    <button @click="fetchJumbotronData"
                        class="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors">
                        <i class="fa-solid fa-rotate-right w-4 h-4"></i>
                        Coba Lagi
                    </button>
                </div>
            </div>
        </div>

        <!-- Table Section -->
        <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200">
            <!-- Empty State -->
            <div v-if="jumbotronList.length === 0" class="flex flex-col items-center justify-center py-16 px-6">
                <div class="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <i class="fa-solid fa-image w-8 h-8 text-gray-400"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-1">Belum ada jumbotron</h3>
                <p class="text-gray-600 text-center mb-6 max-w-sm">
                    Mulai dengan menambahkan gambar jumbotron untuk halaman utama sekolah Anda
                </p>
                <button @click="openCreateModal"
                    class="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:bg-blue-700">
                    <i class="fa-solid fa-plus w-4 h-4"></i>
                    Tambah Data
                </button>
            </div>

            <!-- Data Table -->
            <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <!-- Header -->
                        <thead>
                            <tr class="border-b border-gray-200 bg-red-800">
                            <th
                                class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white w-12">
                                No
                            </th>
                            <th
                                class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white w-32">
                                Gambar
                            </th>
                            <th
                                class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
                                Status
                            </th>
                            <th
                                class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
                                Dibuat
                            </th>
                            <th
                                class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-white">
                                Aksi
                            </th>
                        </tr>
                    </thead>

                    <!-- Body -->
                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="(item, index) in jumbotronList" :key="item.id"
                            class="hover:bg-gray-50 transition-colors duration-150">
                            <!-- No Column -->
                            <td class="px-6 py-4 text-sm font-medium text-gray-700">
                                {{ index + 1 }}
                            </td>

                            <!-- Image Column -->
                            <td class="px-6 py-4">
                                <img :src="item.file" :alt="`Jumbotron ${item.id}`"
                                    class="h-16 w-24 rounded-lg object-cover shadow-sm border border-gray-200 hover:shadow-md transition-shadow" />
                            </td>

                            <!-- Status Column -->
                            <td class="px-6 py-4">
                                <span :class="[
                                    'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                                    item.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800',
                                ]">
                                    <span :class="[
                                        'inline-block h-2 w-2 rounded-full mr-2',
                                        item.status === 'active' ? 'bg-green-600' : 'bg-red-600',
                                    ]"></span>
                                    {{ item.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                </span>
                            </td>

                            <!-- Created Date Column -->
                            <td class="px-6 py-4 text-sm text-gray-700">
                                {{ formatDate(item.created_at) }}
                            </td>

                            <!-- Action Column -->
                            <td class="px-6 py-4">
                                <div class="flex items-center justify-center gap-2">
                                    <!-- Edit Button -->
                                    <button @click="openEditModal(item)"
                                        class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-100 text-yellow-700 font-semibold hover:bg-yellow-200 transition-colors duration-200"
                                        title="Edit">
                                        <i class="fa-solid fa-pen w-4 h-4"></i>
                                    </button>

                                    <!-- Delete Button -->
                                    <button @click="openDeleteConfirm(item)"
                                        class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition-colors duration-200"
                                        title="Hapus">
                                        <i class="fa-solid fa-trash w-4 h-4"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>

                <!-- Pagination Info -->
                <div v-if="jumbotronList.length > 0"
                    class="border-t border-gray-200 bg-gray-50 px-6 py-4 text-sm text-gray-600">
                    Menampilkan <span class="font-semibold text-gray-900">{{ jumbotronList.length }}</span> dari
                    <span class="font-semibold text-gray-900">{{ total }}</span> data
                </div>
            </div>
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
                    <h3 class="text-xl font-bold text-gray-900 text-center mb-2">Hapus Jumbotron?</h3>

                    <!-- Message -->
                    <p class="text-gray-600 text-center mb-6">
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

// Format date
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
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

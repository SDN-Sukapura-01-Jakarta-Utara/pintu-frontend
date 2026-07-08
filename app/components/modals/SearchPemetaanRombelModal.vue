<template>
    <!-- Edit Pemetaan Rombel Modal -->
    <EditPemetaanRombelModal v-model="showEditModal" :pemetaanData="selectedPemetaan" @success="handleEditSuccess" />

    <!-- Confirmation Delete Pemetaan Rombel Modal -->
    <ConfirmationDeletePemetaanRombelModal v-model="showDeleteModal" :pemetaanId="selectedPemetaanId" 
        :siswaName="selectedSiswaName" @success="handleDeleteSuccess" />

    <!-- Backdrop -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="modelValue" @click="closeModal" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"></div>
    </Transition>

    <!-- Modal -->
    <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4">
        <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[95vh]">
                <!-- Header -->
                <div class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex items-center justify-between gap-4">
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Cari Pemetaan Rombel</h2>
                    </div>
                    <button type="button" @click.stop="closeModal" :title="'Tutup'"
                        class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 backdrop-blur-sm cursor-pointer">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Body -->
                <div class="p-4 sm:p-6 overflow-y-auto flex-1">
                    <!-- Filters -->
                    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-4 sm:p-6 mb-6">
                        <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-filter text-blue-600"></i>
                            <span>Filter Pencarian</span>
                        </h3>
                        <div class="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-4">
                            <!-- Nama Filter -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-900 mb-2">Nama Peserta Didik</label>
                                <input v-model="filters.nama" type="text" placeholder="Cari nama siswa..."
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 h-[42px]" />
                            </div>

                            <!-- Rombel Dropdown -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-900 mb-2">Rombel</label>
                                <select v-model="filters.rombel_id"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer h-[42px]">
                                    <option value="">Semua Rombel</option>
                                    <option v-for="rombel in rombelList" :key="rombel.id" :value="rombel.id">
                                        {{ rombel.name }}
                                    </option>
                                </select>
                            </div>

                            <!-- Tahun Pelajaran Dropdown -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-900 mb-2">Tahun Pelajaran</label>
                                <select v-model="filters.tahun_pelajaran_id"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer h-[42px]">
                                    <option value="">Semua Tahun Pelajaran</option>
                                    <option v-for="tp in tahunPelajaranList" :key="tp.id" :value="tp.id">
                                        {{ tp.tahun_pelajaran }}
                                    </option>
                                </select>
                            </div>

                            <!-- Search Button -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-900 mb-2 invisible">Cari</label>
                                <button @click="applyFilter"
                                    class="flex items-center justify-center gap-2 px-6 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors cursor-pointer h-[42px] whitespace-nowrap">
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                    <span>Cari</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Table -->
                    <div class="bg-white rounded-xl border-2 border-gray-200">
                        <div class="border-b border-gray-200 px-4 py-3">
                            <h3 class="text-base font-bold text-gray-900">Hasil Pencarian</h3>
                        </div>

                        <!-- Loading State -->
                        <div v-if="isLoading" class="py-8 flex justify-center">
                            <div class="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
                        </div>

                        <!-- Table -->
                        <div v-else-if="pemetaanList.length > 0" class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-gray-700">
                                    <tr>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Nama</th>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase">NIS</th>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Jenis Kelamin</th>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase">NISN</th>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Rombel</th>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Tahun Pelajaran</th>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Status</th>
                                        <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200">
                                    <tr v-for="item in pemetaanList" :key="item.id" class="hover:bg-gray-50">
                                        <td class="px-4 py-3 text-sm text-gray-700">{{ item.peserta_didik?.nama }}</td>
                                        <td class="px-4 py-3 text-sm text-gray-700">{{ item.peserta_didik?.nis }}</td>
                                        <td class="px-4 py-3 text-sm text-gray-700">{{ item.peserta_didik?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}</td>
                                        <td class="px-4 py-3 text-sm text-gray-700">{{ item.peserta_didik?.nisn || '-' }}</td>
                                        <td class="px-4 py-3 text-sm text-gray-700">{{ item.rombel?.name || '-' }}</td>
                                        <td class="px-4 py-3 text-sm text-gray-700">{{ item.tahun_pelajaran?.tahun_pelajaran || '-' }}</td>
                                        <td class="px-4 py-3">
                                            <span :class="[
                                                'inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold',
                                                item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            ]">
                                                {{ item.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                            </span>
                                        </td>
                                        <td class="px-4 py-3">
                                            <div class="flex items-center justify-center gap-2">
                                                <EditButton title="Edit" label="Edit" @click="editPemetaan(item)" />
                                                <DeleteButton title="Hapus" label="Hapus" @click="deletePemetaan(item)" />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <!-- Pagination -->
                            <div class="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
                                <button @click="prevPage" :disabled="pagination.page === 1"
                                    class="px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-gray-100 cursor-pointer">
                                    <i class="fa-solid fa-chevron-left"></i>
                                </button>
                                <div class="flex items-center gap-3">
                                    <span class="text-sm text-gray-600">
                                        {{ startIndex }}-{{ endIndex }} dari {{ totalData }} data
                                    </span>
                                    <span class="text-sm text-gray-400">|</span>
                                    <span class="text-sm text-gray-600">Halaman {{ pagination.page }} dari {{ totalPages }}</span>
                                </div>
                                <button @click="nextPage" :disabled="pagination.page >= totalPages"
                                    class="px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-gray-100 cursor-pointer">
                                    <i class="fa-solid fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Empty State -->
                        <div v-else class="py-12 text-center">
                            <i class="fa-solid fa-search text-4xl text-gray-400 mb-3"></i>
                            <p class="text-gray-600">Tidak ada data ditemukan</p>
                            <p class="text-sm text-gray-500 mt-1">Silakan ubah filter pencarian</p>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-end gap-3">
                    <button @click="closeModal"
                        class="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 font-semibold text-sm hover:bg-gray-300 transition-colors cursor-pointer">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useToastStore } from '~/stores/ToastStore'
import { useAuthGuard } from '~/composables/useAuthGuard'
import EditButton from '~/components/common/EditButton.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'
import EditPemetaanRombelModal from '~/components/modals/EditPemetaanRombelModal.vue'
import ConfirmationDeletePemetaanRombelModal from '~/components/modals/ConfirmationDeletePemetaanRombelModal.vue'

const props = defineProps({
    modelValue: Boolean,
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'edit': [item: any]
    'delete': [item: any]
}>()

const toastStore = useToastStore()
const config = useRuntimeConfig()
const { handle401 } = useAuthGuard()

const isLoading = ref(false)
const rombelList = ref<any[]>([])
const tahunPelajaranList = ref<any[]>([])
const pemetaanList = ref<any[]>([])
const totalData = ref(0)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedPemetaan = ref<any>(null)
const selectedPemetaanId = ref(0)
const selectedSiswaName = ref('')

const filters = ref({
    nama: '',
    rombel_id: '',
    tahun_pelajaran_id: ''
})

const pagination = ref({
    page: 1,
    limit: 10
})

const totalPages = computed(() => Math.ceil(totalData.value / pagination.value.limit))

const startIndex = computed(() => {
    if (totalData.value === 0) return 0
    return (pagination.value.page - 1) * pagination.value.limit + 1
})

const endIndex = computed(() => {
    const end = pagination.value.page * pagination.value.limit
    return end > totalData.value ? totalData.value : end
})

watch(() => props.modelValue, async (newVal) => {
    if (newVal) {
        await fetchRombel()
        await fetchTahunPelajaran()
        await fetchPemetaan()
    } else {
        resetFilters()
    }
})

const fetchRombel = async () => {
    try {
        const response = await $fetch<any>(`${config.public.apiBase}/api/v1/rombel/get-rombel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            credentials: 'include',
            body: {
                search: {},
                pagination: { limit: 100, page: 1 }
            }
        })
        rombelList.value = response.data || []
    } catch (err: any) {
        if (err.status === 401 || err.statusCode === 401) {
            await handle401()
        }
    }
}

const fetchTahunPelajaran = async () => {
    try {
        const response = await $fetch<any>(`${config.public.apiBase}/api/v1/tahun-pelajaran/get-tahun-pelajaran`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            credentials: 'include',
            body: {
                search: {},
                pagination: { limit: 100, page: 1 }
            }
        })
        tahunPelajaranList.value = response.data || []
    } catch (err: any) {
        if (err.status === 401 || err.statusCode === 401) {
            await handle401()
        }
    }
}

const fetchPemetaan = async () => {
    isLoading.value = true

    try {
        const search: any = {}

        if (filters.value.nama) search.nama = filters.value.nama
        if (filters.value.rombel_id) search.rombel_id = Number(filters.value.rombel_id)
        if (filters.value.tahun_pelajaran_id) search.tahun_pelajaran_id = Number(filters.value.tahun_pelajaran_id)

        const response = await $fetch<any>(`${config.public.apiBase}/api/v1/peserta-didik/get-pemetaan-rombel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            credentials: 'include',
            body: {
                search,
                pagination: {
                    limit: pagination.value.limit,
                    page: pagination.value.page
                }
            }
        })

        pemetaanList.value = response.data || []
        totalData.value = response.pagination?.total || 0
    } catch (err: any) {
        if (err.status === 401 || err.statusCode === 401) {
            await handle401()
            return
        }
        toastStore.error('Gagal', 'Gagal memuat data pemetaan rombel')
    } finally {
        isLoading.value = false
    }
}

const applyFilter = () => {
    pagination.value.page = 1
    fetchPemetaan()
}

const prevPage = () => {
    if (pagination.value.page > 1) {
        pagination.value.page--
        fetchPemetaan()
    }
}

const nextPage = () => {
    if (pagination.value.page < totalPages.value) {
        pagination.value.page++
        fetchPemetaan()
    }
}

const editPemetaan = (item: any) => {
    selectedPemetaan.value = item
    showEditModal.value = true
}

const handleEditSuccess = () => {
    fetchPemetaan()
}

const deletePemetaan = (item: any) => {
    selectedPemetaanId.value = item.id
    selectedSiswaName.value = item.peserta_didik?.nama || 'Siswa'
    showDeleteModal.value = true
}

const handleDeleteSuccess = () => {
    fetchPemetaan()
}

const resetFilters = () => {
    filters.value = {
        nama: '',
        rombel_id: '',
        tahun_pelajaran_id: ''
    }
    pemetaanList.value = []
    pagination.value = { page: 1, limit: 10 }
}

const closeModal = () => {
    emit('update:modelValue', false)
}
</script>

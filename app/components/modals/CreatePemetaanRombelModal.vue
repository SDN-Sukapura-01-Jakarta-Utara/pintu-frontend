<template>
    <!-- Error Modal -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="showErrorModal" @click="showErrorModal = false" class="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"></div>
    </Transition>

    <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4">
        <div v-if="showErrorModal" class="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[80vh]">
                <div class="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4">
                    <h2 class="text-xl font-bold text-white flex items-center gap-2">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <span>Hasil Pemetaan Rombel</span>
                    </h2>
                </div>
                <div class="p-6 overflow-y-auto flex-1">
                    <!-- Summary Cards -->
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <!-- Success Card -->
                        <div class="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                                    <i class="fa-solid fa-check text-white text-xl"></i>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-600 font-medium">Berhasil</p>
                                    <p class="text-2xl font-bold text-green-700">{{ errorData.success_count }}</p>
                                    <p class="text-xs text-gray-600">Siswa</p>
                                </div>
                            </div>
                        </div>

                        <!-- Failed Card -->
                        <div class="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4">
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                                    <i class="fa-solid fa-xmark text-white text-xl"></i>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-600 font-medium">Gagal</p>
                                    <p class="text-2xl font-bold text-red-700">{{ errorData.failed_count }}</p>
                                    <p class="text-xs text-gray-600">Siswa</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Error List -->
                    <div v-if="errorData.errors && errorData.errors.length > 0">
                        <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <i class="fa-solid fa-list text-red-600"></i>
                            <span>Detail Error:</span>
                        </h3>
                        <div class="space-y-2">
                            <div v-for="(error, index) in errorData.errors" :key="index"
                                class="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                                <div class="flex items-start gap-3">
                                    <div class="flex-shrink-0 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold">
                                        {{ index + 1 }}
                                    </div>
                                    <p class="text-sm text-red-800 flex-1">{{ error.message }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-end">
                    <button @click="showErrorModal = false"
                        class="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 font-semibold text-sm hover:bg-gray-300 transition-colors cursor-pointer">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    </Transition>

    <!-- Main Modal -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="modelValue" @click="closeModal" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"></div>
    </Transition>

    <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4">
        <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-7xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[95vh]">
                <!-- Header -->
                <div class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex items-center justify-between gap-4">
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Tambah Pemetaan Rombel</h2>
                    </div>
                    <button type="button" @click.stop="closeModal" :disabled="isLoading" :title="'Tutup'"
                        class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 disabled:opacity-50 backdrop-blur-sm cursor-pointer disabled:cursor-not-allowed">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Body -->
                <div class="p-4 sm:p-6 overflow-y-auto flex-1">
                    <!-- Section: Form Fields -->
                    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-4 sm:p-6 mb-6">
                        <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-gear text-blue-600"></i>
                            <span>Konfigurasi Pemetaan</span>
                        </h3>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <!-- Rombel Dropdown -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-900 mb-2">Rombel <span class="text-red-600">*</span></label>
                                <select v-model="form.rombel_id" :disabled="isLoading"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:opacity-50 cursor-pointer">
                                    <option value="">Pilih Rombel</option>
                                    <option v-for="rombel in rombelList" :key="rombel.id" :value="rombel.id">
                                        {{ rombel.name }}
                                    </option>
                                </select>
                            </div>

                            <!-- Tahun Pelajaran Dropdown -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-900 mb-2">Tahun Pelajaran <span class="text-red-600">*</span></label>
                                <select v-model="form.tahun_pelajaran_id" :disabled="isLoading"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:opacity-50 cursor-pointer">
                                    <option value="">Pilih Tahun Pelajaran</option>
                                    <option v-for="tp in tahunPelajaranList" :key="tp.id" :value="tp.id">
                                        {{ tp.tahun_pelajaran }}
                                    </option>
                                </select>
                            </div>

                            <!-- Status Toggle -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-900 mb-2">Status</label>
                                <label class="flex items-center gap-3 cursor-pointer mt-2">
                                    <div class="relative">
                                        <input type="checkbox" v-model="form.status" class="sr-only peer" :disabled="isLoading">
                                        <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                    </div>
                                    <span class="text-sm font-semibold text-gray-900">Aktif</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Section: Tabel Referensi Data Siswa -->
                    <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-4 sm:p-6 mb-6">
                        <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-table text-green-600"></i>
                            <span>Tabel Referensi Data Siswa</span>
                        </h3>
                        
                        <!-- Filters -->
                        <div class="bg-white/60 p-4 rounded-lg mb-4 border border-green-100">
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <input v-model="filters.nama" @input="applyFilter" type="text" placeholder="Cari nama..."
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm transition-all focus:border-red-600 focus:outline-none" />
                                <input v-model="filters.nis" @input="applyFilter" type="text" placeholder="Cari NIS..."
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm transition-all focus:border-red-600 focus:outline-none" />
                                <select v-model="filters.jenis_kelamin" @change="applyFilter"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm transition-all focus:border-red-600 focus:outline-none cursor-pointer">
                                    <option value="">Semua Jenis Kelamin</option>
                                    <option value="L">Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                            </div>
                        </div>

                        <!-- Loading State -->
                        <div v-if="isLoadingSiswa" class="py-8 flex justify-center">
                            <div class="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
                        </div>

                        <!-- Table -->
                        <div v-else class="border border-green-200 rounded-lg overflow-hidden bg-white">
                            <div class="overflow-x-auto">
                                <table class="w-full">
                                    <thead class="bg-gray-700">
                                        <tr>
                                            <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase w-20">Aksi</th>
                                            <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Nama</th>
                                            <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase">NIS</th>
                                            <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Jenis Kelamin</th>
                                            <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase">NISN</th>
                                            <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Tempat Lahir</th>
                                            <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Tanggal Lahir</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200">
                                        <tr v-for="siswa in availableSiswaList" :key="siswa.id" class="hover:bg-gray-50">
                                            <td class="px-4 py-3">
                                                <button @click="addSiswa(siswa)" :disabled="isLoading" title="Tambah Data"
                                                    class="px-2 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer">
                                                    <i class="fa-solid fa-plus"></i>
                                                </button>
                                            </td>
                                            <td class="px-4 py-3 text-sm text-gray-700">{{ siswa.nama }}</td>
                                            <td class="px-4 py-3 text-sm text-gray-700">{{ siswa.nis }}</td>
                                            <td class="px-4 py-3 text-sm text-gray-700">{{ siswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}</td>
                                            <td class="px-4 py-3 text-sm text-gray-700">{{ siswa.nisn || '-' }}</td>
                                            <td class="px-4 py-3 text-sm text-gray-700">{{ siswa.tempat_lahir || '-' }}</td>
                                            <td class="px-4 py-3 text-sm text-gray-700">{{ siswa.tanggal_lahir || '-' }}</td>
                                        </tr>
                                        <tr v-if="availableSiswaList.length === 0">
                                            <td colspan="7" class="px-4 py-8 text-center text-gray-500">Tidak ada data siswa</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                            <!-- Pagination -->
                            <div class="bg-green-50 px-4 py-3 flex items-center justify-between border-t border-green-200">
                                <button @click="prevPageReferensi" :disabled="refPagination.page === 1"
                                    class="px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-gray-100 cursor-pointer">
                                    <i class="fa-solid fa-chevron-left"></i>
                                </button>
                                <div class="flex flex-col items-center gap-1">
                                    <span class="text-sm text-gray-600">{{ refStartItem }}-{{ refEndItem }} dari {{ refTotalData }} data</span>
                                    <span class="text-xs text-gray-500">Halaman {{ refPagination.page }} dari {{ refTotalPages }}</span>
                                </div>
                                <button @click="nextPageReferensi" :disabled="refPagination.page >= refTotalPages"
                                    class="px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-gray-100 cursor-pointer">
                                    <i class="fa-solid fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Section: Tabel Siswa yang Dipilih -->
                    <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-4 sm:p-6">
                        <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-user-check text-purple-600"></i>
                            <span>Data Siswa yang Dipilih ({{ selectedSiswaList.length }})</span>
                        </h3>
                        
                        <div class="border border-purple-200 rounded-lg overflow-hidden bg-white">
                            <div class="overflow-x-auto">
                                <table class="w-full">
                                    <thead class="bg-gray-700">
                                        <tr>
                                            <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Nama</th>
                                            <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase">NIS</th>
                                            <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Jenis Kelamin</th>
                                            <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase">NISN</th>
                                            <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Tempat Lahir</th>
                                            <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Tanggal Lahir</th>
                                            <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase w-20">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200">
                                        <tr v-for="siswa in paginatedSelectedSiswa" :key="siswa.id" class="hover:bg-gray-50">
                                            <td class="px-4 py-3 text-sm text-gray-700">{{ siswa.nama }}</td>
                                            <td class="px-4 py-3 text-sm text-gray-700">{{ siswa.nis }}</td>
                                            <td class="px-4 py-3 text-sm text-gray-700">{{ siswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}</td>
                                            <td class="px-4 py-3 text-sm text-gray-700">{{ siswa.nisn || '-' }}</td>
                                            <td class="px-4 py-3 text-sm text-gray-700">{{ siswa.tempat_lahir || '-' }}</td>
                                            <td class="px-4 py-3 text-sm text-gray-700">{{ siswa.tanggal_lahir || '-' }}</td>
                                            <td class="px-4 py-3 text-center">
                                                <button @click="removeSiswa(siswa)" :disabled="isLoading"
                                                    class="px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer">
                                                    <i class="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr v-if="selectedSiswaList.length === 0">
                                            <td colspan="7" class="px-4 py-8 text-center text-gray-500">Belum ada siswa yang dipilih</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                            <!-- Pagination -->
                            <div v-if="selectedSiswaList.length > 0" class="bg-purple-50 px-4 py-3 flex items-center justify-between border-t border-purple-200">
                                <button @click="prevPageSelected" :disabled="selectedPagination.page === 1"
                                    class="px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-gray-100 cursor-pointer">
                                    <i class="fa-solid fa-chevron-left"></i>
                                </button>
                                <span class="text-sm text-gray-600">Halaman {{ selectedPagination.page }} dari {{ selectedTotalPages }}</span>
                                <button @click="nextPageSelected" :disabled="selectedPagination.page >= selectedTotalPages"
                                    class="px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-gray-100 cursor-pointer">
                                    <i class="fa-solid fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-end gap-3">
                    <button @click="closeModal" :disabled="isLoading"
                        class="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 font-semibold text-sm hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        Batal
                    </button>
                    <button @click="submitForm" :disabled="isLoading || selectedSiswaList.length === 0"
                        class="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2">
                        <span v-if="isLoading" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        <span>{{ isLoading ? 'Menyimpan...' : 'Simpan Data' }}</span>
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useToastStore } from '~/stores/ToastStore'
import { useAuthGuard } from '~/composables/useAuthGuard'

const props = defineProps({
    modelValue: Boolean,
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'success': []
}>()

const toastStore = useToastStore()
const config = useRuntimeConfig()
const { handle401 } = useAuthGuard()

const isLoading = ref(false)
const isLoadingSiswa = ref(false)
const showErrorModal = ref(false)
const rombelList = ref<any[]>([])
const tahunPelajaranList = ref<any[]>([])
const allSiswaList = ref<any[]>([])
const selectedSiswaList = ref<any[]>([])
const errorData = ref<any>({})

const form = ref({
    rombel_id: '',
    tahun_pelajaran_id: '',
    status: true
})

const filters = ref({
    nama: '',
    nis: '',
    jenis_kelamin: ''
})

const refPagination = ref({ page: 1, limit: 10 })
const selectedPagination = ref({ page: 1, limit: 10 })

// Computed
const availableSiswaList = computed(() => {
    const selectedIds = selectedSiswaList.value.map(s => s.id)
    let filtered = allSiswaList.value.filter(s => !selectedIds.includes(s.id))
    
    if (filters.value.nama) {
        filtered = filtered.filter(s => s.nama?.toLowerCase().includes(filters.value.nama.toLowerCase()))
    }
    if (filters.value.nis) {
        filtered = filtered.filter(s => s.nis?.toLowerCase().includes(filters.value.nis.toLowerCase()))
    }
    if (filters.value.jenis_kelamin) {
        filtered = filtered.filter(s => s.jenis_kelamin === filters.value.jenis_kelamin)
    }
    
    const start = (refPagination.value.page - 1) * refPagination.value.limit
    const end = start + refPagination.value.limit
    return filtered.slice(start, end)
})

const refTotalPages = computed(() => {
    const selectedIds = selectedSiswaList.value.map(s => s.id)
    let filtered = allSiswaList.value.filter(s => !selectedIds.includes(s.id))
    
    if (filters.value.nama) {
        filtered = filtered.filter(s => s.nama?.toLowerCase().includes(filters.value.nama.toLowerCase()))
    }
    if (filters.value.nis) {
        filtered = filtered.filter(s => s.nis?.toLowerCase().includes(filters.value.nis.toLowerCase()))
    }
    if (filters.value.jenis_kelamin) {
        filtered = filtered.filter(s => s.jenis_kelamin === filters.value.jenis_kelamin)
    }
    
    return Math.ceil(filtered.length / refPagination.value.limit)
})

const refTotalData = computed(() => {
    const selectedIds = selectedSiswaList.value.map(s => s.id)
    let filtered = allSiswaList.value.filter(s => !selectedIds.includes(s.id))
    
    if (filters.value.nama) {
        filtered = filtered.filter(s => s.nama?.toLowerCase().includes(filters.value.nama.toLowerCase()))
    }
    if (filters.value.nis) {
        filtered = filtered.filter(s => s.nis?.toLowerCase().includes(filters.value.nis.toLowerCase()))
    }
    if (filters.value.jenis_kelamin) {
        filtered = filtered.filter(s => s.jenis_kelamin === filters.value.jenis_kelamin)
    }
    
    return filtered.length
})

const refStartItem = computed(() => {
    if (refTotalData.value === 0) return 0
    return (refPagination.value.page - 1) * refPagination.value.limit + 1
})

const refEndItem = computed(() => {
    const end = refPagination.value.page * refPagination.value.limit
    return end > refTotalData.value ? refTotalData.value : end
})

const paginatedSelectedSiswa = computed(() => {
    const start = (selectedPagination.value.page - 1) * selectedPagination.value.limit
    const end = start + selectedPagination.value.limit
    return selectedSiswaList.value.slice(start, end)
})

const selectedTotalPages = computed(() => {
    return Math.ceil(selectedSiswaList.value.length / selectedPagination.value.limit)
})

// Watch modal open
watch(() => props.modelValue, async (newVal) => {
    if (newVal) {
        await fetchRombel()
        await fetchTahunPelajaran()
        await fetchMasterDataSiswa()
    } else {
        resetForm()
    }
})

// Methods
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
        
        const activeTp = tahunPelajaranList.value.find((tp: any) => tp.status === 'active')
        if (activeTp) {
            form.value.tahun_pelajaran_id = activeTp.id
        }
    } catch (err: any) {
        if (err.status === 401 || err.statusCode === 401) {
            await handle401()
        }
    }
}

const fetchMasterDataSiswa = async () => {
    isLoadingSiswa.value = true
    try {
        const response = await $fetch<any>(`${config.public.apiBase}/api/v1/peserta-didik/get-peserta-didik`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            credentials: 'include',
            body: {
                search: { status: 'active' },
                pagination: { limit: 1000, page: 1 }
            }
        })
        allSiswaList.value = response.data || []
    } catch (err: any) {
        if (err.status === 401 || err.statusCode === 401) {
            await handle401()
        }
    } finally {
        isLoadingSiswa.value = false
    }
}

const applyFilter = () => {
    refPagination.value.page = 1
}

const prevPageReferensi = () => {
    if (refPagination.value.page > 1) {
        refPagination.value.page--
    }
}

const nextPageReferensi = () => {
    if (refPagination.value.page < refTotalPages.value) {
        refPagination.value.page++
    }
}

const prevPageSelected = () => {
    if (selectedPagination.value.page > 1) {
        selectedPagination.value.page--
    }
}

const nextPageSelected = () => {
    if (selectedPagination.value.page < selectedTotalPages.value) {
        selectedPagination.value.page++
    }
}

const addSiswa = (siswa: any) => {
    selectedSiswaList.value.push(siswa)
    refPagination.value.page = 1
}

const removeSiswa = (siswa: any) => {
    selectedSiswaList.value = selectedSiswaList.value.filter(s => s.id !== siswa.id)
    if (selectedPagination.value.page > selectedTotalPages.value && selectedTotalPages.value > 0) {
        selectedPagination.value.page = selectedTotalPages.value
    }
}

const submitForm = async () => {
    if (!form.value.rombel_id || !form.value.tahun_pelajaran_id) {
        toastStore.error('Error', 'Rombel dan Tahun Pelajaran harus diisi')
        return
    }

    if (selectedSiswaList.value.length === 0) {
        toastStore.error('Error', 'Pilih minimal 1 siswa')
        return
    }

    isLoading.value = true

    try {
        const response = await $fetch<any>(`${config.public.apiBase}/api/v1/peserta-didik/create-pemetaan-rombel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            credentials: 'include',
            body: {
                peserta_didik_ids: selectedSiswaList.value.map(s => s.id),
                rombel_id: Number(form.value.rombel_id),
                tahun_pelajaran_id: Number(form.value.tahun_pelajaran_id),
                status: form.value.status ? 'active' : 'inactive'
            }
        })

        if (response.data.failed_count > 0) {
            errorData.value = response.data
            showErrorModal.value = true
            
            if (response.data.success_count > 0) {
                toastStore.success('Sukses', `Berhasil menambahkan ${response.data.success_count} siswa ke pemetaan rombel`)
                emit('success')
            }
        } else {
            toastStore.success('Sukses', `Berhasil menambahkan ${response.data.success_count} siswa ke pemetaan rombel`)
            emit('update:modelValue', false)
            emit('success')
        }
    } catch (err: any) {
        if (err.status === 401 || err.statusCode === 401) {
            await handle401()
            return
        }
        
        // Check if error response has data with errors array
        if (err.data?.data?.errors && Array.isArray(err.data.data.errors)) {
            errorData.value = err.data.data
            showErrorModal.value = true
        } else {
            const errorMessage = err.data?.message || 'Gagal menambahkan pemetaan rombel'
            toastStore.error('Gagal', errorMessage)
        }
    } finally {
        isLoading.value = false
    }
}

const resetForm = () => {
    form.value = {
        rombel_id: '',
        tahun_pelajaran_id: '',
        status: true
    }
    filters.value = {
        nama: '',
        nis: '',
        jenis_kelamin: ''
    }
    selectedSiswaList.value = []
    refPagination.value = { page: 1, limit: 10 }
    selectedPagination.value = { page: 1, limit: 10 }
}

const closeModal = () => {
    if (!isLoading.value) {
        emit('update:modelValue', false)
    }
}
</script>

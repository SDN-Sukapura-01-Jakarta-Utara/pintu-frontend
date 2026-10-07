<template>
    <!-- Backdrop -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="isOpen" @click="handleClose" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"></div>
    </Transition>

    <!-- Modal -->
    <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4">
        <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div class="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-2xl w-full max-w-6xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]">

                <!-- Header -->
                <div class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Detail Data Inklusi Per Rombel</h2>
                        <p class="text-xs sm:text-sm text-red-100 mt-0.5">Informasi lengkap data inklusi siswa</p>
                    </div>

                    <button type="button" @click.stop="handleClose" :title="'Tutup'"
                        class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 backdrop-blur-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Body -->
                <div class="p-4 sm:p-8 relative z-10 overflow-y-auto flex-1">
                    <!-- Loading State -->
                    <div v-if="isLoading" class="flex items-center justify-center py-12">
                        <div class="flex flex-col items-center gap-3">
                            <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
                            <p class="text-sm text-gray-600 font-medium">Memuat data...</p>
                        </div>
                    </div>

                    <!-- Content -->
                    <div v-else-if="detailData" class="space-y-6">
                        <!-- Data Peserta Didik -->
                        <div class="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
                            <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i class="fas fa-user-circle text-red-600"></i>
                                Data Peserta Didik
                            </h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-semibold text-gray-500 mb-1">Nama Lengkap</label>
                                    <p class="text-sm font-semibold text-gray-900">{{ detailData.anak_inklusi?.peserta_didik?.nama || '-' }}</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-500 mb-1">NIS</label>
                                    <p class="text-sm font-semibold text-gray-900">{{ detailData.anak_inklusi?.peserta_didik?.nis || '-' }}</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-500 mb-1">NISN</label>
                                    <p class="text-sm font-semibold text-gray-900">{{ detailData.anak_inklusi?.peserta_didik?.nisn || '-' }}</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-500 mb-1">Status Peserta Didik</label>
                                    <span :class="[
                                        'inline-block px-2 py-1 rounded-full text-xs font-medium',
                                        detailData.anak_inklusi?.peserta_didik?.status === 'active'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-800'
                                    ]">
                                        {{ detailData.anak_inklusi?.peserta_didik?.status === 'active' ? 'Aktif' : 'Tidak Aktif' }}
                                    </span>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-500 mb-1">Nama Ayah</label>
                                    <p class="text-sm font-semibold text-gray-900">{{ detailData.anak_inklusi?.peserta_didik?.nama_ayah || '-' }}</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-500 mb-1">Nama Ibu</label>
                                    <p class="text-sm font-semibold text-gray-900">{{ detailData.anak_inklusi?.peserta_didik?.nama_ibu || '-' }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Data Rombel -->
                        <div class="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
                            <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i class="fas fa-users-rectangle text-red-600"></i>
                                Data Rombongan Belajar
                            </h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-semibold text-gray-500 mb-1">Nama Rombel</label>
                                    <p class="text-sm font-semibold text-gray-900">{{ detailData.peserta_didik_rombel?.rombel?.name || '-' }}</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-500 mb-1">Tahun Pelajaran</label>
                                    <p class="text-sm font-semibold text-gray-900">{{ detailData.peserta_didik_rombel?.tahun_pelajaran?.tahun_pelajaran || '-' }}</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-500 mb-1">Status Rombel</label>
                                    <span :class="[
                                        'inline-block px-2 py-1 rounded-full text-xs font-medium',
                                        detailData.peserta_didik_rombel?.rombel?.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    ]">
                                        {{ detailData.peserta_didik_rombel?.rombel?.status === 'active' ? 'Aktif' : 'Tidak Aktif' }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Data Inklusi -->
                        <div class="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
                            <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i class="fas fa-heart text-red-600"></i>
                                Data Kebutuhan Khusus
                            </h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div class="sm:col-span-2">
                                    <label class="block text-xs font-semibold text-gray-500 mb-1">Jenis Hambatan</label>
                                    <p class="text-sm font-semibold text-gray-900">{{ detailData.anak_inklusi?.jenis_hambatan || '-' }}</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-500 mb-1">Tanggal Identifikasi</label>
                                    <p class="text-sm font-semibold text-gray-900">{{ formatDate(detailData.anak_inklusi?.tanggal_identifikasi) }}</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-500 mb-1">Tanggal Diagnosa</label>
                                    <p class="text-sm font-semibold text-gray-900">{{ formatDate(detailData.anak_inklusi?.tanggal_diagnosa) }}</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-500 mb-1">Tanggal Kadaluarsa Surat</label>
                                    <p class="text-sm font-semibold text-gray-900">{{ formatDate(detailData.anak_inklusi?.tanggal_kadaluarsa_surat) }}</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-500 mb-1">Status Inklusi</label>
                                    <span :class="[
                                        'inline-block px-2 py-1 rounded-full text-xs font-medium',
                                        detailData.anak_inklusi?.status === 'diagnosed'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    ]">
                                        {{ detailData.anak_inklusi?.status === 'diagnosed' ? 'Diagnosed' : 'Identified' }}
                                    </span>
                                </div>
                                <div class="sm:col-span-2" v-if="detailData.anak_inklusi?.catatan">
                                    <label class="block text-xs font-semibold text-gray-500 mb-1">Catatan Inklusi</label>
                                    <p class="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{{ detailData.anak_inklusi.catatan }}</p>
                                </div>
                                <div class="sm:col-span-2" v-if="detailData.anak_inklusi?.file_surat_dokter_url">
                                    <label class="block text-xs font-semibold text-gray-500 mb-1">File Surat Dokter</label>
                                    <button @click="openFile(detailData.anak_inklusi.file_surat_dokter_url)"
                                        class="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm font-semibold cursor-pointer">
                                        <i class="fas fa-file-pdf"></i>
                                        Lihat Surat Dokter
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Data Guru -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <!-- Guru Kelas -->
                            <div class="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
                                <h3 class="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <i class="fas fa-chalkboard-teacher text-red-600"></i>
                                    Guru Kelas
                                </h3>
                                <div class="space-y-3">
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-500 mb-1">Nama</label>
                                        <p class="text-sm font-semibold text-gray-900">{{ detailData.guru_kelas?.nama || '-' }}</p>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-500 mb-1">NIP</label>
                                        <p class="text-sm font-semibold text-gray-900">{{ detailData.guru_kelas?.nip || '-' }}</p>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-500 mb-1">Kategori</label>
                                        <p class="text-sm font-semibold text-gray-900">{{ detailData.guru_kelas?.kategori || '-' }}</p>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-500 mb-1">Jabatan</label>
                                        <p class="text-sm font-semibold text-gray-900">{{ detailData.guru_kelas?.jabatan || '-' }}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Guru Pendamping Khusus -->
                            <div class="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
                                <h3 class="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <i class="fas fa-user-nurse text-red-600"></i>
                                    Guru Pendamping Khusus
                                </h3>
                                <div class="space-y-3">
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-500 mb-1">Nama</label>
                                        <p class="text-sm font-semibold text-gray-900">{{ detailData.guru_pendamping_khusus?.nama || '-' }}</p>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-500 mb-1">NIP</label>
                                        <p class="text-sm font-semibold text-gray-900">{{ detailData.guru_pendamping_khusus?.nip || '-' }}</p>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-500 mb-1">Kategori</label>
                                        <p class="text-sm font-semibold text-gray-900">{{ detailData.guru_pendamping_khusus?.kategori || '-' }}</p>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-500 mb-1">Jabatan</label>
                                        <p class="text-sm font-semibold text-gray-900">{{ detailData.guru_pendamping_khusus?.jabatan || '-' }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Catatan Pendampingan -->
                        <div v-if="detailData.catatan" class="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
                            <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i class="fas fa-clipboard-list text-red-600"></i>
                                Catatan Pendampingan
                            </h3>
                            <p class="text-sm text-gray-900 bg-gray-50 p-4 rounded-lg">{{ detailData.catatan }}</p>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="flex-shrink-0 px-4 sm:px-8 py-3 sm:py-4 bg-white border-t border-gray-200 flex justify-end">
                    <button type="button" @click="handleClose"
                        class="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-semibold text-xs sm:text-sm hover:bg-gray-50 active:bg-gray-100 transition-all duration-150 cursor-pointer">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useToast } from '~/composables/useToast'
import { useAuthGuard } from '~/composables/useAuthGuard'

const props = defineProps<{
    modelValue: boolean
    dataId: number | null
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>()

const { error: showErrorToast } = useToast()
const { handle401 } = useAuthGuard()

const isOpen = ref(props.modelValue)
const isLoading = ref(false)
const detailData = ref<any>(null)

watch(() => props.modelValue, (newVal) => {
    isOpen.value = newVal
    if (newVal && props.dataId) {
        loadData()
    }
})

watch(isOpen, (newVal) => {
    emit('update:modelValue', newVal)
})

function handleClose() {
    isOpen.value = false
}

async function loadData() {
    if (!props.dataId) return

    isLoading.value = true
    detailData.value = null

    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const response = await $fetch<any>(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/get-data-induk-inklusi-rombel-by-id`,
            {
                method: 'POST',
                body: {
                    id: props.dataId
                },
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }
        )

        detailData.value = response.data
    } catch (error: any) {
        console.error('Error loading data:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }

        showErrorToast('Gagal Memuat Data', 'Gagal memuat detail data inklusi per rombel.')
        handleClose()
    } finally {
        isLoading.value = false
    }
}

function formatDate(date: string) {
    if (!date) return '-'
    const d = new Date(date)
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    const day = d.getDate()
    const month = months[d.getMonth()]
    const year = d.getFullYear()
    return `${day} ${month} ${year}`
}

function openFile(url: string) {
    window.open(url, '_blank')
}
</script>

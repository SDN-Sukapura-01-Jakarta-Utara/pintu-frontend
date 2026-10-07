<template>
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
        <div v-if="modelValue"
            class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div
                class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl sm:max-w-3xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">

                <!-- Header -->
                <div
                    class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex items-center justify-between gap-4">
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Detail Data Induk Inklusi</h2>
                    </div>

                    <button type="button" @click.stop="closeModal" :disabled="isLoading" :title="'Tutup'"
                        class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 disabled:opacity-50 backdrop-blur-sm cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Body -->
                <div v-if="isLoading" class="p-4 sm:p-6 lg:p-8 flex items-center justify-center flex-1">
                    <div class="flex flex-col items-center gap-3 sm:gap-4">
                        <div
                            class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
                        </div>
                        <p class="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Memuat detail data...</p>
                    </div>
                </div>

                <div v-else-if="data" class="p-3 sm:p-5 md:p-8 relative z-10 overflow-y-auto flex-1 space-y-6">
                    <!-- Peserta Didik Info Card -->
                    <div
                        class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border-2 border-blue-200 p-3 sm:p-4 md:p-6">
                        <div class="flex items-start gap-3 sm:gap-4">
                            <!-- Photo -->
                            <div v-if="data.peserta_didik?.photo_url" class="flex-shrink-0">
                                <img :src="data.peserta_didik.photo_url" alt="Foto Siswa" 
                                    class="w-16 h-20 sm:w-20 sm:h-24 rounded-lg object-cover border-2 border-blue-300 shadow-md" />
                            </div>
                            <div v-else class="flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-lg bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                                <i class="fas fa-user text-2xl sm:text-3xl text-gray-400"></i>
                            </div>

                            <!-- Info -->
                            <div class="min-w-0 flex-1">
                                <h3 class="text-sm sm:text-lg md:text-xl font-bold text-gray-900">{{
                                    data.peserta_didik?.nama }}</h3>
                                <p class="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Peserta Didik Inklusi</p>
                                
                                <div class="grid grid-cols-2 gap-2 mt-2 sm:mt-3">
                                    <div>
                                        <p class="text-[10px] sm:text-xs text-gray-600">NIS</p>
                                        <p class="text-[11px] sm:text-sm font-semibold text-gray-900">{{ data.peserta_didik?.nis || '-' }}</p>
                                    </div>
                                    <div>
                                        <p class="text-[10px] sm:text-xs text-gray-600">NISN</p>
                                        <p class="text-[11px] sm:text-sm font-semibold text-gray-900">{{ data.peserta_didik?.nisn || '-' }}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Status Badge -->
                            <div :class="[
                                'px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap flex-shrink-0',
                                data.status === 'diagnosed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                            ]">
                                {{ data.status === 'diagnosed' ? 'Diagnosed' : 'Identified' }}
                            </div>
                        </div>
                    </div>

                    <!-- Informasi Orang Tua -->
                    <div class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
                        <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                            <h3 class="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                                <i class="fa-solid fa-users w-3.5 sm:w-4 h-3.5 sm:h-4 text-purple-600 flex-shrink-0"></i>
                                <span>Informasi Orang Tua</span>
                            </h3>
                        </div>
                        <div class="p-3 sm:p-4 md:p-6">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Nama Ayah</p>
                                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ data.peserta_didik?.nama_ayah || '-' }}</p>
                                </div>
                                <div>
                                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Nama Ibu</p>
                                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ data.peserta_didik?.nama_ibu || '-' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Informasi Inklusi -->
                    <div class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
                        <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                            <h3 class="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                                <i class="fa-solid fa-notes-medical w-3.5 sm:w-4 h-3.5 sm:h-4 text-red-600 flex-shrink-0"></i>
                                <span>Informasi Kebutuhan Khusus</span>
                            </h3>
                        </div>
                        <div class="p-3 sm:p-4 md:p-6">
                            <div class="space-y-3 sm:space-y-4">
                                <!-- Jenis Hambatan -->
                                <div class="bg-amber-50 border-l-4 border-amber-500 p-3 sm:p-4 rounded-r-lg">
                                    <p class="text-[11px] sm:text-xs text-amber-900 font-medium mb-1">Jenis Hambatan</p>
                                    <p class="text-xs sm:text-sm font-bold text-amber-900">{{ data.jenis_hambatan }}</p>
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                    <!-- Tanggal Identifikasi -->
                                    <div>
                                        <p class="text-[11px] sm:text-xs text-gray-600 font-medium mb-1">Tgl Identifikasi</p>
                                        <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ formatDate(data.tanggal_identifikasi) }}</p>
                                        <p class="text-[10px] sm:text-xs text-gray-500 mt-0.5">Oleh guru kelas</p>
                                    </div>

                                    <!-- Tanggal Diagnosa -->
                                    <div>
                                        <p class="text-[11px] sm:text-xs text-gray-600 font-medium mb-1">Tgl Diagnosa</p>
                                        <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ formatDate(data.tanggal_diagnosa) }}</p>
                                        <p class="text-[10px] sm:text-xs text-gray-500 mt-0.5">Oleh profesional</p>
                                    </div>

                                    <!-- Tanggal Kadaluarsa -->
                                    <div>
                                        <p class="text-[11px] sm:text-xs text-gray-600 font-medium mb-1">Tgl Kadaluarsa</p>
                                        <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ formatDate(data.tanggal_kadaluarsa_surat) }}</p>
                                        <p class="text-[10px] sm:text-xs text-gray-500 mt-0.5">Masa berlaku surat</p>
                                    </div>
                                </div>

                                <!-- Catatan -->
                                <div>
                                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium mb-1">Catatan</p>
                                    <p class="text-xs sm:text-sm text-gray-900 bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200">
                                        {{ data.catatan || '-' }}
                                    </p>
                                </div>

                                <!-- File Surat -->
                                <div>
                                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium mb-2">Surat Keterangan</p>
                                    <button v-if="data.file_surat_dokter_url" @click="openFile(data.file_surat_dokter_url)"
                                        class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg cursor-pointer">
                                        <i class="fas fa-file-pdf"></i>
                                        <span>Lihat Surat Dokter</span>
                                    </button>
                                    <p v-else class="text-xs text-gray-500 italic">Tidak ada file</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Metadata -->
                    <div class="bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs">
                            <div>
                                <p class="text-gray-600">Dibuat pada</p>
                                <p class="font-semibold text-gray-900">{{ formatDateTime(data.created_at) }}</p>
                            </div>
                            <div>
                                <p class="text-gray-600">Diperbarui pada</p>
                                <p class="font-semibold text-gray-900">{{ formatDateTime(data.updated_at) }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="flex-shrink-0 px-4 sm:px-8 py-3 sm:py-4 bg-white border-t border-gray-200 flex justify-end">
                    <button type="button" @click="closeModal"
                        class="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-gray-200 text-gray-700 font-semibold text-xs sm:text-sm hover:bg-gray-300 transition-all duration-150 cursor-pointer">
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

const isLoading = ref(false)
const data = ref<any>(null)

watch(() => props.modelValue, (newVal) => {
    if (newVal && props.dataId) {
        loadData()
    }
})

async function loadData() {
    if (!props.dataId) return

    isLoading.value = true
    data.value = null

    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const response = await $fetch<any>(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/get-data-induk-inklusi-by-id`,
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

        data.value = response.data
    } catch (error: any) {
        console.error('Error loading data:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }

        showErrorToast('Gagal Memuat Data', 'Gagal memuat detail data inklusi.')
        closeModal()
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

function formatDateTime(datetime: string) {
    if (!datetime) return '-'
    const d = new Date(datetime)
    // Add 7 hours for WIB timezone (UTC+7)
    d.setHours(d.getHours() + 7)
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    const day = d.getDate()
    const month = months[d.getMonth()]
    const year = d.getFullYear()
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    return `${day} ${month} ${year}, ${hours}:${minutes}`
}

function openFile(url: string) {
    window.open(url, '_blank')
}

function closeModal() {
    emit('update:modelValue', false)
    data.value = null
}
</script>

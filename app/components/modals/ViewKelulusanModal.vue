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
                    class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Detail Data Kelulusan</h2>
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
                        <p class="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Memuat detail data kelulusan...
                        </p>
                    </div>
                </div>

                <div v-else-if="kelulusan" class="p-3 sm:p-5 md:p-8 relative z-10 overflow-y-auto flex-1 space-y-6">
                    <!-- Kelulusan Info Card -->
                    <div
                        class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border-2 border-blue-200 p-3 sm:p-4 md:p-6">
                        <!-- Header with Nama and Status -->
                        <div class="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <div class="min-w-0 flex-1">
                                <h3 class="text-sm sm:text-lg md:text-xl font-bold text-gray-900 truncate">{{
                                    kelulusan.nama }}</h3>
                                <p class="text-xs sm:text-xs md:text-sm text-gray-600 mt-0.5 sm:mt-1">{{ kelulusan.nomor_peserta }}</p>
                            </div>
                            <div :class="[
                                'px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap flex-shrink-0',
                                kelulusan.lulus
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            ]">
                                <i :class="['fa-solid mr-1', kelulusan.lulus ? 'fa-check' : 'fa-times']"></i>
                                {{ kelulusan.lulus ? 'Lulus' : 'Tidak Lulus' }}
                            </div>
                        </div>

                        <!-- Kelulusan Meta Info -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                            <!-- NISN -->
                            <div class="flex items-center gap-2 sm:gap-2.5">
                                <div
                                    class="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-blue-200 flex items-center justify-center">
                                    <i class="fa-solid fa-id-card text-xs sm:text-sm text-blue-600"></i>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-[11px] sm:text-xs text-gray-600">NISN</p>
                                    <p class="text-[11px] sm:text-xs font-semibold text-gray-900 truncate">{{
                                        kelulusan.nisn || '-' }}</p>
                                </div>
                            </div>

                            <!-- Tanggal Lahir -->
                            <div class="flex items-center gap-2 sm:gap-2.5">
                                <div
                                    class="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-orange-200 flex items-center justify-center">
                                    <i class="fa-solid fa-calendar text-xs sm:text-sm text-orange-600"></i>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-[11px] sm:text-xs text-gray-600">Tanggal Lahir</p>
                                    <p class="text-[11px] sm:text-xs font-semibold text-gray-900 truncate">{{
                                        formatDate(kelulusan.tanggal_lahir) }}</p>
                                </div>
                            </div>

                            <!-- Rata-rata Nilai -->
                            <div class="flex items-center gap-2 sm:gap-2.5">
                                <div
                                    class="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-purple-200 flex items-center justify-center">
                                    <i class="fa-solid fa-chart-line text-xs sm:text-sm text-purple-600"></i>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-[11px] sm:text-xs text-gray-600">Rata-rata Nilai</p>
                                    <p class="text-[11px] sm:text-xs font-semibold text-gray-900 truncate">{{
                                        kelulusan.rata_rata_nilai?.toFixed(2) || '-' }}</p>
                                </div>
                            </div>

                            <!-- Created At -->
                            <div class="flex items-center gap-2 sm:gap-2.5">
                                <div
                                    class="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-green-200 flex items-center justify-center">
                                    <i class="fa-solid fa-clock text-xs sm:text-sm text-green-600"></i>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-[11px] sm:text-xs text-gray-600">Dibuat Pada</p>
                                    <p class="text-[11px] sm:text-xs font-semibold text-gray-900 truncate">{{
                                        formatDateTime(kelulusan.created_at) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Nilai Section -->
                    <div class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
                        <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                            <h3 class="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                                <i class="fa-solid fa-book w-3.5 sm:w-4 h-3.5 sm:h-4 text-blue-600 flex-shrink-0"></i>
                                Nilai Mata Pelajaran
                            </h3>
                        </div>
                        <div class="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                            <div class="space-y-3">
                                <div v-for="(nilai, mapel) in kelulusan.nilai" :key="mapel"
                                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <i class="fa-solid fa-graduation-cap text-sm text-blue-600"></i>
                                        </div>
                                        <span class="text-xs sm:text-sm font-semibold text-gray-900">{{ mapel }}</span>
                                    </div>
                                    <span class="text-xs sm:text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                                        {{ nilai }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- SKL Section -->
                    <div v-if="kelulusan.skl" class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
                        <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                            <h3 class="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                                <i class="fa-solid fa-file-pdf w-3.5 sm:w-4 h-3.5 sm:h-4 text-red-600 flex-shrink-0"></i>
                                Surat Keterangan Lulus (SKL)
                            </h3>
                        </div>
                        <div class="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div class="flex items-center gap-3 min-w-0 flex-1">
                                    <div class="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                                        <i class="fa-solid fa-file-pdf text-lg text-red-600"></i>
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <p class="text-xs sm:text-sm font-semibold text-gray-900 truncate">SKL</p>
                                        <p class="text-[11px] sm:text-xs text-gray-500">Dokumen Kelulusan</p>
                                    </div>
                                </div>
                                <a :href="kelulusan.skl" target="_blank" rel="noopener noreferrer"
                                    class="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors duration-200 cursor-pointer flex-shrink-0">
                                    <i class="fa-solid fa-download w-3 h-3"></i>
                                    <span class="hidden sm:inline">Lihat</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="p-4 sm:p-6 lg:p-8 flex items-center justify-center flex-1">
                    <div class="text-center">
                        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                            <i class="fa-solid fa-exclamation-triangle text-2xl text-red-600"></i>
                        </div>
                        <h3 class="text-base font-semibold text-gray-900 mb-1">Gagal Memuat Data</h3>
                        <p class="text-sm text-gray-600">{{ error }}</p>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getDataKelulusanById } from '~/services/kelulusan'

const props = defineProps<{
    modelValue: boolean
    kelulusanId: number
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>()

const isLoading = ref(false)
const kelulusan = ref<any>(null)
const error = ref('')

// Methods
const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const loadData = async () => {
    if (!props.kelulusanId) return

    isLoading.value = true
    error.value = ''
    kelulusan.value = null

    try {
        const response = await getDataKelulusanById({ id: props.kelulusanId })
        kelulusan.value = response.data
    } catch (err: any) {
        console.error('Error loading kelulusan detail:', err)
        error.value = err?.data?.error || err?.message || 'Gagal memuat detail data kelulusan'
    } finally {
        isLoading.value = false
    }
}

const closeModal = () => {
    if (!isLoading.value) {
        emit('update:modelValue', false)
    }
}

// Watch for modal open to load data
watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        loadData()
    } else {
        // Reset state when modal closes
        setTimeout(() => {
            kelulusan.value = null
            error.value = ''
        }, 300)
    }
})
</script>

<template>
    <!-- Backdrop -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="isOpen" @click="closeModal" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"></div>
    </Transition>

    <!-- Modal -->
    <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4">
        <div v-if="isOpen"
            class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div
                class="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-2xl w-full max-w-5xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]">

                <!-- Header with Blue Gradient Background -->
                <div
                    class="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <div class="absolute top-0 right-0 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl -z-0"></div>

                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Detail Monitoring Bulanan</h2>
                        <p class="text-xs sm:text-sm text-blue-100 mt-0.5">Informasi lengkap monitoring perkembangan siswa</p>
                    </div>

                    <button type="button" @click.stop="closeModal" :title="'Tutup'"
                        class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 backdrop-blur-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Body with padding and scrollbar -->
                <div class="p-4 sm:p-8 relative z-10 overflow-y-auto flex-1">
                    <!-- Loading State -->
                    <div v-if="isLoading" class="flex items-center justify-center py-12">
                        <div class="flex flex-col items-center gap-3">
                            <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                            <p class="text-sm text-gray-600 font-medium">Memuat data...</p>
                        </div>
                    </div>

                    <!-- Content -->
                    <div v-else-if="monitoringData" class="space-y-6">
                        <!-- Student Info Section -->
                        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                            <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md">
                                    <i class="fas fa-user text-white text-sm"></i>
                                </div>
                                Informasi Siswa
                            </h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div class="bg-white rounded-lg p-3 border border-blue-200">
                                    <label class="block text-xs font-semibold text-gray-600 mb-1">Nama Siswa</label>
                                    <p class="text-sm font-bold text-gray-900">{{ monitoringData.ppi_inklusi?.anak_inklusi_rombel?.anak_inklusi?.peserta_didik?.nama || '-' }}</p>
                                </div>
                                <div class="bg-white rounded-lg p-3 border border-blue-200">
                                    <label class="block text-xs font-semibold text-gray-600 mb-1">NISN</label>
                                    <p class="text-sm font-bold text-gray-900">{{ monitoringData.ppi_inklusi?.anak_inklusi_rombel?.anak_inklusi?.peserta_didik?.nisn || '-' }}</p>
                                </div>
                                <div class="bg-white rounded-lg p-3 border border-blue-200">
                                    <label class="block text-xs font-semibold text-gray-600 mb-1">Rombel</label>
                                    <p class="text-sm font-bold text-gray-900">{{ monitoringData.ppi_inklusi?.anak_inklusi_rombel?.peserta_didik_rombel?.rombel?.name || '-' }}</p>
                                </div>
                                <div class="bg-white rounded-lg p-3 border border-blue-200">
                                    <label class="block text-xs font-semibold text-gray-600 mb-1">Jenis Hambatan</label>
                                    <span class="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">
                                        {{ monitoringData.ppi_inklusi?.anak_inklusi_rombel?.anak_inklusi?.jenis_hambatan || '-' }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Monitoring Details -->
                        <div class="space-y-4">
                            <!-- Period Info -->
                            <div class="bg-white rounded-xl p-4 border-2 border-gray-200">
                                <label class="block text-xs font-semibold text-gray-600 mb-2">Periode Monitoring</label>
                                <p class="text-sm font-bold text-gray-900">{{ getMonthName(monitoringData.bulan) }} {{ monitoringData.tahun }}</p>
                            </div>

                            <!-- Perkembangan -->
                            <div class="bg-white rounded-xl p-4 border-2 border-gray-200">
                                <label class="block text-xs font-semibold text-gray-600 mb-2">Deskripsi Perkembangan</label>
                                <p class="text-sm text-gray-900 whitespace-pre-line">{{ monitoringData.deskripsi_perkembangan || '-' }}</p>
                            </div>

                            <!-- Kendala -->
                            <div class="bg-white rounded-xl p-4 border-2 border-gray-200">
                                <label class="block text-xs font-semibold text-gray-600 mb-2">Kendala yang Ditemui</label>
                                <p class="text-sm text-gray-900 whitespace-pre-line">{{ monitoringData.kendala_ditemui || '-' }}</p>
                            </div>

                            <!-- Tindak Lanjut -->
                            <div class="bg-white rounded-xl p-4 border-2 border-gray-200">
                                <label class="block text-xs font-semibold text-gray-600 mb-2">Tindak Lanjut</label>
                                <p class="text-sm text-gray-900 whitespace-pre-line">{{ monitoringData.tindak_lanjut || '-' }}</p>
                            </div>

                            <!-- Guru Pengisi -->
                            <div class="bg-white rounded-xl p-4 border-2 border-gray-200">
                                <label class="block text-xs font-semibold text-gray-600 mb-2">Guru Pengisi</label>
                                <p class="text-sm font-bold text-gray-900">{{ monitoringData.guru_pengisi?.nama || '-' }}</p>
                                <p class="text-xs text-gray-600 mt-1">{{ monitoringData.guru_pengisi?.jabatan || '-' }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Error State -->
                    <div v-else class="flex flex-col items-center justify-center py-12">
                        <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <i class="fas fa-exclamation-triangle text-3xl text-red-500"></i>
                        </div>
                        <h3 class="text-base font-semibold text-gray-900 mb-1">Gagal Memuat Data</h3>
                        <p class="text-sm text-gray-600">Data monitoring tidak ditemukan</p>
                    </div>
                </div>

                <!-- Footer Actions -->
                <div class="flex-shrink-0 px-4 sm:px-8 py-3 sm:py-4 bg-white border-t border-gray-200 flex justify-end">
                    <button type="button" @click="closeModal"
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
const monitoringData = ref<any>(null)

const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

function getMonthName(month: number) {
    return monthNames[month - 1] || month
}

watch(() => props.modelValue, (newVal) => {
    isOpen.value = newVal
    if (newVal && props.dataId) {
        loadData()
    }
})

watch(isOpen, (newVal) => {
    emit('update:modelValue', newVal)
    if (!newVal) {
        monitoringData.value = null
    }
})

async function loadData() {
    if (!props.dataId) return

    isLoading.value = true
    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const response = await $fetch<any>(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/get-monitoring-bulanan-by-id`,
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

        monitoringData.value = response.data
    } catch (error: any) {
        console.error('Error loading monitoring data:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }

        showErrorToast('Gagal Memuat Data', 'Gagal memuat detail monitoring bulanan.')
    } finally {
        isLoading.value = false
    }
}

function closeModal() {
    isOpen.value = false
}
</script>

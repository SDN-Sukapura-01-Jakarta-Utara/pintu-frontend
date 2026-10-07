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
                        <h2 class="text-lg sm:text-xl font-bold text-white">Detail Program Pembelajaran Individu (PPI)</h2>
                        <p class="text-xs sm:text-sm text-red-100 mt-0.5">Informasi lengkap PPI siswa</p>
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
                        <!-- Informasi Umum -->
                        <div class="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200">
                            <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-gray-200">
                                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                                    <i class="fas fa-info-circle text-white text-lg"></i>
                                </div>
                                Informasi Umum
                            </h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <label class="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                                        <i class="fas fa-calendar-alt"></i>
                                        Tahun Pelajaran
                                    </label>
                                    <p class="text-sm font-bold text-gray-900">{{ detailData.tahun_pelajaran?.tahun_pelajaran || '-' }}</p>
                                </div>
                                <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <label class="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                                        <i class="fas fa-brain"></i>
                                        Aspek Pembelajaran
                                    </label>
                                    <span :class="[
                                        'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold shadow-md border-l-4',
                                        detailData.aspek_pembelajaran === 'Kognitif' ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-600' :
                                        detailData.aspek_pembelajaran === 'Bahasa & Komunikasi' ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-600' :
                                        detailData.aspek_pembelajaran === 'Motorik' ? 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-600' :
                                        detailData.aspek_pembelajaran === 'Sensori/Persepsi' ? 'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800 border-pink-600' :
                                        detailData.aspek_pembelajaran === 'Sosial & Emosional' ? 'bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800 border-teal-600' :
                                        detailData.aspek_pembelajaran === 'Bina Diri/Kemandirian' ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-600' :
                                        detailData.aspek_pembelajaran === 'Perilaku Adaptif' ? 'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border-indigo-600' :
                                        'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-600'
                                    ]">
                                        <i :class="[
                                            'fas text-sm',
                                            detailData.aspek_pembelajaran === 'Kognitif' ? 'fa-brain' :
                                            detailData.aspek_pembelajaran === 'Bahasa & Komunikasi' ? 'fa-comments' :
                                            detailData.aspek_pembelajaran === 'Motorik' ? 'fa-running' :
                                            detailData.aspek_pembelajaran === 'Sensori/Persepsi' ? 'fa-eye' :
                                            detailData.aspek_pembelajaran === 'Sosial & Emosional' ? 'fa-heart' :
                                            detailData.aspek_pembelajaran === 'Bina Diri/Kemandirian' ? 'fa-user-check' :
                                            detailData.aspek_pembelajaran === 'Perilaku Adaptif' ? 'fa-sync-alt' : 'fa-question'
                                        ]"></i>
                                        {{ detailData.aspek_pembelajaran || '-' }}
                                    </span>
                                </div>
                                <div class="bg-gray-50 rounded-lg p-4 border border-gray-200 sm:col-span-2">
                                    <label class="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                                        <i class="fas fa-chart-line"></i>
                                        Status Capaian
                                    </label>
                                    <span :class="[
                                        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm',
                                        detailData.status_capaian === 'Selesai' || detailData.status_capaian === 'Tercapai'
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                            : detailData.status_capaian === 'Sedang Berlangsung'
                                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                                            : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                                    ]">
                                        <i :class="[
                                            'fas',
                                            detailData.status_capaian === 'Selesai' || detailData.status_capaian === 'Tercapai' ? 'fa-check-circle' :
                                            detailData.status_capaian === 'Sedang Berlangsung' ? 'fa-spinner' : 'fa-clock'
                                        ]"></i>
                                        {{ detailData.status_capaian || 'Belum Dimulai' }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Data Peserta Didik -->
                        <div class="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200">
                            <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-gray-200">
                                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                                    <i class="fas fa-user-circle text-white text-lg"></i>
                                </div>
                                Data Peserta Didik
                            </h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                                        <i class="fas fa-user text-xs"></i>
                                        Nama Lengkap
                                    </label>
                                    <p class="text-sm font-bold text-gray-900">{{ detailData.anak_inklusi_rombel?.anak_inklusi?.peserta_didik?.nama || '-' }}</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                                        <i class="fas fa-id-card text-xs"></i>
                                        NIS
                                    </label>
                                    <p class="text-sm font-bold text-gray-900">{{ detailData.anak_inklusi_rombel?.anak_inklusi?.peserta_didik?.nis || '-' }}</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                                        <i class="fas fa-id-badge text-xs"></i>
                                        NISN
                                    </label>
                                    <p class="text-sm font-bold text-gray-900">{{ detailData.anak_inklusi_rombel?.anak_inklusi?.peserta_didik?.nisn || '-' }}</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                                        <i class="fas fa-users-rectangle text-xs"></i>
                                        Rombel
                                    </label>
                                    <p class="text-sm font-bold text-gray-900">{{ detailData.anak_inklusi_rombel?.peserta_didik_rombel?.rombel?.name || '-' }}</p>
                                </div>
                                <div class="sm:col-span-2 bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                                    <label class="block text-xs font-semibold text-orange-700 mb-1 flex items-center gap-1">
                                        <i class="fas fa-heart text-xs"></i>
                                        Jenis Hambatan
                                    </label>
                                    <p class="text-sm font-bold text-gray-900">{{ detailData.anak_inklusi_rombel?.anak_inklusi?.jenis_hambatan || '-' }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Detail Program -->
                        <div class="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200">
                            <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-gray-200">
                                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                                    <i class="fas fa-book text-white text-lg"></i>
                                </div>
                                Detail Program
                            </h3>
                            <div class="space-y-4">
                                <div class="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
                                    <label class="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                        <i class="fas fa-heading text-xs"></i>
                                        Nama Program
                                    </label>
                                    <p class="text-sm font-bold text-gray-900">{{ detailData.nama_program || '-' }}</p>
                                </div>
                                <div class="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
                                    <label class="block text-xs font-semibold text-indigo-700 mb-2 flex items-center gap-1">
                                        <i class="fas fa-clock text-xs"></i>
                                        Target Waktu
                                    </label>
                                    <p class="text-sm font-bold text-gray-900">{{ detailData.target_waktu || '-' }}</p>
                                </div>
                                <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                    <label class="block text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1">
                                        <i class="fas fa-bullseye text-xs"></i>
                                        Tujuan Pembelajaran
                                    </label>
                                    <div class="text-sm text-gray-900 leading-relaxed whitespace-pre-line">{{ detailData.tujuan_pembelajaran || '-' }}</div>
                                </div>
                                <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                                    <label class="block text-xs font-semibold text-green-700 mb-2 flex items-center gap-1">
                                        <i class="fas fa-lightbulb text-xs"></i>
                                        Strategi Pembelajaran
                                    </label>
                                    <div class="text-sm text-gray-900 leading-relaxed whitespace-pre-line">{{ detailData.strategi_pembelajaran || '-' }}</div>
                                </div>
                                <div v-if="detailData.capaian_saat_ini" class="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                                    <label class="block text-xs font-semibold text-purple-700 mb-2 flex items-center gap-1">
                                        <i class="fas fa-trophy text-xs"></i>
                                        Capaian Saat Ini
                                    </label>
                                    <div class="text-sm text-gray-900 leading-relaxed whitespace-pre-line">{{ detailData.capaian_saat_ini }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Guru Pembuat -->
                        <div class="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200">
                            <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-gray-200">
                                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                                    <i class="fas fa-chalkboard-teacher text-white text-lg"></i>
                                </div>
                                Guru Pembuat
                            </h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                                        <i class="fas fa-user text-xs"></i>
                                        Nama
                                    </label>
                                    <p class="text-sm font-bold text-gray-900">{{ detailData.guru_pembuat?.nama || '-' }}</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                                        <i class="fas fa-id-card text-xs"></i>
                                        NIP
                                    </label>
                                    <p class="text-sm font-bold text-gray-900">{{ detailData.guru_pembuat?.nip || '-' }}</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                                        <i class="fas fa-tag text-xs"></i>
                                        Kategori
                                    </label>
                                    <p class="text-sm font-bold text-gray-900">{{ detailData.guru_pembuat?.kategori || '-' }}</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                                        <i class="fas fa-briefcase text-xs"></i>
                                        Jabatan
                                    </label>
                                    <p class="text-sm font-bold text-gray-900">{{ detailData.guru_pembuat?.jabatan || '-' }}</p>
                                </div>
                            </div>
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
            `${config.public.apiBase}/api/v1/monitoring-inklusi/get-ppi-by-id`,
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

        showErrorToast('Gagal Memuat Data', 'Gagal memuat detail PPI.')
        handleClose()
    } finally {
        isLoading.value = false
    }
}
</script>

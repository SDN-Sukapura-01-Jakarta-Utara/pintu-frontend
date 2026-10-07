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

                <!-- Header with Orange Gradient Background -->
                <div
                    class="bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <div class="absolute top-0 right-0 w-40 h-40 bg-orange-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl -z-0"></div>

                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Edit Laporan Monitoring Bulanan</h2>
                        <p class="text-xs sm:text-sm text-orange-100 mt-0.5">Perbarui data monitoring perkembangan siswa</p>
                    </div>

                    <button type="button" @click.stop="closeModal" :disabled="isSaving" :title="'Tutup'"
                        class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 disabled:opacity-50 backdrop-blur-sm cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50">
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
                            <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-orange-600"></div>
                            <p class="text-sm text-gray-600 font-medium">Memuat data...</p>
                        </div>
                    </div>

                    <!-- Form -->
                    <form v-else-if="formData" @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
                        <!-- Student Info (Read-only) -->
                        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                            <h3 class="text-sm font-bold text-gray-900 mb-3">Informasi Siswa</h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div class="bg-white rounded-lg p-2 border border-blue-200">
                                    <span class="text-gray-600">Nama:</span>
                                    <span class="font-bold text-gray-900 ml-1">{{ studentInfo?.nama || '-' }}</span>
                                </div>
                                <div class="bg-white rounded-lg p-2 border border-blue-200">
                                    <span class="text-gray-600">NISN:</span>
                                    <span class="font-bold text-gray-900 ml-1">{{ studentInfo?.nisn || '-' }}</span>
                                </div>
                                <div class="bg-white rounded-lg p-2 border border-blue-200">
                                    <span class="text-gray-600">Rombel:</span>
                                    <span class="font-bold text-gray-900 ml-1">{{ studentInfo?.rombel || '-' }}</span>
                                </div>
                                <div class="bg-white rounded-lg p-2 border border-blue-200">
                                    <span class="text-gray-600">Jenis Hambatan:</span>
                                    <span class="font-bold text-orange-800 ml-1">{{ studentInfo?.jenis_hambatan || '-' }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Period Info -->
                        <div class="bg-white rounded-xl p-4 border-2 border-gray-200">
                            <label class="block text-xs font-semibold text-gray-600 mb-2">Periode Monitoring</label>
                            <p class="text-sm font-bold text-gray-900">Bulan {{ formData.bulan }} Tahun {{ formData.tahun }}</p>
                        </div>

                        <!-- Deskripsi Perkembangan -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Deskripsi Perkembangan <span class="text-red-600 ml-1">*</span>
                            </label>
                            <textarea v-model="formData.deskripsi_perkembangan" rows="4" :disabled="isSaving"
                                placeholder="Jelaskan perkembangan yang terjadi pada siswa..."
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100 disabled:opacity-50 disabled:cursor-not-allowed resize-none"></textarea>
                        </div>

                        <!-- Kendala yang Ditemui -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Kendala yang Ditemui <span class="text-red-600 ml-1">*</span>
                            </label>
                            <textarea v-model="formData.kendala_ditemui" rows="4" :disabled="isSaving"
                                placeholder="Jelaskan kendala yang ditemui selama monitoring..."
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100 disabled:opacity-50 disabled:cursor-not-allowed resize-none"></textarea>
                        </div>

                        <!-- Tindak Lanjut -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Tindak Lanjut <span class="text-red-600 ml-1">*</span>
                            </label>
                            <textarea v-model="formData.tindak_lanjut" rows="4" :disabled="isSaving"
                                placeholder="Jelaskan rencana tindak lanjut..."
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100 disabled:opacity-50 disabled:cursor-not-allowed resize-none"></textarea>
                        </div>

                        <!-- Guru Pengisi -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Guru Pengisi <span class="text-red-600 ml-1">*</span>
                            </label>
                            <select v-model="formData.guru_pengisi_id" :disabled="isSaving"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-orange-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <option value="">Pilih Guru Pengisi</option>
                                <option v-for="guru in guruList" :key="guru.id" :value="guru.id">
                                    {{ guru.nama }} - {{ guru.jabatan }}
                                </option>
                            </select>
                        </div>
                    </form>
                </div>

                <!-- Footer Actions -->
                <div class="flex-shrink-0 px-4 sm:px-8 py-3 sm:py-4 bg-white border-t border-gray-200 flex justify-end gap-2 sm:gap-3">
                    <button type="button" @click="closeModal" :disabled="isSaving"
                        class="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-semibold text-xs sm:text-sm hover:bg-gray-50 active:bg-gray-100 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        Batal
                    </button>
                    <button type="button" @click="handleSubmit" :disabled="isSaving || !isFormValid"
                        class="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 active:from-orange-800 active:to-yellow-800 text-white font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer">
                        <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <i v-else class="fas fa-save"></i>
                        <span>{{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useToast } from '~/composables/useToast'
import { useAuthGuard } from '~/composables/useAuthGuard'

const props = defineProps<{
    modelValue: boolean
    dataId: number | null
    guruList: any[]
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'success': []
}>()

const { success: showToast, error: showErrorToast } = useToast()
const { handle401 } = useAuthGuard()

const isOpen = ref(props.modelValue)
const isLoading = ref(false)
const isSaving = ref(false)
const studentInfo = ref<any>(null)

const formData = ref<any>(null)

watch(() => props.modelValue, (newVal) => {
    isOpen.value = newVal
    if (newVal && props.dataId) {
        loadData()
    }
})

watch(isOpen, (newVal) => {
    emit('update:modelValue', newVal)
    if (!newVal) {
        formData.value = null
        studentInfo.value = null
    }
})

const isFormValid = computed(() => {
    if (!formData.value) return false
    return formData.value.deskripsi_perkembangan &&
           formData.value.kendala_ditemui &&
           formData.value.tindak_lanjut &&
           formData.value.guru_pengisi_id
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

        const data = response.data
        formData.value = {
            id: data.id,
            bulan: data.bulan,
            tahun: data.tahun,
            deskripsi_perkembangan: data.deskripsi_perkembangan || '',
            kendala_ditemui: data.kendala_ditemui || '',
            tindak_lanjut: data.tindak_lanjut || '',
            guru_pengisi_id: data.guru_pengisi_id || ''
        }

        studentInfo.value = {
            nama: data.ppi_inklusi?.anak_inklusi_rombel?.anak_inklusi?.peserta_didik?.nama || '-',
            nisn: data.ppi_inklusi?.anak_inklusi_rombel?.anak_inklusi?.peserta_didik?.nisn || '-',
            rombel: data.ppi_inklusi?.anak_inklusi_rombel?.peserta_didik_rombel?.rombel?.name || '-',
            jenis_hambatan: data.ppi_inklusi?.anak_inklusi_rombel?.anak_inklusi?.jenis_hambatan || '-'
        }
    } catch (error: any) {
        console.error('Error loading monitoring data:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }

        showErrorToast('Gagal Memuat Data', 'Gagal memuat data monitoring bulanan.')
        isOpen.value = false
    } finally {
        isLoading.value = false
    }
}

async function handleSubmit() {
    if (!isFormValid.value || isSaving.value || !formData.value) return

    isSaving.value = true

    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const bodyData = {
            id: formData.value.id,
            deskripsi_perkembangan: formData.value.deskripsi_perkembangan,
            kendala_ditemui: formData.value.kendala_ditemui,
            tindak_lanjut: formData.value.tindak_lanjut,
            guru_pengisi_id: typeof formData.value.guru_pengisi_id === 'string'
                ? parseInt(formData.value.guru_pengisi_id)
                : formData.value.guru_pengisi_id
        }

        await $fetch<any>(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/update-monitoring-bulanan`,
            {
                method: 'POST',
                body: bodyData,
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }
        )

        showToast('Berhasil', 'Laporan monitoring bulanan berhasil diperbarui')
        emit('success')
        isOpen.value = false
    } catch (error: any) {
        console.error('Error updating monitoring bulanan:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }

        const errorMessage = error.data?.message || 'Gagal memperbarui laporan monitoring bulanan.'
        showErrorToast('Gagal Menyimpan', errorMessage)
    } finally {
        isSaving.value = false
    }
}

function closeModal() {
    if (!isSaving.value) {
        isOpen.value = false
    }
}
</script>

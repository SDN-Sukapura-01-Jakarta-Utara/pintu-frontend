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

                <!-- Header with Red Gradient Background -->
                <div
                    class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <!-- Animated gradient blobs -->
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

                    <!-- Header Content -->
                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Edit Data PPI</h2>
                        <p class="text-xs sm:text-sm text-red-100 mt-0.5">Perbarui program pembelajaran individu</p>
                    </div>

                    <!-- Close Button -->
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
                            <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
                            <p class="text-sm text-gray-600 font-medium">Memuat data...</p>
                        </div>
                    </div>

                    <!-- Form -->
                    <form v-else @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
                        <!-- Informasi Peserta Didik -->
                        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border-2 border-blue-200">
                            <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md">
                                    <i class="fas fa-user-graduate text-white text-sm"></i>
                                </div>
                                Informasi Peserta Didik
                            </h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div class="bg-white rounded-lg p-3 border border-blue-200">
                                    <label class="block text-xs font-semibold text-gray-600 mb-1">Nama Lengkap</label>
                                    <p class="text-sm font-bold text-gray-900">{{ studentInfo.nama || '-' }}</p>
                                </div>
                                <div class="bg-white rounded-lg p-3 border border-blue-200">
                                    <label class="block text-xs font-semibold text-gray-600 mb-1">NISN</label>
                                    <p class="text-sm font-bold text-gray-900">{{ studentInfo.nisn || '-' }}</p>
                                </div>
                                <div class="bg-white rounded-lg p-3 border border-blue-200">
                                    <label class="block text-xs font-semibold text-gray-600 mb-1">Rombel</label>
                                    <p class="text-sm font-bold text-gray-900">{{ studentInfo.rombel || '-' }}</p>
                                </div>
                                <div class="bg-white rounded-lg p-3 border border-blue-200">
                                    <label class="block text-xs font-semibold text-gray-600 mb-1">Jenis Hambatan</label>
                                    <p class="text-sm font-bold text-gray-900">{{ studentInfo.jenis_hambatan || '-' }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Aspek Pembelajaran -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Aspek Pembelajaran <span class="text-red-600 ml-1">*</span>
                            </label>
                            <select v-model="formData.aspek_pembelajaran" :disabled="isSaving"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <option value="">Pilih Aspek Pembelajaran</option>
                                <option value="Kognitif">Kognitif</option>
                                <option value="Bahasa & Komunikasi">Bahasa & Komunikasi</option>
                                <option value="Motorik">Motorik</option>
                                <option value="Sensori/Persepsi">Sensori/Persepsi</option>
                                <option value="Sosial & Emosional">Sosial & Emosional</option>
                                <option value="Bina Diri/Kemandirian">Bina Diri/Kemandirian</option>
                                <option value="Perilaku Adaptif">Perilaku Adaptif</option>
                            </select>
                        </div>

                        <!-- Nama Program -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Nama Program <span class="text-red-600 ml-1">*</span>
                            </label>
                            <input v-model="formData.nama_program" type="text" :disabled="isSaving"
                                placeholder="Masukkan nama program..."
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>

                        <!-- Tujuan Pembelajaran -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Tujuan Pembelajaran <span class="text-red-600 ml-1">*</span>
                            </label>
                            <textarea v-model="formData.tujuan_pembelajaran" rows="4" :disabled="isSaving"
                                placeholder="Masukkan tujuan pembelajaran..."
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed resize-none"></textarea>
                        </div>

                        <!-- Strategi Pembelajaran -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Strategi Pembelajaran <span class="text-red-600 ml-1">*</span>
                            </label>
                            <textarea v-model="formData.strategi_pembelajaran" rows="4" :disabled="isSaving"
                                placeholder="Masukkan strategi pembelajaran..."
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed resize-none"></textarea>
                        </div>

                        <!-- Target Waktu -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Target Waktu <span class="text-red-600 ml-1">*</span>
                            </label>
                            <select v-model="formData.target_waktu" :disabled="isSaving"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <option value="">Pilih Target Waktu</option>
                                <option value="Semester 1">Semester 1</option>
                                <option value="Semester 2">Semester 2</option>
                                <option value="1 Bulan">1 Bulan</option>
                                <option value="2 Bulan">2 Bulan</option>
                                <option value="3 Bulan">3 Bulan</option>
                                <option value="4 Bulan">4 Bulan</option>
                                <option value="5 Bulan">5 Bulan</option>
                            </select>
                        </div>

                        <!-- Guru Pembuat -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Guru Pembuat <span class="text-red-600 ml-1">*</span>
                            </label>
                            <select v-model="formData.guru_pembuat_id" :disabled="isSaving"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <option value="">Pilih Guru Pembuat</option>
                                <option v-for="guru in guruList" :key="guru.id" :value="guru.id">
                                    {{ guru.nama }} - {{ guru.jabatan }}
                                </option>
                            </select>
                        </div>

                        <!-- Status Capaian -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Status Capaian <span class="text-red-600 ml-1">*</span>
                            </label>
                            <select v-model="formData.status_capaian" :disabled="isSaving"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <option value="">Pilih Status Capaian</option>
                                <option value="Belum Dimulai">Belum Dimulai</option>
                                <option value="Sedang Berlangsung">Sedang Berlangsung</option>
                                <option value="Selesai">Selesai</option>
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
                        class="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 active:from-red-800 active:to-pink-800 text-white font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer">
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
const isSaving = ref(false)
const isLoading = ref(false)

const studentInfo = ref({
    nama: '',
    nisn: '',
    rombel: '',
    jenis_hambatan: ''
})

const formData = ref({
    id: null as number | null,
    aspek_pembelajaran: '',
    nama_program: '',
    tujuan_pembelajaran: '',
    strategi_pembelajaran: '',
    target_waktu: '',
    guru_pembuat_id: '' as string | number,
    status_capaian: ''
})

watch(() => props.modelValue, (newVal) => {
    isOpen.value = newVal
    if (newVal && props.dataId) {
        loadData()
    }
})

watch(isOpen, (newVal) => {
    emit('update:modelValue', newVal)
})

const isFormValid = computed(() => {
    return formData.value.aspek_pembelajaran &&
           formData.value.nama_program &&
           formData.value.tujuan_pembelajaran &&
           formData.value.strategi_pembelajaran &&
           formData.value.target_waktu &&
           formData.value.guru_pembuat_id &&
           formData.value.status_capaian
})

function resetForm() {
    formData.value = {
        id: null,
        aspek_pembelajaran: '',
        nama_program: '',
        tujuan_pembelajaran: '',
        strategi_pembelajaran: '',
        target_waktu: '',
        guru_pembuat_id: '',
        status_capaian: ''
    }
    studentInfo.value = {
        nama: '',
        nisn: '',
        rombel: '',
        jenis_hambatan: ''
    }
    isSaving.value = false
}

function closeModal() {
    if (!isSaving.value) {
        isOpen.value = false
    }
}

async function loadData() {
    if (!props.dataId) return

    isLoading.value = true
    resetForm()

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

        const data = response.data

        // Set student info
        studentInfo.value = {
            nama: data.anak_inklusi_rombel?.anak_inklusi?.peserta_didik?.nama || '-',
            nisn: data.anak_inklusi_rombel?.anak_inklusi?.peserta_didik?.nisn || '-',
            rombel: data.anak_inklusi_rombel?.peserta_didik_rombel?.rombel?.name || '-',
            jenis_hambatan: data.anak_inklusi_rombel?.anak_inklusi?.jenis_hambatan || '-'
        }

        // Set form data
        formData.value = {
            id: data.id,
            aspek_pembelajaran: data.aspek_pembelajaran || '',
            nama_program: data.nama_program || '',
            tujuan_pembelajaran: data.tujuan_pembelajaran || '',
            strategi_pembelajaran: data.strategi_pembelajaran || '',
            target_waktu: data.target_waktu || '',
            guru_pembuat_id: data.guru_pembuat_id || '',
            status_capaian: data.status_capaian || ''
        }
    } catch (error: any) {
        console.error('Error loading data:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }

        showErrorToast('Gagal Memuat Data', 'Gagal memuat data PPI.')
        closeModal()
    } finally {
        isLoading.value = false
    }
}

async function handleSubmit() {
    if (!isFormValid.value || isSaving.value) return

    // Validation
    if (!formData.value.aspek_pembelajaran) {
        showErrorToast('Validasi Error', 'Aspek Pembelajaran harus dipilih.')
        return
    }

    if (!formData.value.nama_program) {
        showErrorToast('Validasi Error', 'Nama Program harus diisi.')
        return
    }

    if (!formData.value.tujuan_pembelajaran) {
        showErrorToast('Validasi Error', 'Tujuan Pembelajaran harus diisi.')
        return
    }

    if (!formData.value.strategi_pembelajaran) {
        showErrorToast('Validasi Error', 'Strategi Pembelajaran harus diisi.')
        return
    }

    if (!formData.value.target_waktu) {
        showErrorToast('Validasi Error', 'Target Waktu harus diisi.')
        return
    }

    if (!formData.value.guru_pembuat_id) {
        showErrorToast('Validasi Error', 'Guru Pembuat harus dipilih.')
        return
    }

    if (!formData.value.status_capaian) {
        showErrorToast('Validasi Error', 'Status Capaian harus dipilih.')
        return
    }

    isSaving.value = true

    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const requestBody = {
            id: formData.value.id,
            aspek_pembelajaran: formData.value.aspek_pembelajaran,
            nama_program: formData.value.nama_program,
            tujuan_pembelajaran: formData.value.tujuan_pembelajaran,
            strategi_pembelajaran: formData.value.strategi_pembelajaran,
            target_waktu: formData.value.target_waktu,
            guru_pembuat_id: typeof formData.value.guru_pembuat_id === 'string'
                ? parseInt(formData.value.guru_pembuat_id)
                : formData.value.guru_pembuat_id,
            status_capaian: formData.value.status_capaian
        }

        await $fetch<any>(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/update-ppi`,
            {
                method: 'POST',
                body: requestBody,
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }
        )

        showToast('Berhasil', 'Data PPI berhasil diperbarui')
        emit('success')
        isOpen.value = false
    } catch (error: any) {
        console.error('Error updating PPI:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }

        const errorMessage = error.data?.message || 'Gagal memperbarui data PPI.'
        showErrorToast('Gagal Menyimpan', errorMessage)
    } finally {
        isSaving.value = false
    }
}
</script>

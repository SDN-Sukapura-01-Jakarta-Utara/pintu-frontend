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
                class="bg-white rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">

                <!-- Header -->
                <div
                    class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Generate Barcode Siswa</h2>
                        <p class="text-xs sm:text-sm text-red-100 mt-0.5">Generate barcode untuk peserta didik</p>
                    </div>

                    <button type="button" @click.stop="closeModal" :disabled="isSubmitting"
                        class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 disabled:opacity-50 backdrop-blur-sm cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Body -->
                <div class="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
                    <!-- Error Alert -->
                    <div v-if="formError" class="bg-red-50 rounded-xl border-2 border-red-200 p-4 sm:p-5">
                        <div class="flex items-start gap-3">
                            <i class="fa-solid fa-circle-exclamation text-red-500 mt-0.5 text-lg"></i>
                            <p class="text-sm text-red-700 font-medium">{{ formError }}</p>
                        </div>
                    </div>

                    <!-- Generate Type Selection -->
                    <div>
                        <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-3">
                            Pilih Jenis Generate
                        </label>
                        <div class="grid grid-cols-2 gap-3">
                            <label class="flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all"
                                :class="generateType === 'all' ? 'border-red-600 bg-red-50' : 'border-gray-300 hover:border-gray-400'">
                                <input type="radio" v-model="generateType" value="all" class="sr-only">
                                <div class="flex items-center gap-2">
                                    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                                        :class="generateType === 'all' ? 'border-red-600' : 'border-gray-300'">
                                        <div v-if="generateType === 'all'" class="w-3 h-3 rounded-full bg-red-600"></div>
                                    </div>
                                    <span class="text-sm font-medium text-gray-900">Semua Rombel</span>
                                </div>
                            </label>
                            <label class="flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all"
                                :class="generateType === 'specific' ? 'border-red-600 bg-red-50' : 'border-gray-300 hover:border-gray-400'">
                                <input type="radio" v-model="generateType" value="specific" class="sr-only">
                                <div class="flex items-center gap-2">
                                    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                                        :class="generateType === 'specific' ? 'border-red-600' : 'border-gray-300'">
                                        <div v-if="generateType === 'specific'" class="w-3 h-3 rounded-full bg-red-600"></div>
                                    </div>
                                    <span class="text-sm font-medium text-gray-900">Rombel Tertentu</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- Generate All Rombel Form -->
                    <div v-if="generateType === 'all'">
                        <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                            Tahun Pelajaran <span class="text-red-600">*</span>
                        </label>
                        <select v-model.number="form.tahun_pelajaran_id" :disabled="isSubmitting || tahunLoading"
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                            <option :value="0" disabled>Pilih Tahun Pelajaran</option>
                            <option v-for="tahun in tahunPelajaranList" :key="tahun.id" :value="tahun.id">
                                {{ tahun.tahun_pelajaran }}
                            </option>
                        </select>
                    </div>

                    <!-- Generate Specific Rombel Form -->
                    <div v-if="generateType === 'specific'" class="space-y-4">
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Tahun Pelajaran <span class="text-red-600">*</span>
                            </label>
                            <select v-model.number="form.tahun_pelajaran_id" :disabled="isSubmitting || tahunLoading"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                <option :value="0" disabled>Pilih Tahun Pelajaran</option>
                                <option v-for="tahun in activeTahunPelajaranList" :key="tahun.id" :value="tahun.id">
                                    {{ tahun.tahun_pelajaran }}
                                </option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Rombel <span class="text-red-600">*</span>
                            </label>
                            <select v-model.number="form.rombel_id" :disabled="isSubmitting || rombelLoading"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                <option :value="0" disabled>Pilih Rombel</option>
                                <option v-for="rombel in activeRombelList" :key="rombel.id" :value="rombel.id">
                                    {{ rombel.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0 flex items-center justify-end gap-3">
                    <button @click="closeModal" :disabled="isSubmitting"
                        class="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        Batal
                    </button>
                    <button @click="handleSubmit" :disabled="isSubmitting"
                        class="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2">
                        <i v-if="isSubmitting" class="fa-solid fa-spinner fa-spin w-3.5 h-3.5"></i>
                        <i v-else class="fa-solid fa-barcode w-3.5 h-3.5"></i>
                        {{ isSubmitting ? 'Memproses...' : 'Generate Barcode' }}
                    </button>
                </div>
            </div>
        </div>
    </Transition>

    <!-- Confirmation Modal -->
    <ConfirmationDeleteModal v-model="showConfirmation" title="Konfirmasi Generate Barcode"
        :message="confirmationMessage" :is-loading="isSubmitting" confirm-text="Ya, Generate"
        loading-text="Memproses..." @confirm="confirmGenerate" />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTahunPelajaranStore } from '~/stores/TahunPelajaranStore'
import { useRombelStore } from '~/stores/RombelStore'
import { useToastStore } from '~/stores/ToastStore'
import { generateBarcodeByTahunPelajaran, generateBarcodeByTahunPelajaranAndRombel } from '~/services/peserta-didik'
import ConfirmationDeleteModal from './ConfirmationDeleteModal.vue'

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'success'): void
}>()

const tahunPelajaranStore = useTahunPelajaranStore()
const rombelStore = useRombelStore()
const toastStore = useToastStore()

const generateType = ref<'all' | 'specific'>('all')
const form = ref({
    tahun_pelajaran_id: 0,
    rombel_id: 0
})

const isSubmitting = ref(false)
const formError = ref('')
const showConfirmation = ref(false)
const tahunLoading = ref(false)
const rombelLoading = ref(false)

const tahunPelajaranList = ref<any[]>([])
const rombelList = ref<any[]>([])

// Computed
const activeTahunPelajaranList = computed(() => {
    return tahunPelajaranList.value.filter((t: any) => t.status === 'active')
})

const activeRombelList = computed(() => {
    return rombelList.value.filter((r: any) => r.status === 'active')
})

const confirmationMessage = computed(() => {
    if (generateType.value === 'all') {
        return 'Apakah Anda yakin ingin generate barcode untuk semua rombel? Barcode yang sudah ada akan di-generate ulang.'
    } else {
        const selectedRombel = activeRombelList.value.find((r: any) => r.id === form.value.rombel_id)
        return `Apakah Anda yakin ingin generate barcode untuk rombel ${selectedRombel?.name || ''}? Barcode yang sudah ada akan di-generate ulang.`
    }
})

// Methods
const loadTahunPelajaran = async () => {
    tahunLoading.value = true
    try {
        const result = await tahunPelajaranStore.fetchTahunPelajarans(1, 100)
        if (result.success) {
            tahunPelajaranList.value = tahunPelajaranStore.tahunPelajarans
            // Set default to active tahun pelajaran
            const activeTahun = tahunPelajaranList.value.find((t: any) => t.status === 'active')
            if (activeTahun) {
                form.value.tahun_pelajaran_id = activeTahun.id
            }
        }
    } catch (err) {
        console.error('Error loading tahun pelajaran:', err)
    } finally {
        tahunLoading.value = false
    }
}

const loadRombel = async () => {
    rombelLoading.value = true
    try {
        const result = await rombelStore.fetchRombels(1, 100, { status: 'active' })
        if (result.success) {
            rombelList.value = rombelStore.rombels
        }
    } catch (err) {
        console.error('Error loading rombel:', err)
    } finally {
        rombelLoading.value = false
    }
}

const validateForm = (): boolean => {
    formError.value = ''

    if (!form.value.tahun_pelajaran_id) {
        formError.value = 'Tahun pelajaran harus dipilih'
        return false
    }

    if (generateType.value === 'specific' && !form.value.rombel_id) {
        formError.value = 'Rombel harus dipilih'
        return false
    }

    return true
}

const handleSubmit = () => {
    if (!validateForm()) return
    showConfirmation.value = true
}

const confirmGenerate = async () => {
    isSubmitting.value = true
    formError.value = ''

    try {
        let response

        if (generateType.value === 'all') {
            response = await generateBarcodeByTahunPelajaran(form.value.tahun_pelajaran_id)
        } else {
            response = await generateBarcodeByTahunPelajaranAndRombel(
                form.value.tahun_pelajaran_id,
                form.value.rombel_id
            )
        }

        if (response.data) {
            toastStore.success('Sukses', response.data.message)
            showConfirmation.value = false
            isSubmitting.value = false
            emit('success')
            emit('update:modelValue', false)
            resetForm()
        }
    } catch (err: any) {
        console.error('Error generating barcode:', err)
        formError.value = err.response?.data?.message || 'Gagal generate barcode'
        toastStore.error('Gagal', formError.value)
        isSubmitting.value = false
        showConfirmation.value = false
    }
}

const closeModal = () => {
    if (isSubmitting.value) return
    resetForm()
    emit('update:modelValue', false)
}

const resetForm = () => {
    generateType.value = 'all'
    const activeTahun = tahunPelajaranList.value.find((t: any) => t.status === 'active')
    form.value = {
        tahun_pelajaran_id: activeTahun?.id || 0,
        rombel_id: 0
    }
    formError.value = ''
}

// Watch modal open
watch(() => props.modelValue, async (newVal) => {
    if (newVal) {
        await Promise.all([loadTahunPelajaran(), loadRombel()])
        resetForm()
    }
})
</script>

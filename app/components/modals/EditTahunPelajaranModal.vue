<template>
    <!-- Confirmation Dialog -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="showConfirmation" @click="handleConfirmationNo"
            class="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"></div>
    </Transition>

    <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4">
        <div v-if="showConfirmation"
            class="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm pointer-events-auto overflow-hidden">

                <!-- Header -->
                <div class="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4 flex items-center gap-4">
                    <div class="text-2xl sm:text-3xl text-white">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <h2 class="text-lg sm:text-xl font-bold text-white flex-1">Konfirmasi</h2>
                </div>

                <!-- Body -->
                <div class="p-6">
                    <p class="text-gray-700 text-sm sm:text-base mb-4">
                        Anda akan mengubah tahun pelajaran <span class="font-semibold">{{ form.tahun_pelajaran }}</span>
                        menjadi status <span class="font-semibold text-green-600">Aktif</span>.
                    </p>
                    <p class="text-gray-600 text-sm sm:text-base leading-relaxed">
                        Dengan mengubah data ini, semua tahun pelajaran lainnya akan otomatis dinonaktifkan. Apakah Anda
                        ingin melanjutkan?
                    </p>
                </div>

                <!-- Actions -->
                <div class="flex gap-3 p-6 bg-gray-50 border-t border-gray-200">
                    <button @click="handleConfirmationNo" :disabled="isConfirming"
                        class="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        Batal
                    </button>
                    <button @click="handleConfirmationYes" :disabled="isConfirming"
                        class="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-sm hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2">
                        <span v-if="isConfirming"
                            class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        <span>{{ isConfirming ? 'Memproses...' : 'Ya, Lanjutkan' }}</span>
                    </button>
                </div>
            </div>
        </div>
    </Transition>

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
                class="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md pointer-events-auto relative overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[80vh]">

                <!-- Header with Red Gradient Background -->
                <div
                    class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <!-- Animated gradient blobs -->
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0">
                    </div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0">
                    </div>

                    <!-- Header Content -->
                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Edit Tahun Pelajaran</h2>
                    </div>

                    <!-- Close Button -->
                    <button type="button" @click.stop="closeModal" :disabled="isSubmitting" :title="'Tutup'"
                        class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 disabled:opacity-50 backdrop-blur-sm cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Body with padding and scrollbar -->
                <div class="p-4 sm:p-8 relative z-10 overflow-y-auto flex-1">

                    <!-- Form -->
                    <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
                        <!-- Tahun Pelajaran Input -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                Tahun Pelajaran
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <input v-model="form.tahun_pelajaran" type="text" placeholder="Contoh: 2025/2026" required
                                :disabled="isSubmitting"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>

                        <!-- Status Toggle -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                Status
                            </label>
                            <div class="flex items-center gap-3">
                                <button type="button"
                                    @click="form.status = form.status === 'active' ? 'inactive' : 'active'"
                                    :disabled="isSubmitting" :class="[
                                        'relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
                                        form.status === 'active'
                                            ? 'bg-green-600'
                                            : 'bg-gray-300'
                                    ]">
                                    <span :class="[
                                        'inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200',
                                        form.status === 'active'
                                            ? 'translate-x-7'
                                            : 'translate-x-1'
                                    ]"></span>
                                </button>
                                <span class="text-xs sm:text-sm font-medium text-gray-700">
                                    {{ form.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                </span>
                            </div>
                        </div>

                        <!-- Error Alert -->
                        <div v-if="submitError" class="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                            <p class="text-xs sm:text-sm text-red-700 font-medium">{{ submitError }}</p>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex gap-3 pt-4 sm:pt-6">
                            <button type="button" @click="closeModal" :disabled="isSubmitting"
                                class="flex-1 px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                Batal
                            </button>
                            <button type="submit" :disabled="isSubmitting"
                                class="flex-1 px-4 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold text-xs sm:text-sm hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2">
                                <span v-if="isSubmitting"
                                    class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TahunPelajaranData } from '~/types/TahunPelajaranType'

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'success': [message: string]
    'error': [message: string]
}>()

const props = defineProps<{
    modelValue: boolean
    tahunPelajaranData: TahunPelajaranData | null
}>()

// Form state
const form = ref({
    id: 0,
    tahun_pelajaran: '',
    status: 'active' as 'active' | 'inactive'
})

const originalStatus = ref<'active' | 'inactive'>('active')
const isSubmitting = ref(false)
const submitError = ref<string | null>(null)
const showConfirmation = ref(false)
const isConfirming = ref(false)

// Watch for tahunPelajaranData changes and populate form
watch(() => props.tahunPelajaranData, (newData) => {
    if (newData) {
        form.value = {
            id: newData.id,
            tahun_pelajaran: newData.tahun_pelajaran,
            status: newData.status
        }
        originalStatus.value = newData.status
    }
}, { immediate: true })

// Close modal
const closeModal = () => {
    if (!isSubmitting.value) {
        emit('update:modelValue', false)
        resetForm()
    }
}

// Reset form
const resetForm = () => {
    form.value = {
        id: 0,
        tahun_pelajaran: '',
        status: 'active'
    }
    submitError.value = null
}

// Handle submit
const handleSubmit = async () => {
    // Validate form
    if (!form.value.tahun_pelajaran.trim()) {
        submitError.value = 'Tahun pelajaran wajib diisi'
        return
    }

    // If status changes from inactive to active, show confirmation
    if (originalStatus.value === 'inactive' && form.value.status === 'active') {
        showConfirmation.value = true
        return
    }

    // Otherwise, submit directly
    await submitForm()
}

// Submit the form
const submitForm = async () => {
    isSubmitting.value = true
    submitError.value = null

    try {
        const { updateTahunPelajaran } = await import('~/services/tahun-pelajaran')
        const requestBody = {
            id: form.value.id,
            tahun_pelajaran: form.value.tahun_pelajaran.trim(),
            status: form.value.status
        }

        console.log('Updating tahun pelajaran with request body:', requestBody)
        await updateTahunPelajaran(requestBody)

        // Close modal
        emit('update:modelValue', false)
        emit('success', 'Tahun pelajaran berhasil diperbarui')

        resetForm()
    } catch (err: any) {
        const errorMessage = err.data?.message || err.data?.error || err.message || 'Gagal mengupdate tahun pelajaran'
        submitError.value = errorMessage
        emit('error', errorMessage)
        console.error('Error updating tahun pelajaran:', err)
    } finally {
        isSubmitting.value = false
    }
}

// Handle confirmation yes
const handleConfirmationYes = async () => {
    isConfirming.value = true
    showConfirmation.value = false
    await submitForm()
    isConfirming.value = false
}

// Handle confirmation no
const handleConfirmationNo = () => {
    showConfirmation.value = false
}
</script>

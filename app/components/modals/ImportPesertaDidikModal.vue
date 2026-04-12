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
                        <h2 class="text-lg sm:text-xl font-bold text-white">Import Data Peserta Didik</h2>
                        <p class="text-xs sm:text-sm text-red-100 mt-0.5">Import data dari file Excel</p>
                    </div>

                    <button type="button" @click.stop="closeModal" :disabled="isImporting"
                        class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 disabled:opacity-50 backdrop-blur-sm cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Body -->
                <div class="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
                    <!-- Download Template -->
                    <div class="bg-blue-50 rounded-xl border-2 border-blue-200 p-4 sm:p-5">
                        <div class="flex items-start gap-3">
                            <div class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-200 flex items-center justify-center">
                                <i class="fa-solid fa-file-excel text-blue-600 text-sm sm:text-base"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="text-sm sm:text-base font-semibold text-gray-900">Template Excel</h4>
                                <p class="text-xs sm:text-sm text-gray-600 mt-1">Download template terlebih dahulu untuk memastikan format data sesuai.</p>
                                <button type="button" @click="downloadTemplate" :disabled="isDownloading"
                                    class="mt-3 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-blue-600 text-white font-semibold text-xs sm:text-sm hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    <i v-if="isDownloading" class="fa-solid fa-spinner fa-spin w-3.5 h-3.5"></i>
                                    <i v-else class="fa-solid fa-download w-3.5 h-3.5"></i>
                                    {{ isDownloading ? 'Mengunduh...' : 'Download Template' }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- File Upload -->
                    <div>
                        <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                            Upload File Excel
                            <span class="text-red-600 ml-1">*</span>
                        </label>

                        <!-- Dropzone -->
                        <div v-if="!selectedFile"
                            @click="triggerFileInput"
                            @dragover.prevent="isDragging = true"
                            @dragleave.prevent="isDragging = false"
                            @drop.prevent="handleDrop"
                            :class="[
                                'border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200',
                                isDragging
                                    ? 'border-red-400 bg-red-50'
                                    : 'border-gray-300 bg-gray-50 hover:border-red-400 hover:bg-red-50/50'
                            ]">
                            <div class="flex flex-col items-center gap-2 sm:gap-3">
                                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                    <i class="fa-solid fa-cloud-arrow-up text-gray-500 text-lg sm:text-xl"></i>
                                </div>
                                <div>
                                    <p class="text-xs sm:text-sm font-medium text-gray-700">Klik atau seret file Excel ke sini</p>
                                    <p class="text-[11px] sm:text-xs text-gray-500 mt-1">Format: .xlsx, .xls (Maks. 10MB)</p>
                                </div>
                            </div>
                        </div>

                        <!-- File Preview -->
                        <div v-else class="border-2 border-green-200 bg-green-50 rounded-xl p-4 sm:p-5">
                            <div class="flex items-center gap-3">
                                <div class="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-200 flex items-center justify-center">
                                    <i class="fa-solid fa-file-excel text-green-600 text-lg sm:text-xl"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-xs sm:text-sm font-semibold text-gray-900 truncate">{{ selectedFile.name }}</p>
                                    <p class="text-[11px] sm:text-xs text-gray-600 mt-0.5">{{ formatFileSize(selectedFile.size) }}</p>
                                </div>
                                <button type="button" @click="removeFile" :disabled="isImporting"
                                    class="flex-shrink-0 p-1.5 sm:p-2 rounded-lg text-red-500 hover:bg-red-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    <i class="fa-solid fa-trash-can text-sm"></i>
                                </button>
                            </div>
                        </div>

                        <input ref="fileInput" type="file" accept=".xlsx,.xls" class="hidden" @change="handleFileSelect" />
                    </div>
                </div>

                <!-- Footer -->
                <div class="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0 flex items-center justify-end gap-3">
                    <button @click="closeModal" :disabled="isImporting"
                        class="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        Batal
                    </button>
                    <button @click="importData" :disabled="!selectedFile || isImporting"
                        class="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2">
                        <i v-if="isImporting" class="fa-solid fa-spinner fa-spin w-3.5 h-3.5"></i>
                        <i v-else class="fa-solid fa-file-import w-3.5 h-3.5"></i>
                        {{ isImporting ? 'Mengimpor...' : 'Import Data' }}
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToastStore } from '~/stores/ToastStore'

const props = defineProps({
    modelValue: Boolean,
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'success': []
}>()

const toastStore = useToastStore()
const config = useRuntimeConfig()

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const isDragging = ref(false)
const isImporting = ref(false)
const isDownloading = ref(false)

const triggerFileInput = () => {
    fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
        const file = target.files[0]
        if (validateFile(file)) {
            selectedFile.value = file
        }
    }
    // Reset input agar bisa pilih file yang sama lagi
    if (fileInput.value) fileInput.value.value = ''
}

const handleDrop = (event: DragEvent) => {
    isDragging.value = false
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
        const file = event.dataTransfer.files[0]
        if (validateFile(file)) {
            selectedFile.value = file
        }
    }
}

const validateFile = (file: File): boolean => {
    const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
    ]
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
        toastStore.error('Gagal', 'Format file tidak didukung. Gunakan file .xlsx atau .xls')
        return false
    }
    if (file.size > 10 * 1024 * 1024) {
        toastStore.error('Gagal', 'Ukuran file maksimal 10MB')
        return false
    }
    return true
}

const removeFile = () => {
    selectedFile.value = null
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const downloadTemplate = async () => {
    isDownloading.value = true
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const response = await fetch(`${config.public.apiBase}/api/v1/peserta-didik/download-template`, {
            method: 'POST',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
            },
            credentials: 'include',
        })

        if (!response.ok) throw new Error('Gagal mengunduh template')

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'template_peserta_didik.xlsx'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        toastStore.success('Sukses', 'Template berhasil diunduh')
    } catch (err: any) {
        console.error('Error downloading template:', err)
        toastStore.error('Gagal', 'Tidak dapat mengunduh template')
    } finally {
        isDownloading.value = false
    }
}

const importData = async () => {
    if (!selectedFile.value) return

    isImporting.value = true
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const formData = new FormData()
        formData.append('file', selectedFile.value)

        const response = await fetch(`${config.public.apiBase}/api/v1/peserta-didik/import-excel`, {
            method: 'POST',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: formData,
            credentials: 'include',
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            throw new Error(errorData?.message || 'Gagal mengimpor data')
        }

        toastStore.success('Sukses', 'Data peserta didik berhasil ditambahkan')
        emit('success')
        closeModal()
    } catch (err: any) {
        console.error('Error importing data:', err)
        toastStore.error('Gagal', err.message || 'Tidak dapat mengimpor data')
    } finally {
        isImporting.value = false
    }
}

const closeModal = () => {
    if (isImporting.value) return
    selectedFile.value = null
    isDragging.value = false
    emit('update:modelValue', false)
}
</script>

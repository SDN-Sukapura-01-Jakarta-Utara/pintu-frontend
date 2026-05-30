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
                class="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]">

                <!-- Header -->
                <div
                    class="bg-gradient-to-r from-red-600 to-red-700 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-500/30 rounded-full blur-3xl"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-red-800/30 rounded-full blur-3xl"></div>

                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Import Data Kelulusan</h2>
                    </div>

                    <button type="button" @click.stop="closeModal" :disabled="isUploading" :title="'Tutup'"
                        class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 disabled:opacity-50 backdrop-blur-sm cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Body -->
                <div class="p-4 sm:p-8 relative z-10 overflow-y-auto flex-1">
                    <div class="space-y-4 sm:space-y-6">
                        <!-- Step 1: Download Template -->
                        <div class="bg-white rounded-lg border-2 border-gray-200 p-4 sm:p-6">
                            <div class="flex items-start gap-3 mb-4">
                                <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <span class="text-sm font-bold text-green-600">1</span>
                                </div>
                                <div class="flex-1">
                                    <h3 class="text-sm sm:text-base font-bold text-gray-900 mb-1">Download Template Excel</h3>
                                    <p class="text-xs sm:text-sm text-gray-600">
                                        Download template Excel terlebih dahulu, lalu isi data kelulusan sesuai format.
                                    </p>
                                </div>
                            </div>
                            <button type="button" @click="openDownloadTemplateModal"
                                class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-green-600 bg-green-50 text-green-700 font-semibold text-sm hover:bg-green-100 transition-colors duration-200 cursor-pointer">
                                <i class="fa-solid fa-download w-4 h-4"></i>
                                Download Template
                            </button>
                        </div>

                        <!-- Step 2: Upload File -->
                        <div class="bg-white rounded-lg border-2 border-gray-200 p-4 sm:p-6">
                            <div class="flex items-start gap-3 mb-4">
                                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <span class="text-sm font-bold text-blue-600">2</span>
                                </div>
                                <div class="flex-1">
                                    <h3 class="text-sm sm:text-base font-bold text-gray-900 mb-1">Upload File Excel</h3>
                                    <p class="text-xs sm:text-sm text-gray-600">
                                        Upload file Excel yang sudah diisi dengan data kelulusan.
                                    </p>
                                </div>
                            </div>

                            <!-- File Upload -->
                            <div class="relative">
                                <input 
                                    ref="fileInputRef"
                                    type="file" 
                                    @change="handleFileChange" 
                                    accept=".xlsx,.xls" 
                                    :disabled="isUploading"
                                    class="hidden"
                                    id="excel-upload"
                                />
                                
                                <label 
                                    for="excel-upload"
                                    :class="[
                                        'flex items-center justify-center gap-3 w-full rounded-lg border-2 border-dashed px-4 py-8 transition-all duration-200 cursor-pointer',
                                        isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-red-500 hover:bg-red-50',
                                        fileError ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                                    ]"
                                >
                                    <div class="flex flex-col items-center gap-2">
                                        <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                                            <i class="fa-solid fa-file-excel text-2xl text-red-600"></i>
                                        </div>
                                        <div class="text-center">
                                            <p class="text-sm font-semibold text-gray-900">
                                                {{ excelFile ? excelFile.name : 'Klik untuk upload file Excel' }}
                                            </p>
                                            <p class="text-xs text-gray-500 mt-1">
                                                Format: XLSX, XLS
                                            </p>
                                        </div>
                                    </div>
                                </label>

                                <button 
                                    v-if="excelFile"
                                    type="button"
                                    @click="removeFile"
                                    :disabled="isUploading"
                                    class="absolute top-2 right-2 p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    <i class="fa-solid fa-times w-4 h-4"></i>
                                </button>
                            </div>

                            <!-- Error/Success Message -->
                            <p v-if="fileError" class="mt-3 text-xs text-red-600 flex items-center gap-1">
                                <i class="fa-solid fa-circle-exclamation"></i>
                                {{ fileError }}
                            </p>
                            <p v-else-if="excelFile" class="mt-3 text-xs text-red-600 flex items-center gap-1">
                                <i class="fa-solid fa-circle-check"></i>
                                File siap diupload
                            </p>
                        </div>

                        <!-- Upload Button -->
                        <button 
                            type="button" 
                            @click="handleUpload" 
                            :disabled="!excelFile || isUploading"
                            class="w-full px-4 sm:px-6 py-3 sm:py-3.5 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2">
                            <i v-if="isUploading" class="fa-solid fa-spinner fa-spin"></i>
                            <i v-else class="fa-solid fa-upload"></i>
                            <span>{{ isUploading ? 'Mengupload...' : 'Upload & Import Data' }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>

    <!-- Download Template Modal -->
    <DownloadTemplateKelulusanModal v-model="showDownloadTemplateModal" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { importKelulusan } from '~/services/kelulusan'
import { useToast } from '~/composables/useToast'
import DownloadTemplateKelulusanModal from './DownloadTemplateKelulusanModal.vue'

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'success': []
}>()

const toast = useToast()

const isUploading = ref(false)
const fileError = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)
const excelFile = ref<File | null>(null)
const showDownloadTemplateModal = ref(false)

// Methods
const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    fileError.value = ''

    if (file) {
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ]
        
        if (!validTypes.includes(file.type)) {
            fileError.value = 'File harus berformat Excel (.xlsx atau .xls)'
            target.value = ''
            excelFile.value = null
            return
        }
        
        excelFile.value = file
    } else {
        excelFile.value = null
    }
}

const removeFile = () => {
    excelFile.value = null
    fileError.value = ''
    if (fileInputRef.value) {
        fileInputRef.value.value = ''
    }
}

const openDownloadTemplateModal = () => {
    showDownloadTemplateModal.value = true
}

const handleUpload = async () => {
    if (!excelFile.value) return

    isUploading.value = true

    try {
        const formData = new FormData()
        formData.append('file', excelFile.value)

        await importKelulusan(formData)

        toast.success('Berhasil', 'Data kelulusan berhasil diimport')
        
        // Close modal after 500ms delay
        setTimeout(() => {
            emit('success')
            closeModal()
        }, 500)
    } catch (error: any) {
        console.error('Error importing data:', error)
        const errorMessage = error?.data?.error || error?.message || 'Gagal mengimport data'
        toast.error('Gagal', errorMessage)
    } finally {
        isUploading.value = false
    }
}

const closeModal = () => {
    if (!isUploading.value) {
        emit('update:modelValue', false)
        setTimeout(() => {
            excelFile.value = null
            fileError.value = ''
        }, 300)
    }
}
</script>

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
        <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto relative overflow-hidden max-h-[90vh] flex flex-col">
                
                <!-- Header -->
                <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                            <i class="fa-solid fa-file-import text-red-600 text-lg"></i>
                        </div>
                        <div>
                            <h3 class="text-base sm:text-lg font-bold text-gray-900">Import Data Siswa</h3>
                            <p class="text-xs sm:text-sm text-gray-600">Import data siswa dari file Excel</p>
                        </div>
                    </div>
                    <button @click="closeModal" :disabled="isLoading || isDownloading"
                        class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <i class="fa-solid fa-xmark text-gray-500 text-xl"></i>
                    </button>
                </div>

                <!-- Content -->
                <div class="flex-1 overflow-y-auto p-4 sm:p-6">
                    <!-- Download Template Section -->
                    <div class="mb-6">
                        <h4 class="text-sm font-semibold text-gray-900 mb-3">1. Download Template Excel</h4>
                        <button @click="downloadTemplate" :disabled="isDownloading || isLoading"
                            class="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-green-600 text-green-600 font-semibold text-sm hover:bg-green-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                            <span v-if="isDownloading" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></span>
                            <i v-else class="fa-solid fa-download"></i>
                            {{ isDownloading ? 'Mengunduh...' : 'Download Template' }}
                        </button>
                        <p class="text-xs text-gray-600 mt-2">Download template Excel terlebih dahulu, lalu isi data siswa sesuai format.</p>
                    </div>

                    <!-- Upload File Section -->
                    <div>
                        <h4 class="text-sm font-semibold text-gray-900 mb-3">2. Upload File Excel</h4>
                        
                        <!-- File Input (Hidden) -->
                        <input ref="fileInput" type="file" accept=".xlsx,.xls" @change="handleFileChange" class="hidden" />

                        <!-- Upload Button / File Info -->
                        <div v-if="!selectedFile" @click="triggerFileInput"
                            class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-red-600 hover:bg-red-50 transition-colors">
                            <i class="fa-solid fa-cloud-arrow-up text-4xl text-gray-400 mb-3"></i>
                            <p class="text-sm font-semibold text-gray-900 mb-1">Klik untuk pilih file</p>
                            <p class="text-xs text-gray-600">Format: .xlsx atau .xls</p>
                        </div>

                        <!-- Selected File Info -->
                        <div v-else class="border-2 border-red-600 rounded-lg p-4 bg-red-50">
                            <div class="flex items-start gap-3">
                                <div class="flex-shrink-0">
                                    <i class="fa-solid fa-file-excel text-2xl text-green-600"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-semibold text-gray-900 truncate">{{ selectedFile.name }}</p>
                                    <p class="text-xs text-gray-600 mt-1">{{ formatFileSize(selectedFile.size) }}</p>
                                </div>
                                <button @click="removeFile" :disabled="isLoading"
                                    class="flex-shrink-0 p-1.5 hover:bg-red-100 rounded-lg transition-colors">
                                    <i class="fa-solid fa-trash text-red-600 text-sm"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="flex gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                    <button type="button" @click="closeModal" :disabled="isLoading || isDownloading"
                        class="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        Batal
                    </button>
                    <button type="button" @click="handleImport" :disabled="!selectedFile || isLoading || isDownloading"
                        class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span v-if="isLoading" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        <i v-else class="fa-solid fa-file-import"></i>
                        {{ isLoading ? 'Mengimport...' : 'Import Data' }}
                    </button>
                </div>
            </div>
        </div>
    </Transition>

    <!-- Error Modal -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="showErrorModal" @click="closeErrorModal" class="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"></div>
    </Transition>

    <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4">
        <div v-if="showErrorModal" class="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto relative overflow-hidden max-h-[90vh] flex flex-col">
                
                <!-- Error Header -->
                <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-red-50">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                            <i class="fa-solid fa-triangle-exclamation text-red-600 text-lg"></i>
                        </div>
                        <div>
                            <h3 class="text-base sm:text-lg font-bold text-gray-900">Error Import Data</h3>
                            <p class="text-xs sm:text-sm text-gray-600">
                                Berhasil: {{ importResult?.success_count || 0 }} | Gagal: {{ importResult?.failed_count || 0 }}
                            </p>
                        </div>
                    </div>
                    <button @click="closeErrorModal" class="p-2 hover:bg-red-100 rounded-lg transition-colors">
                        <i class="fa-solid fa-xmark text-gray-500 text-xl"></i>
                    </button>
                </div>

                <!-- Error List (Scrollable) -->
                <div class="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div class="space-y-2">
                        <div v-for="(error, index) in importResult?.errors" :key="index"
                            class="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                            <div class="flex-shrink-0 mt-0.5">
                                <i class="fa-solid fa-circle-xmark text-red-600"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-semibold text-gray-900">Baris {{ error.row }}</p>
                                <p class="text-xs text-gray-700 mt-0.5">{{ error.message }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Error Footer -->
                <div class="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                    <button type="button" @click="closeErrorModal"
                        class="w-full px-4 py-2.5 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors duration-200">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useToastStore } from '~/stores/ToastStore'
import { useAuthGuard } from '~/composables/useAuthGuard'

const props = defineProps({
    modelValue: Boolean,
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    success: []
}>()

const toastStore = useToastStore()
const config = useRuntimeConfig()
const { handle401 } = useAuthGuard()

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const isLoading = ref(false)
const isDownloading = ref(false)
const showErrorModal = ref(false)
const importResult = ref<any>(null)

const downloadTemplate = async () => {
    isDownloading.value = true

    try {
        const response = await fetch(`${config.public.apiBase}/api/v1/peserta-didik/download-template`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })

        if (response.status === 401) {
            await handle401()
            return
        }

        if (!response.ok) {
            throw new Error('Gagal mengunduh template')
        }

        // Get filename from Content-Disposition header or use default
        const contentDisposition = response.headers.get('Content-Disposition')
        let filename = 'template-data-siswa.xlsx'
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i)
            if (filenameMatch) {
                filename = filenameMatch[1]
            }
        }

        // Download file
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toastStore.success('Sukses', 'Template berhasil diunduh')
    } catch (error: any) {
        console.error('Error downloading template:', error)
        const errorMessage = error?.message || 'Gagal mengunduh template'
        toastStore.error('Gagal', errorMessage)
    } finally {
        isDownloading.value = false
    }
}

const triggerFileInput = () => {
    if (!isLoading.value && fileInput.value) {
        fileInput.value.click()
    }
}

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
        const file = target.files[0]
        
        // Validate file type
        const validExtensions = ['.xlsx', '.xls']
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
        
        if (!validExtensions.includes(fileExtension)) {
            toastStore.error('Gagal', 'Format file tidak valid. Gunakan file .xlsx atau .xls')
            return
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024 // 10MB
        if (file.size > maxSize) {
            toastStore.error('Gagal', 'Ukuran file terlalu besar. Maksimal 10MB')
            return
        }

        selectedFile.value = file
    }
}

const removeFile = () => {
    selectedFile.value = null
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const handleImport = async () => {
    if (!selectedFile.value) return

    isLoading.value = true

    try {
        const formData = new FormData()
        formData.append('file', selectedFile.value)

        const response = await fetch(`${config.public.apiBase}/api/v1/peserta-didik/import-excel`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
            },
            credentials: 'include',
            body: formData
        })

        if (response.status === 401) {
            await handle401()
            return
        }

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.message || 'Gagal mengimport data')
        }

        isLoading.value = false

        // Check if there are errors
        if (result.data && result.data.errors && result.data.errors.length > 0) {
            // Show error modal
            importResult.value = result.data
            showErrorModal.value = true
        } else {
            // All success
            toastStore.success('Sukses', `Berhasil mengimport ${result.data?.success_count || 0} data siswa`)
            
            // Reset form
            removeFile()
            
            // Close modal
            emit('update:modelValue', false)
            
            // Emit success
            await nextTick()
            emit('success')
        }
    } catch (error: any) {
        console.error('Error importing data:', error)
        isLoading.value = false
        const errorMessage = error?.message || 'Gagal mengimport data siswa'
        toastStore.error('Gagal', errorMessage)
    }
}

const closeErrorModal = () => {
    showErrorModal.value = false
    importResult.value = null
    
    // Reset form and close main modal
    removeFile()
    emit('update:modelValue', false)
    
    // Emit success to refresh data (in case some data was imported)
    if (importResult.value && importResult.value.success_count > 0) {
        nextTick().then(() => {
            emit('success')
        })
    }
}

const closeModal = () => {
    if (!isLoading.value && !isDownloading.value) {
        removeFile()
        emit('update:modelValue', false)
    }
}
</script>

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
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto relative overflow-hidden max-h-[90vh] flex flex-col">
                
                <!-- Header -->
                <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                            <i class="fa-solid fa-user-graduate text-red-600 text-lg"></i>
                        </div>
                        <div>
                            <h3 class="text-base sm:text-lg font-bold text-gray-900">Setting Siswa Lulus</h3>
                            <p class="text-xs sm:text-sm text-gray-600">Download template dan upload file Excel</p>
                        </div>
                    </div>
                    <button @click="closeModal" :disabled="isDownloading || isSaving"
                        class="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        <i class="fa-solid fa-xmark text-gray-500 text-xl"></i>
                    </button>
                </div>

                <!-- Content -->
                <div class="flex-1 overflow-y-auto p-4 sm:p-6">
                    <!-- Download Template Section -->
                    <div class="mb-6">
                        <h4 class="text-sm font-semibold text-gray-900 mb-3">
                            <i class="fa-solid fa-download text-purple-600 mr-2"></i>
                            1. Download Template Excel
                        </h4>
                        <button @click="downloadTemplate" :disabled="isDownloading || isSaving" type="button"
                            class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-purple-600 text-purple-700 bg-purple-50 font-semibold text-sm hover:bg-purple-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                            <span v-if="isDownloading" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-purple-600 border-t-transparent"></span>
                            <i v-else class="fa-solid fa-file-excel"></i>
                            <span>{{ isDownloading ? 'Mengunduh...' : 'Download Template Excel' }}</span>
                        </button>
                        <p class="text-xs text-gray-600 mt-2">Download template terlebih dahulu, lalu isi data siswa yang akan diset sebagai lulus.</p>
                    </div>

                    <!-- Divider -->
                    <div class="relative mb-6">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-gray-300"></div>
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="bg-white px-4 text-gray-500 font-medium">lalu</span>
                        </div>
                    </div>

                    <!-- Upload File Section -->
                    <div>
                        <h4 class="text-sm font-semibold text-gray-900 mb-3">
                            <i class="fa-solid fa-upload text-purple-600 mr-2"></i>
                            2. Upload File Excel
                        </h4>
                        
                        <!-- Hidden File Input -->
                        <input ref="fileInput" type="file" accept=".xlsx,.xls" @change="handleFileSelect" class="hidden" />

                        <!-- File Upload Area -->
                        <div v-if="!selectedFile" @click="() => fileInput?.click()" :class="[
                            'relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300',
                            isDragging
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-purple-300 bg-purple-50 hover:border-purple-400 hover:bg-purple-100'
                        ]" @dragover.prevent="isDragging = true" @dragleave="isDragging = false"
                            @drop.prevent="handleDrop">
                            <div class="flex flex-col items-center gap-2">
                                <div class="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <i class="fa-solid fa-cloud-arrow-up text-xl text-purple-600"></i>
                                </div>
                                <div>
                                    <p class="text-sm font-semibold text-gray-900">Klik atau drag file Excel</p>
                                    <p class="text-xs text-gray-600 mt-0.5">Format: .xlsx atau .xls</p>
                                </div>
                            </div>
                        </div>

                        <!-- Selected File Display -->
                        <div v-else class="border-2 border-purple-600 rounded-lg p-4 bg-purple-50">
                            <div class="flex items-center justify-between gap-3">
                                <div class="flex items-center gap-3 flex-1 min-w-0">
                                    <div class="flex-shrink-0">
                                        <i class="fa-solid fa-file-excel text-2xl text-green-600"></i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-semibold text-gray-900 truncate">{{ selectedFile.name }}</p>
                                        <p class="text-xs text-gray-600">{{ formatFileSize(selectedFile.size) }}</p>
                                    </div>
                                </div>
                                <button @click="removeFile" :disabled="isSaving" type="button"
                                    class="flex-shrink-0 p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                    <i class="fa-solid fa-trash text-sm"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Info Box -->
                    <div class="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <div class="flex gap-3">
                            <i class="fa-solid fa-info-circle text-blue-600 text-lg flex-shrink-0 mt-0.5"></i>
                            <div class="text-sm text-blue-800">
                                <p class="font-semibold mb-1">Petunjuk:</p>
                                <ol class="list-decimal list-inside space-y-1 text-xs">
                                    <li>Download template Excel terlebih dahulu</li>
                                    <li>Isi data siswa yang akan diset sebagai lulus sesuai format</li>
                                    <li>Upload file Excel yang sudah diisi</li>
                                    <li>Klik tombol Simpan untuk memproses data</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="flex gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                    <button @click="closeModal" :disabled="isDownloading || isSaving" type="button"
                        class="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        <i class="fa-solid fa-times mr-2"></i>
                        Batal
                    </button>
                    <button @click="handleSave" :disabled="!selectedFile || isSaving || isDownloading" type="button"
                        class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg cursor-pointer">
                        <span v-if="isSaving" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        <i v-else class="fa-solid fa-save"></i>
                        <span>{{ isSaving ? 'Menyimpan...' : 'Simpan' }}</span>
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
                            <h3 class="text-base sm:text-lg font-bold text-gray-900">Error Setting Siswa Lulus</h3>
                            <p class="text-xs sm:text-sm text-gray-600">
                                Berhasil: {{ importResult?.success_count || 0 }} | Gagal: {{ importResult?.failed_count || 0 }}
                            </p>
                        </div>
                    </div>
                    <button @click="closeErrorModal" class="p-2 hover:bg-red-100 rounded-lg transition-colors cursor-pointer">
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
                        class="w-full px-4 py-2.5 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors duration-200 cursor-pointer">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToastStore } from '~/stores/ToastStore'
import { useAuthGuard } from '~/composables/useAuthGuard'

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'success'): void
}>()

const toastStore = useToastStore()
const config = useRuntimeConfig()
const { handle401 } = useAuthGuard()

const isDownloading = ref(false)
const isSaving = ref(false)
const selectedFile = ref<File | null>(null)
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const showErrorModal = ref(false)
const importResult = ref<any>(null)

const closeModal = () => {
    if (isSaving.value || isDownloading.value) return
    selectedFile.value = null
    emit('update:modelValue', false)
}

const handleFileSelect = (e: Event) => {
    const files = (e.target as HTMLInputElement).files
    if (files && files.length > 0) {
        selectedFile.value = files[0] || null
    }
}

const handleDrop = (e: DragEvent) => {
    isDragging.value = false
    const files = e.dataTransfer?.files
    if (files && files.length > 0) {
        selectedFile.value = files[0] || null
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
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const downloadTemplate = async () => {
    isDownloading.value = true

    try {
        const response = await fetch(`${config.public.apiBase}/api/v1/peserta-didik/download-template-siswa-lulus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
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

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `template-siswa-lulus.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toastStore.success('Berhasil', 'Template berhasil diunduh')
    } catch (err: any) {
        console.error('Error downloading template:', err)
        toastStore.error('Gagal', err.message || 'Gagal mengunduh template')
    } finally {
        isDownloading.value = false
    }
}

const handleSave = async () => {
    if (!selectedFile.value) {
        toastStore.error('Gagal', 'Silakan pilih file Excel terlebih dahulu')
        return
    }

    isSaving.value = true

    try {
        const formData = new FormData()
        formData.append('file', selectedFile.value)

        const response = await fetch(`${config.public.apiBase}/api/v1/peserta-didik/import-siswa-lulus`, {
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
            // Check if there are errors in the response
            if (result.data && result.data.errors && result.data.errors.length > 0) {
                // Show error modal with details
                importResult.value = result.data
                showErrorModal.value = true
                isSaving.value = false
                return
            }
            
            throw new Error(result.error || result.message || 'Gagal menyimpan data siswa lulus')
        }

        isSaving.value = false

        // Check if there are errors even on success response
        if (result.data && result.data.errors && result.data.errors.length > 0) {
            // Show error modal
            importResult.value = result.data
            showErrorModal.value = true
        } else {
            // All success
            toastStore.success('Berhasil', `Berhasil mengupdate ${result.data?.success_count || 0} siswa menjadi lulus`)
            
            // Reset form
            removeFile()
            
            // Close modal
            emit('update:modelValue', false)
            
            // Emit success
            emit('success')
        }
    } catch (error: any) {
        console.error('Error importing siswa lulus:', error)
        isSaving.value = false
        const errorMessage = error?.message || 'Gagal menyimpan data siswa lulus'
        toastStore.error('Gagal', errorMessage)
    }
}

const closeErrorModal = () => {
    showErrorModal.value = false
    
    // Reset form and close main modal
    removeFile()
    emit('update:modelValue', false)
    
    // Emit success to refresh data if some data was imported
    if (importResult.value && importResult.value.success_count > 0) {
        emit('success')
    }
    
    importResult.value = null
}
</script>

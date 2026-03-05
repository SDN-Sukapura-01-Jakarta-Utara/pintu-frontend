<template>
    <div class="space-y-2">

        <!-- Label -->
        <label class="text-xs sm:text-sm font-semibold text-gray-900">{{ field.label }}</label>

        <!-- Uploaded File Display -->
        <div v-if="uploadedFile && uploadedFile.saved" class="space-y-3">
            <div class="flex items-center justify-between gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center gap-2 flex-1 min-w-0">
                    <i class="fa-solid fa-check-circle text-green-600"></i>
                    <div class="flex-1 min-w-0">
                        <p class="text-xs sm:text-sm font-medium text-green-900">Tersimpan</p>
                        <p class="text-xs text-gray-600 truncate">{{ uploadedFile.name }}</p>
                    </div>
                </div>
                <div class="flex items-center gap-1 flex-shrink-0">
                    <!-- Preview Button -->
                    <a v-if="uploadedFile.url" :href="uploadedFile.url" target="_blank"
                        class="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Lihat file">
                        <i class="fa-solid fa-eye w-4 h-4"></i>
                    </a>
                    <!-- Delete File Button -->
                    <button type="button" @click="openDeleteConfirm()" :disabled="isSubmitting || isUploading"
                        class="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Hapus file">
                        <i class="fa-solid fa-trash w-4 h-4"></i>
                    </button>
                </div>
            </div>

            <!-- Re-upload Area -->
            <div @click="$refs.fileInput?.click()" @dragover.prevent="isDragging = true" @dragleave="isDragging = false"
                @drop.prevent="handleDrop" :class="[
                    'relative border-2 border-dashed rounded-lg p-2 sm:p-3 text-center cursor-pointer transition-all duration-300',
                    isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50',
                    isSubmitting && 'opacity-50 cursor-not-allowed'
                ]">
                <input ref="fileInput" type="file" accept=".pdf" class="hidden" @change="handleFileSelect"
                    :disabled="isSubmitting || isUploading" />

                <div v-if="!isUploading" class="flex items-center gap-2">
                    <svg class="w-4 h-4 flex-shrink-0 text-blue-600" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    <div class="text-left">
                        <p class="text-xs font-semibold text-gray-900">Upload file baru</p>
                    </div>
                </div>

                <div v-else class="flex items-center gap-2">
                    <div
                        class="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0">
                    </div>
                    <p class="text-xs text-gray-600">Mengupload...</p>
                </div>
            </div>
        </div>

        <!-- Upload Area (belum ada file) -->
        <div v-else @click="$refs.fileInput?.click()" @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false" @drop.prevent="handleDrop" :class="[
                'relative border-2 border-dashed rounded-lg p-3 sm:p-4 text-center cursor-pointer transition-all duration-300',
                isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50',
                isSubmitting && 'opacity-50 cursor-not-allowed'
            ]">
            <input ref="fileInput" type="file" accept=".pdf" class="hidden" @change="handleFileSelect"
                :disabled="isSubmitting || isUploading" />

            <div v-if="!isUploading" class="flex flex-col items-center gap-1 sm:gap-2">
                <div class="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg class="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-xs sm:text-sm font-semibold text-gray-900">Klik atau drag file</p>
                    <p class="text-xs text-gray-600 mt-0.5">PDF (Maks. 1MB)</p>
                </div>
            </div>

            <div v-else class="flex flex-col items-center gap-2">
                <div class="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p class="text-xs text-gray-600">Mengupload...</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
    field: { key: string; label: string }
    formValue: any
    uploadedFile: any
    isSubmitting: boolean
    isUploading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
    upload: [file: File]
    remove: [fieldKey: string]
    'request-delete': [fieldKey: string, fileName: string]
}>()

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const handleFileSelect = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
        emit('upload', file)
    }
}

const handleDrop = (e: DragEvent) => {
    isDragging.value = false
    const file = e.dataTransfer?.files?.[0]
    if (file) {
        emit('upload', file)
    }
}

const openDeleteConfirm = () => {
    // Emit request-delete instead of showing modal
    emit('request-delete', props.field.key, props.uploadedFile?.name || 'File')
}
</script>

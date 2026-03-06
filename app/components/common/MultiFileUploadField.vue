<template>
    <div class="space-y-2">
        <!-- Label -->
        <label class="text-xs sm:text-sm font-semibold text-gray-900">{{ field.label }}</label>

        <!-- Uploaded Files Display (saved files) -->
        <SavedMultiFileDisplay v-if="uploadedFiles.length > 0" :files="uploadedFiles"
            :is-loading="isSubmitting || isUploading"
            @request-delete="(index, fileName) => emit('request-delete', index, fileName)"
            @request-delete-all="() => emit('request-delete-all')" class="mb-4" />

        <!-- Upload Area -->
        <div @click="$refs.fileInput?.click()" @dragover.prevent="isDragging = true" @dragleave="isDragging = false"
            @drop.prevent="handleDrop" :class="[
                'relative border-2 border-dashed rounded-lg p-3 sm:p-4 text-center cursor-pointer transition-all duration-300',
                isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50',
                isSubmitting && 'opacity-50 cursor-not-allowed'
            ]">
            <input ref="fileInput" type="file" accept=".pdf" multiple class="hidden" @change="handleFileSelect"
                :disabled="isSubmitting || isUploading" />

            <div v-if="!isUploading" class="flex flex-col items-center gap-1 sm:gap-2">
                <div class="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg class="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-xs sm:text-sm font-semibold text-gray-900">Klik atau drag file (multiple)</p>
                    <p class="text-xs text-gray-600 mt-0.5">PDF (Maks. 1MB per file)</p>
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
import SavedMultiFileDisplay from './SavedMultiFileDisplay.vue'

interface Props {
    field: { key: string; label: string }
    uploadedFiles: any[]
    isSubmitting: boolean
    isUploading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
    upload: [files: File[]]
    remove: [fieldKey: string, index: number]
    removeAll: [fieldKey: string]
}>()

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const handleFileSelect = (e: Event) => {
    const files = (e.target as HTMLInputElement).files
    if (files && files.length > 0) {
        const fileArray = Array.from(files)
        emit('upload', fileArray)
    }
}

const handleDrop = (e: DragEvent) => {
    isDragging.value = false
    const files = e.dataTransfer?.files
    if (files && files.length > 0) {
        const fileArray = Array.from(files)
        emit('upload', fileArray)
    }
}
</script>

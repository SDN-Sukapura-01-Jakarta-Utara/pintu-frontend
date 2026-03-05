<template>
    <div class="space-y-2">
        <!-- Label -->
        <label class="text-xs sm:text-sm font-semibold text-gray-900">{{ field.label }}</label>

        <!-- Uploaded Files Display -->
        <div v-if="uploadedFiles.length > 0" class="mb-4 space-y-3">
            <div class="flex items-center justify-between">
                <p class="text-xs font-semibold text-gray-600">File yang Tersimpan:</p>
                <!-- Delete All Button -->
                <button type="button" @click="handleDeleteAllFiles()"
                    :disabled="isSubmitting || isUploading || uploadedFiles.length === 0"
                    class="text-xs px-2 py-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium">
                    <i class="fa-solid fa-trash mr-1"></i>Hapus Semua
                </button>
            </div>
            <div class="space-y-2">
                <div v-for="(file, index) in uploadedFiles" :key="index"
                    class="flex items-center justify-between gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div class="flex items-center gap-2 flex-1 min-w-0">
                        <i class="fa-solid fa-check-circle text-green-600"></i>
                        <div class="flex-1 min-w-0">
                            <p class="text-xs sm:text-sm font-medium text-green-900">Tersimpan</p>
                            <p class="text-xs text-gray-600 truncate">{{ file.name }}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-1 flex-shrink-0">
                        <!-- Preview Button -->
                        <a v-if="file.url" :href="file.url" target="_blank"
                            class="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Lihat file">
                            <i class="fa-solid fa-eye w-4 h-4"></i>
                        </a>
                        <!-- Delete File Button -->
                        <button type="button" @click="handleDeleteFile(index)"
                            :disabled="isSubmitting || isUploading"
                            class="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Hapus file">
                            <i class="fa-solid fa-trash w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Upload Area -->
        <div @click="$refs.fileInput?.click()"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop.prevent="handleDrop"
            :class="[
                'relative border-2 border-dashed rounded-lg p-3 sm:p-4 text-center cursor-pointer transition-all duration-300',
                isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50',
                isSubmitting && 'opacity-50 cursor-not-allowed'
            ]">
            <input ref="fileInput" type="file" accept=".pdf" multiple class="hidden"
                @change="handleFileSelect" :disabled="isSubmitting || isUploading" />

            <div v-if="!isUploading" class="flex flex-col items-center gap-1 sm:gap-2">
                <div class="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg class="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 4v16m8-8H4"></path>
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

interface Props {
    field: { key: string; label: string }
    uploadedFiles: any[]
    isSubmitting: boolean
    isUploading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
    upload: [file: File]
    remove: [fieldKey: string, index: number]
    removeAll: [fieldKey: string]
}>()

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const handleFileSelect = (e: Event) => {
    const files = (e.target as HTMLInputElement).files
    if (files) {
        for (let i = 0; i < files.length; i++) {
            emit('upload', files[i])
        }
    }
}

const handleDrop = (e: DragEvent) => {
    isDragging.value = false
    const files = e.dataTransfer?.files
    if (files) {
        for (let i = 0; i < files.length; i++) {
            emit('upload', files[i])
        }
    }
}

const handleDeleteFile = (index: number) => {
    const fileName = props.uploadedFiles[index]?.name
    if (confirm(`Apakah Anda yakin ingin menghapus file ${fileName}?`)) {
        emit('remove', props.field.key, index)
    }
}

const handleDeleteAllFiles = () => {
    if (confirm(`Apakah Anda yakin ingin menghapus SEMUA file ${props.uploadedFiles.length} di ${props.field.label}?`)) {
        // Emit remove untuk semua files dengan special marker
        emit('removeAll', props.field.key)
    }
}
</script>

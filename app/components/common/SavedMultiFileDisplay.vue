<template>
    <div v-if="files.length > 0" class="space-y-3">

        <!-- Header with label and delete all button -->
        <div class="flex items-center justify-between">
            <p class="text-xs font-semibold text-gray-600">File yang Tersimpan:</p>
            <button v-if="files.length > 0" type="button" @click="openDeleteAllConfirm()" :disabled="isLoading"
                class="text-xs px-2 py-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer">
                <i class="fa-solid fa-trash mr-1"></i>Hapus Semua
            </button>
        </div>

        <!-- List of saved files -->
        <div class="space-y-2">
            <div v-for="(file, index) in files" :key="index"
                class="flex items-center justify-between gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center gap-2 flex-1 min-w-0">
                    <i class="fa-solid fa-check-circle text-green-600 flex-shrink-0"></i>
                    <div class="flex-1 min-w-0">
                        <p class="text-xs sm:text-sm font-medium text-green-900">Tersimpan</p>
                        <p class="text-xs text-gray-600 truncate">{{ getFileName(file) }}</p>
                    </div>
                </div>
                <div class="flex items-center gap-1 flex-shrink-0">
                    <!-- Preview Button -->
                    <a v-if="getFileUrl(file)" :href="getFileUrl(file)" target="_blank"
                        class="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Lihat file">
                        <i class="fa-solid fa-eye w-4 h-4"></i>
                    </a>
                    <!-- Delete Button -->
                    <button type="button" @click="openDeleteConfirm(index)" :disabled="isLoading"
                        class="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        title="Hapus file">
                        <i class="fa-solid fa-trash w-4 h-4"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
    files: any[]
    isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    isLoading: false
})

const emit = defineEmits<{
    delete: [index: number]
    deleteAll: []
    'request-delete': [index: number, fileName: string]
    'request-delete-all': []
}>()



const getFileName = (file: any): string => {
    // If file is an object with name property
    if (typeof file === 'object' && file.name) {
        return file.name
    }
    // If file is a string (URL), extract filename from path
    if (typeof file === 'string') {
        return file.split('/').pop() || 'File'
    }
    return 'File'
}

const getFileUrl = (file: any): string => {
    // If file is an object with url property
    if (typeof file === 'object' && file.url) {
        return file.url
    }
    // If file is a string, use it directly as URL
    if (typeof file === 'string') {
        return file
    }
    return ''
}

const openDeleteConfirm = (index: number) => {
    const fileName = getFileName(props.files[index])
    emit('request-delete', index, fileName)
}

const openDeleteAllConfirm = () => {
    emit('request-delete-all')
}
</script>

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
        <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
                class="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto relative overflow-hidden">

                <!-- Header with Red Gradient Background -->
                <div class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-8 py-4 relative overflow-hidden">
                    <!-- Animated gradient blobs -->
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0">
                    </div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0">
                    </div>

                    <!-- Close Button -->
                    <button @click="closeModal" :disabled="isSubmitting"
                        class="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50 backdrop-blur-sm cursor-pointer hover:cursor-pointer">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>

                    <!-- Header Content -->
                    <div class="relative z-10">
                        <h2 class="text-xl font-bold text-white">Tambah Jumbotron</h2>
                    </div>
                </div>

                <!-- Body with padding -->
                <div class="p-8 relative z-10">

                    <!-- Form -->
                    <form @submit.prevent="handleSubmit" class="space-y-6">
                        <!-- Image Upload Section -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-900 mb-3">
                                Gambar Jumbotron
                                <span class="text-red-600 ml-1">*</span>
                            </label>

                            <!-- Image Preview -->
                            <div v-if="imagePreview" class="mb-4 relative group">
                                <img :src="imagePreview" alt="Preview"
                                    class="w-full h-48 object-cover rounded-xl border-2 border-gray-200 shadow-md" />
                                <button type="button" @click="removeImage" :disabled="isSubmitting"
                                    class="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-100 hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 cursor-pointer hover:cursor-pointer">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clip-rule="evenodd"></path>
                                    </svg>
                                </button>
                            </div>

                            <!-- Upload Area -->
                            <div @click="$refs.fileInput.click()" @dragover.prevent="isDragging = true"
                                @dragleave="isDragging = false" @drop.prevent="handleFileDrop" :class="[
                                    'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300',
                                    isDragging
                                        ? 'border-blue-500 bg-blue-50 scale-105'
                                        : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                                ]">
                                <input ref="fileInput" type="file" accept="image/*" class="hidden"
                                    @change="handleFileSelect" :disabled="isSubmitting" />

                                <div class="flex flex-col items-center gap-3">
                                    <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 4v16m8-8H4"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="font-semibold text-gray-900">Klik atau drag gambar di sini</p>
                                        <p class="text-xs text-gray-600 mt-1">Format: JPG, PNG, WebP (Maks. 5MB)</p>
                                    </div>
                                </div>

                                <!-- Error Message -->
                                <div v-if="fileError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p class="text-sm text-red-700 font-medium">{{ fileError }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Status Toggle -->
                        <div class="pt-4 border-t border-gray-200">
                            <div class="flex items-center justify-between">
                                <label class="text-sm font-semibold text-gray-900">Status</label>
                                <button type="button" @click="isActive = !isActive" :disabled="isSubmitting" :class="[
                                    'relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300',
                                    isActive ? 'bg-green-600' : 'bg-gray-300',
                                    isSubmitting && 'opacity-50 cursor-not-allowed'
                                ]">
                                    <span :class="[
                                        'inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-md',
                                        isActive ? 'translate-x-7' : 'translate-x-1'
                                    ]"></span>
                                </button>
                            </div>
                            <div class="mt-2 flex items-center gap-2">
                                <span :class="[
                                    'px-3 py-1 rounded-full text-sm font-semibold',
                                    isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                ]">
                                    {{ isActive ? 'Aktif' : 'Nonaktif' }}
                                </span>
                            </div>
                        </div>

                        <!-- Error Alert -->
                        <div v-if="submitError" class="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                            <div class="flex gap-3">
                                <div class="flex-shrink-0">
                                    <svg class="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clip-rule="evenodd"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p class="text-sm font-semibold text-red-900">Error</p>
                                    <p class="text-sm text-red-800 mt-1">{{ submitError }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Buttons -->
                        <div class="flex gap-3 pt-4">
                            <button type="button" @click="closeModal" :disabled="isSubmitting"
                                class="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:cursor-pointer">
                                Batal
                            </button>
                            <button type="submit" :disabled="!selectedFile || isSubmitting"
                                class="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:cursor-pointer flex items-center justify-center gap-2">
                                <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { createJumbotron } from '~/services/jumbotron'
import type { JumbotronCreatePayload } from '~/types/JumbotronType'
import { compressImage, getFileSizeInMB } from '~/utils/imageCompressor'

interface Props {
    modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'success': [message: string]
    'error': [error: string]
}>()

// Form state
const selectedFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const isActive = ref(true)
const isDragging = ref(false)
const isSubmitting = ref(false)
const fileError = ref<string | null>(null)
const submitError = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// File validation
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const validateFile = (file: File): string | null => {
    if (!file) return 'Pilih file gambar'

    if (!ALLOWED_TYPES.includes(file.type)) {
        return 'Format file harus JPG, PNG, atau WebP'
    }

    if (file.size > MAX_FILE_SIZE) {
        return 'Ukuran file tidak boleh lebih dari 5MB'
    }

    return null
}

const handleFileSelect = async (event: Event) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]

    if (file) {
        const error = validateFile(file)
        if (error) {
            fileError.value = error
            selectedFile.value = null
            imagePreview.value = null
            return
        }

        fileError.value = null

        // Compress image if needed
        try {
            const compressedFile = await compressImage(file, {
                maxSize: 1, // 1MB
                quality: 0.8,
                maxWidth: 2000,
                maxHeight: 2000,
            })

            selectedFile.value = compressedFile
            console.log(`Original: ${getFileSizeInMB(file.size)}MB → Compressed: ${getFileSizeInMB(compressedFile.size)}MB`)
        } catch (err) {
            fileError.value = 'Gagal mengkompres gambar'
            selectedFile.value = null
            imagePreview.value = null
            console.error('Compression error:', err)
            return
        }

        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
            imagePreview.value = e.target?.result as string
        }
        reader.readAsDataURL(selectedFile.value)
    }
}

const handleFileDrop = async (event: DragEvent) => {
    isDragging.value = false
    const file = event.dataTransfer?.files?.[0]

    if (file) {
        const error = validateFile(file)
        if (error) {
            fileError.value = error
            selectedFile.value = null
            imagePreview.value = null
            return
        }

        fileError.value = null

        // Compress image if needed
        try {
            const compressedFile = await compressImage(file, {
                maxSize: 1, // 1MB
                quality: 0.8,
                maxWidth: 2000,
                maxHeight: 2000,
            })

            selectedFile.value = compressedFile
            console.log(`Original: ${getFileSizeInMB(file.size)}MB → Compressed: ${getFileSizeInMB(compressedFile.size)}MB`)
        } catch (err) {
            fileError.value = 'Gagal mengkompres gambar'
            selectedFile.value = null
            imagePreview.value = null
            console.error('Compression error:', err)
            return
        }

        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
            imagePreview.value = e.target?.result as string
        }
        reader.readAsDataURL(selectedFile.value)
    }
}

const removeImage = () => {
    selectedFile.value = null
    imagePreview.value = null
    fileError.value = null
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

const handleSubmit = async () => {
    if (!selectedFile.value) {
        fileError.value = 'Gambar harus dipilih'
        return
    }

    isSubmitting.value = true
    submitError.value = null

    try {
        const payload: JumbotronCreatePayload = {
            file: selectedFile.value,
            status: isActive.value ? 'active' : 'inactive'
        }

        await createJumbotron(payload)

        // Success
        emit('success', 'Jumbotron berhasil ditambahkan')
        closeModal()

        // Reset form
        resetForm()
    } catch (err: any) {
        submitError.value = err.data?.message || err.message || 'Gagal menambahkan jumbotron'
        console.error('Error creating jumbotron:', err)
    } finally {
        isSubmitting.value = false
    }
}

const resetForm = () => {
    selectedFile.value = null
    imagePreview.value = null
    isActive.value = true
    fileError.value = null
    submitError.value = null
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

const closeModal = () => {
    if (!isSubmitting.value) {
        emit('update:modelValue', false)
        resetForm()
    }
}
</script>

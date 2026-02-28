<template>
    <!-- Image Viewer Modal -->
    <ImageViewerModal v-model="showImageViewer" :image-src="selectedImageSrc" :image-alt="selectedImageAlt"
        :images="photoPreviews.map(p => ({ src: p.url, alt: p.file.name }))" :initial-index="selectedImageIndex" />

    <!-- Backdrop -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="modelValue && !showImageViewer" @click="closeModal" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"></div>
    </Transition>

    <!-- Modal -->
    <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4">
        <div v-if="modelValue && !showImageViewer"
            class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div
                class="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-lg pointer-events-auto relative overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">

                <!-- Header -->
                <div
                    class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Tambah Galeri Kegiatan</h2>
                    </div>

                    <button type="button" @click.stop="closeModal" :disabled="isSubmitting"
                        :title="'Tutup'"
                        class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 disabled:opacity-50 backdrop-blur-sm cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Body -->
                <div class="p-4 sm:p-8 relative z-10 overflow-y-auto flex-1">
                    <!-- Form -->
                    <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
                        <!-- Judul -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                Judul Kegiatan
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <input v-model="formData.judul" type="text" placeholder="Masukkan judul kegiatan..."
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                                :disabled="isSubmitting" />
                        </div>

                        <!-- Tanggal -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                Tanggal Kegiatan
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <input v-model="formData.tanggal" type="date"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                                :disabled="isSubmitting" />
                        </div>

                        <!-- Foto Upload -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                Foto Kegiatan
                                <span class="text-red-600 ml-1">*</span>
                                <span class="text-xs text-gray-600 font-normal ml-2">(Max 15 foto, 2MB/foto)</span>
                            </label>

                            <!-- Photos Preview -->
                            <div v-if="photoPreviews.length > 0" class="mb-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div v-for="(preview, index) in photoPreviews" :key="index"
                                    class="relative group aspect-square cursor-pointer">
                                    <img :src="preview.url" :alt="`Photo ${index + 1}`"
                                        @click="openImageViewer(index)"
                                        class="w-full h-full object-cover rounded-lg border-2 border-gray-200 shadow-md cursor-pointer" />
                                    <div class="absolute inset-0 rounded-lg bg-black/20 flex items-center justify-center pointer-events-none">
                                        <svg class="w-6 h-6 text-white transition-opacity" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"></path>
                                        </svg>
                                    </div>
                                    <button type="button" @click.stop="removePhoto(index)" :disabled="isSubmitting"
                                        class="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 cursor-pointer z-10">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                clip-rule="evenodd"></path>
                                        </svg>
                                    </button>
                                    <span class="absolute bottom-1 right-1 text-xs font-semibold bg-gray-900/80 text-white px-2 py-1 rounded">
                                        {{ (preview.size / 1024).toFixed(1) }}KB
                                    </span>
                                </div>
                            </div>

                            <!-- Upload Counter -->
                            <div class="mb-3 text-xs sm:text-sm text-gray-600 font-medium">
                                {{ photoPreviews.length }} / 15 foto
                            </div>

                            <!-- Upload Area -->
                            <div v-if="photoPreviews.length < 15" @click="$refs.photosInput?.click()" @dragover.prevent="isDraggingPhotos = true"
                                @dragleave="isDraggingPhotos = false" @drop.prevent="handlePhotosDrop" :class="[
                                    'relative border-2 border-dashed rounded-xl p-4 sm:p-8 text-center cursor-pointer transition-all duration-300',
                                    isDraggingPhotos
                                        ? 'border-blue-500 bg-blue-50 scale-105'
                                        : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                                ]">
                                <input ref="photosInput" type="file" accept="image/*" multiple class="hidden"
                                    @change="handlePhotosSelect" :disabled="isSubmitting" />

                                <div class="flex flex-col items-center gap-2 sm:gap-3">
                                    <div
                                        class="h-10 sm:h-12 w-10 sm:w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <svg class="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 4v16m8-8H4"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="text-xs sm:text-sm font-semibold text-gray-900">Klik atau drag
                                            foto di sini</p>
                                        <p class="text-xs text-gray-600 mt-1">Format: JPG, PNG, WebP (Maks. 2MB/foto)</p>
                                    </div>
                                </div>

                                <!-- Error Message -->
                                <div v-if="photoError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p class="text-sm text-red-700 font-medium">{{ photoError }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Status Publikasi -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                Status Publikasi
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <select v-model="formData.status_publikasi"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer"
                                :disabled="isSubmitting">
                                <option value="">Pilih Status Publikasi</option>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>

                        <!-- Status Toggle -->
                        <div class="pt-3 sm:pt-4 border-t border-gray-200">
                            <div class="flex items-center justify-between">
                                <label class="text-xs sm:text-sm font-semibold text-gray-900">Status</label>
                                <button type="button" @click="formData.status = formData.status === 'active' ? 'inactive' : 'active'" :disabled="isSubmitting" :class="[
                                    'relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300',
                                    formData.status === 'active' ? 'bg-green-600' : 'bg-gray-300',
                                    isSubmitting && 'opacity-50 cursor-not-allowed'
                                ]">
                                    <span :class="[
                                        'inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-md',
                                        formData.status === 'active' ? 'translate-x-7' : 'translate-x-1'
                                    ]"></span>
                                </button>
                            </div>
                            <div class="mt-2 flex items-center gap-2">
                                <span :class="[
                                    'px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold',
                                    formData.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                ]">
                                    {{ formData.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                </span>
                            </div>
                        </div>

                        <!-- Error Alert -->
                        <div v-if="photoError" class="p-3 sm:p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                            <div class="flex gap-2 sm:gap-3">
                                <div class="flex-shrink-0">
                                    <svg class="h-4 sm:h-5 w-4 sm:w-5 text-red-600" fill="currentColor"
                                        viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clip-rule="evenodd"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p class="text-xs sm:text-sm font-semibold text-red-900">Error</p>
                                    <p class="text-xs sm:text-sm text-red-800 mt-1">{{ photoError }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Buttons -->
                        <div class="flex gap-2 sm:gap-3 pt-3 sm:pt-4 flex-shrink-0">
                            <button type="button" @click="closeModal" :disabled="isSubmitting"
                                class="flex-1 px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                Batal
                            </button>
                            <button type="submit" :disabled="isSubmitting"
                                class="flex-1 px-4 py-2.5 sm:py-3 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2">
                                <i v-if="!isSubmitting" class="fa-solid fa-check w-4 h-4"></i>
                                <i v-else class="fa-solid fa-spinner animate-spin w-4 h-4"></i>
                                {{ isSubmitting ? 'Menyimpan...' : 'Simpan Galeri Kegiatan' }}
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
import ImageViewerModal from './ImageViewerModal.vue'
import { useActivityGalleryStore } from '~/stores/ActivityGalleryStore'
import { useToastStore } from '~/stores/ToastStore'
import { compressImage } from '~/utils/imageCompressor'

interface PhotoPreview {
    url: string
    size: number
    file: File
}

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    success: []
    error: [message: string]
}>()

const galleryStore = useActivityGalleryStore()
const toastStore = useToastStore()

// Form data
const formData = ref({
    judul: '',
    tanggal: '',
    status_publikasi: '',
    status: 'active',
})

// Photos management
const photoPreviews = ref<PhotoPreview[]>([])
const photosInput = ref<HTMLInputElement | null>(null)
const isDraggingPhotos = ref(false)
const photoError = ref('')

// Image viewer
const showImageViewer = ref(false)
const selectedImageSrc = ref('')
const selectedImageAlt = ref('')
const selectedImageIndex = ref(0)

// Loading states
const isSubmitting = ref(false)

// Methods
const closeModal = () => {
    if (!isSubmitting.value) {
        emit('update:modelValue', false)
    }
}

const handlePhotosSelect = async (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files) {
        await processPhotos(Array.from(input.files))
    }
}

const handlePhotosDrop = async (event: DragEvent) => {
    isDraggingPhotos.value = false
    if (event.dataTransfer?.files) {
        await processPhotos(Array.from(event.dataTransfer.files))
    }
}

const processPhotos = async (files: File[]) => {
    photoError.value = ''

    // Check if adding new photos would exceed limit
    const totalPhotos = photoPreviews.value.length + files.length
    if (totalPhotos > 15) {
        photoError.value = `Maximum 15 photos allowed. Anda ingin menambahkan ${files.length} foto ke ${photoPreviews.value.length} foto yang sudah ada.`
        return
    }

    for (const file of files) {
        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            photoError.value = 'Hanya file JPG, PNG, atau WebP yang diizinkan'
            return
        }

        // Validate file size (2MB)
        const maxSize = 2 * 1024 * 1024
        if (file.size > maxSize) {
            photoError.value = `File terlalu besar. Maksimal 2MB per foto, file ini ${(file.size / 1024 / 1024).toFixed(2)}MB`
            return
        }

        try {
            // Compress image to approximately 200KB
            const compressedFile = await compressImage(file, {
                maxSize: 0.2, // 200KB target
                quality: 0.8,
                maxWidth: 1920,
                maxHeight: 1920,
            })

            // Create preview
            const url = URL.createObjectURL(compressedFile)
            photoPreviews.value.push({
                url,
                size: compressedFile.size,
                file: compressedFile,
            })
        } catch (error) {
            photoError.value = `Error compressing image: ${error}`
            return
        }
    }

    // Reset input
    if (photosInput.value) {
        photosInput.value.value = ''
    }
}

const removePhoto = (index: number) => {
    const preview = photoPreviews.value[index]
    URL.revokeObjectURL(preview.url)
    photoPreviews.value.splice(index, 1)
    photoError.value = ''
}

const openImageViewer = (index: number) => {
    const preview = photoPreviews.value[index]
    selectedImageSrc.value = preview.url
    selectedImageAlt.value = preview.file.name
    selectedImageIndex.value = index
    showImageViewer.value = true
}

const handleSubmit = async () => {
    photoError.value = ''

    // Validation
    if (!formData.value.judul.trim()) {
        photoError.value = 'Judul kegiatan harus diisi'
        return
    }

    if (!formData.value.tanggal) {
        photoError.value = 'Tanggal kegiatan harus diisi'
        return
    }

    if (!formData.value.status_publikasi) {
        photoError.value = 'Status publikasi harus dipilih'
        return
    }

    if (photoPreviews.value.length === 0) {
        photoError.value = 'Minimal 1 foto harus diunggah'
        return
    }

    isSubmitting.value = true

    try {
        // Create FormData
        const formDataObj = new FormData()
        formDataObj.append('judul', formData.value.judul)
        formDataObj.append('tanggal', formData.value.tanggal)
        formDataObj.append('status_publikasi', formData.value.status_publikasi)
        formDataObj.append('status', formData.value.status)

        // Add photos
        photoPreviews.value.forEach((preview, index) => {
            formDataObj.append(`foto`, preview.file, preview.file.name)
        })

        const result = await galleryStore.addGallery(formDataObj)

        if (result.success) {
            toastStore.success('Sukses', result.message)
            resetForm()
            emit('success')
            // Close modal after success message shown
            isSubmitting.value = false
            await new Promise(resolve => setTimeout(resolve, 300))
            closeModal()
        } else {
            photoError.value = result.message
            emit('error', result.message)
            isSubmitting.value = false
        }
    } catch (error: any) {
        const message = error.message || 'Terjadi kesalahan saat menambahkan galeri kegiatan'
        photoError.value = message
        emit('error', message)
        isSubmitting.value = false
    }
}

const resetForm = () => {
    formData.value = {
        judul: '',
        tanggal: '',
        status_publikasi: '',
        status: 'active',
    }
    photoPreviews.value.forEach(preview => {
        URL.revokeObjectURL(preview.url)
    })
    photoPreviews.value = []
    photoError.value = ''
}

// Watch modal close
watch(() => props.modelValue, (newVal) => {
    if (!newVal) {
        resetForm()
    }
})
</script>

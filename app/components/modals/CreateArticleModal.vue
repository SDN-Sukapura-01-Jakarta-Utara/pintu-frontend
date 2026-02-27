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
                class="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-2xl w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">

                <!-- Header -->
                <div
                    class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Tambah Artikel</h2>
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
                                Judul Artikel
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <input v-model="formData.judul" type="text" placeholder="Masukkan judul artikel..."
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                                :disabled="isSubmitting" />
                        </div>

                        <!-- Tanggal -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                Tanggal Artikel
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <input v-model="formData.tanggal" type="date"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                                :disabled="isSubmitting" />
                        </div>

                        <!-- Kategori -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                Kategori
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <select v-model="formData.kategori"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer"
                                :disabled="isSubmitting">
                                <option value="">Pilih Kategori</option>
                                <option value="Berita Sekolah">Berita Sekolah</option>
                                <option value="Kegiatan Siswa">Kegiatan Siswa</option>
                                <option value="Prestasi">Prestasi</option>
                                <option value="Informasi Akademik">Informasi Akademik</option>
                                <option value="Informasi Non-Akademik">Informasi Non-Akademik</option>
                                <option value="Kegiatan Guru dan Staf">Kegiatan Guru dan Staf</option>
                                <option value="Edukasi">Edukasi</option>
                            </select>
                        </div>

                        <!-- Deskripsi -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                Deskripsi
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <RichTextEditor v-model="formData.deskripsi" :disabled="isSubmitting" />
                        </div>

                        <!-- Gambar Upload -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                Gambar Artikel
                                <span class="text-red-600 ml-1">*</span>
                            </label>

                            <!-- Image Preview -->
                            <div v-if="imagePreview" class="mb-3 sm:mb-4 relative group">
                                <img :src="imagePreview" alt="Preview"
                                    class="w-full h-32 sm:h-48 object-cover rounded-xl border-2 border-gray-200 shadow-md" />
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
                            <div @click="$refs.imageInput.click()" @dragover.prevent="isDraggingImage = true"
                                @dragleave="isDraggingImage = false" @drop.prevent="handleImageDrop" :class="[
                                    'relative border-2 border-dashed rounded-xl p-4 sm:p-8 text-center cursor-pointer transition-all duration-300',
                                    isDraggingImage
                                        ? 'border-blue-500 bg-blue-50 scale-105'
                                        : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                                ]">
                                <input ref="imageInput" type="file" accept="image/*" class="hidden"
                                    @change="handleImageSelect" :disabled="isSubmitting" />

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
                                             gambar di sini</p>
                                         <p class="text-xs text-gray-600 mt-1">Format: JPG, PNG, WebP (Maks. 2MB)</p>
                                     </div>
                                </div>

                                <!-- Error Message -->
                                <div v-if="imageError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p class="text-sm text-red-700 font-medium">{{ imageError }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Files Upload -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                File Pendukung (Opsional)
                            </label>

                            <!-- File List -->
                            <div v-if="selectedFiles.length > 0" class="mb-4 space-y-2">
                                <div v-for="(file, index) in selectedFiles" :key="index"
                                    class="flex items-center justify-between gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div class="flex items-center gap-2 flex-1 min-w-0">
                                        <i class="fa-solid fa-file text-blue-600"></i>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                                {{ file.name }}
                                            </p>
                                            <p class="text-xs text-gray-600">{{ formatFileSize(file.size) }}</p>
                                        </div>
                                    </div>
                                    <button type="button" @click="removeFile(index)" :disabled="isSubmitting"
                                        class="flex-shrink-0 p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                        title="Hapus file">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                clip-rule="evenodd"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <!-- Upload Area -->
                            <div @click="$refs.filesInput.click()" @dragover.prevent="isDraggingFiles = true"
                                @dragleave="isDraggingFiles = false" @drop.prevent="handleFilesDrop" :class="[
                                    'relative border-2 border-dashed rounded-xl p-4 sm:p-6 text-center cursor-pointer transition-all duration-300',
                                    isDraggingFiles
                                        ? 'border-green-500 bg-green-50 scale-105'
                                        : 'border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50'
                                ]">
                                <input ref="filesInput" type="file" multiple
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,.jpg,.jpeg,.png"
                                    class="hidden" @change="handleFilesSelect" :disabled="isSubmitting" />

                                <div class="flex flex-col items-center gap-2 sm:gap-3">
                                    <div
                                        class="h-10 sm:h-12 w-10 sm:w-12 rounded-full bg-green-100 flex items-center justify-center">
                                        <svg class="w-5 sm:w-6 h-5 sm:h-6 text-green-600" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 4v16m8-8H4"></path>
                                        </svg>
                                    </div>
                                    <div>
                                         <p class="text-xs sm:text-sm font-semibold text-gray-900">Klik atau drag file
                                             di sini</p>
                                         <p class="text-xs text-gray-600 mt-1">Format: PDF, DOC, DOCX, XLS, XLSX, PPT,
                                             PPTX, CSV, TXT, JPG, PNG (Maks. 1MB per file)</p>
                                     </div>
                                </div>

                                <!-- Error Message -->
                                <div v-if="filesError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p class="text-sm text-red-700 font-medium">{{ filesError }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Penulis -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                Penulis
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <input v-model="formData.penulis" type="text" placeholder="Masukkan nama penulis..."
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                                :disabled="isSubmitting" />
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
                                <option value="">Pilih Status</option>
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
                        <div v-if="submitError" class="p-3 sm:p-4 bg-red-50 border-2 border-red-200 rounded-xl">
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
                                    <p class="text-xs sm:text-sm text-red-800 mt-1">{{ submitError }}</p>
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
                                {{ isSubmitting ? 'Menyimpan...' : 'Simpan Artikel' }}
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
import { useArticleStore } from '~/stores/ArticleStore'
import { useToastStore } from '~/stores/ToastStore'
import RichTextEditor from '~/components/common/RichTextEditor.vue'

const props = defineProps({
    modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue', 'success', 'error'])

const articleStore = useArticleStore()
const toastStore = useToastStore()

// Form state
const formData = ref({
    judul: '',
    tanggal: '',
    kategori: '',
    deskripsi: '',
    penulis: '',
    status_publikasi: 'draft',
    status: 'active',
})

const imagePreview = ref<string | null>(null)
const selectedFiles = ref<File[]>([])
const isDraggingImage = ref(false)
const isDraggingFiles = ref(false)
const imageError = ref<string | null>(null)
const filesError = ref<string | null>(null)
const submitError = ref<string | null>(null)

const isSubmitting = computed(() => articleStore.isSubmitting)

const handleImageSelect = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files?.[0]) {
        handleImageFile(input.files[0])
    }
}

const handleImageDrop = (event: DragEvent) => {
    isDraggingImage.value = false
    if (event.dataTransfer?.files?.[0]) {
        handleImageFile(event.dataTransfer.files[0])
    }
}

const handleImageFile = (file: File) => {
    imageError.value = null

    if (file.size > 2 * 1024 * 1024) {
        imageError.value = 'Ukuran gambar tidak boleh lebih dari 2MB'
        return
    }

    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        imageError.value = 'Format gambar hanya boleh JPG, PNG, GIF, atau WebP'
        return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
        imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
}

const removeImage = () => {
    imagePreview.value = null
    imageError.value = null
}

const handleFilesSelect = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files) {
        handleFiles(Array.from(input.files))
    }
}

const handleFilesDrop = (event: DragEvent) => {
    isDraggingFiles.value = false
    if (event.dataTransfer?.files) {
        handleFiles(Array.from(event.dataTransfer.files))
    }
}

const handleFiles = (files: File[]) => {
    filesError.value = null

    const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/csv',
        'text/plain',
        'image/jpeg',
        'image/png',
    ]

    for (const file of files) {
        if (file.size > 1 * 1024 * 1024) {
            filesError.value = `File ${file.name} terlalu besar (maks. 1MB)`
            return
        }

        if (!validTypes.includes(file.type)) {
            filesError.value = `Format file ${file.name} tidak didukung`
            return
        }

        selectedFiles.value.push(file)
    }
}

const removeFile = (index: number) => {
    selectedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (event) => {
            const img = new Image()
            img.onload = () => {
                const canvas = document.createElement('canvas')
                let { width, height } = img
                
                // Resize if too large
                if (width > 1920) {
                    const ratio = 1920 / width
                    width = 1920
                    height = height * ratio
                }
                
                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext('2d')
                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height)
                }
                
                // Compress to target size (300KB)
                let quality = 0.9
                let compressed = canvas.toDataURL('image/jpeg', quality)
                
                while (compressed.length > 300 * 1024 && quality > 0.1) {
                    quality -= 0.1
                    compressed = canvas.toDataURL('image/jpeg', quality)
                }
                
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(new File([blob], file.name, { type: 'image/jpeg' }))
                        } else {
                            resolve(file)
                        }
                    },
                    'image/jpeg',
                    quality
                )
            }
            img.src = event.target?.result as string
        }
        reader.readAsDataURL(file)
    })
}

const compressFile = async (file: File): Promise<File> => {
    // Files are validated at upload time to max 1MB
    // Just return as-is
    return file
}

const closeModal = () => {
    emit('update:modelValue', false)
}

const handleSubmit = async () => {
    submitError.value = null

    // Validation
    if (!formData.value.judul.trim()) {
        submitError.value = 'Judul artikel tidak boleh kosong'
        return
    }

    if (!formData.value.tanggal) {
        submitError.value = 'Tanggal artikel harus dipilih'
        return
    }

    if (!formData.value.kategori) {
        submitError.value = 'Kategori harus dipilih'
        return
    }

    if (!formData.value.deskripsi.trim()) {
        submitError.value = 'Deskripsi tidak boleh kosong'
        return
    }

    if (!imagePreview.value) {
        submitError.value = 'Gambar artikel harus diunggah'
        return
    }

    if (!formData.value.penulis.trim()) {
        submitError.value = 'Nama penulis tidak boleh kosong'
        return
    }

    if (!formData.value.status_publikasi) {
        submitError.value = 'Status publikasi harus dipilih'
        return
    }

    try {
        const formDataObj = new FormData()
        formDataObj.append('judul', formData.value.judul)
        formDataObj.append('tanggal', formData.value.tanggal)
        formDataObj.append('kategori', formData.value.kategori)
        formDataObj.append('deskripsi', formData.value.deskripsi)
        formDataObj.append('penulis', formData.value.penulis)
        formDataObj.append('status_publikasi', formData.value.status_publikasi)
        formDataObj.append('status', formData.value.status)

        // Compress and add image if preview exists
        if (imagePreview.value) {
            const imageFile = await fetch(imagePreview.value)
                .then(r => r.blob())
                .then(blob => new File([blob], 'artikel-image.jpg', { type: 'image/jpeg' }))
            const compressedImage = await compressImage(imageFile)
            formDataObj.append('gambar', compressedImage)
        }

        // Compress and add files
        for (const file of selectedFiles.value) {
            const compressedFile = await compressFile(file)
            formDataObj.append('files', compressedFile)
        }

        const result = await articleStore.addArticle(formDataObj)

        if (result.success) {
            toastStore.success('Sukses', result.message)
            emit('success')
            closeModal()

            // Reset form
            formData.value = {
                judul: '',
                tanggal: '',
                kategori: '',
                deskripsi: '',
                penulis: '',
                status_publikasi: 'draft',
                status: 'active',
            }
            imagePreview.value = null
            selectedFiles.value = []
        } else {
            submitError.value = result.message
            toastStore.error('Gagal', result.message)
            emit('error', result.message)
        }
    } catch (error: any) {
        const message = error.message || 'Terjadi kesalahan saat menambahkan artikel'
        submitError.value = message
        toastStore.error('Gagal', message)
        emit('error', message)
    }
}
</script>

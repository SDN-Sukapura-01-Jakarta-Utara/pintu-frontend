<template>
    <!-- Image Viewer Modal -->
    <ImageViewerModal v-model="showImageViewer" :image-src="selectedImageSrc" :image-alt="selectedImageAlt"
        :images="gallery?.foto.map(p => ({ src: p.url, alt: p.id })) || []" :initial-index="selectedImageIndex" />

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
                class="bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-lg pointer-events-auto relative overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">

                <!-- Header -->
                <div
                    class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Detail Galeri Kegiatan</h2>
                    </div>

                    <button type="button" @click.stop="closeModal"
                        :title="'Tutup'"
                        class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 backdrop-blur-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Body -->
                <div v-if="isLoading" class="p-4 sm:p-6 lg:p-8 flex items-center justify-center flex-1">
                    <div class="flex flex-col items-center gap-3 sm:gap-4">
                        <div class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
                        </div>
                        <p class="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Memuat detail galeri kegiatan...</p>
                    </div>
                </div>

                <div v-else-if="gallery" class="p-3 sm:p-5 md:p-8 relative z-10 overflow-y-auto flex-1 space-y-6">
                    <!-- Gallery Info Card -->
                    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border-2 border-blue-200 p-3 sm:p-4 md:p-6">
                        <!-- Header with Judul and Status -->
                        <div class="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <div class="min-w-0">
                                <h3 class="text-sm sm:text-lg md:text-xl font-bold text-gray-900 truncate">{{ gallery.judul }}</h3>
                            </div>
                            <div :class="[
                                'px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap flex-shrink-0',
                                gallery.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            ]">
                                {{ gallery.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                            </div>
                        </div>

                        <!-- Gallery Meta Info -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                            <div class="flex items-center gap-2 sm:gap-2.5">
                                <div class="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-blue-200 flex items-center justify-center">
                                    <svg class="w-3 sm:w-4 h-3 sm:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-[11px] sm:text-xs text-gray-600">Tanggal</p>
                                    <p class="text-[11px] sm:text-xs font-semibold text-gray-900 truncate">{{ formatDate(gallery.tanggal) }}</p>
                                </div>
                            </div>

                            <div class="flex items-center gap-2 sm:gap-2.5">
                                <div class="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-orange-200 flex items-center justify-center">
                                    <svg class="w-3 sm:w-4 h-3 sm:h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-[11px] sm:text-xs text-gray-600">Foto</p>
                                    <p class="text-[11px] sm:text-xs font-semibold text-gray-900">{{ gallery.foto.length }} foto</p>
                                </div>
                            </div>
                        </div>

                        <!-- Status Publikasi Badge -->
                        <div class="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-blue-300">
                            <span :class="[
                                'inline-flex items-center gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold',
                                gallery.status_publikasi === 'published'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                            ]">
                                <i :class="[
                                    gallery.status_publikasi === 'published' ? 'fa-solid fa-check-circle' : 'fa-solid fa-hourglass-end',
                                    'w-3 h-3'
                                ]"></i>
                                {{ gallery.status_publikasi === 'published' ? 'Published' : 'Draft' }}
                            </span>
                        </div>
                    </div>

                    <!-- Foto Gallery -->
                    <div v-if="gallery.foto.length > 0" class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
                        <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                            <h3 class="text-sm sm:text-base md:text-base font-bold text-gray-900 flex items-center gap-2">
                                <svg class="w-3.5 sm:w-4 h-3.5 sm:h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span>Foto Kegiatan ({{ gallery.foto.length }} foto)</span>
                            </h3>
                        </div>
                        <div class="p-3 sm:p-4 md:p-6">
                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div v-for="(photo, index) in gallery.foto" :key="photo.id"
                                    class="relative group cursor-pointer aspect-square">
                                    <img :src="photo.url" :alt="`Photo ${index + 1}`"
                                        class="w-full h-full object-cover rounded-lg border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                                        @click="openImageViewer(index)" />
                                    <div class="absolute inset-0 bg-black/20 rounded-lg pointer-events-none"></div>
                                    <div class="absolute inset-0 flex items-center justify-center transition-opacity pointer-events-none">
                                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"></path>
                                        </svg>
                                    </div>
                                    <span class="absolute bottom-1 right-1 text-xs font-semibold bg-gray-900/80 text-white px-2 py-1 rounded">
                                        {{ (photo.size / 1024).toFixed(1) }}KB
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Timeline Info -->
                    <div class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 p-3 sm:p-4 md:p-6">
                        <h3 class="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                            <svg class="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Informasi
                        </h3>
                        <div class="space-y-2 text-xs sm:text-sm">
                            <div class="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2 py-2 border-b border-gray-100">
                                <span class="text-gray-600">Dibuat pada:</span>
                                <span class="font-medium text-gray-900">{{ formatDateTime(gallery.created_at) }}</span>
                            </div>
                            <div v-if="gallery.updated_at" class="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2 py-2">
                                <span class="text-gray-600">Diperbarui pada:</span>
                                <span class="font-medium text-gray-900">{{ formatDateTime(gallery.updated_at) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Close Button -->
                <div class="p-4 sm:p-8 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                    <button @click="closeModal"
                        class="w-full px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200 cursor-pointer">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ImageViewerModal from './ImageViewerModal.vue'
import type { ActivityGalleryData } from '~/types/ActivityGalleryType'
import { useActivityGalleryStore } from '~/stores/ActivityGalleryStore'

const props = defineProps<{
    modelValue: boolean
    galleryId: number
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>()

const galleryStore = useActivityGalleryStore()

// Data
const gallery = ref<ActivityGalleryData | null>(null)
const isLoading = ref(false)
const error = ref('')

// Image viewer
const showImageViewer = ref(false)
const selectedImageSrc = ref('')
const selectedImageAlt = ref('')
const selectedImageIndex = ref(0)

// Methods
const closeModal = () => {
    emit('update:modelValue', false)
}

const openImageViewer = (index: number) => {
    if (!gallery.value) return
    const photo = gallery.value.foto[index]
    selectedImageSrc.value = photo.url
    selectedImageAlt.value = photo.id
    selectedImageIndex.value = index
    showImageViewer.value = true
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

const fetchGalleryDetail = async (id: number) => {
    isLoading.value = true
    error.value = ''

    try {
        const result = await galleryStore.fetchGalleryById(id)
        if (result.success) {
            gallery.value = galleryStore.currentGallery
        } else {
            error.value = result.message
        }
    } catch (err: any) {
        error.value = err.message || 'Gagal memuat detail'
    } finally {
        isLoading.value = false
    }
}

// Watch
watch([() => props.modelValue, () => props.galleryId], ([newVal, newId]) => {
    if (newVal && newId) {
        fetchGalleryDetail(newId)
    }
})
</script>

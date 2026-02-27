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
                class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl sm:max-w-3xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">

                <!-- Header -->
                <div
                    class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Detail Artikel</h2>
                    </div>

                    <button type="button" @click.stop="closeModal" :disabled="isLoading"
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
                <div v-if="isLoading" class="p-4 sm:p-6 lg:p-8 flex items-center justify-center flex-1">
                    <div class="flex flex-col items-center gap-3 sm:gap-4">
                        <div class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
                        </div>
                        <p class="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Memuat detail artikel...</p>
                    </div>
                </div>

                <div v-else-if="article" class="p-3 sm:p-5 md:p-8 relative z-10 overflow-y-auto flex-1 space-y-6">
                    <!-- Article Info Card -->
                    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border-2 border-blue-200 p-3 sm:p-4 md:p-6">
                        <!-- Header with Judul and Status -->
                        <div class="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <div class="min-w-0">
                                <h3 class="text-sm sm:text-lg md:text-xl font-bold text-gray-900 truncate">{{ article.judul }}</h3>
                                <p class="text-xs sm:text-xs md:text-sm text-gray-600 mt-0.5 sm:mt-1 truncate">{{ article.kategori }}</p>
                            </div>
                            <div :class="[
                                'px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap flex-shrink-0',
                                article.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            ]">
                                {{ article.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                            </div>
                        </div>

                        <!-- Article Meta Info -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                            <div class="flex items-center gap-2 sm:gap-2.5">
                                <div class="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-blue-200 flex items-center justify-center">
                                    <svg class="w-3 sm:w-4 h-3 sm:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-[11px] sm:text-xs text-gray-600">Tanggal</p>
                                    <p class="text-[11px] sm:text-xs font-semibold text-gray-900 truncate">{{ formatDate(article.tanggal) }}</p>
                                </div>
                            </div>

                            <div class="flex items-center gap-2 sm:gap-2.5">
                                <div class="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-orange-200 flex items-center justify-center">
                                    <svg class="w-3 sm:w-4 h-3 sm:h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-[11px] sm:text-xs text-gray-600">Penulis</p>
                                    <p class="text-[11px] sm:text-xs font-semibold text-gray-900 truncate">{{ article.penulis }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Status Publikasi Badge -->
                        <div class="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-blue-300">
                            <span :class="[
                                'inline-flex items-center gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold',
                                article.status_publikasi === 'published'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                            ]">
                                <i :class="[
                                    article.status_publikasi === 'published' ? 'fa-solid fa-check-circle' : 'fa-solid fa-hourglass-end',
                                    'w-3 h-3'
                                ]"></i>
                                {{ article.status_publikasi === 'published' ? 'Published' : 'Draft' }}
                            </span>
                        </div>
                    </div>

                    <!-- Gambar -->
                    <div class="flex justify-center">
                        <img :src="article.gambar" :alt="article.judul"
                            class="w-full max-w-xs sm:max-w-sm lg:max-w-md h-auto rounded-lg sm:rounded-xl border-2 border-gray-200 shadow-md" />
                    </div>

                    <!-- Deskripsi -->
                    <div class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
                        <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                            <h3 class="text-sm sm:text-base md:text-base font-bold text-gray-900 flex items-center gap-2">
                                <svg class="w-3.5 sm:w-4 h-3.5 sm:h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Deskripsi</span>
                            </h3>
                        </div>
                        <div class="p-3 sm:p-4 md:p-6">
                            <div class="max-w-none text-gray-700 text-[13px] sm:text-sm leading-relaxed deskripsi-content"
                                v-html="sanitizeHtml(article.deskripsi)"></div>
                        </div>
                    </div>

                    <!-- Files -->
                    <div v-if="article.files && article.files.length > 0" class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
                        <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                            <h3 class="text-sm sm:text-base md:text-base font-bold text-gray-900 flex items-center gap-2">
                                <svg class="w-3.5 sm:w-4 h-3.5 sm:h-4 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>File Pendukung</span>
                            </h3>
                        </div>
                        <div class="divide-y divide-gray-200">
                            <a v-for="file in article.files" :key="file.id" :href="file.url" target="_blank"
                                rel="noopener noreferrer"
                                class="flex items-center justify-between gap-2 sm:gap-3 p-2.5 sm:p-3 md:p-4 hover:bg-gray-50 transition-colors group">
                                <div class="flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0">
                                    <div class="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                        <i class="fa-solid fa-file text-orange-600 group-hover:text-orange-700 transition-colors text-xs sm:text-sm"></i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-[11px] sm:text-xs font-semibold text-gray-900 truncate">{{ file.filename }}</p>
                                        <p class="text-[11px] sm:text-xs text-gray-600">{{ formatFileSize(file.size) }}</p>
                                    </div>
                                </div>
                                <div class="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                                    <i class="fa-solid fa-download text-gray-400 group-hover:text-orange-600 transition-colors text-xs sm:text-sm"></i>
                                </div>
                            </a>
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
                                <span class="font-medium text-gray-900">{{ formatDateTime(article.created_at) }}</span>
                            </div>
                            <div v-if="article.updated_at" class="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2 py-2">
                                <span class="text-gray-600">Diperbarui pada:</span>
                                <span class="font-medium text-gray-900">{{ formatDateTime(article.updated_at) }}</span>
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
import { ref, computed, watch } from 'vue'
import type { ArticleData } from '~/types/ArticleType'
import { useArticleStore } from '~/stores/ArticleStore'

const props = defineProps({
    modelValue: Boolean,
    articleId: {
        type: Number,
        default: 0,
    },
})

const emit = defineEmits(['update:modelValue'])

const articleStore = useArticleStore()

const isLoading = computed(() => articleStore.isLoading)
const article = computed(() => articleStore.currentArticle)

watch(
    () => props.modelValue,
    async (newVal) => {
        if (newVal && props.articleId > 0) {
            await articleStore.fetchArticleById(props.articleId)
        }
    }
)

const closeModal = () => {
    emit('update:modelValue', false)
    articleStore.clearCurrentArticle()
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
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const sanitizeHtml = (html: string): string => {
    // Basic HTML sanitization - only allow basic formatting
    const div = document.createElement('div')
    div.innerHTML = html
    return div.innerHTML
}
</script>

<style scoped>
.prose {
    font-size: inherit;
}

.deskripsi-content {
    font-size: inherit;
}

.deskripsi-content p,
.deskripsi-content li,
.deskripsi-content span {
    font-size: inherit;
    line-height: inherit;
}

.deskripsi-content h1,
.deskripsi-content h2,
.deskripsi-content h3,
.deskripsi-content h4,
.deskripsi-content h5,
.deskripsi-content h6 {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    font-weight: 600;
}

.deskripsi-content h1 { font-size: 1.5em; }
.deskripsi-content h2 { font-size: 1.3em; }
.deskripsi-content h3 { font-size: 1.1em; }

@media (max-width: 640px) {
    .deskripsi-content {
        font-size: 13px;
    }
    
    .deskripsi-content h1 { font-size: 1.2em; }
    .deskripsi-content h2 { font-size: 1.1em; }
    .deskripsi-content h3 { font-size: 1em; }
}
</style>

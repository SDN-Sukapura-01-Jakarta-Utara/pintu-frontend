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
            class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pointer-events-none">
            <div
                class="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-lg md:max-w-2xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] md:max-h-[85vh]">

                <!-- Header with Red Gradient Background -->
                <div
                    class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <!-- Animated gradient blobs -->
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0">
                    </div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0">
                    </div>

                    <!-- Header Content -->
                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Detail Sistem</h2>
                    </div>

                    <!-- Close Button -->
                    <button type="button" @click.stop="closeModal" :title="'Tutup'"
                        class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 backdrop-blur-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Body with padding and scrollbar -->
                <div class="p-3 sm:p-5 md:p-8 relative z-10 overflow-y-auto flex-1">
                    <!-- Loading State -->
                    <div v-if="isLoading" class="flex items-center justify-center py-12">
                        <div class="flex flex-col items-center gap-4">
                            <div class="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600">
                            </div>
                            <p class="text-sm text-gray-600 font-medium">Memuat detail sistem...</p>
                        </div>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="error"
                        class="rounded-lg sm:rounded-xl border-2 border-red-200 bg-red-50 p-3 sm:p-4 md:p-6">
                        <div class="flex items-start gap-3 sm:gap-4">
                            <div class="flex-shrink-0">
                                <svg class="h-5 sm:h-6 w-5 sm:w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="min-w-0">
                                <h3 class="text-base sm:text-lg font-semibold text-red-900">Gagal memuat data</h3>
                                <p class="mt-1 text-xs sm:text-sm text-red-800 break-words">{{ error }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Success State -->
                    <div v-else-if="system" class="space-y-6">
                        <!-- System Basic Info Card -->
                        <div
                            class="bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg sm:rounded-xl border-2 border-violet-200 p-3 sm:p-4 md:p-6">
                            <div class="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                                <div class="min-w-0">
                                    <h3 class="text-sm sm:text-lg md:text-xl font-bold text-gray-900 truncate">{{
                                        system.nama }}</h3>
                                    <p class="text-xs sm:text-xs md:text-sm text-gray-600 mt-0.5 sm:mt-1 truncate">
                                        {{ system.description }}</p>
                                </div>
                                <div :class="[
                                    'px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap flex-shrink-0',
                                    system.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                ]">
                                    {{ system.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                </div>
                            </div>

                            <!-- System Meta Info -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                                <div class="flex items-center gap-2 sm:gap-2.5">
                                    <div
                                        class="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-pink-200 flex items-center justify-center">
                                        <svg class="w-3 sm:w-4 h-3 sm:h-4 text-pink-600" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                                            </path>
                                        </svg>
                                    </div>
                                    <div class="min-w-0">
                                        <p class="text-[11px] sm:text-xs text-gray-600">Dibuat Pada</p>
                                        <p class="text-[11px] sm:text-xs font-semibold text-gray-900 truncate">{{
                                            formatDate(system.created_at) }}</p>
                                    </div>
                                </div>

                                <div class="flex items-center gap-2 sm:gap-2.5">
                                    <div
                                        class="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-amber-200 flex items-center justify-center">
                                        <svg class="w-3 sm:w-4 h-3 sm:h-4 text-amber-600" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <div class="min-w-0">
                                        <p class="text-[11px] sm:text-xs text-gray-600">Diperbarui</p>
                                        <p class="text-[11px] sm:text-xs font-semibold text-gray-900 truncate">{{
                                            formatDate(system.updated_at) }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- System Details Card -->
                        <div class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
                            <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                                <h3
                                    class="text-sm sm:text-base md:text-base font-bold text-gray-900 flex items-center gap-2">
                                    <svg class="w-3.5 sm:w-4 h-3.5 sm:h-4 text-red-600 flex-shrink-0" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span class="truncate">Detail Sistem</span>
                                </h3>
                            </div>

                            <!-- Details Grid -->
                            <div class="divide-y divide-gray-200">
                                <!-- Nama -->
                                <div class="p-2.5 sm:p-3 md:p-4 hover:bg-gray-50 transition-colors">
                                    <p class="text-xs sm:text-sm font-semibold text-gray-600">Nama Sistem</p>
                                    <p class="text-xs sm:text-sm font-medium text-gray-900 mt-1">{{ system.nama }}
                                    </p>
                                </div>

                                <!-- Deskripsi -->
                                <div class="p-2.5 sm:p-3 md:p-4 hover:bg-gray-50 transition-colors">
                                    <p class="text-xs sm:text-sm font-semibold text-gray-600">Deskripsi</p>
                                    <p class="text-xs sm:text-sm text-gray-900 mt-1 line-clamp-3">{{
                                        system.description }}</p>
                                </div>

                                <!-- Status -->
                                <div class="p-2.5 sm:p-3 md:p-4 hover:bg-gray-50 transition-colors">
                                    <p class="text-xs sm:text-sm font-semibold text-gray-600 mb-2">Status</p>
                                    <div class="flex items-center gap-2">
                                        <span :class="[
                                            'inline-flex items-center rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-semibold',
                                            system.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800',
                                        ]">
                                            <span :class="[
                                                'inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full mr-1 sm:mr-2',
                                                system.status === 'active' ? 'bg-green-600' : 'bg-red-600',
                                            ]"></span>
                                            {{ system.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="border-t border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 flex-shrink-0 flex gap-2">
                    <button @click="closeModal"
                        class="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold text-xs sm:text-sm hover:shadow-lg transition-all duration-200 cursor-pointer">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>()

const props = defineProps<{
    modelValue: boolean
    systemId: number | null
}>()

const system = ref<any>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

// Close modal
const closeModal = () => {
    emit('update:modelValue', false)
}

// Format date
const formatDate = (dateString: string): string => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Fetch system detail
const fetchSystemDetail = async () => {
    if (!props.systemId) return

    isLoading.value = true
    error.value = null

    try {
        const { getSystemById } = await import('~/services/user')
        const response: any = await getSystemById(props.systemId as number)
        system.value = response.data
    } catch (err: any) {
        console.error('Error fetching system detail:', err)
        error.value = err.data?.message || err.message || 'Gagal memuat detail sistem'
    } finally {
        isLoading.value = false
    }
}

// Watch for modal open
watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal && props.systemId) {
            fetchSystemDetail()
        } else {
            system.value = null
            error.value = null
        }
    }
)
</script>

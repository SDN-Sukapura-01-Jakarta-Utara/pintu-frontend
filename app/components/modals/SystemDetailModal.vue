<template>
    <!-- Backdrop -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="modelValue" @click="closeModal"
            class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"></div>
    </Transition>

    <!-- Modal -->
    <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4">
        <div v-if="modelValue"
            class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div
                class="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md pointer-events-auto relative overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[80vh]">

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
                <div class="p-4 sm:p-8 relative z-10 overflow-y-auto flex-1">
                    <!-- Loading State -->
                    <div v-if="isLoading" class="flex items-center justify-center py-8">
                        <div class="flex flex-col items-center gap-3">
                            <div
                                class="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
                            </div>
                            <p class="text-sm text-gray-600 font-medium">Memuat detail sistem...</p>
                        </div>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="error" class="rounded-lg border-2 border-red-200 bg-red-50 p-4">
                        <p class="text-xs sm:text-sm text-red-700 font-medium">{{ error }}</p>
                        <button @click="fetchSystemDetail"
                            class="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600 text-white font-semibold text-xs hover:bg-red-700 transition-colors">
                            <i class="fa-solid fa-rotate-right w-3 h-3"></i>
                            Coba Lagi
                        </button>
                    </div>

                    <!-- Success State -->
                    <div v-else-if="system">
                        <div class="space-y-4">
                            <!-- Nama -->
                            <div>
                                <p class="text-xs sm:text-sm font-semibold text-gray-900 mb-1">Nama Sistem</p>
                                <p class="text-xs sm:text-sm text-gray-600 bg-gray-100 rounded-lg px-3 py-2">
                                    {{ system.nama }}
                                </p>
                            </div>

                            <!-- Deskripsi -->
                            <div>
                                <p class="text-xs sm:text-sm font-semibold text-gray-900 mb-1">Deskripsi</p>
                                <p
                                    class="text-xs sm:text-sm text-gray-600 bg-gray-100 rounded-lg px-3 py-2 whitespace-pre-wrap">
                                    {{ system.description }}
                                </p>
                            </div>

                            <!-- Status -->
                            <div>
                                <p class="text-xs sm:text-sm font-semibold text-gray-900 mb-1">Status</p>
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

                            <!-- Created At -->
                            <div>
                                <p class="text-xs sm:text-sm font-semibold text-gray-900 mb-1">Dibuat Pada</p>
                                <p class="text-xs sm:text-sm text-gray-600">
                                    {{ formatDate(system.created_at) }}
                                </p>
                            </div>

                            <!-- Updated At -->
                            <div>
                                <p class="text-xs sm:text-sm font-semibold text-gray-900 mb-1">Diperbarui Pada</p>
                                <p class="text-xs sm:text-sm text-gray-600">
                                    {{ formatDate(system.updated_at) }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="bg-gray-100 px-4 sm:px-8 py-3 sm:py-4 flex-shrink-0">
                    <button @click="closeModal"
                        class="w-full px-4 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold text-xs sm:text-sm hover:shadow-lg transition-all duration-200 cursor-pointer">
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
        const response = await getSystemById(props.systemId as number)
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

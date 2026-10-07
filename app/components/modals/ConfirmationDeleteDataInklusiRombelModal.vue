<template>
    <!-- Backdrop -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="isOpen" @click="handleClose" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"></div>
    </Transition>

    <!-- Modal -->
    <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4">
        <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div class="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto relative overflow-hidden">

                <!-- Header -->
                <div class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-6 py-3 sm:py-4 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-24 h-24 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

                    <div class="relative z-10 flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <i class="fas fa-exclamation-triangle text-white text-lg"></i>
                        </div>
                        <div>
                            <h2 class="text-base sm:text-lg font-bold text-white">Konfirmasi Hapus</h2>
                            <p class="text-xs text-red-100 mt-0.5">Tindakan ini tidak dapat dibatalkan</p>
                        </div>
                    </div>
                </div>

                <!-- Body -->
                <div class="p-4 sm:p-6">
                    <div class="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
                        <div class="flex gap-3">
                            <i class="fas fa-exclamation-circle text-red-600 mt-0.5 flex-shrink-0"></i>
                            <div class="text-sm text-red-800">
                                <p class="font-semibold mb-1">Perhatian!</p>
                                <p>Anda akan menghapus data inklusi per rombel ini. Data yang dihapus tidak dapat dikembalikan.</p>
                            </div>
                        </div>
                    </div>

                    <p class="text-sm text-gray-700 text-center">
                        Apakah Anda yakin ingin menghapus data ini?
                    </p>
                </div>

                <!-- Footer -->
                <div class="flex items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 pt-0">
                    <button type="button" @click="handleClose" :disabled="isDeleting"
                        class="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-semibold text-xs sm:text-sm hover:bg-gray-50 active:bg-gray-100 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        Batal
                    </button>
                    <button type="button" @click="handleDelete" :disabled="isDeleting"
                        class="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 active:from-red-800 active:to-pink-800 text-white font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer">
                        <svg v-if="isDeleting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <i v-else class="fas fa-trash-alt"></i>
                        <span>{{ isDeleting ? 'Menghapus...' : 'Ya, Hapus' }}</span>
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useToast } from '~/composables/useToast'
import { useAuthGuard } from '~/composables/useAuthGuard'

const props = defineProps<{
    modelValue: boolean
    dataId: number | null
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'success': []
}>()

const { success: showToast, error: showErrorToast } = useToast()
const { handle401 } = useAuthGuard()

const isOpen = ref(props.modelValue)
const isDeleting = ref(false)

watch(() => props.modelValue, (newVal) => {
    isOpen.value = newVal
})

watch(isOpen, (newVal) => {
    emit('update:modelValue', newVal)
})

function handleClose() {
    if (!isDeleting.value) {
        isOpen.value = false
    }
}

async function handleDelete() {
    if (isDeleting.value || !props.dataId) return

    isDeleting.value = true

    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        await $fetch<any>(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/delete-data-induk-inklusi-rombel`,
            {
                method: 'POST',
                body: {
                    id: props.dataId
                },
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }
        )

        showToast('Berhasil', 'Data inklusi per rombel berhasil dihapus')
        emit('success')
        isOpen.value = false
    } catch (error: any) {
        console.error('Error deleting data:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }

        const errorMessage = error.data?.message || 'Gagal menghapus data inklusi per rombel.'
        showErrorToast('Gagal Menghapus', errorMessage)
    } finally {
        isDeleting.value = false
    }
}
</script>

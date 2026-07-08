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
                class="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto relative overflow-hidden">

                <!-- Icon and Title -->
                <div class="p-4 sm:p-6">
                    <div class="flex flex-col items-center text-center">
                        <!-- Warning Icon -->
                        <div
                            class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-3 sm:mb-4">
                            <svg class="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                                </path>
                            </svg>
                        </div>

                        <!-- Title -->
                        <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-2">Generate Ulang Barcode</h3>

                        <!-- Message -->
                        <p class="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                            Apakah Anda yakin ingin generate ulang barcode untuk siswa <span class="font-semibold">{{ siswaName }}</span>?
                            <br><br>
                            <span class="text-yellow-600 font-medium">
                                Barcode lama akan digantikan dengan barcode baru.
                            </span>
                        </p>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-3">
                        <button type="button" @click="closeModal" :disabled="isLoading"
                            class="flex-1 px-4 py-2 sm:py-2.5 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                            Batal
                        </button>
                        <button type="button" @click="handleConfirm" :disabled="isLoading"
                            class="flex-1 flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-lg bg-yellow-600 text-white font-semibold text-xs sm:text-sm hover:bg-yellow-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                            <span v-if="isLoading"
                                class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                            {{ isLoading ? 'Memproses...' : 'Ya, Generate Ulang' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useToastStore } from '~/stores/ToastStore'
import { useAuthGuard } from '~/composables/useAuthGuard'

const props = defineProps({
    modelValue: Boolean,
    siswaId: Number,
    siswaName: String,
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    success: []
}>()

const toastStore = useToastStore()
const config = useRuntimeConfig()
const { handle401 } = useAuthGuard()

const isLoading = ref(false)

const handleConfirm = async () => {
    if (!props.siswaId) return

    isLoading.value = true

    try {
        await $fetch(`${config.public.apiBase}/api/v1/peserta-didik/generate-barcode-peserta-didik-by-id`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: {
                id: props.siswaId
            }
        })

        isLoading.value = false
        toastStore.success('Sukses', 'Barcode berhasil digenerate')
        
        // Close modal
        emit('update:modelValue', false)
        
        // Emit success
        await nextTick()
        emit('success')
    } catch (error: any) {
        console.error('Error generating barcode:', error)
        isLoading.value = false

        if (error?.status === 401 || error?.statusCode === 401) {
            await handle401()
            return
        }

        const errorMessage = error?.data?.message || error?.message || 'Gagal generate barcode'
        toastStore.error('Gagal', errorMessage)
    }
}

const closeModal = () => {
    if (!isLoading.value) {
        emit('update:modelValue', false)
    }
}
</script>

<template>
    <!-- Backdrop -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="isOpen" @click="closeModal" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"></div>
    </Transition>

    <!-- Modal -->
    <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4">
        <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div
                class="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto relative overflow-hidden">

                <!-- Header -->
                <div class="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full blur-3xl"></div>
                    <div class="relative z-10 flex items-center gap-3">
                        <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <i class="fas fa-exclamation-triangle text-white text-xl"></i>
                        </div>
                        <div>
                            <h2 class="text-lg font-bold text-white">Konfirmasi Hapus</h2>
                            <p class="text-xs text-red-100 mt-0.5">Tindakan ini tidak dapat dibatalkan</p>
                        </div>
                    </div>
                </div>

                <!-- Body -->
                <div class="p-6">
                    <p class="text-sm text-gray-700 mb-4">
                        Apakah Anda yakin ingin menghapus laporan monitoring bulanan ini?
                    </p>

                    <div v-if="dataInfo" class="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                        <div class="space-y-2 text-xs">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Nama Siswa:</span>
                                <span class="font-semibold text-gray-900">{{ dataInfo.nama || '-' }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">NISN:</span>
                                <span class="font-semibold text-gray-900">{{ dataInfo.nisn || '-' }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Periode:</span>
                                <span class="font-semibold text-gray-900">{{ dataInfo.periode || '-' }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div class="flex gap-2">
                            <i class="fas fa-info-circle text-red-600 text-sm mt-0.5"></i>
                            <p class="text-xs text-red-800">
                                Data yang dihapus tidak dapat dikembalikan. Pastikan Anda sudah yakin sebelum melanjutkan.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                    <button type="button" @click="closeModal" :disabled="isDeleting"
                        class="px-4 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 active:bg-gray-100 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        Batal
                    </button>
                    <button type="button" @click="handleDelete" :disabled="isDeleting"
                        class="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer">
                        <svg v-if="isDeleting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
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
    dataInfo: {
        nama?: string
        nisn?: string
        periode?: string
    } | null
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

async function handleDelete() {
    if (!props.dataId || isDeleting.value) return

    isDeleting.value = true

    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        await $fetch<any>(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/delete-monitoring-bulanan`,
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

        showToast('Berhasil', 'Laporan monitoring bulanan berhasil dihapus')
        emit('success')
        isOpen.value = false
    } catch (error: any) {
        console.error('Error deleting monitoring bulanan:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }

        const errorMessage = error.data?.message || 'Gagal menghapus laporan monitoring bulanan.'
        showErrorToast('Gagal Menghapus', errorMessage)
    } finally {
        isDeleting.value = false
    }
}

function closeModal() {
    if (!isDeleting.value) {
        isOpen.value = false
    }
}
</script>

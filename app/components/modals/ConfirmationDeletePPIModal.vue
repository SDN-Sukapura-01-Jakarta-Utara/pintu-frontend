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
        <div v-if="isOpen"
            class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div
                class="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto relative overflow-hidden">

                <!-- Header -->
                <div class="bg-gradient-to-r from-red-600 via-red-500 to-rose-600 px-6 py-4 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-red-400/20 rounded-full blur-2xl"></div>
                    <div class="relative z-10 flex items-center gap-3">
                        <div class="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
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
                    <div class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
                        <div class="flex items-start gap-3">
                            <i class="fas fa-info-circle text-red-600 mt-0.5"></i>
                            <div class="flex-1">
                                <p class="text-sm font-semibold text-gray-900 mb-1">
                                    Apakah Anda yakin ingin menghapus data PPI ini?
                                </p>
                                <p class="text-xs text-gray-600">
                                    Data yang telah dihapus tidak dapat dikembalikan lagi.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Data Info -->
                    <div v-if="dataInfo" class="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                        <div class="flex justify-between items-start">
                            <span class="text-xs font-semibold text-gray-600">Nama Siswa:</span>
                            <span class="text-xs font-bold text-gray-900 text-right">{{ dataInfo.nama_siswa || '-' }}</span>
                        </div>
                        <div class="flex justify-between items-start">
                            <span class="text-xs font-semibold text-gray-600">Program:</span>
                            <span class="text-xs font-bold text-gray-900 text-right">{{ dataInfo.nama_program || '-' }}</span>
                        </div>
                        <div class="flex justify-between items-start">
                            <span class="text-xs font-semibold text-gray-600">Bidang Studi:</span>
                            <span class="text-xs font-bold text-gray-900 text-right">{{ dataInfo.bidang_studi || '-' }}</span>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex gap-3">
                        <button type="button" @click="closeModal" :disabled="isDeleting"
                            class="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 active:bg-gray-100 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                            Batal
                        </button>
                        <button type="button" @click="handleDelete" :disabled="isDeleting"
                            class="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer">
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
    dataInfo?: {
        nama_siswa: string
        nama_program: string
        bidang_studi: string
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

function closeModal() {
    if (!isDeleting.value) {
        isOpen.value = false
    }
}

async function handleDelete() {
    if (!props.dataId || isDeleting.value) return

    isDeleting.value = true

    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        await $fetch<any>(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/delete-ppi`,
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

        showToast('Berhasil', 'Data PPI berhasil dihapus')
        emit('success')
        isOpen.value = false
    } catch (error: any) {
        console.error('Error deleting PPI:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }

        const errorMessage = error.data?.message || 'Gagal menghapus data PPI.'
        showErrorToast('Gagal Menghapus', errorMessage)
    } finally {
        isDeleting.value = false
    }
}
</script>

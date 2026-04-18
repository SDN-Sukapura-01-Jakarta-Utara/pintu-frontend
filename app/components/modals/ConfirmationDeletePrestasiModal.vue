<template>
    <!-- Backdrop -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="modelValue" @click.self="closeModal"
            class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"></div>
    </Transition>

    <!-- Modal -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-4">
        <div v-if="modelValue"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-4">
            <div class="bg-white rounded-2xl shadow-2xl max-w-xs sm:max-w-sm w-full p-6 sm:p-8 animate-slide-up">
                <!-- Icon -->
                <div class="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <i class="fa-solid fa-trash text-red-600 text-lg sm:text-xl"></i>
                </div>

                <!-- Title -->
                <h3 class="text-lg sm:text-xl font-bold text-gray-900 text-center mb-2 sm:mb-3">Hapus Data Prestasi</h3>

                <!-- Message -->
                <p class="text-sm sm:text-base text-gray-600 text-center mb-4">
                    Apakah Anda yakin ingin menghapus data prestasi ini? Tindakan ini tidak dapat dibatalkan.
                </p>

                <!-- Data Preview -->
                <div v-if="prestasiData" class="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-6 sm:mb-8">
                    <p class="text-xs font-semibold text-gray-700 mb-1">Data yang akan dihapus:</p>
                    <p class="text-sm text-gray-900 font-medium">{{ prestasiData.nama_prestasi }}</p>
                    <p class="text-xs text-gray-600">{{ prestasiData.jenis }} - {{ prestasiData.juara }}</p>
                </div>

                <!-- Buttons -->
                <div class="flex gap-2 sm:gap-3">
                    <button @click="closeModal" :disabled="isDeleting"
                        class="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold text-sm sm:text-base hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:cursor-pointer">
                        Batal
                    </button>
                    <button @click="handleDelete" :disabled="isDeleting"
                        class="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-red-600 text-white font-semibold text-sm sm:text-base hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer hover:cursor-pointer">
                        <i v-if="isDeleting" class="fa-solid fa-spinner text-xs sm:text-sm animate-spin"></i>
                        <span>{{ isDeleting ? 'Menghapus...' : 'Hapus' }}</span>
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePrestasiStore } from '~/stores/PrestasiStore'
import { useToastStore } from '~/stores/ToastStore'

interface Props {
    modelValue: boolean
    prestasiData?: {
        id: number
        nama_prestasi: string
        jenis: string
        juara: string
    } | null
}

interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'success'): void
    (e: 'error'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const prestasiStore = usePrestasiStore()
const toastStore = useToastStore()

const isDeleting = ref(false)

const closeModal = () => {
    if (!isDeleting.value) {
        emit('update:modelValue', false)
    }
}

const handleDelete = async () => {
    if (!props.prestasiData?.id) return

    isDeleting.value = true

    try {
        const result = await prestasiStore.removePrestasi(props.prestasiData.id)

        if (result.success) {
            toastStore.success('Prestasi berhasil dihapus')
            emit('success')
            closeModal()
        } else {
            toastStore.error('Gagal menghapus prestasi', result.message)
            emit('error')
        }
    } catch (error: any) {
        let message = 'Terjadi kesalahan saat menghapus prestasi'
        
        if (error?.data?.error) {
            message = error.data.error
        } else if (error?.data?.message) {
            message = error.data.message
        } else if (error?.message) {
            message = error.message
        }

        toastStore.error('Gagal menghapus prestasi', message)
        emit('error')
    } finally {
        isDeleting.value = false
    }
}
</script>

<style scoped>
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-slide-up {
    animation: slideUp 0.3s ease-out;
}
</style>
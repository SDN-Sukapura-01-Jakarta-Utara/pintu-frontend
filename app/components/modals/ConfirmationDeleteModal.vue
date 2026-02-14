<template>
    <!-- Backdrop -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="modelValue" @click="closeModal" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"></div>
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
                <h3 class="text-lg sm:text-xl font-bold text-gray-900 text-center mb-2 sm:mb-3">{{ title }}</h3>

                <!-- Message -->
                <p class="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8">
                    {{ message }}
                </p>

                <!-- Buttons -->
                <div class="flex gap-2 sm:gap-3">
                    <button @click="closeModal" :disabled="isLoading"
                        class="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold text-sm sm:text-base hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:cursor-pointer">
                        Batal
                    </button>
                    <button @click="handleConfirm" :disabled="isLoading"
                        class="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-red-600 text-white font-semibold text-sm sm:text-base hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer hover:cursor-pointer">
                        <i v-if="isLoading" class="fa-solid fa-spinner text-xs sm:text-sm animate-spin"></i>
                        <span>{{ isLoading ? loadingText : confirmText }}</span>
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
interface Props {
    modelValue: boolean
    title: string
    message: string
    isLoading?: boolean
    confirmText?: string
    loadingText?: string
}

const props = withDefaults(defineProps<Props>(), {
    isLoading: false,
    confirmText: 'Hapus',
    loadingText: 'Menghapus...'
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'confirm': []
}>()

const closeModal = () => {
    if (!props.isLoading) {
        emit('update:modelValue', false)
    }
}

const handleConfirm = () => {
    emit('confirm')
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

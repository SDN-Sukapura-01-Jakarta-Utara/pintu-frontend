<template>
    <!-- Backdrop -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="modelValue" @click="closeModal" class="fixed inset-0 z-50 bg-black/80"></div>
    </Transition>

    <!-- Modal -->
    <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95">
        <div v-if="modelValue"
            class="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            
            <!-- Close Button (Outside Image) -->
            <button type="button" @click.stop="closeModal"
                class="absolute top-6 right-6 z-[70] inline-flex items-center justify-center p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-150 backdrop-blur-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 pointer-events-auto">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>

            <div class="pointer-events-auto relative flex flex-col items-center gap-4">
                <!-- Image Container -->
                <div class="flex items-center justify-center">
                    <img :src="currentImageSrc" :alt="currentImageAlt" class="max-w-2xl max-h-[70vh] object-contain rounded-lg" />
                </div>

                <!-- Bottom Info & Navigation -->
                <div class="bg-black/40 backdrop-blur rounded-lg px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between w-full max-w-2xl">
                    <p class="text-sm text-gray-100 truncate">{{ currentImageAlt }}</p>
                    <div v-if="totalImages > 1" class="flex items-center gap-3 ml-4">
                        <button @click="previousImage"
                            class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 19l-7-7 7-7"></path>
                            </svg>
                        </button>
                        <span class="text-sm text-gray-200 whitespace-nowrap">{{ currentIndex + 1 }} / {{ totalImages }}</span>
                        <button @click="nextImage"
                            class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface ImageViewerProps {
    modelValue: boolean
    imageSrc: string
    imageAlt: string
    images?: Array<{ src: string; alt: string }>
    initialIndex?: number
}

const props = withDefaults(defineProps<ImageViewerProps>(), {
    images: () => [],
    initialIndex: 0
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>()

const currentIndex = ref(0)

const totalImages = computed(() => props.images.length)

const currentImageSrc = computed(() => {
    if (props.images.length > 0 && currentIndex.value < props.images.length) {
        return props.images[currentIndex.value].src
    }
    return props.imageSrc
})

const currentImageAlt = computed(() => {
    if (props.images.length > 0 && currentIndex.value < props.images.length) {
        return props.images[currentIndex.value].alt
    }
    return props.imageAlt
})

const closeModal = () => {
    emit('update:modelValue', false)
}

const nextImage = () => {
    if (currentIndex.value < totalImages.value - 1) {
        currentIndex.value++
    }
}

const previousImage = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--
    }
}

watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal) {
            currentIndex.value = props.initialIndex
        }
    }
)

// Allow keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
    if (!props.modelValue) return
    if (e.key === 'Escape') closeModal()
    if (e.key === 'ArrowRight') nextImage()
    if (e.key === 'ArrowLeft') previousImage()
}

watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal) {
            window.addEventListener('keydown', handleKeydown)
        } else {
            window.removeEventListener('keydown', handleKeydown)
        }
    }
)
</script>

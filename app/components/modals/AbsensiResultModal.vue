<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 scale-50"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-90"
      >
        <div
          v-if="isOpen"
          class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          @click.self="closeModal"
        >
          <div
            class="relative bg-gradient-to-br from-white via-white to-gray-50 rounded-[2rem] shadow-2xl border-4 w-full max-w-xl p-8 sm:p-12 text-center transform transition-all animate-bounce-in"
            :class="borderClass"
          >
            <!-- Decorative circles -->
            <div class="absolute top-0 left-0 w-24 h-24 rounded-full opacity-20 blur-3xl" :class="decorBgClass"></div>
            <div class="absolute bottom-0 right-0 w-28 h-28 rounded-full opacity-20 blur-3xl" :class="decorBgClass"></div>
            
            <!-- Icon with animation -->
            <div class="mb-6 relative">
              <div
                class="inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto shadow-2xl animate-scale-pulse"
                :class="iconBgClass"
              >
                <i :class="iconClass" class="text-5xl sm:text-6xl animate-icon-bounce"></i>
              </div>
              <!-- Ring animation -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full animate-ping-slow opacity-30" :class="iconBgClass"></div>
              </div>
            </div>

            <!-- Title with gradient -->
            <h2
              class="text-3xl sm:text-5xl font-black mb-5 tracking-tight leading-tight animate-slide-up"
              :class="titleClass"
              style="text-shadow: 2px 4px 8px rgba(0,0,0,0.1)"
            >
              {{ title }}
            </h2>

            <!-- Student Name with highlight -->
            <div v-if="studentName" class="mb-5 animate-slide-up-delay">
              <div class="inline-block px-6 py-3 rounded-xl shadow-lg" :class="nameBgClass">
                <p class="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">
                  {{ studentName }}
                </p>
              </div>
            </div>

            <!-- Message with better styling -->
            <p class="text-base sm:text-xl font-semibold text-gray-700 mb-2 animate-fade-in leading-relaxed">
              {{ message }}
            </p>

            <!-- Error Details with icon -->
            <div v-if="errorDetails" class="mt-5 p-3 bg-red-50 rounded-xl border-2 border-red-200 animate-shake">
              <div class="flex items-center justify-center gap-2 mb-2">
                <i class="fa-solid fa-exclamation-triangle text-red-600 text-lg"></i>
                <p class="text-base sm:text-lg font-bold text-red-600">Detail Error:</p>
              </div>
              <p class="text-sm sm:text-base text-red-700 font-medium">
                {{ errorDetails }}
              </p>
            </div>

            <!-- Close Progress Bar with better styling -->
            <div class="mt-8">
              <p class="text-xs text-gray-500 mb-2 font-medium">Menutup otomatis...</p>
              <div class="relative w-full bg-gray-200 rounded-full h-2.5 overflow-hidden shadow-inner">
                <div
                  class="absolute inset-0 h-2.5 rounded-full transition-all duration-100 ease-linear shadow-lg"
                  :class="progressBarClass"
                  :style="{ width: `${progress}%` }"
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'

interface Props {
  isOpen: boolean
  type: 'success' | 'error' | 'already-saved'
  studentName?: string
  message: string
  errorDetails?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const progress = ref(100)
let intervalId: number | null = null
let audioElement: HTMLAudioElement | null = null

const title = computed(() => {
  switch (props.type) {
    case 'success':
      return 'ABSEN BERHASIL'
    case 'already-saved':
      return 'ABSEN SUDAH TERSIMPAN'
    case 'error':
      return 'ABSEN GAGAL'
    default:
      return ''
  }
})

const iconClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'fa-solid fa-circle-check text-green-600'
    case 'already-saved':
      return 'fa-solid fa-info-circle text-blue-600'
    case 'error':
      return 'fa-solid fa-circle-xmark text-red-600'
    default:
      return ''
  }
})

const iconBgClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-100'
    case 'already-saved':
      return 'bg-blue-100'
    case 'error':
      return 'bg-red-100'
    default:
      return ''
  }
})

const titleClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-green-600'
    case 'already-saved':
      return 'text-blue-600'
    case 'error':
      return 'text-red-600'
    default:
      return ''
  }
})

const progressBarClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-gradient-to-r from-green-500 to-green-600'
    case 'already-saved':
      return 'bg-gradient-to-r from-blue-500 to-blue-600'
    case 'error':
      return 'bg-gradient-to-r from-red-500 to-red-600'
    default:
      return ''
  }
})

const borderClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'border-green-400'
    case 'already-saved':
      return 'border-blue-400'
    case 'error':
      return 'border-red-400'
    default:
      return 'border-gray-300'
  }
})

const nameBgClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-gradient-to-r from-green-500 to-green-600'
    case 'already-saved':
      return 'bg-gradient-to-r from-blue-500 to-blue-600'
    case 'error':
      return 'bg-gradient-to-r from-red-500 to-red-600'
    default:
      return 'bg-gray-500'
  }
})

const decorBgClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-400'
    case 'already-saved':
      return 'bg-blue-400'
    case 'error':
      return 'bg-red-400'
    default:
      return 'bg-gray-400'
  }
})

const playAudio = (audioFile: string) => {
  try {
    // Stop any existing audio
    if (audioElement) {
      audioElement.pause()
      audioElement = null
    }
    
    audioElement = new Audio(audioFile)
    audioElement.volume = 1.0
    audioElement.play().catch(err => {
      console.error('Error playing audio:', err)
    })
  } catch (err) {
    console.error('Error creating audio:', err)
  }
}

const closeModal = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  if (audioElement) {
    audioElement.pause()
    audioElement = null
  }
  progress.value = 100
  emit('close')
}

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      // Clear any existing interval/audio
      if (intervalId) {
        clearInterval(intervalId)
      }
      if (audioElement) {
        audioElement.pause()
        audioElement = null
      }

      // Play audio based on type
      switch (props.type) {
        case 'success':
          playAudio('/absen-berhasil.mp3')
          break
        case 'already-saved':
          playAudio('/sudah-tersimpan.mp3')
          break
        case 'error':
          playAudio('/ulangi-kembali.mp3')
          break
      }

      // Start progress bar countdown
      progress.value = 100
      const duration = 1500 // 1.5 seconds
      const interval = 20 // Update every 20ms
      const decrement = (interval / duration) * 100

      intervalId = window.setInterval(() => {
        progress.value -= decrement
        if (progress.value <= 0) {
          closeModal()
        }
      }, interval)
    } else {
      // Clean up when modal closes
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
      if (audioElement) {
        audioElement.pause()
        audioElement = null
      }
    }
  },
  { immediate: true }
)

// Cleanup on unmount
onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
  if (audioElement) {
    audioElement.pause()
    audioElement = null
  }
})
</script>

<style scoped>
@keyframes bounce-in {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes scale-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes icon-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up-delay {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
}

@keyframes ping-slow {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.animate-scale-pulse {
  animation: scale-pulse 2s ease-in-out infinite;
}

.animate-icon-bounce {
  animation: icon-bounce 1s ease-in-out infinite;
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out 0.3s both;
}

.animate-slide-up-delay {
  animation: slide-up-delay 0.6s ease-out 0.5s both;
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out 0.7s both;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

.animate-ping-slow {
  animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>

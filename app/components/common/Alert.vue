<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
    >
      <div v-if="isVisible" class="fixed bottom-6 right-6 z-50 max-w-sm">
        <div
          :class="[
            'rounded-lg px-6 py-4 shadow-lg flex items-start gap-3',
            typeStyles[type].bg,
            typeStyles[type].border,
          ]"
        >
          <!-- Icon -->
          <div :class="typeStyles[type].icon">
            <svg
              v-if="type === 'success'"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else-if="type === 'error'"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else-if="type === 'warning'"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>

          <!-- Content -->
          <div class="flex-1">
            <p :class="typeStyles[type].text" class="font-medium">{{ title }}</p>
            <p v-if="message" :class="typeStyles[type].textSecondary" class="text-sm mt-1">
              {{ message }}
            </p>
          </div>

          <!-- Close Button -->
          <button
            @click="close"
            :class="typeStyles[type].closeButton"
            class="flex-shrink-0 ml-2 transition-colors"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

type AlertType = 'success' | 'error' | 'warning' | 'info'

const props = defineProps<{
  type?: AlertType
  title: string
  message?: string
  duration?: number
}>()

const isVisible = ref(true)
let timeout: NodeJS.Timeout

const typeStyles = {
  success: {
    bg: 'bg-green-50',
    border: 'border-2 border-green-200',
    icon: 'text-green-600',
    text: 'text-green-900',
    textSecondary: 'text-green-700',
    closeButton: 'text-green-600 hover:text-green-900',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-2 border-red-200',
    icon: 'text-red-600',
    text: 'text-red-900',
    textSecondary: 'text-red-700',
    closeButton: 'text-red-600 hover:text-red-900',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-2 border-yellow-200',
    icon: 'text-yellow-600',
    text: 'text-yellow-900',
    textSecondary: 'text-yellow-700',
    closeButton: 'text-yellow-600 hover:text-yellow-900',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-2 border-blue-200',
    icon: 'text-blue-600',
    text: 'text-blue-900',
    textSecondary: 'text-blue-700',
    closeButton: 'text-blue-600 hover:text-blue-900',
  },
}

const close = () => {
  isVisible.value = false
}

watch(
  () => isVisible.value,
  (newVal) => {
    if (newVal && props.duration) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        close()
      }, props.duration)
    }
  }
)

onMounted(() => {
  if (props.duration) {
    timeout = setTimeout(() => {
      close()
    }, props.duration)
  }
})

onUnmounted(() => {
  clearTimeout(timeout)
})
</script>

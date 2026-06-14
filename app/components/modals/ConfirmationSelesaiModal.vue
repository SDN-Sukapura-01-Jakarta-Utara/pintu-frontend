<template>
  <Transition name="modal">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div
        class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-modal-show"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-emerald-600">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-check-circle"></i>
            {{ title }}
          </h3>
          <button
            @click="closeModal"
            :disabled="isLoading"
            class="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200 disabled:opacity-50"
          >
            <i class="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <i class="fa-solid fa-check text-2xl text-green-600"></i>
              </div>
            </div>
            <div class="flex-1">
              <p class="text-gray-700 text-base leading-relaxed">
                {{ message }}
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            @click="closeModal"
            :disabled="isLoading"
            class="px-5 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Batal
          </button>
          <button
            @click="confirm"
            :disabled="isLoading"
            class="px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold text-sm hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            <i v-if="isLoading" class="fa-solid fa-spinner fa-spin"></i>
            <i v-else class="fa-solid fa-check"></i>
            <span>{{ isLoading ? 'Memproses...' : 'Ya, Tandai Selesai' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  title?: string
  message?: string
  isLoading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()

const closeModal = () => {
  if (!props.isLoading) {
    emit('update:modelValue', false)
  }
}

const confirm = () => {
  emit('confirm')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@keyframes modal-show {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-show {
  animation: modal-show 0.3s ease-out;
}
</style>

<template>
  <Transition name="modal">
    <div v-if="isOpen" @click="$emit('close')" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div @click.stop class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <!-- Icon -->
        <div class="p-6 text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-trash-alt text-2xl text-red-600"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Hapus Kritik & Saran?</h3>
          <p class="text-gray-600 mb-6">
            Apakah Anda yakin ingin menghapus kritik dan saran ini? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        <!-- Actions -->
        <div class="bg-gray-50 px-6 py-4 flex gap-3 rounded-b-2xl">
          <button @click="$emit('close')" :disabled="isLoading" class="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50">
            Batal
          </button>
          <button @click="$emit('confirm')" :disabled="isLoading" class="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
            <span>{{ isLoading ? 'Menghapus...' : 'Ya, Hapus' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
  isLoading: boolean
}>()

defineEmits<{
  'close': []
  'confirm': []
}>()
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

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
}
</style>

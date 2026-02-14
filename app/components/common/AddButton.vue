<template>
  <button
    @click="$emit('click')"
    :disabled="disabled"
    class="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-[#2e45a7] text-white font-semibold text-[13px] sm:text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:bg-[#002d89] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <i :class="[iconClass, 'w-3 h-3 sm:w-4 sm:h-4']"></i>
    {{ label }}
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
  iconClass?: string
  disabled?: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

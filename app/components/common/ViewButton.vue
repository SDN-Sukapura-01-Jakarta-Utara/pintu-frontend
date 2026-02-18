<template>
  <button
    @click="$emit('click')"
    :disabled="disabled"
    :title="title"
    class="inline-flex items-center justify-center gap-1.5 px-3 sm:px-2.5 py-2 sm:pt-2.5 sm:pb-1.5 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-100 text-blue-700 font-semibold text-xs border border-blue-200 shadow-sm hover:shadow-md hover:from-blue-100 hover:to-cyan-200 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm cursor-pointer"
  >
    <i class="fa-solid fa-eye w-3.5 h-3.5 sm:w-5 sm:h-5"></i>
    <span v-if="showLabel" class="hidden sm:inline">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  disabled?: boolean
  title?: string
  label?: string
  showLabel?: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

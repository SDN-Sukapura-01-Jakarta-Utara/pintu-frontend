<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'button-base',
      `button-${variant}`,
      `button-${size}`,
      { 'button-disabled': disabled },
      { 'button-loading': loading }
    ]"
    @click="$emit('click')"
  >
    <span v-if="loading" class="button-spinner"></span>
    <span class="button-content">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}>()

defineEmits<{
  'click': []
}>()
</script>

<style scoped>
.button-base {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

/* Variants */
.button-primary {
  background: linear-gradient(135deg, #C82333 0%, #ff6b9d 100%);
  color: white;
  box-shadow: 0 10px 25px rgba(200, 35, 51, 0.3);
}

.button-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(200, 35, 51, 0.4);
}

.button-primary:active:not(:disabled) {
  transform: translateY(0);
}

.button-secondary {
  background: #f0f0f0;
  color: #333;
}

.button-secondary:hover:not(:disabled) {
  background: #e0e0e0;
}

.button-outline {
  background: transparent;
  color: #C82333;
  border: 2px solid #C82333;
}

.button-outline:hover:not(:disabled) {
  background: rgba(200, 35, 51, 0.05);
}

/* Sizes */
.button-sm {
  padding: 8px 16px;
  font-size: 13px;
}

.button-md {
  padding: 12px 24px;
  font-size: 15px;
}

.button-lg {
  padding: 14px 32px;
  font-size: 16px;
  width: 100%;
}

/* States */
.button-disabled,
.button-base:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-loading {
  pointer-events: none;
}

/* Loading spinner */
.button-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.6s linear infinite;
}

.button-secondary .button-spinner {
  border-color: rgba(0, 0, 0, 0.1);
  border-top-color: #333;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

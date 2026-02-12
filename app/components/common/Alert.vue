<template>
  <transition name="slide-down">
    <div v-if="visible" :class="['alert', `alert-${type}`]">
      <div class="alert-content">
        <svg v-if="icon" class="alert-icon" v-bind="iconProps" />
        <div class="alert-message">
          <p v-if="title" class="alert-title">{{ title }}</p>
          <p class="alert-text">{{ message }}</p>
        </div>
      </div>
      <button
        v-if="closable"
        type="button"
        class="alert-close"
        @click="$emit('close')"
        aria-label="Close alert"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  type?: 'success' | 'error' | 'warning' | 'info'
  message: string
  title?: string
  visible?: boolean
  closable?: boolean
  icon?: boolean
  iconProps?: Record<string, any>
}>()

defineEmits<{
  'close': []
}>()
</script>

<style scoped>
.alert {
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  animation: slideDown 0.3s ease-out;
}

.alert-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.alert-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.alert-message {
  flex: 1;
}

.alert-title {
  font-weight: 600;
  margin: 0 0 4px 0;
  font-size: 14px;
}

.alert-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
}

.alert-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  opacity: 0.7;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.alert-close:hover {
  opacity: 1;
}

/* Types */
.alert-success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert-error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.alert-warning {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
}

.alert-info {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>

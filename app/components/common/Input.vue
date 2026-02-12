<template>
  <div class="input-group">
    <label v-if="label" :for="id" class="input-label">{{ label }}</label>
    <div class="input-wrapper">
      <svg v-if="icon" class="input-icon" v-bind="iconProps" />
      <input
        :id="id"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        class="form-input"
        v-bind="$attrs"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
      />
      <slot name="suffix" />
    </div>
    <p v-if="error" class="input-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string | number
  type?: string
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  id?: string
  icon?: string
  iconProps?: Record<string, any>
}>()

defineEmits<{
  'update:modelValue': [value: string]
  'focus': []
  'blur': []
}>()
</script>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  display: block;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  width: 20px;
  height: 20px;
  color: #C82333;
  pointer-events: none;
  flex-shrink: 0;
}

.form-input {
  width: 100%;
  padding: 14px 16px 14px 50px;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  font-size: 15px;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
  background: #fafafa;
}

.form-input:focus {
  outline: none;
  border-color: #C82333;
  background: white;
  box-shadow: 0 0 0 3px rgba(200, 35, 51, 0.1);
}

.form-input:disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.form-input::placeholder {
  color: #bbb;
}

.input-error {
  font-size: 12px;
  color: #ff4757;
  margin: 0;
}
</style>

import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Toast {
  id: string
  type: 'success' | 'error'
  title: string
  message?: string
  duration?: number
}

export const useToastStore = defineStore('toast', () => {
  // State
  const toasts = ref<Toast[]>([])

  // Show toast
  const showToast = (type: 'success' | 'error', title: string, message?: string, duration: number = 5000) => {
    const id = Date.now().toString()
    
    const toast: Toast = {
      id,
      type,
      title,
      message,
      duration,
    }

    toasts.value.push(toast)

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  // Show success toast
  const success = (title: string, message?: string, duration?: number) => {
    return showToast('success', title, message, duration)
  }

  // Show error toast
  const error = (title: string, message?: string, duration?: number) => {
    return showToast('error', title, message, duration)
  }

  // Remove toast
  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  // Clear all toasts
  const clearAll = () => {
    toasts.value = []
  }

  return {
    // State
    toasts,

    // Methods
    showToast,
    success,
    error,
    removeToast,
    clearAll,
  }
})

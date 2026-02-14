import { useToastStore } from '~/stores/ToastStore'

export function useToast() {
  const toastStore = useToastStore()

  const success = (title: string, message?: string) => {
    return toastStore.success(title, message, 5000)
  }

  const error = (title: string, message?: string) => {
    return toastStore.error(title, message, 5000)
  }

  return {
    success,
    error,
  }
}

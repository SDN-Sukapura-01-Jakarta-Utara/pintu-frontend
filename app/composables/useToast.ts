import { useToastStore } from '~/stores/ToastStore'

export function useToast() {
  const toastStore = useToastStore()

  const success = (title: string, message?: string) => {
    return toastStore.success(title, message)
  }

  const error = (title: string, message?: string) => {
    return toastStore.error(title, message)
  }

  return {
    success,
    error,
  }
}

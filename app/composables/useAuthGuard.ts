/**
 * Auth Guard Composable
 * Handle 401 errors dan auto-redirect ke login
 */

import { useAuthStore } from '~/stores/AuthStore'
import { useToastStore } from '~/stores/ToastStore'

export function useAuthGuard() {
  const router = useRouter()
  const authStore = useAuthStore()
  const toastStore = useToastStore()

  /**
   * Handle 401 Unauthorized error
   * Clear auth dan redirect ke login dengan toast notification
   */
  const handle401 = async () => {
    // Show toast error dengan auto dismiss 5 detik
    toastStore.error('Sesi Anda telah habis', 'Silakan login kembali', 5000)

    // Clear auth state
    authStore.token = null
    authStore.user = null
    authStore.error = null

    // Clear localStorage
    if (process.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }

    // Redirect ke login setelah delay kecil agar toast muncul
    setTimeout(async () => {
      await router.replace('/backoffice/login')
    }, 500)
  }

  /**
   * Check if error is 401 Unauthorized
   */
  const is401Error = (error: any): boolean => {
    return error?.status === 401 || error?.response?.status === 401
  }

  return {
    handle401,
    is401Error,
  }
}

/**
 * Global Fetch Error Handler Plugin
 * Handle API errors with security measures:
 * - Session expiration (401)
 * - Access denied (403)
 * - Server errors (5xx)
 * - Sanitize error messages to prevent XSS
 */

import { useAuthStore } from '~/stores/AuthStore'
import { useToastStore } from '~/stores/ToastStore'
import { sanitizeText } from '~/utils/sanitizer'

export default defineNuxtPlugin(() => {
  const router = useRouter()
  const authStore = useAuthStore()
  const toastStore = useToastStore()
  let sessionExpiredModalShown = false

  return {
    provide: {
      /**
       * Handle fetch errors with proper security measures
       * @param error - Error object from $fetch
       */
      handleFetchError: async (error: any) => {
        const status = error?.status || error?.response?.status

        // Handle 401 Unauthorized - Session Expired
        if (status === 401) {
          // Prevent multiple modals from showing
          if (sessionExpiredModalShown) return

          sessionExpiredModalShown = true

          // Clear auth state
          authStore.token = null
          authStore.user = null
          authStore.error = null

          // Clear localStorage
          if (process.client) {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
          }

          // Show session expired error
          toastStore.showToast(
            'error',
            'Sesi Anda Telah Habis',
            'Mohon login kembali untuk melanjutkan',
            0 // Don't auto dismiss
          )

          // Redirect to login after a short delay
          setTimeout(() => {
            sessionExpiredModalShown = false
            router.replace('/backoffice/login')
          }, 2000)
        }

        // Handle 403 Forbidden - Access Denied
        if (status === 403) {
          const rawMessage = error?.data?.message || 'Anda tidak memiliki izin untuk mengakses resource ini'
          const message = await sanitizeText(rawMessage)
          toastStore.error('Akses Ditolak', message)
        }

        // Handle 500 Internal Server Error
        if (status === 500) {
          const rawMessage = error?.data?.message || 'Terjadi kesalahan pada server. Silakan coba lagi nanti'
          const message = await sanitizeText(rawMessage)
          toastStore.error('Server Error', message)
        }

        // Handle other 4xx errors (validation, not found, etc)
        if (status && status >= 400 && status < 500 && status !== 401 && status !== 403) {
          const rawError = error?.data?.message || error?.data?.error || `Error ${status}`
          const errorMessage = await sanitizeText(rawError)
          toastStore.error('Error', errorMessage)
        }
      },
    },
  }
})

/**
 * Global Fetch Error Handler Plugin
 * Handle 401 Unauthorized errors and show session expired modal
 */

import { useAuthStore } from '~/stores/AuthStore'
import { useToastStore } from '~/stores/ToastStore'

export default defineNuxtPlugin(() => {
  const router = useRouter()
  const authStore = useAuthStore()
  const toastStore = useToastStore()
  let sessionExpiredModalShown = false

  return {
    provide: {
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

        // Handle other errors
        if (status === 403) {
          toastStore.error(
            'Akses Ditolak',
            'Anda tidak memiliki izin untuk mengakses resource ini'
          )
        }

        if (status === 500) {
          toastStore.error(
            'Server Error',
            'Terjadi kesalahan pada server. Silakan coba lagi nanti'
          )
        }
      },
    },
  }
})

/**
 * Auth Guard Composable
 * Handle 401 errors dan auto-redirect ke login
 */

export function useAuthGuard() {
  const router = useRouter()
  const authStore = useAuthStore()

  /**
   * Handle 401 Unauthorized error
   * Clear auth dan redirect ke login
   */
  const handle401 = async () => {
    // Clear auth state
    authStore.token = null
    authStore.user = null
    authStore.error = null

    // Clear localStorage
    if (process.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }

    // Redirect ke login
    await router.replace('/backoffice/login')
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

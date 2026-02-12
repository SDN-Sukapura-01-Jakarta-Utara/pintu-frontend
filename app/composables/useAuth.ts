/**
 * Composable untuk authentication logic
 */

import { computed } from 'vue'
import { useAuthStore } from '~/stores/AuthStore'
import type { LoginCredentials } from '~/types/AuthType'

export function useAuth() {
  const authStore = useAuthStore()

  /**
   * Perform login
   */
  const performLogin = async (credentials: LoginCredentials) => {
    const result = await authStore.handleLogin(credentials)
    return result
  }

  /**
   * Perform logout
   */
  const performLogout = async () => {
    const result = await authStore.handleLogout()
    if (result.success) {
      // Router guard akan handle redirect ke login
      const router = useRouter()
      router.push('/backoffice/login')
    }
    return result
  }

  /**
   * Get current user
   */
  const getCurrentUser = () => {
    return authStore.user
  }

  /**
   * Get auth token
   */
  const getToken = () => {
    return authStore.token
  }

  /**
   * Check if user is authenticated
   */
  const isLoggedIn = computed(() => authStore.isAuthenticated)

  /**
   * Get loading state
   */
  const isLoading = computed(() => authStore.isLoading)

  /**
   * Get error
   */
  const getError = computed(() => authStore.error)

  /**
   * Clear error
   */
  const clearError = () => {
    authStore.clearError()
  }

  /**
   * Initialize auth from localStorage
   */
  const initializeAuth = () => {
    authStore.initializeAuth()
  }

  return {
    performLogin,
    performLogout,
    getCurrentUser,
    getToken,
    isLoggedIn,
    isLoading,
    getError,
    clearError,
    initializeAuth,
  }
}

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, AuthError, LoginCredentials } from '~/types/AuthType'
import { login, logout } from '~/services/auth'
import { sanitizeObject, sanitizeText } from '~/utils/sanitizer'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<AuthError | null>(null)

  /**
   * Initialize auth from httpOnly cookies or localStorage fallback
   * Priority:
   * 1. httpOnly cookies (set by backend) - Most secure
   * 2. localStorage (fallback for development)
   */
  const initializeAuth = () => {
    if (process.client) {
      // Try to get user from localStorage (fallback)
      const savedUser = localStorage.getItem('auth_user')
      
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser)
          // Sanitize user data from localStorage to prevent XSS
          user.value = sanitizeObject(parsedUser)
        } catch (e) {
          console.error('Failed to parse saved user:', e)
          // Clear corrupted data
          localStorage.removeItem('auth_user')
        }
      }
      
      // Token should be in httpOnly cookie (not accessible from JS)
      // If backend sets httpOnly cookie, Nuxt $fetch will auto-include it
      // For fallback, check localStorage
      const savedToken = localStorage.getItem('auth_token')
      if (savedToken) {
        token.value = savedToken
      }
    }
  }

  // Computed
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Actions
  /**
   * Handle login with security measures:
   * 1. Sanitize user data from API response
   * 2. Support httpOnly cookies (backend set)
   * 3. Fallback to localStorage for development
   * 4. Clear sensitive data on error
   */
  const handleLogin = async (credentials: LoginCredentials) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await login(credentials)
      
      // Sanitize user data from API response to prevent XSS
      const sanitizedUser = sanitizeObject(response.data.user)
      
      token.value = response.data.token
      user.value = sanitizedUser

      // Save to localStorage as fallback
      // Backend should also set httpOnly cookie for production
      if (process.client) {
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('auth_user', JSON.stringify(sanitizedUser))
      }

      return {
        success: true,
        message: 'Login berhasil',
      }
    } catch (err: any) {
      // Extract error message dari response API
      const rawError = err.data?.error || err.response?.data?.error || err.message || 'Login gagal'
      
      // Sanitize error message asynchronously
      const apiError = await sanitizeText(rawError)
      
      const authError: AuthError = {
        message: apiError,
        status: 'error',
        error: apiError,
      }
      error.value = authError
      
      // Clear any partial auth state
      user.value = null
      token.value = null
      
      return {
        success: false,
        message: apiError,
      }
    } finally {
      isLoading.value = false
    }
  }

  const handleLogout = async () => {
    isLoading.value = true
    error.value = null

    try {
      if (token.value) {
        try {
          await logout(token.value)
        } catch (err: any) {
          // If logout fails (e.g., token expired), still clear local state
          // This prevents user from being stuck
          console.warn('Logout API error (will clear local auth anyway):', err.message)
        }
      }

      // Clear state regardless of API response
      user.value = null
      token.value = null

      // Clear localStorage
      if (process.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }

      return {
        success: true,
        message: 'Logout berhasil',
      }
    } catch (err: any) {
      // Extract error message dari response API
      const apiError = err.data?.error || err.response?.data?.error || err.message || 'Logout gagal'
      
      const authError: AuthError = {
        message: apiError,
        status: 'error',
        error: apiError,
      }
      error.value = authError
      
      // Still clear auth state to prevent user being stuck
      user.value = null
      token.value = null
      if (process.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
      
      return {
        success: true, // Return success anyway to navigate away
        message: 'Logout berhasil',
      }
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    // Computed
    isAuthenticated,
    // Methods
    initializeAuth,
    handleLogin,
    handleLogout,
    clearError,
  }
})

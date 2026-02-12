import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, AuthError, LoginCredentials } from '~/types/AuthType'
import { login, logout } from '~/services/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<AuthError | null>(null)

  // Initialize from localStorage
  const initializeAuth = () => {
    if (process.client) {
      const savedToken = localStorage.getItem('auth_token')
      const savedUser = localStorage.getItem('auth_user')
      
      if (savedToken) {
        token.value = savedToken
      }
      if (savedUser) {
        try {
          user.value = JSON.parse(savedUser)
        } catch (e) {
          console.error('Failed to parse saved user:', e)
        }
      }
    }
  }

  // Computed
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Actions
  const handleLogin = async (credentials: LoginCredentials) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await login(credentials)
      
      token.value = response.data.token
      user.value = response.data.user

      // Save to localStorage
      if (process.client) {
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('auth_user', JSON.stringify(response.data.user))
      }

      return {
        success: true,
        message: 'Login berhasil',
      }
    } catch (err: any) {
      // Extract error message dari response API
      const apiError = err.data?.error || err.response?.data?.error || err.message || 'Login gagal'
      
      const authError: AuthError = {
        message: apiError,
        status: 'error',
        error: apiError,
      }
      error.value = authError
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
        await logout(token.value)
      }

      // Clear state
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
      return {
        success: false,
        message: apiError,
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

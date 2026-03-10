/**
 * Authentication Service
 * Handle API calls untuk authentication dengan backend Golang
 * 
 * Security Features:
 * - Support httpOnly cookies (set by backend)
 * - CSRF protection (backend implements)
 * - Credentials included in requests
 * - Input validation
 */

import type { LoginCredentials, LoginResponse, LogoutResponse } from '~/types/AuthType'
import { sanitizeInput } from '~/utils/sanitizer'

/**
 * Login dengan username dan password
 * 
 * Supports two authentication methods:
 * 1. httpOnly cookies (recommended for production)
 * 2. JWT token in localStorage (fallback for development)
 * 
 * @param credentials - Username dan password
 * @returns Login response dengan token dan user data
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const config = useRuntimeConfig()
  
  // Basic input validation
  if (!credentials.username || !credentials.password) {
    throw new Error('Username dan password harus diisi')
  }
  
  // Sanitize username input
  const sanitizedUsername = sanitizeInput(credentials.username)
  
  const response = await $fetch<LoginResponse>(
    `${config.public.apiBase}/api/v1/auth/login`,
    {
      method: 'POST',
      body: {
        username: sanitizedUsername,
        password: credentials.password, // Password harus tetap original
      },
      headers: {
        'Content-Type': 'application/json',
      },
      /**
       * Include credentials in request
       * Allows backend to set httpOnly cookies in response
       * IMPORTANT: Backend must have proper CORS configuration
       */
      credentials: 'include',
    }
  )

  return response
}

/**
 * Logout user
 * 
 * Handles both authentication methods:
 * 1. httpOnly cookies (backend clears cookie)
 * 2. Token-based (token sent in Authorization header)
 * 
 * @param token - JWT token (used for token-based auth fallback)
 * @returns Logout response
 */
export async function logout(token: string): Promise<LogoutResponse> {
  const config = useRuntimeConfig()
  try {
    const response = await $fetch<LogoutResponse>(
      `${config.public.apiBase}/api/v1/auth/logout`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        /**
         * Include credentials to send httpOnly cookies
         * Backend will clear the cookie in response
         */
        credentials: 'include',
      }
    )
    return response
  } catch (error: any) {
    // If token is invalid/expired (401), still consider logout as success
    // because we'll clear the state anyway
    if (error.status === 401) {
      return { success: true, message: 'Logout berhasil' }
    }
    // Re-throw other errors
    throw error
  }
}

/**
 * Get current user session
 * @param token - JWT token
 * @returns Current user data
 */
export async function getCurrentUser(token: string) {
  const config = useRuntimeConfig()
  const response = await $fetch(`${config.public.apiBase}/api/v1/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  return response
}

/**
 * Validate token
 * @param token - Token to validate
 * @returns Token validity
 */
export async function validateToken(token: string): Promise<boolean> {
  const config = useRuntimeConfig()
  try {
    const response = await $fetch<{ valid: boolean }>(
      `${config.public.apiBase}/api/v1/auth/validate`,
      {
        method: 'POST',
        body: { token },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    return response.valid
  } catch {
    return false
  }
}

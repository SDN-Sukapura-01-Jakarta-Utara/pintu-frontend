/**
 * Authentication Service
 * Handle API calls untuk authentication dengan backend Golang
 */

import type { LoginCredentials, LoginResponse, LogoutResponse } from '~/types/AuthType'

/**
 * Login dengan username dan password
 * @param credentials - Username dan password
 * @returns Login response dengan token dan user data
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const config = useRuntimeConfig()
  const response = await $fetch<LoginResponse>(`${config.public.apiBase}/api/v1/auth/login`, {
    method: 'POST',
    body: credentials,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return response
}

/**
 * Logout user
 * @param token - JWT token
 * @returns Logout response
 */
export async function logout(token: string): Promise<LogoutResponse> {
  const config = useRuntimeConfig()
  try {
    const response = await $fetch<LogoutResponse>(`${config.public.apiBase}/api/v1/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
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

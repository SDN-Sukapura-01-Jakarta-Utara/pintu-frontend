/**
 * Authentication Service
 * Handle API calls untuk authentication dengan backend Golang
 */

import type { LoginCredentials, LoginResponse, LogoutResponse } from '~/types/AuthType'

const config = useRuntimeConfig()

/**
 * Login dengan username dan password
 * @param credentials - Username dan password
 * @returns Login response dengan token dan user data
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
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
  const response = await $fetch<LogoutResponse>(`${config.public.apiBase}/api/v1/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  return response
}

/**
 * Get current user session
 * @param token - JWT token
 * @returns Current user data
 */
export async function getCurrentUser(token: string) {
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

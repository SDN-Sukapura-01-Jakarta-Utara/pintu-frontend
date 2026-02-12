/**
 * Authentication-related types
 */

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  data?: {
    token?: string
    user?: User
  }
}

export interface User {
  id: string
  username: string
  email?: string
  name?: string
  role?: string
  avatar?: string
}

export interface AuthError {
  code: string
  message: string
}

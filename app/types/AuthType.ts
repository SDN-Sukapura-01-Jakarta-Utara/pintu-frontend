/**
 * Authentication-related types
 */

export interface LoginCredentials {
  username: string
  password: string
}

export interface User {
  id: number
  nama: string
  username: string
  role_id: number
  role_name: string
  accessible_system: string[]
  status: string
  token: string
  created_at: string
}

export interface LoginResponse {
  data: {
    token: string
    user: User
    expires_at: string
  }
  status: string
}

export interface LogoutResponse {
  message: string
  status: string
  user_id: number
}

export interface AuthError {
  message: string
  status: string
  error?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: AuthError | null
}

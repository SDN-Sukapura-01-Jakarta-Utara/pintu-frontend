/**
 * User-related types
 */

export interface Role {
  id: number
  name: string
  description: string
  system: string
  status: string
  created_at: string
  updated_at: string
  created_by_id: number | null
  updated_by_id: number | null
  deleted_at: string | null
}

export interface UserData {
  id: number
  nama: string
  username: string
  role_id: number
  role_name: string
  accessible_system: string[]
  status: string
  created_at: string
  updated_at: string
  created_by_id: number | null
  updated_by_id: number | null
  deleted_at?: string | null
}

export interface GetUsersResponse {
  data: UserData[]
  message?: string
}

export interface CreateUserRequest {
  nama: string
  username: string
  password: string
  role_id: number
  accessible_system: string[]
  status: string
}

export interface GetRolesResponse {
  data: Role[]
  message?: string
}

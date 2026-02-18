/**
 * User-related types
 */

export interface SystemData {
  id: number
  nama: string
  description: string
  status: string
  created_at: string
  updated_at: string
  created_by_id: number | null
  updated_by_id: number | null
}

export interface GetSystemsResponse {
  data: SystemData[]
  pagination?: {
    limit: number
    offset: number
    page: number
    total: number
    total_pages: number
  }
  message?: string
}

export interface RoleData {
  id: number
  name: string
  description: string
  system_id: number
  system: SystemData
  status: string
  created_at: string
  updated_at: string
  created_by_id: number | null
  updated_by_id: number | null
}

export interface Role {
  id: number
  name: string
  description: string
  system: string
  system_id: number
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
  roles: RoleData[]
  accessible_system: string[]
  status: string
  created_at: string
  updated_at: string
  created_by_id: number | null
  updated_by_id: number | null
  deleted_at?: string | null
  // Computed fields for display
  role_name?: string
  role_names?: string
  accessible_system_display?: string
}

export interface GetUsersResponse {
  data: UserData[]
  pagination?: {
    limit: number
    offset: number
    page: number
    total: number
    total_pages: number
  }
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

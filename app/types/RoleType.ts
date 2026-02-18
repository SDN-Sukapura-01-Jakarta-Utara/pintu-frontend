/**
 * Role-related types
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
  deleted_at?: string | null
}

export interface GetRolesResponse {
  data: RoleData[]
  pagination?: {
    limit: number
    offset: number
    page: number
    total: number
    total_pages: number
  }
  message?: string
}

export interface CreateRoleRequest {
  name: string
  description: string
  system_id: number
  status: string
}

export interface UpdateRoleRequest {
  id: number
  name: string
  description: string
  system_id: number
  status: string
}

export interface GetRoleByIdResponse {
  data: RoleData
  message?: string
}

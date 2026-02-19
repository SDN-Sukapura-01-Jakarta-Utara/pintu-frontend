/**
 * Permission-related types
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

export interface PermissionData {
  id: number
  name: string
  description: string
  group_name: string
  system_id: number
  system: SystemData
  status: string
  created_at: string
  updated_at: string
  created_by_id: number | null
  updated_by_id: number | null
  deleted_at?: string | null
}

export interface GetPermissionsResponse {
  data: PermissionData[]
  pagination?: {
    limit: number
    offset: number
    page: number
    total: number
    total_pages: number
  }
  message?: string
}

export interface CreatePermissionRequest {
  name: string
  description: string
  group_name: string
  system_id: number
  status: string
}

export interface UpdatePermissionRequest {
  id: number
  name: string
  description: string
  group_name: string
  system_id: number
  status: string
}

export interface GetPermissionByIdResponse {
  data: PermissionData
  message?: string
}

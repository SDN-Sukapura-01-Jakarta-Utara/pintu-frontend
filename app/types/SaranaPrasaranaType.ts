/**
 * Sarana Prasarana-related types
 */

export interface SaranaPrasaranaData {
  id: number
  name: string
  foto: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  created_by_id: number
  updated_by_id: number | null
}

export interface SaranaPrasaranaResponse {
  data: SaranaPrasaranaData[]
  pagination: {
    limit: number
    offset: number
    page: number
    total: number
    total_pages: number
  }
}

export interface SaranaPrasaranaDetailResponse {
  data: SaranaPrasaranaData
}

export interface SaranaPrasaranaCreatePayload {
  file: File
  name: string
  status: 'active' | 'inactive'
}

export interface SaranaPrasaranaUpdatePayload {
  id: number
  file?: File
  name: string
  status: 'active' | 'inactive'
}

export interface SaranaPrasaranaSearchPayload {
  search?: {
    name?: string
    status?: 'active' | 'inactive'
  }
  pagination?: {
    limit: number
    page: number
  }
}

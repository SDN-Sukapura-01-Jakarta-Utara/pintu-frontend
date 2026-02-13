/**
 * Jumbotron-related types
 */

export interface JumbotronData {
  id: number
  file: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  created_by_id: number
  updated_by_id: number | null
}

export interface JumbotronResponse {
  data: JumbotronData[]
  limit: number
  offset: number
  total: number
}

export interface JumbotronCreatePayload {
  file: File
  status: 'active' | 'inactive'
}

export interface JumbotronUpdatePayload {
  id: number
  file?: File
  status?: 'active' | 'inactive'
}

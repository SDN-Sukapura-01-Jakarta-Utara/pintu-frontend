/**
 * Visi Misi-related types
 */

export interface VisiMisiData {
  id: number
  visi: string
  misi: string
  created_at: string
  updated_at: string
  created_by_id: number | null
  updated_by_id: number | null
}

export interface VisiMisiResponse {
  data: VisiMisiData
  message?: string
}

/**
 * Contact-related types
 */

export interface JamBuka {
  hari: string
  jam_buka: string
  jam_tutup: string
}

export interface ContactData {
  id: number
  alamat: string
  telepon: string
  email: string
  jam_buka: JamBuka[]
  gmaps: string
  website: string
  youtube: string
  instagram: string
  tiktok: string
  facebook: string
  twitter: string
  created_at?: string
  updated_at?: string
  created_by_id?: number | null
  updated_by_id?: number | null
}

export interface ContactResponse {
  data: ContactData
  message?: string
}

export interface ContactSearchFilter {
  search?: string
}

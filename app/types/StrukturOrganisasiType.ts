/**
 * Struktur Organisasi Types
 */

export interface Pegawai {
  id: number
  nama: string
  jabatan: string
  status: string
}

export interface StrukturOrganisasi {
  id: number
  pegawai_id: number | null
  pegawai: Pegawai | null
  nama_non_pegawai: string
  jabatan_non_pegawai: string
  urutan: number
  relasi: 'Komando' | 'Koordinasi'
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  created_by_id: number
  updated_by_id: number | null
}

export interface StrukturOrganisasiCreate {
  pegawai_id: number | null
  nama_non_pegawai: string
  jabatan_non_pegawai: string
  urutan: number
  relasi: 'Komando' | 'Koordinasi'
  status: 'active' | 'inactive'
}

export interface StrukturOrganisasiUpdate extends StrukturOrganisasiCreate {
  id: number
}

export interface StrukturOrganisasiResponse {
  data: StrukturOrganisasi[]
  pagination: {
    limit: number
    offset: number
    page: number
    total: number
    total_pages: number
  }
}

export interface StrukturOrganisasiDetailResponse {
  data: StrukturOrganisasi
}

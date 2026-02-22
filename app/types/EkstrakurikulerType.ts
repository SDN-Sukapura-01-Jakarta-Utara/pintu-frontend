/**
 * Ekstrakurikuler (Extracurricular Activities) related types
 */

export interface KelasOption {
    id: number
    name: string
    status: 'active' | 'inactive'
}

export interface EkstrakurikulerData {
    id: number
    name: string
    status: 'active' | 'inactive'
    kategori: 'wajib' | 'tidak wajib'
    kelas_ids: number[]
    kelas?: KelasOption[]
    created_at: string
    updated_at: string
    created_by_id: number | null
    updated_by_id: number | null
}

export interface GetEkstrakurikulerResponse {
    data: EkstrakurikulerData[]
    pagination?: {
        limit: number
        offset: number
        page: number
        total: number
        total_pages: number
    }
    message?: string
}

export interface CreateEkstrakurikulerRequest {
    name: string
    kelas_ids: number[]
    kategori: 'wajib' | 'tidak wajib'
    status: 'active' | 'inactive'
}

export interface UpdateEkstrakurikulerRequest {
    id: number
    name: string
    kelas_ids: number[]
    kategori: 'wajib' | 'tidak wajib'
    status: 'active' | 'inactive'
}

export interface DeleteEkstrakurikulerRequest {
    id: number
}

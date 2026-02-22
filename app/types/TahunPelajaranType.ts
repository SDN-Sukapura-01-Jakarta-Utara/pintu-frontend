/**
 * Tahun Pelajaran (School Year) related types
 */

export interface TahunPelajaranData {
    id: number
    tahun_pelajaran: string
    status: 'active' | 'inactive'
    created_at: string
    updated_at: string
    created_by_id: number | null
    updated_by_id: number | null
}

export interface GetTahunPelajaranResponse {
    data: TahunPelajaranData[]
    pagination?: {
        limit: number
        offset: number
        page: number
        total: number
        total_pages: number
    }
    message?: string
}

export interface CreateTahunPelajaranRequest {
    tahun_pelajaran: string
    status: 'active' | 'inactive'
}

export interface UpdateTahunPelajaranRequest {
    id: number
    tahun_pelajaran: string
    status: 'active' | 'inactive'
}

export interface DeleteTahunPelajaranRequest {
    id: number
}

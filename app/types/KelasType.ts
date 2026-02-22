/**
 * Kelas (Class) related types
 */

export interface KelasData {
    id: number
    name: string
    status: 'active' | 'inactive'
    created_at: string
    updated_at: string
    created_by_id: number | null
    updated_by_id: number | null
}

export interface GetKelasResponse {
    data: KelasData[]
    pagination?: {
        limit: number
        offset: number
        page: number
        total: number
        total_pages: number
    }
    message?: string
}

export interface CreateKelasRequest {
    name: string
    status: 'active' | 'inactive'
}

export interface UpdateKelasRequest {
    id: number
    name: string
    status: 'active' | 'inactive'
}

export interface DeleteKelasRequest {
    id: number
}

/**
 * Rombel (Study Group Class) related types
 */

export interface KelasOption {
    id: number
    name: string
    status: 'active' | 'inactive'
}

export interface RombelData {
    id: number
    name: string
    status: 'active' | 'inactive'
    kelas_id: number
    kelas?: KelasOption
    created_at: string
    updated_at: string
    created_by_id: number | null
    updated_by_id: number | null
}

export interface GetRombelResponse {
    data: RombelData[]
    pagination?: {
        limit: number
        offset: number
        page: number
        total: number
        total_pages: number
    }
    message?: string
}

export interface CreateRombelRequest {
    name: string
    status: 'active' | 'inactive'
    kelas_id: number
}

export interface UpdateRombelRequest {
    id: number
    name: string
    status: 'active' | 'inactive'
    kelas_id: number
}

export interface DeleteRombelRequest {
    id: number
}

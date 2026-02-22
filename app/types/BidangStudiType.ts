/**
 * Bidang Studi (Subject) related types
 */

export interface BidangStudiData {
    id: number
    name: string
    status: 'active' | 'inactive'
    created_at: string
    updated_at: string
    created_by_id: number | null
    updated_by_id: number | null
}

export interface GetBidangStudiResponse {
    data: BidangStudiData[]
    pagination?: {
        limit: number
        offset: number
        page: number
        total: number
        total_pages: number
    }
    message?: string
}

export interface CreateBidangStudiRequest {
    name: string
    status: 'active' | 'inactive'
}

export interface UpdateBidangStudiRequest {
    id: number
    name: string
    status: 'active' | 'inactive'
}

export interface DeleteBidangStudiRequest {
    id: number
}

export interface PhotoItem {
    id: string
    filename: string
    url: string
    size: number
}

export interface ActivityGalleryData {
    id: number
    judul: string
    tanggal: string
    foto: PhotoItem[]
    status_publikasi: string
    status: string
    created_at: string
    updated_at: string
    created_by_id: number | null
    updated_by_id: number | null
}

export interface ActivityGalleryResponse {
    data: ActivityGalleryData[]
    pagination: {
        limit: number
        offset: number
        page: number
        total: number
        total_pages: number
    }
}

export interface ActivityGalleryDetailResponse {
    data: ActivityGalleryData
}

export interface ActivityGalleryCreateRequest {
    judul: string
    tanggal: string
    status_publikasi: string
    status: string
}

export interface ActivityGalleryUpdateRequest extends ActivityGalleryCreateRequest {
    id?: number
    foto_to_delete?: string[]
}

export interface ActivityGallerySearchFilter {
    judul?: string
    start_date?: string
    end_date?: string
    status_publikasi?: string
    status?: string
}

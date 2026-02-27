export interface FileItem {
    id: string
    filename: string
    url: string
    size: number
}

export interface AnnouncementData {
    id: number
    judul: string
    tanggal: string
    deskripsi: string
    gambar: string
    files: FileItem[] | null
    penulis: string
    status_publikasi: string
    status: string
    created_at: string
    updated_at: string
    created_by_id: number | null
    updated_by_id: number | null
}

export interface AnnouncementResponse {
    data: AnnouncementData[]
    pagination: {
        limit: number
        offset: number
        page: number
        total: number
        total_pages: number
    }
}

export interface AnnouncementDetailResponse {
    data: AnnouncementData
}

export interface AnnouncementCreateRequest {
    judul: string
    tanggal: string
    deskripsi: string
    penulis: string
    status_publikasi: string
    status: string
}

export interface AnnouncementUpdateRequest extends AnnouncementCreateRequest {
    id?: number
    files_to_delete?: string[]
}

export interface AnnouncementSearchFilter {
    judul?: string
    start_date?: string
    end_date?: string
    penulis?: string
    status_publikasi?: string
    status?: string
}

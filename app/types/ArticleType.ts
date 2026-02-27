export interface FileItem {
    id: string
    filename: string
    url: string
    size: number
}

export interface ArticleData {
    id: number
    judul: string
    tanggal: string
    kategori: string
    deskripsi: string
    gambar: string
    files: FileItem[]
    penulis: string
    status_publikasi: string
    status: string
    created_at: string
    updated_at: string
    created_by_id: number | null
    updated_by_id: number | null
}

export interface ArticleResponse {
    data: ArticleData[]
    pagination: {
        limit: number
        offset: number
        page: number
        total: number
        total_pages: number
    }
}

export interface ArticleDetailResponse {
    data: ArticleData
}

export interface ArticleCreateRequest {
    judul: string
    tanggal: string
    kategori: string
    deskripsi: string
    penulis: string
    status_publikasi: string
    status: string
}

export interface ArticleUpdateRequest extends ArticleCreateRequest {
    id?: number
    files_to_delete?: string[]
}

export interface ArticleSearchFilter {
    judul?: string
    start_date?: string
    end_date?: string
    kategori?: string
    penulis?: string
    status_publikasi?: string
    status?: string
}

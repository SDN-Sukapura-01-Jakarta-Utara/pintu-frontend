/**
 * Prestasi (Achievement) related types
 */

export interface PrestasiSearchFilter {
    peserta_didik_id?: number
    jenis?: string
    nama_grup?: string
    nama_prestasi?: string
    tingkat_prestasi?: string
    penyelenggara?: string
    start_date?: string
    end_date?: string
    juara?: string
    ekstrakurikuler_id?: number
    tahun_pelajaran_id?: number
}

export interface PrestasiPhoto {
    id: string
    filename: string
    url: string
    size: number
    thumbnail: string
}

export interface AnggotaTimPrestasi {
    id: number
    prestasi_id: number
    peserta_didik_id: number
    tahun_pelajaran_id: number
    peserta_didik: {
        id: number
        nama: string
        nis: string
        rombel_id: number
        rombel: {
            id: number
            name: string
        } | null
    }
    tahun_pelajaran: {
        id: number
        tahun_pelajaran: string
    }
}

export interface PrestasiData {
    id: number
    peserta_didik_id: number | null
    peserta_didik: {
        id: number
        nama: string
        nis: string
        rombel_id: number
        rombel: {
            id: number
            name: string
        }
    } | null
    jenis: string
    nama_grup: string
    nama_prestasi: string
    tingkat_prestasi: string
    penyelenggara: string
    tanggal_lomba: string
    juara: string
    keterangan: string
    foto: PrestasiPhoto[]
    ekstrakurikuler_id: number
    ekstrakurikuler: {
        id: number
        name: string
        kategori: string
        status: string
    }
    tahun_pelajaran_id: number
    tahun_pelajaran: {
        id: number
        tahun_pelajaran: string
        status: string
    }
    anggota_tim_prestasi: AnggotaTimPrestasi[] | null
    created_at: string
    updated_at: string
    created_by_id: number
    updated_by_id: number | null
}

export interface GetPrestasiResponse {
    data: PrestasiData[]
    pagination: {
        limit: number
        offset: number
        page: number
        total: number
        total_pages: number
    }
}

/**
 * Kepegawaian Types
 */

export interface KepegawaianData {
    id: number
    nama: string
    username: string
    nip: string
    nkki: string
    foto: string | null
    kategori: string
    jabatan: string
    bidang_studi_id: number | null
    rombel_guru_kelas_id: number | null
    rombel_bidang_studi: number[]
    kk: string | null
    akta_lahir: string | null
    ktp: string | null
    ijazah_sd: string | null
    ijazah_smp: string | null
    ijazah_sma: string | null
    ijazah_s1: string | null
    ijazah_s2: string | null
    ijazah_s3: string | null
    sertifikat_pendidik: string | null
    sertifikat_lainnya: string | null
    sk: string | null
    dokumen_lainnya: string | null
    status: 'active' | 'inactive'
    created_at: string
    updated_at: string
    created_by_id: number
    updated_by_id: number | null
}

export interface GetKepegawaianResponse {
    data: KepegawaianData[]
    pagination: {
        limit: number
        offset: number
        page: number
        total: number
        total_pages: number
    }
}

export interface CreateKepegawaianRequest {
    nama: string
    username: string
    password: string
    nip?: string
    nkki?: string
    kategori: string
    jabatan: string
    rombel_guru_kelas_id?: number
    rombel_bidang_studi?: number[]
    bidang_studi_id?: number
    role_ids: number[]
    status: 'active' | 'inactive'
}

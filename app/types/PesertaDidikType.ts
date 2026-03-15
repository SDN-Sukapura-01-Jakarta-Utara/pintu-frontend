/**
 * Peserta Didik-related types
 */

export interface PesertaDidikData {
    id: number
    nama: string
    nis: string
    jenis_kelamin: 'L' | 'P'
    nisn: string
    tempat_lahir: string
    tanggal_lahir: string
    nik: string
    agama: string
    alamat: string
    rt: string
    rw: string
    kelurahan: string
    kecamatan: string
    kode_pos: string
    nama_ayah: string
    nama_ibu: string
    rombel_id: number
    rombel: {
        id: number
        name: string
        status: string
        kelas_id: number
        kelas: {
            id: number
            name: string
            status: string
            created_at: string
            updated_at: string
        }
        created_at: string
        updated_at: string
    }
    tahun_pelajaran_id: number
    tahun_pelajaran: {
        id: number
        tahun_pelajaran: string
        status: string
        created_at: string
        updated_at: string
        created_by_id: number
        updated_by_id: number | null
    }
    status: 'active' | 'inactive'
    username: string
    roles: Array<{
        id: number
        name: string
        description: string
        system_id: number
        system: {
            id: number
            nama: string
            description: string
            status: string
            created_at: string
            updated_at: string
            created_by_id: number | null
            updated_by_id: number | null
        }
        status: string
        permissions: any
        created_at: string
        updated_at: string
        created_by_id: number
        updated_by_id: number
    }>
    created_at: string
    updated_at: string
    created_by_id: number
    updated_by_id: number | null
}

export interface PesertaDidikSearchFilter {
    tahun_pelajaran_id?: number
    rombel_id?: number
    nama?: string
    nis?: string
    jenis_kelamin?: string
    nisn?: string
    tempat_lahir?: string
    nik?: string
    agama?: string
    status?: string
}

export interface PesertaDidikCreateRequest {
    nama: string
    nis: string
    jenis_kelamin: string
    nisn: string
    tempat_lahir: string
    tanggal_lahir: string
    nik: string
    agama: string
    alamat: string
    rt: string
    rw: string
    kelurahan: string
    kecamatan: string
    kode_pos: string
    nama_ayah: string
    nama_ibu: string
    rombel_id: number
    tahun_pelajaran_id: number
    status: string
    username: string
    password: string
    role_ids: number[]
}

export interface PesertaDidikUpdateRequest {
    id: number
    nama?: string
    nis?: string
    jenis_kelamin?: string
    nisn?: string
    tempat_lahir?: string
    tanggal_lahir?: string
    nik?: string
    agama?: string
    alamat?: string
    rt?: string
    rw?: string
    kelurahan?: string
    kecamatan?: string
    kode_pos?: string
    nama_ayah?: string
    nama_ibu?: string
    rombel_id?: number
    tahun_pelajaran_id?: number
    status?: string
    username?: string
    password?: string
    role_ids?: number[]
}

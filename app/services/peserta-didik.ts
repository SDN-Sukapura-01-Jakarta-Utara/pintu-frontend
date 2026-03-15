/**
 * Peserta Didik Service
 * Handle API calls untuk peserta didik dengan backend Golang
 */

import type { PesertaDidikData, PesertaDidikSearchFilter } from '~/types/PesertaDidikType'
import { sanitizeInput, sanitizeObject } from '~/utils/sanitizer'

/**
 * Helper function to handle API errors globally
 */
const handleApiError = (error: any) => {
    if (typeof window !== 'undefined') {
        const nuxtApp = useNuxtApp()
        const status = error?.status || error?.response?.status
        if (status === 401) {
            nuxtApp.$handleFetchError(error)
        }
    }
}

/**
 * Get peserta didik list dengan filters dan pagination
 */
export async function getPesertaDidikList(
    filters: PesertaDidikSearchFilter = {},
    page: number = 1,
    limit: number = 10
) {
    const config = useRuntimeConfig()
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    const requestBody = {
        search: {
            tahun_pelajaran_id: filters.tahun_pelajaran_id,
            rombel_id: filters.rombel_id,
            nama: filters.nama ? sanitizeInput(filters.nama) : undefined,
            nis: filters.nis ? sanitizeInput(filters.nis) : undefined,
            jenis_kelamin: filters.jenis_kelamin,
            nisn: filters.nisn ? sanitizeInput(filters.nisn) : undefined,
            tempat_lahir: filters.tempat_lahir ? sanitizeInput(filters.tempat_lahir) : undefined,
            nik: filters.nik ? sanitizeInput(filters.nik) : undefined,
            agama: filters.agama,
            status: filters.status,
        },
        pagination: {
            limit: limit,
            page: page,
        },
    }

    try {
        const response = await $fetch<{
            data: PesertaDidikData[]
            pagination: {
                limit: number
                offset: number
                page: number
                total: number
                total_pages: number
            }
        }>(
            `${config.public.apiBase}/api/v1/peserta-didik/get-peserta-didik`,
            {
                method: 'POST',
                body: requestBody,
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }
        )

        return {
            data: response.data || [],
            pagination: response.pagination,
        }
    } catch (error: any) {
        handleApiError(error)
        throw error
    }
}

/**
 * Get peserta didik by ID
 */
export async function getPesertaDidikById(id: number) {
    const config = useRuntimeConfig()
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    const response = await $fetch<{ data: PesertaDidikData }>(
        `${config.public.apiBase}/api/v1/peserta-didik/get-peserta-didik-by-id`,
        {
            method: 'POST',
            body: { id },
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        }
    )

    return {
        data: response.data,
    }
}

/**
 * Get peserta didik by NIS
 */
export async function getPesertaDidikByNIS(nis: string) {
    const config = useRuntimeConfig()
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    const response = await $fetch<{ data: PesertaDidikData }>(
        `${config.public.apiBase}/api/v1/peserta-didik/get-peserta-didik-by-nis`,
        {
            method: 'POST',
            body: { nis: sanitizeInput(nis) },
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        }
    )

    return {
        data: response.data,
    }
}

/**
 * Create new peserta didik
 */
export async function createPesertaDidik(data: {
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
}) {
    const config = useRuntimeConfig()
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    const requestBody = {
        nama: sanitizeInput(data.nama),
        nis: sanitizeInput(data.nis),
        jenis_kelamin: data.jenis_kelamin,
        nisn: sanitizeInput(data.nisn),
        tempat_lahir: sanitizeInput(data.tempat_lahir),
        tanggal_lahir: data.tanggal_lahir,
        nik: sanitizeInput(data.nik),
        agama: data.agama,
        alamat: sanitizeInput(data.alamat),
        rt: sanitizeInput(data.rt),
        rw: sanitizeInput(data.rw),
        kelurahan: sanitizeInput(data.kelurahan),
        kecamatan: sanitizeInput(data.kecamatan),
        kode_pos: sanitizeInput(data.kode_pos),
        nama_ayah: sanitizeInput(data.nama_ayah),
        nama_ibu: sanitizeInput(data.nama_ibu),
        rombel_id: data.rombel_id,
        tahun_pelajaran_id: data.tahun_pelajaran_id,
        status: data.status,
        username: sanitizeInput(data.username),
        password: data.password,
        role_ids: data.role_ids,
    }

    const response = await $fetch<{ data: PesertaDidikData }>(
        `${config.public.apiBase}/api/v1/peserta-didik/create-peserta-didik`,
        {
            method: 'POST',
            body: requestBody,
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        }
    )

    return {
        data: response.data,
    }
}

/**
 * Update peserta didik
 */
export async function updatePesertaDidik(id: number, data: any) {
    const config = useRuntimeConfig()
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    const requestBody = {
        id,
        nama: data.nama ? sanitizeInput(data.nama) : undefined,
        nis: data.nis ? sanitizeInput(data.nis) : undefined,
        jenis_kelamin: data.jenis_kelamin,
        nisn: data.nisn ? sanitizeInput(data.nisn) : undefined,
        tempat_lahir: data.tempat_lahir ? sanitizeInput(data.tempat_lahir) : undefined,
        tanggal_lahir: data.tanggal_lahir,
        nik: data.nik ? sanitizeInput(data.nik) : undefined,
        agama: data.agama,
        alamat: data.alamat ? sanitizeInput(data.alamat) : undefined,
        rt: data.rt ? sanitizeInput(data.rt) : undefined,
        rw: data.rw ? sanitizeInput(data.rw) : undefined,
        kelurahan: data.kelurahan ? sanitizeInput(data.kelurahan) : undefined,
        kecamatan: data.kecamatan ? sanitizeInput(data.kecamatan) : undefined,
        kode_pos: data.kode_pos ? sanitizeInput(data.kode_pos) : undefined,
        nama_ayah: data.nama_ayah ? sanitizeInput(data.nama_ayah) : undefined,
        nama_ibu: data.nama_ibu ? sanitizeInput(data.nama_ibu) : undefined,
        rombel_id: data.rombel_id,
        tahun_pelajaran_id: data.tahun_pelajaran_id,
        status: data.status,
        username: data.username ? sanitizeInput(data.username) : undefined,
        password: data.password,
        role_ids: data.role_ids,
    }

    const response = await $fetch<{ data: PesertaDidikData }>(
        `${config.public.apiBase}/api/v1/peserta-didik/update-peserta-didik`,
        {
            method: 'POST',
            body: requestBody,
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        }
    )

    return {
        data: response.data,
    }
}

/**
 * Delete peserta didik
 */
export async function deletePesertaDidik(id: number) {
    const config = useRuntimeConfig()
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    const response = await $fetch<{ message: string }>(
        `${config.public.apiBase}/api/v1/peserta-didik/delete-peserta-didik`,
        {
            method: 'POST',
            body: { id },
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        }
    )

    return response
}

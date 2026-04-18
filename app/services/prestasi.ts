/**
 * Prestasi Service
 * Handle API calls untuk prestasi dengan backend Golang
 */

import type { PrestasiData, PrestasiSearchFilter } from '~/types/PrestasiType'
import { sanitizeInput } from '~/utils/sanitizer'

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
 * Get prestasi by ID
 */
export async function getPrestasiById(id: number) {
    const config = useRuntimeConfig()
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    try {
        const response = await $fetch<{ data: PrestasiData }>(
            `${config.public.apiBase}/api/v1/prestasi/get-prestasi-by-id`,
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
    } catch (error: any) {
        handleApiError(error)
        throw error
    }
}

/**
 * Create new prestasi
 */
export async function createPrestasi(formData: FormData) {
    const config = useRuntimeConfig()
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    try {
        const response = await $fetch<{ data: PrestasiData }>(
            `${config.public.apiBase}/api/v1/prestasi/create-prestasi`,
            {
                method: 'POST',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: formData,
            }
        )

        return {
            data: response.data,
        }
    } catch (error: any) {
        handleApiError(error)
        throw error
    }
}

/**
 * Update prestasi
 */
export async function updatePrestasi(formData: FormData) {
    const config = useRuntimeConfig()
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    try {
        const response = await $fetch<{ data: PrestasiData }>(
            `${config.public.apiBase}/api/v1/prestasi/update-prestasi`,
            {
                method: 'POST',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: formData,
            }
        )

        return {
            data: response.data,
        }
    } catch (error: any) {
        handleApiError(error)
        throw error
    }
}

/**
 * Delete prestasi
 */
export async function deletePrestasi(id: number) {
    const config = useRuntimeConfig()
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    try {
        const response = await $fetch<{ message: string }>(
            `${config.public.apiBase}/api/v1/prestasi/delete-prestasi`,
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
    } catch (error: any) {
        handleApiError(error)
        throw error
    }
}

/**
 * Get prestasi list dengan filters dan pagination
 */
export async function getPrestasiList(
    filters: PrestasiSearchFilter = {},
    page: number = 1,
    limit: number = 10
) {
    const config = useRuntimeConfig()
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    const requestBody = {
        search: {
            peserta_didik_id: filters.peserta_didik_id,
            jenis: filters.jenis,
            nama_grup: filters.nama_grup ? sanitizeInput(filters.nama_grup) : undefined,
            nama_prestasi: filters.nama_prestasi ? sanitizeInput(filters.nama_prestasi) : undefined,
            tingkat_prestasi: filters.tingkat_prestasi ? sanitizeInput(filters.tingkat_prestasi) : undefined,
            penyelenggara: filters.penyelenggara ? sanitizeInput(filters.penyelenggara) : undefined,
            start_date: filters.start_date,
            end_date: filters.end_date,
            juara: filters.juara ? sanitizeInput(filters.juara) : undefined,
            ekstrakurikuler_id: filters.ekstrakurikuler_id,
            tahun_pelajaran_id: filters.tahun_pelajaran_id,
        },
        pagination: {
            limit: limit,
            page: page,
        },
    }

    try {
        const response = await $fetch<{
            data: PrestasiData[]
            pagination: {
                limit: number
                offset: number
                page: number
                total: number
                total_pages: number
            }
        }>(
            `${config.public.apiBase}/api/v1/prestasi/get-prestasi`,
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

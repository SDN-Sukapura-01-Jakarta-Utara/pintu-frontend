/**
 * Tahun Pelajaran Service
 * Handle API calls untuk tahun pelajaran management
 */

import type { GetTahunPelajaranResponse, CreateTahunPelajaranRequest, UpdateTahunPelajaranRequest, DeleteTahunPelajaranRequest } from '~/types/TahunPelajaranType'

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
 * Get all tahun pelajaran with pagination and search filters
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @param search - Search filters object
 * @returns Tahun pelajaran list response
 */
export async function getTahunPelajaranList(page: number = 1, limit: number = 10, search: any = {}): Promise<GetTahunPelajaranResponse> {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch<GetTahunPelajaranResponse>(
            `${config.public.apiBase}/api/v1/tahun-pelajaran/get-tahun-pelajaran`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: {
                    search,
                    pagination: {
                        page,
                        limit
                    }
                },
            }
        )

        return response
    } catch (error: any) {
        handleApiError(error)
        throw error
    }
}

/**
 * Get tahun pelajaran by ID
 * @param id - Tahun Pelajaran ID
 * @returns Tahun pelajaran data
 */
export async function getTahunPelajaranById(id: number) {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch(
            `${config.public.apiBase}/api/v1/tahun-pelajaran/get-tahun-pelajaran-by-id`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: { id },
            }
        )

        return response
    } catch (error: any) {
        handleApiError(error)
        throw error
    }
}

/**
 * Create tahun pelajaran
 * @param tahunPelajaranData - Tahun pelajaran data to create
 * @returns Created tahun pelajaran data
 */
export async function createTahunPelajaran(tahunPelajaranData: CreateTahunPelajaranRequest) {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch(
            `${config.public.apiBase}/api/v1/tahun-pelajaran/create-tahun-pelajaran`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: tahunPelajaranData,
            }
        )

        return response
    } catch (error: any) {
        handleApiError(error)
        throw error
    }
}

/**
 * Update tahun pelajaran
 * @param tahunPelajaranData - Tahun pelajaran data to update
 * @returns Updated tahun pelajaran data
 */
export async function updateTahunPelajaran(tahunPelajaranData: UpdateTahunPelajaranRequest) {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch(
            `${config.public.apiBase}/api/v1/tahun-pelajaran/update-tahun-pelajaran`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: tahunPelajaranData,
            }
        )

        return response
    } catch (error: any) {
        handleApiError(error)
        throw error
    }
}

/**
 * Delete tahun pelajaran
 * @param id - Tahun Pelajaran ID
 * @returns Delete response
 */
export async function deleteTahunPelajaran(id: number) {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch(
            `${config.public.apiBase}/api/v1/tahun-pelajaran/delete-tahun-pelajaran`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: { id },
            }
        )

        return response
    } catch (error: any) {
        handleApiError(error)
        throw error
    }
}

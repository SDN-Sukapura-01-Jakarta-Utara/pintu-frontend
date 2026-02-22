/**
 * Ekstrakurikuler Service
 * Handle API calls untuk ekstrakurikuler management
 */

import type { GetEkstrakurikulerResponse, CreateEkstrakurikulerRequest, UpdateEkstrakurikulerRequest, DeleteEkstrakurikulerRequest } from '~/types/EkstrakurikulerType'

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
 * Get all ekstrakurikuler with pagination and search filters
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @param search - Search filters object
 * @returns Ekstrakurikuler list response
 */
export async function getEkstrakurikulerList(page: number = 1, limit: number = 10, search: any = {}): Promise<GetEkstrakurikulerResponse> {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch<GetEkstrakurikulerResponse>(
            `${config.public.apiBase}/api/v1/ekstrakurikuler/get-ekstrakurikuler`,
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
 * Get ekstrakurikuler by ID
 * @param id - Ekstrakurikuler ID
 * @returns Ekstrakurikuler data
 */
export async function getEkstrakurikulerById(id: number) {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch(
            `${config.public.apiBase}/api/v1/ekstrakurikuler/get-ekstrakurikuler-by-id`,
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
 * Create ekstrakurikuler
 * @param ekstrakurikulerData - Ekstrakurikuler data to create
 * @returns Created ekstrakurikuler data
 */
export async function createEkstrakurikuler(ekstrakurikulerData: CreateEkstrakurikulerRequest) {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch(
            `${config.public.apiBase}/api/v1/ekstrakurikuler/create-ekstrakurikuler`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: ekstrakurikulerData,
            }
        )

        return response
    } catch (error: any) {
        handleApiError(error)
        throw error
    }
}

/**
 * Update ekstrakurikuler
 * @param ekstrakurikulerData - Ekstrakurikuler data to update
 * @returns Updated ekstrakurikuler data
 */
export async function updateEkstrakurikuler(ekstrakurikulerData: UpdateEkstrakurikulerRequest) {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch(
            `${config.public.apiBase}/api/v1/ekstrakurikuler/update-ekstrakurikuler`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: ekstrakurikulerData,
            }
        )

        return response
    } catch (error: any) {
        handleApiError(error)
        throw error
    }
}

/**
 * Delete ekstrakurikuler
 * @param id - Ekstrakurikuler ID
 * @returns Delete response
 */
export async function deleteEkstrakurikuler(id: number) {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch(
            `${config.public.apiBase}/api/v1/ekstrakurikuler/delete-ekstrakurikuler`,
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

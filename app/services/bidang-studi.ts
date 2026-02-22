/**
 * Bidang Studi Service
 * Handle API calls untuk bidang studi management
 */

import type { GetBidangStudiResponse, CreateBidangStudiRequest, UpdateBidangStudiRequest, DeleteBidangStudiRequest } from '~/types/BidangStudiType'

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
 * Get all bidang studi with pagination and search filters
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @param search - Search filters object
 * @returns Bidang Studi list response
 */
export async function getBidangStudiList(page: number = 1, limit: number = 10, search: any = {}): Promise<GetBidangStudiResponse> {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch<GetBidangStudiResponse>(
            `${config.public.apiBase}/api/v1/bidang-studi/get-bidang-studi`,
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
 * Get bidang studi by ID
 * @param id - Bidang Studi ID
 * @returns Bidang Studi data
 */
export async function getBidangStudiById(id: number) {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch(
            `${config.public.apiBase}/api/v1/bidang-studi/get-bidang-studi-by-id`,
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
 * Create bidang studi
 * @param bidangStudiData - Bidang Studi data to create
 * @returns Created bidang studi data
 */
export async function createBidangStudi(bidangStudiData: CreateBidangStudiRequest) {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch(
            `${config.public.apiBase}/api/v1/bidang-studi/create-bidang-studi`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: bidangStudiData,
            }
        )

        return response
    } catch (error: any) {
        handleApiError(error)
        throw error
    }
}

/**
 * Update bidang studi
 * @param bidangStudiData - Bidang Studi data to update
 * @returns Updated bidang studi data
 */
export async function updateBidangStudi(bidangStudiData: UpdateBidangStudiRequest) {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch(
            `${config.public.apiBase}/api/v1/bidang-studi/update-bidang-studi`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: bidangStudiData,
            }
        )

        return response
    } catch (error: any) {
        handleApiError(error)
        throw error
    }
}

/**
 * Delete bidang studi
 * @param id - Bidang Studi ID
 * @returns Delete response
 */
export async function deleteBidangStudi(id: number) {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch(
            `${config.public.apiBase}/api/v1/bidang-studi/delete-bidang-studi`,
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

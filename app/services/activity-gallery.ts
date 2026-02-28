/**
 * Activity Gallery Service
 * Handle API calls untuk activity gallery management
 */

import type { ActivityGalleryResponse, ActivityGalleryDetailResponse, ActivityGallerySearchFilter } from '~/types/ActivityGalleryType'

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
 * Get all activity galleries with filter and pagination
 * @param filters - Search filters
 * @param page - Page number
 * @param limit - Items per page
 * @returns Activity galleries list response
 */
export async function getActivityGalleryList(
    filters: ActivityGallerySearchFilter = {},
    page: number = 1,
    limit: number = 10
): Promise<ActivityGalleryResponse> {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch<ActivityGalleryResponse>(
            `${config.public.apiBase}/api/v1/activity-galleries/get-galleries`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: {
                    search: filters,
                    pagination: {
                        limit,
                        page,
                    },
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
 * Get activity gallery by ID
 * @param id - Activity Gallery ID
 * @returns Activity gallery detail response
 */
export async function getActivityGalleryById(id: number): Promise<ActivityGalleryDetailResponse> {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch<ActivityGalleryDetailResponse>(
            `${config.public.apiBase}/api/v1/activity-galleries/get-gallery-by-id`,
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
 * Create new activity gallery
 * @param formData - FormData containing gallery data and photos
 * @returns Created activity gallery response
 */
export async function createActivityGallery(formData: FormData): Promise<ActivityGalleryDetailResponse> {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch<ActivityGalleryDetailResponse>(
            `${config.public.apiBase}/api/v1/activity-galleries/create-gallery`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            }
        )

        return response
    } catch (error: any) {
        handleApiError(error)
        throw error
    }
}

/**
 * Update activity gallery
 * @param id - Activity Gallery ID
 * @param formData - FormData containing updated gallery data
 * @returns Updated activity gallery response
 */
export async function updateActivityGallery(id: number, formData: FormData): Promise<ActivityGalleryDetailResponse> {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        formData.append('id', id.toString())

        const response = await $fetch<ActivityGalleryDetailResponse>(
            `${config.public.apiBase}/api/v1/activity-galleries/update-gallery`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            }
        )

        return response
    } catch (error: any) {
        handleApiError(error)
        throw error
    }
}

/**
 * Delete activity gallery
 * @param id - Activity Gallery ID
 * @returns Delete response
 */
export async function deleteActivityGallery(id: number): Promise<any> {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch(
            `${config.public.apiBase}/api/v1/activity-galleries/delete-gallery`,
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

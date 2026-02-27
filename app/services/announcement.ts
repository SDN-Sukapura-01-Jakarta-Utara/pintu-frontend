/**
 * Announcement Service
 * Handle API calls untuk announcement management
 */

import type { AnnouncementResponse, AnnouncementDetailResponse, AnnouncementSearchFilter } from '~/types/AnnouncementType'

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
 * Get all announcements with filter and pagination
 * @param filters - Search filters
 * @param page - Page number
 * @param limit - Items per page
 * @returns Announcements list response
 */
export async function getAnnouncementList(
    filters: AnnouncementSearchFilter = {},
    page: number = 1,
    limit: number = 10
): Promise<AnnouncementResponse> {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch<AnnouncementResponse>(
            `${config.public.apiBase}/api/v1/announcements/get-announcements`,
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
 * Get announcement by ID
 * @param id - Announcement ID
 * @returns Announcement detail response
 */
export async function getAnnouncementById(id: number): Promise<AnnouncementDetailResponse> {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch<AnnouncementDetailResponse>(
            `${config.public.apiBase}/api/v1/announcements/get-announcement-by-id`,
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
 * Create new announcement
 * @param formData - FormData containing announcement data, gambar, and files
 * @returns Created announcement response
 */
export async function createAnnouncement(formData: FormData): Promise<AnnouncementDetailResponse> {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch<AnnouncementDetailResponse>(
            `${config.public.apiBase}/api/v1/announcements/create-announcement`,
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
 * Update announcement
 * @param id - Announcement ID
 * @param formData - FormData containing updated announcement data
 * @returns Updated announcement response
 */
export async function updateAnnouncement(id: number, formData: FormData): Promise<AnnouncementDetailResponse> {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        formData.append('id', id.toString())

        const response = await $fetch<AnnouncementDetailResponse>(
            `${config.public.apiBase}/api/v1/announcements/update-announcement`,
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
 * Delete announcement
 * @param id - Announcement ID
 * @returns Delete response
 */
export async function deleteAnnouncement(id: number): Promise<any> {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch(
            `${config.public.apiBase}/api/v1/announcements/delete-announcement`,
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

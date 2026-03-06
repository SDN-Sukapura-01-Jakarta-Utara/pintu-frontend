/**
 * Kepegawaian Service
 * Handle API calls untuk kepegawaian management
 */

import type { GetKepegawaianResponse, CreateKepegawaianRequest } from '~/types/KepegawaianType'

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
 * Get all kepegawaian with pagination and search filters
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @param search - Search filters object
 * @returns Kepegawaian list response
 */
export async function getKepegawaianList(page: number = 1, limit: number = 10, search: any = {}): Promise<GetKepegawaianResponse> {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch<GetKepegawaianResponse>(
            `${config.public.apiBase}/api/v1/kepegawaian/get-kepegawaian`,
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
 * Get kepegawaian by ID
 * @param id - Kepegawaian ID
 * @returns Kepegawaian detail data with roles
 */
export async function getKepegawaianById(id: number) {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch(
            `${config.public.apiBase}/api/v1/kepegawaian/get-kepegawaian-by-id`,
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
 * Create kepegawaian
 * @param kepegawaianData - Kepegawaian data to create
 * @returns Created kepegawaian data
 */
export async function createKepegawaian(kepegawaianData: CreateKepegawaianRequest) {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch(
            `${config.public.apiBase}/api/v1/kepegawaian/create-kepegawaian`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: kepegawaianData,
            }
        )

        return response
    } catch (error: any) {
        handleApiError(error)
        throw error
    }
}

/**
 * Update kepegawaian
 * @param id - Kepegawaian ID
 * @param kepegawaianData - Kepegawaian data to update
 * @returns Updated kepegawaian data
 */
export async function updateKepegawaian(id: number, kepegawaianData: any) {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        // Convert to FormData untuk match backend expectation
        const formData = new FormData()
        formData.append('id', id.toString())
        
        // Append all kepegawaian data
        Object.keys(kepegawaianData).forEach(key => {
            const value = kepegawaianData[key]
            if (value === null || value === undefined) {
                return // Skip null/undefined
            }
            if (Array.isArray(value)) {
                // For delete file arrays (files_to_delete, sertifikat_lainnya_to_delete, etc.),
                // append as JSON string to preserve array format
                if (key.endsWith('_to_delete')) {
                    formData.append(key, JSON.stringify(value))
                } else {
                    // For other arrays (like rombel_bidang_studi), append dengan index
                    value.forEach((item, index) => {
                        formData.append(`${key}[${index}]`, item.toString())
                    })
                }
            } else {
                formData.append(key, value.toString())
            }
        })
        
        const response = await $fetch(
            `${config.public.apiBase}/api/v1/kepegawaian/update-kepegawaian`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Jangan set Content-Type, let browser handle FormData
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
 * Update kepegawaian file/document
 * @param id - Kepegawaian ID
 * @param formData - FormData containing file and field_name
 * @returns Updated file response
 */
export async function updateKepegawaianFile(id: number, formData: FormData) {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        // FormData sudah berisi: file, field_name
        // Append ID ke FormData
        formData.append('id', id.toString())
        
        const endpoint = `${config.public.apiBase}/api/v1/kepegawaian/update-kepegawaian`
        
        const response = await $fetch(
            endpoint,
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

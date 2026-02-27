/**
 * Article Service
 * Handle API calls untuk artikel management
 */

import type { ArticleResponse, ArticleDetailResponse, ArticleSearchFilter } from '~/types/ArticleType'

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
 * Get all articles with filter and pagination
 * @param filters - Search filters
 * @param page - Page number
 * @param limit - Items per page
 * @returns Articles list response
 */
export async function getArticleList(
    filters: ArticleSearchFilter = {},
    page: number = 1,
    limit: number = 10
): Promise<ArticleResponse> {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch<ArticleResponse>(
            `${config.public.apiBase}/api/v1/articles/get-articles`,
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
 * Get article by ID
 * @param id - Article ID
 * @returns Article detail response
 */
export async function getArticleById(id: number): Promise<ArticleDetailResponse> {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch<ArticleDetailResponse>(
            `${config.public.apiBase}/api/v1/articles/get-article-by-id`,
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
 * Create new article
 * @param formData - FormData containing article data, gambar, and files
 * @returns Created article response
 */
export async function createArticle(formData: FormData): Promise<ArticleDetailResponse> {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch<ArticleDetailResponse>(
            `${config.public.apiBase}/api/v1/articles/create-article`,
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
 * Update article
 * @param id - Article ID
 * @param formData - FormData containing updated article data
 * @returns Updated article response
 */
export async function updateArticle(id: number, formData: FormData): Promise<ArticleDetailResponse> {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        formData.append('id', id.toString())

        const response = await $fetch<ArticleDetailResponse>(
            `${config.public.apiBase}/api/v1/articles/update-article`,
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
 * Delete article
 * @param id - Article ID
 * @returns Delete response
 */
export async function deleteArticle(id: number): Promise<any> {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    try {
        const response = await $fetch(
            `${config.public.apiBase}/api/v1/articles/delete-article`,
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

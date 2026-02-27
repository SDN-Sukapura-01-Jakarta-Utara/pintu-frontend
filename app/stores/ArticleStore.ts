import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ArticleData, ArticleSearchFilter } from '~/types/ArticleType'
import {
    getArticleList,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
} from '~/services/artikel'

interface PaginationState {
    page: number
    limit: number
    total: number
    totalPages: number
}

export const useArticleStore = defineStore('article', () => {
    // State
    const articles = ref<ArticleData[]>([])
    const currentArticle = ref<ArticleData | null>(null)
    const isLoading = ref(false)
    const isSubmitting = ref(false)
    const error = ref<string | null>(null)
    const pagination = ref<PaginationState>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    })

    // Computed
    const totalArticles = computed(() => pagination.value.total)
    const isEmpty = computed(() => articles.value.length === 0)

    // Actions
    /**
     * Fetch all articles with filters and pagination
     */
    const fetchArticles = async (
        filters: ArticleSearchFilter = {},
        page: number = 1,
        limit: number = 10
    ) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await getArticleList(filters, page, limit)

            articles.value = response.data
            pagination.value = {
                page: response.pagination.page,
                limit: response.pagination.limit,
                total: response.pagination.total,
                totalPages: response.pagination.total_pages,
            }

            return {
                success: true,
                message: 'Data artikel berhasil dimuat',
            }
        } catch (err: any) {
            if (err?.status === 401 || err?.response?.status === 401) {
                return {
                    success: false,
                    message: 'Session expired',
                }
            }

            const apiError = err.data?.message || err.message || 'Gagal memuat data artikel'
            error.value = apiError
            console.error('Error fetching articles:', err)

            return {
                success: false,
                message: apiError,
            }
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Fetch article by ID
     */
    const fetchArticleById = async (id: number) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await getArticleById(id)
            currentArticle.value = response.data

            return {
                success: true,
                message: 'Detail artikel berhasil dimuat',
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal memuat detail artikel'
            error.value = apiError
            console.error('Error fetching article:', err)

            return {
                success: false,
                message: apiError,
            }
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Create new article
     */
    const addArticle = async (formData: FormData) => {
        isSubmitting.value = true
        error.value = null

        try {
            const response = await createArticle(formData)

            // Refresh articles list
            await fetchArticles({}, pagination.value.page, pagination.value.limit)

            return {
                success: true,
                message: 'Artikel berhasil ditambahkan',
                data: response.data,
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal menambahkan artikel'
            error.value = apiError
            console.error('Error creating article:', err)

            return {
                success: false,
                message: apiError,
            }
        } finally {
            isSubmitting.value = false
        }
    }

    /**
     * Update article
     */
    const editArticle = async (id: number, formData: FormData) => {
        isSubmitting.value = true
        error.value = null

        try {
            const response = await updateArticle(id, formData)

            // Refresh articles list
            await fetchArticles({}, pagination.value.page, pagination.value.limit)

            return {
                success: true,
                message: 'Artikel berhasil diperbarui',
                data: response.data,
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal memperbarui artikel'
            error.value = apiError
            console.error('Error updating article:', err)

            return {
                success: false,
                message: apiError,
            }
        } finally {
            isSubmitting.value = false
        }
    }

    /**
     * Delete article
     */
    const removeArticle = async (id: number) => {
        isSubmitting.value = true
        error.value = null

        try {
            await deleteArticle(id)

            // Refresh articles list
            await fetchArticles({}, pagination.value.page, pagination.value.limit)

            return {
                success: true,
                message: 'Artikel berhasil dihapus',
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal menghapus artikel'
            error.value = apiError
            console.error('Error deleting article:', err)

            return {
                success: false,
                message: apiError,
            }
        } finally {
            isSubmitting.value = false
        }
    }

    /**
     * Clear current article
     */
    const clearCurrentArticle = () => {
        currentArticle.value = null
    }

    return {
        articles,
        currentArticle,
        isLoading,
        isSubmitting,
        error,
        pagination,
        totalArticles,
        isEmpty,
        fetchArticles,
        fetchArticleById,
        addArticle,
        editArticle,
        removeArticle,
        clearCurrentArticle,
    }
})

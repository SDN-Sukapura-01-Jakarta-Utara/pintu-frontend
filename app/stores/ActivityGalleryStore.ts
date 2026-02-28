import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ActivityGalleryData, ActivityGallerySearchFilter } from '~/types/ActivityGalleryType'
import {
    getActivityGalleryList,
    getActivityGalleryById,
    createActivityGallery,
    updateActivityGallery,
    deleteActivityGallery,
} from '~/services/activity-gallery'

interface PaginationState {
    page: number
    limit: number
    total: number
    totalPages: number
}

export const useActivityGalleryStore = defineStore('activityGallery', () => {
    // State
    const galleries = ref<ActivityGalleryData[]>([])
    const currentGallery = ref<ActivityGalleryData | null>(null)
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
    const totalGalleries = computed(() => pagination.value.total)
    const isEmpty = computed(() => galleries.value.length === 0)

    // Actions
    /**
     * Fetch all activity galleries with filters and pagination
     */
    const fetchGalleries = async (
        filters: ActivityGallerySearchFilter = {},
        page: number = 1,
        limit: number = 10
    ) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await getActivityGalleryList(filters, page, limit)

            galleries.value = response.data
            pagination.value = {
                page: response.pagination.page,
                limit: response.pagination.limit,
                total: response.pagination.total,
                totalPages: response.pagination.total_pages,
            }

            return {
                success: true,
                message: 'Data galeri kegiatan berhasil dimuat',
            }
        } catch (err: any) {
            if (err?.status === 401 || err?.response?.status === 401) {
                return {
                    success: false,
                    message: 'Session expired',
                }
            }

            const apiError = err.data?.message || err.message || 'Gagal memuat data galeri kegiatan'
            error.value = apiError
            console.error('Error fetching galleries:', err)

            return {
                success: false,
                message: apiError,
            }
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Fetch activity gallery by ID
     */
    const fetchGalleryById = async (id: number) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await getActivityGalleryById(id)
            currentGallery.value = response.data

            return {
                success: true,
                message: 'Detail galeri kegiatan berhasil dimuat',
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal memuat detail galeri kegiatan'
            error.value = apiError
            console.error('Error fetching gallery:', err)

            return {
                success: false,
                message: apiError,
            }
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Create new activity gallery
     */
    const addGallery = async (formData: FormData) => {
        isSubmitting.value = true
        error.value = null

        try {
            const response = await createActivityGallery(formData)

            // Refresh galleries list
            await fetchGalleries({}, pagination.value.page, pagination.value.limit)

            return {
                success: true,
                message: 'Galeri kegiatan berhasil ditambahkan',
                data: response.data,
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal menambahkan galeri kegiatan'
            error.value = apiError
            console.error('Error creating gallery:', err)

            return {
                success: false,
                message: apiError,
            }
        } finally {
            isSubmitting.value = false
        }
    }

    /**
     * Update activity gallery
     */
    const editGallery = async (id: number, formData: FormData) => {
        isSubmitting.value = true
        error.value = null

        try {
            const response = await updateActivityGallery(id, formData)

            // Refresh galleries list
            await fetchGalleries({}, pagination.value.page, pagination.value.limit)

            return {
                success: true,
                message: 'Galeri kegiatan berhasil diperbarui',
                data: response.data,
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal memperbarui galeri kegiatan'
            error.value = apiError
            console.error('Error updating gallery:', err)

            return {
                success: false,
                message: apiError,
            }
        } finally {
            isSubmitting.value = false
        }
    }

    /**
     * Delete activity gallery
     */
    const removeGallery = async (id: number) => {
        isSubmitting.value = true
        error.value = null

        try {
            await deleteActivityGallery(id)

            // Refresh galleries list
            await fetchGalleries({}, pagination.value.page, pagination.value.limit)

            return {
                success: true,
                message: 'Galeri kegiatan berhasil dihapus',
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal menghapus galeri kegiatan'
            error.value = apiError
            console.error('Error deleting gallery:', err)

            return {
                success: false,
                message: apiError,
            }
        } finally {
            isSubmitting.value = false
        }
    }

    /**
     * Clear current gallery
     */
    const clearCurrentGallery = () => {
        currentGallery.value = null
    }

    return {
        galleries,
        currentGallery,
        isLoading,
        isSubmitting,
        error,
        pagination,
        totalGalleries,
        isEmpty,
        fetchGalleries,
        fetchGalleryById,
        addGallery,
        editGallery,
        removeGallery,
        clearCurrentGallery,
    }
})

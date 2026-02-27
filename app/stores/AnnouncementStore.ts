import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AnnouncementData, AnnouncementSearchFilter } from '~/types/AnnouncementType'
import {
    getAnnouncementList,
    getAnnouncementById,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
} from '~/services/announcement'

interface PaginationState {
    page: number
    limit: number
    total: number
    totalPages: number
}

export const useAnnouncementStore = defineStore('announcement', () => {
    // State
    const announcements = ref<AnnouncementData[]>([])
    const currentAnnouncement = ref<AnnouncementData | null>(null)
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
    const totalAnnouncements = computed(() => pagination.value.total)
    const isEmpty = computed(() => announcements.value.length === 0)

    // Actions
    /**
     * Fetch all announcements with filters and pagination
     */
    const fetchAnnouncements = async (
        filters: AnnouncementSearchFilter = {},
        page: number = 1,
        limit: number = 10
    ) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await getAnnouncementList(filters, page, limit)

            announcements.value = response.data
            pagination.value = {
                page: response.pagination.page,
                limit: response.pagination.limit,
                total: response.pagination.total,
                totalPages: response.pagination.total_pages,
            }

            return {
                success: true,
                message: 'Data pengumuman berhasil dimuat',
            }
        } catch (err: any) {
            if (err?.status === 401 || err?.response?.status === 401) {
                return {
                    success: false,
                    message: 'Session expired',
                }
            }

            const apiError = err.data?.message || err.message || 'Gagal memuat data pengumuman'
            error.value = apiError
            console.error('Error fetching announcements:', err)

            return {
                success: false,
                message: apiError,
            }
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Fetch announcement by ID
     */
    const fetchAnnouncementById = async (id: number) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await getAnnouncementById(id)
            currentAnnouncement.value = response.data

            return {
                success: true,
                message: 'Detail pengumuman berhasil dimuat',
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal memuat detail pengumuman'
            error.value = apiError
            console.error('Error fetching announcement:', err)

            return {
                success: false,
                message: apiError,
            }
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Create new announcement
     */
    const addAnnouncement = async (formData: FormData) => {
        isSubmitting.value = true
        error.value = null

        try {
            const response = await createAnnouncement(formData)

            // Refresh announcements list
            await fetchAnnouncements({}, pagination.value.page, pagination.value.limit)

            return {
                success: true,
                message: 'Pengumuman berhasil ditambahkan',
                data: response.data,
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal menambahkan pengumuman'
            error.value = apiError
            console.error('Error creating announcement:', err)

            return {
                success: false,
                message: apiError,
            }
        } finally {
            isSubmitting.value = false
        }
    }

    /**
     * Update announcement
     */
    const editAnnouncement = async (id: number, formData: FormData) => {
        isSubmitting.value = true
        error.value = null

        try {
            const response = await updateAnnouncement(id, formData)

            // Refresh announcements list
            await fetchAnnouncements({}, pagination.value.page, pagination.value.limit)

            return {
                success: true,
                message: 'Pengumuman berhasil diperbarui',
                data: response.data,
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal memperbarui pengumuman'
            error.value = apiError
            console.error('Error updating announcement:', err)

            return {
                success: false,
                message: apiError,
            }
        } finally {
            isSubmitting.value = false
        }
    }

    /**
     * Delete announcement
     */
    const removeAnnouncement = async (id: number) => {
        isSubmitting.value = true
        error.value = null

        try {
            await deleteAnnouncement(id)

            // Refresh announcements list
            await fetchAnnouncements({}, pagination.value.page, pagination.value.limit)

            return {
                success: true,
                message: 'Pengumuman berhasil dihapus',
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal menghapus pengumuman'
            error.value = apiError
            console.error('Error deleting announcement:', err)

            return {
                success: false,
                message: apiError,
            }
        } finally {
            isSubmitting.value = false
        }
    }

    /**
     * Clear current announcement
     */
    const clearCurrentAnnouncement = () => {
        currentAnnouncement.value = null
    }

    return {
        announcements,
        currentAnnouncement,
        isLoading,
        isSubmitting,
        error,
        pagination,
        totalAnnouncements,
        isEmpty,
        fetchAnnouncements,
        fetchAnnouncementById,
        addAnnouncement,
        editAnnouncement,
        removeAnnouncement,
        clearCurrentAnnouncement,
    }
})

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PrestasiData, PrestasiSearchFilter } from '~/types/PrestasiType'
import { getPrestasiList, createPrestasi, updatePrestasi, deletePrestasi } from '~/services/prestasi'

interface PaginationState {
    page: number
    limit: number
    total: number
    totalPages: number
}

export const usePrestasiStore = defineStore('prestasi', () => {
    // State
    const prestasis = ref<PrestasiData[]>([])
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
    const total = computed(() => pagination.value.total)
    const isEmpty = computed(() => prestasis.value.length === 0)

    // Actions
    /**
     * Fetch all prestasi with filters and pagination
     */
    const fetchPrestasi = async (
        filters: PrestasiSearchFilter = {},
        page: number = 1,
        limit: number = 10
    ) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await getPrestasiList(filters, page, limit)

            prestasis.value = response.data
            pagination.value = {
                page: response.pagination.page,
                limit: response.pagination.limit,
                total: response.pagination.total,
                totalPages: response.pagination.total_pages,
            }

            return {
                success: true,
                message: 'Data prestasi berhasil dimuat',
            }
        } catch (err: any) {
            if (err?.status === 401 || err?.response?.status === 401) {
                return {
                    success: false,
                    message: 'Session expired',
                }
            }

            const apiError = err.data?.message || err.message || 'Gagal memuat data prestasi'
            error.value = apiError
            console.error('Error fetching prestasi:', err)

            return {
                success: false,
                message: apiError,
            }
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Create new prestasi
     */
    const addPrestasi = async (formData: FormData) => {
        isSubmitting.value = true
        error.value = null

        try {
            await createPrestasi(formData)

            pagination.value.page = 1
            await fetchPrestasi()

            return {
                success: true,
                message: 'Prestasi berhasil ditambahkan',
            }
        } catch (err: any) {
            let apiError = 'Gagal menambahkan prestasi'

            if (err?.data?.errors && typeof err.data.errors === 'object') {
                const errors = err.data.errors
                const errorMessages = Object.values(errors).filter(msg => msg && typeof msg === 'string') as string[]
                if (errorMessages.length > 0) {
                    apiError = errorMessages[0]
                }
            } else if (err?.data?.error) {
                apiError = err.data.error
            } else if (err?.data?.message) {
                apiError = err.data.message
            } else if (err?.message) {
                apiError = err.message
            }

            error.value = apiError
            console.error('Error creating prestasi:', err)

            return {
                success: false,
                message: apiError,
            }
        } finally {
            isSubmitting.value = false
        }
    }

    /**
     * Update prestasi
     */
    const editPrestasi = async (formData: FormData) => {
        isSubmitting.value = true
        error.value = null

        try {
            await updatePrestasi(formData)

            pagination.value.page = 1
            await fetchPrestasi()

            return {
                success: true,
                message: 'Prestasi berhasil diperbarui',
            }
        } catch (err: any) {
            let apiError = 'Gagal mengupdate prestasi'

            if (err?.data?.errors && typeof err.data.errors === 'object') {
                const errors = err.data.errors
                const errorMessages = Object.values(errors).filter(msg => msg && typeof msg === 'string') as string[]
                if (errorMessages.length > 0) {
                    apiError = errorMessages[0]
                }
            } else if (err?.data?.error) {
                apiError = err.data.error
            } else if (err?.data?.message) {
                apiError = err.data.message
            } else if (err?.message) {
                apiError = err.message
            }

            error.value = apiError
            console.error('Error updating prestasi:', err)

            return {
                success: false,
                message: apiError,
            }
        } finally {
            isSubmitting.value = false
        }
    }

    /**
     * Delete prestasi
     */
    const removePrestasi = async (id: number) => {
        isSubmitting.value = true
        error.value = null

        try {
            await deletePrestasi(id)

            // Remove from list
            prestasis.value = prestasis.value.filter(p => p.id !== id)
            pagination.value.total--

            return {
                success: true,
                message: 'Prestasi berhasil dihapus',
            }
        } catch (err: any) {
            let apiError = 'Gagal menghapus prestasi'

            if (err?.data?.errors && typeof err.data.errors === 'object') {
                const errors = err.data.errors
                const errorMessages = Object.values(errors).filter(msg => msg && typeof msg === 'string') as string[]
                if (errorMessages.length > 0) {
                    apiError = errorMessages[0]
                }
            } else if (err?.data?.error) {
                apiError = err.data.error
            } else if (err?.data?.message) {
                apiError = err.data.message
            } else if (err?.message) {
                apiError = err.message
            }

            error.value = apiError
            console.error('Error deleting prestasi:', err)

            return {
                success: false,
                message: apiError,
            }
        } finally {
            isSubmitting.value = false
        }
    }

    // Clear error
    const clearError = () => {
        error.value = null
    }

    return {
        // State
        prestasis,
        isLoading,
        isSubmitting,
        error,
        pagination,
        // Computed
        total,
        isEmpty,
        // Methods
        fetchPrestasi,
        addPrestasi,
        editPrestasi,
        removePrestasi,
        clearError,
    }
})

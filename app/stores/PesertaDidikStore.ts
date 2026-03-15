import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PesertaDidikData, PesertaDidikSearchFilter } from '~/types/PesertaDidikType'
import {
    getPesertaDidikList,
    getPesertaDidikById,
    createPesertaDidik,
    updatePesertaDidik,
    deletePesertaDidik,
} from '~/services/peserta-didik'

interface PaginationState {
    page: number
    limit: number
    total: number
    totalPages: number
}

export const usePesertaDidikStore = defineStore('peserta-didik', () => {
    // State
    const pesertaDidiks = ref<PesertaDidikData[]>([])
    const currentPesertaDidik = ref<PesertaDidikData | null>(null)
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
    const totalPesertaDidik = computed(() => pagination.value.total)
    const isEmpty = computed(() => pesertaDidiks.value.length === 0)

    // Actions
    /**
     * Fetch all peserta didik with filters and pagination
     */
    const fetchPesertaDidik = async (
        filters: PesertaDidikSearchFilter = {},
        page: number = 1,
        limit: number = 10
    ) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await getPesertaDidikList(filters, page, limit)

            pesertaDidiks.value = response.data
            pagination.value = {
                page: response.pagination.page,
                limit: response.pagination.limit,
                total: response.pagination.total,
                totalPages: response.pagination.total_pages,
            }

            return {
                success: true,
                message: 'Data peserta didik berhasil dimuat',
            }
        } catch (err: any) {
            if (err?.status === 401 || err?.response?.status === 401) {
                return {
                    success: false,
                    message: 'Session expired',
                }
            }

            const apiError = err.data?.message || err.message || 'Gagal memuat data peserta didik'
            error.value = apiError
            console.error('Error fetching peserta didik:', err)

            return {
                success: false,
                message: apiError,
            }
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Get peserta didik detail by ID
     */
    const getPesertaDidikDetail = async (id: number) => {
        try {
            const response = await getPesertaDidikById(id)
            currentPesertaDidik.value = response.data
            return {
                success: true,
                data: response.data,
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal memuat detail peserta didik'
            error.value = apiError
            console.error('Error fetching peserta didik detail:', err)

            return {
                success: false,
                message: apiError,
            }
        }
    }

    /**
     * Create new peserta didik
     */
    const addPesertaDidik = async (data: any) => {
        isSubmitting.value = true
        error.value = null

        try {
            await createPesertaDidik(data)

            // Reset filters and refresh list
            pagination.value.page = 1
            await fetchPesertaDidik()

            return {
                success: true,
                message: 'Peserta didik berhasil ditambahkan',
            }
        } catch (err: any) {
            let apiError = 'Gagal menambahkan peserta didik'
            
            // Handle validation errors structure: {"errors": {"field": "message"}}
            if (err?.data?.errors && typeof err.data.errors === 'object') {
                const errors = err.data.errors
                const errorMessages = Object.values(errors).filter(msg => msg && typeof msg === 'string') as string[]
                if (errorMessages.length > 0) {
                    apiError = errorMessages[0]
                }
            } else if (err?.data?.error) {
                // Handle single error message: {"error": "message"}
                apiError = err.data.error
            } else if (err?.data?.message) {
                apiError = err.data.message
            } else if (err?.message) {
                apiError = err.message
            }
            
            error.value = apiError
            console.error('Error creating peserta didik:', err)

            return {
                success: false,
                message: apiError,
            }
        } finally {
            isSubmitting.value = false
        }
    }

    /**
     * Update peserta didik
     */
    const editPesertaDidik = async (id: number, data: any) => {
        isSubmitting.value = true
        error.value = null

        try {
            await updatePesertaDidik(id, data)

            // Refresh list
            await fetchPesertaDidik()

            return {
                success: true,
                message: 'Peserta didik berhasil diperbarui',
            }
        } catch (err: any) {
            let apiError = 'Gagal mengupdate peserta didik'
            
            // Handle validation errors structure: {"errors": {"field": "message"}}
            if (err?.data?.errors && typeof err.data.errors === 'object') {
                const errors = err.data.errors
                const errorMessages = Object.values(errors).filter(msg => msg && typeof msg === 'string') as string[]
                if (errorMessages.length > 0) {
                    apiError = errorMessages[0]
                }
            } else if (err?.data?.error) {
                // Handle single error message: {"error": "message"}
                apiError = err.data.error
            } else if (err?.data?.message) {
                apiError = err.data.message
            } else if (err?.message) {
                apiError = err.message
            }
            
            error.value = apiError
            console.error('Error updating peserta didik:', err)

            return {
                success: false,
                message: apiError,
            }
        } finally {
            isSubmitting.value = false
        }
    }

    /**
     * Delete peserta didik
     */
    const removePesertaDidik = async (id: number) => {
        isSubmitting.value = true
        error.value = null

        try {
            await deletePesertaDidik(id)

            // Remove from list
            pesertaDidiks.value = pesertaDidiks.value.filter(pd => pd.id !== id)
            pagination.value.total--

            return {
                success: true,
                message: 'Peserta didik berhasil dihapus',
            }
        } catch (err: any) {
            let apiError = 'Gagal menghapus peserta didik'
            
            // Handle validation errors structure: {"errors": {"field": "message"}}
            if (err?.data?.errors && typeof err.data.errors === 'object') {
                const errors = err.data.errors
                const errorMessages = Object.values(errors).filter(msg => msg && typeof msg === 'string') as string[]
                if (errorMessages.length > 0) {
                    apiError = errorMessages[0]
                }
            } else if (err?.data?.error) {
                // Handle single error message: {"error": "message"}
                apiError = err.data.error
            } else if (err?.data?.message) {
                apiError = err.data.message
            } else if (err?.message) {
                apiError = err.message
            }
            
            error.value = apiError
            console.error('Error deleting peserta didik:', err)

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
        pesertaDidiks,
        currentPesertaDidik,
        isLoading,
        isSubmitting,
        error,
        pagination,
        // Computed
        total,
        totalPesertaDidik,
        isEmpty,
        // Methods
        fetchPesertaDidik,
        getPesertaDidikDetail,
        addPesertaDidik,
        editPesertaDidik,
        removePesertaDidik,
        clearError,
    }
})

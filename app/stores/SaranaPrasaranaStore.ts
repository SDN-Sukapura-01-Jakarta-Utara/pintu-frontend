import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  SaranaPrasaranaData,
  SaranaPrasaranaResponse,
} from '~/types/SaranaPrasaranaType'
import {
  getSaranaPrasaranaList,
  getSaranaPrasaranaById,
  createSaranaPrasarana,
  updateSaranaPrasarana,
  deleteSaranaPrasarana,
} from '~/services/sarana-prasarana'

interface SaranaPrasaranaError {
  message: string
  status: string
}

export const useSaranaPrasaranaStore = defineStore(
  'saranaPrasarana',
  () => {
    // State
    const saranaPrasaranaList = ref<SaranaPrasaranaData[]>([])
    const currentSaranaPrasarana = ref<SaranaPrasaranaData | null>(null)
    const isLoading = ref(false)
    const isSubmitting = ref(false)
    const error = ref<SaranaPrasaranaError | null>(null)
    const total = ref(0)
    const limit = ref(10)
    const page = ref(1)
    const offset = ref(0)

    // Search state
    const searchName = ref('')
    const searchStatus = ref('')

    // Computed
    const isEmpty = computed(() => saranaPrasaranaList.value.length === 0)
    const hasError = computed(() => error.value !== null)
    const totalPages = computed(() => {
      return Math.ceil(total.value / limit.value)
    })

    // Actions
    /**
     * Fetch all sarana prasarana data with search and pagination
     */
    const fetchSaranaPrasaranaList = async (
      customLimit?: number,
      customPage?: number
    ) => {
      isLoading.value = true
      error.value = null

      try {
        const pageNum = customPage || page.value
        const limitNum = customLimit || limit.value

        const response = await getSaranaPrasaranaList({
          search: {
            name: searchName.value,
            status: (searchStatus.value as any) || undefined,
          },
          pagination: {
            limit: limitNum,
            page: pageNum,
          },
        })

        saranaPrasaranaList.value = response.data
        total.value = response.pagination.total
        limit.value = response.pagination.limit
        offset.value = response.pagination.offset
        page.value = response.pagination.page

        return response
      } catch (err: any) {
        const apiError =
          err.data?.message ||
          err.message ||
          'Gagal memuat data sarana prasarana'

        error.value = {
          message: apiError,
          status: 'error',
        }

        console.error('Error fetching sarana prasarana:', err)
        throw err
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Fetch sarana prasarana by ID
     */
    const fetchSaranaPrasaranaById = async (id: number) => {
      isLoading.value = true
      error.value = null

      try {
        const response = await getSaranaPrasaranaById(id)
        currentSaranaPrasarana.value = response.data
        return response
      } catch (err: any) {
        const apiError =
          err.data?.message ||
          err.message ||
          'Gagal memuat detail sarana prasarana'

        error.value = {
          message: apiError,
          status: 'error',
        }

        console.error('Error fetching sarana prasarana by ID:', err)
        throw err
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Create new sarana prasarana
     */
    const handleCreateSaranaPrasarana = async (payload: any) => {
      isSubmitting.value = true
      error.value = null

      try {
        const response = await createSaranaPrasarana(payload)

        // Add to list
        if (response.data) {
          saranaPrasaranaList.value.unshift(response.data)
          total.value++
        }

        return {
          success: true,
          message: 'Sarana prasarana berhasil ditambahkan',
          data: response.data,
        }
      } catch (err: any) {
        const apiError =
          err.data?.message ||
          err.message ||
          'Gagal menambahkan sarana prasarana'

        error.value = {
          message: apiError,
          status: 'error',
        }

        console.error('Error creating sarana prasarana:', err)

        return {
          success: false,
          message: apiError,
        }
      } finally {
        isSubmitting.value = false
      }
    }

    /**
     * Update sarana prasarana
     */
    const handleUpdateSaranaPrasarana = async (id: number, payload: any) => {
      isSubmitting.value = true
      error.value = null

      try {
        const response = await updateSaranaPrasarana({ id, ...payload })

        // Update in list
        const index = saranaPrasaranaList.value.findIndex(
          (item) => item.id === id
        )
        if (index !== -1 && response.data) {
          saranaPrasaranaList.value[index] = response.data
        }

        return {
          success: true,
          message: 'Sarana prasarana berhasil diperbarui',
          data: response.data,
        }
      } catch (err: any) {
        const apiError =
          err.data?.message ||
          err.message ||
          'Gagal memperbarui sarana prasarana'

        error.value = {
          message: apiError,
          status: 'error',
        }

        console.error('Error updating sarana prasarana:', err)

        return {
          success: false,
          message: apiError,
        }
      } finally {
        isSubmitting.value = false
      }
    }

    /**
     * Delete sarana prasarana
     */
    const handleDeleteSaranaPrasarana = async (id: number) => {
      isSubmitting.value = true
      error.value = null

      try {
        await deleteSaranaPrasarana(id)

        // Remove from list
        saranaPrasaranaList.value = saranaPrasaranaList.value.filter(
          (item) => item.id !== id
        )
        total.value--

        return {
          success: true,
          message: 'Sarana prasarana berhasil dihapus',
        }
      } catch (err: any) {
        const apiError =
          err.data?.message || err.message || 'Gagal menghapus sarana prasarana'

        error.value = {
          message: apiError,
          status: 'error',
        }

        console.error('Error deleting sarana prasarana:', err)

        return {
          success: false,
          message: apiError,
        }
      } finally {
        isSubmitting.value = false
      }
    }

    /**
     * Set search filters
     */
    const setSearchFilters = (name: string, status: string) => {
      searchName.value = name
      searchStatus.value = status
      page.value = 1 // Reset to first page when searching
    }

    /**
     * Clear search filters
     */
    const clearSearchFilters = () => {
      searchName.value = ''
      searchStatus.value = ''
      page.value = 1
    }

    /**
     * Set current page
     */
    const setCurrentPage = (newPage: number) => {
      page.value = newPage
    }

    /**
     * Clear error
     */
    const clearError = () => {
      error.value = null
    }

    /**
     * Reset store
     */
    const reset = () => {
      saranaPrasaranaList.value = []
      currentSaranaPrasarana.value = null
      isLoading.value = false
      isSubmitting.value = false
      error.value = null
      total.value = 0
      limit.value = 10
      page.value = 1
      offset.value = 0
      searchName.value = ''
      searchStatus.value = ''
    }

    return {
      // State
      saranaPrasaranaList,
      currentSaranaPrasarana,
      isLoading,
      isSubmitting,
      error,
      total,
      limit,
      page,
      offset,
      searchName,
      searchStatus,

      // Computed
      isEmpty,
      hasError,
      totalPages,

      // Methods
      fetchSaranaPrasaranaList,
      fetchSaranaPrasaranaById,
      handleCreateSaranaPrasarana,
      handleUpdateSaranaPrasarana,
      handleDeleteSaranaPrasarana,
      setSearchFilters,
      clearSearchFilters,
      setCurrentPage,
      clearError,
      reset,
    }
  }
)

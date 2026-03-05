import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { KepegawaianData } from '~/types/KepegawaianType'
import { getKepegawaianList, createKepegawaian, updateKepegawaian } from '~/services/kepegawaian'

export const useKepegawaianStore = defineStore('kepegawaian', () => {
  // State
  const kepegawaians = ref<KepegawaianData[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)

  // Computed
  const kepegawaianCount = computed(() => kepegawaians.value.length)

  // Get all kepegawaian with pagination and search filters
  const fetchKepegawaian = async (page: number = 1, limit: number = 10, search: any = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await getKepegawaianList(page, limit, search)
      
      // Handle null or empty data response
      const responseData = response.data || []
      
      kepegawaians.value = responseData
      total.value = response.pagination?.total || responseData.length
      
      return {
        success: true,
        message: 'Data kepegawaian berhasil dimuat'
      }
    } catch (err: any) {
      // Skip error handling for 401 - already handled globally
      if (err?.status === 401 || err?.response?.status === 401) {
        return {
          success: false,
          message: 'Session expired'
        }
      }

      const apiError = err.data?.message || err.message || 'Gagal memuat data kepegawaian'
      error.value = apiError
      console.error('Error fetching kepegawaian:', err)
      
      return {
        success: false,
        message: apiError
      }
    } finally {
      isLoading.value = false
    }
  }

  // Create kepegawaian
  const addKepegawaian = async (kepegawaianData: any) => {
    isLoading.value = true
    error.value = null

    try {
      await createKepegawaian(kepegawaianData)
      
      // Refresh kepegawaian list
      await fetchKepegawaian()
      
      return {
        success: true,
        message: 'Pendidik berhasil ditambahkan'
      }
    } catch (err: any) {
      let apiError = 'Gagal menambah pendidik'
      
      // Extract error message from different response structures
      if (err.data?.message) {
        apiError = err.data.message
      } else if (err.data?.errors) {
        // Backend returns validation errors as {"errors": {"field": "message"}}
        const errors = err.data.errors
        const errorMessages = Object.values(errors).filter(msg => msg).join(', ')
        if (errorMessages) {
          apiError = errorMessages
        }
      } else if (err.message) {
        apiError = err.message
      }
      
      error.value = apiError
      console.error('Error creating kepegawaian:', err)
      
      return {
        success: false,
        message: apiError
      }
    } finally {
      isLoading.value = false
    }
  }

  // Update kepegawaian
  const updateKepegawaianData = async (id: number, kepegawaianData: any) => {
    isLoading.value = true
    error.value = null

    try {
      await updateKepegawaian(id, kepegawaianData)
      
      // Refresh kepegawaian list
      await fetchKepegawaian()
      
      return {
        success: true,
        message: 'Pendidik berhasil diperbarui'
      }
    } catch (err: any) {
      let apiError = 'Gagal memperbarui pendidik'
      
      // Extract error message from different response structures
      if (err.data?.message) {
        apiError = err.data.message
      } else if (err.data?.errors) {
        // Backend returns validation errors as {"errors": {"field": "message"}}
        const errors = err.data.errors
        const errorMessages = Object.values(errors).filter(msg => msg).join(', ')
        if (errorMessages) {
          apiError = errorMessages
        }
      } else if (err.message) {
        apiError = err.message
      }
      
      error.value = apiError
      console.error('Error updating kepegawaian:', err)
      
      return {
        success: false,
        message: apiError
      }
    } finally {
      isLoading.value = false
    }
  }

  // Clear error
  const clearError = () => {
    error.value = null
  }

  return {
    // State
    kepegawaians,
    isLoading,
    error,
    total,
    // Computed
    kepegawaianCount,
    // Methods
    fetchKepegawaian,
    addKepegawaian,
    updateKepegawaian: updateKepegawaianData,
    clearError,
  }
})

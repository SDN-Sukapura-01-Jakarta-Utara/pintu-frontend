import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PublicJumbotronData } from '~/types/PublicHomeType'
import { getPublicJumbotron, getPublicTotalSiswa } from '~/services/public-home'

interface PublicHomeError {
  message: string
  status: string
}

export const usePublicHomeStore = defineStore('publicHome', () => {
  // State
  const jumbotronList = ref<PublicJumbotronData[]>([])
  const totalSiswa = ref<number>(0)
  const isLoading = ref(false)
  const error = ref<PublicHomeError | null>(null)

  // Computed
  const isEmpty = computed(() => jumbotronList.value.length === 0)
  const hasError = computed(() => error.value !== null)
  const activeJumbotron = computed(() => 
    jumbotronList.value.filter(item => item.status === 'active')
  )

  // Actions
  /**
   * Fetch public jumbotron data
   */
  const fetchPublicJumbotron = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await getPublicJumbotron()
      jumbotronList.value = response.data

      return response
    } catch (err: any) {
      const apiError = err.data?.message || err.message || 'Gagal memuat data jumbotron'

      error.value = {
        message: apiError,
        status: 'error',
      }

      console.error('Error fetching public jumbotron:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch public total siswa data
   */
  const fetchPublicTotalSiswa = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await getPublicTotalSiswa()
      totalSiswa.value = response.data.total_siswa

      return response
    } catch (err: any) {
      const apiError = err.data?.message || err.message || 'Gagal memuat data total siswa'

      error.value = {
        message: apiError,
        status: 'error',
      }

      console.error('Error fetching public total siswa:', err)
      throw err
    } finally {
      isLoading.value = false
    }
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
    jumbotronList.value = []
    totalSiswa.value = 0
    isLoading.value = false
    error.value = null
  }

  return {
    // State
    jumbotronList,
    totalSiswa,
    isLoading,
    error,

    // Computed
    isEmpty,
    hasError,
    activeJumbotron,

    // Methods
    fetchPublicJumbotron,
    fetchPublicTotalSiswa,
    clearError,
    reset,
  }
})

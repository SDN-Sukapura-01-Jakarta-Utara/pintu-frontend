import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { VisiMisiData } from '~/types/VisiMisiType'
import { getVisiMisiById, createVisiMisi, updateVisiMisi } from '~/services/visi-misi'

export const useVisiMisiStore = defineStore('visiMisi', () => {
  // State
  const visiMisi = ref<VisiMisiData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Fetch visi misi by ID
  const fetchVisiMisi = async (id: number = 1) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await getVisiMisiById(id)
      
      if (response && response.data) {
        visiMisi.value = response.data
      } else {
        visiMisi.value = null
      }
      
      return {
        success: true,
        message: 'Data visi misi berhasil dimuat'
      }
    } catch (err: any) {
      if (err?.status === 401 || err?.response?.status === 401) {
        return {
          success: false,
          message: 'Session expired'
        }
      }

      const apiError = err.data?.message || err.message || 'Gagal memuat data visi misi'
      error.value = apiError
      console.error('Error fetching visi misi:', err)
      
      return {
        success: false,
        message: apiError
      }
    } finally {
      isLoading.value = false
    }
  }

  // Create visi misi
  const createData = async (payload: { visi: string; misi: string }) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await createVisiMisi(payload)
      
      if (response && response.data) {
        visiMisi.value = response.data
      }
      
      return {
        success: true,
        message: 'Data visi misi berhasil ditambahkan'
      }
    } catch (err: any) {
      const apiError = err.data?.message || err.message || 'Gagal membuat data visi misi'
      error.value = apiError
      console.error('Error creating visi misi:', err)
      
      return {
        success: false,
        message: apiError
      }
    } finally {
      isLoading.value = false
    }
  }

  // Update visi misi
  const updateData = async (id: number, payload: { visi: string; misi: string }) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await updateVisiMisi(id, payload)
      
      if (response && response.data) {
        visiMisi.value = response.data
      }
      
      return {
        success: true,
        message: 'Data visi misi berhasil diperbarui'
      }
    } catch (err: any) {
      const apiError = err.data?.message || err.message || 'Gagal mengupdate data visi misi'
      error.value = apiError
      console.error('Error updating visi misi:', err)
      
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
    visiMisi,
    isLoading,
    error,
    // Methods
    fetchVisiMisi,
    createData,
    updateData,
    clearError,
  }
})

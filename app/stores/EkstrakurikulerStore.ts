import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { EkstrakurikulerData } from '~/types/EkstrakurikulerType'
import { getEkstrakurikulerList, deleteEkstrakurikuler, updateEkstrakurikuler } from '~/services/ekstrakurikuler'

export const useEkstrakurikulerStore = defineStore('ekstrakurikuler', () => {
    // State
    const ekstrakurikulers = ref<EkstrakurikulerData[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const total = ref(0)

    // Computed
    const ekstrakurikulerCount = computed(() => ekstrakurikulers.value.length)

    // Get all ekstrakurikuler with pagination and search filters
    const fetchEkstrakurikulers = async (page: number = 1, limit: number = 10, search: any = {}) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await getEkstrakurikulerList(page, limit, search)
            
            // Handle null or empty data response
            const responseData = response.data || []
            
            ekstrakurikulers.value = responseData
            total.value = response.pagination?.total || responseData.length
            
            return {
                success: true,
                message: 'Data ekstrakurikuler berhasil dimuat'
            }
        } catch (err: any) {
            // Skip error handling for 401 - already handled globally
            if (err?.status === 401 || err?.response?.status === 401) {
                return {
                    success: false,
                    message: 'Session expired'
                }
            }

            const apiError = err.data?.message || err.message || 'Gagal memuat data ekstrakurikuler'
            error.value = apiError
            console.error('Error fetching ekstrakurikuler:', err)
            
            return {
                success: false,
                message: apiError
            }
        } finally {
            isLoading.value = false
        }
    }

    // Update ekstrakurikuler
    const editEkstrakurikuler = async (id: number, ekstrakurikulerData: any) => {
        isLoading.value = true
        error.value = null

        try {
            await updateEkstrakurikuler({ id, ...ekstrakurikulerData })
            
            // Refresh ekstrakurikuler list
            await fetchEkstrakurikulers()
            
            return {
                success: true,
                message: 'Ekstrakurikuler berhasil diperbarui'
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal mengupdate ekstrakurikuler'
            error.value = apiError
            console.error('Error updating ekstrakurikuler:', err)
            
            return {
                success: false,
                message: apiError
            }
        } finally {
            isLoading.value = false
        }
    }

    // Delete ekstrakurikuler
    const removeEkstrakurikuler = async (id: number) => {
        isLoading.value = true
        error.value = null

        try {
            await deleteEkstrakurikuler(id)
            
            // Remove from list
            ekstrakurikulers.value = ekstrakurikulers.value.filter(ekstrakurikuler => ekstrakurikuler.id !== id)
            total.value--
            
            return {
                success: true,
                message: 'Ekstrakurikuler berhasil dihapus'
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal menghapus ekstrakurikuler'
            error.value = apiError
            console.error('Error deleting ekstrakurikuler:', err)
            
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
        ekstrakurikulers,
        isLoading,
        error,
        total,
        // Computed
        ekstrakurikulerCount,
        // Methods
        fetchEkstrakurikulers,
        editEkstrakurikuler,
        removeEkstrakurikuler,
        clearError,
    }
})

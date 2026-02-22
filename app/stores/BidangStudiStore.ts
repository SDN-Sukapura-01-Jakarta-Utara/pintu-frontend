import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BidangStudiData } from '~/types/BidangStudiType'
import { getBidangStudiList, deleteBidangStudi, updateBidangStudi } from '~/services/bidang-studi'

export const useBidangStudiStore = defineStore('bidang-studi', () => {
    // State
    const bidangStudis = ref<BidangStudiData[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const total = ref(0)

    // Computed
    const bidangStudiCount = computed(() => bidangStudis.value.length)

    // Get all bidang studi with pagination and search filters
    const fetchBidangStudis = async (page: number = 1, limit: number = 10, search: any = {}) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await getBidangStudiList(page, limit, search)
            
            // Handle null or empty data response
            const responseData = response.data || []
            
            bidangStudis.value = responseData
            total.value = response.pagination?.total || responseData.length
            
            return {
                success: true,
                message: 'Data bidang studi berhasil dimuat'
            }
        } catch (err: any) {
            // Skip error handling for 401 - already handled globally
            if (err?.status === 401 || err?.response?.status === 401) {
                return {
                    success: false,
                    message: 'Session expired'
                }
            }

            const apiError = err.data?.message || err.message || 'Gagal memuat data bidang studi'
            error.value = apiError
            console.error('Error fetching bidang studi:', err)
            
            return {
                success: false,
                message: apiError
            }
        } finally {
            isLoading.value = false
        }
    }

    // Update bidang studi
    const editBidangStudi = async (id: number, bidangStudiData: any) => {
        isLoading.value = true
        error.value = null

        try {
            await updateBidangStudi({ id, ...bidangStudiData })
            
            // Refresh bidang studi list
            await fetchBidangStudis()
            
            return {
                success: true,
                message: 'Bidang studi berhasil diperbarui'
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal mengupdate bidang studi'
            error.value = apiError
            console.error('Error updating bidang studi:', err)
            
            return {
                success: false,
                message: apiError
            }
        } finally {
            isLoading.value = false
        }
    }

    // Delete bidang studi
    const removeBidangStudi = async (id: number) => {
        isLoading.value = true
        error.value = null

        try {
            await deleteBidangStudi(id)
            
            // Remove from list
            bidangStudis.value = bidangStudis.value.filter(bidangStudi => bidangStudi.id !== id)
            total.value--
            
            return {
                success: true,
                message: 'Bidang studi berhasil dihapus'
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal menghapus bidang studi'
            error.value = apiError
            console.error('Error deleting bidang studi:', err)
            
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
        bidangStudis,
        isLoading,
        error,
        total,
        // Computed
        bidangStudiCount,
        // Methods
        fetchBidangStudis,
        editBidangStudi,
        removeBidangStudi,
        clearError,
    }
})

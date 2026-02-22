import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RombelData } from '~/types/RombelType'
import { getRombelList, deleteRombel, updateRombel } from '~/services/rombel'

export const useRombelStore = defineStore('rombel', () => {
    // State
    const rombels = ref<RombelData[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const total = ref(0)

    // Computed
    const rombelCount = computed(() => rombels.value.length)

    // Get all rombel with pagination and search filters
    const fetchRombels = async (page: number = 1, limit: number = 10, search: any = {}) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await getRombelList(page, limit, search)
            
            // Handle null or empty data response
            const responseData = response.data || []
            
            rombels.value = responseData
            total.value = response.pagination?.total || responseData.length
            
            return {
                success: true,
                message: 'Data rombel berhasil dimuat'
            }
        } catch (err: any) {
            // Skip error handling for 401 - already handled globally
            if (err?.status === 401 || err?.response?.status === 401) {
                return {
                    success: false,
                    message: 'Session expired'
                }
            }

            const apiError = err.data?.message || err.message || 'Gagal memuat data rombel'
            error.value = apiError
            console.error('Error fetching rombel:', err)
            
            return {
                success: false,
                message: apiError
            }
        } finally {
            isLoading.value = false
        }
    }

    // Update rombel
    const editRombel = async (id: number, rombelData: any) => {
        isLoading.value = true
        error.value = null

        try {
            await updateRombel({ id, ...rombelData })
            
            // Refresh rombel list
            await fetchRombels()
            
            return {
                success: true,
                message: 'Rombel berhasil diperbarui'
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal mengupdate rombel'
            error.value = apiError
            console.error('Error updating rombel:', err)
            
            return {
                success: false,
                message: apiError
            }
        } finally {
            isLoading.value = false
        }
    }

    // Delete rombel
    const removeRombel = async (id: number) => {
        isLoading.value = true
        error.value = null

        try {
            await deleteRombel(id)
            
            // Remove from list
            rombels.value = rombels.value.filter(rombel => rombel.id !== id)
            total.value--
            
            return {
                success: true,
                message: 'Rombel berhasil dihapus'
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal menghapus rombel'
            error.value = apiError
            console.error('Error deleting rombel:', err)
            
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
        rombels,
        isLoading,
        error,
        total,
        // Computed
        rombelCount,
        // Methods
        fetchRombels,
        editRombel,
        removeRombel,
        clearError,
    }
})

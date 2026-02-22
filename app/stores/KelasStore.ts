import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { KelasData } from '~/types/KelasType'
import { getKelasList, deleteKelas, updateKelas } from '~/services/kelas'

export const useKelasStore = defineStore('kelas', () => {
    // State
    const kelases = ref<KelasData[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const total = ref(0)

    // Computed
    const kelasCount = computed(() => kelases.value.length)

    // Get all kelas with pagination and search filters
    const fetchKelases = async (page: number = 1, limit: number = 10, search: any = {}) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await getKelasList(page, limit, search)
            
            // Handle null or empty data response
            const responseData = response.data || []
            
            kelases.value = responseData
            total.value = response.pagination?.total || responseData.length
            
            return {
                success: true,
                message: 'Data kelas berhasil dimuat'
            }
        } catch (err: any) {
            // Skip error handling for 401 - already handled globally
            if (err?.status === 401 || err?.response?.status === 401) {
                return {
                    success: false,
                    message: 'Session expired'
                }
            }

            const apiError = err.data?.message || err.message || 'Gagal memuat data kelas'
            error.value = apiError
            console.error('Error fetching kelas:', err)
            
            return {
                success: false,
                message: apiError
            }
        } finally {
            isLoading.value = false
        }
    }

    // Update kelas
    const editKelas = async (id: number, kelasData: any) => {
        isLoading.value = true
        error.value = null

        try {
            await updateKelas({ id, ...kelasData })
            
            // Refresh kelas list
            await fetchKelases()
            
            return {
                success: true,
                message: 'Kelas berhasil diperbarui'
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal mengupdate kelas'
            error.value = apiError
            console.error('Error updating kelas:', err)
            
            return {
                success: false,
                message: apiError
            }
        } finally {
            isLoading.value = false
        }
    }

    // Delete kelas
    const removeKelas = async (id: number) => {
        isLoading.value = true
        error.value = null

        try {
            await deleteKelas(id)
            
            // Remove from list
            kelases.value = kelases.value.filter(kelas => kelas.id !== id)
            total.value--
            
            return {
                success: true,
                message: 'Kelas berhasil dihapus'
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal menghapus kelas'
            error.value = apiError
            console.error('Error deleting kelas:', err)
            
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
        kelases,
        isLoading,
        error,
        total,
        // Computed
        kelasCount,
        // Methods
        fetchKelases,
        editKelas,
        removeKelas,
        clearError,
    }
})

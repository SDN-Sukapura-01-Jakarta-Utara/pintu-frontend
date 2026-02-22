import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TahunPelajaranData } from '~/types/TahunPelajaranType'
import { getTahunPelajaranList, deleteTahunPelajaran, updateTahunPelajaran } from '~/services/tahun-pelajaran'

export const useTahunPelajaranStore = defineStore('tahun-pelajaran', () => {
    // State
    const tahunPelajarans = ref<TahunPelajaranData[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const total = ref(0)

    // Computed
    const tahunPelajaranCount = computed(() => tahunPelajarans.value.length)

    // Get all tahun pelajaran with pagination and search filters
    const fetchTahunPelajarans = async (page: number = 1, limit: number = 10, search: any = {}) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await getTahunPelajaranList(page, limit, search)
            
            // Handle null or empty data response
            const responseData = response.data || []
            
            tahunPelajarans.value = responseData
            total.value = response.pagination?.total || responseData.length
            
            return {
                success: true,
                message: 'Data tahun pelajaran berhasil dimuat'
            }
        } catch (err: any) {
            // Skip error handling for 401 - already handled globally
            if (err?.status === 401 || err?.response?.status === 401) {
                return {
                    success: false,
                    message: 'Session expired'
                }
            }

            const apiError = err.data?.message || err.message || 'Gagal memuat data tahun pelajaran'
            error.value = apiError
            console.error('Error fetching tahun pelajaran:', err)
            
            return {
                success: false,
                message: apiError
            }
        } finally {
            isLoading.value = false
        }
    }

    // Update tahun pelajaran
    const editTahunPelajaran = async (id: number, tahunPelajaranData: any) => {
        isLoading.value = true
        error.value = null

        try {
            await updateTahunPelajaran({ id, ...tahunPelajaranData })
            
            // Refresh tahun pelajaran list
            await fetchTahunPelajarans()
            
            return {
                success: true,
                message: 'Tahun pelajaran berhasil diperbarui'
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal mengupdate tahun pelajaran'
            error.value = apiError
            console.error('Error updating tahun pelajaran:', err)
            
            return {
                success: false,
                message: apiError
            }
        } finally {
            isLoading.value = false
        }
    }

    // Delete tahun pelajaran
    const removeTahunPelajaran = async (id: number) => {
        isLoading.value = true
        error.value = null

        try {
            await deleteTahunPelajaran(id)
            
            // Remove from list
            tahunPelajarans.value = tahunPelajarans.value.filter(tp => tp.id !== id)
            total.value--
            
            return {
                success: true,
                message: 'Tahun pelajaran berhasil dihapus'
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal menghapus tahun pelajaran'
            error.value = apiError
            console.error('Error deleting tahun pelajaran:', err)
            
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
        tahunPelajarans,
        isLoading,
        error,
        total,
        // Computed
        tahunPelajaranCount,
        // Methods
        fetchTahunPelajarans,
        editTahunPelajaran,
        removeTahunPelajaran,
        clearError,
    }
})

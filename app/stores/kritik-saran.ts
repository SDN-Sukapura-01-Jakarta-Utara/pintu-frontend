import { defineStore } from 'pinia'
import { getKritikSaran, getKritikSaranById, deleteKritikSaran } from '~/services/kritik-saran'

export const useKritikSaranStore = defineStore('kritikSaran', {
  state: () => ({
    kritikSaranList: [] as any[],
    selectedKritikSaran: null as any,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    },
    isLoading: false,
    error: null as string | null
  }),

  actions: {
    async fetchKritikSaran(search: any, page: number = 1, limit: number = 10) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await getKritikSaran(search, { page, limit })
        this.kritikSaranList = response.data.data || []
        this.pagination = {
          page,
          limit,
          total: response.data.total || 0,
          totalPages: Math.ceil((response.data.total || 0) / limit)
        }
      } catch (error: any) {
        this.error = error.message
        console.error('Error fetching kritik saran:', error)
      } finally {
        this.isLoading = false
      }
    },

    async fetchKritikSaranById(id: number) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await getKritikSaranById(id)
        this.selectedKritikSaran = response.data
        return response.data
      } catch (error: any) {
        this.error = error.message
        console.error('Error fetching kritik saran detail:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteKritikSaran(id: number) {
      this.isLoading = true
      this.error = null
      
      try {
        await deleteKritikSaran(id)
        // Remove from list
        this.kritikSaranList = this.kritikSaranList.filter(item => item.id !== id)
        this.pagination.total -= 1
      } catch (error: any) {
        this.error = error.message
        console.error('Error deleting kritik saran:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
})

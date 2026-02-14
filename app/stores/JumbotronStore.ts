import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { JumbotronData, JumbotronResponse } from '~/types/JumbotronType'
import {
    getJumbotronList,
    getJumbotronById,
    createJumbotron,
    updateJumbotron,
    deleteJumbotron
} from '~/services/jumbotron'

interface JumbotronError {
    message: string
    status: string
}

export const useJumbotronStore = defineStore('jumbotron', () => {
    // State
    const jumbotronList = ref<JumbotronData[]>([])
    const currentJumbotron = ref<JumbotronData | null>(null)
    const isLoading = ref(false)
    const isSubmitting = ref(false)
    const error = ref<JumbotronError | null>(null)
    const total = ref(0)
    const limit = ref(10)
    const offset = ref(0)

    // Computed
    const isEmpty = computed(() => jumbotronList.value.length === 0)
    const hasError = computed(() => error.value !== null)

    // Actions
    /**
     * Fetch all jumbotron data
     */
    const fetchJumbotronList = async (customLimit?: number, customOffset?: number) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await getJumbotronList(
                customLimit || limit.value,
                customOffset ?? offset.value
            )

            jumbotronList.value = response.data
            total.value = response.total
            limit.value = response.limit
            offset.value = response.offset

            return response
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal memuat data jumbotron'

            error.value = {
                message: apiError,
                status: 'error',
            }

            console.error('Error fetching jumbotron:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Fetch jumbotron by ID
     */
    const fetchJumbotronById = async (id: number) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await getJumbotronById(id)
            currentJumbotron.value = response.data
            return response
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal memuat detail jumbotron'

            error.value = {
                message: apiError,
                status: 'error',
            }

            console.error('Error fetching jumbotron by ID:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Create new jumbotron
     */
    const handleCreateJumbotron = async (payload: any) => {
        isSubmitting.value = true
        error.value = null

        try {
            const response = await createJumbotron(payload)

            // Add to list
            if (response.data) {
                jumbotronList.value.unshift(response.data)
                total.value++
            }

            return {
                success: true,
                message: 'Jumbotron berhasil ditambahkan',
                data: response.data,
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal menambahkan jumbotron'

            error.value = {
                message: apiError,
                status: 'error',
            }

            console.error('Error creating jumbotron:', err)

            return {
                success: false,
                message: apiError,
            }
        } finally {
            isSubmitting.value = false
        }
    }

    /**
     * Update jumbotron
     */
    const handleUpdateJumbotron = async (id: number, payload: any) => {
        isSubmitting.value = true
        error.value = null

        try {
            const response = await updateJumbotron(id, payload)

            // Update in list
            const index = jumbotronList.value.findIndex(item => item.id === id)
            if (index !== -1 && response.data) {
                jumbotronList.value[index] = response.data
            }

            return {
                success: true,
                message: 'Jumbotron berhasil diperbarui',
                data: response.data,
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal memperbarui jumbotron'

            error.value = {
                message: apiError,
                status: 'error',
            }

            console.error('Error updating jumbotron:', err)

            return {
                success: false,
                message: apiError,
            }
        } finally {
            isSubmitting.value = false
        }
    }

    /**
     * Delete jumbotron
     */
    const handleDeleteJumbotron = async (id: number) => {
        isSubmitting.value = true
        error.value = null

        try {
            await deleteJumbotron(id)

            // Remove from list
            jumbotronList.value = jumbotronList.value.filter(item => item.id !== id)
            total.value--

            return {
                success: true,
                message: 'Jumbotron berhasil dihapus',
            }
        } catch (err: any) {
            const apiError = err.data?.message || err.message || 'Gagal menghapus jumbotron'

            error.value = {
                message: apiError,
                status: 'error',
            }

            console.error('Error deleting jumbotron:', err)

            return {
                success: false,
                message: apiError,
            }
        } finally {
            isSubmitting.value = false
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
        currentJumbotron.value = null
        isLoading.value = false
        isSubmitting.value = false
        error.value = null
        total.value = 0
        limit.value = 10
        offset.value = 0
    }

    return {
        // State
        jumbotronList,
        currentJumbotron,
        isLoading,
        isSubmitting,
        error,
        total,
        limit,
        offset,

        // Computed
        isEmpty,
        hasError,

        // Methods
        fetchJumbotronList,
        fetchJumbotronById,
        handleCreateJumbotron,
        handleUpdateJumbotron,
        handleDeleteJumbotron,
        clearError,
        reset,
    }
})

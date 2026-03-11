/**
 * Struktur Organisasi Store
 * State management untuk struktur organisasi
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { StrukturOrganisasi } from '~/types/StrukturOrganisasiType'
import {
  getStrukturOrganisasi,
  getStrukturOrganisasiById,
  createStrukturOrganisasi,
  updateStrukturOrganisasi,
  deleteStrukturOrganisasi,
} from '~/services/struktur-organisasi'

export const useStrukturOrganisasiStore = defineStore('struktur-organisasi', () => {
  // State
  const strukturOrganisasis = ref<StrukturOrganisasi[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)

  /**
   * Get all struktur organisasi dengan filter dan pagination
   */
  const fetchStrukturOrganisasi = async (payload: {
    search: {
      nama?: string
      jabatan?: string
      urutan?: number
      relasi?: string
      status?: string
    }
    pagination: {
      limit: number
      page: number
    }
  }) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await getStrukturOrganisasi(payload)
      strukturOrganisasis.value = response.data
      total.value = response.pagination.total
    } catch (err: any) {
      error.value = err.data?.error || err.message || 'Gagal memuat data struktur organisasi'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get struktur organisasi by ID
   */
  const fetchStrukturOrganisasiById = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await getStrukturOrganisasiById(id)
      return response.data
    } catch (err: any) {
      error.value = err.data?.error || err.message || 'Gagal memuat data struktur organisasi'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create struktur organisasi
   */
  const createItem = async (data: any) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await createStrukturOrganisasi(data)
      return response.data
    } catch (err: any) {
      error.value = err.data?.error || err.message || 'Gagal menambah struktur organisasi'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update struktur organisasi
   */
  const updateItem = async (data: any) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await updateStrukturOrganisasi(data)
      return response.data
    } catch (err: any) {
      error.value = err.data?.error || err.message || 'Gagal memperbarui struktur organisasi'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete struktur organisasi
   */
  const deleteItem = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await deleteStrukturOrganisasi(id)
      return response
    } catch (err: any) {
      error.value = err.data?.error || err.message || 'Gagal menghapus struktur organisasi'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Clear data
   */
  const clearData = () => {
    strukturOrganisasis.value = []
    total.value = 0
    error.value = null
  }

  return {
    strukturOrganisasis,
    isLoading,
    error,
    total,
    fetchStrukturOrganisasi,
    fetchStrukturOrganisasiById,
    createItem,
    updateItem,
    deleteItem,
    clearData,
  }
})

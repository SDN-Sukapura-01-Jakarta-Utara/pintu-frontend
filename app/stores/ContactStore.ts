import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ContactData } from '~/types/ContactType'
import {
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '~/services/contact'

export const useContactStore = defineStore('contact', () => {
  // State
  const contact = ref<ContactData | null>(null)
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const hasContact = computed(() => contact.value !== null && contact.value.id > 0)

  // Actions
  /**
   * Fetch contact by ID
   */
  const fetchContactById = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await getContactById(id)

      if (response && response.data) {
        contact.value = response.data
      } else {
        contact.value = null
      }

      return {
        success: true,
        message: 'Data kontak berhasil dimuat',
      }
    } catch (err: any) {
      if (err?.status === 401 || err?.response?.status === 401) {
        return {
          success: false,
          message: 'Session expired',
        }
      }

      const apiError = err.data?.message || err.message || 'Gagal memuat data kontak'
      error.value = apiError
      console.error('Error fetching contact:', err)

      return {
        success: false,
        message: apiError,
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create new contact
   */
  const createNewContact = async (contactData: ContactData) => {
    isSubmitting.value = true
    error.value = null

    try {
      const response = await createContact(contactData)

      if (response && response.data) {
        contact.value = response.data
      }

      return {
        success: true,
        message: 'Data kontak berhasil ditambahkan',
      }
    } catch (err: any) {
      if (err?.status === 401 || err?.response?.status === 401) {
        return {
          success: false,
          message: 'Session expired',
        }
      }

      const apiError = err.data?.message || err.data?.error || err.message || 'Gagal menambahkan data kontak'
      error.value = apiError
      console.error('Error creating contact:', err)

      return {
        success: false,
        message: apiError,
      }
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Update contact
   */
  const updateExistingContact = async (id: number, contactData: Partial<ContactData>) => {
    isSubmitting.value = true
    error.value = null

    try {
      const response = await updateContact(id, contactData)

      if (response && response.data) {
        contact.value = response.data
      }

      return {
        success: true,
        message: 'Data kontak berhasil diperbarui',
      }
    } catch (err: any) {
      if (err?.status === 401 || err?.response?.status === 401) {
        return {
          success: false,
          message: 'Session expired',
        }
      }

      const apiError = err.data?.message || err.data?.error || err.message || 'Gagal memperbarui data kontak'
      error.value = apiError
      console.error('Error updating contact:', err)

      return {
        success: false,
        message: apiError,
      }
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Delete contact
   */
  const deleteExistingContact = async (id: number) => {
    isSubmitting.value = true
    error.value = null

    try {
      await deleteContact(id)
      contact.value = null

      return {
        success: true,
        message: 'Data kontak berhasil dihapus',
      }
    } catch (err: any) {
      if (err?.status === 401 || err?.response?.status === 401) {
        return {
          success: false,
          message: 'Session expired',
        }
      }

      const apiError = err.data?.message || err.data?.error || err.message || 'Gagal menghapus data kontak'
      error.value = apiError
      console.error('Error deleting contact:', err)

      return {
        success: false,
        message: apiError,
      }
    } finally {
      isSubmitting.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    contact,
    isLoading,
    isSubmitting,
    error,
    // Computed
    hasContact,
    // Methods
    fetchContactById,
    createNewContact,
    updateExistingContact,
    deleteExistingContact,
    clearError,
  }
})

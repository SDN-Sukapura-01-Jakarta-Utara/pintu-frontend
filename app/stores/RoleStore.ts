import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RoleData } from '~/types/RoleType'
import { getRoleList, deleteRole, updateRole } from '~/services/role'

export const useRoleStore = defineStore('role', () => {
  // State
  const roles = ref<RoleData[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)

  // Computed
  const roleCount = computed(() => roles.value.length)

  // Get all roles with pagination and search filters
  const fetchRoles = async (page: number = 1, limit: number = 10, search: any = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await getRoleList(page, limit, search)
      
      // Handle null or empty data response
      const responseData = response.data || []
      
      roles.value = responseData
      total.value = response.pagination?.total || responseData.length
      
      return {
        success: true,
        message: 'Data role berhasil dimuat'
      }
    } catch (err: any) {
      // Skip error handling for 401 - already handled globally
      if (err?.status === 401 || err?.response?.status === 401) {
        return {
          success: false,
          message: 'Session expired'
        }
      }

      const apiError = err.data?.message || err.message || 'Gagal memuat data role'
      error.value = apiError
      console.error('Error fetching roles:', err)
      
      return {
        success: false,
        message: apiError
      }
    } finally {
      isLoading.value = false
    }
  }

  // Update role
  const editRole = async (roleData: any) => {
    isLoading.value = true
    error.value = null

    try {
      await updateRole(roleData)
      
      // Refresh roles list
      await fetchRoles()
      
      return {
        success: true,
        message: 'Role berhasil diperbarui'
      }
    } catch (err: any) {
      const apiError = err.data?.message || err.message || 'Gagal mengupdate role'
      error.value = apiError
      console.error('Error updating role:', err)
      
      return {
        success: false,
        message: apiError
      }
    } finally {
      isLoading.value = false
    }
  }

  // Delete role
  const removeRole = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      await deleteRole(id)
      
      // Remove from list
      roles.value = roles.value.filter(role => role.id !== id)
      total.value--
      
      return {
        success: true,
        message: 'Role berhasil dihapus'
      }
    } catch (err: any) {
      const apiError = err.data?.message || err.message || 'Gagal menghapus role'
      error.value = apiError
      console.error('Error deleting role:', err)
      
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
    roles,
    isLoading,
    error,
    total,
    // Computed
    roleCount,
    // Methods
    fetchRoles,
    editRole,
    removeRole,
    clearError,
  }
})

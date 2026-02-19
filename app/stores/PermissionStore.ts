import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PermissionData } from '~/types/PermissionType'
import { getPermissionList, deletePermission, updatePermission } from '~/services/permission'

export const usePermissionStore = defineStore('permission', () => {
  // State
  const permissions = ref<PermissionData[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)

  // Computed
  const permissionCount = computed(() => permissions.value.length)

  // Get all permissions with pagination and search filters
  const fetchPermissions = async (page: number = 1, limit: number = 10, search: any = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await getPermissionList(page, limit, search)
      
      // Handle null or empty data response
      const responseData = response.data || []
      
      permissions.value = responseData
      total.value = response.pagination?.total || responseData.length
      
      return {
        success: true,
        message: 'Data permission berhasil dimuat'
      }
    } catch (err: any) {
      // Skip error handling for 401 - already handled globally
      if (err?.status === 401 || err?.response?.status === 401) {
        return {
          success: false,
          message: 'Session expired'
        }
      }

      const apiError = err.data?.message || err.message || 'Gagal memuat data permission'
      error.value = apiError
      console.error('Error fetching permissions:', err)
      
      return {
        success: false,
        message: apiError
      }
    } finally {
      isLoading.value = false
    }
  }

  // Update permission
  const editPermission = async (permissionData: any) => {
    isLoading.value = true
    error.value = null

    try {
      await updatePermission(permissionData)
      
      // Refresh permissions list
      await fetchPermissions()
      
      return {
        success: true,
        message: 'Permission berhasil diperbarui'
      }
    } catch (err: any) {
      const apiError = err.data?.message || err.message || 'Gagal mengupdate permission'
      error.value = apiError
      console.error('Error updating permission:', err)
      
      return {
        success: false,
        message: apiError
      }
    } finally {
      isLoading.value = false
    }
  }

  // Delete permission
  const removePermission = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      await deletePermission(id)
      
      // Remove from list
      permissions.value = permissions.value.filter(permission => permission.id !== id)
      total.value--
      
      return {
        success: true,
        message: 'Permission berhasil dihapus'
      }
    } catch (err: any) {
      const apiError = err.data?.message || err.message || 'Gagal menghapus permission'
      error.value = apiError
      console.error('Error deleting permission:', err)
      
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
    permissions,
    isLoading,
    error,
    total,
    // Computed
    permissionCount,
    // Methods
    fetchPermissions,
    editPermission,
    removePermission,
    clearError,
  }
})

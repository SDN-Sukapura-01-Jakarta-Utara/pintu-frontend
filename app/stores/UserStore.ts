import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserData } from '~/types/UserType'
import { getUserList, deleteUser, updateUser } from '~/services/user'

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<UserData[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)

  // Computed
  const userCount = computed(() => users.value.length)

  // Get all users with pagination and search filters
  const fetchUsers = async (page: number = 1, limit: number = 10, search: any = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await getUserList(page, limit, search)
      
      // Map data to add accessible_system_display for table
      // Backend now returns role_name directly and accessible_system as array
      const mappedData = response.data.map(user => ({
        ...user,
        accessible_system_display: formatAccessibleSystem(user.accessible_system)
      }))
      
      users.value = mappedData
      total.value = response.pagination?.total || response.data.length
      
      return {
        success: true,
        message: 'Data user berhasil dimuat'
      }
    } catch (err: any) {
      const apiError = err.data?.message || err.message || 'Gagal memuat data user'
      error.value = apiError
      console.error('Error fetching users:', err)
      
      return {
        success: false,
        message: apiError
      }
    } finally {
      isLoading.value = false
    }
  }

  // Update user
  const editUser = async (id: number, userData: any) => {
    isLoading.value = true
    error.value = null

    try {
      await updateUser(id, userData)
      
      // Refresh users list
      await fetchUsers()
      
      return {
        success: true,
        message: 'User berhasil diperbarui'
      }
    } catch (err: any) {
      const apiError = err.data?.message || err.message || 'Gagal mengupdate user'
      error.value = apiError
      console.error('Error updating user:', err)
      
      return {
        success: false,
        message: apiError
      }
    } finally {
      isLoading.value = false
    }
  }

  // Delete user
  const removeUser = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      await deleteUser(id)
      
      // Remove from list
      users.value = users.value.filter(user => user.id !== id)
      total.value--
      
      return {
        success: true,
        message: 'User berhasil dihapus'
      }
    } catch (err: any) {
      const apiError = err.data?.message || err.message || 'Gagal menghapus user'
      error.value = apiError
      console.error('Error deleting user:', err)
      
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

  // Format accessible system array for display
  const formatAccessibleSystem = (systems: string[]): string => {
    if (!systems || systems.length === 0) return '-'
    
    try {
      return systems.join(', ')
    } catch {
      return '-'
    }
  }

  return {
    // State
    users,
    isLoading,
    error,
    total,
    // Computed
    userCount,
    // Methods
    fetchUsers,
    editUser,
    removeUser,
    clearError,
  }
})

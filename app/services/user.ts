/**
 * User Service
 * Handle API calls untuk user management
 */

import type { GetUsersResponse, GetRolesResponse, CreateUserRequest } from '~/types/UserType'

/**
 * Helper function to handle API errors globally
 */
const handleApiError = (error: any) => {
  if (typeof window !== 'undefined') {
    const nuxtApp = useNuxtApp()
    const status = error?.status || error?.response?.status
    if (status === 401) {
      nuxtApp.$handleFetchError(error)
    }
  }
}

/**
 * Get all users with pagination and search filters
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @param search - Search filters object
 * @returns Users list response
 */
export async function getUserList(page: number = 1, limit: number = 10, search: any = {}): Promise<GetUsersResponse> {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')
  
  try {
    const response = await $fetch<GetUsersResponse>(
      `${config.public.apiBase}/api/v1/users/get-users`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: {
          search,
          pagination: {
            page,
            limit
          }
        },
      }
    )

    return response
  } catch (error: any) {
    handleApiError(error)
    throw error
  }
}

/**
 * Get all roles
 * @returns Roles list response
 */
export async function getRoleList(): Promise<GetRolesResponse> {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')
  
  try {
    const response = await $fetch<GetRolesResponse>(
      `${config.public.apiBase}/api/v1/roles/get-roles`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: {},
      }
    )

    return response
  } catch (error: any) {
    handleApiError(error)
    throw error
  }
}

/**
 * Get user by ID
 * @param id - User ID
 * @returns User data
 */
export async function getUserById(id: number) {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')
  
  try {
    const response = await $fetch(
      `${config.public.apiBase}/api/v1/users/get-user-by-id`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: { id },
      }
    )

    return response
  } catch (error: any) {
    handleApiError(error)
    throw error
  }
}

/**
 * Create user
 * @param userData - User data to create
 * @returns Created user data
 */
export async function createUser(userData: CreateUserRequest) {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')
  
  try {
    const response = await $fetch(
      `${config.public.apiBase}/api/v1/users/create-user`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: userData,
      }
    )

    return response
  } catch (error: any) {
    handleApiError(error)
    throw error
  }
}

/**
 * Update user
 * @param id - User ID
 * @param userData - User data to update
 * @returns Updated user data
 */
export async function updateUser(id: number, userData: any) {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')
  
  try {
    const response = await $fetch(
      `${config.public.apiBase}/api/v1/users/update-user`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: { id, ...userData },
      }
    )

    return response
  } catch (error: any) {
    handleApiError(error)
    throw error
  }
}

/**
 * Delete user
 * @param id - User ID
 * @returns Delete response
 */
export async function deleteUser(id: number) {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')
  
  try {
    const response = await $fetch(
      `${config.public.apiBase}/api/v1/users/delete-user`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: { id },
      }
    )

    return response
  } catch (error: any) {
    handleApiError(error)
    throw error
  }
}

/**
 * Delete role
 * @param id - Role ID
 * @returns Delete response
 */
export async function deleteRole(id: number) {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')
  
  try {
    const response = await $fetch(
      `${config.public.apiBase}/api/v1/roles/delete-role`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: { id },
      }
    )

    return response
  } catch (error: any) {
    handleApiError(error)
    throw error
  }
}

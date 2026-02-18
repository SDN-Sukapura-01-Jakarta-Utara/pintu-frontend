/**
 * Role Service
 * Handle API calls untuk role management
 */

import type { GetRolesResponse, CreateRoleRequest, UpdateRoleRequest, GetRoleByIdResponse } from '~/types/RoleType'

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
 * Get all roles with pagination and search filters
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @param search - Search filters object
 * @returns Roles list response
 */
export async function getRoleList(page: number = 1, limit: number = 10, search: any = {}): Promise<GetRolesResponse> {
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
 * Get role by ID
 * @param id - Role ID
 * @returns Role data
 */
export async function getRoleById(id: number): Promise<GetRoleByIdResponse> {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')
  
  try {
    const response = await $fetch<GetRoleByIdResponse>(
      `${config.public.apiBase}/api/v1/roles/get-role-by-id`,
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
 * Create role
 * @param roleData - Role data to create
 * @returns Created role data
 */
export async function createRole(roleData: CreateRoleRequest) {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')
  
  try {
    const response = await $fetch(
      `${config.public.apiBase}/api/v1/roles/create-role`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: roleData,
      }
    )

    return response
  } catch (error: any) {
    handleApiError(error)
    throw error
  }
}

/**
 * Update role
 * @param roleData - Role data to update
 * @returns Updated role data
 */
export async function updateRole(roleData: UpdateRoleRequest) {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')
  
  try {
    const response = await $fetch(
      `${config.public.apiBase}/api/v1/roles/update-role`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: roleData,
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

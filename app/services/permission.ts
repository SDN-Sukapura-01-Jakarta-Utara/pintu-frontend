/**
 * Permission Service
 * Handle API calls untuk permission management
 */

import type { GetPermissionsResponse, CreatePermissionRequest, UpdatePermissionRequest, GetPermissionByIdResponse } from '~/types/PermissionType'

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
 * Get all permissions with pagination and search filters
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @param search - Search filters object
 * @returns Permissions list response
 */
export async function getPermissionList(page: number = 1, limit: number = 10, search: any = {}): Promise<GetPermissionsResponse> {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')
  
  try {
    const response = await $fetch<GetPermissionsResponse>(
      `${config.public.apiBase}/api/v1/permissions/get-permissions`,
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
 * Get permission by ID
 * @param id - Permission ID
 * @returns Permission data
 */
export async function getPermissionById(id: number): Promise<GetPermissionByIdResponse> {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')
  
  try {
    const response = await $fetch<GetPermissionByIdResponse>(
      `${config.public.apiBase}/api/v1/permissions/get-permission-by-id`,
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
 * Create permission
 * @param permissionData - Permission data to create
 * @returns Created permission data
 */
export async function createPermission(permissionData: CreatePermissionRequest) {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')
  
  try {
    const response = await $fetch(
      `${config.public.apiBase}/api/v1/permissions/create-permission`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: permissionData,
      }
    )

    return response
  } catch (error: any) {
    handleApiError(error)
    throw error
  }
}

/**
 * Update permission
 * @param permissionData - Permission data to update
 * @returns Updated permission data
 */
export async function updatePermission(permissionData: UpdatePermissionRequest) {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')
  
  try {
    const response = await $fetch(
      `${config.public.apiBase}/api/v1/permissions/update-permission`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: permissionData,
      }
    )

    return response
  } catch (error: any) {
    handleApiError(error)
    throw error
  }
}

/**
 * Delete permission
 * @param id - Permission ID
 * @returns Delete response
 */
export async function deletePermission(id: number) {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')
  
  try {
    const response = await $fetch(
      `${config.public.apiBase}/api/v1/permissions/delete-permission`,
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

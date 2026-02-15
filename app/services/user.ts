/**
 * User Service
 * Handle API calls untuk user management
 */

import type { GetUsersResponse, GetRolesResponse, CreateUserRequest } from '~/types/UserType'

const config = useRuntimeConfig()

/**
 * Get all users with pagination and search filters
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @param search - Search filters object
 * @returns Users list response
 */
export async function getUserList(page: number = 1, limit: number = 10, search: any = {}): Promise<GetUsersResponse> {
  const token = localStorage.getItem('auth_token')
  
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
}

/**
 * Get all roles
 * @returns Roles list response
 */
export async function getRoleList(): Promise<GetRolesResponse> {
  const token = localStorage.getItem('auth_token')
  
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
}

/**
 * Get user by ID
 * @param id - User ID
 * @returns User data
 */
export async function getUserById(id: number) {
  const token = localStorage.getItem('auth_token')
  
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
}

/**
 * Create user
 * @param userData - User data to create
 * @returns Created user data
 */
export async function createUser(userData: CreateUserRequest) {
  const token = localStorage.getItem('auth_token')
  
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
}

/**
 * Update user
 * @param id - User ID
 * @param userData - User data to update
 * @returns Updated user data
 */
export async function updateUser(id: number, userData: any) {
  const token = localStorage.getItem('auth_token')
  
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
}

/**
 * Delete user
 * @param id - User ID
 * @returns Delete response
 */
export async function deleteUser(id: number) {
  const token = localStorage.getItem('auth_token')
  
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
}

/**
 * Delete role
 * @param id - Role ID
 * @returns Delete response
 */
export async function deleteRole(id: number) {
  const token = localStorage.getItem('auth_token')
  
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
}

/**
 * Jumbotron Service
 * Handle API calls untuk jumbotron dengan backend Golang
 */

import type { JumbotronResponse, JumbotronCreatePayload, JumbotronUpdatePayload } from '~/types/JumbotronType'

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
 * Get all jumbotron data
 * @param limit - Number of items per page
 * @param offset - Pagination offset
 * @returns Jumbotron data with pagination
 */
export async function getJumbotronList(limit: number = 10, offset: number = 0): Promise<JumbotronResponse> {
  const config = useRuntimeConfig()
  try {
    const response = await $fetch<JumbotronResponse>(`${config.public.apiBase}/api/v1/jumbotron/get-jumbotron`, {
      method: 'POST',
      body: {
        limit,
        offset,
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    })

    return response
  } catch (error: any) {
    handleApiError(error)
    throw error
  }
}

/**
 * Get jumbotron by ID
 * @param id - Jumbotron ID
 * @returns Jumbotron data
 */
export async function getJumbotronById(id: number) {
  const config = useRuntimeConfig()
  try {
    const response = await $fetch(`${config.public.apiBase}/api/v1/jumbotron/get-jumbotron-by-id`, {
      method: 'POST',
      body: { id },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    })

    return response
  } catch (error: any) {
    handleApiError(error)
    throw error
  }
}

/**
 * Create new jumbotron
 * @param payload - File and status
 * @returns Created jumbotron data
 */
export async function createJumbotron(payload: JumbotronCreatePayload) {
  const config = useRuntimeConfig()
  try {
    const formData = new FormData()
    formData.append('file', payload.file)
    formData.append('status', payload.status)

    const response = await $fetch(`${config.public.apiBase}/api/v1/jumbotron/create-jumbotron`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    })

    return response
  } catch (error: any) {
    handleApiError(error)
    throw error
  }
}

/**
 * Update jumbotron
 * @param id - Jumbotron ID
 * @param payload - Updated data
 * @returns Updated jumbotron data
 */
export async function updateJumbotron(id: number, payload: Partial<JumbotronCreatePayload> & { remove_file?: boolean }) {
  const config = useRuntimeConfig()
  try {
    const formData = new FormData()
    formData.append('id', id.toString())
    if (payload.file) {
      formData.append('file', payload.file)
    }
    if (payload.status) {
      formData.append('status', payload.status)
    }
    if (payload.remove_file) {
      formData.append('remove_file', 'true')
    }

    const response = await $fetch(`${config.public.apiBase}/api/v1/jumbotron/update-jumbotron`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    })

    return response
  } catch (error: any) {
    handleApiError(error)
    throw error
  }
}

/**
 * Delete jumbotron
 * @param id - Jumbotron ID
 * @returns Delete response
 */
export async function deleteJumbotron(id: number) {
  const config = useRuntimeConfig()
  try {
    const response = await $fetch(`${config.public.apiBase}/api/v1/jumbotron/delete-jumbotron`, {
      method: 'POST',
      body: { id },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    })

    return response
  } catch (error: any) {
    handleApiError(error)
    throw error
  }
}

/**
 * Sarana Prasarana Service
 * Handle API calls untuk sarana prasarana dengan backend Golang
 */

import type {
  SaranaPrasaranaResponse,
  SaranaPrasaranaDetailResponse,
  SaranaPrasaranaCreatePayload,
  SaranaPrasaranaUpdatePayload,
  SaranaPrasaranaSearchPayload,
} from '~/types/SaranaPrasaranaType'

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
 * Get all sarana prasarana data with pagination and search
 * @param payload - Search and pagination parameters
 * @returns Sarana prasarana list with pagination
 */
export async function getSaranaPrasaranaList(
  payload: SaranaPrasaranaSearchPayload
): Promise<SaranaPrasaranaResponse> {
  const config = useRuntimeConfig()
  try {
    const body = {
      search: payload.search || { name: '', status: '' },
      pagination: payload.pagination || { limit: 10, page: 1 },
    }

    const response = await $fetch<SaranaPrasaranaResponse>(
      `${config.public.apiBase}/api/v1/sarana-prasarana/get-sarana-prasarana`,
      {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
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
 * Get sarana prasarana by ID
 * @param id - Sarana prasarana ID
 * @returns Sarana prasarana detail data
 */
export async function getSaranaPrasaranaById(id: number) {
  const config = useRuntimeConfig()
  try {
    const response = await $fetch<SaranaPrasaranaDetailResponse>(
      `${config.public.apiBase}/api/v1/sarana-prasarana/get-sarana-prasarana-by-id`,
      {
        method: 'POST',
        body: { id },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
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
 * Create new sarana prasarana
 * @param payload - File, name, and status
 * @returns Created sarana prasarana data
 */
export async function createSaranaPrasarana(
  payload: SaranaPrasaranaCreatePayload
) {
  const config = useRuntimeConfig()
  try {
    const formData = new FormData()
    formData.append('file', payload.file)
    formData.append('name', payload.name)
    formData.append('status', payload.status)

    const response = await $fetch(
      `${config.public.apiBase}/api/v1/sarana-prasarana/create-sarana-prasarana`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
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
 * Update sarana prasarana
 * @param payload - Updated data including id
 * @returns Updated sarana prasarana data
 */
export async function updateSaranaPrasarana(
  payload: SaranaPrasaranaUpdatePayload & { remove_file?: boolean }
) {
  const config = useRuntimeConfig()
  try {
    const formData = new FormData()
    formData.append('id', payload.id.toString())
    formData.append('name', payload.name)
    formData.append('status', payload.status)

    if (payload.file) {
      formData.append('file', payload.file)
    }

    if (payload.remove_file) {
      formData.append('remove_file', 'true')
    }

    const response = await $fetch(
      `${config.public.apiBase}/api/v1/sarana-prasarana/update-sarana-prasarana`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
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
 * Delete sarana prasarana
 * @param id - Sarana prasarana ID
 * @returns Delete response
 */
export async function deleteSaranaPrasarana(id: number) {
  const config = useRuntimeConfig()
  try {
    const response = await $fetch(
      `${config.public.apiBase}/api/v1/sarana-prasarana/delete-sarana-prasarana`,
      {
        method: 'POST',
        body: { id },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      }
    )

    return response
  } catch (error: any) {
    handleApiError(error)
    throw error
  }
}

/**
 * Visi Misi Service
 * Handle API calls untuk visi misi dengan backend Golang
 */

interface VisiMisiData {
  id?: number
  visi: string
  misi: string
  created_at?: string
  updated_at?: string
  created_by_id?: number
  updated_by_id?: number | null
}

interface VisiMisiResponse {
  data: VisiMisiData
}

/**
 * Get visi misi by ID
 * @param id - Visi misi ID
 * @returns Visi misi data
 */
export async function getVisiMisiById(id: number = 1) {
  const config = useRuntimeConfig()
  try {
    const response = await $fetch<VisiMisiResponse>(`${config.public.apiBase}/api/v1/visi-misi/get-visi-misi-by-id`, {
      method: 'POST',
      body: { id },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    })

    return response
  } catch (error: any) {
    // Handle error but don't throw for "not found" case
    if (error.status === 404 || error.data?.error?.includes('not found')) {
      return null
    }
    throw error
  }
}

/**
 * Create visi misi
 * @param payload - Visi and misi data
 * @returns Created visi misi data
 */
export async function createVisiMisi(payload: {
  visi: string
  misi: string
}) {
  const config = useRuntimeConfig()
  try {
    const response = await $fetch<VisiMisiResponse>(`${config.public.apiBase}/api/v1/visi-misi/create-visi-misi`, {
      method: 'POST',
      body: payload,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    })

    return response
  } catch (error: any) {
    throw error
  }
}

/**
 * Update visi misi
 * @param id - Visi misi ID
 * @param payload - Updated data
 * @returns Updated visi misi data
 */
export async function updateVisiMisi(id: number, payload: {
  visi: string
  misi: string
}) {
  const config = useRuntimeConfig()
  try {
    const response = await $fetch<VisiMisiResponse>(`${config.public.apiBase}/api/v1/visi-misi/update-visi-misi`, {
      method: 'POST',
      body: { id, ...payload },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    })

    return response
  } catch (error: any) {
    throw error
  }
}

/**
 * Kutipan Kepsek Service
 * Handle API calls untuk kutipan kepala sekolah dengan backend Golang
 */

interface KutipanKepsekData {
  id?: number
  nama_kepsek: string
  foto_kepsek?: string
  kutipan_kepsek: string
  created_at?: string
  updated_at?: string
  created_by_id?: number
  updated_by_id?: number | null
}

interface KutipanKepsekResponse {
  data: KutipanKepsekData
}

/**
 * Get kutipan kepsek by ID
 * @param id - Kutipan kepsek ID
 * @returns Kutipan kepsek data
 */
export async function getKutipanKepsekById(id: number = 1) {
  const config = useRuntimeConfig()
  try {
    const response = await $fetch<KutipanKepsekResponse>(`${config.public.apiBase}/api/v1/kutipan-kepsek/get-kutipan-kepsek-by-id`, {
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
 * Create new kutipan kepsek
 * @param payload - File, nama_kepsek, and kutipan_kepsek
 * @returns Created kutipan kepsek data
 */
export async function createKutipanKepsek(payload: {
  file?: File
  nama_kepsek: string
  kutipan_kepsek: string
}) {
  const config = useRuntimeConfig()
  try {
    const formData = new FormData()
    if (payload.file) {
      formData.append('file', payload.file)
    }
    formData.append('nama_kepsek', payload.nama_kepsek)
    formData.append('kutipan_kepsek', payload.kutipan_kepsek)

    const response = await $fetch<KutipanKepsekResponse>(`${config.public.apiBase}/api/v1/kutipan-kepsek/create-kutipan-kepsek`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    })

    return response
  } catch (error: any) {
    throw error
  }
}

/**
 * Update kutipan kepsek
 * @param id - Kutipan kepsek ID
 * @param payload - Updated data
 * @returns Updated kutipan kepsek data
 */
export async function updateKutipanKepsek(id: number, payload: {
  file?: File
  nama_kepsek?: string
  kutipan_kepsek?: string
}) {
  const config = useRuntimeConfig()
  try {
    const formData = new FormData()
    formData.append('id', id.toString())
    if (payload.file) {
      formData.append('file', payload.file)
    }
    if (payload.nama_kepsek) {
      formData.append('nama_kepsek', payload.nama_kepsek)
    }
    if (payload.kutipan_kepsek) {
      formData.append('kutipan_kepsek', payload.kutipan_kepsek)
    }

    const response = await $fetch<KutipanKepsekResponse>(`${config.public.apiBase}/api/v1/kutipan-kepsek/update-kutipan-kepsek`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    })

    return response
  } catch (error: any) {
    throw error
  }
}

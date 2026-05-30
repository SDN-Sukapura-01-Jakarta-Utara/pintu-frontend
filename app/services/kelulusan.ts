/**
 * Kelulusan Service
 * Handle API calls untuk data kelulusan
 */

/**
 * Get data kelulusan dengan filter dan pagination
 */
export async function getDataKelulusan(data: {
  search: {
    nama?: string
    nomor_peserta?: string
    nisn?: string
    lulus?: boolean | null
  }
  pagination: {
    limit: number
    page: number
  }
}) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{
    data: any[]
    pagination: {
      limit: number
      offset: number
      page: number
      total: number
      total_pages: number
    }
  }>(
    `${config.public.apiBase}/api/v1/kelulusan/get-data-kelulusan`,
    {
      method: 'POST',
      body: data,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  )

  return response
}

/**
 * Delete data kelulusan
 */
export async function deleteKelulusan(data: { id: number }) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ message: string }>(
    `${config.public.apiBase}/api/v1/kelulusan/delete-data-kelulusan`,
    {
      method: 'POST',
      body: data,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  )

  return response
}

/**
 * Create data kelulusan
 */
export async function createDataKelulusan(formData: FormData) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ message: string; data: any }>(
    `${config.public.apiBase}/api/v1/kelulusan/create-data-kelulusan`,
    {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      credentials: 'include',
    }
  )

  return response
}

/**
 * Get data kelulusan by ID
 */
export async function getDataKelulusanById(data: { id: number }) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ data: any }>(
    `${config.public.apiBase}/api/v1/kelulusan/get-data-kelulusan-by-id`,
    {
      method: 'POST',
      body: data,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  )

  return response
}

/**
 * Update data kelulusan
 */
export async function updateDataKelulusan(formData: FormData) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ message: string; data: any }>(
    `${config.public.apiBase}/api/v1/kelulusan/update-data-kelulusan`,
    {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      credentials: 'include',
    }
  )

  return response
}

/**
 * Download template kelulusan
 */
export async function downloadTemplateKelulusan(data: { mapel_list: string[] }) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch(
    `${config.public.apiBase}/api/v1/kelulusan/download-template`,
    {
      method: 'POST',
      body: data,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      responseType: 'blob'
    }
  )

  return response
}

/**
 * Import kelulusan from Excel
 */
export async function importKelulusan(formData: FormData) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ message: string; data: any }>(
    `${config.public.apiBase}/api/v1/kelulusan/import-excel`,
    {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      credentials: 'include',
    }
  )

  return response
}

/**
 * Get konfigurasi pengumuman
 */
export async function getKonfigurasiPengumuman() {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ data: any }>(
    `${config.public.apiBase}/api/v1/kelulusan/get-konfigurasi-pengumuman`,
    {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  )

  return response
}

/**
 * Save konfigurasi pengumuman
 */
export async function saveKonfigurasiPengumuman(data: {
  id: number | null
  sambutan_kelulusan: string
  tanggal_pengumuman_nilai: string
  tanggal_pengumuman_kelulusan: string
}) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ message: string; data: any }>(
    `${config.public.apiBase}/api/v1/kelulusan/konfigurasi-pengumuman`,
    {
      method: 'POST',
      body: data,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  )

  return response
}

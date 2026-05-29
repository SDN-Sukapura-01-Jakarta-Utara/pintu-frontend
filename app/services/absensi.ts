/**
 * Absensi Siswa Service
 * Handle API calls untuk absensi siswa dengan backend Golang
 */

/**
 * Create absensi manual dengan upload file
 */
export async function createAbsensiManual(formData: FormData) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{
    data: {
      message: string
      total_saved: number
    }
  }>(
    `${config.public.apiBase}/api/v1/absensi-siswa/create-absensi-manual`,
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
 * Get rekap absensi
 */
export async function getRekapAbsensi(data: {
  tahun_pelajaran_id: number
  rombel_id: number
  tanggal_mulai?: string
  tanggal_selesai?: string
  bulan?: number | null
  tahun: number
  bidang_studi_id?: number | null
  semester?: number | null
}) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ data: any }>(
    `${config.public.apiBase}/api/v1/absensi-siswa/get-rekap-absensi`,
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
 * Get absensi list dengan filters
 */
export async function getAbsensiByFilter(filters: any) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ data: any[] }>(
    `${config.public.apiBase}/api/v1/absensi-siswa`,
    {
      method: 'GET',
      params: filters,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      credentials: 'include',
    }
  )

  return response
}

/**
 * Get absensi by ID
 */
export async function getAbsensiById(id: number) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ data: any }>(
    `${config.public.apiBase}/api/v1/absensi-siswa/${id}`,
    {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      credentials: 'include',
    }
  )

  return response
}

/**
 * Update absensi
 */
export async function updateAbsensi(id: number, data: any) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ data: any }>(
    `${config.public.apiBase}/api/v1/absensi-siswa/${id}`,
    {
      method: 'PUT',
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
 * Update rekap absensi dengan upload file
 */
export async function updateRekapAbsensi(formData: FormData) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{
    data: {
      message: string
    }
  }>(
    `${config.public.apiBase}/api/v1/absensi-siswa/update-rekap-absensi`,
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
 * Delete absensi
 */
export async function deleteAbsensi(id: number) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ message: string }>(
    `${config.public.apiBase}/api/v1/absensi-siswa/${id}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      credentials: 'include',
    }
  )

  return response
}

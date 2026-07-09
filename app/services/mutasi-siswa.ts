/**
 * Mutasi Siswa Service
 * Handle API calls untuk mutasi siswa
 */

/**
 * Get mutasi siswa dengan filter dan pagination
 */
export async function getMutasiSiswa(data: {
  search: {
    tahun_pelajaran_id?: number
    semester?: number
    start_date?: string
    end_date?: string
    nama_siswa?: string
    nisn?: string
    tempat_lahir?: string
    jenis_kelamin?: string
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
    `${config.public.apiBase}/api/v1/spmb-mutasi/get-mutasi-siswa`,
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
 * Get mutasi siswa by ID
 */
export async function getMutasiSiswaById(data: { id: number }) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ data: any }>(
    `${config.public.apiBase}/api/v1/spmb-mutasi/get-mutasi-siswa-by-id`,
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
 * Delete mutasi siswa
 */
export async function deleteMutasiSiswa(data: { id: number }) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ message: string }>(
    `${config.public.apiBase}/api/v1/spmb-mutasi/delete-mutasi-siswa`,
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
 * Update mutasi siswa
 */
export async function updateMutasiSiswa(id: number, formData: FormData) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  // Add id to formData
  formData.append('id', id.toString())

  const response = await $fetch<{ data: any; message: string }>(
    `${config.public.apiBase}/api/v1/spmb-mutasi/edit-mutasi-siswa`,
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
 * Get konfigurasi mutasi siswa
 */
export async function getKonfigurasiMutasiSiswa() {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ data: any }>(
    `${config.public.apiBase}/api/v1/spmb-mutasi/get-konfigurasi-mutasi-siswa`,
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
 * Save konfigurasi mutasi siswa
 */
export async function saveKonfigurasiMutasiSiswa(formData: FormData) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ data: any; message: string }>(
    `${config.public.apiBase}/api/v1/spmb-mutasi/setting-konfigurasi-mutasi-siswa`,
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
 * Download PDF formulir mutasi siswa
 */
export async function downloadPdfMutasiSiswa(id: number) {
  const config = useRuntimeConfig()

  const response = await $fetch(
    `${config.public.apiBase}/api/v1/public/export-pdf-formulir-mutasi-siswa`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        id: id
      },
      responseType: 'blob'
    }
  )

  return response as Blob
}

/**
 * Export Excel mutasi siswa
 */
export async function exportExcelMutasiSiswa(data: {
  tahun_pelajaran_id: number
  semester: number
}) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch(
    `${config.public.apiBase}/api/v1/spmb-mutasi/export-excel-mutasi-siswa`,
    {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      body: data,
      credentials: 'include',
      responseType: 'blob'
    }
  )

  return response as Blob
}

/**
 * Export PDF mutasi siswa
 */
export async function exportPdfMutasiSiswa(data: {
  tahun_pelajaran_id: number
  semester: number
}) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch(
    `${config.public.apiBase}/api/v1/spmb-mutasi/export-pdf-mutasi-siswa`,
    {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      body: data,
      credentials: 'include',
      responseType: 'blob'
    }
  )

  return response as Blob
}

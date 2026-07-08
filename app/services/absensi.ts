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

/**
 * Get dashboard summary
 */
export async function getDashboardSummary(data: {
  tahun_pelajaran_id: number
  semester: number
  rombel_id: number | null
  bidang_studi_id?: number | null
  tanggal_mulai: string
  tanggal_selesai: string
}) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ data: any }>(
    `${config.public.apiBase}/api/v1/absensi-siswa/dashboard-summary`,
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
 * Get grafik kehadiran
 */
export async function getGrafikKehadiran(data: {
  tahun_pelajaran_id: number
  semester: number
  rombel_id: number | null
  bidang_studi_id?: number | null
  periode: string
  tanggal_mulai: string
  tanggal_selesai: string
}) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ data: any }>(
    `${config.public.apiBase}/api/v1/absensi-siswa/grafik-kehadiran`,
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
 * Get statistik per hari
 */
export async function getStatistikPerHari(data: {
  tahun_pelajaran_id: number
  semester: number
  rombel_id: number | null
  bidang_studi_id?: number | null
  bulan: number
  tahun: number
}) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ data: any }>(
    `${config.public.apiBase}/api/v1/absensi-siswa/statistik-per-hari`,
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
 * Get perbandingan rombel
 */
export async function getPerbandinganRombel(data: {
  tahun_pelajaran_id: number
  semester: number
  bidang_studi_id?: number | null
  tanggal_mulai: string
  tanggal_selesai: string
}) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ data: any }>(
    `${config.public.apiBase}/api/v1/absensi-siswa/perbandingan-rombel`,
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
 * Get siswa dengan kehadiran terendah
 */
export async function getSiswaTerendah(data: {
  tahun_pelajaran_id: number
  semester: number
  rombel_id: number | null
  bidang_studi_id?: number | null
  limit: number
  tanggal_mulai: string
  tanggal_selesai: string
}) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ data: any }>(
    `${config.public.apiBase}/api/v1/absensi-siswa/siswa-terendah`,
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
 * Get dashboard siswa
 */
export async function getDashboardSiswa(data: {
  peserta_didik_id: number
  tahun_pelajaran_id: number
  rombel_id: number
  semester: number
  bidang_studi_id?: number | null
  periode: string
  tanggal_mulai: string
  tanggal_selesai: string
}) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ data: any }>(
    `${config.public.apiBase}/api/v1/absensi-siswa/dashboard-siswa`,
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
 * Get konfigurasi absensi
 */
export async function getKonfigurasiAbsensi() {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{
    data: {
      id: number
      jam_datang_mulai: string
      jam_max_datang: string
      jam_datang_selesai: string
      jam_pulang_mulai: string
      jam_pulang_selesai: string
      nama_kepsek: string
      nip_kepsek: string
      created_at: string
      updated_at: string
    } | null
  }>(
    `${config.public.apiBase}/api/v1/absensi-siswa/get-konfigurasi-absensi`,
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
 * Save konfigurasi absensi
 */
export async function saveKonfigurasiAbsensi(data: {
  jam_datang_mulai: string
  jam_max_datang: string
  jam_datang_selesai: string
  jam_pulang_mulai: string
  jam_pulang_selesai: string
  nama_kepsek: string
  nip_kepsek: string
}) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{
    message: string
    data: any
  }>(
    `${config.public.apiBase}/api/v1/absensi-siswa/setting-konfigurasi-absensi`,
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
 * Synchronize absensi siswa
 */
export async function synchronizeAbsensi(data: {
  tipe_sync: string
  tahun_pelajaran_id: number
  rombel_id: number
  bidang_studi_id: number | null
  tanggal?: string
  bulan?: number
  tahun?: number
  pertemuan_ke?: number
}) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{
    success: boolean
    data: {
      total_processed: number
      total_inserted: number
      total_updated: number
      total_skipped: number
      message: string
      details: any[]
    }
  }>(
    `${config.public.apiBase}/api/v1/absensi-siswa/synchronize-absensi-siswa`,
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
 * Create absensi manual by ID (for individual student)
 */
export async function createAbsensiManualById(formData: FormData) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{
    data: any
  }>(
    `${config.public.apiBase}/api/v1/absensi-siswa/create-absensi-manual-by-id`,
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
 * Export Excel absensi siswa
 */
export async function exportExcelAbsensi(data: {
  tahun_pelajaran_id: number
  rombel_id: number
  tipe_periode: 'bulan' | 'semester'
  bulan?: number
  tahun?: number
  semester?: number
  bidang_studi_id?: number
}) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch(
    `${config.public.apiBase}/api/v1/absensi-siswa/export-excel-absensi-siswa`,
    {
      method: 'POST',
      body: data,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      responseType: 'blob' as any, // Important for file download
    }
  )

  return response
}

/**
 * Export PDF absensi siswa
 */
export async function exportPdfAbsensi(data: {
  tahun_pelajaran_id: number
  rombel_id: number
  tipe_periode: 'bulan' | 'semester'
  bulan?: number
  tahun?: number
  semester?: number
  bidang_studi_id?: number
}) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch(
    `${config.public.apiBase}/api/v1/absensi-siswa/export-pdf-absensi-siswa`,
    {
      method: 'POST',
      body: data,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      responseType: 'blob' as any, // Important for file download
    }
  )

  return response
}

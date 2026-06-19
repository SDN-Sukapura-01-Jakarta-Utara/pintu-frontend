/**
 * Layanan SPMB Service
 * Handle API calls untuk layanan posko SPMB
 */

/**
 * Get layanan SPMB dengan filter dan pagination
 */
export async function getLayananSpmb(data: {
  search: {
    start_date?: string
    end_date?: string
    nama_orang_tua?: string
    nama_murid?: string
    status?: string
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
    `${config.public.apiBase}/api/v1/spmb/get-layanan-spmb`,
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
 * Get setting layanan SPMB
 */
export async function getSettingLayananSpmb() {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ data: any }>(
    `${config.public.apiBase}/api/v1/spmb/get-setting-layanan-spmb`,
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
 * Save setting layanan SPMB
 */
export async function saveSettingLayananSpmb(data: {
  nama_kepala_sekolah: string
  nip_kepala_sekolah: string
  nama_ketua_panitia: string
  nip_ketua_panitia: string
  grup_wa: string
}) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ data: any }>(
    `${config.public.apiBase}/api/v1/spmb/setting-layanan-spmb`,
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
 * Get layanan SPMB by ID
 */
export async function getLayananSpmbById(data: { id: number }) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ data: any }>(
    `${config.public.apiBase}/api/v1/spmb/get-layanan-spmb-by-id`,
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
 * Set status selesai layanan SPMB
 */
export async function setStatusSelesai(data: { id: number; status: string }) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ data: any; message: string }>(
    `${config.public.apiBase}/api/v1/spmb/set-status-selesai`,
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
 * Delete layanan SPMB
 */
export async function deleteLayananSpmb(data: { id: number }) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ message: string }>(
    `${config.public.apiBase}/api/v1/spmb/delete-layanan-spmb`,
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
 * Get monitoring pelayanan SPMB
 */
export async function getMonitoringPelayanan(data: { view_type: 'daily' | 'weekly' | 'monthly' | 'yearly' }) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{
    data: {
      statistik: {
        total_layanan: number
        layanan_hari_ini: number
        layanan_kemarin: number
        trend_percentage: number
        trend_direction: string
        layanan_minggu_ini: number
        layanan_bulan_ini: number
        by_status: Array<{ status: string; count: number }>
      }
      trend: {
        view_type: string
        period: string
        data: Array<{
          label: string
          date: string
          year?: string
          month?: string
          count: number
        }>
      }
      detail_layanan: Array<{
        id: number
        nama_orang_tua: string
        nama_lengkap_murid: string
        keperluan: string
        tanggal_laporan: string
        status: string
      }>
    }
  }>(
    `${config.public.apiBase}/api/v1/spmb/monitoring-pelayanan-spmb`,
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

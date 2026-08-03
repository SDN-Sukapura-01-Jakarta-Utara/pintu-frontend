/**
 * Ekstrakurikuler Service
 * Handle API calls untuk ekstrakurikuler
 */

/**
 * Get daftar ekstrakurikuler (untuk backoffice)
 */
export async function getEkstrakurikulerList(
  page: number = 1,
  limit: number = 50,
  search: any = {}
) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' 
    ? (localStorage.getItem('student_token') || localStorage.getItem('auth_token'))
    : null

  const requestBody = {
    search: search,
    pagination: {
      limit: limit,
      page: page,
    },
  }

  const response = await $fetch<{
    data: Array<{
      id: number
      name: string
      kelas_ids: number[]
      kelas: Array<{
        id: number
        name: string
        status: string
      }>
      kategori: string
      status: string
      created_at: string
      updated_at: string
      created_by_id: number
      updated_by_id: number | null
    }>
    pagination: {
      limit: number
      offset: number
      page: number
      total: number
      total_pages: number
    }
  }>(
    `${config.public.apiBase}/api/v1/ekstrakurikuler/get-ekstrakurikuler`,
    {
      method: 'POST',
      body: requestBody,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  )

  return {
    data: response.data || [],
    pagination: response.pagination,
  }
}

/**
 * Update ekstrakurikuler
 */
export async function updateEkstrakurikuler(data: any) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ 
    data: any
    message: string 
  }>(
    `${config.public.apiBase}/api/v1/ekstrakurikuler/update-ekstrakurikuler`,
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
 * Create ekstrakurikuler
 */
export async function createEkstrakurikuler(data: any) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ 
    data: any
    message: string 
  }>(
    `${config.public.apiBase}/api/v1/ekstrakurikuler/create-ekstrakurikuler`,
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
 * Delete ekstrakurikuler
 */
export async function deleteEkstrakurikuler(id: number) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{ 
    message: string 
  }>(
    `${config.public.apiBase}/api/v1/ekstrakurikuler/delete-ekstrakurikuler`,
    {
      method: 'POST',
      body: { id },
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
 * Get ekstrakurikuler yang sudah didaftarkan peserta didik
 */
export async function getEkskulPesertaDidik(peserta_didik_rombel_id: number) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('student_token') : null

  const response = await $fetch<{
    data: {
      peserta_didik_rombel_id: number
      ekstrakurikuler: Array<{
        id: number
        peserta_didik_rombel_id: number
        ekstrakurikuler_id: number
        ekstrakurikuler: {
          id: number
          name: string
          kategori: string
          status: string
        }
        created_at: string
        updated_at: string
      }>
      total_ekskul: number
    }
  }>(
    `${config.public.apiBase}/api/v1/ekstrakurikuler/get-ekskul-peserta-didik`,
    {
      method: 'POST',
      body: { peserta_didik_rombel_id },
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  )

  return response.data
}

/**
 * Register ekstrakurikuler untuk peserta didik
 */
export async function registerEkskulPesertaDidik(
  peserta_didik_rombel_id: number,
  ekstrakurikuler_ids: number[]
) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('student_token') : null

  const response = await $fetch<{
    message: string
    registrations: Array<{
      id: number
      peserta_didik_rombel_id: number
      ekstrakurikuler_id: number
      ekstrakurikuler: {
        id: number
        name: string
        kategori: string
        status: string
      }
      created_at: string
      updated_at: string
    }>
    summary: {
      added: number
      removed: number
      kept: number
    }
  }>(
    `${config.public.apiBase}/api/v1/ekstrakurikuler/register-ekskul-peserta-didik`,
    {
      method: 'POST',
      body: {
        peserta_didik_rombel_id,
        ekstrakurikuler_ids
      },
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
 * Get all ekstrakurikuler siswa (untuk backoffice)
 */
export async function getAllEkstrakurikulerSiswa(
  rombel_id: number,
  tahun_pelajaran_id: number
) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{
    data: {
      rombel_id: number
      tahun_pelajaran_id: number
      siswa: Array<{
        peserta_didik_rombel_id: number
        peserta_didik_id: number
        nama_lengkap: string
        nisn: string
        ekstrakurikuler: Array<{
          id: number
          peserta_didik_rombel_id: number
          ekstrakurikuler_id: number
          ekstrakurikuler: {
            id: number
            name: string
            kategori: string
            status: string
          }
          created_at: string
          updated_at: string
        }>
        total_ekskul: number
      }>
      total_siswa: number
    }
  }>(
    `${config.public.apiBase}/api/v1/ekstrakurikuler/get-all-ekstrakurikuler-siswa`,
    {
      method: 'POST',
      body: {
        rombel_id,
        tahun_pelajaran_id
      },
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  )

  return response.data
}

/**
 * Register all ekstrakurikuler siswa (bulk register untuk backoffice)
 */
export async function registerAllEkstrakurikulerSiswa(siswaData: Array<{
  peserta_didik_rombel_id: number
  ekstrakurikuler_ids: number[]
}>) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{
    message: string
    summary: {
      total_siswa: number
      total_added: number
      total_removed: number
      total_kept: number
      success_count: number
      failed_count: number
    }
    details: Array<{
      peserta_didik_rombel_id: number
      status: string
      added: number
      removed: number
      kept: number
    }>
  }>(
    `${config.public.apiBase}/api/v1/ekstrakurikuler/register-all-ekstrakurikuler-siswa`,
    {
      method: 'POST',
      body: {
        siswa: siswaData
      },
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
 * Get all statistic ekstrakurikuler siswa (untuk monitoring)
 */
export async function getAllStatisticEkstrakurikulerSiswa(
  tahun_pelajaran_id: number,
  rombel_id: number | null = null
) {
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const response = await $fetch<{
    data: {
      tahun_pelajaran_id: number
      rombel_id: number | null
      summary: {
        total_siswa: number
        total_siswa_ikut_ekskul: number
        total_siswa_tidak_ikut_ekskul: number
        persentase_ikut_ekskul: number
        total_ekstrakurikuler: number
        total_rombel: number
      }
      statistik_per_ekskul: Array<{
        ekstrakurikuler_id: number
        nama_ekstrakurikuler: string
        kategori: string
        total_siswa: number
        rombel: Array<{
          rombel_id: number
          nama_rombel: string
          jumlah_siswa: number
        }>
      }>
      statistik_per_rombel: Array<{
        rombel_id: number
        nama_rombel: string
        total_siswa: number
        siswa_ikut_ekskul: number
        siswa_tidak_ikut_ekskul: number
        persentase_ikut_ekskul: number
        ekstrakurikuler: Array<{
          ekstrakurikuler_id: number
          nama_ekstrakurikuler: string
          jumlah_siswa: number
        }>
      }>
      siswa_tidak_ikut_ekskul: Array<{
        peserta_didik_rombel_id: number
        peserta_didik_id: number
        nama_lengkap: string
        nisn: string
        rombel_id: number
        nama_rombel: string
      }>
    }
  }>(
    `${config.public.apiBase}/api/v1/ekstrakurikuler/get-all-statistic-ekstrakurikuler-siswa`,
    {
      method: 'POST',
      body: {
        tahun_pelajaran_id,
        rombel_id
      },
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  )

  return response.data
}

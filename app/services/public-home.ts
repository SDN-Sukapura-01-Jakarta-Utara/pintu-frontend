/**
 * Public Home Service
 * Handle API calls untuk halaman beranda publik (tanpa auth)
 */

import type { PublicJumbotronResponse, PublicTotalSiswaResponse, PublicTotalPendidikResponse, PublicTotalTendikResponse, PublicTotalRombelResponse, PublicTotalEkskulResponse } from '~/types/PublicHomeType'

/**
 * Get public jumbotron data (no auth required)
 * @returns Public jumbotron data
 */
export async function getPublicJumbotron(): Promise<PublicJumbotronResponse> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-jumbotron`
  
  console.log('Fetching from URL:', url)
  
  try {
    const response = await $fetch<PublicJumbotronResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('API Response:', response)
    return response
  } catch (error: any) {
    console.error('Error fetching public jumbotron:', error)
    console.error('Error details:', {
      status: error?.status,
      statusText: error?.statusText,
      data: error?.data,
      message: error?.message
    })
    throw error
  }
}

/**
 * Get total siswa data (no auth required)
 * @returns Total siswa data
 */
export async function getPublicTotalSiswa(): Promise<PublicTotalSiswaResponse> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-total-siswa`
  
  try {
    const response = await $fetch<PublicTotalSiswaResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return response
  } catch (error: any) {
    console.error('Error fetching public total siswa:', error)
    throw error
  }
}

/**
 * Get total pendidik data (no auth required)
 * @returns Total pendidik data
 */
export async function getPublicTotalPendidik(): Promise<PublicTotalPendidikResponse> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-total-pendidik`
  
  try {
    const response = await $fetch<PublicTotalPendidikResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return response
  } catch (error: any) {
    console.error('Error fetching public total pendidik:', error)
    throw error
  }
}

/**
 * Get total tendik data (no auth required)
 * @returns Total tendik data
 */
export async function getPublicTotalTendik(): Promise<PublicTotalTendikResponse> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-total-tendik`
  
  try {
    const response = await $fetch<PublicTotalTendikResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return response
  } catch (error: any) {
    console.error('Error fetching public total tendik:', error)
    throw error
  }
}

/**
 * Get total rombel data (no auth required)
 * @returns Total rombel data
 */
export async function getPublicTotalRombel(): Promise<PublicTotalRombelResponse> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-total-rombel`
  
  try {
    const response = await $fetch<PublicTotalRombelResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return response
  } catch (error: any) {
    console.error('Error fetching public total rombel:', error)
    throw error
  }
}

/**
 * Get total ekstrakurikuler data (no auth required)
 * @returns Total ekstrakurikuler data
 */
export async function getPublicTotalEkskul(): Promise<PublicTotalEkskulResponse> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-total-ekskul`
  
  try {
    const response = await $fetch<PublicTotalEkskulResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return response
  } catch (error: any) {
    console.error('Error fetching public total ekskul:', error)
    throw error
  }
}

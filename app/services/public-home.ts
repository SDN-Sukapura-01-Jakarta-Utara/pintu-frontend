/**
 * Public Home Service
 * Handle API calls untuk halaman beranda publik (tanpa auth)
 */

import type { PublicJumbotronResponse } from '~/types/PublicHomeType'

/**
 * Get public jumbotron data (no auth required)
 * @returns Public jumbotron data
 */
export async function getPublicJumbotron(): Promise<PublicJumbotronResponse> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/jumbotron`
  
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

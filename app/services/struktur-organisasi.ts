/**
 * Struktur Organisasi Service
 * Handle API calls untuk struktur organisasi
 */

import type {
  StrukturOrganisasi,
  StrukturOrganisasiCreate,
  StrukturOrganisasiUpdate,
  StrukturOrganisasiResponse,
  StrukturOrganisasiDetailResponse,
} from '~/types/StrukturOrganisasiType'

/**
 * Get all struktur organisasi dengan filter dan pagination
 */
export async function getStrukturOrganisasi(payload: {
  search: {
    nama?: string
    jabatan?: string
    urutan?: number
    relasi?: string
    status?: string
  }
  pagination: {
    limit: number
    page: number
  }
}): Promise<StrukturOrganisasiResponse> {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')

  const response = await $fetch<StrukturOrganisasiResponse>(
    `${config.public.apiBase}/api/v1/struktur-organisasi/get-struktur-organisasi`,
    {
      method: 'POST',
      body: payload,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  )

  return response
}

/**
 * Get struktur organisasi by ID
 */
export async function getStrukturOrganisasiById(id: number): Promise<StrukturOrganisasiDetailResponse> {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')

  const response = await $fetch<StrukturOrganisasiDetailResponse>(
    `${config.public.apiBase}/api/v1/struktur-organisasi/get-struktur-organisasi-by-id`,
    {
      method: 'POST',
      body: { id },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  )

  return response
}

/**
 * Create struktur organisasi
 */
export async function createStrukturOrganisasi(
  data: StrukturOrganisasiCreate
): Promise<StrukturOrganisasiDetailResponse> {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')

  const response = await $fetch<StrukturOrganisasiDetailResponse>(
    `${config.public.apiBase}/api/v1/struktur-organisasi/create-struktur-organisasi`,
    {
      method: 'POST',
      body: data,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  )

  return response
}

/**
 * Update struktur organisasi
 */
export async function updateStrukturOrganisasi(
  data: StrukturOrganisasiUpdate
): Promise<StrukturOrganisasiDetailResponse> {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')

  const response = await $fetch<StrukturOrganisasiDetailResponse>(
    `${config.public.apiBase}/api/v1/struktur-organisasi/update-struktur-organisasi`,
    {
      method: 'POST',
      body: data,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  )

  return response
}

/**
 * Delete struktur organisasi
 */
export async function deleteStrukturOrganisasi(id: number): Promise<{ success: boolean }> {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')

  const response = await $fetch<{ success: boolean }>(
    `${config.public.apiBase}/api/v1/struktur-organisasi/delete-struktur-organisasi`,
    {
      method: 'POST',
      body: { id },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  )

  return response
}

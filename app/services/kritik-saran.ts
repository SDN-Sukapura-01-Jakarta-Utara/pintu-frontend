/**
 * Kritik Saran Service
 * Handle API calls untuk kritik dan saran
 */

export const getKritikSaran = async (search: any, pagination: any) => {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')
  
  const response = await fetch(`${config.public.apiBase}/api/v1/kritik-saran/get-kritik-saran`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include',
    body: JSON.stringify({
      search,
      pagination
    })
  })

  if (!response.ok) {
    throw new Error('Failed to fetch kritik saran')
  }

  return await response.json()
}

export const getKritikSaranById = async (id: number) => {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')
  
  const response = await fetch(`${config.public.apiBase}/api/v1/kritik-saran/get-kritik-saran-by-id`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include',
    body: JSON.stringify({ id })
  })

  if (!response.ok) {
    throw new Error('Failed to fetch kritik saran detail')
  }

  return await response.json()
}

export const deleteKritikSaran = async (id: number) => {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')
  
  const response = await fetch(`${config.public.apiBase}/api/v1/kritik-saran/delete-kritik-saran`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include',
    body: JSON.stringify({ id })
  })

  if (!response.ok) {
    throw new Error('Failed to delete kritik saran')
  }

  return await response.json()
}

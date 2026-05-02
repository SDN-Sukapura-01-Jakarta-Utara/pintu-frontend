/**
 * Pertanyaan Service
 * Handle API calls untuk pertanyaan publik
 */

export const submitPertanyaan = async (formData: FormData) => {
  const config = useRuntimeConfig()
  
  const response = await fetch(`${config.public.apiBase}/api/v1/public/create-pertanyaan`, {
    method: 'POST',
    credentials: 'include',
    body: formData
  })

  if (!response.ok) {
    throw new Error('Failed to submit pertanyaan')
  }

  return await response.json()
}

export const trackPertanyaan = async (idTiket: string) => {
  const config = useRuntimeConfig()
  
  const response = await fetch(`${config.public.apiBase}/api/v1/public/track-pertanyaan`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id_tiket: idTiket })
  })

  if (!response.ok) {
    throw new Error('Failed to track pertanyaan')
  }

  return await response.json()
}

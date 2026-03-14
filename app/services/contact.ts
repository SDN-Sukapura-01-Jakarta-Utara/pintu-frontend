/**
 * Contact Service
 * Handle API calls untuk contact management
 */

import type { ContactResponse, ContactData } from '~/types/ContactType'

/**
 * Helper function to handle API errors globally
 */
const handleApiError = (error: any) => {
  if (typeof window !== 'undefined') {
    const nuxtApp = useNuxtApp()
    const status = error?.status || error?.response?.status
    if (status === 401) {
      nuxtApp.$handleFetchError(error)
    }
  }
}

/**
 * Get contact by ID
 * @param id - Contact ID
 * @returns Contact detail response
 */
export async function getContactById(id: number): Promise<ContactResponse> {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')

  try {
    const response = await $fetch<ContactResponse>(
      `${config.public.apiBase}/api/v1/contacts/get-contact-by-id`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: { id },
      }
    )

    return response
  } catch (error: any) {
    handleApiError(error)
    // Return empty contact if not found (404)
    if (error.status === 404) {
      return {
        data: null as any,
      }
    }
    throw error
  }
}

/**
 * Create new contact
 * @param contactData - Contact data
 * @returns Created contact response
 */
export async function createContact(contactData: ContactData): Promise<ContactResponse> {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')

  try {
    const response = await $fetch<ContactResponse>(
      `${config.public.apiBase}/api/v1/contacts/create-contact`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: contactData,
      }
    )

    return response
  } catch (error: any) {
    handleApiError(error)
    throw error
  }
}

/**
 * Update contact
 * @param id - Contact ID
 * @param contactData - Updated contact data
 * @returns Updated contact response
 */
export async function updateContact(id: number, contactData: Partial<ContactData>): Promise<ContactResponse> {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')

  try {
    const response = await $fetch<ContactResponse>(
      `${config.public.apiBase}/api/v1/contacts/update-contact`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: {
          id,
          ...contactData,
        },
      }
    )

    return response
  } catch (error: any) {
    handleApiError(error)
    throw error
  }
}

/**
 * Delete contact
 * @param id - Contact ID
 * @returns Delete response
 */
export async function deleteContact(id: number): Promise<any> {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')

  try {
    const response = await $fetch(
      `${config.public.apiBase}/api/v1/contacts/delete-contact`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: { id },
      }
    )

    return response
  } catch (error: any) {
    handleApiError(error)
    throw error
  }
}

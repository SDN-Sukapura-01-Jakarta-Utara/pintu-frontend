import type { LoginCredentials } from '~/types/AuthType'

export interface StudentLoginResponse {
  data: {
    token: string
    student: {
      id: number
      nama: string
      nis: string
      nisn: string
      jenis_kelamin: string
      tempat_lahir: string
      tanggal_lahir: string
      username: string
      status: string
      photo: string
      roles: any[]
      rombel: any[]
      created_at: string
    }
    permissions: string[]
    expires_at: string
  }
  status: string
}

export const studentAuthService = {
  async login(credentials: LoginCredentials): Promise<StudentLoginResponse> {
    const config = useRuntimeConfig()
    
    const response = await $fetch<StudentLoginResponse>(
      `${config.public.apiBase}/api/v1/auth/login/student`,
      {
        method: 'POST',
        body: {
          username: credentials.username,
          password: credentials.password
        },
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    )

    return response
  },

  async getStudentById(id: number, token: string) {
    const config = useRuntimeConfig()
    
    const response = await $fetch(
      `${config.public.apiBase}/api/v1/peserta-didik/get-peserta-didik-by-id`,
      {
        method: 'POST',
        body: { id },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      }
    )

    return response
  }
}

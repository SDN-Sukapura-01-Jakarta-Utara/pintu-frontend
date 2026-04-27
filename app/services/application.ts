import type { Application, ApplicationPagination } from '~/stores/application'

export interface GetApplicationsParams {
    search: {
        nama: string
        status: string
        show_in_jumbotron: boolean | null
    }
    pagination: {
        limit: number
        page: number
    }
}

export interface GetApplicationsResponse {
    data: Application[]
    pagination: ApplicationPagination
}

export interface CreateApplicationParams {
    nama: string
    link: string
    show_in_jumbotron: boolean
    status: 'active' | 'inactive'
}

export interface UpdateApplicationParams {
    id: number
    nama: string
    link: string
    show_in_jumbotron: boolean
    status: 'active' | 'inactive'
}

export interface GetApplicationByIdResponse {
    data: Application
}

export const getApplications = async (params: GetApplicationsParams): Promise<GetApplicationsResponse> => {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    const body: any = {
        search: {
            nama: params.search.nama,
            status: params.search.status
        },
        pagination: {
            limit: params.pagination.limit,
            page: params.pagination.page
        }
    }

    // Only include show_in_jumbotron if it's not null
    if (params.search.show_in_jumbotron !== null) {
        body.search.show_in_jumbotron = params.search.show_in_jumbotron
    }

    const response = await $fetch<GetApplicationsResponse>(`${config.public.apiBase}/api/v1/application/get-application`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body,
        credentials: 'include'
    })

    return response
}

export const getApplicationById = async (id: number): Promise<GetApplicationByIdResponse> => {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    const response = await $fetch<GetApplicationByIdResponse>(`${config.public.apiBase}/api/v1/application/get-application-by-id`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: { id },
        credentials: 'include'
    })

    return response
}

export const createApplication = async (params: CreateApplicationParams): Promise<void> => {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    await $fetch(`${config.public.apiBase}/api/v1/application/create-application`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: params,
        credentials: 'include'
    })
}

export const updateApplication = async (params: UpdateApplicationParams): Promise<void> => {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    await $fetch(`${config.public.apiBase}/api/v1/application/update-application`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: params,
        credentials: 'include'
    })
}

export const deleteApplication = async (id: number): Promise<void> => {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')

    await $fetch(`${config.public.apiBase}/api/v1/application/delete-application`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: { id },
        credentials: 'include'
    })
}

import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Application {
    id: number
    nama: string
    link: string
    show_in_jumbotron: boolean
    status: 'active' | 'inactive'
    created_at: string
    updated_at: string
    created_by_id: number
}

export interface ApplicationPagination {
    limit: number
    offset: number
    page: number
    total: number
    total_pages: number
}

export const useApplicationStore = defineStore('application', () => {
    const applications = ref<Application[]>([])
    const pagination = ref<ApplicationPagination>({
        limit: 10,
        offset: 0,
        page: 1,
        total: 0,
        total_pages: 0
    })

    const fetchApplications = async (params: {
        search: {
            nama: string
            status: string
            show_in_jumbotron: boolean | null
        }
        pagination: {
            limit: number
            page: number
        }
    }) => {
        const { getApplications } = await import('~/services/application')
        const response = await getApplications(params)
        
        applications.value = response.data || []
        pagination.value = response.pagination || {
            limit: 10,
            offset: 0,
            page: 1,
            total: 0,
            total_pages: 0
        }
    }

    return {
        applications,
        pagination,
        fetchApplications
    }
})

<template>
  <DashboardLayout>
    <!-- Header Section -->
    <div class="mb-6 sm:mb-8">
      <div class="flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
        <div>
          <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Manajemen Formulir & Survei
          </h1>
          <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
            Kelola formulir dan survei untuk berbagai keperluan
          </p>
        </div>
        <button
          @click="openCreateModal"
          class="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-[#2e45a7] text-white font-semibold text-[13px] sm:text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:bg-[#002d89] cursor-pointer"
        >
          <i class="fa-solid fa-plus w-3 h-3 sm:w-4 sm:h-4"></i>
          Buat Formulir/Survei
        </button>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
      <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Formulir</h3>

      <!-- Filter Form -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <!-- Judul Filter -->
        <div>
          <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
            Judul Formulir
          </label>
          <input
            v-model="filters.judul"
            type="text"
            placeholder="Cari judul..."
            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
          />
        </div>

        <!-- Start Date Filter -->
        <div>
          <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
            Tanggal Mulai
          </label>
          <input
            v-model="filters.start_date"
            type="date"
            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
          />
        </div>

        <!-- End Date Filter -->
        <div>
          <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
            Tanggal Akhir
          </label>
          <input
            v-model="filters.end_date"
            type="date"
            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
          />
        </div>

        <!-- Tipe Akses Filter -->
        <div>
          <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
            Tipe Akses
          </label>
          <select
            v-model="filters.access_type"
            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer"
          >
            <option value="">Semua Tipe</option>
            <option value="public">Publik</option>
            <option value="authenticated">Autentikasi</option>
          </select>
        </div>

        <!-- Target Responder Filter -->
        <div>
          <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
            Target Responder
          </label>
          <select
            v-model="filters.target_responder"
            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer"
          >
            <option value="">Semua Target</option>
            <option value="murid">Siswa</option>
            <option value="pendidik">Pendidik</option>
            <option value="tendik">Tendik</option>
          </select>
        </div>
      </div>

      <!-- Filter Buttons -->
      <div class="flex gap-3 mt-4 flex-wrap">
        <button
          @click="applyFilter"
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors duration-200 cursor-pointer"
        >
          <i class="fa-solid fa-magnifying-glass w-4 h-4"></i>
          Cari
        </button>
        <button
          @click="clearFilter"
          class="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
        >
          <i class="fa-solid fa-rotate-left w-4 h-4"></i>
          Reset Filter
        </button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="flex flex-col items-center gap-3 sm:gap-4">
          <div class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
          <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data formulir...</p>
        </div>
      </div>

      <!-- Table Content -->
      <div v-else-if="formulirList.length > 0">
        <Table 
          :items="formulirList" 
          :columns="tableColumns"
          :current-page="pagination.page"
          :current-limit="pagination.limit"
          :total="pagination.total"
          :is-loading="isLoading"
          @pageChange="changePage"
          @limitChange="changeLimit"
        >
          <!-- Custom cell for Judul -->
          <template #cell-judul="{ item }">
            <div>
              <div class="text-sm font-semibold text-gray-900">{{ item.judul }}</div>
              <div class="text-xs text-gray-500 mt-1">
                <i class="fa-solid fa-calendar mr-1"></i>
                {{ formatDate(item.start_date) }} - {{ formatDate(item.end_date) }}
              </div>
              <div class="text-xs text-gray-500 mt-1">
                <span :class="[
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold',
                  item.access_type === 'public' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                ]">
                  <i :class="item.access_type === 'public' ? 'fa-solid fa-globe' : 'fa-solid fa-lock'"></i>
                  {{ item.access_type === 'public' ? 'Publik' : 'Autentikasi' }}
                </span>
              </div>
            </div>
          </template>

          <!-- Custom cell for Penulis -->
          <template #cell-created_by.full_name="{ item }">
            <span class="text-sm font-medium text-gray-900">{{ item.created_by?.full_name || '-' }}</span>
          </template>

          <!-- Custom cell for Max Responses -->
          <template #cell-max_responses="{ item }">
            <span class="text-sm font-semibold text-gray-900">{{ item.max_responses || 'Unlimited' }}</span>
          </template>

          <!-- Custom cell for Target User Types -->
          <template #cell-target_user_types="{ item }">
            <div v-if="item.target_user_types && item.target_user_types.length > 0" class="flex flex-wrap gap-1 justify-center">
              <span 
                v-for="(type, index) in item.target_user_types" 
                :key="index"
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800"
              >
                {{ type === 'murid' ? 'Siswa' : type === 'guru' ? 'Guru' : type }}
              </span>
            </div>
            <span v-else class="text-sm text-gray-500">-</span>
          </template>

          <!-- Custom cell for Rombel IDs -->
          <template #cell-rombel_ids="{ item }">
            <span v-if="item.rombel_ids && item.rombel_ids.length > 0" class="text-sm font-semibold text-gray-900">
              {{ item.rombel_ids.length }} Rombel
            </span>
            <span v-else class="text-sm text-gray-500">-</span>
          </template>

          <!-- Custom cell for Created At -->
          <template #cell-created_at="{ item }">
            <span class="text-sm text-gray-900">{{ formatDate(item.created_at) }}</span>
          </template>

          <!-- Custom cell for Status -->
          <template #cell-is_active="{ item }">
            <span :class="[
              'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold',
              item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            ]">
              <span :class="['w-2 h-2 rounded-full', item.is_active ? 'bg-green-600' : 'bg-red-600']"></span>
              {{ item.is_active ? 'Aktif' : 'Nonaktif' }}
            </span>
          </template>

          <!-- Custom actions slot -->
          <template #actions="{ item }">
            <div class="flex items-center justify-center gap-1.5 sm:gap-2">
              <!-- Share Link Button -->
              <button
                @click="shareLink(item)"
                class="inline-flex items-center justify-center gap-1.5 px-3 sm:px-2.5 py-2 sm:pt-2.5 sm:pb-1.5 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700 font-semibold text-xs border border-purple-200 shadow-sm hover:shadow-md hover:from-purple-100 hover:to-purple-200 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm cursor-pointer"
                title="Share Link"
              >
                <i class="fa-solid fa-share-nodes w-3.5 h-3.5 sm:w-5 sm:h-5"></i>
              </button>

              <!-- View Response Button -->
              <button
                @click="viewResponse(item)"
                class="inline-flex items-center justify-center gap-1.5 px-3 sm:px-2.5 py-2 sm:pt-2.5 sm:pb-1.5 rounded-lg bg-gradient-to-br from-green-50 to-green-100 text-green-700 font-semibold text-xs border border-green-200 shadow-sm hover:shadow-md hover:from-green-100 hover:to-green-200 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm cursor-pointer"
                title="Lihat Response"
              >
                <i class="fa-solid fa-chart-simple w-3.5 h-3.5 sm:w-5 sm:h-5"></i>
              </button>

              <!-- Edit Button -->
              <EditButton title="Edit Formulir" label="Edit" @click="editFormulir(item)" />

              <!-- Delete Button -->
              <DeleteButton title="Hapus Formulir" label="Hapus" @click="deleteFormulir(item)" />
            </div>
          </template>
        </Table>
      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center py-16">
        <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <i class="fa-solid fa-file-lines text-4xl text-gray-400"></i>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Tidak Ada Data</h3>
        <p class="text-gray-600 text-center max-w-md">
          Belum ada formulir yang dibuat. Klik tombol "Tambah Formulir" untuk membuat formulir baru.
        </p>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from '~/composables/useToast'
import { useAuthGuard } from '~/composables/useAuthGuard'
import EditButton from '~/components/common/EditButton.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'

definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'Formulir & Survei | Backoffice',
})

const { success, error } = useToast()
const { handle401 } = useAuthGuard()
const config = useRuntimeConfig()

const isLoading = ref(false)
const formulirList = ref<any[]>([])
const filters = ref({
  judul: '',
  start_date: '',
  end_date: '',
  access_type: '',
  target_responder: ''
})

const pagination = ref({
  limit: 10,
  page: 1,
  total: 0,
  total_pages: 0
})

const tableColumns = [
  { key: 'judul', label: 'Judul' },
  { key: 'created_by.full_name', label: 'Penulis' },
  { key: 'max_responses', label: 'Maks Respon', align: 'center' as const },
  { key: 'target_user_types', label: 'Target Responder', align: 'center' as const },
  { key: 'rombel_ids', label: 'Rombel Responder', align: 'center' as const },
  { key: 'created_at', label: 'Tanggal Buat', align: 'center' as const },
  { key: 'is_active', label: 'Status', align: 'center' as const }
]

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, pagination.value.page - Math.floor(maxVisible / 2))
  let end = Math.min(pagination.value.total_pages, start + maxVisible - 1)
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const loadFormulir = async () => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('auth_token')
    const userStr = localStorage.getItem('auth_user')
    const user = userStr ? JSON.parse(userStr) : null
    
    // Build target_user_types array based on filter
    const targetUserTypes = filters.value.target_responder ? [filters.value.target_responder] : []
    
    const response: any = await $fetch(
      `${config.public.apiBase}/api/v1/formulir/get-formulir`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: {
          search: {
            judul: filters.value.judul,
            created_by_id: user?.id || null,
            start_date: filters.value.start_date,
            end_date: filters.value.end_date,
            access_type: filters.value.access_type,
            target_user_types: targetUserTypes,
            role: 'admin'
          },
          pagination: {
            limit: pagination.value.limit,
            page: pagination.value.page
          }
        }
      }
    )
    
    if (response.data) {
      formulirList.value = response.data.data || []
      pagination.value = {
        ...pagination.value,
        total: response.data.pagination.total,
        total_pages: response.data.pagination.total_pages
      }
    }
  } catch (err: any) {
    console.error('Error loading formulir:', err)
    
    // Check if it's a 401 error (invalid or expired token)
    if (err.status === 401 || err.statusCode === 401 || 
        (err.data && err.data.error && err.data.error.includes('token'))) {
      await handle401()
      return
    }
    
    error('Gagal', err.data?.message || 'Gagal memuat data formulir')
  } finally {
    isLoading.value = false
  }
}

const applyFilter = () => {
  pagination.value.page = 1
  loadFormulir()
}

const clearFilter = () => {
  filters.value = {
    judul: '',
    start_date: '',
    end_date: '',
    access_type: '',
    target_responder: ''
  }
  pagination.value.page = 1
  loadFormulir()
}

const changePage = (page: number) => {
  pagination.value.page = page
  loadFormulir()
}

const changeLimit = (limit: number) => {
  pagination.value.limit = limit
  pagination.value.page = 1
  loadFormulir()
}

const shareLink = async (item: any) => {
  const baseUrl = window.location.origin
  const shareUrl = `${baseUrl}${item.public_url}`
  
  try {
    // Try using the Web Share API if available
    if (navigator.share) {
      await navigator.share({
        title: item.judul,
        text: `Isi formulir: ${item.judul}`,
        url: shareUrl
      })
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(shareUrl)
      success('Link Disalin', 'Link formulir berhasil disalin ke clipboard')
    }
  } catch (err) {
    // If both methods fail, show the URL in a prompt
    console.error('Error sharing:', err)
    success('Link Formulir', shareUrl)
  }
}

const editFormulir = (item: any) => {
  console.log('Edit formulir:', item)
}

const viewResponse = (item: any) => {
  console.log('View response:', item)
}

const deleteFormulir = (item: any) => {
  console.log('Delete formulir:', item)
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const openCreateModal = () => {
  navigateTo('/backoffice/formulir-survei/create-formulir')
}

onMounted(() => {
  loadFormulir()
})
</script>

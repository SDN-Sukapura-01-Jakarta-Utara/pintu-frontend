<template>
  <DashboardLayout>
    <!-- Create Sarana Prasarana Modal -->
    <CreateSaranaPrasaranaModal
      v-model="showCreateModal"
      @success="handleCreateSuccess"
      @error="handleCreateError"
    />

    <!-- Edit Sarana Prasarana Modal -->
    <EditSaranaPrasaranaModal
      v-model="showEditModal"
      :sarana-prasarana-data="selectedItem"
      @success="handleEditSuccess"
      @error="handleEditError"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmationDeleteModal
      v-model="showDeleteModal"
      title="Hapus Sarana Prasarana?"
      message="Anda yakin ingin menghapus sarana prasarana ini? Tindakan ini tidak dapat dibatalkan."
      :is-loading="isDeleting"
      @confirm="confirmDelete"
    />

    <!-- Header Section -->
    <div class="mb-6 sm:mb-8">
      <div class="flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
        <div>
          <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Sarana Prasarana
          </h1>
          <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
            Kelola data sarana dan prasarana sekolah
          </p>
        </div>
        <AddButton
          label="Tambah Data"
          iconClass="fa-solid fa-plus"
          @click="openCreateModal"
        />
      </div>
    </div>

    <!-- Filter Section -->
    <div v-if="!isLoading && !error" class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
      <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">
        Filter Data Sarana Prasarana
      </h3>

      <!-- Filter Form -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Nama Filter -->
        <div>
          <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
            Nama Sarana Prasarana
          </label>
          <input
            v-model="searchFilters.name"
            type="text"
            placeholder="Cari nama sarana..."
            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
          />
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
            Status
          </label>
          <select
            v-model="searchFilters.status"
            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
      </div>

      <!-- Filter Buttons -->
      <div class="flex gap-3 mt-4">
        <button
          @click="applyFilters"
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors duration-200 cursor-pointer"
        >
          <i class="fa-solid fa-magnifying-glass w-4 h-4"></i>
          Cari
        </button>
        <button
          @click="clearFilters"
          class="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
        >
          <i class="fa-solid fa-rotate-left w-4 h-4"></i>
          Reset Filter
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-8 sm:py-12">
      <div class="flex flex-col items-center gap-3 sm:gap-4">
        <div
          class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"
        ></div>
        <p class="text-sm sm:text-base text-gray-600 font-medium">
          Memuat data sarana prasarana...
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="rounded-xl border-2 border-red-200 bg-red-50 p-4 sm:p-6">
      <div class="flex items-start gap-3 sm:gap-4">
        <div class="flex-shrink-0">
          <svg
            class="h-5 w-5 sm:h-6 sm:w-6 text-red-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-base sm:text-lg font-semibold text-red-900">
            Gagal memuat data
          </h3>
          <p class="mt-1 text-sm sm:text-base text-red-800">{{ error }}</p>
          <button
            @click="fetchSaranaPrasaranaData"
            class="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors"
          >
            <i class="fa-solid fa-rotate-right w-3 h-3 sm:w-4 sm:h-4"></i>
            Coba Lagi
          </button>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- Data Table -->
      <div v-if="saranaPrasaranaList.length > 0">
        <Table
          :items="saranaPrasaranaList"
          :total="total"
          :columns="tableColumns"
          @edit="openEditModal"
          @delete="openDeleteConfirm"
        >
          <!-- Custom cell for Foto column -->
          <template #cell-foto="{ item }">
            <img
              :src="item.foto"
              :alt="`Sarana Prasarana ${item.id}`"
              class="h-12 w-16 sm:h-16 sm:w-24 rounded-lg object-cover shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            />
          </template>

          <!-- Custom cell for Nama column -->
          <template #cell-name="{ item }">
            <span class="text-xs sm:text-sm md:text-[15px] text-gray-900">{{
              item.name
            }}</span>
          </template>

          <!-- Custom cell for Status column -->
          <template #cell-status="{ item }">
            <span
              :class="[
                'inline-flex items-center rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm md:text-[15px] font-semibold',
                item.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800',
              ]"
            >
              <span
                :class="[
                  'inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full mr-1 sm:mr-2',
                  item.status === 'active' ? 'bg-green-600' : 'bg-red-600',
                ]"
              ></span>
              {{ item.status === 'active' ? 'Aktif' : 'Nonaktif' }}
            </span>
          </template>

          <!-- Custom cell for Created Date column -->
          <template #cell-created_at="{ item }">
            {{ formatDate(item.created_at) }}
          </template>
        </Table>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-6"
      >
        <div
          class="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 sm:mb-6"
        >
          <i
            :class="[
              hasActiveFilters
                ? 'fa-solid fa-magnifying-glass'
                : 'fa-solid fa-warehouse',
              'text-2xl sm:text-4xl text-gray-400'
            ]"
          ></i>
        </div>
        <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1">
          {{ hasActiveFilters ? 'Data tidak ditemukan' : 'Belum ada sarana prasarana' }}
        </h3>
        <p
          class="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 max-w-sm"
        >
          {{
            hasActiveFilters
              ? 'Data tidak ditemukan dalam pencarian'
              : 'Mulai dengan menambahkan data sarana dan prasarana sekolah Anda'
          }}
        </p>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { SaranaPrasaranaData } from '~/types/SaranaPrasaranaType'
import type { TableColumn } from '~/components/Table.vue'
import {
  getSaranaPrasaranaList,
  deleteSaranaPrasarana,
} from '~/services/sarana-prasarana'
import AddButton from '~/components/common/AddButton.vue'
import CreateSaranaPrasaranaModal from '~/components/modals/CreateSaranaPrasaranaModal.vue'
import EditSaranaPrasaranaModal from '~/components/modals/EditSaranaPrasaranaModal.vue'
import ConfirmationDeleteModal from '~/components/modals/ConfirmationDeleteModal.vue'
import { useToast } from '~/composables/useToast'

const { success } = useToast()

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

// State
const saranaPrasaranaList = ref<SaranaPrasaranaData[]>([])
const isLoading = ref(false)
const isDeleting = ref(false)
const error = ref<string | null>(null)
const total = ref(0)
const showDeleteModal = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedItem = ref<SaranaPrasaranaData | null>(null)

// Search filters
const searchFilters = ref({
  name: '',
  status: '',
})

// Check if there are active filters
const hasActiveFilters = computed(() => {
  return searchFilters.value.name.trim() !== '' || searchFilters.value.status !== ''
})

// Table columns configuration
const tableColumns: TableColumn[] = [
  {
    key: 'foto',
    label: 'Foto',
    width: '32',
  },
  {
    key: 'name',
    label: 'Nama Sarana Prasarana',
  },
  {
    key: 'status',
    label: 'Status',
  },
  {
    key: 'created_at',
    label: 'Dibuat',
  },
]

// Fetch sarana prasarana data
const fetchSaranaPrasaranaData = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await getSaranaPrasaranaList({
      search: {
        name: searchFilters.value.name,
        status: (searchFilters.value.status as any) || undefined,
      },
      pagination: {
        limit: 100,
        page: 1,
      },
    })

    // Sort by created_at descending (newest first)
    const sortedData = response.data.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA // descending order
    })

    saranaPrasaranaList.value = sortedData
    total.value = response.pagination.total
  } catch (err: any) {
    // Handle 401 Unauthorized - redirect to login
    if (err.status === 401) {
      const { handle401 } = useAuthGuard()
      await handle401()
      return
    }

    error.value =
      err.data?.message ||
      err.message ||
      'Gagal memuat data sarana prasarana'
    console.error('Error fetching sarana prasarana:', err)
  } finally {
    isLoading.value = false
  }
}

// Apply filters
const applyFilters = () => {
  fetchSaranaPrasaranaData()
}

// Clear filters
const clearFilters = () => {
  searchFilters.value = {
    name: '',
    status: '',
  }
  fetchSaranaPrasaranaData()
}

// Open create modal
const openCreateModal = () => {
  showCreateModal.value = true
}

// Handle successful create
const handleCreateSuccess = async (message: string) => {
  console.log('Create success:', message)
  // Show toast
  success(
    'Data Berhasil Ditambahkan',
    'Sarana prasarana baru telah ditambahkan ke sistem'
  )
  // Refresh data
  await fetchSaranaPrasaranaData()
}

// Handle create error
const handleCreateError = (error: string) => {
  console.error('Create error:', error)
}

// Open edit modal
const openEditModal = (item: SaranaPrasaranaData) => {
  selectedItem.value = item
  showEditModal.value = true
}

// Handle successful edit
const handleEditSuccess = async (message: string) => {
  console.log('Edit success:', message)
  // Show toast
  success(
    'Data Berhasil Diperbarui',
    'Perubahan sarana prasarana telah disimpan'
  )
  // Refresh data
  await fetchSaranaPrasaranaData()
}

// Handle edit error
const handleEditError = (error: string) => {
  console.error('Edit error:', error)
}

// Open delete confirmation
const openDeleteConfirm = (item: SaranaPrasaranaData) => {
  selectedItem.value = item
  showDeleteModal.value = true
}

// Confirm delete
const confirmDelete = async () => {
  if (!selectedItem.value) return

  isDeleting.value = true
  try {
    await deleteSaranaPrasarana(selectedItem.value.id)

    // Remove from list
    saranaPrasaranaList.value = saranaPrasaranaList.value.filter(
      (item) => item.id !== selectedItem.value!.id
    )
    total.value--

    showDeleteModal.value = false
    selectedItem.value = null

    // Show success toast
    success(
      'Data Berhasil Dihapus',
      'Sarana prasarana telah dihapus dari sistem'
    )
  } catch (err: any) {
    // Handle 401 Unauthorized - redirect to login
    if (err.status === 401) {
      const { handle401 } = useAuthGuard()
      await handle401()
      return
    }

    error.value =
      err.data?.message ||
      err.message ||
      'Gagal menghapus sarana prasarana'
    console.error('Error deleting sarana prasarana:', err)
  } finally {
    isDeleting.value = false
  }
}

// Format date helper
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Lifecycle
onMounted(() => {
  fetchSaranaPrasaranaData()
})
</script>

<style scoped>
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}
</style>

<template>
  <DashboardLayout>
    <!-- Create Modal -->
    <CreateStrukturOrganisasiModal
      v-model="showCreateModal"
      @success="handleCreateSuccess"
      @error="handleCreateError"
    />

    <!-- Edit Modal -->
    <EditStrukturOrganisasiModal
      v-model="showEditModal"
      :data="selectedData"
      @success="handleEditSuccess"
      @error="handleEditError"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmationDeleteModal
      v-model="showDeleteConfirm"
      title="Hapus Struktur Organisasi"
      :message="`Apakah Anda yakin ingin menghapus struktur organisasi '${selectedData?.nama_non_pegawai || selectedData?.pegawai?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
      :is-loading="isDeleting"
      @confirm="handleDeleteConfirm"
    />

    <!-- Header Section -->
    <div class="mb-6 sm:mb-8">
      <div class="flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
        <div>
          <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Struktur Organisasi
          </h1>
          <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
            Kelola struktur organisasi SDN Sukapura 01
          </p>
        </div>
        <AddButton
          label="Tambah Data"
          iconClass="fa-solid fa-plus"
          @click="openCreateModal"
        />
      </div>
    </div>

    <!-- Main Content -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- Loading State -->
      <div v-if="strukturOrganisasiStore.isLoading" class="flex items-center justify-center py-8 sm:py-12">
        <div class="flex flex-col items-center gap-3 sm:gap-4">
          <div class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
          <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data struktur organisasi...</p>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="strukturOrganisasiStore.error && !hasActiveFilters"
        class="rounded-xl border-2 border-red-200 bg-red-50 p-4 sm:p-6 m-6"
      >
        <div class="flex items-start gap-3 sm:gap-4">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 sm:h-6 sm:w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-base sm:text-lg font-semibold text-red-900">Gagal memuat data</h3>
            <p class="mt-1 text-sm sm:text-base text-red-800">{{ strukturOrganisasiStore.error }}</p>
            <button
              @click="fetchData"
              class="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors"
            >
              <i class="fa-solid fa-rotate-right w-3 h-3 sm:w-4 sm:h-4"></i>
              Coba Lagi
            </button>
          </div>
        </div>
      </div>

      <!-- Success State: Filter & Table Section -->
      <template v-else>
        <!-- Filter Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Data Struktur Organisasi</h3>

          <!-- Filter Form -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Nama Filter -->
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                Nama
              </label>
              <input
                v-model="filters.nama"
                type="text"
                placeholder="Cari nama..."
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>

            <!-- Jabatan Filter -->
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                Jabatan
              </label>
              <input
                v-model="filters.jabatan"
                type="text"
                placeholder="Cari jabatan..."
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>

            <!-- Urutan Filter -->
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                Urutan
              </label>
              <select
                v-model.number="filters.urutan"
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer"
              >
                <option :value="null">Semua Urutan</option>
                <option v-for="i in 10" :key="i" :value="i">{{ i }}</option>
              </select>
            </div>

            <!-- Relasi Filter -->
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                Relasi
              </label>
              <select
                v-model="filters.relasi"
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer"
              >
                <option value="">Semua Relasi</option>
                <option value="Komando">Komando</option>
                <option value="Koordinasi">Koordinasi</option>
              </select>
            </div>

            <!-- Status Filter -->
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                Status
              </label>
              <select
                v-model="filters.status"
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
          <!-- Data Table -->
          <div v-if="strukturOrganisasiStore.strukturOrganisasis.length > 0">
            <Table
              :items="strukturOrganisasiStore.strukturOrganisasis"
              :columns="tableColumns"
              :current-page="pagination.page"
              :current-limit="pagination.limit"
              :total="strukturOrganisasiStore.total"
              :is-loading="strukturOrganisasiStore.isLoading"
              @edit="openEditModal"
              @delete="openDeleteConfirm"
              @pageChange="onPageChange"
              @limitChange="onLimitChange"
            >
              <!-- Custom cell for Nama column -->
              <template #cell-nama="{ item }">
                {{ item.pegawai?.nama || item.nama_non_pegawai || '-' }}
              </template>

              <!-- Custom cell for Jabatan column -->
              <template #cell-jabatan="{ item }">
                {{ item.pegawai?.jabatan || item.jabatan_non_pegawai || '-' }}
              </template>

              <!-- Custom cell for Relasi column -->
              <template #cell-relasi="{ item }">
                <span :class="[
                  'inline-flex items-center rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm md:text-[15px] font-semibold',
                  item.relasi === 'Komando'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                ]">
                  {{ item.relasi }}
                </span>
              </template>

              <!-- Custom cell for Status column -->
              <template #cell-status="{ item }">
                <span :class="[
                  'inline-flex items-center rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm md:text-[15px] font-semibold',
                  item.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                ]">
                  <span :class="[
                    'inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full mr-1 sm:mr-2',
                    item.status === 'active' ? 'bg-green-600' : 'bg-red-600'
                  ]"></span>
                  {{ item.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                </span>
              </template>

              <!-- Custom actions slot -->
              <template #actions="{ item }">
                <div class="flex items-center justify-center gap-1.5 sm:gap-2">
                  <!-- Edit Button -->
                  <EditButton
                    title="Edit"
                    label="Edit"
                    @click="openEditModal(item)"
                  />

                  <!-- Delete Button -->
                  <DeleteButton
                    title="Hapus"
                    label="Hapus"
                    @click="openDeleteConfirm(item)"
                  />
                </div>
              </template>
            </Table>
          </div>

          <!-- Empty State -->
          <div v-else class="flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-6">
            <div class="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 sm:mb-6">
              <i :class="[
                hasActiveFilters ? 'fa-solid fa-magnifying-glass' : 'fa-solid fa-sitemap',
                'text-2xl sm:text-4xl text-gray-400'
              ]"></i>
            </div>
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1">
              {{ hasActiveFilters ? 'Data tidak ditemukan' : 'Belum ada data struktur organisasi' }}
            </h3>
            <p class="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 max-w-sm">
              {{ hasActiveFilters ? 'Data tidak ditemukan dalam pencarian' : 'Mulai dengan menambahkan struktur organisasi baru ke sistem' }}
            </p>
          </div>
        </div>
      </template>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStrukturOrganisasiStore } from '~/stores/StrukturOrganisasiStore'
import { useToastStore } from '~/stores/ToastStore'
import type { StrukturOrganisasi } from '~/types/StrukturOrganisasiType'
import DashboardLayout from '~/components/DashboardLayout.vue'
import CreateStrukturOrganisasiModal from '~/components/modals/CreateStrukturOrganisasiModal.vue'
import EditStrukturOrganisasiModal from '~/components/modals/EditStrukturOrganisasiModal.vue'
import ConfirmationDeleteModal from '~/components/modals/ConfirmationDeleteModal.vue'
import AddButton from '~/components/common/AddButton.vue'
import Table from '~/components/Table.vue'
import EditButton from '~/components/common/EditButton.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const strukturOrganisasiStore = useStrukturOrganisasiStore()
const toastStore = useToastStore()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteConfirm = ref(false)
const isDeleting = ref(false)
const selectedData = ref<StrukturOrganisasi | null>(null)

const filters = ref({
  nama: '',
  jabatan: '',
  urutan: null as number | null,
  relasi: '',
  status: '',
})

const pagination = ref({
  page: 1,
  limit: 10,
})

const tableColumns = [
  { key: 'nama', label: 'Nama', sortable: true },
  { key: 'jabatan', label: 'Jabatan', sortable: true },
  { key: 'urutan', label: 'Urutan', sortable: true },
  { key: 'relasi', label: 'Relasi', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
]

const hasActiveFilters = computed(() => {
  return (
    filters.value.nama !== '' ||
    filters.value.jabatan !== '' ||
    filters.value.urutan !== null ||
    filters.value.relasi !== '' ||
    filters.value.status !== ''
  )
})

const fetchData = async () => {
  try {
    await strukturOrganisasiStore.fetchStrukturOrganisasi({
      search: {
        nama: filters.value.nama || undefined,
        jabatan: filters.value.jabatan || undefined,
        urutan: filters.value.urutan || undefined,
        relasi: filters.value.relasi || undefined,
        status: filters.value.status || undefined,
      },
      pagination: {
        limit: pagination.value.limit,
        page: pagination.value.page,
      },
    })
  } catch (error: any) {
    // Error handling already done in store
  }
}

const applyFilter = () => {
  pagination.value.page = 1
  fetchData()
}

const clearFilter = () => {
  filters.value = {
    nama: '',
    jabatan: '',
    urutan: null,
    relasi: '',
    status: '',
  }
  pagination.value.page = 1
  fetchData()
}

const openCreateModal = () => {
  selectedData.value = null
  showCreateModal.value = true
}

const openEditModal = (item: StrukturOrganisasi) => {
  selectedData.value = item
  showEditModal.value = true
}

const openDeleteConfirm = (item: StrukturOrganisasi) => {
  selectedData.value = item
  showDeleteConfirm.value = true
}

const handleCreateSuccess = async () => {
  showCreateModal.value = false
  await fetchData()
}

const handleCreateError = () => {
  // Error already handled by toast in modal
}

const handleEditSuccess = async () => {
  showEditModal.value = false
  await fetchData()
}

const handleEditError = () => {
  // Error already handled by toast in modal
}

const handleDeleteConfirm = async () => {
  if (!selectedData.value) return

  isDeleting.value = true
  try {
    await strukturOrganisasiStore.deleteItem(selectedData.value.id)
    toastStore.success('Berhasil', 'Struktur organisasi berhasil dihapus')
    showDeleteConfirm.value = false
    await fetchData()
  } catch (error: any) {
    toastStore.error('Gagal', error.message || 'Gagal menghapus struktur organisasi')
  } finally {
    isDeleting.value = false
  }
}

const onPageChange = (page: number) => {
  pagination.value.page = page
  fetchData()
}

const onLimitChange = (limit: number) => {
  pagination.value.limit = limit
  pagination.value.page = 1
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

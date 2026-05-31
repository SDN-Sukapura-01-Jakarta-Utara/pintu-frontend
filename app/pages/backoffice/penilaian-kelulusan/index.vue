<template>
  <DashboardLayout>
    <!-- Create Kelulusan Modal -->
    <CreateKelulusanModal v-model="showCreateModal" @success="handleCreateSuccess" @error="handleCreateError" />

    <!-- View Kelulusan Modal -->
    <ViewKelulusanModal v-model="showViewModal" :kelulusan-id="selectedKelulusanId" />

    <!-- Edit Kelulusan Modal -->
    <EditKelulusanModal v-model="showEditModal" :kelulusan-id="selectedKelulusanId" @success="handleEditSuccess" @error="handleEditError" />

    <!-- Import Kelulusan Modal -->
    <ImportKelulusanModal v-model="showImportModal" @success="handleImportSuccess" />

    <!-- Delete Confirmation Modal -->
    <ConfirmationDeleteModal 
      v-model="showDeleteConfirm" 
      title="Hapus Data Kelulusan"
      :message="`Apakah Anda yakin ingin menghapus data kelulusan '${selectedKelulusan?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
      :is-loading="isDeletingKelulusan" 
      @confirm="handleDeleteConfirm" 
    />

    <!-- Header Section -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Penilaian & Kelulusan</h1>
      <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
        Kelola data kelulusan dan konfigurasi pengumuman
      </p>
    </div>

    <!-- Main Content -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <div class="px-4 sm:px-6">
          <div class="flex gap-1 overflow-x-auto -mb-px" style="scrollbar-width: thin;">
            <button
              @click="activeTab = 'data-kelulusan'"
              :class="[
                'px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 border-b-2 relative cursor-pointer',
                activeTab === 'data-kelulusan'
                  ? 'text-red-600 border-b-red-600'
                  : 'text-gray-600 border-b-transparent hover:text-gray-900 hover:border-b-gray-300'
              ]"
            >
              <span class="flex items-center gap-2">
                <i class="fa-solid fa-graduation-cap w-4 h-4"></i>
                Data Kelulusan
              </span>
            </button>
            <button
              @click="activeTab = 'konfigurasi'"
              :class="[
                'px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 border-b-2 relative cursor-pointer',
                activeTab === 'konfigurasi'
                  ? 'text-red-600 border-b-red-600'
                  : 'text-gray-600 border-b-transparent hover:text-gray-900 hover:border-b-gray-300'
              ]"
            >
              <span class="flex items-center gap-2">
                <i class="fa-solid fa-cog w-4 h-4"></i>
                Konfigurasi Pengumuman
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Content: Data Kelulusan -->
      <div v-if="activeTab === 'data-kelulusan'">
        <!-- Filter Section -->
        <div class="bg-white p-4 sm:p-6 border-b border-gray-200">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Data Kelulusan</h3>

          <!-- Filter Form -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <!-- Nama Filter -->
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                Nama
              </label>
              <input v-model="filters.nama" type="text" placeholder="Cari nama..."
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
            </div>

            <!-- Nomor Peserta Filter -->
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                Nomor Peserta
              </label>
              <input v-model="filters.nomor_peserta" type="text" placeholder="Cari nomor peserta..."
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
            </div>

            <!-- NISN Filter -->
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                NISN
              </label>
              <input v-model="filters.nisn" type="text" placeholder="Cari NISN..."
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
            </div>

            <!-- Status Lulus Filter -->
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                Status Lulus
              </label>
              <select v-model="filters.lulus"
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                <option :value="null">Semua Status</option>
                <option :value="true">Lulus</option>
                <option :value="false">Tidak Lulus</option>
              </select>
            </div>
          </div>

          <!-- Filter Actions -->
          <div class="flex flex-wrap gap-2 sm:gap-3">
            <button @click="applyFilters"
              class="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors duration-200 cursor-pointer">
              <i class="fa-solid fa-search w-3.5 h-3.5 sm:w-4 sm:h-4"></i>
              <span>Cari</span>
            </button>
            <button @click="resetFilters"
              class="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-semibold text-xs sm:text-sm hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
              <i class="fa-solid fa-redo w-3.5 h-3.5 sm:w-4 sm:h-4"></i>
              <span>Reset</span>
            </button>
          </div>
        </div>

        <!-- Table Section -->
        <div class="p-4 sm:p-6">
          <!-- Action Buttons -->
          <div class="flex items-center justify-end gap-2 sm:gap-3 mb-4">
            <button 
              v-if="hasPermission('CREATE_PENILAIAN_KELULUSAN')"
              @click="showImportModal = true"
              class="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border-2 border-green-600 bg-green-600 text-white font-semibold text-xs sm:text-sm hover:bg-green-700 hover:border-green-700 transition-colors duration-200 cursor-pointer">
              <i class="fa-solid fa-file-excel w-3.5 h-3.5 sm:w-4 sm:h-4"></i>
              <span class="hidden sm:inline">Import Data Kelulusan</span>
              <span class="sm:hidden">Import</span>
            </button>
            <AddButton 
              v-if="hasPermission('CREATE_PENILAIAN_KELULUSAN')"
              label="Tambah Data Kelulusan" 
              iconClass="fa-solid fa-plus" 
              @click="openCreateModal" 
            />
          </div>

          <!-- Table Component -->
          <Table 
            :items="dataKelulusan" 
            :columns="tableColumns"
            :total="pagination.total"
            :current-page="pagination.page"
            :current-limit="pagination.limit"
            :is-loading="isLoading"
            @page-change="onPageChange"
            @limit-change="onLimitChange"
          >
            <template #cell-nomor_peserta="{ item }">
              <span class="font-semibold text-gray-900">{{ item.nomor_peserta }}</span>
            </template>

            <template #cell-nisn="{ item }">
              <span class="text-gray-900">{{ item.nisn }}</span>
            </template>

            <template #cell-nama="{ item }">
              <span class="font-semibold text-gray-900">{{ item.nama }}</span>
            </template>

            <template #cell-tanggal_lahir="{ item }">
              <span class="text-gray-600">{{ formatDate(item.tanggal_lahir) }}</span>
            </template>

            <template #cell-rata_rata_nilai="{ item }">
              <div class="flex justify-center">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800">
                  {{ item.rata_rata_nilai.toFixed(2) }}
                </span>
              </div>
            </template>

            <template #cell-lulus="{ item }">
              <div class="flex justify-center">
                <span :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase',
                  item.lulus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]">
                  <i :class="['fa-solid mr-1', item.lulus ? 'fa-check' : 'fa-times']"></i>
                  {{ item.lulus ? 'Lulus' : 'Tidak Lulus' }}
                </span>
              </div>
            </template>

            <template #actions="{ item }">
              <div class="flex items-center justify-center gap-2">
                <ViewButton @click="viewDetail(item)" />
                <EditButton 
                  @click="editData(item)" 
                  :disabled="!hasPermission('UPDATE_PENILAIAN_KELULUSAN')"
                />
                <DeleteButton 
                  @click="confirmDelete(item)" 
                  :disabled="!hasPermission('DELETE_PENILAIAN_KELULUSAN')"
                />
              </div>
            </template>
          </Table>
        </div>
      </div>

      <!-- Tab Content: Konfigurasi Pengumuman -->
      <div v-if="activeTab === 'konfigurasi'" class="p-4 sm:p-6">
        <!-- Loading State -->
        <div v-if="isLoadingConfig" class="flex items-center justify-center py-8 sm:py-12">
          <div class="flex flex-col items-center gap-3 sm:gap-4">
            <div class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
            <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat konfigurasi...</p>
          </div>
        </div>

        <!-- Configuration Form -->
        <form v-else @submit.prevent="handleSubmitConfig" class="space-y-6">
          <!-- Sambutan Kelulusan -->
          <div>
            <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
              Sambutan Kelulusan
              <span class="text-red-600 ml-1">*</span>
            </label>
            <p class="text-xs sm:text-sm text-gray-600 mb-3">
              Masukkan sambutan untuk siswa yang lulus
            </p>
            <div class="overflow-x-auto">
              <RichTextEditor v-model="configForm.sambutan_kelulusan" />
            </div>
          </div>

          <!-- Tanggal Pengumuman Nilai -->
          <div>
            <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
              Tanggal & Waktu Pengumuman Nilai
              <span class="text-red-600 ml-1">*</span>
            </label>
            <p class="text-xs sm:text-sm text-gray-600 mb-3">
              Tentukan kapan pengumuman nilai akan ditampilkan
            </p>
            <input
              v-model="configForm.tanggal_pengumuman_nilai"
              type="datetime-local"
              required
              class="w-full sm:w-auto rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>

          <!-- Tanggal Pengumuman Kelulusan -->
          <div>
            <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
              Tanggal & Waktu Pengumuman Kelulusan
              <span class="text-red-600 ml-1">*</span>
            </label>
            <p class="text-xs sm:text-sm text-gray-600 mb-3">
              Tentukan kapan pengumuman kelulusan akan ditampilkan
            </p>
            <input
              v-model="configForm.tanggal_pengumuman_kelulusan"
              type="datetime-local"
              required
              class="w-full sm:w-auto rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>

          <!-- Nama Kepala Sekolah -->
          <div>
            <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
              Nama Kepala Sekolah
              <span class="text-red-600 ml-1">*</span>
            </label>
            <p class="text-xs sm:text-sm text-gray-600 mb-3">
              Masukkan nama lengkap kepala sekolah
            </p>
            <input
              v-model="configForm.nama_kepsek"
              type="text"
              required
              placeholder="Contoh: Fitriana, M.Pd"
              class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>

          <!-- Foto Kepala Sekolah -->
          <div>
            <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
              Foto Kepala Sekolah
              <span class="text-red-600 ml-1">*</span>
            </label>
            <p class="text-xs sm:text-sm text-gray-600 mb-3">
              Upload foto kepala sekolah (format: JPG, PNG, max 2MB)
            </p>
            
            <!-- Preview existing image -->
            <div v-if="configForm.foto_kepsek_url && !configForm.foto_kepsek" class="mb-3">
              <img :src="configForm.foto_kepsek_url" alt="Foto Kepala Sekolah" class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300">
            </div>
            
            <!-- File input -->
            <input
              type="file"
              accept="image/*"
              @change="handleFotoKepsekChange"
              class="w-full text-sm text-gray-900 border-2 border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:border-red-600 file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
            />
            
            <!-- Preview new image -->
            <div v-if="fotoKepsekPreview" class="mt-3">
              <img :src="fotoKepsekPreview" alt="Preview Foto" class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300">
            </div>
          </div>

          <!-- Tanda Tangan Kepala Sekolah -->
          <div>
            <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
              Tanda Tangan Kepala Sekolah
              <span class="text-red-600 ml-1">*</span>
            </label>
            <p class="text-xs sm:text-sm text-gray-600 mb-3">
              Upload tanda tangan kepala sekolah (format: JPG, PNG, max 2MB)
            </p>
            
            <!-- Preview existing image -->
            <div v-if="configForm.ttd_kepsek_url && !configForm.ttd_kepsek" class="mb-3">
              <img :src="configForm.ttd_kepsek_url" alt="Tanda Tangan Kepala Sekolah" class="w-32 h-32 object-contain rounded-lg border-2 border-gray-300 bg-white p-2">
            </div>
            
            <!-- File input -->
            <input
              type="file"
              accept="image/*"
              @change="handleTtdKepsekChange"
              class="w-full text-sm text-gray-900 border-2 border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:border-red-600 file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
            />
            
            <!-- Preview new image -->
            <div v-if="ttdKepsekPreview" class="mt-3">
              <img :src="ttdKepsekPreview" alt="Preview TTD" class="w-32 h-32 object-contain rounded-lg border-2 border-gray-300 bg-white p-2">
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="resetConfigForm"
              :disabled="isSubmittingConfig || !hasPermission('CREATE_PENILAIAN_KELULUSAN')"
              class="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Reset
            </button>
            <button
              type="submit"
              :disabled="!isConfigFormValid || isSubmittingConfig || !hasPermission('CREATE_PENILAIAN_KELULUSAN')"
              class="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-sm hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              <i v-if="isSubmittingConfig" class="fa-solid fa-spinner fa-spin"></i>
              <span>{{ isSubmittingConfig ? 'Menyimpan...' : 'Simpan Konfigurasi' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getDataKelulusan, deleteKelulusan, getKonfigurasiPengumuman, saveKonfigurasiPengumuman } from '~/services/kelulusan'
import { useToast } from '~/composables/useToast'
import { useAuth } from '~/composables/useAuth'
import DashboardLayout from '~/components/DashboardLayout.vue'
import Table from '~/components/Table.vue'
import AddButton from '~/components/common/AddButton.vue'
import ViewButton from '~/components/common/ViewButton.vue'
import EditButton from '~/components/common/EditButton.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'
import RichTextEditor from '~/components/common/RichTextEditor.vue'
import CreateKelulusanModal from '~/components/modals/CreateKelulusanModal.vue'
import ViewKelulusanModal from '~/components/modals/ViewKelulusanModal.vue'
import EditKelulusanModal from '~/components/modals/EditKelulusanModal.vue'
import ImportKelulusanModal from '~/components/modals/ImportKelulusanModal.vue'
import ConfirmationDeleteModal from '~/components/modals/ConfirmationDeleteModal.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

useHead({
  title: 'Penilaian & Kelulusan | PINTU SDN Sukapura 01',
  link: [
    {
      rel: 'icon',
      type: 'image/jpeg',
      href: '/logo-sekolah.jpg'
    }
  ]
})

const { showToast } = useToast()
const toast = useToast()
const { hasPermission } = useAuth()

// State
const activeTab = ref('data-kelulusan')
const isLoading = ref(false)
const dataKelulusan = ref<any[]>([])
const showCreateModal = ref(false)
const showViewModal = ref(false)
const showEditModal = ref(false)
const showImportModal = ref(false)
const showDeleteConfirm = ref(false)
const selectedKelulusanId = ref(0)
const selectedKelulusan = ref<any>(null)
const isDeletingKelulusan = ref(false)

// Configuration state
const isLoadingConfig = ref(false)
const isSubmittingConfig = ref(false)
const fotoKepsekPreview = ref('')
const ttdKepsekPreview = ref('')
const configForm = ref({
  id: null as number | null,
  sambutan_kelulusan: '',
  tanggal_pengumuman_nilai: '',
  tanggal_pengumuman_kelulusan: '',
  nama_kepsek: '',
  foto_kepsek: null as File | null,
  foto_kepsek_url: '',
  ttd_kepsek: null as File | null,
  ttd_kepsek_url: ''
})
const originalConfigForm = ref({
  id: null as number | null,
  sambutan_kelulusan: '',
  tanggal_pengumuman_nilai: '',
  tanggal_pengumuman_kelulusan: '',
  nama_kepsek: '',
  foto_kepsek: null as File | null,
  foto_kepsek_url: '',
  ttd_kepsek: null as File | null,
  ttd_kepsek_url: ''
})

// Computed
const isConfigFormValid = computed(() => {
  return (
    configForm.value.sambutan_kelulusan.trim() !== '' &&
    configForm.value.tanggal_pengumuman_nilai !== '' &&
    configForm.value.tanggal_pengumuman_kelulusan !== '' &&
    configForm.value.nama_kepsek.trim() !== '' &&
    (configForm.value.foto_kepsek !== null || configForm.value.foto_kepsek_url !== '') &&
    (configForm.value.ttd_kepsek !== null || configForm.value.ttd_kepsek_url !== '')
  )
})

const filters = ref({
  nama: '',
  nomor_peserta: '',
  nisn: '',
  lulus: null as boolean | null
})

const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  total_pages: 0
})

// Table columns definition
const tableColumns = [
  { key: 'nomor_peserta', label: 'Nomor Peserta' },
  { key: 'nisn', label: 'NISN' },
  { key: 'nama', label: 'Nama' },
  { key: 'tanggal_lahir', label: 'Tanggal Lahir' },
  { key: 'rata_rata_nilai', label: 'Rata-rata Nilai', align: 'center' as const },
  { key: 'lulus', label: 'Status', align: 'center' as const }
]

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

const loadData = async () => {
  isLoading.value = true
  try {
    const response = await getDataKelulusan({
      search: {
        nama: filters.value.nama,
        nomor_peserta: filters.value.nomor_peserta,
        nisn: filters.value.nisn,
        lulus: filters.value.lulus
      },
      pagination: {
        limit: pagination.value.limit,
        page: pagination.value.page
      }
    })

    dataKelulusan.value = response.data
    pagination.value.total = response.pagination.total
    pagination.value.total_pages = response.pagination.total_pages
  } catch (error: any) {
    console.error('Error loading data:', error)
    toast.error('Gagal', 'Gagal memuat data')
  } finally {
    isLoading.value = false
  }
}

const applyFilters = () => {
  pagination.value.page = 1
  loadData()
}

const resetFilters = () => {
  filters.value = {
    nama: '',
    nomor_peserta: '',
    nisn: '',
    lulus: null
  }
  pagination.value.page = 1
  loadData()
}

const onPageChange = (page: number) => {
  pagination.value.page = page
  loadData()
}

const onLimitChange = (limit: number) => {
  pagination.value.limit = limit
  pagination.value.page = 1
  loadData()
}

const openCreateModal = () => {
  showCreateModal.value = true
}

const handleCreateSuccess = () => {
  pagination.value.page = 1
  loadData()
}

const handleCreateError = () => {
  // Error already shown via toast
}

const handleImportSuccess = () => {
  pagination.value.page = 1
  loadData()
}

const viewDetail = (item: any) => {
  selectedKelulusanId.value = item.id
  showViewModal.value = true
}

const editData = (item: any) => {
  selectedKelulusanId.value = item.id
  showEditModal.value = true
}

const handleEditSuccess = () => {
  loadData()
}

const handleEditError = () => {
  // Error already shown via toast
}

const confirmDelete = (item: any) => {
  selectedKelulusan.value = item
  showDeleteConfirm.value = true
}

const handleDeleteConfirm = async () => {
  if (!selectedKelulusan.value) return

  isDeletingKelulusan.value = true

  try {
    await deleteKelulusan({ id: selectedKelulusan.value.id })
    toast.success('Berhasil', 'Data kelulusan berhasil dihapus')
    showDeleteConfirm.value = false
    loadData()
  } catch (error: any) {
    console.error('Error deleting data:', error)
    const errorMessage = error?.data?.error || error?.message || 'Gagal menghapus data'
    toast.error('Gagal', errorMessage)
  } finally {
    isDeletingKelulusan.value = false
  }
}

// Configuration methods
const loadConfigData = async () => {
  isLoadingConfig.value = true
  try {
    const response = await getKonfigurasiPengumuman()
    
    if (response && response.data) {
      // Convert datetime from "YYYY-MM-DD HH:mm:ss" to "YYYY-MM-DDTHH:mm" for datetime-local input
      const formatDateTimeForInput = (datetime: string) => {
        if (!datetime) return ''
        return datetime.replace(' ', 'T').substring(0, 16)
      }

      configForm.value = {
        id: response.data.id || null,
        sambutan_kelulusan: response.data.sambutan_kelulusan || '',
        tanggal_pengumuman_nilai: formatDateTimeForInput(response.data.tanggal_pengumuman_nilai || ''),
        tanggal_pengumuman_kelulusan: formatDateTimeForInput(response.data.tanggal_pengumuman_kelulusan || ''),
        nama_kepsek: response.data.nama_kepsek || '',
        foto_kepsek: null,
        foto_kepsek_url: response.data.foto_kepsek || '',
        ttd_kepsek: null,
        ttd_kepsek_url: response.data.ttd_kepsek || ''
      }
      originalConfigForm.value = { ...configForm.value }
    }
  } catch (error: any) {
    console.error('Error loading config:', error)
    // If no data exists, keep form empty
    configForm.value = {
      id: null,
      sambutan_kelulusan: '',
      tanggal_pengumuman_nilai: '',
      tanggal_pengumuman_kelulusan: '',
      nama_kepsek: '',
      foto_kepsek: null,
      foto_kepsek_url: '',
      ttd_kepsek: null,
      ttd_kepsek_url: ''
    }
    originalConfigForm.value = { ...configForm.value }
  } finally {
    isLoadingConfig.value = false
  }
}

const handleSubmitConfig = async () => {
  if (!isConfigFormValid.value) return

  isSubmittingConfig.value = true

  try {
    // Convert datetime from "YYYY-MM-DDTHH:mm" to "YYYY-MM-DD HH:mm:ss" for API
    const formatDateTimeForAPI = (datetime: string) => {
      if (!datetime) return ''
      return datetime.replace('T', ' ') + ':00'
    }

    // Create FormData for file uploads
    const formData = new FormData()
    
    // Create data object
    const dataPayload = {
      id: configForm.value.id,
      sambutan_kelulusan: configForm.value.sambutan_kelulusan,
      tanggal_pengumuman_nilai: formatDateTimeForAPI(configForm.value.tanggal_pengumuman_nilai),
      tanggal_pengumuman_kelulusan: formatDateTimeForAPI(configForm.value.tanggal_pengumuman_kelulusan),
      nama_kepsek: configForm.value.nama_kepsek
    }
    
    // Append data as JSON string
    formData.append('data', JSON.stringify(dataPayload))
    
    // Append files if they exist
    if (configForm.value.foto_kepsek) {
      formData.append('foto_kepsek', configForm.value.foto_kepsek)
    }
    if (configForm.value.ttd_kepsek) {
      formData.append('ttd_kepsek', configForm.value.ttd_kepsek)
    }

    await saveKonfigurasiPengumuman(formData)
    toast.success('Berhasil', 'Konfigurasi pengumuman berhasil disimpan')
    
    // Reload config data to get updated ID if it was null
    await loadConfigData()
  } catch (error: any) {
    console.error('Error saving config:', error)
    const errorMessage = error?.data?.error || error?.message || 'Gagal menyimpan konfigurasi'
    toast.error('Gagal', errorMessage)
  } finally {
    isSubmittingConfig.value = false
  }
}

const resetConfigForm = () => {
  configForm.value = { ...originalConfigForm.value }
  fotoKepsekPreview.value = ''
  ttdKepsekPreview.value = ''
}

// File upload handlers
const handleFotoKepsekChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Gagal', 'Ukuran file maksimal 2MB')
      target.value = ''
      return
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Gagal', 'File harus berupa gambar')
      target.value = ''
      return
    }
    
    configForm.value.foto_kepsek = file
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      fotoKepsekPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleTtdKepsekChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Gagal', 'Ukuran file maksimal 2MB')
      target.value = ''
      return
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Gagal', 'File harus berupa gambar')
      target.value = ''
      return
    }
    
    configForm.value.ttd_kepsek = file
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      ttdKepsekPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

onMounted(() => {
  loadData()
  loadConfigData()
})
</script>

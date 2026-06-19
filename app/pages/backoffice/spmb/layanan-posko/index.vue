<template>
  <DashboardLayout>
    <!-- Delete Confirmation Modal -->
    <ConfirmationDeleteModal 
      v-model="showDeleteConfirm" 
      title="Hapus Ajuan Pelayanan"
      :message="`Apakah Anda yakin ingin menghapus ajuan dari '${selectedItem?.nama_orang_tua}'? Tindakan ini tidak dapat dibatalkan.`"
      :is-loading="isDeleting" 
      @confirm="handleDeleteConfirm" 
    />

    <!-- Selesai Confirmation Modal -->
    <ConfirmationSelesaiModal
      v-model="showSelesaiConfirm"
      title="Tandai Selesai"
      :message="`Apakah Anda yakin ingin menandai ajuan dari '${selectedItem?.nama_orang_tua}' sebagai selesai?`"
      :is-loading="isUpdatingStatus"
      @confirm="handleSelesaiConfirm"
    />

    <!-- Detail Modal -->
    <LayananSpmbDetailModal
      v-model="showDetailModal"
      :item-id="selectedItemId"
    />

    <!-- Header Section -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Layanan Posko SPMB</h1>
      <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
        Kelola ajuan pelayanan Sistem Penerimaan Murid Baru
      </p>
    </div>

    <!-- Main Content -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <div class="px-4 sm:px-6">
          <div class="flex gap-1 overflow-x-auto -mb-px" style="scrollbar-width: thin;">
            <button
              @click="activeTab = 'ajuan'"
              :class="[
                'px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 border-b-2 relative cursor-pointer',
                activeTab === 'ajuan'
                  ? 'text-red-600 border-b-red-600'
                  : 'text-gray-600 border-b-transparent hover:text-gray-900 hover:border-b-gray-300'
              ]"
            >
              <span class="flex items-center gap-2">
                <i class="fa-solid fa-clipboard-list w-4 h-4"></i>
                Ajuan Pelayanan
              </span>
            </button>
            <button
              @click="activeTab = 'setting'"
              :class="[
                'px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 border-b-2 relative cursor-pointer',
                activeTab === 'setting'
                  ? 'text-red-600 border-b-red-600'
                  : 'text-gray-600 border-b-transparent hover:text-gray-900 hover:border-b-gray-300'
              ]"
            >
              <span class="flex items-center gap-2">
                <i class="fa-solid fa-cog w-4 h-4"></i>
                Setting Pelayanan SPMB
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Content: Ajuan Pelayanan -->
      <div v-if="activeTab === 'ajuan'">
        <!-- Filter Section -->
        <div class="bg-white p-4 sm:p-6 border-b border-gray-200">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Ajuan Pelayanan</h3>

          <!-- Filter Form -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <!-- Start Date Filter -->
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                Tanggal Mulai
              </label>
              <input v-model="filters.start_date" type="date"
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
            </div>

            <!-- End Date Filter -->
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                Tanggal Akhir
              </label>
              <input v-model="filters.end_date" type="date"
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
            </div>

            <!-- Nama Orang Tua Filter -->
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                Nama Orang Tua
              </label>
              <input v-model="filters.nama_orang_tua" type="text" placeholder="Cari nama orang tua..."
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
            </div>

            <!-- Nama Murid Filter -->
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                Nama Calon Murid Baru
              </label>
              <input v-model="filters.nama_murid" type="text" placeholder="Cari nama murid..."
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
            </div>

            <!-- Status Filter -->
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                Status
              </label>
              <select v-model="filters.status"
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                <option value="">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="selesai">Selesai</option>
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
          <!-- Table Component -->
          <Table 
            :items="dataList" 
            :columns="tableColumns"
            :total="pagination.total"
            :current-page="pagination.page"
            :current-limit="pagination.limit"
            :is-loading="isLoading"
            @page-change="onPageChange"
            @limit-change="onLimitChange"
          >
            <template #cell-nama_orang_tua="{ item }">
              <span class="font-semibold text-gray-900">{{ item.nama_orang_tua }}</span>
            </template>

            <template #cell-nomor_telepon="{ item }">
              <span class="text-gray-900">{{ item.nomor_telepon }}</span>
            </template>

            <template #cell-nama_lengkap_murid="{ item }">
              <span class="font-semibold text-gray-900">{{ item.nama_lengkap_murid }}</span>
            </template>

            <template #cell-tanggal_laporan="{ item }">
              <span class="text-gray-600">{{ formatDate(item.tanggal_laporan) }}</span>
            </template>

            <template #cell-status="{ item }">
              <div class="flex justify-center">
                <span :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase',
                  item.status === 'selesai' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                ]">
                  <i :class="['fa-solid mr-1', item.status === 'selesai' ? 'fa-check' : 'fa-clock']"></i>
                  {{ item.status === 'selesai' ? 'Selesai' : 'Pending' }}
                </span>
              </div>
            </template>

            <template #actions="{ item }">
              <div class="flex items-center justify-center gap-2">
                <button
                  v-if="item.status === 'pending'"
                  @click="markAsSelesai(item)"
                  title="Tandai Selesai"
                  class="inline-flex items-center justify-center gap-1.5 px-3 sm:px-2.5 py-2 sm:pt-2.5 sm:pb-1.5 rounded-lg bg-gradient-to-br from-green-50 to-emerald-100 text-green-700 font-semibold text-xs border border-green-200 shadow-sm hover:shadow-md hover:from-green-100 hover:to-emerald-200 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <i class="fa-solid fa-check w-3.5 h-3.5 sm:w-5 sm:h-5"></i>
                </button>
                <ViewButton @click="viewDetail(item)" />
                <DeleteButton @click="confirmDelete(item)" />
              </div>
            </template>
          </Table>
        </div>
      </div>

      <!-- Tab Content: Setting -->
      <div v-if="activeTab === 'setting'" class="p-4 sm:p-6">
        <!-- Loading State -->
        <div v-if="isLoadingConfig" class="flex items-center justify-center py-8 sm:py-12">
          <div class="flex flex-col items-center gap-3 sm:gap-4">
            <div class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
            <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat konfigurasi...</p>
          </div>
        </div>

        <!-- Setting Form -->
        <form v-else @submit.prevent="handleSubmitSetting" class="space-y-6">
          <!-- Nama Kepala Sekolah -->
          <div>
            <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
              Nama Kepala Sekolah
              <span class="text-red-600 ml-1">*</span>
            </label>
            <p class="text-xs sm:text-sm text-gray-600 mb-3">
              Masukkan nama lengkap kepala sekolah beserta gelar
            </p>
            <input
              v-model="settingForm.nama_kepala_sekolah"
              type="text"
              required
              placeholder="Contoh: Dr. Ahmad Suryadi, S.Pd., M.Pd."
              class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>

          <!-- NIP Kepala Sekolah -->
          <div>
            <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
              NIP Kepala Sekolah
              <span class="text-red-600 ml-1">*</span>
            </label>
            <p class="text-xs sm:text-sm text-gray-600 mb-3">
              Masukkan Nomor Induk Pegawai kepala sekolah
            </p>
            <input
              v-model="settingForm.nip_kepala_sekolah"
              type="text"
              required
              placeholder="Contoh: 196501011986031001"
              class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>

          <!-- Nama Ketua Panitia SPMB -->
          <div>
            <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
              Nama Ketua Panitia SPMB
              <span class="text-red-600 ml-1">*</span>
            </label>
            <p class="text-xs sm:text-sm text-gray-600 mb-3">
              Masukkan nama lengkap ketua panitia SPMB beserta gelar
            </p>
            <input
              v-model="settingForm.nama_ketua_panitia"
              type="text"
              required
              placeholder="Contoh: Siti Nurhaliza, S.Pd."
              class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>

          <!-- NIP Ketua Panitia SPMB -->
          <div>
            <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
              NIP Ketua Panitia SPMB
              <span class="text-red-600 ml-1">*</span>
            </label>
            <p class="text-xs sm:text-sm text-gray-600 mb-3">
              Masukkan Nomor Induk Pegawai ketua panitia SPMB
            </p>
            <input
              v-model="settingForm.nip_ketua_panitia"
              type="text"
              required
              placeholder="Contoh: 197802152005012002"
              class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>

          <!-- Link Grup WhatsApp -->
          <div>
            <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
              Link Grup WhatsApp SPMB
              <span class="text-red-600 ml-1">*</span>
            </label>
            <p class="text-xs sm:text-sm text-gray-600 mb-3">
              Masukkan link grup WhatsApp untuk informasi SPMB
            </p>
            <input
              v-model="settingForm.grup_wa"
              type="url"
              required
              placeholder="Contoh: https://chat.whatsapp.com/ESimVY57WyrIrnj1DNkyBv"
              class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="resetSettingForm"
              :disabled="isSubmittingConfig"
              class="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Reset
            </button>
            <button
              type="submit"
              :disabled="!isSettingFormValid || isSubmittingConfig"
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
import { useToast } from '~/composables/useToast'
import { getLayananSpmb, setStatusSelesai, deleteLayananSpmb, getSettingLayananSpmb, saveSettingLayananSpmb } from '~/services/layanan-spmb'
import DashboardLayout from '~/components/DashboardLayout.vue'
import Table from '~/components/Table.vue'
import ViewButton from '~/components/common/ViewButton.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'
import ConfirmationDeleteModal from '~/components/modals/ConfirmationDeleteModal.vue'
import ConfirmationSelesaiModal from '~/components/modals/ConfirmationSelesaiModal.vue'
import LayananSpmbDetailModal from '~/components/modals/LayananSpmbDetailModal.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

useHead({
  title: 'Layanan Posko SPMB | PINTU SDN Sukapura 01',
  meta: [
    { name: 'description', content: 'Dashboard Layanan Posko SPMB SDN Sukapura 01' }
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/jpeg',
      href: '/logo-sekolah.jpg'
    }
  ]
})

const toast = useToast()

// State
const activeTab = ref('ajuan')
const isLoading = ref(false)
const dataList = ref<any[]>([])
const showDeleteConfirm = ref(false)
const showSelesaiConfirm = ref(false)
const selectedItem = ref<any>(null)
const isDeleting = ref(false)
const isUpdatingStatus = ref(false)
const showDetailModal = ref(false)
const selectedItemId = ref<number | null>(null)

// Setting state
const isLoadingConfig = ref(false)
const isSubmittingConfig = ref(false)
const settingForm = ref({
  nama_kepala_sekolah: '',
  nip_kepala_sekolah: '',
  nama_ketua_panitia: '',
  nip_ketua_panitia: '',
  grup_wa: ''
})
const originalSettingForm = ref({
  nama_kepala_sekolah: '',
  nip_kepala_sekolah: '',
  nama_ketua_panitia: '',
  nip_ketua_panitia: '',
  grup_wa: ''
})

// Computed
const isSettingFormValid = computed(() => {
  return (
    settingForm.value.nama_kepala_sekolah.trim() !== '' &&
    settingForm.value.nip_kepala_sekolah.trim() !== '' &&
    settingForm.value.nama_ketua_panitia.trim() !== '' &&
    settingForm.value.nip_ketua_panitia.trim() !== '' &&
    settingForm.value.grup_wa.trim() !== ''
  )
})

const filters = ref({
  start_date: '',
  end_date: '',
  nama_orang_tua: '',
  nama_murid: '',
  status: ''
})

const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  total_pages: 0
})

// Table columns definition
const tableColumns = [
  { key: 'nama_orang_tua', label: 'Nama Orang Tua' },
  { key: 'nomor_telepon', label: 'Nomor Telepon' },
  { key: 'nama_lengkap_murid', label: 'Nama Calon Murid Baru' },
  { key: 'tanggal_laporan', label: 'Tanggal Laporan' },
  { key: 'status', label: 'Status', align: 'center' as const }
]

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadData = async () => {
  isLoading.value = true
  try {
    const response = await getLayananSpmb({
      search: {
        start_date: filters.value.start_date || undefined,
        end_date: filters.value.end_date || undefined,
        nama_orang_tua: filters.value.nama_orang_tua || undefined,
        nama_murid: filters.value.nama_murid || undefined,
        status: filters.value.status || undefined
      },
      pagination: {
        limit: pagination.value.limit,
        page: pagination.value.page
      }
    })

    dataList.value = response.data || []
    pagination.value.total = response.pagination?.total || 0
    pagination.value.total_pages = response.pagination?.total_pages || 0
  } catch (error: any) {
    console.error('Error loading data:', error)
    // Jangan tampilkan toast jika error 401 (sudah di-handle oleh plugin)
    if (error?.status !== 401 && error?.response?.status !== 401) {
      dataList.value = []
      toast.error('Gagal', 'Gagal memuat data ajuan pelayanan')
    }
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
    start_date: '',
    end_date: '',
    nama_orang_tua: '',
    nama_murid: '',
    status: ''
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

const markAsSelesai = (item: any) => {
  selectedItem.value = item
  showSelesaiConfirm.value = true
}

const handleSelesaiConfirm = async () => {
  if (!selectedItem.value) return

  isUpdatingStatus.value = true

  try {
    await setStatusSelesai({
      id: selectedItem.value.id,
      status: 'selesai'
    })
    
    toast.success('Berhasil', 'Ajuan berhasil ditandai selesai')
    showSelesaiConfirm.value = false
    loadData()
  } catch (error: any) {
    console.error('Error updating status:', error)
    // Jangan tampilkan toast jika error 401 (sudah di-handle oleh plugin)
    if (error?.status !== 401 && error?.response?.status !== 401) {
      const errorMessage = error?.data?.error || error?.message || 'Gagal mengubah status'
      toast.error('Gagal', errorMessage)
    }
  } finally {
    isUpdatingStatus.value = false
  }
}

const confirmDelete = (item: any) => {
  selectedItem.value = item
  showDeleteConfirm.value = true
}

const viewDetail = (item: any) => {
  selectedItemId.value = item.id
  showDetailModal.value = true
}

const handleDeleteConfirm = async () => {
  if (!selectedItem.value) return

  isDeleting.value = true

  try {
    await deleteLayananSpmb({ id: selectedItem.value.id })
    
    toast.success('Berhasil', 'Ajuan pelayanan berhasil dihapus')
    showDeleteConfirm.value = false
    loadData()
  } catch (error: any) {
    console.error('Error deleting data:', error)
    // Jangan tampilkan toast jika error 401 (sudah di-handle oleh plugin)
    if (error?.status !== 401 && error?.response?.status !== 401) {
      const errorMessage = error?.data?.error || error?.message || 'Gagal menghapus ajuan pelayanan'
      toast.error('Gagal', errorMessage)
    }
  } finally {
    isDeleting.value = false
  }
}

// Initialize
onMounted(() => {
  loadData()
  loadSettingData()
})

// Setting methods
const loadSettingData = async () => {
  isLoadingConfig.value = true
  try {
    const response = await getSettingLayananSpmb()
    
    if (response && response.data) {
      settingForm.value = {
        nama_kepala_sekolah: response.data.nama_kepala_sekolah || '',
        nip_kepala_sekolah: response.data.nip_kepala_sekolah || '',
        nama_ketua_panitia: response.data.nama_ketua_panitia || '',
        nip_ketua_panitia: response.data.nip_ketua_panitia || '',
        grup_wa: response.data.grup_wa || ''
      }
      originalSettingForm.value = { ...settingForm.value }
    }
  } catch (error: any) {
    console.error('Error loading setting:', error)
    // If no data exists, keep form empty
    settingForm.value = {
      nama_kepala_sekolah: '',
      nip_kepala_sekolah: '',
      nama_ketua_panitia: '',
      nip_ketua_panitia: '',
      grup_wa: ''
    }
    originalSettingForm.value = { ...settingForm.value }
  } finally {
    isLoadingConfig.value = false
  }
}

const handleSubmitSetting = async () => {
  if (!isSettingFormValid.value) return

  isSubmittingConfig.value = true

  try {
    await saveSettingLayananSpmb({
      nama_kepala_sekolah: settingForm.value.nama_kepala_sekolah,
      nip_kepala_sekolah: settingForm.value.nip_kepala_sekolah,
      nama_ketua_panitia: settingForm.value.nama_ketua_panitia,
      nip_ketua_panitia: settingForm.value.nip_ketua_panitia,
      grup_wa: settingForm.value.grup_wa
    })
    
    toast.success('Berhasil', 'Konfigurasi pelayanan SPMB berhasil disimpan')
    
    // Reload setting data
    await loadSettingData()
  } catch (error: any) {
    console.error('Error saving setting:', error)
    // Jangan tampilkan toast jika error 401 (sudah di-handle oleh plugin)
    if (error?.status !== 401 && error?.response?.status !== 401) {
      const errorMessage = error?.data?.error || error?.message || 'Gagal menyimpan konfigurasi'
      toast.error('Gagal', errorMessage)
    }
  } finally {
    isSubmittingConfig.value = false
  }
}

const resetSettingForm = () => {
  settingForm.value = { ...originalSettingForm.value }
}
</script>

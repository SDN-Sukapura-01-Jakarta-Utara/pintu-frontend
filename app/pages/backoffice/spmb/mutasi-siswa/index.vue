<template>
  <DashboardLayout>
    <!-- Detail Modal -->
    <MutasiSiswaDetailModal
      v-model="showDetailModal"
      :item-id="selectedItemId"
    />

    <!-- Edit Modal -->
    <EditMutasiSiswaModal
      v-model="showEditModal"
      :mutasi-id="selectedItemId"
      @success="handleEditSuccess"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmationDeleteModal
      v-model="showDeleteConfirm"
      title="Hapus Data CMB"
      :message="`Apakah Anda yakin ingin menghapus data CMB '${selectedItem?.nama_lengkap}'? Tindakan ini tidak dapat dibatalkan.`"
      :is-loading="isDeleting"
      @confirm="handleDeleteConfirm"
    />

    <!-- Header Section -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Mutasi Siswa</h1>
      <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
        Kelola data CMB dan konfigurasi mutasi siswa
      </p>
    </div>

    <!-- Main Content -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <div class="px-4 sm:px-6">
          <div class="flex gap-1 overflow-x-auto -mb-px" style="scrollbar-width: thin;">
            <button
              @click="activeTab = 'data-cmb'"
              :class="[
                'px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 border-b-2 relative cursor-pointer',
                activeTab === 'data-cmb'
                  ? 'text-red-600 border-b-red-600'
                  : 'text-gray-600 border-b-transparent hover:text-gray-900 hover:border-b-gray-300'
              ]"
            >
              <span class="flex items-center gap-2">
                <i class="fa-solid fa-database w-4 h-4"></i>
                Data CMB
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
                Konfigurasi Mutasi Siswa
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Content: Data CMB -->
      <div v-if="activeTab === 'data-cmb'">
        <!-- Filter Section -->
        <div class="bg-white p-4 sm:p-6 border-b border-gray-200">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Data CMB</h3>

          <!-- Filter Form -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <!-- Tahun Pelajaran Filter -->
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                Tahun Pelajaran
              </label>
              <select
                v-model.number="filters.tahun_pelajaran_id"
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer"
              >
                <option v-for="tahun in tahunPelajaranList" :key="tahun.id" :value="tahun.id">
                  {{ tahun.tahun_pelajaran }}
                </option>
              </select>
            </div>

            <!-- Semester Filter -->
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                Semester
              </label>
              <select
                v-model.number="filters.semester"
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer"
              >
                <option :value="1">Semester 1</option>
                <option :value="2">Semester 2</option>
              </select>
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

            <!-- Nama Siswa Filter -->
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                Nama Siswa
              </label>
              <input
                v-model="filters.nama_siswa"
                type="text"
                placeholder="Cari nama siswa..."
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>

            <!-- NISN Filter -->
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                NISN
              </label>
              <input
                v-model="filters.nisn"
                type="text"
                placeholder="Cari NISN..."
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>

            <!-- Tempat Lahir Filter -->
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                Tempat Lahir
              </label>
              <input
                v-model="filters.tempat_lahir"
                type="text"
                placeholder="Cari tempat lahir..."
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>
          </div>

          <!-- Filter Actions -->
          <div class="flex flex-wrap gap-2 sm:gap-3">
            <button
              @click="applyFilters"
              class="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors duration-200 cursor-pointer"
            >
              <i class="fa-solid fa-search w-3.5 h-3.5 sm:w-4 sm:h-4"></i>
              <span>Cari</span>
            </button>
            <button
              @click="resetFilters"
              class="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-semibold text-xs sm:text-sm hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            >
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
            <template #cell-tahun_pelajaran="{ item }">
              <span class="text-gray-900">{{ item.tahun_pelajaran?.tahun_pelajaran || '-' }}</span>
            </template>

            <template #cell-semester="{ item }">
              <span class="text-gray-900">Semester {{ item.semester }}</span>
            </template>

            <template #cell-nomor_pendaftaran="{ item }">
              <span class="font-semibold text-gray-900">{{ item.nomor_pendaftaran }}</span>
            </template>

            <template #cell-created_at="{ item }">
              <span class="text-gray-600">{{ formatDate(item.created_at) }}</span>
            </template>

            <template #cell-nama_lengkap="{ item }">
              <span class="font-semibold text-gray-900">{{ item.nama_lengkap }}</span>
            </template>

            <template #cell-nisn="{ item }">
              <span class="text-gray-900">{{ item.nisn }}</span>
            </template>

            <template #cell-tempat_lahir="{ item }">
              <span class="text-gray-900">{{ item.tempat_lahir }}</span>
            </template>

            <template #cell-tanggal_lahir="{ item }">
              <span class="text-gray-600">{{ formatDate(item.tanggal_lahir) }}</span>
            </template>

            <template #cell-jenis_kelamin="{ item }">
              <span class="text-gray-900">{{ item.jenis_kelamin }}</span>
            </template>

            <template #cell-agama="{ item }">
              <span class="text-gray-900">{{ item.agama }}</span>
            </template>

            <template #cell-pindahan_kelas="{ item }">
              <span class="text-gray-900">Kelas {{ item.pindahan_kelas }}</span>
            </template>

            <template #actions="{ item }">
              <div class="flex items-center justify-center gap-2">
                <button
                  @click="viewDetail(item)"
                  title="Lihat Detail"
                  class="inline-flex items-center justify-center gap-1.5 px-3 sm:px-2.5 py-2 sm:pt-2.5 sm:pb-1.5 rounded-lg bg-gradient-to-br from-blue-50 to-sky-100 text-blue-700 font-semibold text-xs border border-blue-200 shadow-sm hover:shadow-md hover:from-blue-100 hover:to-sky-200 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <i class="fa-solid fa-eye w-3.5 h-3.5 sm:w-5 sm:h-5"></i>
                </button>
                <button
                  v-if="hasPermission('UPDATE_SPMB')"
                  @click="editItem(item)"
                  title="Edit"
                  class="inline-flex items-center justify-center gap-1.5 px-3 sm:px-2.5 py-2 sm:pt-2.5 sm:pb-1.5 rounded-lg bg-gradient-to-br from-orange-50 to-amber-100 text-orange-700 font-semibold text-xs border border-orange-200 shadow-sm hover:shadow-md hover:from-orange-100 hover:to-amber-200 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <i class="fa-solid fa-edit w-3.5 h-3.5 sm:w-5 sm:h-5"></i>
                </button>
                <button
                  @click="downloadPdf(item)"
                  title="Download PDF"
                  class="inline-flex items-center justify-center gap-1.5 px-3 sm:px-2.5 py-2 sm:pt-2.5 sm:pb-1.5 rounded-lg bg-gradient-to-br from-green-50 to-emerald-100 text-green-700 font-semibold text-xs border border-green-200 shadow-sm hover:shadow-md hover:from-green-100 hover:to-emerald-200 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <i class="fa-solid fa-download w-3.5 h-3.5 sm:w-5 sm:h-5"></i>
                </button>
                <button
                  v-if="hasPermission('DELETE_SPMB')"
                  @click="confirmDelete(item)"
                  title="Hapus"
                  class="inline-flex items-center justify-center gap-1.5 px-3 sm:px-2.5 py-2 sm:pt-2.5 sm:pb-1.5 rounded-lg bg-gradient-to-br from-red-50 to-rose-100 text-red-700 font-semibold text-xs border border-red-200 shadow-sm hover:shadow-md hover:from-red-100 hover:to-rose-200 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <i class="fa-solid fa-trash w-3.5 h-3.5 sm:w-5 sm:h-5"></i>
                </button>
              </div>
            </template>
          </Table>
        </div>
      </div>

      <!-- Tab Content: Konfigurasi -->
      <div v-if="activeTab === 'konfigurasi'" class="p-4 sm:p-6">
        <!-- Loading State -->
        <div v-if="isLoadingConfig" class="flex items-center justify-center py-8 sm:py-12">
          <div class="flex flex-col items-center gap-3 sm:gap-4">
            <div class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
            <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat konfigurasi...</p>
          </div>
        </div>

        <!-- Setting Form -->
        <form v-else @submit.prevent="handleSubmitSetting" class="space-y-6">
          <!-- Tanggal Buka Pendaftaran -->
          <div>
            <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
              Tanggal Buka Pendaftaran
              <span class="text-red-600 ml-1">*</span>
            </label>
            <p class="text-xs sm:text-sm text-gray-600 mb-3">
              Tentukan tanggal pembukaan pendaftaran mutasi siswa
            </p>
            <input
              v-model="settingForm.tanggal_buka_pendaftaran"
              type="date"
              required
              class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>

          <!-- Tanggal Tutup Pendaftaran -->
          <div>
            <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
              Tanggal Tutup Pendaftaran
              <span class="text-red-600 ml-1">*</span>
            </label>
            <p class="text-xs sm:text-sm text-gray-600 mb-3">
              Tentukan tanggal penutupan pendaftaran mutasi siswa
            </p>
            <input
              v-model="settingForm.tanggal_tutup_pendaftaran"
              type="date"
              required
              class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>

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

          <!-- Nama Ketua Panitia -->
          <div>
            <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
              Nama Ketua Panitia
              <span class="text-red-600 ml-1">*</span>
            </label>
            <p class="text-xs sm:text-sm text-gray-600 mb-3">
              Masukkan nama lengkap ketua panitia mutasi siswa beserta gelar
            </p>
            <input
              v-model="settingForm.nama_ketua_panitia"
              type="text"
              required
              placeholder="Contoh: Siti Nurhaliza, S.Pd."
              class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>

          <!-- NIP Ketua Panitia -->
          <div>
            <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
              NIP Ketua Panitia
              <span class="text-red-600 ml-1">*</span>
            </label>
            <p class="text-xs sm:text-sm text-gray-600 mb-3">
              Masukkan Nomor Induk Pegawai ketua panitia mutasi siswa
            </p>
            <input
              v-model="settingForm.nip_ketua_panitia"
              type="text"
              required
              placeholder="Contoh: 197802152005012002"
              class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>

          <!-- Upload Template SPTJM -->
          <div>
            <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
              Template SPTJM
              <span class="text-red-600 ml-1">*</span>
            </label>
            <p class="text-xs sm:text-sm text-gray-600 mb-3">
              Upload template SPTJM untuk mutasi siswa (Format: .doc, .docx, .pdf)
            </p>
            
            <!-- Show existing file if available -->
            <div v-if="settingForm.template_sptjm && !newTemplateFile" class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <i class="fa-solid fa-file-alt text-blue-600"></i>
                  <span class="text-sm text-blue-900 font-medium">Dokumen Template SPTJM</span>
                </div>
                <div class="flex items-center gap-2">
                  <a
                    :href="settingForm.template_sptjm"
                    target="_blank"
                    class="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <i class="fa-solid fa-download mr-1"></i>
                    Download
                  </a>
                  <button
                    type="button"
                    @click="removeExistingTemplate"
                    class="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    <i class="fa-solid fa-trash mr-1"></i>
                    Hapus
                  </button>
                </div>
              </div>
            </div>

            <!-- File input -->
            <input
              ref="templateFileInput"
              type="file"
              accept=".doc,.docx,.pdf"
              @change="handleTemplateFileChange"
              class="hidden"
            />
            
            <div v-if="!settingForm.template_sptjm || newTemplateFile">
              <button
                type="button"
                @click="triggerTemplateFileInput"
                class="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-600 transition-colors text-center cursor-pointer"
              >
                <i class="fa-solid fa-upload text-gray-400 text-2xl mb-2"></i>
                <p class="text-sm font-medium text-gray-700">
                  {{ newTemplateFile ? newTemplateFile.name : 'Klik untuk upload template SPTJM' }}
                </p>
                <p class="text-xs text-gray-500 mt-1">Format: .doc, .docx, .pdf (Maks. 5MB)</p>
              </button>
              
              <button
                v-if="newTemplateFile"
                type="button"
                @click="removeNewTemplate"
                class="mt-2 text-xs text-red-600 hover:text-red-700 cursor-pointer"
              >
                <i class="fa-solid fa-times mr-1"></i>
                Batalkan upload
              </button>
            </div>
          </div>

          <!-- Link Grup WhatsApp -->
          <div>
            <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
              Link Grup WhatsApp
              <span class="text-red-600 ml-1">*</span>
            </label>
            <p class="text-xs sm:text-sm text-gray-600 mb-3">
              Masukkan link grup WhatsApp untuk informasi mutasi siswa
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
              v-if="hasPermission('UPDATE_SPMB')"
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
import { useAuth } from '~/composables/useAuth'
import { getMutasiSiswa, deleteMutasiSiswa, getKonfigurasiMutasiSiswa, saveKonfigurasiMutasiSiswa, downloadPdfMutasiSiswa } from '~/services/mutasi-siswa'
import { getTahunPelajaranList } from '~/services/tahun-pelajaran'
import DashboardLayout from '~/components/DashboardLayout.vue'
import Table from '~/components/Table.vue'
import MutasiSiswaDetailModal from '~/components/modals/MutasiSiswaDetailModal.vue'
import EditMutasiSiswaModal from '~/components/modals/EditMutasiSiswaModal.vue'
import ConfirmationDeleteModal from '~/components/modals/ConfirmationDeleteModal.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

useHead({
  title: 'Mutasi Siswa | PINTU SDN Sukapura 01',
  meta: [
    { name: 'description', content: 'Dashboard Mutasi Siswa SDN Sukapura 01' }
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
const { hasPermission } = useAuth()

// State
const activeTab = ref('data-cmb')
const isLoading = ref(false)
const dataList = ref<any[]>([])
const tahunPelajaranList = ref<any[]>([])

// Modal state
const showDetailModal = ref(false)
const showEditModal = ref(false)
const showDeleteConfirm = ref(false)
const selectedItemId = ref<number | null>(null)
const selectedItem = ref<any>(null)
const isDeleting = ref(false)

// Pagination
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  total_pages: 0
})

// Get current semester based on current month
const getCurrentSemester = () => {
  const currentMonth = new Date().getMonth() + 1 // 1-12
  return currentMonth >= 7 && currentMonth <= 12 ? 1 : 2
}

// Filters
const filters = ref({
  tahun_pelajaran_id: 0,
  semester: getCurrentSemester(),
  start_date: '',
  end_date: '',
  nama_siswa: '',
  nisn: '',
  tempat_lahir: ''
})

// Setting state
const isLoadingConfig = ref(false)
const isSubmittingConfig = ref(false)
const settingForm = ref<any>({
  tanggal_buka_pendaftaran: '',
  tanggal_tutup_pendaftaran: '',
  nama_kepala_sekolah: '',
  nip_kepala_sekolah: '',
  nama_ketua_panitia: '',
  nip_ketua_panitia: '',
  template_sptjm: '',
  grup_wa: ''
})
const newTemplateFile = ref<File | null>(null)
const templateFileInput = ref<HTMLInputElement | null>(null)

// Computed property for form validation
const isSettingFormValid = computed(() => {
  return (
    settingForm.value.tanggal_buka_pendaftaran &&
    settingForm.value.tanggal_tutup_pendaftaran &&
    settingForm.value.nama_kepala_sekolah &&
    settingForm.value.nip_kepala_sekolah &&
    settingForm.value.nama_ketua_panitia &&
    settingForm.value.nip_ketua_panitia &&
    settingForm.value.grup_wa &&
    (settingForm.value.template_sptjm || newTemplateFile.value)
  )
})

// Table columns
const tableColumns = [
  { key: 'tahun_pelajaran', label: 'Tahun Pelajaran', sortable: false },
  { key: 'semester', label: 'Semester', sortable: false },
  { key: 'nomor_pendaftaran', label: 'No Pendaftaran', sortable: false },
  { key: 'created_at', label: 'Tanggal Pengajuan', sortable: false },
  { key: 'nama_lengkap', label: 'Nama Siswa', sortable: false },
  { key: 'nisn', label: 'NISN', sortable: false },
  { key: 'tempat_lahir', label: 'Tempat Lahir', sortable: false },
  { key: 'tanggal_lahir', label: 'Tanggal Lahir', sortable: false },
  { key: 'jenis_kelamin', label: 'Jenis Kelamin', sortable: false },
  { key: 'agama', label: 'Agama', sortable: false },
  { key: 'pindahan_kelas', label: 'Pindahan Kelas', sortable: false }
]

// Format date helper
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

// Load tahun pelajaran list
const loadTahunPelajaran = async () => {
  try {
    const response = await getTahunPelajaranList(1, 100)
    tahunPelajaranList.value = response.data || []
    
    // Set default tahun pelajaran to active one
    const activeTahun = tahunPelajaranList.value.find((t: any) => t.status === 'active')
    if (activeTahun) {
      filters.value.tahun_pelajaran_id = activeTahun.id
    } else if (tahunPelajaranList.value.length > 0) {
      filters.value.tahun_pelajaran_id = tahunPelajaranList.value[0].id
    }
  } catch (error: any) {
    console.error('Error loading tahun pelajaran:', error)
    toast.error('Gagal memuat daftar tahun pelajaran')
  }
}

// Load data list
const loadData = async () => {
  isLoading.value = true
  try {
    const response = await getMutasiSiswa({
      search: {
        tahun_pelajaran_id: filters.value.tahun_pelajaran_id || undefined,
        semester: filters.value.semester || undefined,
        start_date: filters.value.start_date || undefined,
        end_date: filters.value.end_date || undefined,
        nama_siswa: filters.value.nama_siswa || undefined,
        nisn: filters.value.nisn || undefined,
        tempat_lahir: filters.value.tempat_lahir || undefined
      },
      pagination: {
        limit: pagination.value.limit,
        page: pagination.value.page
      }
    })

    dataList.value = response.data || []
    pagination.value = {
      ...pagination.value,
      total: response.pagination.total,
      total_pages: response.pagination.total_pages
    }
  } catch (error: any) {
    console.error('Error loading data:', error)
    toast.error('Gagal memuat data mutasi siswa')
    dataList.value = []
  } finally {
    isLoading.value = false
  }
}

// Apply filters
const applyFilters = () => {
  pagination.value.page = 1
  loadData()
}

// Reset filters
const resetFilters = () => {
  const activeTahun = tahunPelajaranList.value.find((t: any) => t.status === 'active')
  filters.value = {
    tahun_pelajaran_id: activeTahun?.id || 0,
    semester: getCurrentSemester(),
    start_date: '',
    end_date: '',
    nama_siswa: '',
    nisn: '',
    tempat_lahir: ''
  }
  pagination.value.page = 1
  loadData()
}

// Pagination handlers
const onPageChange = (page: number) => {
  pagination.value.page = page
  loadData()
}

const onLimitChange = (limit: number) => {
  pagination.value.limit = limit
  pagination.value.page = 1
  loadData()
}

// Action handlers (placeholder - belum diimplementasi)
const viewDetail = (item: any) => {
  selectedItemId.value = item.id
  showDetailModal.value = true
}

const editItem = (item: any) => {
  selectedItemId.value = item.id
  showEditModal.value = true
}

const handleEditSuccess = () => {
  toast.success('Sukses', 'Data CMB berhasil diperbarui')
  loadData()
}

const downloadPdf = async (item: any) => {
  try {
    const blob = await downloadPdfMutasiSiswa(item.id)
    
    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Formulir-Pendaftaran-${item.nomor_pendaftaran}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    toast.success('Sukses', 'PDF berhasil didownload')
  } catch (error: any) {
    console.error('Error downloading PDF:', error)
    toast.error('Gagal', error?.message || 'Gagal mendownload PDF')
  }
}

const confirmDelete = (item: any) => {
  selectedItem.value = item
  selectedItemId.value = item.id
  showDeleteConfirm.value = true
}

const handleDeleteConfirm = async () => {
  if (!selectedItemId.value) return
  
  isDeleting.value = true
  
  try {
    const response = await deleteMutasiSiswa({ id: selectedItemId.value })
    toast.success('Sukses', response.message || 'Data CMB berhasil dihapus')
    showDeleteConfirm.value = false
    loadData()
  } catch (error: any) {
    console.error('Error deleting mutasi siswa:', error)
    toast.error('Gagal', error?.message || 'Gagal menghapus data CMB')
  } finally {
    isDeleting.value = false
  }
}

// Load setting
const loadSetting = async () => {
  isLoadingConfig.value = true
  try {
    const response = await getKonfigurasiMutasiSiswa()
    console.log('Response konfigurasi:', response) // Debug log
    if (response.data) {
      settingForm.value = {
        tanggal_buka_pendaftaran: response.data.tanggal_buka_pendaftaran || '',
        tanggal_tutup_pendaftaran: response.data.tanggal_tutup_pendaftaran || '',
        nama_kepala_sekolah: response.data.nama_kepala_sekolah || '',
        nip_kepala_sekolah: response.data.nip_kepala_sekolah || '',
        nama_ketua_panitia: response.data.nama_ketua_panitia || '',
        nip_ketua_panitia: response.data.nip_ketua_panitia || '',
        template_sptjm: response.data.template_sptjm || '',
        grup_wa: response.data.grup_wa || ''
      }
      console.log('Setting form after load:', settingForm.value) // Debug log
    } else {
      console.log('No data in response') // Debug log
    }
  } catch (error: any) {
    console.error('Error loading setting:', error)
    toast.error('Gagal memuat konfigurasi')
  } finally {
    isLoadingConfig.value = false
  }
}

// Submit setting
const handleSubmitSetting = async () => {
  isSubmittingConfig.value = true
  try {
    const formData = new FormData()
    formData.append('tanggal_buka_pendaftaran', settingForm.value.tanggal_buka_pendaftaran)
    formData.append('tanggal_tutup_pendaftaran', settingForm.value.tanggal_tutup_pendaftaran)
    formData.append('nama_kepala_sekolah', settingForm.value.nama_kepala_sekolah)
    formData.append('nip_kepala_sekolah', settingForm.value.nip_kepala_sekolah)
    formData.append('nama_ketua_panitia', settingForm.value.nama_ketua_panitia)
    formData.append('nip_ketua_panitia', settingForm.value.nip_ketua_panitia)
    formData.append('grup_wa', settingForm.value.grup_wa)
    
    if (newTemplateFile.value) {
      formData.append('template_sptjm', newTemplateFile.value)
    }
    
    const response = await saveKonfigurasiMutasiSiswa(formData)
    toast.success(response.message || 'Konfigurasi berhasil disimpan')
    
    // Reset new template file
    newTemplateFile.value = null
    
    // Reload setting to get updated data
    await loadSetting()
  } catch (error: any) {
    console.error('Error saving setting:', error)
    toast.error(error?.data?.message || 'Gagal menyimpan konfigurasi')
  } finally {
    isSubmittingConfig.value = false
  }
}

// Reset setting form
const resetSettingForm = () => {
  newTemplateFile.value = null
  loadSetting()
}

// Handle template file change
const handleTemplateFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB')
      return
    }
    
    // Validate file type
    const allowedTypes = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/pdf'
    ]
    if (!allowedTypes.includes(file.type)) {
      toast.error('Format file harus .doc, .docx, atau .pdf')
      return
    }
    
    newTemplateFile.value = file
  }
}

// Trigger template file input
const triggerTemplateFileInput = () => {
  templateFileInput.value?.click()
}

// Remove existing template
const removeExistingTemplate = () => {
  settingForm.value.template_sptjm = ''
}

// Remove new template
const removeNewTemplate = () => {
  newTemplateFile.value = null
  if (templateFileInput.value) {
    templateFileInput.value.value = ''
  }
}

// Watch active tab changes
watch(activeTab, (newTab) => {
  if (newTab === 'konfigurasi') {
    loadSetting()
  }
})

// Initialize
onMounted(async () => {
  await loadTahunPelajaran()
  await loadData()
})
</script>

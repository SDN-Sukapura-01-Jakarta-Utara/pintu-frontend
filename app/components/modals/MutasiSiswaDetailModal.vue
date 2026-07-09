<template>
  <!-- Backdrop -->
  <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="modelValue" @click="closeModal" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"></div>
  </Transition>

  <!-- Modal -->
  <Transition enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
    leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
    leave-to-class="opacity-0 scale-95 translate-y-4">
    <div v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl sm:max-w-3xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">

        <!-- Header -->
        <div
          class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
          <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
          <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

          <div class="relative z-10 flex-1">
            <h2 class="text-lg sm:text-xl font-bold text-white">Detail Data CMB</h2>
          </div>

          <button type="button" @click.stop="closeModal" :disabled="isLoading" :title="'Tutup'"
            class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 disabled:opacity-50 backdrop-blur-sm cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none" stroke="currentColor"
              viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="p-4 sm:p-6 lg:p-8 flex items-center justify-center flex-1">
          <div class="flex flex-col items-center gap-3 sm:gap-4">
            <div
              class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
            </div>
            <p class="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Memuat detail...</p>
          </div>
        </div>

        <!-- Body Content -->
        <div v-else-if="detailData" class="p-3 sm:p-5 md:p-8 relative z-10 overflow-y-auto flex-1 space-y-6">
          <!-- Info Pendaftaran Card -->
          <div
            class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border-2 border-blue-200 p-3 sm:p-4 md:p-6">
            <div class="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div class="min-w-0 flex-1">
                <h3 class="text-sm sm:text-lg md:text-xl font-bold text-gray-900 truncate">{{ detailData.nama_lengkap }}</h3>
                <p class="text-xs sm:text-xs md:text-sm text-gray-600 mt-0.5 sm:mt-1">Calon Murid Baru - Mutasi</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mt-3 sm:mt-4">
              <div class="flex items-center gap-2 sm:gap-2.5">
                <div class="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-blue-200 flex items-center justify-center">
                  <i class="fa-solid fa-hashtag text-blue-600 text-xs sm:text-sm"></i>
                </div>
                <div class="min-w-0">
                  <p class="text-[11px] sm:text-xs text-gray-600">No Pendaftaran</p>
                  <p class="text-[11px] sm:text-xs font-semibold text-gray-900 truncate">{{ detailData.nomor_pendaftaran }}</p>
                </div>
              </div>

              <div class="flex items-center gap-2 sm:gap-2.5">
                <div class="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-green-200 flex items-center justify-center">
                  <i class="fa-solid fa-calendar text-green-600 text-xs sm:text-sm"></i>
                </div>
                <div class="min-w-0">
                  <p class="text-[11px] sm:text-xs text-gray-600">Tahun Pelajaran</p>
                  <p class="text-[11px] sm:text-xs font-semibold text-gray-900 truncate">{{ detailData.tahun_pelajaran?.tahun_pelajaran || '-' }}</p>
                </div>
              </div>

              <div class="flex items-center gap-2 sm:gap-2.5">
                <div class="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-purple-200 flex items-center justify-center">
                  <i class="fa-solid fa-book text-purple-600 text-xs sm:text-sm"></i>
                </div>
                <div class="min-w-0">
                  <p class="text-[11px] sm:text-xs text-gray-600">Semester</p>
                  <p class="text-[11px] sm:text-xs font-semibold text-gray-900 truncate">Semester {{ detailData.semester }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Data Pribadi -->
          <div class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
            <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
              <h3 class="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                <i class="fa-solid fa-user w-3.5 sm:w-4 h-3.5 sm:h-4 text-blue-600 flex-shrink-0"></i>
                <span>Data Pribadi Siswa</span>
              </h3>
            </div>
            <div class="p-3 sm:p-4 md:p-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Nama Lengkap</p>
                  <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ detailData.nama_lengkap }}</p>
                </div>
                <div>
                  <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Nama Panggilan</p>
                  <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ detailData.nama_panggilan }}</p>
                </div>
                <div>
                  <p class="text-[11px] sm:text-xs text-gray-600 font-medium">NISN</p>
                  <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ detailData.nisn }}</p>
                </div>
                <div>
                  <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Tempat/Tanggal Lahir</p>
                  <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ detailData.tempat_lahir }}, {{ formatDate(detailData.tanggal_lahir) }}</p>
                </div>
                <div>
                  <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Jenis Kelamin</p>
                  <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ detailData.jenis_kelamin }}</p>
                </div>
                <div>
                  <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Agama</p>
                  <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ detailData.agama }}</p>
                </div>
                <div>
                  <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Golongan Darah</p>
                  <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ detailData.golongan_darah }}</p>
                </div>
                <div>
                  <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Anak Ke / Jumlah Saudara</p>
                  <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ detailData.anak_ke }} dari {{ detailData.jumlah_saudara }} bersaudara</p>
                </div>
                <div class="sm:col-span-2">
                  <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Status Anak</p>
                  <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ detailData.status_anak }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Alamat -->
          <div class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
            <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
              <h3 class="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                <i class="fa-solid fa-location-dot w-3.5 sm:w-4 h-3.5 sm:h-4 text-green-600 flex-shrink-0"></i>
                <span>Alamat</span>
              </h3>
            </div>
            <div class="p-3 sm:p-4 md:p-6">
              <div class="grid grid-cols-1 gap-3 sm:gap-4">
                <div>
                  <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Alamat Lengkap</p>
                  <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ detailData.alamat }}</p>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div>
                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium">RT</p>
                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ detailData.rt }}</p>
                  </div>
                  <div>
                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium">RW</p>
                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ detailData.rw }}</p>
                  </div>
                  <div>
                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Kelurahan</p>
                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ detailData.kelurahan }}</p>
                  </div>
                  <div>
                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Kecamatan</p>
                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ detailData.kecamatan }}</p>
                  </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Kota</p>
                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ detailData.kota }}</p>
                  </div>
                  <div>
                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Provinsi</p>
                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ detailData.provinsi }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Data Orang Tua -->
          <div class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
            <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
              <h3 class="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                <i class="fa-solid fa-people-roof w-3.5 sm:w-4 h-3.5 sm:h-4 text-orange-600 flex-shrink-0"></i>
                <span>Data Orang Tua</span>
              </h3>
            </div>
            <div class="p-3 sm:p-4 md:p-6 space-y-4">
              <!-- Ayah -->
              <div class="bg-blue-100 rounded-lg p-3 sm:p-4">
                <p class="text-xs sm:text-sm font-bold text-blue-900 mb-3">Data Ayah</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p class="text-[11px] sm:text-xs text-blue-700 font-medium">Nama</p>
                    <p class="text-xs sm:text-sm font-semibold text-blue-900">{{ detailData.nama_ayah }}</p>
                  </div>
                  <div>
                    <p class="text-[11px] sm:text-xs text-blue-700 font-medium">Pendidikan</p>
                    <p class="text-xs sm:text-sm font-semibold text-blue-900">{{ detailData.pendidikan_ayah }}</p>
                  </div>
                  <div>
                    <p class="text-[11px] sm:text-xs text-blue-700 font-medium">Pekerjaan</p>
                    <p class="text-xs sm:text-sm font-semibold text-blue-900">{{ detailData.pekerjaan_ayah }}</p>
                  </div>
                  <div>
                    <p class="text-[11px] sm:text-xs text-blue-700 font-medium">Penghasilan</p>
                    <p class="text-xs sm:text-sm font-semibold text-blue-900">{{ formatCurrency(detailData.penghasilan_ayah) }}</p>
                  </div>
                </div>
              </div>

              <!-- Ibu -->
              <div class="bg-pink-100 rounded-lg p-3 sm:p-4">
                <p class="text-xs sm:text-sm font-bold text-pink-900 mb-3">Data Ibu</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p class="text-[11px] sm:text-xs text-pink-700 font-medium">Nama</p>
                    <p class="text-xs sm:text-sm font-semibold text-pink-900">{{ detailData.nama_ibu }}</p>
                  </div>
                  <div>
                    <p class="text-[11px] sm:text-xs text-pink-700 font-medium">Pendidikan</p>
                    <p class="text-xs sm:text-sm font-semibold text-pink-900">{{ detailData.pendidikan_ibu }}</p>
                  </div>
                  <div>
                    <p class="text-[11px] sm:text-xs text-pink-700 font-medium">Pekerjaan</p>
                    <p class="text-xs sm:text-sm font-semibold text-pink-900">{{ detailData.pekerjaan_ibu }}</p>
                  </div>
                  <div>
                    <p class="text-[11px] sm:text-xs text-pink-700 font-medium">Penghasilan</p>
                    <p class="text-xs sm:text-sm font-semibold text-pink-900">{{ formatCurrency(detailData.penghasilan_ibu) }}</p>
                  </div>
                </div>
              </div>

              <!-- Wali -->
              <div v-if="detailData.nama_wali" class="bg-green-100 rounded-lg p-3 sm:p-4">
                <p class="text-xs sm:text-sm font-bold text-green-900 mb-3">Data Wali</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p class="text-[11px] sm:text-xs text-green-700 font-medium">Nama</p>
                    <p class="text-xs sm:text-sm font-semibold text-green-900">{{ detailData.nama_wali }}</p>
                  </div>
                  <div>
                    <p class="text-[11px] sm:text-xs text-green-700 font-medium">Hubungan</p>
                    <p class="text-xs sm:text-sm font-semibold text-green-900">{{ detailData.hubungan_wali }}</p>
                  </div>
                  <div>
                    <p class="text-[11px] sm:text-xs text-green-700 font-medium">Pendidikan</p>
                    <p class="text-xs sm:text-sm font-semibold text-green-900">{{ detailData.pendidikan_wali }}</p>
                  </div>
                  <div>
                    <p class="text-[11px] sm:text-xs text-green-700 font-medium">Pekerjaan</p>
                    <p class="text-xs sm:text-sm font-semibold text-green-900">{{ detailData.pekerjaan_wali }}</p>
                  </div>
                  <div>
                    <p class="text-[11px] sm:text-xs text-green-700 font-medium">No HP Wali</p>
                    <p class="text-xs sm:text-sm font-semibold text-green-900">{{ detailData.nomor_hp_wali }}</p>
                  </div>
                </div>
              </div>

              <!-- Kontak Orang Tua -->
              <div class="bg-amber-100 rounded-lg p-3 sm:p-4">
                <p class="text-xs sm:text-sm font-bold text-amber-900 mb-3">Kontak Orang Tua</p>
                <div>
                  <p class="text-[11px] sm:text-xs text-amber-700 font-medium">No HP Orang Tua</p>
                  <p class="text-xs sm:text-sm font-semibold text-amber-900">{{ detailData.nomor_hp_ortu }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Data Sekolah Asal -->
          <div class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
            <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
              <h3 class="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                <i class="fa-solid fa-school w-3.5 sm:w-4 h-3.5 sm:h-4 text-purple-600 flex-shrink-0"></i>
                <span>Data Sekolah Asal</span>
              </h3>
            </div>
            <div class="p-3 sm:p-4 md:p-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Asal Sekolah</p>
                  <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ detailData.asal_sekolah }}</p>
                </div>
                <div>
                  <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Nama Sekolah</p>
                  <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ detailData.nama_asal_sekolah }}</p>
                </div>
                <div>
                  <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Pindahan Kelas</p>
                  <p class="text-xs sm:text-sm font-semibold text-gray-900">Kelas {{ detailData.pindahan_kelas }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Dokumen Persyaratan -->
          <div class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
            <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
              <h3 class="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                <i class="fa-solid fa-file-pdf w-3.5 sm:w-4 h-3.5 sm:h-4 text-red-600 flex-shrink-0"></i>
                <span>Dokumen Persyaratan</span>
              </h3>
            </div>
            <div class="p-3 sm:p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a v-if="detailData.rapor" :href="detailData.rapor" target="_blank"
                class="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i class="fa-solid fa-file-alt text-white"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold text-blue-900">Rapor</p>
                  <p class="text-xs text-blue-600 truncate">Klik untuk melihat</p>
                </div>
                <i class="fa-solid fa-external-link-alt text-blue-600"></i>
              </a>

              <a v-if="detailData.akte_kelahiran" :href="detailData.akte_kelahiran" target="_blank"
                class="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                <div class="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i class="fa-solid fa-id-card text-white"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold text-green-900">Akte Kelahiran</p>
                  <p class="text-xs text-green-600 truncate">Klik untuk melihat</p>
                </div>
                <i class="fa-solid fa-external-link-alt text-green-600"></i>
              </a>

              <a v-if="detailData.kartu_keluarga" :href="detailData.kartu_keluarga" target="_blank"
                class="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                <div class="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i class="fa-solid fa-users text-white"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold text-purple-900">Kartu Keluarga</p>
                  <p class="text-xs text-purple-600 truncate">Klik untuk melihat</p>
                </div>
                <i class="fa-solid fa-external-link-alt text-purple-600"></i>
              </a>

              <a v-if="detailData.sptjm" :href="detailData.sptjm" target="_blank"
                class="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors">
                <div class="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i class="fa-solid fa-file-signature text-white"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold text-orange-900">SPTJM</p>
                  <p class="text-xs text-orange-600 truncate">Klik untuk melihat</p>
                </div>
                <i class="fa-solid fa-external-link-alt text-orange-600"></i>
              </a>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0 flex items-center justify-end gap-3">
          <button @click="closeModal" :disabled="isLoading"
            class="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            Tutup
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getMutasiSiswaById } from '~/services/mutasi-siswa'

interface Props {
  modelValue: boolean
  itemId: number | null
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const isLoading = ref(false)
const detailData = ref<any>(null)

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const formatCurrency = (amount: number) => {
  if (!amount) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

const loadDetail = async () => {
  if (!props.itemId) return

  isLoading.value = true
  try {
    const response = await getMutasiSiswaById({ id: props.itemId })
    detailData.value = response.data
  } catch (error) {
    console.error('Error loading detail:', error)
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  emit('update:modelValue', false)
  setTimeout(() => {
    detailData.value = null
  }, 300)
}

watch(() => props.modelValue, (newValue) => {
  if (newValue && props.itemId) {
    loadDetail()
  }
})
</script>

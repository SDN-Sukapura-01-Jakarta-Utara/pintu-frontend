<template>
  <!-- Background overlay -->
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      @click="closeModal"
      class="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
    ></div>
  </Transition>

  <!-- Modal panel -->
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-95 translate-y-4"
    enter-to-class="opacity-100 scale-100 translate-y-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100 translate-y-0"
    leave-to-class="opacity-0 scale-95 translate-y-4"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 pointer-events-none overflow-y-auto"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto overflow-hidden my-8">
        <!-- Header -->
        <div class="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <i class="fa-solid fa-clipboard-check text-white text-lg"></i>
              </div>
              <h3 class="text-lg font-bold text-white">{{ isEditMode ? 'Edit Absensi' : 'Detail Absensi' }}</h3>
            </div>
            <button
              @click="closeModal"
              class="text-white hover:text-gray-200 transition-colors cursor-pointer"
            >
              <i class="fa-solid fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="bg-white px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div v-if="detailData" class="space-y-5">
            <!-- Student Info Card -->
            <div class="bg-gradient-to-br from-red-50 via-white to-red-50 rounded-xl p-5 border-2 border-red-100 shadow-sm">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-md">
                    <i class="fa-solid fa-user-graduate text-white text-xl"></i>
                  </div>
                  <div>
                    <p class="text-xs font-medium text-red-600 uppercase tracking-wide">Informasi Siswa</p>
                    <p class="text-lg font-bold text-gray-900">{{ detailData.nama }}</p>
                  </div>
                </div>
                <button
                  v-if="!isEditMode"
                  @click="enableEditMode"
                  class="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white text-xs font-semibold rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <i class="fa-solid fa-edit text-sm"></i>
                  <span>Edit Kehadiran</span>
                </button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-red-100">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <i class="fa-solid fa-id-card text-red-600 text-sm"></i>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">NIS</p>
                    <p class="text-sm font-bold text-gray-900">{{ detailData.nis }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <i :class="detailData.jenis_kelamin === 'L' ? 'fa-solid fa-mars text-blue-600' : 'fa-solid fa-venus text-pink-600'" class="text-sm"></i>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Jenis Kelamin</p>
                    <p class="text-sm font-bold text-gray-900">{{ detailData.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <i class="fa-solid fa-calendar-day text-purple-600 text-sm"></i>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Tanggal</p>
                    <p class="text-sm font-bold text-gray-900">{{ formatDateShort(detailData.tanggal) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Edit Mode Form -->
            <div v-if="isEditMode" class="space-y-4">
              <!-- Status Kehadiran -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">
                  Status Kehadiran <span class="text-red-600">*</span>
                </label>
                <select
                  v-model="editForm.status"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                  :disabled="isSubmitting"
                >
                  <option value="hadir">Hadir</option>
                  <option value="sakit">Sakit</option>
                  <option value="izin">Izin</option>
                  <option value="alpa">Alpa</option>
                </select>
              </div>

              <!-- Keterangan -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">
                  Keterangan
                </label>
                <textarea
                  v-model="editForm.keterangan"
                  rows="3"
                  placeholder="Masukkan keterangan (opsional)"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm resize-none"
                  :disabled="isSubmitting"
                ></textarea>
              </div>

              <!-- Upload Surat -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">
                  Upload Surat
                </label>
                <div v-if="editForm.currentFile && !editForm.deleteCurrentFile" class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 flex-1 min-w-0">
                      <i class="fa-solid fa-file-pdf text-blue-600"></i>
                      <span class="text-sm text-gray-700 truncate">File saat ini: {{ getFileName(editForm.currentFile) }}</span>
                    </div>
                    <div class="flex items-center gap-2 flex-shrink-0">
                      <a
                        :href="getFileUrl(editForm.currentFile)"
                        target="_blank"
                        class="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                      >
                        Lihat
                      </a>
                      <button
                        type="button"
                        @click="deleteCurrentFile"
                        class="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 rounded transition-colors cursor-pointer"
                        :disabled="isSubmitting"
                        title="Hapus file"
                      >
                        <i class="fa-solid fa-trash text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div v-else-if="editForm.deleteCurrentFile" class="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <i class="fa-solid fa-trash text-red-600"></i>
                      <span class="text-sm text-red-700">File akan dihapus saat menyimpan</span>
                    </div>
                    <button
                      type="button"
                      @click="undoDeleteCurrentFile"
                      class="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                      :disabled="isSubmitting"
                    >
                      Batalkan
                    </button>
                  </div>
                </div>
                <input
                  ref="fileInputRef"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  @change="handleFileChange"
                  class="hidden"
                />
                <div v-if="editForm.newFile" class="mb-3 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <i class="fa-solid fa-file text-green-600"></i>
                  <span class="text-sm text-gray-700 flex-1">{{ editForm.newFile.name }}</span>
                  <button
                    type="button"
                    @click="removeNewFile"
                    class="text-red-600 hover:text-red-700"
                    :disabled="isSubmitting"
                  >
                    <i class="fa-solid fa-trash text-sm"></i>
                  </button>
                </div>
                <button
                  type="button"
                  @click="triggerFileInput"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm font-semibold"
                  :disabled="isSubmitting"
                >
                  <i class="fa-solid fa-upload mr-2"></i>
                  {{ editForm.newFile ? 'Ganti File' : 'Pilih File' }}
                </button>
                <p class="text-xs text-gray-500 mt-2">Format: PDF, JPG, PNG. Maksimal 5MB</p>
              </div>

              <!-- Error Message -->
              <div v-if="errorMessage" class="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <div class="flex gap-3">
                  <i class="fa-solid fa-exclamation-circle text-red-600 text-base flex-shrink-0 mt-0.5"></i>
                  <div class="flex-1 text-sm">
                    <p class="font-semibold text-red-900">Error</p>
                    <p class="text-red-800 mt-1">{{ errorMessage }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- View Mode (Original Content) -->
            <div v-else class="space-y-5">
              <!-- Status Kehadiran - Large Card -->
              <div class="rounded-xl p-5 border-2 shadow-sm" :class="getStatusCardClass(detailData.status)">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 rounded-xl flex items-center justify-center shadow-md" :class="getStatusBadgeClass(detailData.status)">
                    <i :class="getStatusIcon(detailData.status)" class="text-2xl"></i>
                  </div>
                  <div class="flex-1">
                    <p class="text-xs font-medium uppercase tracking-wide mb-1" :class="getStatusTextClass(detailData.status)">
                      Status Kehadiran
                    </p>
                    <p class="text-xl font-bold mb-1" :class="getStatusTextClass(detailData.status)">
                      {{ getStatusLabel(detailData.status) }}
                    </p>
                    <p class="text-xs text-gray-600">
                      <i class="fa-solid fa-clock mr-1"></i>
                      {{ formatTime(detailData.waktu_absen) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Detail Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Pertemuan Ke (for Guru Mapel) -->
                <div v-if="detailData.pertemuan_ke" class="bg-gradient-to-br from-purple-50 to-white rounded-xl p-4 border border-purple-200">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <i class="fa-solid fa-hashtag text-purple-600 text-base"></i>
                    </div>
                    <div>
                      <p class="text-xs text-purple-600 font-semibold mb-0.5">Pertemuan Ke</p>
                      <p class="text-sm font-bold text-gray-900">{{ detailData.pertemuan_ke }}</p>
                    </div>
                  </div>
                </div>

                <!-- Bidang Studi (for Guru Mapel) -->
                <div v-if="bidangStudiNama" class="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-4 border border-indigo-200" :class="detailData.pertemuan_ke ? '' : 'md:col-span-2'">
                  <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <i class="fa-solid fa-book text-indigo-600 text-base"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs text-indigo-600 font-semibold mb-0.5">Bidang Studi</p>
                      <p class="text-sm font-bold text-gray-900 leading-tight">{{ bidangStudiNama }}</p>
                    </div>
                  </div>
                </div>

                <!-- Metode Input -->
                <div class="bg-gradient-to-br from-teal-50 to-white rounded-xl p-4 border border-teal-200">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                      <i class="fa-solid fa-keyboard text-teal-600 text-base"></i>
                    </div>
                    <div>
                      <p class="text-xs text-teal-600 font-semibold mb-0.5">Metode Input</p>
                      <p class="text-sm font-bold text-gray-900 capitalize">{{ detailData.metode_input }}</p>
                    </div>
                  </div>
                </div>

                <!-- Dicatat Oleh -->
                <div class="bg-gradient-to-br from-amber-50 to-white rounded-xl p-4 border border-amber-200">
                  <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <i class="fa-solid fa-user-tie text-amber-600 text-base"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs text-amber-600 font-semibold mb-0.5">Dicatat Oleh</p>
                      <p class="text-sm font-bold text-gray-900 leading-tight">{{ detailData.dicatat_oleh }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Keterangan -->
              <div v-if="detailData.keterangan" class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <i class="fa-solid fa-comment-dots text-gray-600 text-base"></i>
                  </div>
                  <div class="flex-1">
                    <p class="text-xs text-gray-600 font-semibold mb-2">Keterangan</p>
                    <p class="text-sm text-gray-900 leading-relaxed">{{ detailData.keterangan }}</p>
                  </div>
                </div>
              </div>

              <!-- File Surat -->
              <div v-if="detailData.file_surat" class="bg-gradient-to-br from-rose-50 to-white rounded-xl p-5 border-2 border-rose-200">
                <div class="flex items-start gap-3 mb-3">
                  <div class="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
                    <i class="fa-solid fa-paperclip text-rose-600 text-lg"></i>
                  </div>
                  <div class="flex-1">
                    <p class="text-xs text-rose-600 font-medium mb-1">Lampiran Surat</p>
                    <p class="text-sm text-gray-600">Dokumen pendukung absensi</p>
                  </div>
                </div>
                <a
                  :href="getFileUrl(detailData.file_surat)"
                  target="_blank"
                  class="flex items-center justify-between gap-3 p-4 bg-white rounded-lg border-2 border-rose-200 hover:border-rose-400 hover:shadow-md transition-all duration-300 group"
                >
                  <div class="flex items-center gap-3 flex-1 min-w-0">
                    <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-rose-600 to-rose-700 flex items-center justify-center flex-shrink-0 shadow-md">
                      <i class="fa-solid fa-file-pdf text-white text-xl"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-bold text-gray-900 group-hover:text-rose-600 transition-colors truncate">
                        {{ getFileName(detailData.file_surat) }}
                      </p>
                      <p class="text-xs text-gray-500">Klik untuk membuka</p>
                    </div>
                  </div>
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-lg bg-rose-100 group-hover:bg-rose-600 flex items-center justify-center transition-colors">
                      <i class="fa-solid fa-external-link-alt text-rose-600 group-hover:text-white text-sm transition-colors"></i>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            v-if="isEditMode"
            @click="cancelEdit"
            :disabled="isSubmitting"
            class="px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button
            v-if="isEditMode"
            @click="handleUpdate"
            :disabled="isSubmitting"
            class="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:shadow-lg text-white font-semibold rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
          </button>
          <button
            v-if="!isEditMode"
            @click="closeModal"
            class="px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { updateRekapAbsensi } from '~/services/absensi'
import { useToast } from '~/composables/useToast'

interface DetailAbsensiData {
  id?: number
  nama: string
  nis: string
  jenis_kelamin: string
  tanggal: string
  pertemuan_ke?: number
  status: string
  waktu_absen: string
  metode_input: string
  keterangan: string
  file_surat?: string
  dicatat_oleh: string
  dicatat_oleh_id: number
}

const props = defineProps<{
  isOpen: boolean
  detailData: DetailAbsensiData | null
  bidangStudiNama?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updated'): void
}>()

const { success: showToast, error: showErrorToast } = useToast()

const isEditMode = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const editForm = ref({
  id: 0,
  status: '',
  keterangan: '',
  currentFile: '',
  newFile: null as File | null,
  deleteCurrentFile: false
})

const closeModal = () => {
  isEditMode.value = false
  errorMessage.value = null
  emit('close')
}

const enableEditMode = () => {
  if (!props.detailData) return
  
  // Initialize edit form with current data
  editForm.value = {
    id: props.detailData.id || 0,
    status: props.detailData.status,
    keterangan: props.detailData.keterangan || '',
    currentFile: props.detailData.file_surat || '',
    newFile: null,
    deleteCurrentFile: false
  }
  
  isEditMode.value = true
  errorMessage.value = null
}

const cancelEdit = () => {
  isEditMode.value = false
  errorMessage.value = null
  editForm.value.newFile = null
  editForm.value.deleteCurrentFile = false
}

const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showErrorToast('Error', 'Ukuran file maksimal 5MB')
      return
    }
    
    editForm.value.newFile = file
    // If user uploads new file, cancel delete flag
    editForm.value.deleteCurrentFile = false
  }
}

const removeNewFile = () => {
  editForm.value.newFile = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const deleteCurrentFile = () => {
  editForm.value.deleteCurrentFile = true
}

const undoDeleteCurrentFile = () => {
  editForm.value.deleteCurrentFile = false
}

const handleUpdate = async () => {
  isSubmitting.value = true
  errorMessage.value = null

  try {
    // Create FormData for file upload
    const formDataToSend = new FormData()
    
    const dataPayload: any = {
      id: editForm.value.id,
      status: editForm.value.status,
      keterangan: editForm.value.keterangan
    }
    
    // Add delete_file_surat flag if user wants to delete current file
    if (editForm.value.deleteCurrentFile) {
      dataPayload.delete_file_surat = true
    }
    
    formDataToSend.append('data', JSON.stringify(dataPayload))

    // Append file if new file is selected
    if (editForm.value.newFile) {
      formDataToSend.append('file_surat', editForm.value.newFile)
    }

    const response = await updateRekapAbsensi(formDataToSend)

    if (response.data) {
      showToast('Berhasil', response.data.message || 'Data absensi berhasil diperbarui')
      isEditMode.value = false
      emit('updated')
      
      // Close modal after short delay
      setTimeout(() => {
        closeModal()
      }, 1000)
    }
  } catch (err: any) {
    console.error('Error updating attendance:', err)
    const errorMsg = err.data?.error || err.data?.message || err.response?.data?.error || err.response?.data?.message || err.message || 'Gagal memperbarui data absensi'
    errorMessage.value = errorMsg
    showErrorToast('Gagal', errorMsg)
  } finally {
    isSubmitting.value = false
  }
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    hadir: 'Hadir',
    sakit: 'Sakit',
    izin: 'Izin',
    alpa: 'Alpa'
  }
  return labels[status] || status
}

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    hadir: 'fa-solid fa-check',
    sakit: 'fa-solid fa-notes-medical',
    izin: 'fa-solid fa-hand-paper',
    alpa: 'fa-solid fa-times'
  }
  return icons[status] || 'fa-solid fa-question'
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    hadir: 'bg-gradient-to-br from-green-500 to-green-600 text-white',
    sakit: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
    izin: 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white',
    alpa: 'bg-gradient-to-br from-red-500 to-red-600 text-white'
  }
  return classes[status] || 'bg-gray-100'
}

const getStatusCardClass = (status: string) => {
  const classes: Record<string, string> = {
    hadir: 'bg-gradient-to-br from-green-50 to-white border-green-200',
    sakit: 'bg-gradient-to-br from-blue-50 to-white border-blue-200',
    izin: 'bg-gradient-to-br from-yellow-50 to-white border-yellow-200',
    alpa: 'bg-gradient-to-br from-red-50 to-white border-red-200'
  }
  return classes[status] || 'bg-gray-50 border-gray-200'
}

const getStatusTextClass = (status: string) => {
  const classes: Record<string, string> = {
    hadir: 'text-green-700',
    sakit: 'text-blue-700',
    izin: 'text-yellow-700',
    alpa: 'text-red-700'
  }
  return classes[status] || 'text-gray-700'
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  return date.toLocaleDateString('id-ID', options)
}

const formatDateShort = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  }
  return date.toLocaleDateString('id-ID', options)
}

const formatDateTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return '-'
  const date = new Date(dateTimeStr)
  const dateOptions: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  const timeOptions: Intl.DateTimeFormatOptions = { 
    hour: '2-digit', 
    minute: '2-digit' 
  }
  return `${date.toLocaleDateString('id-ID', dateOptions)} - ${date.toLocaleTimeString('id-ID', timeOptions)}`
}

const formatTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return '-'
  const date = new Date(dateTimeStr)
  const options: Intl.DateTimeFormatOptions = { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  }
  return date.toLocaleTimeString('id-ID', options)
}

const getFileName = (filePath: string) => {
  if (!filePath) return 'File'
  const parts = filePath.split('/')
  return parts[parts.length - 1]
}

const getFileUrl = (filePath: string) => {
  // If the file path is already a full URL (starts with http:// or https://), return it as is
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath
  }
  
  // Otherwise, construct the URL from the API base
  const config = useRuntimeConfig()
  // Remove leading slash if exists
  const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath
  return `${config.public.apiBase}/${cleanPath}`
}

// Close modal on Escape key
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }
})
</script>

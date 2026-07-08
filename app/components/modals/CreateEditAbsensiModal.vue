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
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto overflow-hidden my-8">
        <!-- Header -->
        <div class="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <i class="fa-solid fa-clipboard-check text-white text-lg"></i>
              </div>
              <h3 class="text-lg font-bold text-white">Input Absensi</h3>
            </div>
            <button
              @click="closeModal"
              class="text-white hover:text-gray-200 transition-colors cursor-pointer"
              :disabled="isSubmitting"
            >
              <i class="fa-solid fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="px-6 py-6">
          <!-- Student Info -->
          <div class="bg-gradient-to-br from-red-50 via-white to-red-50 rounded-xl p-4 border-2 border-red-100 mb-5">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-md">
                <i class="fa-solid fa-user-graduate text-white text-xl"></i>
              </div>
              <div>
                <p class="text-xs font-medium text-red-600 uppercase tracking-wide">Siswa</p>
                <p class="text-base font-bold text-gray-900">{{ siswaData.nama }}</p>
                <p class="text-xs text-gray-600">NIS: {{ siswaData.nis }}</p>
              </div>
            </div>
            <div class="mt-3 pt-3 border-t border-red-100">
              <p class="text-xs text-gray-600">
                <i class="fa-solid fa-calendar text-red-600 mr-1"></i>
                Tanggal: {{ formatDate(tanggal) }}
              </p>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Status Kehadiran -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Status Kehadiran <span class="text-red-600">*</span>
              </label>
              <select
                v-model="formData.status"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                required
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
                v-model="formData.keterangan"
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
              <input
                ref="fileInputRef"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                @change="handleFileChange"
                class="hidden"
              />
              <div v-if="formData.file" class="mb-3 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <i class="fa-solid fa-file text-green-600"></i>
                <span class="text-sm text-gray-700 flex-1 truncate">{{ formData.file.name }}</span>
                <button
                  type="button"
                  @click="removeFile"
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
                {{ formData.file ? 'Ganti File' : 'Pilih File' }}
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

            <!-- Buttons -->
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                @click="closeModal"
                :disabled="isSubmitting"
                class="px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:shadow-lg text-white font-semibold rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan Absensi' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { createAbsensiManualById } from '~/services/absensi'
import { useToast } from '~/composables/useToast'

const props = defineProps<{
  isOpen: boolean
  siswaData: {
    id: number
    nama: string
    nis: string
    peserta_didik_rombel_id: number
  }
  tanggal: string
  rombelId: number
  tahunPelajaranId: number
  bidangStudiId: number | null
  pertemuanKe: number | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created'): void
}>()

const { success: showToast, error: showErrorToast } = useToast()

const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const formData = ref({
  status: 'hadir',
  keterangan: '',
  file: null as File | null
})

const closeModal = () => {
  if (!isSubmitting.value) {
    errorMessage.value = null
    formData.value = {
      status: 'hadir',
      keterangan: '',
      file: null
    }
    emit('close')
  }
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
    
    formData.value.file = file
  }
}

const removeFile = () => {
  formData.value.file = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  errorMessage.value = null

  try {
    // Set waktu_absen to current datetime
    const now = new Date()
    const waktuAbsen = `${props.tanggal} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:00`

    // Create FormData for file upload
    const formDataToSend = new FormData()
    
    const dataPayload: any = {
      peserta_didik_rombel_id: props.siswaData.peserta_didik_rombel_id,
      rombel_id: props.rombelId,
      tahun_pelajaran_id: props.tahunPelajaranId,
      tanggal: props.tanggal,
      status: formData.value.status,
      keterangan: formData.value.keterangan,
      waktu_absen: waktuAbsen
    }
    
    // Add bidang_studi_id and pertemuan_ke for guru mapel
    if (props.bidangStudiId) {
      dataPayload.bidang_studi_id = props.bidangStudiId
    }
    if (props.pertemuanKe) {
      dataPayload.pertemuan_ke = props.pertemuanKe
    }
    
    formDataToSend.append('data', JSON.stringify(dataPayload))

    // Append file if selected
    if (formData.value.file) {
      formDataToSend.append('file_surat', formData.value.file)
    }

    const response = await createAbsensiManualById(formDataToSend)

    if (response.data) {
      showToast('Berhasil', 'Data absensi berhasil disimpan')
      emit('created')
      
      // Close modal after short delay
      setTimeout(() => {
        closeModal()
      }, 1000)
    }
  } catch (err: any) {
    console.error('Error creating attendance:', err)
    const errorMsg = err.data?.error || err.data?.message || err.response?.data?.error || err.response?.data?.message || err.message || 'Gagal menyimpan data absensi'
    errorMessage.value = errorMsg
    showErrorToast('Gagal', errorMsg)
  } finally {
    isSubmitting.value = false
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }
  return date.toLocaleDateString('id-ID', options)
}

// Reset form when modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    formData.value = {
      status: 'hadir',
      keterangan: '',
      file: null
    }
    errorMessage.value = null
  }
})
</script>

<template>
  <DashboardLayout>
    <!-- Header Section -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Kutipan Kepala Sekolah</h1>
      <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
        Kelola kutipan dan foto kepala sekolah untuk ditampilkan di halaman utama
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-8 sm:py-12">
      <div class="flex flex-col items-center gap-3 sm:gap-4">
        <div class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
        <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data...</p>
      </div>
    </div>

    <!-- Main Form -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <form @submit.prevent="handleSubmit" class="p-4 sm:p-6 md:p-8">
        
        <!-- Photo Section -->
        <div class="mb-8">
          <label class="block text-[13px] sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
            Foto Kepala Sekolah (3x4)
            <span class="text-red-600 ml-1">*</span>
          </label>

          <!-- Current Image Preview -->
          <div v-if="!imagePreview && formData.foto_kepsek && !shouldRemovePhoto" class="mb-4">
            <div class="relative bg-gray-100 rounded-lg overflow-hidden inline-block">
              <div class="aspect-[3/4] w-32 sm:w-40 flex items-center justify-center">
                <img
                  :src="formData.foto_kepsek"
                  alt="Foto Kepala Sekolah"
                  class="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                @click="removeCurrentImage"
                :disabled="isSubmitting"
                class="absolute top-2 right-2 p-1.5 sm:p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors disabled:opacity-50"
              >
                <i class="fa-solid fa-trash text-xs sm:text-sm"></i>
              </button>
            </div>
          </div>

          <!-- New Image Preview -->
          <div v-if="imagePreview" class="mb-4">
            <div class="relative bg-gray-100 rounded-lg overflow-hidden inline-block">
              <div class="aspect-[3/4] w-32 sm:w-40 flex items-center justify-center">
                <img
                  :src="imagePreview"
                  alt="Preview"
                  class="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                @click="removeImage"
                :disabled="isSubmitting"
                class="absolute top-2 right-2 p-1.5 sm:p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors disabled:opacity-50"
              >
                <i class="fa-solid fa-trash text-xs sm:text-sm"></i>
              </button>
            </div>
          </div>

          <!-- Upload Area -->
          <div
            @click="$refs.photoInput.click()"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop.prevent="handlePhotoDrop"
            :class="[
              'relative border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-all',
              isDragging 
                ? 'border-blue-500 bg-blue-50 scale-105' 
                : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
            ]"
          >
            <input
              ref="photoInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handlePhotoSelect"
              :disabled="isSubmitting"
            />

            <div class="flex flex-col items-center gap-2">
              <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <i class="fa-solid fa-cloud-arrow-up text-lg sm:text-xl text-blue-600"></i>
              </div>
              <div>
                <p class="text-xs sm:text-sm font-semibold text-gray-900">Klik atau drag foto</p>
                <p class="text-[11px] sm:text-xs text-gray-600 mt-0.5">JPG, PNG (Maks. 1MB)</p>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="photoError" class="mt-3 p-2 bg-red-50 border border-red-200 rounded">
              <p class="text-xs text-red-700">{{ photoError }}</p>
            </div>
          </div>
        </div>

        <!-- Nama Kepala Sekolah -->
        <div class="mb-6 sm:mb-8">
          <label class="block text-[13px] sm:text-sm font-semibold text-gray-900 mb-2">
            Nama Kepala Sekolah
            <span class="text-red-600 ml-1">*</span>
          </label>
          <input
            v-model="formData.nama_kepsek"
            type="text"
            placeholder="Masukkan nama kepala sekolah"
            class="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs sm:text-sm"
            :disabled="isSubmitting"
          />
        </div>

        <!-- Kutipan Kepala Sekolah -->
        <div class="mb-6 sm:mb-8">
          <label class="block text-[13px] sm:text-sm font-semibold text-gray-900 mb-2">
            Kutipan Kepala Sekolah
            <span class="text-red-600 ml-1">*</span>
          </label>
          <p class="text-[11px] sm:text-xs text-gray-600 mb-2">Format teks dengan toolbar di bawah</p>
          <div class="overflow-x-auto">
            <RichTextEditor v-model="formData.kutipan_kepsek" />
          </div>
        </div>

        <!-- Alerts Section -->
        <div class="mb-6 sm:mb-8 space-y-3">
          <!-- Error Alert -->
          <div v-if="submitError" class="p-3 sm:p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <div class="flex gap-2 sm:gap-3">
              <i class="fa-solid fa-exclamation-circle text-red-600 text-sm sm:text-base flex-shrink-0 mt-0.5"></i>
              <div class="flex-1 text-xs sm:text-sm">
                <p class="font-semibold text-red-900">Error</p>
                <p class="text-red-800 mt-1">{{ submitError }}</p>
              </div>
            </div>
          </div>

          <!-- Success Alert -->
          <div v-if="showSuccessMessage" class="p-3 sm:p-4 bg-green-50 border-2 border-green-200 rounded-lg">
            <div class="flex gap-2 sm:gap-3">
              <i class="fa-solid fa-check-circle text-green-600 text-sm sm:text-base flex-shrink-0 mt-0.5"></i>
              <div class="flex-1 text-xs sm:text-sm">
                <p class="font-semibold text-green-900">Berhasil</p>
                <p class="text-green-800 mt-1">{{ successMessage }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="resetForm"
            :disabled="isSubmitting"
            class="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="!isFormValid || isSubmitting"
            class="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            <svg v-if="isSubmitting" class="w-3 h-3 sm:w-4 sm:h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan Data' }}</span>
          </button>
        </div>
      </form>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getKutipanKepsekById, createKutipanKepsek, updateKutipanKepsek } from '~/services/kutipan-kepsek'
import { compressImage, getFileSizeInMB } from '~/utils/imageCompressor'
import { useToast } from '~/composables/useToast'
import RichTextEditor from '~/components/common/RichTextEditor.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const { success: showToast } = useToast()

// State
const isLoading = ref(false)
const isSubmitting = ref(false)
const isDragging = ref(false)
const photoError = ref<string | null>(null)
const submitError = ref<string | null>(null)
const showSuccessMessage = ref(false)
const successMessage = ref('')
const shouldRemovePhoto = ref(false)
const photoInput = ref<HTMLInputElement | null>(null)
const imagePreview = ref<string | null>(null)
const selectedFile = ref<File | null>(null)

const formData = ref({
  id: 1,
  nama_kepsek: '',
  foto_kepsek: '',
  kutipan_kepsek: '',
})

const originalFormData = ref({
  id: 1,
  nama_kepsek: '',
  foto_kepsek: '',
  kutipan_kepsek: '',
})

// File validation
const MAX_FILE_SIZE = 1 * 1024 * 1024 // 1MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const validateFile = (file: File): string | null => {
  if (!file) return 'Pilih file gambar'

  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Format file harus JPG, PNG, atau WebP'
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'Ukuran file tidak boleh lebih dari 1MB'
  }

  return null
}

// Computed property for form validity
const isFormValid = computed(() => {
  return (
    formData.value.nama_kepsek.trim() !== '' &&
    formData.value.kutipan_kepsek.trim() !== '' &&
    (formData.value.foto_kepsek !== '' || selectedFile.value !== null)
  )
})

// Fetch initial data
const fetchData = async () => {
  isLoading.value = true
  try {
    const response = await getKutipanKepsekById(1)
    
    if (response && response.data) {
      formData.value = {
        id: response.data.id || 1,
        nama_kepsek: response.data.nama_kepsek || '',
        foto_kepsek: response.data.foto_kepsek || '',
        kutipan_kepsek: response.data.kutipan_kepsek || '',
      }
      originalFormData.value = { ...formData.value }
    } else {
      formData.value = {
        id: 1,
        nama_kepsek: '',
        foto_kepsek: '',
        kutipan_kepsek: '',
      }
      originalFormData.value = { ...formData.value }
    }
  } catch (err: any) {
    if (err.status === 401) {
      const { handle401 } = useAuthGuard()
      await handle401()
      return
    }
  } finally {
    isLoading.value = false
  }
}

// Handle photo selection
const handlePhotoSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file) {
    const error = validateFile(file)
    if (error) {
      photoError.value = error
      selectedFile.value = null
      imagePreview.value = null
      return
    }

    photoError.value = null
    shouldRemovePhoto.value = false

    try {
      const compressedFile = await compressImage(file, {
        maxSize: 0.1,
        quality: 0.7,
        maxWidth: 600,
        maxHeight: 800,
      })

      selectedFile.value = compressedFile
      console.log(`Original: ${getFileSizeInMB(file.size)}MB → Compressed: ${getFileSizeInMB(compressedFile.size)}MB`)

      const reader = new FileReader()
      reader.onload = (e) => {
        imagePreview.value = e.target?.result as string
      }
      reader.readAsDataURL(selectedFile.value)
    } catch (err) {
      photoError.value = 'Gagal mengkompres gambar'
      selectedFile.value = null
      imagePreview.value = null
      console.error('Compression error:', err)
    }
  }
}

const handlePhotoDrop = async (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]

  if (file) {
    const error = validateFile(file)
    if (error) {
      photoError.value = error
      selectedFile.value = null
      imagePreview.value = null
      return
    }

    photoError.value = null
    shouldRemovePhoto.value = false

    try {
      const compressedFile = await compressImage(file, {
        maxSize: 0.1,
        quality: 0.7,
        maxWidth: 600,
        maxHeight: 800,
      })

      selectedFile.value = compressedFile
      console.log(`Original: ${getFileSizeInMB(file.size)}MB → Compressed: ${getFileSizeInMB(compressedFile.size)}MB`)

      const reader = new FileReader()
      reader.onload = (e) => {
        imagePreview.value = e.target?.result as string
      }
      reader.readAsDataURL(selectedFile.value)
    } catch (err) {
      photoError.value = 'Gagal mengkompres gambar'
      selectedFile.value = null
      imagePreview.value = null
      console.error('Compression error:', err)
    }
  }
}

const removeImage = () => {
  selectedFile.value = null
  imagePreview.value = null
  photoError.value = null
  if (photoInput.value) {
    photoInput.value.value = ''
  }
}

const removeCurrentImage = () => {
  shouldRemovePhoto.value = true
  selectedFile.value = null
  imagePreview.value = null
  photoError.value = null
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true
  submitError.value = null
  showSuccessMessage.value = false

  try {
    const hasExistingData = originalFormData.value.foto_kepsek !== '' ||
                           originalFormData.value.nama_kepsek !== '' ||
                           originalFormData.value.kutipan_kepsek !== ''

    const payload: any = {
      nama_kepsek: formData.value.nama_kepsek,
      kutipan_kepsek: formData.value.kutipan_kepsek,
    }

    if (selectedFile.value) {
      payload.file = selectedFile.value
    }

    if (hasExistingData) {
      await updateKutipanKepsek(1, payload)
      successMessage.value = 'Data kutipan kepala sekolah berhasil diperbarui'
      showToast('Berhasil', 'Data kutipan kepala sekolah berhasil diperbarui')
    } else {
      if (!selectedFile.value) {
        submitError.value = 'Foto kepala sekolah harus diunggah'
        isSubmitting.value = false
        return
      }
      
      await createKutipanKepsek(payload)
      successMessage.value = 'Data kutipan kepala sekolah berhasil ditambahkan'
      showToast('Berhasil', 'Data kutipan kepala sekolah berhasil ditambahkan')
      
      await fetchData()
    }

    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 5000)

    originalFormData.value = { ...formData.value }
  } catch (err: any) {
    if (err.status === 401) {
      const { handle401 } = useAuthGuard()
      await handle401()
      return
    }

    submitError.value = err.data?.message || err.data?.error || err.message || 'Gagal menyimpan data'
    console.error('Error saving data:', err)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  formData.value = { ...originalFormData.value }
  selectedFile.value = null
  imagePreview.value = null
  photoError.value = null
  submitError.value = null
  showSuccessMessage.value = false
  shouldRemovePhoto.value = false
  if (photoInput.value) {
    photoInput.value.value = ''
  }
}

onMounted(() => {
  fetchData()
})
</script>

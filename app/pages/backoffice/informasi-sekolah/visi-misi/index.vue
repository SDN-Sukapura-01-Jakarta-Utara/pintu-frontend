<template>
  <DashboardLayout>
    <!-- Header Section -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Visi & Misi</h1>
      <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
        Kelola visi dan misi sekolah untuk ditampilkan di halaman utama
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
        
        <!-- Visi Section -->
        <div class="mb-6 sm:mb-8">
          <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
            Visi Sekolah
            <span class="text-red-600 ml-1">*</span>
          </label>
          <p class="text-[12px] sm:text-xs text-gray-600 mb-3">Masukkan visi sekolah dengan format teks yang dapat diformat</p>
          <div class="overflow-x-auto">
            <RichTextEditor v-model="formData.visi" />
          </div>
        </div>

        <!-- Misi Section -->
        <div class="mb-6 sm:mb-8">
          <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
            Misi Sekolah
            <span class="text-red-600 ml-1">*</span>
          </label>
          <p class="text-[12px] sm:text-xs text-gray-600 mb-3">Masukkan misi sekolah dengan format teks yang dapat diformat</p>
          <div class="overflow-x-auto">
            <RichTextEditor v-model="formData.misi" />
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
import { getVisiMisiById, createVisiMisi, updateVisiMisi } from '~/services/visi-misi'
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
const submitError = ref<string | null>(null)
const showSuccessMessage = ref(false)
const successMessage = ref('')

const formData = ref({
  id: 1,
  visi: '',
  misi: '',
})

const originalFormData = ref({
  id: 1,
  visi: '',
  misi: '',
})

// Computed property for form validity
const isFormValid = computed(() => {
  return (
    formData.value.visi.trim() !== '' &&
    formData.value.misi.trim() !== ''
  )
})

// Fetch initial data
const fetchData = async () => {
  isLoading.value = true
  try {
    const response = await getVisiMisiById(1)
    
    if (response && response.data) {
      formData.value = {
        id: response.data.id || 1,
        visi: response.data.visi || '',
        misi: response.data.misi || '',
      }
      originalFormData.value = { ...formData.value }
    } else {
      formData.value = {
        id: 1,
        visi: '',
        misi: '',
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

const handleSubmit = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true
  submitError.value = null
  showSuccessMessage.value = false

  try {
    const hasExistingData = originalFormData.value.visi !== '' || originalFormData.value.misi !== ''

    const payload = {
      visi: formData.value.visi,
      misi: formData.value.misi,
    }

    if (hasExistingData) {
      await updateVisiMisi(1, payload)
      successMessage.value = 'Data visi dan misi berhasil diperbarui'
      showToast('Berhasil', 'Data visi dan misi berhasil diperbarui')
    } else {
      await createVisiMisi(payload)
      successMessage.value = 'Data visi dan misi berhasil ditambahkan'
      showToast('Berhasil', 'Data visi dan misi berhasil ditambahkan')
      
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
  submitError.value = null
  showSuccessMessage.value = false
}

onMounted(() => {
  fetchData()
})
</script>

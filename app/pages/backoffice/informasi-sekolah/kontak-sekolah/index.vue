<template>
  <DashboardLayout>
    <!-- Header Section -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Kontak Sekolah</h1>
      <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
        Kelola informasi kontak sekolah untuk ditampilkan di halaman utama
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
        
        <!-- Section 1: Informasi Dasar -->
        <div class="mb-8 pb-8 border-b border-gray-200">
          <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <i class="fa-solid fa-map-pin text-red-600"></i>
            Informasi Dasar
          </h2>

          <!-- Alamat -->
          <div class="mb-6">
            <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
              Alamat <span class="text-red-600">*</span>
            </label>
            <textarea
              v-model="formData.alamat"
              placeholder="Masukkan alamat lengkap sekolah"
              rows="3"
              class="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              required
              :disabled="isSubmitting"
            ></textarea>
          </div>

          <!-- Telepon -->
          <div class="mb-6">
            <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
              Nomor Telepon <span class="text-red-600">*</span>
            </label>
            <input
              v-model="formData.telepon"
              type="tel"
              placeholder="Contoh: 02122334455"
              class="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              required
              :disabled="isSubmitting"
            />
          </div>

          <!-- Email -->
          <div class="mb-6">
            <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
              Email <span class="text-red-600">*</span>
            </label>
            <input
              v-model="formData.email"
              type="email"
              placeholder="Contoh: info@sekolah.sch.id"
              class="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              required
              :disabled="isSubmitting"
            />
          </div>

          <!-- Google Maps -->
          <div class="mb-6">
            <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
              URL Google Maps <span class="text-red-600">*</span>
            </label>
            <input
              v-model="formData.gmaps"
              type="url"
              placeholder="Contoh: https://maps.google.com/maps?q=sekolah"
              class="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              required
              :disabled="isSubmitting"
            />
          </div>
        </div>

        <!-- Section 2: Jam Operasional -->
        <div class="mb-8 pb-8 border-b border-gray-200">
          <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <i class="fa-solid fa-clock text-red-600"></i>
            Jam Operasional
          </h2>

          <div class="grid grid-cols-1 gap-4">
            <div v-for="(jam, index) in formData.jam_buka" :key="index" class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 class="font-semibold text-gray-900 mb-4">{{ jam.hari }}</h3>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-2">Jam Buka</label>
                  <input
                    v-model="jam.jam_buka"
                    type="time"
                    class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                    :disabled="isSubmitting"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-2">Jam Tutup</label>
                  <input
                    v-model="jam.jam_tutup"
                    type="time"
                    class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                    :disabled="isSubmitting"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: Media Sosial & Website -->
        <div class="mb-8">
          <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <i class="fa-solid fa-share-nodes text-red-600"></i>
            Media Sosial & Website
          </h2>

          <!-- Website -->
          <div class="mb-6">
            <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
              Website Sekolah
            </label>
            <input
              v-model="formData.website"
              type="url"
              placeholder="Contoh: https://www.sekolah.sch.id"
              class="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              :disabled="isSubmitting"
            />
          </div>

          <!-- Social Media Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- YouTube -->
            <div>
              <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
                <i class="fa-brands fa-youtube text-red-600 mr-2"></i>YouTube
              </label>
              <input
                v-model="formData.youtube"
                type="url"
                placeholder="Contoh: https://youtube.com/@channel"
                class="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                :disabled="isSubmitting"
              />
            </div>

            <!-- Instagram -->
            <div>
              <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
                <i class="fa-brands fa-instagram text-pink-600 mr-2"></i>Instagram
              </label>
              <input
                v-model="formData.instagram"
                type="text"
                placeholder="Contoh: @sekolah"
                class="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                :disabled="isSubmitting"
              />
            </div>

            <!-- TikTok -->
            <div>
              <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
                <i class="fa-brands fa-tiktok text-gray-800 mr-2"></i>TikTok
              </label>
              <input
                v-model="formData.tiktok"
                type="text"
                placeholder="Contoh: @sekolah"
                class="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                :disabled="isSubmitting"
              />
            </div>

            <!-- Facebook -->
            <div>
              <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
                <i class="fa-brands fa-facebook text-blue-600 mr-2"></i>Facebook
              </label>
              <input
                v-model="formData.facebook"
                type="text"
                placeholder="Contoh: Nama Sekolah"
                class="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                :disabled="isSubmitting"
              />
            </div>

            <!-- Twitter/X -->
            <div>
              <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
                <i class="fa-brands fa-x-twitter text-gray-800 mr-2"></i>Twitter/X
              </label>
              <input
                v-model="formData.twitter"
                type="text"
                placeholder="Contoh: @sekolah"
                class="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                :disabled="isSubmitting"
              />
            </div>
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
import { useContactStore } from '~/stores/ContactStore'
import { useToast } from '~/composables/useToast'
import { useAuthGuard } from '~/composables/useAuthGuard'
import DashboardLayout from '~/components/DashboardLayout.vue'
import type { JamBuka, ContactData } from '~/types/ContactType'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const { success: showToast } = useToast()
const contactStore = useContactStore()

// State
const isLoading = ref(false)
const isSubmitting = ref(false)
const submitError = ref<string | null>(null)
const showSuccessMessage = ref(false)
const successMessage = ref('')

const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

const formData = ref<ContactData>({
  id: 1,
  alamat: '',
  telepon: '',
  email: '',
  jam_buka: daysOfWeek.map(hari => ({
    hari,
    jam_buka: '08:00',
    jam_tutup: '17:00',
  })),
  gmaps: '',
  website: '',
  youtube: '',
  instagram: '',
  tiktok: '',
  facebook: '',
  twitter: '',
})

const originalFormData = ref<ContactData>({ ...formData.value })

// Computed property for form validity
const isFormValid = computed(() => {
  return (
    formData.value.alamat.trim() !== '' &&
    formData.value.telepon.trim() !== '' &&
    formData.value.email.trim() !== '' &&
    formData.value.gmaps.trim() !== ''
  )
})

// Fetch initial data
const fetchData = async () => {
  isLoading.value = true
  try {
    const result = await contactStore.fetchContactById(1)

    if (contactStore.contact) {
      formData.value = { ...contactStore.contact }
    } else {
      formData.value = {
        id: 1,
        alamat: '',
        telepon: '',
        email: '',
        jam_buka: daysOfWeek.map(hari => ({
          hari,
          jam_buka: '08:00',
          jam_tutup: '17:00',
        })),
        gmaps: '',
        website: '',
        youtube: '',
        instagram: '',
        tiktok: '',
        facebook: '',
        twitter: '',
      }
    }

    originalFormData.value = JSON.parse(JSON.stringify(formData.value))
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
    const hasExistingData = contactStore.hasContact

    if (hasExistingData) {
      const result = await contactStore.updateExistingContact(1, formData.value)
      
      if (result.success) {
        successMessage.value = 'Data kontak berhasil diperbarui'
        showToast('Berhasil', 'Data kontak berhasil diperbarui')
      } else {
        submitError.value = result.message
      }
    } else {
      const result = await contactStore.createNewContact(formData.value)
      
      if (result.success) {
        successMessage.value = 'Data kontak berhasil ditambahkan'
        showToast('Berhasil', 'Data kontak berhasil ditambahkan')
        
        await fetchData()
      } else {
        submitError.value = result.message
      }
    }

    if (!submitError.value) {
      showSuccessMessage.value = true
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 5000)

      originalFormData.value = JSON.parse(JSON.stringify(formData.value))
    }
  } catch (err: any) {
    if (err.status === 401) {
      const { handle401 } = useAuthGuard()
      await handle401()
      return
    }

    submitError.value = err.message || 'Gagal menyimpan data'
    console.error('Error saving data:', err)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  formData.value = JSON.parse(JSON.stringify(originalFormData.value))
  submitError.value = null
  showSuccessMessage.value = false
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* Smooth transitions */
input:disabled,
textarea:disabled {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

/* Focus states */
input:focus:not(:disabled),
textarea:focus:not(:disabled) {
  border-color: #dc2626;
  ring: 2px;
  --tw-ring-color: #fca5a5;
}
</style>

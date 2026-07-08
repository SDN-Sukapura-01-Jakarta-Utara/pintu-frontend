<template>
  <div class="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
    <div class="w-full max-w-2xl">
      <!-- Header -->
      <div class="text-center mb-8 sm:mb-12">
        <div class="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-red-600 to-red-700 shadow-lg mb-6">
          <i class="fa-solid fa-clipboard-check text-white text-3xl sm:text-4xl"></i>
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          ABSENSI SISWA
        </h1>
        <p class="text-sm sm:text-base md:text-lg text-gray-600">
          Scan barcode kartu pelajar untuk melakukan absensi
        </p>
      </div>

      <!-- Absensi Card -->
      <div class="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden">
        <!-- Card Header -->
        <div class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-6 sm:px-8 py-6 sm:py-8">
          <div class="flex items-center justify-center gap-3">
            <i class="fa-solid fa-barcode text-white text-2xl sm:text-3xl"></i>
            <h2 class="text-xl sm:text-2xl font-bold text-white">Scan Barcode</h2>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-6 sm:p-8 md:p-10">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Barcode Input -->
            <div>
              <label class="block text-base sm:text-lg font-bold text-gray-900 mb-4">
                Kode Barcode
                <span class="text-red-600 ml-1">*</span>
              </label>
              <div class="relative">
                <input
                  ref="barcodeInput"
                  v-model="barcode"
                  type="text"
                  placeholder="Scan atau masukkan kode barcode"
                  required
                  autofocus
                  :disabled="isSubmitting"
                  @keypress.enter.prevent="handleSubmit"
                  class="w-full rounded-xl border-3 border-gray-300 bg-white px-5 sm:px-6 py-4 sm:py-5 text-lg sm:text-xl font-semibold text-center transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div class="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
                  <i class="fa-solid fa-barcode text-2xl sm:text-3xl"></i>
                </div>
              </div>
              <p class="mt-3 text-xs sm:text-sm text-gray-600 text-center">
                <i class="fa-solid fa-circle-info mr-1"></i>
                Arahkan scanner ke barcode atau ketik manual
              </p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="!barcode.trim() || isSubmitting"
              class="w-full px-6 py-4 sm:py-5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-lg sm:text-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 cursor-pointer"
            >
              <i v-if="isSubmitting" class="fa-solid fa-spinner fa-spin text-xl"></i>
              <i v-else class="fa-solid fa-check-circle text-xl"></i>
              <span>{{ isSubmitting ? 'Memproses...' : 'Simpan Absensi' }}</span>
            </button>
          </form>
        </div>
      </div>

      <!-- Info Section -->
      <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Info Card 1 -->
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-5">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <i class="fa-solid fa-clock text-green-600 text-lg"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 mb-1">Jam Operasional</h3>
              <p class="text-sm text-gray-600">Absensi dapat dilakukan sesuai jadwal yang ditentukan</p>
            </div>
          </div>
        </div>

        <!-- Info Card 2 -->
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-5">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <i class="fa-solid fa-id-card text-blue-600 text-lg"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 mb-1">Kartu Pelajar</h3>
              <p class="text-sm text-gray-600">Pastikan menggunakan kartu pelajar yang valid</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: false,
})

useHead({
  title: 'Absensi Siswa | PINTU SDN Sukapura 01',
  meta: [
    { name: 'description', content: 'Sistem Absensi Siswa SDN Sukapura 01' }
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
const config = useRuntimeConfig()

// State
const barcode = ref('')
const isSubmitting = ref(false)
const barcodeInput = ref<HTMLInputElement | null>(null)

// Methods
const handleSubmit = async () => {
  if (!barcode.value.trim()) {
    toast.error('Validasi', 'Mohon scan atau masukkan kode barcode')
    return
  }

  isSubmitting.value = true

  try {
    const response = await $fetch<{
      success: boolean
      message: string
      peserta_didik?: {
        id: number
        nama: string
        nisn: string
      }
      absensi_info?: {
        tanggal: string
        jam_datang: string | null
        jam_pulang: string | null
        status: string
        is_update: boolean
      }
    }>(
      `${config.public.apiBase}/api/v1/public/absensi-siswa`,
      {
        method: 'POST',
        body: {
          barcode: barcode.value.trim()
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (response.success) {
      // Success toast
      const nama = response.peserta_didik?.nama || 'Siswa'
      toast.success('Absensi Berhasil', response.message)
      
      // Clear input and focus
      barcode.value = ''
      setTimeout(() => {
        barcodeInput.value?.focus()
      }, 100)
    } else {
      toast.error('Absensi Gagal', response.message)
      barcode.value = ''
      setTimeout(() => {
        barcodeInput.value?.focus()
      }, 100)
    }
  } catch (error: any) {
    console.error('Error submitting absensi:', error)
    
    // Handle error response
    const errorMessage = error?.data?.message || error?.message || 'Gagal melakukan absensi'
    toast.error('Error', errorMessage)
    
    barcode.value = ''
    setTimeout(() => {
      barcodeInput.value?.focus()
    }, 100)
  } finally {
    isSubmitting.value = false
  }
}

// Auto focus on mount
onMounted(() => {
  setTimeout(() => {
    barcodeInput.value?.focus()
  }, 100)
})
</script>

<style scoped>
/* Custom border width */
.border-3 {
  border-width: 3px;
}

/* Animation for button hover */
@keyframes pulse-shadow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
}
</style>

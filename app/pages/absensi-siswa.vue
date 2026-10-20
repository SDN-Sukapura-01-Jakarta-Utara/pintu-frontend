<template>
  <div class="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-6 px-3 sm:px-6 lg:px-8">
    <div class="w-full max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-red-600 to-red-700 shadow-lg mb-4">
          <i class="fa-solid fa-clipboard-check text-white text-3xl sm:text-4xl"></i>
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          ABSENSI SISWA
        </h1>
        <p class="text-sm sm:text-base md:text-lg text-gray-600">
          Scan barcode kartu pelajar untuk melakukan absensi
        </p>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Left Column: Clock -->
        <div class="order-1 lg:order-1">
          <div class="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl shadow-xl border-2 border-purple-200 p-6 sm:p-8 overflow-hidden h-full flex items-center justify-center">
            <!-- Animated gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-r from-pink-100/50 via-purple-100/50 to-cyan-100/50 animate-gradient-shift"></div>
            
            <!-- Content -->
            <div class="relative w-full">
              <!-- Digital Time Display -->
              <div class="flex items-center justify-center gap-2 sm:gap-3 mb-4">
                <!-- Hours -->
                <div class="bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl px-6 sm:px-8 py-4 sm:py-5 shadow-xl border-2 border-pink-300 transform hover:scale-105 transition-transform">
                  <div class="text-5xl sm:text-6xl md:text-7xl font-black text-white tabular-nums drop-shadow-lg">
                    {{ hours }}
                  </div>
                </div>
                
                <!-- Separator -->
                <div class="text-5xl sm:text-6xl md:text-7xl font-black text-purple-600 animate-blink drop-shadow">
                  :
                </div>
                
                <!-- Minutes -->
                <div class="bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl px-6 sm:px-8 py-4 sm:py-5 shadow-xl border-2 border-purple-300 transform hover:scale-105 transition-transform">
                  <div class="text-5xl sm:text-6xl md:text-7xl font-black text-white tabular-nums drop-shadow-lg">
                    {{ minutes }}
                  </div>
                </div>
                
                <!-- Separator -->
                <div class="text-5xl sm:text-6xl md:text-7xl font-black text-purple-600 animate-blink drop-shadow">
                  :
                </div>
                
                <!-- Seconds -->
                <div class="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl px-6 sm:px-8 py-4 sm:py-5 shadow-xl border-2 border-cyan-300 transform hover:scale-105 transition-transform">
                  <div class="text-5xl sm:text-6xl md:text-7xl font-black text-white tabular-nums drop-shadow-lg">
                    {{ seconds }}
                  </div>
                </div>
              </div>
              
              <!-- Date Display -->
              <div class="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-400 to-indigo-500 backdrop-blur-sm rounded-xl px-5 py-3 border-2 border-purple-300 shadow-lg">
                <i class="fa-solid fa-calendar-days text-white text-base sm:text-lg"></i>
                <div class="text-sm sm:text-base md:text-lg font-bold text-white drop-shadow">
                  {{ currentDate }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Absensi Form -->
        <div class="order-2 lg:order-2">
          <div class="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden h-full">
            <!-- Card Header -->
            <div class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-6 sm:px-8 py-6">
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
                      class="w-full rounded-xl border-3 border-gray-300 bg-white px-5 sm:px-6 py-5 sm:py-6 text-xl sm:text-2xl font-semibold text-center transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div class="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
                      <i class="fa-solid fa-barcode text-3xl"></i>
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
                  class="w-full px-6 py-5 sm:py-6 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-xl sm:text-2xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 cursor-pointer"
                >
                  <i v-if="isSubmitting" class="fa-solid fa-spinner fa-spin text-2xl"></i>
                  <i v-else class="fa-solid fa-check-circle text-2xl"></i>
                  <span>{{ isSubmitting ? 'Memproses...' : 'Simpan Absensi' }}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Section -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Info Card 1 -->
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-5">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <i class="fa-solid fa-clock text-green-600 text-xl"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 mb-1 text-base">Jam Operasional</h3>
              <p class="text-sm text-gray-600">Absensi sesuai jadwal</p>
            </div>
          </div>
        </div>

        <!-- Info Card 2 -->
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-5">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <i class="fa-solid fa-id-card text-blue-600 text-xl"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 mb-1 text-base">Kartu Pelajar</h3>
              <p class="text-sm text-gray-600">Gunakan kartu valid</p>
            </div>
          </div>
        </div>

        <!-- Info Card 3 -->
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-5">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <i class="fa-solid fa-qrcode text-purple-600 text-xl"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 mb-1 text-base">Scan Barcode</h3>
              <p class="text-sm text-gray-600">Posisikan dengan tepat</p>
            </div>
          </div>
        </div>

        <!-- Info Card 4 -->
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-5">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <i class="fa-solid fa-check-double text-orange-600 text-xl"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 mb-1 text-base">Konfirmasi</h3>
              <p class="text-sm text-gray-600">Tunggu notifikasi</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Absensi Result Modal -->
    <ModalsAbsensiResultModal
      :is-open="modalState.isOpen"
      :type="modalState.type"
      :student-name="modalState.studentName"
      :message="modalState.message"
      :error-details="modalState.errorDetails"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue'

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

const config = useRuntimeConfig()

// State
const barcode = ref('')
const isSubmitting = ref(false)
const barcodeInput = ref<HTMLInputElement | null>(null)
const hours = ref('00')
const minutes = ref('00')
const seconds = ref('00')
const currentDate = ref('')

const modalState = reactive<{
  isOpen: boolean
  type: 'success' | 'error' | 'already-saved'
  studentName: string
  message: string
  errorDetails: string
}>({
  isOpen: false,
  type: 'success',
  studentName: '',
  message: '',
  errorDetails: ''
})

// Update time every second
const updateTime = () => {
  const now = new Date()
  
  // Format time components separately for individual boxes
  hours.value = String(now.getHours()).padStart(2, '0')
  minutes.value = String(now.getMinutes()).padStart(2, '0')
  seconds.value = String(now.getSeconds()).padStart(2, '0')
  
  // Format date: Day, DD Month YYYY
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  
  const dayName = days[now.getDay()]
  const date = now.getDate()
  const monthName = months[now.getMonth()]
  const year = now.getFullYear()
  
  currentDate.value = `${dayName}, ${date} ${monthName} ${year}`
}

// Methods
const closeModal = () => {
  modalState.isOpen = false
  barcode.value = ''
  setTimeout(() => {
    barcodeInput.value?.focus()
  }, 100)
}

const handleSubmit = async () => {
  if (!barcode.value.trim()) {
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
      const nama = response.peserta_didik?.nama || 'Siswa'
      
      // Cek apakah sudah absen sebelumnya
      if (response.message.toLowerCase().includes('sudah') || 
          response.message.toLowerCase().includes('telah')) {
        // Already saved
        modalState.type = 'already-saved'
        modalState.studentName = `Selamat Datang ${nama}!`
        modalState.message = response.message
        modalState.errorDetails = ''
      } else {
        // Success
        modalState.type = 'success'
        modalState.studentName = `Selamat Datang ${nama}!`
        modalState.message = response.message
        modalState.errorDetails = ''
      }
      
      modalState.isOpen = true
    } else {
      // Failed
      const nama = response.peserta_didik?.nama || ''
      modalState.type = 'error'
      modalState.studentName = nama ? `Selamat Datang ${nama}!` : ''
      modalState.message = 'Mohon ulangi kembali'
      modalState.errorDetails = response.message
      modalState.isOpen = true
    }
  } catch (error: any) {
    console.error('Error submitting absensi:', error)
    
    // Handle error response
    const errorMessage = error?.data?.message || error?.message || 'Gagal melakukan absensi'
    const nama = error?.data?.peserta_didik?.nama || ''
    
    modalState.type = 'error'
    modalState.studentName = nama ? `Selamat Datang ${nama}!` : ''
    modalState.message = 'Mohon ulangi kembali'
    modalState.errorDetails = errorMessage
    modalState.isOpen = true
  } finally {
    isSubmitting.value = false
  }
}

// Auto focus on mount
onMounted(() => {
  setTimeout(() => {
    barcodeInput.value?.focus()
  }, 100)
  
  // Initialize time
  updateTime()
  
  // Update time every second
  const timeInterval = setInterval(updateTime, 1000)
  
  // Cleanup interval on unmount
  onUnmounted(() => {
    clearInterval(timeInterval)
  })
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

/* Animations for clock */
@keyframes blink {
  0%, 49% {
    opacity: 1;
  }
  50%, 100% {
    opacity: 0.3;
  }
}

@keyframes gradient-shift {
  0%, 100% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
}

.animate-blink {
  animation: blink 1s ease-in-out infinite;
}

.animate-gradient-shift {
  animation: gradient-shift 8s ease-in-out infinite;
}
</style>

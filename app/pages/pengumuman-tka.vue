<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div class="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 container mx-auto px-4 py-8 sm:py-12">
      <!-- Header -->
      <div class="text-center mb-8 sm:mb-12">
        <div class="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-4 sm:mb-6 shadow-lg">
          <i class="fa-solid fa-graduation-cap text-2xl sm:text-3xl text-white"></i>
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
          Pengumuman Nilai TKA
        </h1>
        <p class="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Tes Kemampuan Akademik - SDN Sukapura 01
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="flex flex-col items-center gap-4">
          <div class="h-12 w-12 sm:h-16 sm:w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data...</p>
        </div>
      </div>

      <!-- Countdown Section -->
      <div v-else-if="!isAnnouncementOpen" class="max-w-4xl mx-auto">
        <div class="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 backdrop-blur-sm bg-opacity-90">
          <div class="text-center mb-8 sm:mb-12">
            <div class="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mb-6 shadow-lg animate-pulse">
              <i class="fa-solid fa-clock text-3xl sm:text-4xl text-white"></i>
            </div>
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pengumuman Akan Segera Dibuka
            </h2>
            <p class="text-sm sm:text-base text-gray-600">
              Mohon tunggu hingga waktu pengumuman tiba
            </p>
          </div>

          <!-- Countdown Timer -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div class="rounded-2xl p-4 sm:p-6 text-center shadow-lg transform hover:scale-105 transition-transform" style="background-color: #2563eb;">
              <div class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                {{ countdown.days }}
              </div>
              <div class="text-xs sm:text-sm text-blue-100 uppercase tracking-wider">Hari</div>
            </div>
            <div class="rounded-2xl p-4 sm:p-6 text-center shadow-lg transform hover:scale-105 transition-transform" style="background-color: #9333ea;">
              <div class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                {{ countdown.hours }}
              </div>
              <div class="text-xs sm:text-sm text-purple-100 uppercase tracking-wider">Jam</div>
            </div>
            <div class="rounded-2xl p-4 sm:p-6 text-center shadow-lg transform hover:scale-105 transition-transform" style="background-color: #db2777;">
              <div class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                {{ countdown.minutes }}
              </div>
              <div class="text-xs sm:text-sm text-pink-100 uppercase tracking-wider">Menit</div>
            </div>
            <div class="rounded-2xl p-4 sm:p-6 text-center shadow-lg transform hover:scale-105 transition-transform" style="background-color: #ea580c;">
              <div class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                {{ countdown.seconds }}
              </div>
              <div class="text-xs sm:text-sm text-orange-100 uppercase tracking-wider">Detik</div>
            </div>
          </div>

          <div class="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 sm:p-6">
            <div class="flex items-start gap-3">
              <i class="fa-solid fa-info-circle text-blue-600 text-lg sm:text-xl flex-shrink-0 mt-1"></i>
              <div>
                <p class="text-sm sm:text-base font-semibold text-blue-900 mb-1">Informasi Penting</p>
                <p class="text-xs sm:text-sm text-blue-800">
                  Pengumuman nilai TKA akan dibuka pada <strong>{{ formatDateTime(announcementDate) }}</strong>. 
                  Pastikan Anda memiliki NISN dan tanggal lahir untuk mengecek nilai.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Check Score Section -->
      <div v-else class="max-w-4xl mx-auto">
        <!-- Result Card (if exists) -->
        <div v-if="scoreResult" class="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 backdrop-blur-sm bg-opacity-90 mb-8">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-6 shadow-lg" style="background-color: #10b981;">
              <i class="fa-solid fa-check-circle text-3xl sm:text-4xl text-white"></i>
            </div>
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Data Ditemukan!
            </h2>
            <p class="text-sm sm:text-base text-gray-600">
              Berikut adalah hasil nilai TKA Anda
            </p>
          </div>

          <!-- Student Info -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 mb-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <p class="text-xs sm:text-sm text-gray-600 mb-1">Nomor Peserta</p>
                <p class="text-base sm:text-lg font-bold text-gray-900">{{ scoreResult.nomor_peserta }}</p>
              </div>
              <div>
                <p class="text-xs sm:text-sm text-gray-600 mb-1">NISN</p>
                <p class="text-base sm:text-lg font-bold text-gray-900">{{ scoreResult.nisn }}</p>
              </div>
              <div>
                <p class="text-xs sm:text-sm text-gray-600 mb-1">Nama Lengkap</p>
                <p class="text-base sm:text-lg font-bold text-gray-900">{{ scoreResult.nama }}</p>
              </div>
              <div>
                <p class="text-xs sm:text-sm text-gray-600 mb-1">Tanggal Lahir</p>
                <p class="text-base sm:text-lg font-bold text-gray-900">{{ formatDate(scoreResult.tanggal_lahir) }}</p>
              </div>
            </div>
          </div>

          <!-- Scores -->
          <div class="mb-6">
            <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-4">Nilai Per Mata Pelajaran</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="(nilai, mapel) in scoreResult.nilai" :key="mapel" 
                class="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 hover:border-blue-400 transition-colors">
                <p class="text-sm text-gray-600 mb-2">{{ mapel }}</p>
                <div class="flex items-baseline gap-2">
                  <p class="text-3xl sm:text-4xl font-bold text-blue-600">{{ nilai }}</p>
                  <p class="text-sm text-gray-500">/ 100</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Average Score -->
          <div class="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 sm:p-8 text-center mb-6">
            <p class="text-sm sm:text-base text-gray-600 mb-2">Rata-rata Nilai</p>
            <p class="text-5xl sm:text-6xl font-bold mb-2" style="color: #7c3aed;">
              {{ scoreResult.rata_rata_nilai.toFixed(2) }}
            </p>
            <p class="text-xs sm:text-sm text-gray-500">dari 100</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button @click="resetForm" 
              class="flex-1 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-white font-semibold text-sm sm:text-base hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              style="background-color: #4b5563;">
              <i class="fa-solid fa-arrow-left"></i>
              Kembali
            </button>
            <button @click="navigateToKelulusan" 
              class="flex-1 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm sm:text-base hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer">
              <i class="fa-solid fa-graduation-cap"></i>
              Cek Pengumuman Kelulusan
            </button>
          </div>
        </div>

        <!-- Check Form -->
        <div v-else class="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 backdrop-blur-sm bg-opacity-90">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
              <i class="fa-solid fa-file-alt text-3xl sm:text-4xl text-white"></i>
            </div>
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cek Nilai TKA Anda
            </h2>
            <p class="text-sm sm:text-base text-gray-600">
              Masukkan NISN dan tanggal lahir untuk melihat hasil nilai
            </p>
          </div>

          <form @submit.prevent="handleCheckScore" class="max-w-md mx-auto space-y-6">
            <!-- NISN Input -->
            <div>
              <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
                NISN
                <span class="text-red-600 ml-1">*</span>
              </label>
              <input
                v-model="checkForm.nisn"
                type="text"
                required
                placeholder="Masukkan NISN"
                class="w-full rounded-xl border-2 border-gray-300 bg-white px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition-all duration-200 placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <!-- Date of Birth Input -->
            <div>
              <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
                Tanggal Lahir
                <span class="text-red-600 ml-1">*</span>
              </label>
              <input
                v-model="checkForm.tanggal_lahir"
                type="date"
                required
                class="w-full rounded-xl border-2 border-gray-300 bg-white px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition-all duration-200 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div class="flex items-start gap-3">
                <i class="fa-solid fa-exclamation-circle text-red-600 text-lg flex-shrink-0 mt-0.5"></i>
                <div>
                  <p class="text-sm font-semibold text-red-900 mb-1">Error</p>
                  <p class="text-xs sm:text-sm text-red-800">{{ errorMessage }}</p>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isChecking"
              class="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base sm:text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 cursor-pointer"
            >
              <i v-if="isChecking" class="fa-solid fa-spinner fa-spin text-xl"></i>
              <i v-else class="fa-solid fa-search text-xl"></i>
              <span>{{ isChecking ? 'Mengecek...' : 'Cek Nilai' }}</span>
            </button>
          </form>

          <div class="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-4 sm:p-6">
            <div class="flex items-start gap-3">
              <i class="fa-solid fa-info-circle text-blue-600 text-lg flex-shrink-0 mt-1"></i>
              <div>
                <p class="text-xs sm:text-sm font-semibold text-blue-900 mb-1">Catatan</p>
                <p class="text-xs sm:text-sm text-blue-800">
                  Pastikan NISN dan tanggal lahir yang Anda masukkan sesuai dengan data yang terdaftar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

definePageMeta({
  layout: false,
})

useHead({
  title: 'Pengumuman TKA | Portal Informasi Terpadu',
  meta: [
    { name: 'description', content: 'Pengumuman Nilai TKA (Tes Kemampuan Akhir) Kelas VI SDN Sukapura 01 Jakarta' }
  ]
})

// State
const isLoading = ref(true)
const isAnnouncementOpen = ref(false)
const announcementDate = ref<string>('')
const countdown = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})
const checkForm = ref({
  nisn: '',
  tanggal_lahir: ''
})
const isChecking = ref(false)
const errorMessage = ref('')
const scoreResult = ref<any>(null)

let countdownInterval: NodeJS.Timeout | null = null

// Methods
const fetchSettings = async () => {
  isLoading.value = true
  try {
    const config = useRuntimeConfig()
    const response = await $fetch<{ data: any }>(
      `${config.public.apiBase}/api/v1/public/get-setting-pengumuman-kelulusan`,
      {
        method: 'POST',
        credentials: 'include',
      }
    )

    if (response && response.data) {
      announcementDate.value = response.data.tanggal_pengumuman_nilai
      checkAnnouncementStatus()
      startCountdown()
    }
  } catch (error: any) {
    console.error('Error fetching settings:', error)
  } finally {
    isLoading.value = false
  }
}

const checkAnnouncementStatus = () => {
  if (!announcementDate.value) return

  const now = new Date().getTime()
  const targetDate = new Date(announcementDate.value).getTime()
  
  isAnnouncementOpen.value = now >= targetDate
}

const startCountdown = () => {
  if (!announcementDate.value) return

  const updateCountdown = () => {
    const now = new Date().getTime()
    const targetDate = new Date(announcementDate.value).getTime()
    const distance = targetDate - now

    if (distance < 0) {
      isAnnouncementOpen.value = true
      if (countdownInterval) {
        clearInterval(countdownInterval)
      }
      return
    }

    countdown.value = {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    }
  }

  updateCountdown()
  countdownInterval = setInterval(updateCountdown, 1000)
}

const handleCheckScore = async () => {
  errorMessage.value = ''
  isChecking.value = true

  try {
    const config = useRuntimeConfig()
    const response = await $fetch<{ data: any }>(
      `${config.public.apiBase}/api/v1/public/cek-nilai-kelulusan`,
      {
        method: 'POST',
        body: {
          nisn: checkForm.value.nisn,
          tanggal_lahir: checkForm.value.tanggal_lahir
        },
        credentials: 'include',
      }
    )

    if (response && response.data) {
      scoreResult.value = response.data
    }
  } catch (error: any) {
    console.error('Error checking score:', error)
    errorMessage.value = error?.data?.error || error?.message || 'Data tidak ditemukan. Pastikan NISN dan tanggal lahir sudah benar.'
  } finally {
    isChecking.value = false
  }
}

const resetForm = () => {
  scoreResult.value = null
  checkForm.value = {
    nisn: '',
    tanggal_lahir: ''
  }
  errorMessage.value = ''
}

const navigateToKelulusan = () => {
  navigateTo('/pengumuman-kelulusan')
}

const formatDateTime = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { 
    weekday: 'long',
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  })
}

onMounted(() => {
  fetchSettings()
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>

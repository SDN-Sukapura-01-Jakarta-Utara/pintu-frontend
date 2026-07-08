<template>
  <DashboardLayout>
    <!-- Header Section -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Konfigurasi Absensi</h1>
      <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
        Pengaturan konfigurasi sistem absensi siswa
      </p>
    </div>

    <!-- Main Content -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-8 sm:py-12">
        <div class="flex flex-col items-center gap-3 sm:gap-4">
          <div class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
          <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat konfigurasi...</p>
        </div>
      </div>

      <!-- Configuration Form -->
      <form v-else @submit.prevent="handleSubmit" class="p-4 sm:p-6 space-y-6">
        <!-- Jam Datang -->
        <div>
          <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
            Jam Datang
            <span class="text-red-600 ml-1">*</span>
          </label>
          <p class="text-xs sm:text-sm text-gray-600 mb-3">
            Rentang waktu siswa diperbolehkan untuk melakukan absensi datang
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-2">Dari Jam</label>
              <input
                v-model="form.jam_datang_mulai"
                type="time"
                required
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-2">Sampai Jam</label>
              <input
                v-model="form.jam_datang_selesai"
                type="time"
                required
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>
          </div>
        </div>

        <!-- Jam Datang Maksimum -->
        <div>
          <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
            Jam Datang Maksimum
            <span class="text-red-600 ml-1">*</span>
          </label>
          <p class="text-xs sm:text-sm text-gray-600 mb-3">
            Batas maksimal waktu kedatangan siswa. Siswa yang datang setelah jam ini akan dihitung terlambat
          </p>
          <input
            v-model="form.jam_max_datang"
            type="time"
            required
            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
          />
        </div>

        <!-- Jam Pulang -->
        <div>
          <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
            Jam Pulang
            <span class="text-red-600 ml-1">*</span>
          </label>
          <p class="text-xs sm:text-sm text-gray-600 mb-3">
            Rentang waktu siswa diperbolehkan untuk melakukan absensi pulang
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-2">Dari Jam</label>
              <input
                v-model="form.jam_pulang_mulai"
                type="time"
                required
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-2">Sampai Jam</label>
              <input
                v-model="form.jam_pulang_selesai"
                type="time"
                required
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>
          </div>
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
            v-model="form.nama_kepsek"
            type="text"
            required
            placeholder="Contoh: Drs. Ahmad Suryadi, M.Pd"
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
            v-model="form.nip_kepsek"
            type="text"
            required
            placeholder="Contoh: 196512151990031005"
            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="resetForm"
            :disabled="isSubmitting"
            class="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Reset
          </button>
          <button
            type="submit"
            :disabled="!isFormValid || isSubmitting"
            class="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-sm hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            <i v-if="isSubmitting" class="fa-solid fa-spinner fa-spin"></i>
            <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan Konfigurasi' }}</span>
          </button>
        </div>
      </form>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from '~/composables/useToast'
import { getKonfigurasiAbsensi, saveKonfigurasiAbsensi } from '~/services/absensi'
import DashboardLayout from '~/components/DashboardLayout.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

useHead({
  title: 'Konfigurasi Absensi | PINTU SDN Sukapura 01',
  meta: [
    { name: 'description', content: 'Konfigurasi Absensi Siswa SDN Sukapura 01' }
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

// State
const isLoading = ref(false)
const isSubmitting = ref(false)

const form = ref({
  jam_datang_mulai: '',
  jam_max_datang: '',
  jam_datang_selesai: '',
  jam_pulang_mulai: '',
  jam_pulang_selesai: '',
  nama_kepsek: '',
  nip_kepsek: ''
})

// Computed
const isFormValid = computed(() => {
  return (
    form.value.jam_datang_mulai !== '' &&
    form.value.jam_max_datang !== '' &&
    form.value.jam_datang_selesai !== '' &&
    form.value.jam_pulang_mulai !== '' &&
    form.value.jam_pulang_selesai !== '' &&
    form.value.nama_kepsek.trim() !== '' &&
    form.value.nip_kepsek.trim() !== ''
  )
})

// Methods
const formatTimeForInput = (time: string) => {
  // Convert "HH:MM:SS" to "HH:MM" for time input
  if (!time) return ''
  return time.substring(0, 5)
}

const loadKonfigurasi = async () => {
  isLoading.value = true

  try {
    const response = await getKonfigurasiAbsensi()
    
    if (response.data) {
      // Populate form dengan data yang ada
      form.value = {
        jam_datang_mulai: formatTimeForInput(response.data.jam_datang_mulai),
        jam_max_datang: formatTimeForInput(response.data.jam_max_datang),
        jam_datang_selesai: formatTimeForInput(response.data.jam_datang_selesai),
        jam_pulang_mulai: formatTimeForInput(response.data.jam_pulang_mulai),
        jam_pulang_selesai: formatTimeForInput(response.data.jam_pulang_selesai),
        nama_kepsek: response.data.nama_kepsek,
        nip_kepsek: response.data.nip_kepsek
      }
    }
  } catch (error: any) {
    console.error('Error loading configuration:', error)
    // Jika error, biarkan form kosong (tidak perlu toast error karena data bisa memang belum ada)
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  form.value = {
    jam_datang_mulai: '',
    jam_max_datang: '',
    jam_datang_selesai: '',
    jam_pulang_mulai: '',
    jam_pulang_selesai: '',
    nama_kepsek: '',
    nip_kepsek: ''
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) {
    toast.error('Validasi', 'Mohon lengkapi semua field yang wajib diisi')
    return
  }

  isSubmitting.value = true

  try {
    const response = await saveKonfigurasiAbsensi(form.value)
    
    toast.success('Sukses', response.message || 'Konfigurasi absensi berhasil disimpan')
  } catch (error: any) {
    console.error('Error saving configuration:', error)
    const errorMessage = error?.data?.message || error?.message || 'Gagal menyimpan konfigurasi'
    toast.error('Error', errorMessage)
  } finally {
    isSubmitting.value = false
  }
}

// Load data saat component mount
onMounted(() => {
  loadKonfigurasi()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-300 via-orange-200 to-orange-300 flex items-center justify-center p-4 sm:p-6">
    <div class="w-full max-w-4xl">
      <!-- Header Card -->
      <div class="bg-gradient-to-r from-orange-700 via-orange-600 to-orange-700 rounded-t-3xl border border-orange-400 p-8 sm:p-10">
        <div class="text-center">
          <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <i class="fas fa-user-plus text-3xl text-orange-600"></i>
          </div>
          <h1 class="text-3xl sm:text-4xl font-bold text-white mb-3">
            FORM PELAYANAN POSKO SPMB
          </h1>
          <p class="text-lg text-white/90">
            Sistem Penerimaan Murid Baru SDN Sukapura 01
          </p>
        </div>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-b-3xl shadow-2xl p-6 sm:p-8">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <i class="fas fa-edit text-orange-600"></i>
            Form Layanan SPMB
          </h2>
          <p class="text-sm text-gray-600">
            Silakan isi form di bawah ini untuk mengajukan pertanyaan atau bantuan terkait Penerimaan Murid Baru
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Nama Lengkap Orang Tua -->
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">
              <i class="fas fa-user text-orange-600 mr-1"></i>
              Nama Lengkap Orang Tua <span class="text-orange-600">*</span>
            </label>
            <input
              v-model="form.nama_orang_tua"
              type="text"
              required
              placeholder="Masukkan nama lengkap orang tua"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>

          <!-- Nomor Telepon -->
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">
              <i class="fas fa-phone text-orange-600 mr-1"></i>
              Nomor Telepon/WhatsApp <span class="text-orange-600">*</span>
            </label>
            <input
              v-model="form.nomor_telepon"
              type="tel"
              required
              placeholder="Contoh: 081234567890"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 transition-all text-gray-900 placeholder:text-gray-400"
            />
            <p class="text-xs text-gray-600 mt-1">Gunakan format: 08xxxxxxxxxx</p>
          </div>

          <!-- Alamat Lengkap -->
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">
              <i class="fas fa-map-marker-alt text-orange-600 mr-1"></i>
              Alamat Lengkap <span class="text-orange-600">*</span>
            </label>
            <textarea
              v-model="form.alamat"
              required
              rows="3"
              placeholder="Masukkan alamat lengkap (Jalan, RT/RW, Kelurahan, Kecamatan, Kota)"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 transition-all resize-y text-gray-900 placeholder:text-gray-400"
            ></textarea>
            <p class="text-xs text-gray-600 mt-1">Contoh: Jl. Raya Sukapura No. 123, RT 01/RW 05, Kelurahan Sukapura, Kecamatan Cilincing, Jakarta Utara</p>
          </div>

          <!-- Nama Lengkap Calon Murid -->
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">
              <i class="fas fa-child text-orange-600 mr-1"></i>
              Nama Lengkap Calon Murid Baru <span class="text-orange-600">*</span>
            </label>
            <input
              v-model="form.nama_lengkap_murid"
              type="text"
              required
              placeholder="Masukkan nama lengkap calon murid"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>

          <!-- Keperluan/Permasalahan -->
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">
              <i class="fas fa-align-left text-orange-600 mr-1"></i>
              Keperluan / Permasalahan <span class="text-orange-600">*</span>
            </label>
            <textarea
              v-model="form.keperluan"
              required
              rows="5"
              placeholder="Jelaskan keperluan atau permasalahan Anda terkait Penerimaan Murid Baru..."
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 transition-all resize-y text-gray-900 placeholder:text-gray-400"
            ></textarea>
          </div>

          <!-- Submit Button -->
          <div class="pt-4">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full px-6 py-4 bg-gradient-to-r from-orange-700 to-orange-600 text-white font-bold rounded-xl hover:from-orange-800 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-save"></i>
              <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan Data' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success Modal -->
    <Transition name="fade">
      <div v-if="showSuccessModal" @click="closeSuccessModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
        <div @click.stop class="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-bounce-in">
          <!-- Header -->
          <div class="relative bg-gradient-to-r from-green-600 via-green-500 to-green-600 p-8 text-center overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div class="relative">
              <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <i class="fas fa-check-circle text-4xl text-green-500"></i>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">Data Berhasil Disimpan!</h3>
              <p class="text-white/90 text-sm">Silakan ambil nomor antrian Anda</p>
            </div>
          </div>
          
          <!-- Body -->
          <div class="p-8">
            <div class="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mb-6">
              <div class="flex items-start gap-3">
                <i class="fas fa-info-circle text-orange-600 text-xl mt-1 flex-shrink-0"></i>
                <div class="text-sm text-gray-800">
                  <p class="font-semibold text-gray-900 mb-2">Langkah Selanjutnya:</p>
                  <ul class="space-y-2">
                    <li class="flex items-start gap-2">
                      <i class="fas fa-ticket-alt text-orange-600 mt-0.5 flex-shrink-0"></i>
                      <span>Silakan mengambil <strong>nomor antrian</strong></span>
                    </li>
                    <li class="flex items-start gap-2">
                      <i class="fas fa-clock text-orange-600 mt-0.5 flex-shrink-0"></i>
                      <span>Tunggu panggilan dari <strong>panitia SPMB</strong></span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <a 
              :href="grupWhatsAppUrl"
              target="_blank"
              class="w-full px-6 py-3.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mb-3"
            >
              <i class="fab fa-whatsapp text-xl"></i>
              <span>Gabung Grup SPMB SDN Sukapura 01</span>
            </a>

            <button 
              @click="closeSuccessModal" 
              class="w-full px-6 py-3 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast Notification -->
    <Transition name="slide-down">
      <div v-if="toast.show" class="fixed top-4 right-4 z-[110] max-w-md">
        <div 
          class="rounded-xl shadow-2xl overflow-hidden animate-shake"
          :class="{
            'bg-gradient-to-r from-red-600 to-red-500': toast.type === 'error',
            'bg-gradient-to-r from-orange-600 to-orange-500': toast.type === 'warning',
            'bg-gradient-to-r from-green-600 to-green-500': toast.type === 'success'
          }"
        >
          <div class="p-4 flex items-start gap-3">
            <div class="flex-shrink-0">
              <i v-if="toast.type === 'error'" class="fas fa-exclamation-circle text-white text-xl"></i>
              <i v-if="toast.type === 'warning'" class="fas fa-exclamation-triangle text-white text-xl"></i>
              <i v-if="toast.type === 'success'" class="fas fa-check-circle text-white text-xl"></i>
            </div>
            <div class="flex-1">
              <p class="text-white font-semibold text-sm">{{ toast.message }}</p>
            </div>
            <button @click="toast.show = false" class="flex-shrink-0 text-white/80 hover:text-white">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Meta tags
useHead({
  title: 'Form Layanan Posko SPMB | Portal Informasi Terpadu',
  meta: [
    { name: 'description', content: 'Form Layanan Posko SPMB SDN Sukapura 01' }
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/jpeg',
      href: '/logo-sekolah.jpg'
    }
  ]
})

// Form data
const form = ref({
  nama_orang_tua: '',
  nomor_telepon: '',
  alamat: '',
  nama_lengkap_murid: '',
  keperluan: ''
})

// States
const isSubmitting = ref(false)
const showSuccessModal = ref(false)
const grupWhatsAppUrl = ref('')
const toast = ref({
  show: false,
  type: 'success' as 'success' | 'error' | 'warning',
  message: ''
})

// Show toast
const showToast = (type: 'success' | 'error' | 'warning', message: string) => {
  toast.value = { show: true, type, message }
  setTimeout(() => {
    toast.value.show = false
  }, 5000)
}

// Handle submit
const handleSubmit = async () => {
  try {
    isSubmitting.value = true

    // Validate phone number
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/
    if (!phoneRegex.test(form.value.nomor_telepon)) {
      showToast('error', 'Format nomor telepon tidak valid. Gunakan format 08xxxxxxxxxx')
      return
    }

    const config = useRuntimeConfig()
    const response = await $fetch(`${config.public.apiBase}/api/v1/public/layanan-spmb`, {
      method: 'POST',
      body: {
        nama_orang_tua: form.value.nama_orang_tua,
        nomor_telepon: form.value.nomor_telepon,
        alamat: form.value.alamat,
        nama_lengkap_murid: form.value.nama_lengkap_murid,
        keperluan: form.value.keperluan
      }
    })

    // Get WhatsApp group URL
    const grupResponse: any = await $fetch(`${config.public.apiBase}/api/v1/public/get-grup-wa-spmb`, {
      method: 'POST'
    })
    grupWhatsAppUrl.value = grupResponse.data.grup_wa

    // Show success modal
    showSuccessModal.value = true

    // Reset form
    form.value = {
      nama_orang_tua: '',
      nomor_telepon: '',
      alamat: '',
      nama_lengkap_murid: '',
      keperluan: ''
    }
  } catch (error: any) {
    console.error('Error submitting form:', error)
    
    const errorMessage = error?.data?.message || error?.message || 'Terjadi kesalahan saat mengirim permohonan'
    showToast('error', errorMessage)
  } finally {
    isSubmitting.value = false
  }
}

// Close success modal
const closeSuccessModal = () => {
  showSuccessModal.value = false
}
</script>

<style scoped>
/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-bounce-in {
  animation: bounceIn 0.5s ease-out;
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.animate-shake {
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c2410c;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9a3412;
}
</style>

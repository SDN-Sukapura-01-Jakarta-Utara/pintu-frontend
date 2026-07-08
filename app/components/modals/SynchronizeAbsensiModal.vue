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
      class="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 pointer-events-none"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <i class="fa-solid fa-sync text-white text-lg"></i>
              </div>
              <h3 class="text-lg font-bold text-white">Synchronize Data Absensi</h3>
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
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <!-- Tipe Sync (hanya untuk Guru Kelas) -->
            <div v-if="!isGuruMapel">
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Tipe Sinkronisasi <span class="text-red-600">*</span>
              </label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  @click="formData.tipe_sync = 'tanggal'"
                  :class="[
                    'px-4 py-3 rounded-lg border-2 font-semibold text-sm transition-all cursor-pointer',
                    formData.tipe_sync === 'tanggal'
                      ? 'bg-blue-50 border-blue-600 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  ]"
                  :disabled="isSubmitting"
                >
                  <i class="fa-solid fa-calendar-day mr-2"></i>
                  By Tanggal
                </button>
                <button
                  type="button"
                  @click="formData.tipe_sync = 'bulan'"
                  :class="[
                    'px-4 py-3 rounded-lg border-2 font-semibold text-sm transition-all cursor-pointer',
                    formData.tipe_sync === 'bulan'
                      ? 'bg-blue-50 border-blue-600 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  ]"
                  :disabled="isSubmitting"
                >
                  <i class="fa-solid fa-calendar-alt mr-2"></i>
                  By Bulan
                </button>
              </div>
            </div>

            <!-- Tanggal (untuk by tanggal) -->
            <div v-if="formData.tipe_sync === 'tanggal'">
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Tanggal <span class="text-red-600">*</span>
              </label>
              <input
                v-model="formData.tanggal"
                type="date"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                required
                :disabled="isSubmitting"
              />
            </div>

            <!-- Bulan & Tahun (untuk by bulan, hanya Guru Kelas) -->
            <div v-if="!isGuruMapel && formData.tipe_sync === 'bulan'" class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">
                  Bulan <span class="text-red-600">*</span>
                </label>
                <select
                  v-model.number="formData.bulan"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                  required
                  :disabled="isSubmitting"
                >
                  <option :value="1">Januari</option>
                  <option :value="2">Februari</option>
                  <option :value="3">Maret</option>
                  <option :value="4">April</option>
                  <option :value="5">Mei</option>
                  <option :value="6">Juni</option>
                  <option :value="7">Juli</option>
                  <option :value="8">Agustus</option>
                  <option :value="9">September</option>
                  <option :value="10">Oktober</option>
                  <option :value="11">November</option>
                  <option :value="12">Desember</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">
                  Tahun <span class="text-red-600">*</span>
                </label>
                <input
                  v-model.number="formData.tahun"
                  type="number"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                  required
                  :disabled="isSubmitting"
                  min="2000"
                  max="2100"
                />
              </div>
            </div>

            <!-- Pertemuan Ke (hanya untuk Guru Mapel) -->
            <div v-if="isGuruMapel">
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Pertemuan Ke <span class="text-red-600">*</span>
              </label>
              <select
                v-model.number="formData.pertemuan_ke"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                required
                :disabled="isSubmitting"
              >
                <option v-for="n in 20" :key="n" :value="n">Pertemuan {{ n }}</option>
              </select>
            </div>

            <!-- Info Box -->
            <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex gap-3">
                <i class="fa-solid fa-info-circle text-blue-600 text-base flex-shrink-0 mt-0.5"></i>
                <div class="flex-1 text-sm">
                  <p class="font-semibold text-blue-900">Informasi</p>
                  <p class="text-blue-800 mt-1">
                    Sinkronisasi akan memproses data absensi dari sistem fingerprint dan menyimpannya ke database.
                  </p>
                </div>
              </div>
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

            <!-- Success Message with Details -->
            <div v-if="successData" class="space-y-3">
              <div class="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <div class="flex gap-3">
                  <i class="fa-solid fa-check-circle text-green-600 text-base flex-shrink-0 mt-0.5"></i>
                  <div class="flex-1 text-sm">
                    <p class="font-semibold text-green-900">Berhasil</p>
                    <p class="text-green-800 mt-1">{{ successData.message }}</p>
                  </div>
                </div>
              </div>

              <!-- Summary Stats -->
              <div class="grid grid-cols-2 gap-3">
                <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p class="text-xs text-blue-600 font-semibold">Total Diproses</p>
                  <p class="text-2xl font-bold text-blue-900">{{ successData.total_processed }}</p>
                </div>
                <div class="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p class="text-xs text-green-600 font-semibold">Ditambahkan</p>
                  <p class="text-2xl font-bold text-green-900">{{ successData.total_inserted }}</p>
                </div>
                <div class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p class="text-xs text-yellow-600 font-semibold">Diupdate</p>
                  <p class="text-2xl font-bold text-yellow-900">{{ successData.total_updated }}</p>
                </div>
                <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p class="text-xs text-gray-600 font-semibold">Dilewati</p>
                  <p class="text-2xl font-bold text-gray-900">{{ successData.total_skipped }}</p>
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
                {{ successData ? 'Tutup' : 'Batal' }}
              </button>
              <button
                v-if="!successData"
                type="submit"
                :disabled="isSubmitting"
                class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg text-white font-semibold rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <i v-else class="fa-solid fa-sync"></i>
                <span>{{ isSubmitting ? 'Menyinkronkan...' : 'Mulai Sinkronisasi' }}</span>
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
import { synchronizeAbsensi } from '~/services/absensi'
import { useToast } from '~/composables/useToast'

const props = defineProps<{
  isOpen: boolean
  tahunPelajaranId: number
  rombelId: number
  bidangStudiId: number | null
  isGuruMapel: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'synchronized'): void
}>()

const { success: showToast, error: showErrorToast } = useToast()

const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)
const successData = ref<any>(null)

const today = new Date()
const formData = ref({
  tipe_sync: 'tanggal',
  tanggal: today.toISOString().split('T')[0],
  bulan: today.getMonth() + 1,
  tahun: today.getFullYear(),
  pertemuan_ke: 1
})

const closeModal = () => {
  if (!isSubmitting.value) {
    errorMessage.value = null
    successData.value = null
    emit('close')
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  errorMessage.value = null
  successData.value = null

  try {
    const requestData: any = {
      tipe_sync: formData.value.tipe_sync,
      tahun_pelajaran_id: props.tahunPelajaranId,
      rombel_id: props.rombelId,
      bidang_studi_id: props.bidangStudiId
    }

    if (formData.value.tipe_sync === 'tanggal') {
      requestData.tanggal = formData.value.tanggal
      
      // Add pertemuan_ke for Guru Mapel
      if (props.isGuruMapel) {
        requestData.pertemuan_ke = formData.value.pertemuan_ke
      }
    } else {
      requestData.bulan = formData.value.bulan
      requestData.tahun = formData.value.tahun
    }

    const response = await synchronizeAbsensi(requestData)

    if (response.data) {
      successData.value = response.data
      showToast('Berhasil', response.data.message || 'Sinkronisasi berhasil')
      
      // Emit synchronized event after short delay
      setTimeout(() => {
        emit('synchronized')
      }, 1500)
    }
  } catch (err: any) {
    console.error('Error synchronizing attendance:', err)
    const errorMsg = err.data?.error || err.data?.message || err.response?.data?.error || err.response?.data?.message || err.message || 'Gagal menyinkronkan data'
    errorMessage.value = errorMsg
    showErrorToast('Gagal', errorMsg)
  } finally {
    isSubmitting.value = false
  }
}

// Reset form when modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    const today = new Date()
    formData.value = {
      tipe_sync: props.isGuruMapel ? 'tanggal' : 'tanggal',
      tanggal: today.toISOString().split('T')[0],
      bulan: today.getMonth() + 1,
      tahun: today.getFullYear(),
      pertemuan_ke: 1
    }
    errorMessage.value = null
    successData.value = null
  }
})
</script>

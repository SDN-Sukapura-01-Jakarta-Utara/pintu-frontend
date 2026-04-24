<template>
  <!-- Backdrop -->
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="modelValue"
      @click="closeModal"
      class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
    ></div>
  </Transition>

  <!-- Modal -->
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-95 translate-y-4"
    enter-to-class="opacity-100 scale-100 translate-y-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100 translate-y-0"
    leave-to-class="opacity-0 scale-95 translate-y-4"
  >
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none"
    >
      <div
        class="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]"
      >
        <!-- Header with Red Gradient Background -->
        <div
          class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4"
        >
          <!-- Animated gradient blobs -->
          <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
          <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

          <!-- Header Content -->
          <div class="relative z-10 flex-1">
            <h2 class="text-lg sm:text-xl font-bold text-white">Tambah Struktur Organisasi</h2>
          </div>

          <!-- Close Button -->
          <button
            type="button"
            @click.stop="closeModal"
            :disabled="isSubmitting"
            :title="'Tutup'"
            class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 disabled:opacity-50 backdrop-blur-sm cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Body with padding and scrollbar -->
        <div class="p-4 sm:p-8 relative z-10 overflow-y-auto flex-1">
          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
            <!-- Tipe Pegawai -->
            <div>
              <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                Pilih Tipe Pegawai
                <span class="text-red-600 ml-1">*</span>
              </label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="form.tipeInput"
                    type="radio"
                    value="pegawai"
                    class="w-4 h-4 rounded-full border-2 border-gray-300 text-red-600 focus:ring-2 focus:ring-red-500 transition-all duration-200 cursor-pointer"
                  />
                  <span class="text-xs sm:text-sm font-medium text-gray-700">Pegawai</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="form.tipeInput"
                    type="radio"
                    value="non-pegawai"
                    class="w-4 h-4 rounded-full border-2 border-gray-300 text-red-600 focus:ring-2 focus:ring-red-500 transition-all duration-200 cursor-pointer"
                  />
                  <span class="text-xs sm:text-sm font-medium text-gray-700">Non Pegawai</span>
                </label>
              </div>
            </div>

            <!-- Pegawai Selection -->
            <div v-if="form.tipeInput === 'pegawai'">
              <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                Pilih Pegawai
                <span class="text-red-600 ml-1">*</span>
              </label>
              <select
                v-model.number="form.pegawai_id"
                required
                :disabled="isSubmitting || isLoadingPegawai"
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer"
              >
                <option :value="null">-- Pilih Pegawai --</option>
                <option v-for="pegawai in allPegawais" :key="pegawai.id" :value="pegawai.id">
                  {{ pegawai.nama }} - {{ pegawai.jabatan }}
                </option>
              </select>
            </div>

            <!-- Jabatan (disabled when pegawai selected) -->
            <div v-if="form.tipeInput === 'pegawai'">
              <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                Jabatan
              </label>
              <input
                :value="selectedPegawaiJabatan"
                type="text"
                disabled
                class="w-full rounded-lg border-2 border-gray-300 bg-gray-100 px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-600 cursor-not-allowed"
              />
            </div>

            <!-- Non-Pegawai Section -->
            <div v-if="form.tipeInput === 'non-pegawai'" class="space-y-4 sm:space-y-6">
              <!-- Nama Non-Pegawai -->
              <div>
                <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                  Nama
                  <span class="text-red-600 ml-1">*</span>
                </label>
                <input
                  v-model="form.nama_non_pegawai"
                  type="text"
                  placeholder="Masukkan nama"
                  required
                  :disabled="isSubmitting"
                  class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <!-- Jabatan Non-Pegawai -->
              <div>
                <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                  Jabatan
                  <span class="text-red-600 ml-1">*</span>
                </label>
                <input
                  v-model="form.jabatan_non_pegawai"
                  type="text"
                  placeholder="Masukkan jabatan"
                  required
                  :disabled="isSubmitting"
                  class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <!-- Urutan and Relasi Row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <!-- Urutan -->
              <div>
                <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                  Urutan
                  <span class="text-red-600 ml-1">*</span>
                </label>
                <select
                  v-model.number="form.urutan"
                  required
                  :disabled="isSubmitting"
                  class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer"
                >
                  <option value="">-- Pilih Urutan --</option>
                  <option v-for="i in 10" :key="i" :value="i">{{ i }}</option>
                </select>
              </div>

              <!-- Relasi -->
              <div>
                <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                  Relasi
                  <span class="text-red-600 ml-1">*</span>
                </label>
                <select
                  v-model="form.relasi"
                  required
                  :disabled="isSubmitting"
                  class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer"
                >
                  <option value="">-- Pilih Relasi --</option>
                  <option value="Komando">Komando</option>
                  <option value="Koordinasi">Koordinasi</option>
                </select>
              </div>
            </div>

            <!-- Status Toggle -->
            <div class="pt-3 sm:pt-4 border-t border-gray-200">
              <div class="flex items-center justify-between">
                <label class="text-[13px] sm:text-[15px] font-semibold text-gray-900">Status</label>
                <button
                  type="button"
                  @click="form.status = form.status === 'active' ? 'inactive' : 'active'"
                  :disabled="isSubmitting"
                  :class="[
                    'relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300',
                    form.status === 'active' ? 'bg-green-600' : 'bg-gray-300',
                    isSubmitting && 'opacity-50 cursor-not-allowed'
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-md',
                      form.status === 'active' ? 'translate-x-7' : 'translate-x-1'
                    ]"
                  ></span>
                </button>
              </div>
              <div class="mt-2 flex items-center gap-2">
                <span
                  :class="[
                    'px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold',
                    form.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ form.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                </span>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex gap-3 pt-4 sm:pt-6">
              <button
                type="button"
                @click="closeModal"
                :disabled="isSubmitting"
                class="flex-1 flex items-center justify-center gap-2 px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fa-solid fa-times w-4 h-4"></i>
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="flex-1 flex items-center justify-center gap-2 px-4 py-2 sm:py-3 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i v-if="!isSubmitting" class="fa-solid fa-check w-4 h-4"></i>
                <i v-else class="fa-solid fa-spinner w-4 h-4 animate-spin"></i>
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useToastStore } from '~/stores/ToastStore'
import { useStrukturOrganisasiStore } from '~/stores/StrukturOrganisasiStore'
import { getKepegawaianWithoutPagination } from '~/services/kepegawaian'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  success: []
  error: []
}>()

const toastStore = useToastStore()
const strukturOrganisasiStore = useStrukturOrganisasiStore()

const isSubmitting = ref(false)
const isLoadingPegawai = ref(false)
const pegawaiList = ref<any[]>([])

const form = ref({
  tipeInput: 'pegawai' as 'pegawai' | 'non-pegawai',
  pegawai_id: null as number | null,
  nama_non_pegawai: '',
  jabatan_non_pegawai: '',
  urutan: null as number | null,
  relasi: '' as 'Komando' | 'Koordinasi' | '',
  status: 'active' as 'active' | 'inactive',
})

const allPegawais = computed(() => {
  return pegawaiList.value
})

const selectedPegawaiJabatan = computed(() => {
  if (!form.value.pegawai_id) return '-'
  const pegawai = allPegawais.value.find(p => p.id === form.value.pegawai_id)
  return pegawai?.jabatan || '-'
})

const loadPegawaiList = async () => {
  isLoadingPegawai.value = true
  try {
    const response = await getKepegawaianWithoutPagination()
    pegawaiList.value = response.data || []
  } catch (error) {
    console.error('Error loading pegawai:', error)
    toastStore.error('Gagal', 'Gagal memuat data pegawai')
  } finally {
    isLoadingPegawai.value = false
  }
}

const closeModal = () => {
  emit('update:modelValue', false)
  resetForm()
}

const resetForm = () => {
  form.value = {
    tipeInput: 'pegawai',
    pegawai_id: null,
    nama_non_pegawai: '',
    jabatan_non_pegawai: '',
    urutan: null,
    relasi: '',
    status: 'active',
  }
}

const handleSubmit = async () => {
  if (isSubmitting.value) return

  isSubmitting.value = true
  try {
    const submitData = {
      pegawai_id: form.value.tipeInput === 'pegawai' ? form.value.pegawai_id : null,
      nama_non_pegawai: form.value.tipeInput === 'non-pegawai' ? form.value.nama_non_pegawai : '',
      jabatan_non_pegawai: form.value.tipeInput === 'non-pegawai' ? form.value.jabatan_non_pegawai : '',
      urutan: form.value.urutan,
      relasi: form.value.relasi,
      status: form.value.status,
    }

    await strukturOrganisasiStore.createItem(submitData)
    toastStore.success('Berhasil', 'Struktur organisasi berhasil ditambahkan')
    emit('success')
    closeModal()
  } catch (error: any) {
    toastStore.error('Gagal', error.message || 'Gagal menambahkan struktur organisasi')
    emit('error')
  } finally {
    isSubmitting.value = false
  }
}

watch(
  () => props.modelValue,
  async (newVal) => {
    if (newVal) {
      await loadPegawaiList()
    }
  }
)
</script>

<template>
    <!-- Backdrop -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="modelValue" @click="closeModal" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"></div>
    </Transition>

    <!-- Modal -->
    <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4">
        <div v-if="modelValue"
            class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div
                class="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-2xl w-full max-w-3xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]">

                <!-- Header with Red Gradient Background -->
                <div
                    class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <!-- Animated gradient blobs -->
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

                    <!-- Header Content -->
                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Edit Data Kelulusan</h2>
                    </div>

                    <!-- Close Button -->
                    <button type="button" @click.stop="closeModal" :disabled="isSubmitting || isLoading" :title="'Tutup'"
                        class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 disabled:opacity-50 backdrop-blur-sm cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Body with padding and scrollbar -->
                <div class="p-4 sm:p-8 relative z-10 overflow-y-auto flex-1">
                    <!-- Loading State -->
                    <div v-if="isLoading" class="flex items-center justify-center py-12">
                        <div class="flex flex-col items-center gap-3">
                            <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
                            <p class="text-sm text-gray-600 font-medium">Memuat data...</p>
                        </div>
                    </div>

                    <!-- Form -->
                    <form v-else @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
                        <!-- Nomor Peserta Input -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Nomor Peserta
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <input v-model="form.nomor_peserta" type="text" placeholder="Contoh: 2024-001-002" required
                                :disabled="isSubmitting"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>

                        <!-- NISN and Nama Row -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <!-- NISN Input -->
                            <div>
                                <label
                                    class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    NISN
                                    <span class="text-red-600 ml-1">*</span>
                                </label>
                                <input v-model="form.nisn" type="text" placeholder="Nomor Induk Siswa Nasional" required
                                    :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                            </div>

                            <!-- Nama Lengkap Input -->
                            <div>
                                <label
                                    class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    Nama Lengkap
                                    <span class="text-red-600 ml-1">*</span>
                                </label>
                                <input v-model="form.nama" type="text" placeholder="Nama lengkap siswa" required
                                    :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                            </div>
                        </div>

                        <!-- Tanggal Lahir -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Tanggal Lahir
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <input v-model="form.tanggal_lahir" type="date" required :disabled="isSubmitting"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>

                        <!-- Input Nilai Section -->
                        <div>
                            <div class="flex items-center justify-between mb-3">
                                <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900">
                                    Input Nilai
                                    <span class="text-red-600 ml-1">*</span>
                                </label>
                                <button type="button" @click="addNilai" :disabled="isSubmitting"
                                    class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    <i class="fa-solid fa-plus w-3 h-3"></i>
                                    Tambah Mapel
                                </button>
                            </div>

                            <!-- Nilai List -->
                            <div class="space-y-3">
                                <div v-for="(nilai, index) in nilaiList" :key="index"
                                    class="flex items-start gap-3 p-3 bg-white rounded-lg border-2 border-gray-200">
                                    <!-- Mata Pelajaran (Kiri) -->
                                    <div class="flex-1">
                                        <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                                            Mata Pelajaran
                                        </label>
                                        <input v-model="nilai.mapel" type="text" placeholder="Contoh: Matematika"
                                            required :disabled="isSubmitting"
                                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-xs font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                                    </div>

                                    <!-- Nilai (Kanan) -->
                                    <div class="w-32">
                                        <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                                            Nilai
                                        </label>
                                        <input v-model="nilai.nilai" type="text" 
                                            placeholder="0-100" required :disabled="isSubmitting"
                                            @input="validateNilai(nilai)"
                                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-xs font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                                    </div>

                                    <!-- Delete Button (Paling Kanan) -->
                                    <div class="flex items-end pt-6">
                                        <button type="button" @click="removeNilai(index)"
                                            :disabled="isSubmitting || nilaiList.length === 1"
                                            class="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                            <i class="fa-solid fa-trash w-4 h-4"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Status Lulus -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Status Lulus
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <select v-model="form.lulus" required :disabled="isSubmitting"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <option :value="null">Pilih Status</option>
                                <option :value="true">Lulus</option>
                                <option :value="false">Tidak Lulus</option>
                            </select>
                        </div>

                        <!-- Percobaan Buka Pengumuman -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Percobaan Buka Pengumuman
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <input v-model.number="form.max_attempts" type="number" min="1" max="5" placeholder="Maksimal 5 percobaan" required
                                :disabled="isSubmitting"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                            <p class="mt-1.5 text-xs text-gray-500">
                                <i class="fa-solid fa-info-circle mr-1"></i>
                                Jumlah percobaan siswa untuk membuka pengumuman (1-5 kali)
                            </p>
                        </div>

                        <!-- Upload SKL -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Upload SKL (Surat Keterangan Lulus)
                                <span class="text-gray-500 text-xs font-normal ml-1">(Opsional, Maks. 2 MB)</span>
                            </label>

                            <!-- Current SKL Display -->
                            <div v-if="currentSklUrl && !deleteSklFlag" class="mb-3 p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                                <div class="flex items-center justify-between gap-3">
                                    <div class="flex items-center gap-3 min-w-0 flex-1">
                                        <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <i class="fa-solid fa-file-pdf text-lg text-blue-600"></i>
                                        </div>
                                        <div class="min-w-0 flex-1">
                                            <p class="text-xs font-semibold text-gray-900">Dokumen SKL Saat Ini</p>
                                            <p class="text-[11px] text-gray-500 truncate">{{ currentSklUrl }}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2 flex-shrink-0">
                                        <a :href="currentSklUrl" target="_blank" rel="noopener noreferrer"
                                            class="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 cursor-pointer">
                                            <i class="fa-solid fa-eye w-4 h-4"></i>
                                        </a>
                                        <button type="button" @click="markSklForDeletion" :disabled="isSubmitting"
                                            class="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                            <i class="fa-solid fa-trash w-4 h-4"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Deleted SKL Notice -->
                            <div v-if="deleteSklFlag" class="mb-3 p-3 bg-red-50 rounded-lg border-2 border-red-200">
                                <div class="flex items-center justify-between gap-3">
                                    <div class="flex items-center gap-2">
                                        <i class="fa-solid fa-trash text-red-600"></i>
                                        <p class="text-xs font-semibold text-red-900">SKL akan dihapus saat menyimpan</p>
                                    </div>
                                    <button type="button" @click="undoSklDeletion" :disabled="isSubmitting"
                                        class="text-xs font-semibold text-red-600 hover:text-red-700 underline">
                                        Batalkan
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Custom File Upload -->
                            <div class="relative">
                                <input 
                                    ref="fileInputRef"
                                    type="file" 
                                    @change="handleFileChange" 
                                    accept="image/*,.pdf" 
                                    :disabled="isSubmitting"
                                    class="hidden"
                                    id="skl-upload-edit"
                                />
                                
                                <!-- Custom Upload Button -->
                                <label 
                                    for="skl-upload-edit"
                                    :class="[
                                        'flex items-center justify-center gap-3 w-full rounded-lg border-2 border-dashed px-4 py-6 transition-all duration-200 cursor-pointer',
                                        isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:border-red-500 hover:bg-red-50',
                                        fileError ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                                    ]"
                                >
                                    <div class="flex flex-col items-center gap-2">
                                        <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                            <i class="fa-solid fa-cloud-arrow-up text-xl text-red-600"></i>
                                        </div>
                                        <div class="text-center">
                                            <p class="text-sm font-semibold text-gray-900">
                                                {{ newSklFile ? newSklFile.name : 'Klik untuk upload file baru' }}
                                            </p>
                                            <p class="text-xs text-gray-500 mt-1">
                                                Format: JPG, PNG, PDF (Maks. 2 MB)
                                            </p>
                                        </div>
                                    </div>
                                </label>

                                <!-- Remove File Button -->
                                <button 
                                    v-if="newSklFile"
                                    type="button"
                                    @click="removeNewFile"
                                    :disabled="isSubmitting"
                                    class="absolute top-2 right-2 p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    <i class="fa-solid fa-times w-4 h-4"></i>
                                </button>
                            </div>

                            <!-- Error Message -->
                            <p v-if="fileError" class="mt-2 text-xs text-red-600 flex items-center gap-1">
                                <i class="fa-solid fa-circle-exclamation"></i>
                                {{ fileError }}
                            </p>

                            <!-- Success Message -->
                            <p v-else-if="newSklFile" class="mt-2 text-xs text-green-600 flex items-center gap-1">
                                <i class="fa-solid fa-circle-check"></i>
                                File baru berhasil dipilih
                            </p>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-200">
                            <button type="button" @click="closeModal" :disabled="isSubmitting"
                                class="flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-semibold text-xs sm:text-sm hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                Batal
                            </button>
                            <button type="submit" :disabled="isSubmitting"
                                class="flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold text-xs sm:text-sm hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2">
                                <i v-if="isSubmitting" class="fa-solid fa-spinner fa-spin"></i>
                                <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
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
import { getDataKelulusanById, updateDataKelulusan } from '~/services/kelulusan'
import { useToast } from '~/composables/useToast'

const props = defineProps<{
    modelValue: boolean
    kelulusanId: number
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'success': []
    'error': [message: string]
}>()

const toast = useToast()

const isLoading = ref(false)
const isSubmitting = ref(false)
const fileError = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)

const form = ref({
    id: 0,
    nomor_peserta: '',
    nisn: '',
    nama: '',
    tanggal_lahir: '',
    lulus: null as boolean | null,
    max_attempts: 3
})

const nilaiList = ref<Array<{ mapel: string; nilai: string | number }>>([
    { mapel: '', nilai: '' }
])

const currentSklUrl = ref('')
const newSklFile = ref<File | null>(null)
const deleteSklFlag = ref(false)

// Methods
const validateNilai = (nilai: { mapel: string; nilai: string | number }) => {
    const value = String(nilai.nilai)
    const cleaned = value.replace(/[^\d.]/g, '')
    
    const parts = cleaned.split('.')
    if (parts.length > 2) {
        nilai.nilai = parts[0] + '.' + parts.slice(1).join('')
    } else {
        nilai.nilai = cleaned
    }
    
    const numValue = parseFloat(String(nilai.nilai))
    if (!isNaN(numValue) && numValue > 100) {
        nilai.nilai = '100'
    }
}

const addNilai = () => {
    nilaiList.value.push({ mapel: '', nilai: '' })
}

const removeNilai = (index: number) => {
    if (nilaiList.value.length > 1) {
        nilaiList.value.splice(index, 1)
    }
}

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    fileError.value = ''

    if (file) {
        if (file.size > 2 * 1024 * 1024) {
            fileError.value = 'Ukuran file tidak boleh lebih dari 2 MB'
            target.value = ''
            newSklFile.value = null
            return
        }
        newSklFile.value = file
    } else {
        newSklFile.value = null
    }
}

const removeNewFile = () => {
    newSklFile.value = null
    fileError.value = ''
    if (fileInputRef.value) {
        fileInputRef.value.value = ''
    }
}

const markSklForDeletion = () => {
    deleteSklFlag.value = true
}

const undoSklDeletion = () => {
    deleteSklFlag.value = false
}

const loadData = async () => {
    if (!props.kelulusanId) return

    isLoading.value = true

    try {
        const response = await getDataKelulusanById({ id: props.kelulusanId })
        const data = response.data

        form.value = {
            id: data.id,
            nomor_peserta: data.nomor_peserta,
            nisn: data.nisn,
            nama: data.nama,
            tanggal_lahir: data.tanggal_lahir,
            lulus: data.lulus,
            max_attempts: data.max_attempts !== undefined && data.max_attempts !== null ? data.max_attempts : 3
        }

        // Convert nilai object to array
        nilaiList.value = Object.entries(data.nilai || {}).map(([mapel, nilai]) => ({
            mapel,
            nilai: nilai as number
        }))

        if (nilaiList.value.length === 0) {
            nilaiList.value = [{ mapel: '', nilai: '' }]
        }

        currentSklUrl.value = data.skl || ''
        deleteSklFlag.value = false
        newSklFile.value = null
    } catch (error: any) {
        console.error('Error loading data:', error)
        toast.error('Gagal', 'Gagal memuat data kelulusan')
    } finally {
        isLoading.value = false
    }
}

const handleSubmit = async () => {
    // Validate nilai list
    const hasEmptyMapel = nilaiList.value.some(n => !n.mapel.trim())
    if (hasEmptyMapel) {
        toast.error('Validasi Gagal', 'Semua mata pelajaran harus diisi')
        return
    }

    const hasInvalidNilai = nilaiList.value.some(n => {
        const nilaiStr = String(n.nilai).trim()
        return nilaiStr === '' || isNaN(parseFloat(nilaiStr))
    })
    if (hasInvalidNilai) {
        toast.error('Validasi Gagal', 'Semua nilai harus diisi dengan angka yang valid')
        return
    }

    // Convert nilai list to object with number values
    const nilaiObject: Record<string, number> = {}
    nilaiList.value.forEach(n => {
        nilaiObject[n.mapel] = parseFloat(String(n.nilai))
    })

    isSubmitting.value = true

    try {
        const formData = new FormData()

        // Add data as JSON string
        const data = {
            id: form.value.id,
            nomor_peserta: form.value.nomor_peserta,
            nisn: form.value.nisn,
            nama: form.value.nama,
            tanggal_lahir: form.value.tanggal_lahir,
            nilai: nilaiObject,
            lulus: form.value.lulus,
            delete_skl: deleteSklFlag.value,
            max_attempts: form.value.max_attempts
        }

        formData.append('data', JSON.stringify(data))

        // Add new file if exists
        if (newSklFile.value) {
            formData.append('skl', newSklFile.value)
        }

        await updateDataKelulusan(formData)

        toast.success('Berhasil', 'Data kelulusan berhasil diperbarui')
        
        // Delay before closing modal so user can see success message
        setTimeout(() => {
            emit('success')
            closeModal()
        }, 500)
    } catch (error: any) {
        console.error('Error updating data kelulusan:', error)
        const errorMessage = error?.data?.error || error?.message || 'Gagal memperbarui data kelulusan'
        toast.error('Gagal', errorMessage)
        emit('error', errorMessage)
    } finally {
        isSubmitting.value = false
    }
}

const closeModal = () => {
    if (!isSubmitting.value && !isLoading.value) {
        emit('update:modelValue', false)
    }
}

const resetForm = () => {
    form.value = {
        id: 0,
        nomor_peserta: '',
        nisn: '',
        nama: '',
        tanggal_lahir: '',
        lulus: null
    }
    nilaiList.value = [{ mapel: '', nilai: '' }]
    currentSklUrl.value = ''
    newSklFile.value = null
    deleteSklFlag.value = false
    fileError.value = ''
}

// Watch for modal open to load data
watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        loadData()
    } else {
        setTimeout(resetForm, 300)
    }
})
</script>

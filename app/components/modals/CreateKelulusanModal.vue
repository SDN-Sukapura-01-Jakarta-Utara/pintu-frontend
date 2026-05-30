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
                        <h2 class="text-lg sm:text-xl font-bold text-white">Tambah Data Kelulusan</h2>
                    </div>

                    <!-- Close Button -->
                    <button type="button" @click.stop="closeModal" :disabled="isSubmitting" :title="'Tutup'"
                        class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 disabled:opacity-50 backdrop-blur-sm cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Body with padding and scrollbar -->
                <div class="p-4 sm:p-8 relative z-10 overflow-y-auto flex-1">

                    <!-- Form -->
                    <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
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

                        <!-- Upload SKL -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Upload SKL (Surat Keterangan Lulus)
                                <span class="text-gray-500 text-xs font-normal ml-1">(Opsional, Maks. 2 MB)</span>
                            </label>
                            
                            <!-- Custom File Upload -->
                            <div class="relative">
                                <input 
                                    ref="fileInputRef"
                                    type="file" 
                                    @change="handleFileChange" 
                                    accept="image/*,.pdf" 
                                    :disabled="isSubmitting"
                                    class="hidden"
                                    id="skl-upload"
                                />
                                
                                <!-- Custom Upload Button -->
                                <label 
                                    for="skl-upload"
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
                                                {{ sklFile ? sklFile.name : 'Klik untuk upload file' }}
                                            </p>
                                            <p class="text-xs text-gray-500 mt-1">
                                                Format: JPG, PNG, PDF (Maks. 2 MB)
                                            </p>
                                        </div>
                                    </div>
                                </label>

                                <!-- Remove File Button -->
                                <button 
                                    v-if="sklFile"
                                    type="button"
                                    @click="removeFile"
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
                            <p v-else-if="sklFile" class="mt-2 text-xs text-green-600 flex items-center gap-1">
                                <i class="fa-solid fa-circle-check"></i>
                                File berhasil dipilih
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
                                <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan Data' }}</span>
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
import { createDataKelulusan } from '~/services/kelulusan'
import { useToast } from '~/composables/useToast'

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'success': []
    'error': [message: string]
}>()

const toast = useToast()

const isSubmitting = ref(false)
const fileError = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)

const form = ref({
    nomor_peserta: '',
    nisn: '',
    nama: '',
    tanggal_lahir: '',
    lulus: null as boolean | null
})

const nilaiList = ref<Array<{ mapel: string; nilai: string | number }>>([
    { mapel: '', nilai: '' }
])

const sklFile = ref<File | null>(null)

// Methods
const validateNilai = (nilai: { mapel: string; nilai: string | number }) => {
    // Allow only numbers and one decimal point
    const value = String(nilai.nilai)
    const cleaned = value.replace(/[^\d.]/g, '')
    
    // Ensure only one decimal point
    const parts = cleaned.split('.')
    if (parts.length > 2) {
        nilai.nilai = parts[0] + '.' + parts.slice(1).join('')
    } else {
        nilai.nilai = cleaned
    }
    
    // Limit to 100
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
        // Check file size (2MB = 2 * 1024 * 1024 bytes)
        if (file.size > 2 * 1024 * 1024) {
            fileError.value = 'Ukuran file tidak boleh lebih dari 2 MB'
            target.value = ''
            sklFile.value = null
            return
        }
        sklFile.value = file
    } else {
        sklFile.value = null
    }
}

const removeFile = () => {
    sklFile.value = null
    fileError.value = ''
    if (fileInputRef.value) {
        fileInputRef.value.value = ''
    }
}

const handleSubmit = async () => {
    // Validate nilai list
    const hasEmptyMapel = nilaiList.value.some(n => !n.mapel.trim())
    if (hasEmptyMapel) {
        toast.error('Validasi Gagal', 'Semua mata pelajaran harus diisi')
        return
    }

    // Validate nilai is not empty and is valid number
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
            nomor_peserta: form.value.nomor_peserta,
            nisn: form.value.nisn,
            nama: form.value.nama,
            tanggal_lahir: form.value.tanggal_lahir,
            nilai: nilaiObject,
            lulus: form.value.lulus
        }

        formData.append('data', JSON.stringify(data))

        // Add file if exists
        if (sklFile.value) {
            formData.append('skl', sklFile.value)
        }

        await createDataKelulusan(formData)

        toast.success('Berhasil', 'Data kelulusan berhasil ditambahkan')
        
        // Delay before closing modal so user can see success message
        setTimeout(() => {
            emit('success')
            closeModal()
        }, 500)
    } catch (error: any) {
        console.error('Error creating data kelulusan:', error)
        const errorMessage = error?.data?.error || error?.message || 'Gagal menambahkan data kelulusan'
        toast.error('Gagal', errorMessage)
        emit('error', errorMessage)
    } finally {
        isSubmitting.value = false
    }
}

const closeModal = () => {
    if (!isSubmitting.value) {
        emit('update:modelValue', false)
    }
}

const resetForm = () => {
    form.value = {
        nomor_peserta: '',
        nisn: '',
        nama: '',
        tanggal_lahir: '',
        lulus: null
    }
    nilaiList.value = [{ mapel: '', nilai: '' }]
    sklFile.value = null
    fileError.value = ''
}

// Watch for modal close to reset form
watch(() => props.modelValue, (newValue) => {
    if (!newValue) {
        setTimeout(resetForm, 300) // Reset after transition
    }
})
</script>

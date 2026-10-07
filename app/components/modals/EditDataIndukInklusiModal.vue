<template>
    <!-- Backdrop -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="isOpen" @click="handleClose" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"></div>
    </Transition>

    <!-- Modal -->
    <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4">
        <div v-if="isOpen"
            class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div
                class="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-2xl w-full max-w-4xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]">

                <!-- Header with Red Gradient Background -->
                <div
                    class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Edit Data Induk Inklusi</h2>
                    </div>

                    <button type="button" @click.stop="handleClose" :disabled="isSaving" :title="'Tutup'"
                        class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 disabled:opacity-50 backdrop-blur-sm cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Body with padding and scrollbar -->
                <div v-if="isLoadingData" class="p-4 sm:p-8 flex items-center justify-center flex-1">
                    <div class="flex flex-col items-center gap-3 sm:gap-4">
                        <div class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
                        <p class="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Memuat data...</p>
                    </div>
                </div>

                <div v-else class="p-4 sm:p-8 relative z-10 overflow-y-auto flex-1">
                    <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
                        <!-- Peserta Didik (Read Only) -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Peserta Didik
                            </label>
                            <div class="w-full rounded-lg border-2 border-gray-300 bg-gray-100 px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700">
                                {{ formData.peserta_didik_nama || '-' }}
                            </div>
                            <p class="mt-1 text-xs text-gray-600">
                                <i class="fas fa-info-circle mr-1"></i>
                                Peserta didik tidak dapat diubah
                            </p>
                        </div>

                        <!-- Jenis Hambatan -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Jenis Hambatan <span class="text-red-600 ml-1">*</span>
                            </label>
                            <select v-model="formData.jenis_hambatan" required :disabled="isSaving"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <option value="">Pilih Jenis Hambatan</option>
                                <option v-for="jenis in jenisHambatanOptions" :key="jenis.value" :value="jenis.value">
                                    {{ jenis.value }}
                                </option>
                            </select>
                            
                            <div v-if="formData.jenis_hambatan" class="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p class="text-xs text-blue-900">
                                    <i class="fas fa-info-circle mr-1"></i>
                                    <strong>Deskripsi:</strong> {{ getHambatanDescription(formData.jenis_hambatan) }}
                                </p>
                            </div>
                        </div>

                        <!-- Tanggal Row -->
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                            <div>
                                <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    Tanggal Identifikasi
                                </label>
                                <input v-model="formData.tanggal_identifikasi" type="date" :disabled="isSaving"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                                <p class="mt-1 text-xs text-gray-600">
                                    <i class="fas fa-info-circle mr-1"></i>
                                    Oleh guru kelas (opsional)
                                </p>
                            </div>

                            <div>
                                <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    Tanggal Diagnosa
                                </label>
                                <input v-model="formData.tanggal_diagnosa" type="date" :disabled="isSaving"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                                <p class="mt-1 text-xs text-gray-600">
                                    <i class="fas fa-info-circle mr-1"></i>
                                    Oleh ahli (opsional)
                                </p>
                            </div>

                            <div>
                                <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    Tgl Kadaluarsa Surat
                                </label>
                                <input v-model="formData.tanggal_kadaluarsa_surat" type="date" :disabled="isSaving"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                                <p class="mt-1 text-xs text-gray-600">
                                    <i class="fas fa-info-circle mr-1"></i>
                                    Masa berlaku (opsional)
                                </p>
                            </div>
                        </div>

                        <!-- Status -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Status <span class="text-red-600 ml-1">*</span>
                            </label>
                            <select v-model="formData.status" required :disabled="isSaving"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <option value="">Pilih Status</option>
                                <option value="identified">Identified</option>
                                <option value="diagnosed">Diagnosed</option>
                            </select>
                        </div>

                        <!-- Catatan -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Catatan
                            </label>
                            <textarea v-model="formData.catatan" rows="3" :disabled="isSaving"
                                placeholder="Masukkan catatan tambahan..."
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed resize-none"></textarea>
                        </div>

                        <!-- File Upload -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Surat Keterangan Inklusi
                            </label>
                            
                            <!-- Current Document -->
                            <div v-if="currentFileUrl && !fileDeleted" class="mb-3 p-3 sm:p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                                <div class="flex items-center justify-between gap-2">
                                    <div class="flex items-center gap-2 min-w-0 flex-1">
                                        <i class="fas fa-file-pdf text-green-600 text-lg flex-shrink-0"></i>
                                        <div class="min-w-0 flex-1">
                                            <p class="text-xs sm:text-sm font-semibold text-green-900">Dokumen Saat Ini</p>
                                            <p class="text-xs text-green-700 truncate">{{ currentFileName }}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2 flex-shrink-0">
                                        <button type="button" @click="viewCurrentFile" :disabled="isSaving"
                                            class="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all cursor-pointer disabled:opacity-50"
                                            title="Lihat File">
                                            <i class="fas fa-eye text-sm"></i>
                                        </button>
                                        <button type="button" @click="deleteCurrentFile" :disabled="isSaving"
                                            class="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all cursor-pointer disabled:opacity-50"
                                            title="Hapus File">
                                            <i class="fas fa-trash text-sm"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Upload Area -->
                            <div 
                                @dragover.prevent="isDragging = true"
                                @dragleave.prevent="isDragging = false"
                                @drop.prevent="handleFileDrop"
                                :class="[
                                    'relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer',
                                    isDragging ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 hover:border-red-400 hover:bg-red-50/50',
                                    isSaving ? 'opacity-50 cursor-not-allowed' : ''
                                ]"
                            >
                                <input 
                                    ref="fileInput"
                                    @change="handleFileChange" 
                                    type="file" 
                                    accept=".pdf" 
                                    :disabled="isSaving"
                                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                />
                                
                                <div class="flex flex-col items-center justify-center text-center">
                                    <div :class="[
                                        'w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4 transition-colors',
                                        selectedFileName ? 'bg-green-100' : 'bg-red-100'
                                    ]">
                                        <i v-if="selectedFileName" class="fas fa-check-circle text-green-600 text-xl sm:text-2xl"></i>
                                        <i v-else class="fas fa-cloud-upload-alt text-red-600 text-xl sm:text-2xl"></i>
                                    </div>
                                    
                                    <div v-if="selectedFileName">
                                        <p class="text-xs sm:text-sm font-semibold text-gray-900 mb-1">
                                            <i class="fas fa-file-pdf text-red-600 mr-1"></i>
                                            {{ selectedFileName }}
                                        </p>
                                        <button 
                                            type="button"
                                            @click.stop="clearFile"
                                            class="text-xs text-red-600 hover:text-red-700 font-semibold underline"
                                        >
                                            Ganti File
                                        </button>
                                    </div>
                                    <div v-else>
                                        <p class="text-xs sm:text-sm font-semibold text-gray-900 mb-1">
                                            {{ currentFileUrl && !fileDeleted ? 'Upload file baru (opsional)' : 'Klik untuk upload atau drag & drop' }}
                                        </p>
                                        <p class="text-xs text-gray-600">
                                            PDF (Maks. 5 MB)
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <p v-if="fileError" class="mt-2 text-xs text-red-600 font-semibold flex items-center gap-1">
                                <i class="fas fa-exclamation-circle"></i>
                                {{ fileError }}
                            </p>
                            
                            <p v-else class="mt-2 text-xs text-gray-600 flex items-center gap-1">
                                <i class="fas fa-info-circle"></i>
                                {{ currentFileUrl && !fileDeleted ? 'Upload file baru akan mengganti file lama' : 'Upload surat keterangan dari ahli/profesional (opsional)' }}
                            </p>
                        </div>
                    </form>
                </div>

                <!-- Footer Actions -->
                <div class="flex-shrink-0 px-4 sm:px-8 py-3 sm:py-4 bg-white border-t border-gray-200 flex justify-end gap-2 sm:gap-3">
                    <button type="button" @click="handleClose" :disabled="isSaving"
                        class="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-semibold text-xs sm:text-sm hover:bg-gray-50 active:bg-gray-100 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        Batal
                    </button>
                    <button type="button" @click="handleSubmit" :disabled="isSaving || isLoadingData"
                        class="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 active:from-red-800 active:to-pink-800 text-white font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer">
                        <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <i v-else class="fas fa-save"></i>
                        <span>{{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useToast } from '~/composables/useToast'
import { useAuthGuard } from '~/composables/useAuthGuard'

const props = defineProps<{
    modelValue: boolean
    dataId: number | null
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'success': []
}>()

const { success: showToast, error: showErrorToast } = useToast()
const { handle401 } = useAuthGuard()

const isOpen = ref(props.modelValue)
const isLoadingData = ref(false)
const isSaving = ref(false)
const fileError = ref('')
const selectedFileName = ref('')
const isDragging = ref(false)
const currentFileUrl = ref('')
const currentFileName = ref('')
const fileDeleted = ref(false)

const formData = ref({
    id: null as number | null,
    peserta_didik_id: null as number | null,
    peserta_didik_nama: '',
    jenis_hambatan: '',
    tanggal_identifikasi: '',
    tanggal_diagnosa: '',
    tanggal_kadaluarsa_surat: '',
    status: '',
    catatan: '',
    file_surat_dokter: null as File | null
})

const jenisHambatanOptions = [
    { value: 'Tunanetra / hambatan penglihatan', desc: 'Peserta didik yang mengalami hambatan dalam penglihatan, baik sebagian maupun seluruhnya, sehingga membutuhkan dukungan dalam mengakses informasi visual.' },
    { value: 'Tunarungu / hambatan pendengaran', desc: 'Peserta didik yang mengalami hambatan dalam pendengaran, baik sebagian maupun seluruhnya, sehingga membutuhkan dukungan dalam menerima informasi secara lisan.' },
    { value: 'Tunadaksa / hambatan fisik-motorik', desc: 'Peserta didik yang mengalami hambatan pada fungsi fisik, gerak, atau koordinasi tubuh yang dapat memengaruhi aktivitas dan pembelajaran.' },
    { value: 'Tunagrahita / hambatan intelektual', desc: 'Peserta didik yang mengalami hambatan dalam kemampuan intelektual dan kemampuan beradaptasi dalam kehidupan sehari-hari.' },
    { value: 'Kesulitan belajar spesifik', desc: 'Peserta didik yang mengalami kesulitan tertentu dalam belajar, seperti membaca, menulis, atau berhitung.' },
    { value: 'Lamban belajar (slow learner)', desc: 'Peserta didik yang membutuhkan waktu, penjelasan, dan pengulangan lebih banyak untuk memahami materi pembelajaran.' },
    { value: 'Gangguan komunikasi/bahasa', desc: 'Peserta didik yang mengalami hambatan dalam berbicara, memahami bahasa, menyampaikan pesan, atau berkomunikasi dengan orang lain.' },
    { value: 'Autisme / ASD', desc: 'Peserta didik yang mengalami perbedaan dalam komunikasi, interaksi sosial, serta pola perilaku atau aktivitas tertentu.' },
    { value: 'ADHD / gangguan perhatian dan hiperaktivitas', desc: 'Peserta didik yang mengalami kesulitan dalam mempertahankan perhatian, mengendalikan impuls, atau mengatur aktivitas dan perilaku.' },
    { value: 'Hambatan sosial-emosional/perilaku', desc: 'Peserta didik yang mengalami kesulitan dalam mengelola emosi, berinteraksi dengan orang lain, atau menyesuaikan perilaku di lingkungan sekolah.' },
    { value: 'Hambatan Psikososial / Mental-Emosional', desc: 'Peserta didik yang mengalami kondisi psikologis atau emosional yang dapat memengaruhi proses belajar, interaksi, dan aktivitas di sekolah.' },
    { value: 'Anak berbakat/cerdas istimewa', desc: 'Peserta didik yang memiliki kemampuan atau bakat yang menonjol pada bidang tertentu dan membutuhkan pembelajaran yang sesuai dengan potensinya.' },
    { value: 'Multiple disabilities / Hambatan Majemuk', desc: 'Peserta didik yang memiliki dua atau lebih jenis hambatan atau kebutuhan khusus yang terjadi secara bersamaan.' }
]

watch(() => props.modelValue, (newVal) => {
    isOpen.value = newVal
    if (newVal && props.dataId) {
        loadData()
    }
})

watch(isOpen, (newVal) => {
    emit('update:modelValue', newVal)
})

async function loadData() {
    if (!props.dataId) return

    isLoadingData.value = true

    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const response = await $fetch<any>(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/get-data-induk-inklusi-by-id`,
            {
                method: 'POST',
                body: { id: props.dataId },
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }
        )

        const data = response.data
        
        formData.value = {
            id: data.id,
            peserta_didik_id: data.peserta_didik_id,
            peserta_didik_nama: data.peserta_didik?.nama || '',
            jenis_hambatan: data.jenis_hambatan || '',
            tanggal_identifikasi: data.tanggal_identifikasi || '',
            tanggal_diagnosa: data.tanggal_diagnosa || '',
            tanggal_kadaluarsa_surat: data.tanggal_kadaluarsa_surat || '',
            status: data.status || '',
            catatan: data.catatan || '',
            file_surat_dokter: null
        }

        currentFileUrl.value = data.file_surat_dokter_url || ''
        currentFileName.value = data.file_surat_dokter ? data.file_surat_dokter.split('/').pop() : ''
        fileDeleted.value = false

    } catch (error: any) {
        console.error('Error loading data:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }

        showErrorToast('Gagal Memuat Data', 'Gagal memuat data inklusi.')
        handleClose()
    } finally {
        isLoadingData.value = false
    }
}

function getHambatanDescription(jenis: string) {
    const found = jenisHambatanOptions.find(j => j.value === jenis)
    return found ? found.desc : ''
}

function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    processFile(file)
}

function handleFileDrop(event: DragEvent) {
    isDragging.value = false
    if (isSaving.value) return
    const file = event.dataTransfer?.files[0]
    processFile(file)
}

function processFile(file: File | undefined) {
    fileError.value = ''
    selectedFileName.value = ''
    
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            fileError.value = 'Ukuran file maksimal 5 MB'
            formData.value.file_surat_dokter = null
            return
        }
        
        const allowedTypes = ['application/pdf']
        if (!allowedTypes.includes(file.type)) {
            fileError.value = 'Format file harus PDF'
            formData.value.file_surat_dokter = null
            return
        }
        
        formData.value.file_surat_dokter = file
        selectedFileName.value = file.name
    } else {
        formData.value.file_surat_dokter = null
    }
}

function clearFile() {
    formData.value.file_surat_dokter = null
    selectedFileName.value = ''
    fileError.value = ''
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
        fileInput.value = ''
    }
}

function viewCurrentFile() {
    if (currentFileUrl.value) {
        window.open(currentFileUrl.value, '_blank')
    }
}

function deleteCurrentFile() {
    fileDeleted.value = true
    currentFileUrl.value = ''
    currentFileName.value = ''
}

async function handleSubmit() {
    if (isSaving.value || isLoadingData.value) return

    if (!formData.value.jenis_hambatan) {
        showErrorToast('Validasi Gagal', 'Jenis hambatan harus dipilih')
        return
    }

    if (!formData.value.status) {
        showErrorToast('Validasi Gagal', 'Status harus dipilih')
        return
    }

    isSaving.value = true

    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const formDataToSend = new FormData()
        formDataToSend.append('id', formData.value.id!.toString())
        formDataToSend.append('peserta_didik_id', formData.value.peserta_didik_id!.toString())
        formDataToSend.append('jenis_hambatan', formData.value.jenis_hambatan)
        
        if (formData.value.tanggal_identifikasi) {
            formDataToSend.append('tanggal_identifikasi', formData.value.tanggal_identifikasi)
        }
        
        if (formData.value.tanggal_diagnosa) {
            formDataToSend.append('tanggal_diagnosa', formData.value.tanggal_diagnosa)
        }
        
        if (formData.value.tanggal_kadaluarsa_surat) {
            formDataToSend.append('tanggal_kadaluarsa_surat', formData.value.tanggal_kadaluarsa_surat)
        }
        
        formDataToSend.append('status', formData.value.status)
        
        if (formData.value.catatan) {
            formDataToSend.append('catatan', formData.value.catatan)
        }

        if (fileDeleted.value) {
            formDataToSend.append('delete_file', '1')
        }
        
        if (formData.value.file_surat_dokter) {
            formDataToSend.append('file_surat_dokter', formData.value.file_surat_dokter)
        }

        await $fetch(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/update-data-induk-inklusi`,
            {
                method: 'POST',
                body: formDataToSend,
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                credentials: 'include',
            }
        )

        showToast('Berhasil', 'Data induk inklusi berhasil diperbarui')
        resetForm()
        emit('update:modelValue', false)
        emit('success')
    } catch (error: any) {
        console.error('Error updating data:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }

        let errorMessage = 'Terjadi kesalahan saat memperbarui data'
        
        if (error?.data?.error) {
            errorMessage = error.data.error
        } else if (error?.data?.message) {
            errorMessage = error.data.message
        } else if (error?.message) {
            errorMessage = error.message
        }
        
        showErrorToast('Gagal Memperbarui', errorMessage)
    } finally {
        isSaving.value = false
    }
}

function resetForm() {
    formData.value = {
        id: null,
        peserta_didik_id: null,
        peserta_didik_nama: '',
        jenis_hambatan: '',
        tanggal_identifikasi: '',
        tanggal_diagnosa: '',
        tanggal_kadaluarsa_surat: '',
        status: '',
        catatan: '',
        file_surat_dokter: null
    }
    selectedFileName.value = ''
    isDragging.value = false
    fileError.value = ''
    currentFileUrl.value = ''
    currentFileName.value = ''
    fileDeleted.value = false
}

function handleClose() {
    if (isSaving.value) return
    resetForm()
    emit('update:modelValue', false)
}
</script>

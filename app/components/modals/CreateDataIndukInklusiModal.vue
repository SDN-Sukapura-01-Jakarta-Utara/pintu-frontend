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
                    <!-- Animated gradient blobs -->
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

                    <!-- Header Content -->
                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Tambah Data Induk Inklusi</h2>
                    </div>

                    <!-- Close Button -->
                    <button type="button" @click.stop="handleClose" :disabled="isSaving" :title="'Tutup'"
                        class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 disabled:opacity-50 backdrop-blur-sm cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Body with padding and scrollbar -->
                <div class="p-4 sm:p-8 relative z-10 overflow-y-auto flex-1">
                    <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
                        <!-- Peserta Didik Search -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Peserta Didik <span class="text-red-600 ml-1">*</span>
                            </label>
                            <div class="relative">
                                <input v-model="searchQuery" @input="filterPesertaDidik" @focus="showDropdown = true"
                                    type="text" placeholder="Cari nama, NIS, atau NISN..." :disabled="isSaving"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                                
                                <!-- Dropdown List -->
                                <div v-if="showDropdown && filteredPesertaDidikList.length > 0"
                                    class="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    <button v-for="siswa in filteredPesertaDidikList" :key="siswa.id" type="button"
                                        @click="selectPesertaDidik(siswa)"
                                        class="w-full text-left px-4 py-2 hover:bg-red-50 transition-colors border-b border-gray-100 last:border-b-0">
                                        <p class="text-sm font-semibold text-gray-900">{{ siswa.nama }}</p>
                                        <p class="text-xs text-gray-600">NIS: {{ siswa.nis || '-' }} | NISN: {{ siswa.nisn || '-' }}</p>
                                    </button>
                                </div>
                                
                                <!-- No Results -->
                                <div v-if="showDropdown && searchQuery && filteredPesertaDidikList.length === 0"
                                    class="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4 text-center">
                                    <p class="text-sm text-gray-600">Tidak ada hasil ditemukan</p>
                                </div>
                                
                                <!-- Selected Display -->
                                <div v-if="formData.peserta_didik_id && !showDropdown" class="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                                    <p class="text-xs text-green-900">
                                        <i class="fas fa-check-circle mr-1"></i>
                                        <strong>Terpilih:</strong> {{ getSelectedPesertaDidikName() }}
                                    </p>
                                </div>
                            </div>
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
                            
                            <!-- Deskripsi Hambatan -->
                            <div v-if="formData.jenis_hambatan" class="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p class="text-xs text-blue-900">
                                    <i class="fas fa-info-circle mr-1"></i>
                                    <strong>Deskripsi:</strong> {{ getHambatanDescription(formData.jenis_hambatan) }}
                                </p>
                            </div>
                        </div>

                        <!-- Tanggal Row -->
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                            <!-- Tanggal Identifikasi -->
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

                            <!-- Tanggal Diagnosa -->
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

                            <!-- Tanggal Kadaluarsa Surat -->
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
                                    <!-- Icon -->
                                    <div :class="[
                                        'w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4 transition-colors',
                                        selectedFileName ? 'bg-green-100' : 'bg-red-100'
                                    ]">
                                        <i v-if="selectedFileName" class="fas fa-check-circle text-green-600 text-xl sm:text-2xl"></i>
                                        <i v-else class="fas fa-cloud-upload-alt text-red-600 text-xl sm:text-2xl"></i>
                                    </div>
                                    
                                    <!-- Text -->
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
                                            Klik untuk upload atau drag & drop
                                        </p>
                                        <p class="text-xs text-gray-600">
                                            PDF (Maks. 5 MB)
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Error Message -->
                            <p v-if="fileError" class="mt-2 text-xs text-red-600 font-semibold flex items-center gap-1">
                                <i class="fas fa-exclamation-circle"></i>
                                {{ fileError }}
                            </p>
                            
                            <!-- Info -->
                            <p v-else class="mt-2 text-xs text-gray-600 flex items-center gap-1">
                                <i class="fas fa-info-circle"></i>
                                Upload surat keterangan dari ahli/profesional (opsional)
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
                    <button type="button" @click="handleSubmit" :disabled="isSaving"
                        class="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 active:from-red-800 active:to-pink-800 text-white font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer">
                        <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <i v-else class="fas fa-save"></i>
                        <span>{{ isSaving ? 'Menyimpan...' : 'Simpan' }}</span>
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useToast } from '~/composables/useToast'
import { useAuthGuard } from '~/composables/useAuthGuard'

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'success': []
}>()

const { success: showToast, error: showErrorToast } = useToast()
const { handle401 } = useAuthGuard()

const isOpen = ref(props.modelValue)
const isSaving = ref(false)
const pesertaDidikList = ref<any[]>([])
const filteredPesertaDidikList = ref<any[]>([])
const searchQuery = ref('')
const showDropdown = ref(false)
const fileError = ref('')
const selectedFileName = ref('')
const isDragging = ref(false)

const formData = ref({
    peserta_didik_id: null as number | null,
    jenis_hambatan: '',
    tanggal_identifikasi: '',
    tanggal_diagnosa: '',
    tanggal_kadaluarsa_surat: '',
    status: '',
    catatan: '',
    file_surat_dokter: null as File | null
})

const jenisHambatanOptions = [
    { 
        value: 'Tunanetra / hambatan penglihatan', 
        desc: 'Peserta didik yang mengalami hambatan dalam penglihatan, baik sebagian maupun seluruhnya, sehingga membutuhkan dukungan dalam mengakses informasi visual.'
    },
    { 
        value: 'Tunarungu / hambatan pendengaran', 
        desc: 'Peserta didik yang mengalami hambatan dalam pendengaran, baik sebagian maupun seluruhnya, sehingga membutuhkan dukungan dalam menerima informasi secara lisan.'
    },
    { 
        value: 'Tunadaksa / hambatan fisik-motorik', 
        desc: 'Peserta didik yang mengalami hambatan pada fungsi fisik, gerak, atau koordinasi tubuh yang dapat memengaruhi aktivitas dan pembelajaran.'
    },
    { 
        value: 'Tunagrahita / hambatan intelektual', 
        desc: 'Peserta didik yang mengalami hambatan dalam kemampuan intelektual dan kemampuan beradaptasi dalam kehidupan sehari-hari.'
    },
    { 
        value: 'Kesulitan belajar spesifik', 
        desc: 'Peserta didik yang mengalami kesulitan tertentu dalam belajar, seperti membaca, menulis, atau berhitung.'
    },
    { 
        value: 'Lamban belajar (slow learner)', 
        desc: 'Peserta didik yang membutuhkan waktu, penjelasan, dan pengulangan lebih banyak untuk memahami materi pembelajaran.'
    },
    { 
        value: 'Gangguan komunikasi/bahasa', 
        desc: 'Peserta didik yang mengalami hambatan dalam berbicara, memahami bahasa, menyampaikan pesan, atau berkomunikasi dengan orang lain.'
    },
    { 
        value: 'Autisme / ASD', 
        desc: 'Peserta didik yang mengalami perbedaan dalam komunikasi, interaksi sosial, serta pola perilaku atau aktivitas tertentu.'
    },
    { 
        value: 'ADHD / gangguan perhatian dan hiperaktivitas', 
        desc: 'Peserta didik yang mengalami kesulitan dalam mempertahankan perhatian, mengendalikan impuls, atau mengatur aktivitas dan perilaku.'
    },
    { 
        value: 'Hambatan sosial-emosional/perilaku', 
        desc: 'Peserta didik yang mengalami kesulitan dalam mengelola emosi, berinteraksi dengan orang lain, atau menyesuaikan perilaku di lingkungan sekolah.'
    },
    { 
        value: 'Hambatan Psikososial / Mental-Emosional', 
        desc: 'Peserta didik yang mengalami kondisi psikologis atau emosional yang dapat memengaruhi proses belajar, interaksi, dan aktivitas di sekolah.'
    },
    { 
        value: 'Anak berbakat/cerdas istimewa', 
        desc: 'Peserta didik yang memiliki kemampuan atau bakat yang menonjol pada bidang tertentu dan membutuhkan pembelajaran yang sesuai dengan potensinya.'
    },
    { 
        value: 'Multiple disabilities / Hambatan Majemuk', 
        desc: 'Peserta didik yang memiliki dua atau lebih jenis hambatan atau kebutuhan khusus yang terjadi secara bersamaan.'
    }
]

watch(() => props.modelValue, (newVal) => {
    isOpen.value = newVal
    if (newVal) {
        loadPesertaDidik()
        resetForm()
    }
})

watch(isOpen, (newVal) => {
    emit('update:modelValue', newVal)
})

// Close dropdown when clicking outside
if (typeof window !== 'undefined') {
    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement
        if (!target.closest('.relative')) {
            showDropdown.value = false
        }
    }
    
    watch(showDropdown, (newVal) => {
        if (newVal) {
            setTimeout(() => {
                document.addEventListener('click', handleClickOutside)
            }, 100)
        } else {
            document.removeEventListener('click', handleClickOutside)
        }
    })
}

onMounted(() => {
    if (isOpen.value) {
        loadPesertaDidik()
    }
})

async function loadPesertaDidik() {
    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const response = await $fetch<any>(
            `${config.public.apiBase}/api/v1/peserta-didik/get-peserta-didik`,
            {
                method: 'POST',
                body: {
                    search: {
                        nama: '',
                        nis: '',
                        jenis_kelamin: '',
                        nisn: '',
                        tempat_lahir: '',
                        nik: '',
                        agama: '',
                        status: 'active'
                    },
                    pagination: {
                        limit: 1000,
                        page: 1
                    }
                },
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }
        )

        pesertaDidikList.value = response.data || []
        filteredPesertaDidikList.value = pesertaDidikList.value
    } catch (error: any) {
        console.error('Error loading peserta didik:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }

        showErrorToast('Gagal Memuat Data', 'Gagal memuat data peserta didik.')
    }
}

function filterPesertaDidik() {
    const query = searchQuery.value.toLowerCase().trim()
    
    if (!query) {
        filteredPesertaDidikList.value = pesertaDidikList.value
        return
    }
    
    filteredPesertaDidikList.value = pesertaDidikList.value.filter(siswa => {
        const nama = (siswa.nama || '').toLowerCase()
        const nis = (siswa.nis || '').toLowerCase()
        const nisn = (siswa.nisn || '').toLowerCase()
        
        return nama.includes(query) || nis.includes(query) || nisn.includes(query)
    })
}

function selectPesertaDidik(siswa: any) {
    formData.value.peserta_didik_id = siswa.id
    searchQuery.value = `${siswa.nama} - ${siswa.nis || siswa.nisn}`
    showDropdown.value = false
}

function getSelectedPesertaDidikName() {
    const selected = pesertaDidikList.value.find(s => s.id === formData.value.peserta_didik_id)
    return selected ? `${selected.nama} - ${selected.nis || selected.nisn}` : ''
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
        // Check file size (5MB = 5 * 1024 * 1024 bytes)
        if (file.size > 5 * 1024 * 1024) {
            fileError.value = 'Ukuran file maksimal 5 MB'
            formData.value.file_surat_dokter = null
            return
        }
        
        // Check file type
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
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
        fileInput.value = ''
    }
}

async function handleSubmit() {
    if (isSaving.value) return

    // Validation
    if (!formData.value.peserta_didik_id) {
        showErrorToast('Validasi Gagal', 'Peserta didik harus dipilih')
        return
    }

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

        // Create FormData
        const formDataToSend = new FormData()
        formDataToSend.append('peserta_didik_id', formData.value.peserta_didik_id.toString())
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
        
        if (formData.value.file_surat_dokter) {
            formDataToSend.append('file_surat_dokter', formData.value.file_surat_dokter)
        }

        await $fetch(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/create-data-induk-inklusi`,
            {
                method: 'POST',
                body: formDataToSend,
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                credentials: 'include',
            }
        )

        showToast('Berhasil', 'Data induk inklusi berhasil ditambahkan')
        resetForm()
        emit('update:modelValue', false)
        emit('success')
    } catch (error: any) {
        console.error('Error creating data:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }

        // Extract error message from different possible error structures
        let errorMessage = 'Terjadi kesalahan saat menyimpan data'
        
        if (error?.data?.error) {
            errorMessage = error.data.error
        } else if (error?.data?.message) {
            errorMessage = error.data.message
        } else if (error?.message) {
            errorMessage = error.message
        }
        
        showErrorToast('Gagal Menyimpan', errorMessage)
    } finally {
        isSaving.value = false
    }
}

function resetForm() {
    formData.value = {
        peserta_didik_id: null,
        jenis_hambatan: '',
        tanggal_identifikasi: '',
        tanggal_diagnosa: '',
        tanggal_kadaluarsa_surat: '',
        status: '',
        catatan: '',
        file_surat_dokter: null
    }
    searchQuery.value = ''
    showDropdown.value = false
    selectedFileName.value = ''
    isDragging.value = false
    fileError.value = ''
}

function handleClose() {
    if (isSaving.value) return
    resetForm()
    emit('update:modelValue', false)
}
</script>

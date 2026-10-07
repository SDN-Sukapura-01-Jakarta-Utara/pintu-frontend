<template>
    <!-- Backdrop -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="isOpen" @click="closeModal" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"></div>
    </Transition>

    <!-- Modal -->
    <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4">
        <div v-if="isOpen"
            class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div
                class="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-2xl w-full max-w-5xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]">

                <!-- Header with Red Gradient Background -->
                <div
                    class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Buat Laporan Monitoring Bulanan</h2>
                        <p class="text-xs sm:text-sm text-red-100 mt-0.5">Form input monitoring perkembangan siswa inklusi</p>
                    </div>

                    <button type="button" @click.stop="closeModal" :disabled="isSaving" :title="'Tutup'"
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
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <!-- Tahun Pelajaran -->
                            <div>
                                <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    Tahun Pelajaran <span class="text-red-600 ml-1">*</span>
                                </label>
                                <select v-model="formData.tahun_pelajaran_id" @change="handleTahunPelajaranChange" :disabled="isSaving"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    <option value="">Pilih Tahun Pelajaran</option>
                                    <option v-for="tp in tahunPelajaranList" :key="tp.id" :value="tp.id">
                                        {{ tp.tahun_pelajaran }}
                                    </option>
                                </select>
                            </div>

                            <!-- Rombel -->
                            <div>
                                <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    Rombel <span class="text-red-600 ml-1">*</span>
                                </label>
                                <select v-model="formData.rombel_id" @change="handleRombelChange" :disabled="!formData.tahun_pelajaran_id || isSaving"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    <option value="">{{ formData.tahun_pelajaran_id ? 'Pilih Rombel' : 'Pilih Tahun Pelajaran Terlebih Dahulu' }}</option>
                                    <option v-for="rombel in rombelList" :key="rombel.id" :value="rombel.id">
                                        {{ rombel.name }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <!-- Anak Inklusi -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Anak Inklusi <span class="text-red-600 ml-1">*</span>
                            </label>
                            <select v-model="formData.anak_inklusi_rombel_id" @change="handleAnakInklusiChange" :disabled="!formData.rombel_id || isSaving"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <option value="">{{ formData.rombel_id ? 'Pilih Anak Inklusi' : 'Pilih Rombel Terlebih Dahulu' }}</option>
                                <option v-for="anak in anakInklusiList" :key="anak.id" :value="anak.id">
                                    {{ anak.anak_inklusi?.peserta_didik?.nama }} - {{ anak.peserta_didik_rombel?.rombel?.name }}
                                </option>
                            </select>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <!-- Bidang Studi -->
                            <div>
                                <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    Bidang Studi <span class="text-red-600 ml-1">*</span>
                                </label>
                                <select v-model="formData.bidang_studi_id" @change="loadPPIList" :disabled="!formData.anak_inklusi_rombel_id || isSaving"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    <option value="">Pilih Bidang Studi</option>
                                    <option v-for="bidang in bidangStudiList" :key="bidang.id" :value="bidang.id">
                                        {{ bidang.name }}
                                    </option>
                                </select>
                            </div>

                            <!-- PPI Inklusi -->
                            <div>
                                <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    Program PPI <span class="text-red-600 ml-1">*</span>
                                </label>
                                <select v-model="formData.ppi_inklusi_id" @change="handlePPIChange" :disabled="!formData.bidang_studi_id || isSaving"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    <option value="">{{ formData.bidang_studi_id ? 'Pilih Program PPI' : 'Pilih Bidang Studi Terlebih Dahulu' }}</option>
                                    <option v-for="ppi in ppiList" :key="ppi.id" :value="ppi.id">
                                        {{ ppi.nama_program }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <!-- PPI Info Section -->
                        <div v-if="selectedPPIInfo" class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border-2 border-blue-200">
                            <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md">
                                    <i class="fas fa-info-circle text-white text-sm"></i>
                                </div>
                                Informasi Program PPI
                            </h3>
                            <div class="space-y-3">
                                <div class="bg-white rounded-lg p-3 border border-blue-200">
                                    <label class="block text-xs font-semibold text-gray-600 mb-1">Nama Program</label>
                                    <p class="text-sm font-bold text-gray-900">{{ selectedPPIInfo.nama_program || '-' }}</p>
                                </div>
                                <div class="bg-white rounded-lg p-3 border border-blue-200">
                                    <label class="block text-xs font-semibold text-gray-600 mb-1">Tujuan Pembelajaran</label>
                                    <p class="text-sm text-gray-900 whitespace-pre-line">{{ selectedPPIInfo.tujuan_pembelajaran || '-' }}</p>
                                </div>
                                <div class="bg-white rounded-lg p-3 border border-blue-200">
                                    <label class="block text-xs font-semibold text-gray-600 mb-1">Strategi Pembelajaran</label>
                                    <p class="text-sm text-gray-900 whitespace-pre-line">{{ selectedPPIInfo.strategi_pembelajaran || '-' }}</p>
                                </div>
                                <div class="bg-white rounded-lg p-3 border border-blue-200">
                                    <label class="block text-xs font-semibold text-gray-600 mb-1">Target Waktu</label>
                                    <p class="text-sm font-bold text-gray-900">{{ selectedPPIInfo.target_waktu || '-' }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Tanggal Monitoring -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Tanggal Monitoring <span class="text-red-600 ml-1">*</span>
                            </label>
                            <input v-model="formData.tanggal_monitoring" type="date" :disabled="isSaving"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>

                        <!-- Aspek Perkembangan -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Aspek Perkembangan <span class="text-red-600 ml-1">*</span>
                            </label>
                            <select v-model="formData.aspek_perkembangan" :disabled="isSaving"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <option value="">Pilih Aspek Perkembangan</option>
                                <option value="Kognitif">Kognitif</option>
                                <option value="Motorik Halus">Motorik Halus</option>
                                <option value="Motorik Kasar">Motorik Kasar</option>
                                <option value="Bahasa dan Komunikasi">Bahasa dan Komunikasi</option>
                                <option value="Sosial-Emosional">Sosial-Emosional</option>
                                <option value="Kemandirian">Kemandirian</option>
                                <option value="Perilaku Adaptif">Perilaku Adaptif</option>
                                <option value="Seni dan Kreativitas">Seni dan Kreativitas</option>
                                <option value="Akademik">Akademik</option>
                                <option value="Keterampilan Vokasional">Keterampilan Vokasional</option>
                            </select>
                        </div>

                        <!-- Deskripsi Perkembangan -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Deskripsi Perkembangan <span class="text-red-600 ml-1">*</span>
                            </label>
                            <textarea v-model="formData.deskripsi_perkembangan" rows="4" :disabled="isSaving"
                                placeholder="Jelaskan perkembangan yang terjadi pada siswa..."
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed resize-none"></textarea>
                        </div>

                        <!-- Kendala yang Ditemui -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Kendala yang Ditemui <span class="text-red-600 ml-1">*</span>
                            </label>
                            <textarea v-model="formData.kendala_ditemui" rows="4" :disabled="isSaving"
                                placeholder="Jelaskan kendala yang ditemui selama monitoring..."
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed resize-none"></textarea>
                        </div>

                        <!-- Tindak Lanjut -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Tindak Lanjut <span class="text-red-600 ml-1">*</span>
                            </label>
                            <textarea v-model="formData.tindak_lanjut" rows="4" :disabled="isSaving"
                                placeholder="Jelaskan rencana tindak lanjut..."
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed resize-none"></textarea>
                        </div>

                        <!-- File Pendukung -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                File Pendukung <span class="text-gray-500 text-xs">(Opsional, Maks 3 file)</span>
                            </label>
                            <input ref="fileInput" type="file" @change="handleFileChange" :disabled="isSaving"
                                multiple accept=".pdf,.png,.jpg,.jpeg"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 file:cursor-pointer" />
                            <p class="text-xs text-gray-500 mt-2">Format: PDF, PNG, JPG. Maksimal 5MB per file. Maksimal 3 file.</p>
                            
                            <!-- File Preview -->
                            <div v-if="selectedFiles.length > 0" class="mt-3 space-y-2">
                                <div v-for="(file, index) in selectedFiles" :key="index"
                                    class="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <div class="flex items-center gap-2 flex-1 min-w-0">
                                        <i class="fas fa-file text-gray-400"></i>
                                        <span class="text-xs font-medium text-gray-900 truncate">{{ file.name }}</span>
                                        <span class="text-xs text-gray-500">({{ formatFileSize(file.size) }})</span>
                                    </div>
                                    <button type="button" @click="removeFile(index)" :disabled="isSaving"
                                        class="ml-2 p-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 cursor-pointer">
                                        <i class="fas fa-times text-sm"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Guru Pengisi -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Guru Pengisi <span class="text-red-600 ml-1">*</span>
                            </label>
                            <select v-model="formData.guru_pengisi_id" :disabled="isSaving"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <option value="">Pilih Guru Pengisi</option>
                                <option v-for="guru in guruList" :key="guru.id" :value="guru.id">
                                    {{ guru.nama }} - {{ guru.jabatan }}
                                </option>
                            </select>
                        </div>
                    </form>
                </div>

                <!-- Footer Actions -->
                <div class="flex-shrink-0 px-4 sm:px-8 py-3 sm:py-4 bg-white border-t border-gray-200 flex justify-end gap-2 sm:gap-3">
                    <button type="button" @click="closeModal" :disabled="isSaving"
                        class="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-semibold text-xs sm:text-sm hover:bg-gray-50 active:bg-gray-100 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        Batal
                    </button>
                    <button type="button" @click="handleSubmit" :disabled="isSaving || !isFormValid"
                        class="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 active:from-red-800 active:to-pink-800 text-white font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer">
                        <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <i v-else class="fas fa-save"></i>
                        <span>{{ isSaving ? 'Menyimpan...' : 'Simpan Laporan' }}</span>
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useToast } from '~/composables/useToast'
import { useAuthGuard } from '~/composables/useAuthGuard'

const props = defineProps<{
    modelValue: boolean
    tahunPelajaranList: any[]
    guruList: any[]
    bidangStudiList: any[]
    rombelList: any[]
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'success': []
}>()

const { success: showToast, error: showErrorToast } = useToast()
const { handle401 } = useAuthGuard()

const isOpen = ref(props.modelValue)
const isSaving = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFiles = ref<File[]>([])
const anakInklusiList = ref<any[]>([])
const ppiList = ref<any[]>([])
const selectedPPIInfo = ref<any>(null)

const formData = ref({
    tahun_pelajaran_id: '' as string | number,
    rombel_id: '' as string | number,
    anak_inklusi_rombel_id: '' as string | number,
    bidang_studi_id: '' as string | number,
    ppi_inklusi_id: '' as string | number,
    tanggal_monitoring: '',
    aspek_perkembangan: '',
    deskripsi_perkembangan: '',
    kendala_ditemui: '',
    tindak_lanjut: '',
    guru_pengisi_id: '' as string | number
})

watch(() => props.modelValue, (newVal) => {
    isOpen.value = newVal
    if (newVal) {
        resetForm()
    }
})

watch(isOpen, (newVal) => {
    emit('update:modelValue', newVal)
})

const isFormValid = computed(() => {
    return formData.value.tahun_pelajaran_id &&
           formData.value.rombel_id &&
           formData.value.anak_inklusi_rombel_id &&
           formData.value.bidang_studi_id &&
           formData.value.ppi_inklusi_id &&
           formData.value.tanggal_monitoring &&
           formData.value.aspek_perkembangan &&
           formData.value.deskripsi_perkembangan &&
           formData.value.kendala_ditemui &&
           formData.value.tindak_lanjut &&
           formData.value.guru_pengisi_id
})

function resetForm() {
    formData.value = {
        tahun_pelajaran_id: '',
        rombel_id: '',
        anak_inklusi_rombel_id: '',
        bidang_studi_id: '',
        ppi_inklusi_id: '',
        tanggal_monitoring: '',
        aspek_perkembangan: '',
        deskripsi_perkembangan: '',
        kendala_ditemui: '',
        tindak_lanjut: '',
        guru_pengisi_id: ''
    }
    selectedFiles.value = []
    anakInklusiList.value = []
    ppiList.value = []
    selectedPPIInfo.value = null
    if (fileInput.value) {
        fileInput.value.value = ''
    }
    isSaving.value = false
}

function closeModal() {
    if (!isSaving.value) {
        isOpen.value = false
    }
}

function handleTahunPelajaranChange() {
    formData.value.rombel_id = ''
    formData.value.anak_inklusi_rombel_id = ''
    formData.value.bidang_studi_id = ''
    formData.value.ppi_inklusi_id = ''
    anakInklusiList.value = []
    ppiList.value = []
    selectedPPIInfo.value = null
}

function handleRombelChange() {
    formData.value.anak_inklusi_rombel_id = ''
    formData.value.bidang_studi_id = ''
    formData.value.ppi_inklusi_id = ''
    ppiList.value = []
    selectedPPIInfo.value = null
    if (formData.value.rombel_id) {
        loadAnakInklusi()
    }
}

function handleAnakInklusiChange() {
    formData.value.bidang_studi_id = ''
    formData.value.ppi_inklusi_id = ''
    ppiList.value = []
    selectedPPIInfo.value = null
}

function handlePPIChange() {
    // Find selected PPI info
    const selectedPPI = ppiList.value.find((ppi: any) => ppi.id === formData.value.ppi_inklusi_id)
    selectedPPIInfo.value = selectedPPI || null
}

async function loadAnakInklusi() {
    if (!formData.value.tahun_pelajaran_id || !formData.value.rombel_id) return

    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const tahunPelajaranId = typeof formData.value.tahun_pelajaran_id === 'string'
            ? parseInt(formData.value.tahun_pelajaran_id)
            : formData.value.tahun_pelajaran_id

        const rombelId = typeof formData.value.rombel_id === 'string'
            ? parseInt(formData.value.rombel_id)
            : formData.value.rombel_id

        const response = await $fetch<any>(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/get-data-induk-inklusi-rombel`,
            {
                method: 'POST',
                body: {
                    tahun_pelajaran_id: tahunPelajaranId,
                    search: {
                        rombel_id: rombelId
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

        anakInklusiList.value = response.data || []
    } catch (error: any) {
        console.error('Error loading anak inklusi:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }
    }
}

async function loadPPIList() {
    if (!formData.value.bidang_studi_id) return

    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const bidangStudiId = typeof formData.value.bidang_studi_id === 'string'
            ? parseInt(formData.value.bidang_studi_id)
            : formData.value.bidang_studi_id

        const response = await $fetch<any>(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/get-ppi`,
            {
                method: 'POST',
                body: {
                    search: {
                        bidang_studi_id: bidangStudiId
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

        ppiList.value = response.data || []
    } catch (error: any) {
        console.error('Error loading PPI list:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }
    }
}

function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    const files = Array.from(target.files || [])

    // Validate file count
    if (selectedFiles.value.length + files.length > 3) {
        showErrorToast('Maksimal File', 'Maksimal 3 file yang dapat diunggah.')
        return
    }

    // Validate each file
    for (const file of files) {
        // Check file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            showErrorToast('Ukuran File Terlalu Besar', `File ${file.name} melebihi batas maksimal 5MB.`)
            continue
        }

        // Check file type
        const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
        if (!validTypes.includes(file.type)) {
            showErrorToast('Format File Tidak Valid', `File ${file.name} harus berformat PDF, PNG, atau JPG.`)
            continue
        }

        selectedFiles.value.push(file)
    }

    // Clear input
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

function removeFile(index: number) {
    selectedFiles.value.splice(index, 1)
}

function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

async function handleSubmit() {
    if (!isFormValid.value || isSaving.value) return

    // Extract month and year from tanggal_monitoring
    const date = new Date(formData.value.tanggal_monitoring)
    const bulan = date.getMonth() + 1
    const tahun = date.getFullYear()

    isSaving.value = true

    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        // Create FormData
        const formDataToSend = new FormData()
        formDataToSend.append('anak_inklusi_rombel_id', String(formData.value.anak_inklusi_rombel_id))
        formDataToSend.append('ppi_inklusi_id', String(formData.value.ppi_inklusi_id))
        formDataToSend.append('tanggal_monitoring', formData.value.tanggal_monitoring)
        formDataToSend.append('bulan', String(bulan))
        formDataToSend.append('tahun', String(tahun))
        formDataToSend.append('aspek_perkembangan', formData.value.aspek_perkembangan)
        formDataToSend.append('deskripsi_perkembangan', formData.value.deskripsi_perkembangan)
        formDataToSend.append('kendala_ditemui', formData.value.kendala_ditemui)
        formDataToSend.append('tindak_lanjut', formData.value.tindak_lanjut)
        formDataToSend.append('guru_pengisi_id', String(formData.value.guru_pengisi_id))

        // Append files
        selectedFiles.value.forEach(file => {
            formDataToSend.append('file_pendukung', file)
        })

        await $fetch<any>(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/create-monitoring-bulanan`,
            {
                method: 'POST',
                body: formDataToSend,
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                credentials: 'include',
            }
        )

        showToast('Berhasil', 'Laporan monitoring bulanan berhasil disimpan')
        emit('success')
        isOpen.value = false
    } catch (error: any) {
        console.error('Error creating monitoring bulanan:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }

        const errorMessage = error.data?.message || 'Gagal menyimpan laporan monitoring bulanan.'
        showErrorToast('Gagal Menyimpan', errorMessage)
    } finally {
        isSaving.value = false
    }
}
</script>

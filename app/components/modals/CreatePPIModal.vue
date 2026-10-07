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
                    <!-- Animated gradient blobs -->
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

                    <!-- Header Content -->
                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Tambah Data PPI</h2>
                        <p class="text-xs sm:text-sm text-red-100 mt-0.5">Buat program pembelajaran individu baru</p>
                    </div>

                    <!-- Close Button -->
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

                        <!-- Guru Pembuat -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Guru Pembuat <span class="text-red-600 ml-1">*</span>
                            </label>
                            <select v-model="formData.guru_pembuat_id" :disabled="isSaving"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <option value="">Pilih Guru Pembuat</option>
                                <option v-for="guru in guruList" :key="guru.id" :value="guru.id">
                                    {{ guru.nama }} - {{ guru.jabatan }}
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

                        <!-- Anak Inklusi -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Anak Inklusi <span class="text-red-600 ml-1">*</span>
                            </label>
                            <select v-model="formData.anak_inklusi_rombel_id" :disabled="!formData.rombel_id || isSaving"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <option value="">{{ formData.rombel_id ? 'Pilih Anak Inklusi' : 'Pilih Rombel Terlebih Dahulu' }}</option>
                                <option v-for="anak in anakInklusiList" :key="anak.id" :value="anak.id">
                                    {{ anak.anak_inklusi?.peserta_didik?.nama }} - {{ anak.peserta_didik_rombel?.rombel?.name }}
                                </option>
                            </select>
                        </div>

                        <!-- Program List -->
                        <div class="border-t-2 border-gray-200 pt-4 sm:pt-6">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-base sm:text-lg font-bold text-gray-900">Daftar Program</h3>
                                <button type="button" @click="addProgram" :disabled="isSaving"
                                    class="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-xs sm:text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    <i class="fas fa-plus"></i>
                                    Tambah Program
                                </button>
                            </div>

                            <!-- Program Items -->
                            <div v-if="formData.program_list.length === 0" class="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <i class="fas fa-folder-open text-3xl text-gray-400 mb-2"></i>
                                <p class="text-sm text-gray-600">Belum ada program. Klik "Tambah Program" untuk menambah.</p>
                            </div>

                            <div v-else class="space-y-4">
                                <div v-for="(program, index) in formData.program_list" :key="index"
                                    class="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 relative">
                                    <!-- Remove Button -->
                                    <button type="button" @click="removeProgram(index)" :disabled="isSaving"
                                        class="absolute top-3 right-3 p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        title="Hapus Program">
                                        <i class="fas fa-trash-alt text-sm"></i>
                                    </button>

                                    <h4 class="text-sm sm:text-base font-bold text-gray-900 mb-4">Program {{ index + 1 }}</h4>

                                    <div class="space-y-4">
                                        <!-- Aspek Pembelajaran -->
                                        <div>
                                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                                Aspek Pembelajaran <span class="text-red-600 ml-1">*</span>
                                            </label>
                                            <select v-model="program.aspek_pembelajaran" :disabled="isSaving"
                                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                                <option value="">Pilih Aspek Pembelajaran</option>
                                                <option v-for="aspek in aspekPembelajaranList" :key="aspek.value" :value="aspek.value">
                                                    {{ aspek.label }}
                                                </option>
                                            </select>
                                            <!-- Keterangan Aspek -->
                                            <div v-if="program.aspek_pembelajaran" class="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                <div class="flex items-start gap-2">
                                                    <i class="fas fa-info-circle text-blue-600 mt-0.5 flex-shrink-0"></i>
                                                    <p class="text-xs text-blue-800 leading-relaxed">
                                                        <span class="font-semibold">{{ program.aspek_pembelajaran }}:</span>
                                                        {{ aspekPembelajaranList.find(a => a.value === program.aspek_pembelajaran)?.description }}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Nama Program -->
                                        <div>
                                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                                Nama Program <span class="text-red-600 ml-1">*</span>
                                            </label>
                                            <input v-model="program.nama_program" type="text" :disabled="isSaving"
                                                placeholder="Masukkan nama program..."
                                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                                        </div>

                                        <!-- Tujuan Pembelajaran -->
                                        <div>
                                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                                Tujuan Pembelajaran <span class="text-red-600 ml-1">*</span>
                                            </label>
                                            <textarea v-model="program.tujuan_pembelajaran" rows="3" :disabled="isSaving"
                                                placeholder="Masukkan tujuan pembelajaran..."
                                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed resize-none"></textarea>
                                        </div>

                                        <!-- Strategi Pembelajaran -->
                                        <div>
                                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                                Strategi Pembelajaran <span class="text-red-600 ml-1">*</span>
                                            </label>
                                            <textarea v-model="program.strategi_pembelajaran" rows="3" :disabled="isSaving"
                                                placeholder="Masukkan strategi pembelajaran..."
                                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed resize-none"></textarea>
                                        </div>

                                        <!-- Target Waktu -->
                                        <div>
                                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                                Target Waktu <span class="text-red-600 ml-1">*</span>
                                            </label>
                                            <select v-model="program.target_waktu" :disabled="isSaving"
                                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                                <option value="">Pilih Target Waktu</option>
                                                <option v-for="target in targetWaktuList" :key="target.value" :value="target.value">
                                                    {{ target.label }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                        <span>{{ isSaving ? 'Menyimpan...' : 'Simpan Data' }}</span>
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
const anakInklusiList = ref<any[]>([])

// Daftar Aspek Pembelajaran dengan keterangan
const aspekPembelajaranList = [
    {
        value: 'Kognitif',
        label: 'Kognitif',
        description: 'Kemampuan berpikir, mengingat, memecahkan masalah, pemahaman konsep dasar (angka, huruf, warna, bentuk), konsentrasi, dan daya ingat'
    },
    {
        value: 'Bahasa & Komunikasi',
        label: 'Bahasa & Komunikasi',
        description: 'Kemampuan berbicara, mendengarkan, memahami instruksi, mengekspresikan kebutuhan, artikulasi kata, dan komunikasi verbal/non-verbal'
    },
    {
        value: 'Motorik',
        label: 'Motorik',
        description: 'Motorik kasar (berjalan, berlari, melompat, keseimbangan) dan motorik halus (menulis, menggunting, menggambar, memegang alat tulis)'
    },
    {
        value: 'Sensori/Persepsi',
        label: 'Sensori/Persepsi',
        description: 'Kemampuan memproses informasi dari panca indera (penglihatan, pendengaran, sentuhan, penciuman, pengecapan), koordinasi mata-tangan'
    },
    {
        value: 'Sosial & Emosional',
        label: 'Sosial & Emosional',
        description: 'Kemampuan berinteraksi dengan teman dan guru, berbagi, menunggu giliran, mengendalikan emosi, empati, dan kerja sama'
    },
    {
        value: 'Bina Diri/Kemandirian',
        label: 'Bina Diri/Kemandirian',
        description: 'Kemampuan merawat diri (makan sendiri, memakai baju, toilet training, kebersihan diri, mengatur barang pribadi)'
    },
    {
        value: 'Perilaku Adaptif',
        label: 'Perilaku Adaptif',
        description: 'Kemampuan mengikuti aturan kelas, menyesuaikan diri dengan rutinitas, transisi antar aktivitas, respons terhadap perubahan'
    }
]

// Daftar Target Waktu
const targetWaktuList = [
    { value: 'Semester 1', label: 'Semester 1' },
    { value: 'Semester 2', label: 'Semester 2' },
    { value: '1 Bulan', label: '1 Bulan' },
    { value: '2 Bulan', label: '2 Bulan' },
    { value: '3 Bulan', label: '3 Bulan' },
    { value: '4 Bulan', label: '4 Bulan' },
    { value: '5 Bulan', label: '5 Bulan' }
]

const formData = ref({
    tahun_pelajaran_id: '' as string | number,
    rombel_id: '' as string | number,
    guru_pembuat_id: '' as string | number,
    anak_inklusi_rombel_id: '' as string | number,
    program_list: [] as Array<{
        aspek_pembelajaran: string
        nama_program: string
        tujuan_pembelajaran: string
        strategi_pembelajaran: string
        target_waktu: string
    }>
})

watch(() => props.modelValue, (newVal) => {
    isOpen.value = newVal
    if (newVal) {
        resetForm()
        // Set default tahun pelajaran yang aktif
        const activeTp = props.tahunPelajaranList.find((tp: any) => tp.status === 'active' || tp.status === 'Aktif')
        if (activeTp) {
            formData.value.tahun_pelajaran_id = activeTp.id
        }
    }
})

watch(isOpen, (newVal) => {
    emit('update:modelValue', newVal)
})

const isFormValid = computed(() => {
    if (!formData.value.tahun_pelajaran_id || 
        !formData.value.guru_pembuat_id || 
        !formData.value.anak_inklusi_rombel_id ||
        formData.value.program_list.length === 0) {
        return false
    }

    // Check if all programs are valid
    return formData.value.program_list.every(program => 
        program.aspek_pembelajaran &&
        program.nama_program &&
        program.tujuan_pembelajaran &&
        program.strategi_pembelajaran &&
        program.target_waktu
    )
})

function resetForm() {
    formData.value = {
        tahun_pelajaran_id: '',
        rombel_id: '',
        guru_pembuat_id: '',
        anak_inklusi_rombel_id: '',
        program_list: []
    }
    anakInklusiList.value = []
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
    anakInklusiList.value = []
}

function handleRombelChange() {
    formData.value.anak_inklusi_rombel_id = ''
    if (formData.value.rombel_id) {
        loadAnakInklusi()
    }
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

function addProgram() {
    formData.value.program_list.push({
        aspek_pembelajaran: '',
        nama_program: '',
        tujuan_pembelajaran: '',
        strategi_pembelajaran: '',
        target_waktu: ''
    })
}

function removeProgram(index: number) {
    formData.value.program_list.splice(index, 1)
}

async function handleSubmit() {
    if (!isFormValid.value || isSaving.value) return

    // Validation
    if (!formData.value.tahun_pelajaran_id) {
        showErrorToast('Validasi Error', 'Tahun Pelajaran harus dipilih.')
        return
    }

    if (!formData.value.guru_pembuat_id) {
        showErrorToast('Validasi Error', 'Guru Pembuat harus dipilih.')
        return
    }

    if (!formData.value.anak_inklusi_rombel_id) {
        showErrorToast('Validasi Error', 'Anak Inklusi harus dipilih.')
        return
    }

    if (formData.value.program_list.length === 0) {
        showErrorToast('Validasi Error', 'Minimal harus ada 1 program.')
        return
    }

    // Validate each program
    for (let i = 0; i < formData.value.program_list.length; i++) {
        const program = formData.value.program_list[i]
        if (!program?.aspek_pembelajaran || !program?.nama_program || !program?.tujuan_pembelajaran || 
            !program?.strategi_pembelajaran || !program?.target_waktu) {
            showErrorToast('Validasi Error', `Program ${i + 1} belum lengkap.`)
            return
        }
    }

    isSaving.value = true

    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const requestBody = {
            anak_inklusi_rombel_id: typeof formData.value.anak_inklusi_rombel_id === 'string'
                ? parseInt(formData.value.anak_inklusi_rombel_id)
                : formData.value.anak_inklusi_rombel_id,
            tahun_pelajaran_id: typeof formData.value.tahun_pelajaran_id === 'string'
                ? parseInt(formData.value.tahun_pelajaran_id)
                : formData.value.tahun_pelajaran_id,
            guru_pembuat_id: typeof formData.value.guru_pembuat_id === 'string'
                ? parseInt(formData.value.guru_pembuat_id)
                : formData.value.guru_pembuat_id,
            program_list: formData.value.program_list.map(program => ({
                aspek_pembelajaran: program.aspek_pembelajaran,
                nama_program: program.nama_program,
                tujuan_pembelajaran: program.tujuan_pembelajaran,
                strategi_pembelajaran: program.strategi_pembelajaran,
                target_waktu: program.target_waktu
            }))
        }

        const response = await $fetch<any>(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/create-ppi`,
            {
                method: 'POST',
                body: requestBody,
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }
        )

        showToast('Berhasil', `${response.data.total_created} program PPI berhasil ditambahkan`)
        emit('success')
        isOpen.value = false
    } catch (error: any) {
        console.error('Error creating PPI:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }

        const errorMessage = error.data?.message || 'Gagal menambahkan data PPI.'
        showErrorToast('Gagal Menyimpan', errorMessage)
    } finally {
        isSaving.value = false
    }
}
</script>

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
        <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div class="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-2xl w-full max-w-4xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]">

                <!-- Header -->
                <div class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Edit Data Inklusi Per Rombel</h2>
                        <p class="text-xs sm:text-sm text-red-100 mt-0.5">Perbarui informasi pendampingan siswa</p>
                    </div>

                    <button type="button" @click.stop="handleClose" :disabled="isSaving" :title="'Tutup'"
                        class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 disabled:opacity-50 backdrop-blur-sm cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Body -->
                <div class="p-4 sm:p-8 relative z-10 overflow-y-auto flex-1">
                    <!-- Loading State -->
                    <div v-if="isLoading" class="flex items-center justify-center py-12">
                        <div class="flex flex-col items-center gap-3">
                            <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
                            <p class="text-sm text-gray-600 font-medium">Memuat data...</p>
                        </div>
                    </div>

                    <!-- Content -->
                    <div v-else-if="detailData" class="space-y-4 sm:space-y-6">
                        <!-- Informasi Peserta Didik (Read Only) -->
                        <div class="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 sm:p-6">
                            <h3 class="text-sm sm:text-base font-bold text-blue-900 mb-3 sm:mb-4 flex items-center gap-2">
                                <i class="fas fa-user-circle"></i>
                                Informasi Peserta Didik
                            </h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label class="block text-xs font-semibold text-blue-700 mb-1">Nama Lengkap</label>
                                    <p class="text-sm font-semibold text-blue-900">{{ detailData.anak_inklusi?.peserta_didik?.nama || '-' }}</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-blue-700 mb-1">NISN</label>
                                    <p class="text-sm font-semibold text-blue-900">{{ detailData.anak_inklusi?.peserta_didik?.nisn || '-' }}</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-blue-700 mb-1">Jenis Hambatan</label>
                                    <p class="text-sm font-semibold text-blue-900">{{ detailData.anak_inklusi?.jenis_hambatan || '-' }}</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-blue-700 mb-1">Rombel</label>
                                    <p class="text-sm font-semibold text-blue-900">{{ detailData.peserta_didik_rombel?.rombel?.name || '-' }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Form Edit -->
                        <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
                            <!-- Guru Kelas -->
                            <div>
                                <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    Guru Kelas
                                </label>
                                <select v-model="formData.guru_kelas_id" :disabled="isSaving"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    <option value="">Pilih Guru Kelas</option>
                                    <option v-for="guru in guruKelasList" :key="guru.id" :value="guru.id">
                                        {{ guru.nama }} - {{ guru.jabatan }}
                                    </option>
                                </select>
                                <p class="mt-1 text-xs text-gray-600">
                                    <i class="fas fa-info-circle mr-1"></i>
                                    Opsional
                                </p>
                            </div>

                            <!-- Guru Pendamping Khusus -->
                            <div>
                                <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    Guru Pendamping Khusus
                                </label>
                                <select v-model="formData.guru_pendamping_khusus_id" :disabled="isSaving"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    <option value="">Pilih Guru Pendamping Khusus</option>
                                    <option v-for="guru in guruPendampingList" :key="guru.id" :value="guru.id">
                                        {{ guru.nama }} - {{ guru.jabatan }}
                                    </option>
                                </select>
                                <p class="mt-1 text-xs text-gray-600">
                                    <i class="fas fa-info-circle mr-1"></i>
                                    Opsional
                                </p>
                            </div>

                            <!-- Catatan -->
                            <div>
                                <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    Catatan Pendampingan
                                </label>
                                <textarea v-model="formData.catatan" rows="4" :disabled="isSaving"
                                    placeholder="Masukkan catatan pendampingan..."
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed resize-none"></textarea>
                                <p class="mt-1 text-xs text-gray-600">
                                    <i class="fas fa-info-circle mr-1"></i>
                                    Opsional
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Footer -->
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
const isLoading = ref(false)
const isSaving = ref(false)
const detailData = ref<any>(null)
const guruKelasList = ref<any[]>([])
const guruPendampingList = ref<any[]>([])

const formData = ref({
    guru_kelas_id: null as number | null,
    guru_pendamping_khusus_id: null as number | null,
    catatan: ''
})

watch(() => props.modelValue, (newVal) => {
    isOpen.value = newVal
    if (newVal && props.dataId) {
        loadData()
        loadGuruKelas()
        loadGuruPendamping()
    }
})

watch(isOpen, (newVal) => {
    emit('update:modelValue', newVal)
})

function handleClose() {
    if (!isSaving.value) {
        isOpen.value = false
    }
}

async function loadData() {
    if (!props.dataId) return

    isLoading.value = true
    detailData.value = null

    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const response = await $fetch<any>(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/get-data-induk-inklusi-rombel-by-id`,
            {
                method: 'POST',
                body: {
                    id: props.dataId
                },
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }
        )

        detailData.value = response.data

        // Set form data
        formData.value = {
            guru_kelas_id: response.data.guru_kelas_id || null,
            guru_pendamping_khusus_id: response.data.guru_pendamping_khusus_id || null,
            catatan: response.data.catatan || ''
        }
    } catch (error: any) {
        console.error('Error loading data:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }

        showErrorToast('Gagal Memuat Data', 'Gagal memuat detail data inklusi per rombel.')
        handleClose()
    } finally {
        isLoading.value = false
    }
}

async function loadGuruKelas() {
    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const response = await $fetch<any>(
            `${config.public.apiBase}/api/v1/kepegawaian/get-kepegawaian`,
            {
                method: 'POST',
                body: {
                    search: {
                        status: 'active'
                    },
                    pagination: {
                        limit: 100,
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

        // Filter hanya jabatan Guru Kelas, Guru Bidang Studi, Guru Kelas dan Guru Bidang Studi
        const allowedJabatan = ['Guru Kelas', 'Guru Bidang Studi', 'Guru Kelas dan Guru Bidang Studi']
        guruKelasList.value = (response.data || []).filter((guru: any) => 
            allowedJabatan.includes(guru.jabatan)
        )
    } catch (error: any) {
        console.error('Error loading guru kelas:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }
    }
}

async function loadGuruPendamping() {
    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const response = await $fetch<any>(
            `${config.public.apiBase}/api/v1/kepegawaian/get-kepegawaian`,
            {
                method: 'POST',
                body: {
                    search: {
                        status: 'active'
                    },
                    pagination: {
                        limit: 100,
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

        // Filter hanya jabatan Guru Kelas, Guru Bidang Studi, Guru Kelas dan Guru Bidang Studi
        const allowedJabatan = ['Guru Kelas', 'Guru Bidang Studi', 'Guru Kelas dan Guru Bidang Studi']
        guruPendampingList.value = (response.data || []).filter((guru: any) => 
            allowedJabatan.includes(guru.jabatan)
        )
    } catch (error: any) {
        console.error('Error loading guru pendamping:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }
    }
}

async function handleSubmit() {
    if (isSaving.value) return

    isSaving.value = true

    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const requestBody: any = {
            id: props.dataId
        }

        // Add optional fields only if they have values
        if (formData.value.guru_kelas_id) {
            requestBody.guru_kelas_id = formData.value.guru_kelas_id
        }

        if (formData.value.guru_pendamping_khusus_id) {
            requestBody.guru_pendamping_khusus_id = formData.value.guru_pendamping_khusus_id
        }

        if (formData.value.catatan) {
            requestBody.catatan = formData.value.catatan
        }

        await $fetch<any>(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/update-data-induk-inklusi-rombel`,
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

        showToast('Berhasil', 'Data inklusi per rombel berhasil diperbarui')
        emit('success')
        isOpen.value = false
    } catch (error: any) {
        console.error('Error updating data:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }

        const errorMessage = error.data?.message || 'Gagal memperbarui data inklusi per rombel.'
        showErrorToast('Gagal Menyimpan', errorMessage)
    } finally {
        isSaving.value = false
    }
}
</script>

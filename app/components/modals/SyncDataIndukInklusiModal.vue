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
                class="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-2xl w-full max-w-4xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]">

                <!-- Header with Red Gradient Background -->
                <div
                    class="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <!-- Animated gradient blobs -->
                    <div class="absolute top-0 right-0 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl -z-0"></div>

                    <!-- Header Content -->
                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Sync Data Induk Inklusi</h2>
                        <p class="text-xs sm:text-sm text-blue-100 mt-0.5">Sinkronisasi data inklusi per rombel</p>
                    </div>

                    <!-- Close Button -->
                    <button type="button" @click.stop="closeModal" :disabled="isSyncing" :title="'Tutup'"
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
                    <div v-if="!syncResult" class="space-y-4 sm:space-y-6">
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Tahun Pelajaran <span class="text-red-600 ml-1">*</span>
                            </label>
                            <select v-model="selectedTahunPelajaran"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                :disabled="isSyncing">
                                <option value="">Pilih Tahun Pelajaran</option>
                                <option v-for="tp in tahunPelajaranList" :key="tp.id" :value="tp.id">
                                    {{ tp.tahun_pelajaran }}
                                </option>
                            </select>
                        </div>

                        <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                            <div class="flex gap-3">
                                <i class="fas fa-info-circle text-blue-600 mt-0.5 flex-shrink-0"></i>
                                <div class="text-xs sm:text-sm text-blue-800">
                                    <p class="font-semibold mb-1">Informasi:</p>
                                    <p>Proses sinkronisasi akan menyesuaikan data inklusi dengan rombel yang sudah ada pada tahun pelajaran yang dipilih.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Sync Result -->
                    <div v-else class="space-y-4 sm:space-y-6">
                        <!-- Summary -->
                        <div class="grid grid-cols-3 gap-3 sm:gap-4">
                            <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 sm:p-4">
                                <div class="text-center">
                                    <i class="fas fa-database text-blue-600 text-xl sm:text-2xl mb-1 sm:mb-2"></i>
                                    <p class="text-xs text-gray-600 mb-1">Total Diproses</p>
                                    <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ syncResult.total_processed }}</p>
                                </div>
                            </div>
                            <div class="bg-green-50 border-2 border-green-200 rounded-lg p-3 sm:p-4">
                                <div class="text-center">
                                    <i class="fas fa-check-circle text-green-600 text-xl sm:text-2xl mb-1 sm:mb-2"></i>
                                    <p class="text-xs text-gray-600 mb-1">Berhasil</p>
                                    <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ syncResult.total_synced }}</p>
                                </div>
                            </div>
                            <div class="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3 sm:p-4">
                                <div class="text-center">
                                    <i class="fas fa-exclamation-circle text-yellow-600 text-xl sm:text-2xl mb-1 sm:mb-2"></i>
                                    <p class="text-xs text-gray-600 mb-1">Dilewati</p>
                                    <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ syncResult.total_skipped }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Details -->
                        <div class="border-2 border-gray-200 rounded-lg overflow-hidden">
                            <div class="bg-gray-50 px-4 py-3 border-b-2 border-gray-200">
                                <h3 class="text-xs sm:text-sm font-semibold text-gray-900">Detail Sinkronisasi</h3>
                            </div>
                            <div class="max-h-64 overflow-y-auto">
                                <table class="w-full text-xs sm:text-sm">
                                    <thead class="bg-gray-100 sticky top-0">
                                        <tr>
                                            <th class="px-3 sm:px-4 py-2 text-left text-xs font-semibold text-gray-700">Nama Peserta Didik</th>
                                            <th class="px-3 sm:px-4 py-2 text-center text-xs font-semibold text-gray-700">Status</th>
                                            <th class="px-3 sm:px-4 py-2 text-left text-xs font-semibold text-gray-700">Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200">
                                        <tr v-for="(detail, index) in syncResult.details" :key="index" class="hover:bg-gray-50">
                                            <td class="px-3 sm:px-4 py-2 text-gray-900 font-medium">
                                                {{ detail.peserta_didik_nama }}
                                            </td>
                                            <td class="px-3 sm:px-4 py-2 text-center">
                                                <span :class="[
                                                    'px-2 py-1 rounded-full text-xs font-medium',
                                                    detail.status === 'synced'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                ]">
                                                    {{ detail.status === 'synced' ? 'Berhasil' : 'Dilewati' }}
                                                </span>
                                            </td>
                                            <td class="px-3 sm:px-4 py-2 text-gray-600">
                                                {{ detail.message }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Loading State -->
                    <div v-if="isSyncing" class="flex items-center justify-center py-8 sm:py-12">
                        <div class="flex flex-col items-center gap-3">
                            <div class="h-10 w-10 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                            <p class="text-xs sm:text-sm text-gray-600 font-medium">Sedang melakukan sinkronisasi...</p>
                        </div>
                    </div>
                </div>

                <!-- Footer Actions -->
                <div class="flex-shrink-0 px-4 sm:px-8 py-3 sm:py-4 bg-white border-t border-gray-200 flex justify-end gap-2 sm:gap-3">
                    <button type="button" @click="closeModal" :disabled="isSyncing"
                        class="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-semibold text-xs sm:text-sm hover:bg-gray-50 active:bg-gray-100 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        {{ syncResult ? 'Tutup' : 'Batal' }}
                    </button>
                    <button v-if="!syncResult" type="button" @click="handleSync" :disabled="!selectedTahunPelajaran || isSyncing"
                        class="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 active:from-blue-800 active:to-cyan-800 text-white font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer">
                        <svg v-if="isSyncing" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <i v-else class="fas fa-sync-alt"></i>
                        <span>{{ isSyncing ? 'Menyinkronkan...' : 'Sync Sekarang' }}</span>
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
    tahunPelajaranList: any[]
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'success': []
}>()

const { success: showToast, error: showErrorToast } = useToast()
const { handle401 } = useAuthGuard()

const isOpen = ref(props.modelValue)
const selectedTahunPelajaran = ref<string | number>('')
const isSyncing = ref(false)
const syncResult = ref<any>(null)

watch(() => props.modelValue, (newVal) => {
    isOpen.value = newVal
    if (newVal) {
        resetForm()
        // Set default tahun pelajaran yang aktif
        const activeTp = props.tahunPelajaranList.find((tp: any) => tp.status === 'active')
        if (activeTp) {
            selectedTahunPelajaran.value = activeTp.id
        }
    }
})

watch(isOpen, (newVal) => {
    emit('update:modelValue', newVal)
})

function resetForm() {
    selectedTahunPelajaran.value = ''
    syncResult.value = null
    isSyncing.value = false
}

function closeModal() {
    isOpen.value = false
    if (syncResult.value) {
        emit('success')
    }
}

async function handleSync() {
    if (!selectedTahunPelajaran.value) {
        showErrorToast('Validasi Error', 'Silakan pilih tahun pelajaran terlebih dahulu.')
        return
    }

    isSyncing.value = true

    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const tahunPelajaranId = typeof selectedTahunPelajaran.value === 'string'
            ? parseInt(selectedTahunPelajaran.value)
            : selectedTahunPelajaran.value

        const response = await $fetch<any>(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/sync-data-induk-inklusi-rombel`,
            {
                method: 'POST',
                body: {
                    tahun_pelajaran_id: tahunPelajaranId
                },
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }
        )

        syncResult.value = response.data
        showToast('Sync Berhasil', `Berhasil melakukan sinkronisasi. ${response.data.total_synced} data berhasil disinkronkan.`)
    } catch (error: any) {
        console.error('Error syncing data:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }

        const errorMessage = error.data?.message || 'Gagal melakukan sinkronisasi data.'
        showErrorToast('Sync Gagal', errorMessage)
    } finally {
        isSyncing.value = false
    }
}
</script>

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
                class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl sm:max-w-3xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">

                <!-- Header -->
                <div
                    class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Detail Peserta Didik</h2>
                    </div>

                    <button type="button" @click.stop="closeModal" :disabled="isLoading" :title="'Tutup'"
                        class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 disabled:opacity-50 backdrop-blur-sm cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Body -->
                <div v-if="isLoading" class="p-4 sm:p-6 lg:p-8 flex items-center justify-center flex-1">
                    <div class="flex flex-col items-center gap-3 sm:gap-4">
                        <div
                            class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
                        </div>
                        <p class="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Memuat detail peserta didik...
                        </p>
                    </div>
                </div>

                <div v-else-if="pesertaDidik" class="p-3 sm:p-5 md:p-8 relative z-10 overflow-y-auto flex-1 space-y-6">
                    <!-- Peserta Didik Info Card -->
                    <div
                        class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border-2 border-blue-200 p-3 sm:p-4 md:p-6">
                        <!-- Header with Nama and Status -->
                        <div class="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <div class="min-w-0 flex-1">
                                <h3 class="text-sm sm:text-lg md:text-xl font-bold text-gray-900 truncate">{{
                                    pesertaDidik.nama }}</h3>
                                <p class="text-xs sm:text-xs md:text-sm text-gray-600 mt-0.5 sm:mt-1">Peserta Didik</p>
                            </div>
                            <div :class="[
                                'px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap flex-shrink-0',
                                pesertaDidik.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            ]">
                                {{ pesertaDidik.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                            </div>
                        </div>

                        <!-- Peserta Didik Meta Info -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                            <!-- NIS -->
                            <div class="flex items-center gap-2 sm:gap-2.5">
                                <div
                                    class="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-blue-200 flex items-center justify-center">
                                    <svg class="w-3 sm:w-4 h-3 sm:h-4 text-blue-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M10 6H5a2 2 0 00-2 2v10a2 2 0 002 2h5m0 0h5a2 2 0 002-2V8a2 2 0 00-2-2h-5m0 0V5a2 2 0 012-2h1a2 2 0 012 2v1m0 0h3a2 2 0 012 2v10a2 2 0 01-2 2h-3m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h1a2 2 0 012 2v1">
                                        </path>
                                    </svg>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-[11px] sm:text-xs text-gray-600">NIS</p>
                                    <p class="text-[11px] sm:text-xs font-semibold text-gray-900 truncate">{{
                                        pesertaDidik.nis || '-' }}</p>
                                </div>
                            </div>

                            <!-- NISN -->
                            <div class="flex items-center gap-2 sm:gap-2.5">
                                <div
                                    class="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-orange-200 flex items-center justify-center">
                                    <svg class="w-3 sm:w-4 h-3 sm:h-4 text-orange-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M7.5 8a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM0 21C0 16.58 3.582 13 8 13s8 3.582 8 8M12.75 4.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z">
                                        </path>
                                    </svg>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-[11px] sm:text-xs text-gray-600">NISN</p>
                                    <p class="text-[11px] sm:text-xs font-semibold text-gray-900 truncate">{{
                                        pesertaDidik.nisn || '-' }}</p>
                                </div>
                            </div>

                            <!-- Rombel -->
                            <div class="flex items-center gap-2 sm:gap-2.5">
                                <div
                                    class="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-purple-200 flex items-center justify-center">
                                    <svg class="w-3 sm:w-4 h-3 sm:h-4 text-purple-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17.25c0 5.25 4.5 9.75 10 9.75s10-4.5 10-9.75c0-6.252-4.5-11-10-11z">
                                        </path>
                                    </svg>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-[11px] sm:text-xs text-gray-600">Rombel</p>
                                    <p class="text-[11px] sm:text-xs font-semibold text-gray-900 truncate">{{
                                        pesertaDidik.rombel?.name || '-' }}</p>
                                </div>
                            </div>

                            <!-- Tahun Pelajaran -->
                            <div class="flex items-center gap-2 sm:gap-2.5">
                                <div
                                    class="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-green-200 flex items-center justify-center">
                                    <svg class="w-3 sm:w-4 h-3 sm:h-4 text-green-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                                        </path>
                                    </svg>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-[11px] sm:text-xs text-gray-600">Tahun Pelajaran</p>
                                    <p class="text-[11px] sm:text-xs font-semibold text-gray-900 truncate">{{
                                        pesertaDidik.tahun_pelajaran?.tahun_pelajaran || '-' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Informasi Pribadi -->
                    <div class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 p-3 sm:p-4 md:p-6">
                        <h4 class="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 sm:mb-4">Informasi Pribadi</h4>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Jenis Kelamin</p>
                                <p class="text-xs sm:text-sm font-semibold text-gray-900">{{
                                    pesertaDidik.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}</p>
                            </div>
                            <div>
                                <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Tempat Lahir</p>
                                <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ pesertaDidik.tempat_lahir || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Tanggal Lahir</p>
                                <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ formatDate(pesertaDidik.tanggal_lahir) }}</p>
                            </div>
                            <div>
                                <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Agama</p>
                                <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ pesertaDidik.agama || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-[11px] sm:text-xs text-gray-600 font-medium">NIK</p>
                                <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ pesertaDidik.nik || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Username</p>
                                <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ pesertaDidik.username || '-' }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Informasi Alamat -->
                    <div class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 p-3 sm:p-4 md:p-6">
                        <h4 class="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 sm:mb-4">Informasi Alamat</h4>
                        <div class="grid grid-cols-1 gap-3 sm:gap-4">
                            <div>
                                <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Alamat</p>
                                <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ pesertaDidik.alamat || '-' }}</p>
                            </div>
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                                <div>
                                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium">RT</p>
                                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ pesertaDidik.rt || '-' }}</p>
                                </div>
                                <div>
                                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium">RW</p>
                                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ pesertaDidik.rw || '-' }}</p>
                                </div>
                                <div>
                                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Kelurahan</p>
                                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ pesertaDidik.kelurahan || '-' }}</p>
                                </div>
                                <div>
                                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Kecamatan</p>
                                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ pesertaDidik.kecamatan || '-' }}</p>
                                </div>
                            </div>
                            <div>
                                <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Kode Pos</p>
                                <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ pesertaDidik.kode_pos || '-' }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Informasi Orang Tua -->
                    <div class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 p-3 sm:p-4 md:p-6">
                        <h4 class="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 sm:mb-4">Informasi Orang Tua</h4>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Nama Ayah</p>
                                <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ pesertaDidik.nama_ayah || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Nama Ibu</p>
                                <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ pesertaDidik.nama_ibu || '-' }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Roles -->
                    <div v-if="pesertaDidik.roles && pesertaDidik.roles.length > 0" class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 p-3 sm:p-4 md:p-6">
                        <h4 class="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 sm:mb-4">Roles Pengguna</h4>
                        <div class="space-y-2 sm:space-y-3">
                            <div v-for="role in pesertaDidik.roles" :key="role.id"
                                class="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div class="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5">
                                    <svg class="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 3.062v6.018a1 1 0 01-.999 1H6.455a1 1 0 01-.999-1V6.517a3.066 3.066 0 012.811-3.062zm7.44 5.252a1 1 0 00-1.707-1.707L9 13.414l-2.475-2.465a1 1 0 00-1.414 1.414l3.182 3.182a1 1 0 001.414 0l5.948-5.948z" clip-rule="evenodd"/>
                                    </svg>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ role.name }}</p>
                                    <p class="text-[11px] sm:text-xs text-gray-600">{{ role.system?.nama || 'System' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0 flex items-center justify-end gap-3">
                    <button @click="closeModal" :disabled="isLoading"
                        class="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getPesertaDidikById } from '~/services/peserta-didik'

const props = defineProps({
    modelValue: Boolean,
    pesertaDidikId: Number,
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>()

const isLoading = ref(false)
const pesertaDidik = ref<any>(null)

watch(
    () => props.modelValue,
    async (newVal) => {
        if (newVal && props.pesertaDidikId && props.pesertaDidikId > 0) {
            await fetchPesertaDidikDetail()
        }
    }
)

const fetchPesertaDidikDetail = async () => {
    try {
        isLoading.value = true
        const response = await getPesertaDidikById(props.pesertaDidikId!)
        pesertaDidik.value = response.data
    } catch (err) {
        console.error('Error fetching peserta didik detail:', err)
    } finally {
        isLoading.value = false
    }
}

const closeModal = () => {
    emit('update:modelValue', false)
    pesertaDidik.value = null
}

const formatDate = (dateString: string): string => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}
</script>

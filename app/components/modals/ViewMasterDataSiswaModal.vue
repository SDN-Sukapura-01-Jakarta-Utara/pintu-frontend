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
                        <h2 class="text-lg sm:text-xl font-bold text-white">Detail Data Siswa</h2>
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
                        <p class="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Memuat detail data siswa...
                        </p>
                    </div>
                </div>

                <div v-else-if="siswa" class="p-3 sm:p-5 md:p-8 relative z-10 overflow-y-auto flex-1 space-y-6">
                    <!-- Peserta Didik Info Card -->
                    <div
                        class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border-2 border-blue-200 p-3 sm:p-4 md:p-6">
                        <!-- Header with Nama and Status -->
                        <div class="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <div class="min-w-0 flex-1">
                                <h3 class="text-sm sm:text-lg md:text-xl font-bold text-gray-900 truncate">{{
                                    siswa.nama }}</h3>
                                <p class="text-xs sm:text-xs md:text-sm text-gray-600 mt-0.5 sm:mt-1">Peserta Didik</p>
                            </div>
                            <div :class="[
                                'px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap flex-shrink-0',
                                siswa.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            ]">
                                {{ siswa.status === 'active' ? 'Aktif' : 'Nonaktif' }}
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
                                        siswa.nis || '-' }}</p>
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
                                        siswa.nisn || '-' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Barcode & Foto Section -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <!-- Barcode Section -->
                        <div v-if="siswa.barcode" class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
                            <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                                <h3 class="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                                    <svg class="w-3.5 sm:w-4 h-3.5 sm:h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                                    </svg>
                                    <span>Barcode Siswa</span>
                                </h3>
                            </div>
                            <div class="p-4 sm:p-6 flex flex-col items-center justify-center">
                                <BarcodeDisplay :value="siswa.barcode" :size="140" />
                            </div>
                        </div>

                        <!-- Foto Siswa Section -->
                        <div v-if="siswa.photo" class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
                            <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                                <h3 class="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                                    <svg class="w-3.5 sm:w-4 h-3.5 sm:h-4 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    <span>Foto Siswa</span>
                                </h3>
                            </div>
                            <div class="p-4 sm:p-6 flex justify-center items-center">
                                <div class="relative">
                                    <img :src="siswa.photo" :alt="`Foto ${siswa.nama}`" class="w-24 sm:w-28 md:w-32 h-auto object-cover rounded-lg border-4 border-gray-200 shadow-md" />
                                    <div class="absolute -bottom-1.5 -right-1.5 bg-green-500 rounded-full p-1.5 border-3 border-white shadow-lg">
                                        <svg class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Informasi Pribadi -->
                    <div class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
                        <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                            <h3 class="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                                <i class="fa-solid fa-user w-3.5 sm:w-4 h-3.5 sm:h-4 text-blue-600 flex-shrink-0"></i>
                                <span>Informasi Pribadi</span>
                            </h3>
                        </div>
                        <div class="p-3 sm:p-4 md:p-6">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Jenis Kelamin</p>
                                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{
                                        siswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}</p>
                                </div>
                                <div>
                                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Tempat Lahir</p>
                                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ siswa.tempat_lahir || '-' }}</p>
                                </div>
                                <div>
                                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Tanggal Lahir</p>
                                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ formatDate(siswa.tanggal_lahir) }}</p>
                                </div>
                                <div>
                                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Agama</p>
                                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ siswa.agama || '-' }}</p>
                                </div>
                                <div>
                                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium">NIK</p>
                                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ siswa.nik || '-' }}</p>
                                </div>
                                <div>
                                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Username</p>
                                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ siswa.username || '-' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Informasi Alamat -->
                    <div class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
                        <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                            <h3 class="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                                <i class="fa-solid fa-location-dot w-3.5 sm:w-4 h-3.5 sm:h-4 text-green-600 flex-shrink-0"></i>
                                <span>Informasi Alamat</span>
                            </h3>
                        </div>
                        <div class="p-3 sm:p-4 md:p-6">
                            <div class="grid grid-cols-1 gap-3 sm:gap-4">
                                <div>
                                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Alamat</p>
                                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ siswa.alamat || '-' }}</p>
                                </div>
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                                    <div>
                                        <p class="text-[11px] sm:text-xs text-gray-600 font-medium">RT</p>
                                        <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ siswa.rt || '-' }}</p>
                                    </div>
                                    <div>
                                        <p class="text-[11px] sm:text-xs text-gray-600 font-medium">RW</p>
                                        <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ siswa.rw || '-' }}</p>
                                    </div>
                                    <div>
                                        <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Kelurahan</p>
                                        <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ siswa.kelurahan || '-' }}</p>
                                    </div>
                                    <div>
                                        <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Kecamatan</p>
                                        <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ siswa.kecamatan || '-' }}</p>
                                    </div>
                                </div>
                                <div>
                                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Kode Pos</p>
                                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ siswa.kode_pos || '-' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Informasi Orang Tua -->
                    <div class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
                        <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                            <h3 class="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                                <i class="fa-solid fa-people-roof w-3.5 sm:w-4 h-3.5 sm:h-4 text-orange-600 flex-shrink-0"></i>
                                <span>Informasi Orang Tua</span>
                            </h3>
                        </div>
                        <div class="p-3 sm:p-4 md:p-6">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Nama Ayah</p>
                                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ siswa.nama_ayah || '-' }}</p>
                                </div>
                                <div>
                                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Nama Ibu</p>
                                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ siswa.nama_ibu || '-' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Roles -->
                    <div v-if="siswa.roles && siswa.roles.length > 0"
                        class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
                        <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                            <h3 class="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                                <svg class="w-3.5 sm:w-4 h-3.5 sm:h-4 text-indigo-600 flex-shrink-0" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Roles Pengguna</span>
                            </h3>
                        </div>
                        <div class="divide-y divide-gray-200">
                            <div v-for="role in siswa.roles" :key="role.id"
                                class="flex items-start justify-between gap-2 p-3 sm:p-4 md:p-6">
                                <div class="min-w-0 flex-1">
                                    <p class="text-xs sm:text-sm font-bold text-gray-900">{{ role.name }}</p>
                                    <p class="text-[11px] sm:text-xs text-gray-600 mt-1">{{ role.system?.nama || 'System' }}</p>
                                    <p v-if="role.description" class="text-[11px] sm:text-xs text-gray-600 mt-1">{{ role.description }}</p>
                                </div>
                                <span :class="[
                                    'px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap flex-shrink-0',
                                    role.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                ]">
                                    {{ role.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                </span>
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
import BarcodeDisplay from '~/components/common/BarcodeDisplay.vue'

const props = defineProps({
    modelValue: Boolean,
    siswaId: Number,
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>()

const isLoading = ref(false)
const siswa = ref<any>(null)

watch(
    () => props.modelValue,
    async (newVal) => {
        if (newVal && props.siswaId && props.siswaId > 0) {
            await fetchsiswaDetail()
        }
    }
)

const fetchsiswaDetail = async () => {
    try {
        isLoading.value = true
        const response = await getPesertaDidikById(props.siswaId!)
        siswa.value = response.data
    } catch (err) {
        console.error('Error fetching peserta didik detail:', err)
    } finally {
        isLoading.value = false
    }
}

const closeModal = () => {
    emit('update:modelValue', false)
    siswa.value = null
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

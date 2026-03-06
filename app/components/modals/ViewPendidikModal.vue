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
                        <h2 class="text-lg sm:text-xl font-bold text-white">Detail Pendidik</h2>
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
                        <p class="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Memuat detail pendidik...
                        </p>
                    </div>
                </div>

                <div v-else-if="pendidik" class="p-3 sm:p-5 md:p-8 relative z-10 overflow-y-auto flex-1 space-y-6">
                    <!-- Pendidik Info Card -->
                    <div
                        class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border-2 border-blue-200 p-3 sm:p-4 md:p-6">
                        <!-- Header with Nama and Status -->
                        <div class="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <div class="min-w-0 flex-1">
                                <h3 class="text-sm sm:text-lg md:text-xl font-bold text-gray-900 truncate">{{
                                    pendidik.nama }}</h3>
                                <p class="text-xs sm:text-xs md:text-sm text-gray-600 mt-0.5 sm:mt-1">{{
                                    pendidik.kategori }}</p>
                            </div>
                            <div :class="[
                                'px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap flex-shrink-0',
                                pendidik.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            ]">
                                {{ pendidik.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                            </div>
                        </div>

                        <!-- Pendidik Meta Info -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                            <!-- NIP -->
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
                                    <p class="text-[11px] sm:text-xs text-gray-600">NIP</p>
                                    <p class="text-[11px] sm:text-xs font-semibold text-gray-900 truncate">{{
                                        pendidik.nip || '-' }}</p>
                                </div>
                            </div>

                            <!-- NKKI -->
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
                                    <p class="text-[11px] sm:text-xs text-gray-600">NKKI</p>
                                    <p class="text-[11px] sm:text-xs font-semibold text-gray-900 truncate">{{
                                        pendidik.nkki || '-' }}</p>
                                </div>
                            </div>

                            <!-- Username -->
                            <div class="flex items-center gap-2 sm:gap-2.5">
                                <div
                                    class="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-purple-200 flex items-center justify-center">
                                    <svg class="w-3 sm:w-4 h-3 sm:h-4 text-purple-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
                                        </path>
                                    </svg>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-[11px] sm:text-xs text-gray-600">Username</p>
                                    <p class="text-[11px] sm:text-xs font-semibold text-gray-900 truncate">{{
                                        pendidik.username }}</p>
                                </div>
                            </div>

                            <!-- Jabatan -->
                            <div class="flex items-center gap-2 sm:gap-2.5">
                                <div
                                    class="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-green-200 flex items-center justify-center">
                                    <svg class="w-3 sm:w-4 h-3 sm:h-4 text-green-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M21 13.255A23.931 23.931 0 0112 15c-3.728 0-7.196.75-10.393 2.122m19.334-4.575c-.016.109-.02.221-.02.333a11.988 11.988 0 01-2.567 7.569M15 12a3 3 0 11-6 0 3 3 0 016 0z">
                                        </path>
                                    </svg>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-[11px] sm:text-xs text-gray-600">Jabatan</p>
                                    <p class="text-[11px] sm:text-xs font-semibold text-gray-900 truncate">{{
                                        pendidik.jabatan || '-' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Foto Section -->
                    <div v-if="pendidik.foto" class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
                        <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                            <h3
                                class="text-sm sm:text-base md:text-base font-bold text-gray-900 flex items-center gap-2">
                                <i
                                    class="fa-solid fa-image w-3.5 sm:w-4 h-3.5 sm:h-4 text-orange-600 flex-shrink-0"></i>
                                <span>Foto Pendidik</span>
                            </h3>
                        </div>
                        <div class="p-3 sm:p-4 md:p-6 flex justify-center">
                            <img :src="pendidik.foto" :alt="pendidik.nama"
                                class="h-40 sm:h-48 aspect-[3/4] object-cover rounded-lg border border-gray-200 shadow-md" />
                        </div>
                    </div>

                    <!-- Dokumen Section -->
                    <div class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
                        <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                            <h3
                                class="text-sm sm:text-base md:text-base font-bold text-gray-900 flex items-center gap-2">
                                <i
                                    class="fa-solid fa-file-pdf w-3.5 sm:w-4 h-3.5 sm:h-4 text-red-600 flex-shrink-0"></i>
                                <span>Dokumen & Berkas</span>
                            </h3>
                        </div>
                        <div class="p-3 sm:p-4 md:p-6">
                            <div class="space-y-2">
                                <!-- Single File Fields -->
                                <div v-for="field in singleFileFields" :key="field.key"
                                    class="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                        <div v-if="pendidik[field.key]" class="flex-shrink-0">
                                            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="currentColor"
                                                viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                        <div v-else class="flex-shrink-0">
                                            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-red-400" fill="currentColor"
                                                viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                        <div class="min-w-0">
                                            <p class="text-xs sm:text-sm font-medium text-gray-900">{{ field.label }}
                                            </p>
                                        </div>
                                    </div>
                                    <div v-if="pendidik[field.key]" class="flex-shrink-0 ml-2">
                                        <a :href="pendidik[field.key]" target="_blank" rel="noopener noreferrer"
                                            class="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors text-[11px] sm:text-xs font-semibold cursor-pointer">
                                            <i class="fa-solid fa-external-link w-3 h-3"></i>
                                            <span>Lihat</span>
                                        </a>
                                    </div>
                                </div>

                                <!-- Multiple File Fields -->
                                <div v-for="field in multipleFileFields" :key="field.key">
                                    <div class="flex items-center gap-2 sm:gap-3 mb-2">
                                        <div v-if="pendidik[field.key] && Array.isArray(pendidik[field.key]) && pendidik[field.key].length > 0"
                                            class="flex-shrink-0">
                                            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="currentColor"
                                                viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                        <div v-else class="flex-shrink-0">
                                            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-red-400" fill="currentColor"
                                                viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                        <p class="text-xs sm:text-sm font-medium text-gray-900">{{ field.label }}</p>
                                    </div>
                                    <div v-if="pendidik[field.key] && Array.isArray(pendidik[field.key]) && pendidik[field.key].length > 0"
                                        class="space-y-1.5 ml-8 sm:ml-10">
                                        <div v-for="(fileUrl, idx) in pendidik[field.key]" :key="idx"
                                            class="flex items-center gap-2">
                                            <span class="text-[10px] sm:text-xs text-gray-600">{{ `File ${idx + 1}`
                                                }}</span>
                                            <a :href="fileUrl" target="_blank" rel="noopener noreferrer"
                                                class="inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors text-[10px] sm:text-xs font-semibold cursor-pointer">
                                                <i class="fa-solid fa-external-link w-2.5 h-2.5"></i>
                                                <span>Lihat</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Role Section -->
                    <div v-if="pendidik.roles && pendidik.roles.length > 0"
                        class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
                        <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                            <h3
                                class="text-sm sm:text-base md:text-base font-bold text-gray-900 flex items-center gap-2">
                                <svg class="w-3.5 sm:w-4 h-3.5 sm:h-4 text-blue-600 flex-shrink-0" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Role & Sistem</span>
                            </h3>
                        </div>
                        <div class="divide-y divide-gray-200">
                            <div v-for="role in pendidik.roles" :key="role.id" class="p-3 sm:p-4 md:p-6">
                                <div class="flex items-start justify-between gap-2">
                                    <div class="min-w-0 flex-1">
                                        <h4 class="text-xs sm:text-sm font-bold text-gray-900">{{ role.name }}</h4>
                                        <p class="text-xs text-gray-600 mt-1">{{ role.system?.name || 'Sistem' }}</p>
                                        <p v-if="role.description" class="text-[11px] sm:text-xs text-gray-600 mt-1">{{
                                            role.description }}</p>
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

                    <!-- Bidang Studi Section -->
                    <div v-if="pendidik.bidang_studi_id"
                        class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
                        <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                            <h3
                                class="text-sm sm:text-base md:text-base font-bold text-gray-900 flex items-center gap-2">
                                <i
                                    class="fa-solid fa-book-open w-3.5 sm:w-4 h-3.5 sm:h-4 text-purple-600 flex-shrink-0"></i>
                                <span>Bidang Studi</span>
                            </h3>
                        </div>
                        <div class="p-3 sm:p-4 md:p-6">
                            <span
                                class="inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-purple-100 text-purple-800">
                                {{ bidangStudiName }}
                            </span>
                        </div>
                    </div>

                    <!-- Rombel Section -->
                    <div v-if="rombelInfo.length > 0"
                        class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
                        <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                            <h3
                                class="text-sm sm:text-base md:text-base font-bold text-gray-900 flex items-center gap-2">
                                <i
                                    class="fa-solid fa-chalkboard-user w-3.5 sm:w-4 h-3.5 sm:h-4 text-indigo-600 flex-shrink-0"></i>
                                <span>Rombel yang Diampu</span>
                            </h3>
                        </div>
                        <div class="p-3 sm:p-4 md:p-6">
                            <div class="flex flex-wrap gap-2">
                                <span v-for="rombel in rombelInfo" :key="rombel"
                                    class="inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-indigo-100 text-indigo-800">
                                    {{ rombel }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Timeline Info -->
                    <div class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 p-3 sm:p-4 md:p-6">
                        <h3 class="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                            <svg class="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-600" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Informasi
                        </h3>
                        <div class="space-y-2 text-xs sm:text-sm">
                            <div
                                class="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2 py-2 border-b border-gray-100">
                                <span class="text-gray-600">Dibuat pada:</span>
                                <span class="font-medium text-gray-900">{{ formatDateTime(pendidik.created_at) }}</span>
                            </div>
                            <div v-if="pendidik.updated_at"
                                class="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2 py-2">
                                <span class="text-gray-600">Diperbarui pada:</span>
                                <span class="font-medium text-gray-900">{{ formatDateTime(pendidik.updated_at) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Close Button -->
                <div class="p-4 sm:p-8 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                    <button @click="closeModal"
                        class="w-full px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200 cursor-pointer">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { getKepegawaianById } from '~/services/kepegawaian'
import { getRombelList } from '~/services/rombel'
import { getBidangStudiList } from '~/services/bidang-studi'

const props = defineProps({
    modelValue: Boolean,
    pendidikId: {
        type: Number,
        default: 0,
    },
})

const emit = defineEmits(['update:modelValue'])

const isLoading = ref(false)
const pendidik = ref<any>(null)
const rombels = ref<any[]>([])
const bidangStudis = ref<any[]>([])

const singleFileFields = [
    { key: 'kk', label: 'Kartu Keluarga' },
    { key: 'akta_lahir', label: 'Akta Lahir' },
    { key: 'ktp', label: 'KTP' },
    { key: 'ijazah_sd', label: 'Ijazah SD' },
    { key: 'ijazah_smp', label: 'Ijazah SMP' },
    { key: 'ijazah_sma', label: 'Ijazah SMA' },
    { key: 'ijazah_s1', label: 'Ijazah S1' },
    { key: 'ijazah_s2', label: 'Ijazah S2' },
    { key: 'ijazah_s3', label: 'Ijazah S3' },
    { key: 'sertifikat_pendidik', label: 'Sertifikat Pendidik' },
    { key: 'sk', label: 'SK' }
]

const multipleFileFields = [
    { key: 'sertifikat_lainnya', label: 'Sertifikat Lainnya' },
    { key: 'dokumen_lainnya', label: 'Dokumen Lainnya' }
]

watch(
    () => props.modelValue,
    async (newVal) => {
        if (newVal && props.pendidikId > 0) {
            await fetchPendidikDetail()
        }
    }
)

const fetchPendidikDetail = async () => {
    try {
        isLoading.value = true

        // Fetch pendidik detail (sudah include nested objects: bidang_studi, rombel_guru_kelas)
        const pendidikResponse = await getKepegawaianById(props.pendidikId)
        pendidik.value = pendidikResponse.data

        // Fetch rombel list untuk resolve rombel_bidang_studi IDs
        const rombelResponse = await getRombelList()
        rombels.value = rombelResponse.data || []
    } catch (err) {
        console.error('Error fetching pendidik detail:', err)
    } finally {
        isLoading.value = false
    }
}

const bidangStudiName = computed(() => {
    if (!pendidik.value) return ''
    // Use nested object if available, otherwise fallback
    return pendidik.value.bidang_studi?.name || 'Bidang Studi'
})

const rombelInfo = computed(() => {
    if (!pendidik.value) return []
    const rombelsInfo = []

    // Wali kelas - use nested object if available
    if (pendidik.value.rombel_guru_kelas) {
        rombelsInfo.push(`Wali Kelas: ${pendidik.value.rombel_guru_kelas.name}`)
    }

    // Guru bidang studi rombel - resolve IDs from rombel list and group by bidang studi
    if (pendidik.value.rombel_bidang_studi && Array.isArray(pendidik.value.rombel_bidang_studi) && pendidik.value.rombel_bidang_studi.length > 0) {
        const bidangStudiRombels: string[] = []
        pendidik.value.rombel_bidang_studi.forEach((rombelId: number) => {
            const rombelBidangStudi = rombels.value.find(r => r.id === rombelId)
            if (rombelBidangStudi) {
                bidangStudiRombels.push(rombelBidangStudi.name)
            }
        })
        if (bidangStudiRombels.length > 0) {
            rombelsInfo.push(`${bidangStudiName.value}: ${bidangStudiRombels.join(', ')}`)
        }
    }

    return rombelsInfo
})

const closeModal = () => {
    emit('update:modelValue', false)
    pendidik.value = null
}

const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}
</script>

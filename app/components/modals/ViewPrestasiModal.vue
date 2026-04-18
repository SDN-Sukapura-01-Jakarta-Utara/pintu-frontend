<template>
    <Teleport to="body">
    <!-- Backdrop -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="modelValue" @click="closeModal" class="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"></div>
    </Transition>

    <!-- Modal -->
    <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4">
        <div v-if="modelValue"
            class="fixed inset-0 z-[101] flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div
                class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl sm:max-w-3xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">

                <!-- Header -->
                <div
                    class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Detail Prestasi</h2>
                    </div>

                    <button type="button" @click.stop="closeModal" :disabled="isLoading"
                        class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 disabled:opacity-50 backdrop-blur-sm cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Loading -->
                <div v-if="isLoading" class="p-4 sm:p-6 lg:p-8 flex items-center justify-center flex-1">
                    <div class="flex flex-col items-center gap-3 sm:gap-4">
                        <div
                            class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
                        </div>
                        <p class="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Memuat detail prestasi...
                        </p>
                    </div>
                </div>

                <!-- Body -->
                <div v-else-if="prestasi" class="p-3 sm:p-5 md:p-8 overflow-y-auto flex-1 space-y-6">

                    <!-- Prestasi Header Card -->
                    <div
                        class="rounded-lg sm:rounded-xl border-2 shadow-sm p-3 sm:p-4 md:p-6"
                        style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border-color: #7dd3fc;">
                        <div class="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <div class="min-w-0 flex-1">
                                <h3 class="text-sm sm:text-lg md:text-xl font-bold text-gray-900">
                                    {{ prestasi.nama_prestasi }}
                                </h3>
                                <p class="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                                    {{ prestasi.tahun_pelajaran?.tahun_pelajaran || '-' }}
                                </p>
                            </div>
                            <div class="flex flex-col items-end gap-1.5 flex-shrink-0">
                                <span :class="[
                                    'px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap',
                                    prestasi.jenis === 'Individu'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-purple-100 text-purple-800'
                                ]">
                                    {{ prestasi.jenis }}
                                </span>
                                <span
                                    class="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-yellow-100 text-yellow-800 whitespace-nowrap">
                                    {{ prestasi.juara }}
                                </span>
                            </div>
                        </div>

                        <!-- Meta Info -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                            <div class="flex items-center gap-2 sm:gap-2.5">
                                <div
                                    class="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-lg flex items-center justify-center"
                                    style="background-color: #fde68a;">
                                    <i class="fa-solid fa-trophy text-[10px] sm:text-xs" style="color: #ca8a04;"></i>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-[11px] sm:text-xs text-gray-600">Tingkat</p>
                                    <p class="text-[11px] sm:text-xs font-semibold text-gray-900">{{
                                        prestasi.tingkat_prestasi || '-' }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2 sm:gap-2.5">
                                <div
                                    class="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-lg flex items-center justify-center"
                                    style="background-color: #bfdbfe;">
                                    <i class="fa-solid fa-building text-[10px] sm:text-xs" style="color: #2563eb;"></i>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-[11px] sm:text-xs text-gray-600">Penyelenggara</p>
                                    <p class="text-[11px] sm:text-xs font-semibold text-gray-900">{{
                                        prestasi.penyelenggara || '-' }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2 sm:gap-2.5">
                                <div
                                    class="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-lg flex items-center justify-center"
                                    style="background-color: #bbf7d0;">
                                    <i class="fa-solid fa-calendar text-[10px] sm:text-xs" style="color: #16a34a;"></i>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-[11px] sm:text-xs text-gray-600">Tanggal Lomba</p>
                                    <p class="text-[11px] sm:text-xs font-semibold text-gray-900">{{
                                        formatDate(prestasi.tanggal_lomba) }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2 sm:gap-2.5">
                                <div
                                    class="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-lg flex items-center justify-center"
                                    style="background-color: #e9d5ff;">
                                    <i class="fa-solid fa-futbol text-[10px] sm:text-xs" style="color: #9333ea;"></i>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-[11px] sm:text-xs text-gray-600">Ekstrakurikuler</p>
                                    <p class="text-[11px] sm:text-xs font-semibold text-gray-900">{{
                                        prestasi.ekstrakurikuler?.name || '-' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Peserta Didik (Individu) -->
                    <div v-if="prestasi.jenis === 'Individu' && prestasi.peserta_didik"
                        class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
                        <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                            <h3 class="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                                <i
                                    class="fa-solid fa-user w-3.5 sm:w-4 h-3.5 sm:h-4 text-blue-600 flex-shrink-0"></i>
                                <span>Peserta Didik</span>
                            </h3>
                        </div>
                        <div class="p-3 sm:p-4 md:p-6">
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                <div>
                                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Nama</p>
                                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{
                                        prestasi.peserta_didik.nama }}</p>
                                </div>
                                <div>
                                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium">NIS</p>
                                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{
                                        prestasi.peserta_didik.nis }}</p>
                                </div>
                                <div>
                                    <p class="text-[11px] sm:text-xs text-gray-600 font-medium">Rombel</p>
                                    <p class="text-xs sm:text-sm font-semibold text-gray-900">{{
                                        prestasi.peserta_didik.rombel?.name || '-' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Anggota Tim (Tim) -->
                    <div v-if="prestasi.jenis === 'Tim'"
                        class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
                        <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                            <h3 class="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                                <i
                                    class="fa-solid fa-users w-3.5 sm:w-4 h-3.5 sm:h-4 text-purple-600 flex-shrink-0"></i>
                                <span>Anggota Tim: {{ prestasi.nama_grup }}</span>
                            </h3>
                        </div>
                        <div class="p-3 sm:p-4 md:p-6">
                            <div
                                v-if="prestasi.anggota_tim_prestasi && prestasi.anggota_tim_prestasi.length > 0"
                                class="overflow-x-auto rounded-lg border border-gray-200">
                                <table class="w-full">
                                    <thead>
                                        <tr class="bg-gray-100">
                                            <th
                                                class="px-3 sm:px-4 py-2 text-left text-xs font-semibold uppercase text-gray-600 w-10">
                                                No</th>
                                            <th
                                                class="px-3 sm:px-4 py-2 text-left text-xs font-semibold uppercase text-gray-600">
                                                Nama Siswa</th>
                                            <th
                                                class="px-3 sm:px-4 py-2 text-left text-xs font-semibold uppercase text-gray-600">
                                                NIS</th>
                                            <th
                                                class="px-3 sm:px-4 py-2 text-left text-xs font-semibold uppercase text-gray-600">
                                                Rombel</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200">
                                        <tr v-for="(anggota, idx) in prestasi.anggota_tim_prestasi"
                                            :key="anggota.id" class="hover:bg-gray-50">
                                            <td class="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700">{{
                                                idx + 1 }}</td>
                                            <td
                                                class="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 font-medium">
                                                {{ anggota.peserta_didik?.nama || '-' }}</td>
                                            <td class="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700">{{
                                                anggota.peserta_didik?.nis || '-' }}</td>
                                            <td class="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700">{{
                                                anggota.peserta_didik?.rombel?.name || '-' }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p v-else class="text-xs sm:text-sm text-gray-400 italic">Tidak ada data anggota tim</p>
                        </div>
                    </div>

                    <!-- Keterangan -->
                    <div v-if="prestasi.keterangan"
                        class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
                        <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                            <h3 class="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                                <i
                                    class="fa-solid fa-comment w-3.5 sm:w-4 h-3.5 sm:h-4 text-green-600 flex-shrink-0"></i>
                                <span>Keterangan</span>
                            </h3>
                        </div>
                        <div class="p-3 sm:p-4 md:p-6">
                            <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">{{ prestasi.keterangan }}</p>
                        </div>
                    </div>

                    <!-- Foto -->
                    <div v-if="prestasi.foto && prestasi.foto.length > 0"
                        class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
                        <div class="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                            <h3 class="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                                <i
                                    class="fa-solid fa-images w-3.5 sm:w-4 h-3.5 sm:h-4 text-orange-600 flex-shrink-0"></i>
                                <span>Foto Prestasi</span>
                            </h3>
                        </div>
                        <div class="p-3 sm:p-4 md:p-6">
                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div v-for="(foto, idx) in prestasi.foto" :key="foto.id"
                                    class="relative group cursor-pointer" @click="openPhoto(idx)">
                                    <img :src="foto.url" :alt="foto.filename"
                                        class="w-full aspect-square object-cover rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-colors" />
                                    <div
                                        class="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                        <i
                                            class="fa-solid fa-magnifying-glass-plus text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                    </div>
                                    <span v-if="foto.thumbnail === 'active'"
                                        class="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-green-600 text-white text-[10px] font-semibold rounded">
                                        Thumbnail
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div
                    class="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0 flex items-center justify-end gap-3">
                    <button @click="closeModal" :disabled="isLoading"
                        class="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getPrestasiById } from '~/services/prestasi'

const props = defineProps({
    modelValue: Boolean,
    prestasiId: Number,
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'openPhoto': [photos: any[], index: number]
}>()

const isLoading = ref(false)
const prestasi = ref<any>(null)

watch(
    () => props.modelValue,
    async (newVal) => {
        if (newVal && props.prestasiId && props.prestasiId > 0) {
            await fetchDetail()
        }
    }
)

const fetchDetail = async () => {
    try {
        isLoading.value = true
        const response = await getPrestasiById(props.prestasiId!)
        prestasi.value = response.data
    } catch (err) {
        console.error('Error fetching prestasi detail:', err)
    } finally {
        isLoading.value = false
    }
}

const closeModal = () => {
    emit('update:modelValue', false)
    prestasi.value = null
}

const openPhoto = (index: number) => {
    if (prestasi.value?.foto) {
        emit('openPhoto', prestasi.value.foto, index)
    }
}

const formatDate = (dateString: string): string => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    })
}
</script>

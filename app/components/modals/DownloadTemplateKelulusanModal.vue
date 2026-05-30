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
                class="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]">

                <!-- Header -->
                <div
                    class="bg-green-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <div class="absolute top-0 right-0 w-40 h-40 bg-green-500/20 rounded-full blur-3xl"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-green-700/20 rounded-full blur-3xl"></div>

                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Download Template Excel</h2>
                    </div>

                    <button type="button" @click.stop="closeModal" :disabled="isDownloading" :title="'Tutup'"
                        class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 disabled:opacity-50 backdrop-blur-sm cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Body -->
                <div class="p-4 sm:p-8 relative z-10 overflow-y-auto flex-1">
                    <form @submit.prevent="handleDownload" class="space-y-4 sm:space-y-6">
                        <!-- Info -->
                        <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                            <div class="flex items-start gap-3">
                                <i class="fa-solid fa-info-circle text-blue-600 text-lg flex-shrink-0 mt-0.5"></i>
                                <div>
                                    <p class="text-sm font-semibold text-blue-900 mb-1">Tentukan Mata Pelajaran</p>
                                    <p class="text-xs text-blue-800">
                                        Masukkan mata pelajaran yang akan digunakan dalam template Excel. 
                                        Setiap mata pelajaran akan menjadi kolom nilai di template.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Input Mata Pelajaran Section -->
                        <div>
                            <div class="flex items-center justify-between mb-3">
                                <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900">
                                    Daftar Mata Pelajaran
                                    <span class="text-red-600 ml-1">*</span>
                                </label>
                                <button type="button" @click="addMapel" :disabled="isDownloading"
                                    class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    <i class="fa-solid fa-plus w-3 h-3"></i>
                                    Tambah Mapel
                                </button>
                            </div>

                            <!-- Mapel List -->
                            <div class="space-y-3">
                                <div v-for="(mapel, index) in mapelList" :key="index"
                                    class="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-gray-200">
                                    <!-- Mata Pelajaran Input -->
                                    <div class="flex-1">
                                        <input v-model="mapel.nama" type="text" placeholder="Contoh: Matematika"
                                            required :disabled="isDownloading"
                                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                                    </div>

                                    <!-- Delete Button -->
                                    <button type="button" @click="removeMapel(index)"
                                        :disabled="isDownloading || mapelList.length === 1"
                                        class="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex-shrink-0">
                                        <i class="fa-solid fa-trash w-4 h-4"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-200">
                            <button type="button" @click="closeModal" :disabled="isDownloading"
                                class="flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-semibold text-xs sm:text-sm hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                Batal
                            </button>
                            <button type="submit" :disabled="isDownloading"
                                class="flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-green-600 text-white font-semibold text-xs sm:text-sm hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2">
                                <i v-if="isDownloading" class="fa-solid fa-spinner fa-spin"></i>
                                <i v-else class="fa-solid fa-download"></i>
                                <span>{{ isDownloading ? 'Mengunduh...' : 'Download Template' }}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { downloadTemplateKelulusan } from '~/services/kelulusan'
import { useToast } from '~/composables/useToast'

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>()

const toast = useToast()

const isDownloading = ref(false)

const mapelList = ref<Array<{ nama: string }>>([
    { nama: '' }
])

// Methods
const addMapel = () => {
    mapelList.value.push({ nama: '' })
}

const removeMapel = (index: number) => {
    if (mapelList.value.length > 1) {
        mapelList.value.splice(index, 1)
    }
}

const handleDownload = async () => {
    // Validate mapel list
    const hasEmptyMapel = mapelList.value.some(m => !m.nama.trim())
    if (hasEmptyMapel) {
        toast.error('Validasi Gagal', 'Semua mata pelajaran harus diisi')
        return
    }

    isDownloading.value = true

    try {
        const mapelNames = mapelList.value.map(m => m.nama.trim())
        
        const response = await downloadTemplateKelulusan({ mapel_list: mapelNames })
        
        // Create blob and download
        const blob = new Blob([response], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `template_kelulusan_${new Date().getTime()}.xlsx`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        toast.success('Berhasil', 'Template berhasil diunduh')
        closeModal()
    } catch (error: any) {
        console.error('Error downloading template:', error)
        const errorMessage = error?.data?.error || error?.message || 'Gagal mengunduh template'
        toast.error('Gagal', errorMessage)
    } finally {
        isDownloading.value = false
    }
}

const closeModal = () => {
    if (!isDownloading.value) {
        emit('update:modelValue', false)
    }
}

const resetForm = () => {
    mapelList.value = [{ nama: '' }]
}

// Watch for modal close to reset form
watch(() => props.modelValue, (newValue) => {
    if (!newValue) {
        setTimeout(resetForm, 300)
    }
})
</script>

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
                class="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-2xl w-full max-w-5xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[90vh]">

                <!-- Header -->
                <div
                    class="bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <div class="absolute top-0 right-0 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl -z-0"></div>

                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Download Kartu Pelajar</h2>
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
                    <!-- Option Selection -->
                    <div class="space-y-4 mb-6">
                        <label class="block text-sm sm:text-base font-semibold text-gray-900">
                            Pilih Opsi Download
                        </label>

                        
                        <!-- Semua Siswa Aktif Option -->
                        <label class="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all"
                            :class="downloadOption === 'all' ? 'border-amber-600 bg-amber-50' : 'border-gray-300 hover:border-amber-400'">
                            <input type="radio" v-model="downloadOption" value="all" :disabled="isDownloading"
                                class="w-4 h-4 text-amber-600 cursor-pointer" />
                            <div>
                                <p class="text-sm font-semibold text-gray-900">Semua Siswa Aktif</p>
                                <p class="text-xs text-gray-600">Download kartu pelajar untuk semua siswa yang aktif</p>
                            </div>
                        </label>

                        <!-- Siswa Tertentu Option -->
                        <label class="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all"
                            :class="downloadOption === 'specific' ? 'border-amber-600 bg-amber-50' : 'border-gray-300 hover:border-amber-400'">
                            <input type="radio" v-model="downloadOption" value="specific" :disabled="isDownloading"
                                class="w-4 h-4 text-amber-600 cursor-pointer" />
                            <div>
                                <p class="text-sm font-semibold text-gray-900">Siswa Tertentu</p>
                                <p class="text-xs text-gray-600">Pilih siswa tertentu untuk di-download kartu pelajarnya</p>
                            </div>
                        </label>
                    </div>

                    <!-- Specific Student Selection -->
                    <div v-if="downloadOption === 'specific'" class="space-y-4">
                        <!-- Search Section -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-900 mb-2">
                                Cari Siswa
                            </label>
                            <div class="flex gap-2">
                                <input v-model="searchQuery" type="text" placeholder="Cari berdasarkan nama..."
                                    :disabled="isSearching || isDownloading"
                                    @keyup.enter="searchStudents"
                                    class="flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                                <button @click="searchStudents" :disabled="isSearching || isDownloading || !searchQuery.trim()"
                                    class="px-4 py-2 rounded-lg bg-amber-600 text-white font-semibold text-sm hover:bg-amber-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    <i v-if="!isSearching" class="fa-solid fa-magnifying-glass"></i>
                                    <i v-else class="fa-solid fa-spinner fa-spin"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Search Results & Selected Students -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Search Results (Left) -->
                            <div class="bg-white rounded-lg border-2 border-gray-300">
                                <div class="bg-gray-100 px-4 py-2 border-b border-gray-300">
                                    <h3 class="text-sm font-bold text-gray-900">Hasil Pencarian</h3>
                                </div>
                                <div class="p-2 max-h-64 overflow-y-auto">
                                    <div v-if="isSearching" class="flex items-center justify-center py-8">
                                        <div class="flex flex-col items-center gap-2">
                                            <div class="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-amber-600"></div>
                                            <p class="text-xs text-gray-600">Mencari...</p>
                                        </div>
                                    </div>
                                    <div v-else-if="searchResults.length === 0" class="flex items-center justify-center py-8">
                                        <p class="text-xs text-gray-500 text-center">
                                            {{ searchQuery ? 'Tidak ada siswa ditemukan' : 'Masukkan kata kunci untuk mencari siswa' }}
                                        </p>
                                    </div>
                                    <div v-else class="space-y-2">
                                        <div v-for="student in searchResults" :key="student.id"
                                            class="flex items-start justify-between gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                            <div class="flex-1 min-w-0">
                                                <p class="text-sm font-semibold text-gray-900 truncate">{{ student.nama }}</p>
                                                <p class="text-xs text-gray-600">NIS: {{ student.nis }}</p>
                                                <p class="text-xs text-gray-600">NISN: {{ student.nisn }}</p>
                                            </div>
                                            <button @click="selectStudent(student)" :disabled="isStudentSelected(student.id) || isDownloading"
                                                class="px-3 py-1.5 rounded-lg bg-green-600 text-white font-semibold text-xs hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap">
                                                {{ isStudentSelected(student.id) ? 'Terpilih' : 'Pilih' }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Selected Students (Right) -->
                            <div class="bg-white rounded-lg border-2 border-gray-300">
                                <div class="bg-amber-100 px-4 py-2 border-b border-amber-300 flex items-center justify-between">
                                    <h3 class="text-sm font-bold text-gray-900">Siswa Terpilih ({{ selectedStudents.length }})</h3>
                                    <button v-if="selectedStudents.length > 0" @click="clearSelectedStudents" :disabled="isDownloading"
                                        class="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer disabled:opacity-50">
                                        Hapus Semua
                                    </button>
                                </div>
                                <div class="p-2 max-h-64 overflow-y-auto">
                                    <div v-if="selectedStudents.length === 0" class="flex items-center justify-center py-8">
                                        <p class="text-xs text-gray-500 text-center">Belum ada siswa yang dipilih</p>
                                    </div>
                                    <div v-else class="space-y-2">
                                        <div v-for="student in selectedStudents" :key="student.id"
                                            class="flex items-start justify-between gap-2 p-3 rounded-lg border border-amber-200 bg-amber-50">
                                            <div class="flex-1 min-w-0">
                                                <p class="text-sm font-semibold text-gray-900 truncate">{{ student.nama }}</p>
                                                <p class="text-xs text-gray-600">NIS: {{ student.nis }}</p>
                                                <p class="text-xs text-gray-600">NISN: {{ student.nisn }}</p>
                                            </div>
                                            <button @click="removeStudent(student.id)" :disabled="isDownloading"
                                                class="text-red-600 hover:text-red-700 transition-colors cursor-pointer disabled:opacity-50">
                                                <i class="fa-solid fa-xmark w-4 h-4"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0 flex items-center justify-end gap-3">
                    <button @click="closeModal" :disabled="isDownloading"
                        class="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 font-semibold text-sm hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        Batal
                    </button>
                    <button @click="downloadKartu" :disabled="isDownloading || !canDownload"
                        class="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-700 text-white font-semibold text-sm hover:bg-amber-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        <i v-if="!isDownloading" class="fa-solid fa-download"></i>
                        <i v-else class="fa-solid fa-spinner fa-spin"></i>
                        <span>{{ isDownloading ? 'Mengunduh...' : 'Download Kartu' }}</span>
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>



<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useToastStore } from '~/stores/ToastStore'
import { useAuthGuard } from '~/composables/useAuthGuard'

const props = defineProps({
    modelValue: Boolean,
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'success': []
}>()

const toastStore = useToastStore()
const config = useRuntimeConfig()
const { handle401 } = useAuthGuard()

const downloadOption = ref<'all' | 'specific'>('all')
const searchQuery = ref('')
const isSearching = ref(false)
const isDownloading = ref(false)
const searchResults = ref<any[]>([])
const selectedStudents = ref<any[]>([])

const canDownload = computed(() => {
    if (downloadOption.value === 'all') return true
    return selectedStudents.value.length > 0
})

watch(() => props.modelValue, (newVal) => {
    if (!newVal) {
        downloadOption.value = 'all'
        searchQuery.value = ''
        searchResults.value = []
        selectedStudents.value = []
    }
})

const searchStudents = async () => {
    if (!searchQuery.value.trim()) return

    isSearching.value = true
    try {
        const response = await $fetch<any>(`${config.public.apiBase}/api/v1/peserta-didik/get-peserta-didik`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            credentials: 'include',
            body: {
                search: {
                    status: 'active',
                    nama: searchQuery.value,
                },
                pagination: {
                    limit: 50,
                    page: 1
                }
            }
        })

        searchResults.value = response.data || []
    } catch (err: any) {
        console.error('Error searching students:', err)
        
        if (err.status === 401 || err.statusCode === 401) {
            await handle401()
            return
        }
        
        toastStore.error('Gagal', 'Gagal mencari siswa')
    } finally {
        isSearching.value = false
    }
}

const isStudentSelected = (studentId: number): boolean => {
    return selectedStudents.value.some(s => s.id === studentId)
}

const selectStudent = (student: any) => {
    if (!isStudentSelected(student.id)) {
        selectedStudents.value.push(student)
    }
}

const removeStudent = (studentId: number) => {
    selectedStudents.value = selectedStudents.value.filter(s => s.id !== studentId)
}

const clearSelectedStudents = () => {
    selectedStudents.value = []
}

const downloadKartu = async () => {
    isDownloading.value = true

    try {
        let requestBody = {}

        if (downloadOption.value === 'specific') {
            requestBody = {
                peserta_didik_ids: selectedStudents.value.map(s => s.id)
            }
        }

        const response = await fetch(`${config.public.apiBase}/api/v1/peserta-didik/download-kartu-pelajar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            credentials: 'include',
            body: JSON.stringify(requestBody)
        })

        if (response.status === 401) {
            await handle401()
            return
        }

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Gagal download kartu pelajar')
        }

        const contentDisposition = response.headers.get('Content-Disposition')
        let filename = 'kartu-pelajar.pdf'
        if (contentDisposition) {
            const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition)
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '')
            }
        }

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toastStore.success('Sukses', 'Kartu pelajar berhasil diunduh')
        emit('success')
        closeModal()
    } catch (err: any) {
        console.error('Error downloading kartu pelajar:', err)
        toastStore.error('Gagal', err.message || 'Gagal download kartu pelajar')
    } finally {
        isDownloading.value = false
    }
}

const closeModal = () => {
    emit('update:modelValue', false)
}
</script>

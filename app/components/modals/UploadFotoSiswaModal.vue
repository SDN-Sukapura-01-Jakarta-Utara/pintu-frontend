<template>
    <!-- Backdrop -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="modelValue" @click.stop="closeModal" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"></div>
    </Transition>

    <!-- Modal -->
    <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4">
        <div v-if="modelValue"
            class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div @click.stop
                class="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto relative overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">

                <!-- Header -->
                <div
                    class="bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex items-center justify-between gap-4">
                    <div class="absolute top-0 right-0 w-40 h-40 bg-green-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl -z-0"></div>

                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Upload Foto Siswa</h2>
                        <p v-if="siswaName" class="text-xs sm:text-sm text-white/90 mt-0.5">{{ siswaName }}</p>
                    </div>

                    <button type="button" @click.stop="closeModal" :disabled="isSubmitting"
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
                            class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-green-600">
                        </div>
                        <p class="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Memuat data siswa...</p>
                    </div>
                </div>

                <div v-else class="p-4 sm:p-6 lg:p-8 overflow-y-auto flex-1">
                    <!-- Current Photo -->
                    <div v-if="currentPhoto" class="mb-6">
                        <label class="block text-sm font-semibold text-gray-900 mb-2">Foto Saat Ini</label>
                        <div class="flex justify-center">
                            <img :src="currentPhoto" alt="Foto Saat Ini" class="w-32 h-40 object-cover rounded-lg border-2 border-gray-300 shadow-md" />
                        </div>
                    </div>

                    <!-- Upload New Photo -->
                    <div class="mb-6">
                        <label for="photo-upload" class="block text-sm font-semibold text-gray-900 mb-2">
                            {{ currentPhoto ? 'Upload Foto Baru' : 'Upload Foto' }}
                        </label>
                        <input 
                            id="photo-upload"
                            type="file" 
                            accept="image/*"
                            @change="handleFileChange"
                            class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 file:cursor-pointer"
                        />
                        <p class="mt-2 text-xs text-gray-500">Maksimal ukuran file 2MB. Format: JPG, PNG, JPEG</p>
                    </div>

                    <!-- Preview New Photo -->
                    <div v-if="photoPreview" class="mb-6">
                        <label class="block text-sm font-semibold text-gray-900 mb-2">Preview Foto Baru</label>
                        <div class="flex justify-center">
                            <img :src="photoPreview" alt="Preview" class="w-32 h-40 object-cover rounded-lg border-2 border-green-300 shadow-md" />
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0 flex items-center justify-end gap-3">
                    <button type="button" @click="closeModal" :disabled="isSubmitting"
                        class="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        Batal
                    </button>
                    <button type="button" @click="handleSubmit" :disabled="isSubmitting || !photoFile"
                        class="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold text-xs sm:text-sm hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2">
                        <i v-if="isSubmitting" class="fa-solid fa-spinner fa-spin"></i>
                        <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}</span>
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useAuthGuard } from '~/composables/useAuthGuard'
import { useToastStore } from '~/stores/ToastStore'

const props = defineProps({
    modelValue: Boolean,
    pemetaanId: Number,
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'success': []
}>()

const config = useRuntimeConfig()
const { handle401 } = useAuthGuard()
const toastStore = useToastStore()

const isSubmitting = ref(false)
const isLoading = ref(false)
const photoFile = ref<File | null>(null)
const currentPhoto = ref<string>('')
const siswaName = ref<string>('')
const pesertaDidikId = ref<number>(0)

const photoPreview = computed(() => {
    if (photoFile.value) {
        return URL.createObjectURL(photoFile.value)
    }
    return ''
})

watch(
    () => props.modelValue,
    async (newVal) => {
        if (newVal && props.pemetaanId && props.pemetaanId > 0) {
            await fetchPemetaanDetail()
        } else {
            resetForm()
        }
    }
)

const fetchPemetaanDetail = async () => {
    try {
        isLoading.value = true
        const response = await $fetch<any>(`${config.public.apiBase}/api/v1/peserta-didik/get-pemetaan-rombel-by-id`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            credentials: 'include',
            body: {
                id: props.pemetaanId
            }
        })
        
        if (response.data) {
            pesertaDidikId.value = response.data.peserta_didik_id
            siswaName.value = response.data.peserta_didik?.nama || ''
            currentPhoto.value = response.data.peserta_didik?.photo || ''
        }
    } catch (err: any) {
        console.error('Error fetching pemetaan detail:', err)
        if (err.status === 401 || err.statusCode === 401) {
            await handle401()
        }
    } finally {
        isLoading.value = false
    }
}

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    
    if (file) {
        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            toastStore.error('Error', 'Ukuran file maksimal 2MB')
            target.value = ''
            return
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            toastStore.error('Error', 'File harus berupa gambar')
            target.value = ''
            return
        }
        
        photoFile.value = file
    }
}

const handleSubmit = async () => {
    if (!photoFile.value) {
        toastStore.error('Gagal', 'Silakan pilih foto terlebih dahulu')
        return
    }

    isSubmitting.value = true

    try {
        const formData = new FormData()
        formData.append('id', pesertaDidikId.value.toString())
        formData.append('photo', photoFile.value)

        await $fetch(`${config.public.apiBase}/api/v1/peserta-didik/update-peserta-didik`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            credentials: 'include',
            body: formData
        })

        toastStore.success('Sukses', 'Foto berhasil diupload')
        
        // Reset submitting state before closing
        isSubmitting.value = false
        
        // Emit success to refresh data
        emit('success')
        
        // Close modal
        emit('update:modelValue', false)
        resetForm()
    } catch (err: any) {
        console.error('Error uploading photo:', err)
        
        if (err.status === 401 || err.statusCode === 401) {
            await handle401()
            return
        }
        
        const errorMessage = err.data?.message || 'Gagal mengupload foto'
        toastStore.error('Gagal', errorMessage)
        isSubmitting.value = false
    }
}

const resetForm = () => {
    photoFile.value = null
    currentPhoto.value = ''
    siswaName.value = ''
    pesertaDidikId.value = 0
}

const closeModal = () => {
    if (!isSubmitting.value) {
        emit('update:modelValue', false)
        resetForm()
    }
}
</script>

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
                class="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md pointer-events-auto relative overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[80vh]">

                <!-- Header with Red Gradient Background -->
                <div
                    class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <!-- Animated gradient blobs -->
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0">
                    </div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0">
                    </div>

                    <!-- Header Content -->
                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Edit Rombel</h2>
                    </div>

                    <!-- Close Button -->
                    <button type="button" @click.stop="closeModal" :disabled="isSubmitting" :title="'Tutup'"
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
                    <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
                        <!-- Nama Rombel Input -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                Nama Rombel
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <input v-model="form.name" type="text" placeholder="Contoh: 1A" required
                                :disabled="isSubmitting"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>

                        <!-- Kelas Dropdown -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                Kelas
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <select v-model.number="form.kelas_id" required :disabled="isSubmitting || kelasLoading"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                <option :value="0">Pilih Kelas</option>
                                <option v-for="kelas in filteredKelases" :key="kelas.id" :value="kelas.id" :disabled="isKelasDisabled(kelas.id)">
                                    {{ kelas.name }}{{ isKelasDisabled(kelas.id) ? ' (Nonaktif)' : '' }}
                                </option>
                            </select>
                        </div>

                        <!-- Status Toggle -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                Status
                            </label>
                            <div class="flex items-center gap-3">
                                <button type="button"
                                    @click="form.status = form.status === 'active' ? 'inactive' : 'active'"
                                    :disabled="isSubmitting" :class="[
                                        'relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
                                        form.status === 'active'
                                            ? 'bg-green-600'
                                            : 'bg-gray-300'
                                    ]">
                                    <span :class="[
                                        'inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200',
                                        form.status === 'active'
                                            ? 'translate-x-7'
                                            : 'translate-x-1'
                                    ]"></span>
                                </button>
                                <span class="text-xs sm:text-sm font-medium text-gray-700">
                                    {{ form.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                </span>
                            </div>
                        </div>

                        <!-- Error Alert -->
                        <div v-if="submitError" class="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                            <p class="text-xs sm:text-sm text-red-700 font-medium">{{ submitError }}</p>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex gap-3 pt-4 sm:pt-6">
                            <button type="button" @click="closeModal" :disabled="isSubmitting"
                                class="flex-1 px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                Batal
                            </button>
                            <button type="submit" :disabled="isSubmitting"
                                class="flex-1 px-4 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold text-xs sm:text-sm hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2">
                                <span v-if="isSubmitting"
                                    class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import type { RombelData } from '~/types/RombelType'
import { useKelasStore } from '~/stores/KelasStore'

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'success': [message: string]
    'error': [message: string]
}>()

const props = defineProps<{
    modelValue: boolean
    rombelData: RombelData | null
}>()

// Stores
const kelasStore = useKelasStore()

// Form state
const form = ref({
    name: '',
    status: 'active' as 'active' | 'inactive',
    kelas_id: 0
})

// Computed: Get filtered kelas list
const filteredKelases = computed(() => {
    // Get active kelas
    const activeKelas = kelases.value.filter(k => k.status === 'active')
    
    // If editing and current kelas is inactive, add it to the list
    if (props.rombelData?.kelas && props.rombelData.kelas.status === 'inactive') {
        const currentKelas = props.rombelData.kelas
        const kelasExists = activeKelas.find(k => k.id === currentKelas.id)
        if (!kelasExists) {
            return [...activeKelas, currentKelas]
        }
    }
    
    return activeKelas
})

// Computed: Check if kelas is disabled
const isKelasDisabled = (kelasId: number) => {
    const kelas = kelases.value.find(k => k.id === kelasId)
    return kelas?.status === 'inactive'
};

const isSubmitting = ref(false)
const submitError = ref<string | null>(null)
const kelasLoading = ref(false)
const kelases = ref<any[]>([])

// Watch rombelData to update form
watch(() => props.rombelData, (newData) => {
    if (newData) {
        form.value = {
            name: newData.name,
            status: newData.status,
            kelas_id: newData.kelas_id
        }
    }
}, { deep: true })

// Fetch kelas data
const fetchKelasData = async () => {
    kelasLoading.value = true
    try {
        const result = await kelasStore.fetchKelases(1, 100, {})
        if (result.success) {
            kelases.value = kelasStore.kelases
        }
    } catch (err) {
        console.error('Error fetching kelas:', err)
    } finally {
        kelasLoading.value = false
    }
}

// Fetch kelas on mount
onMounted(() => {
    fetchKelasData()
})

// Watch modelValue - fetch kelas setiap kali modal dibuka
watch(() => props.modelValue, (newVal) => {
    if (newVal) {
        // Modal dibuka - refresh kelas data
        fetchKelasData()
    }
})

// Close modal
const closeModal = () => {
    if (!isSubmitting.value) {
        emit('update:modelValue', false)
        resetForm()
    }
}

// Reset form
const resetForm = () => {
    form.value = {
        name: '',
        status: 'active',
        kelas_id: 0
    }
    submitError.value = null
}

// Handle submit
const handleSubmit = async () => {
    // Validate form
    if (!form.value.name.trim()) {
        submitError.value = 'Nama rombel wajib diisi'
        return
    }

    if (form.value.kelas_id === 0) {
        submitError.value = 'Kelas wajib dipilih'
        return
    }

    await submitForm()
}

// Submit the form
const submitForm = async () => {
    if (!props.rombelData) return

    isSubmitting.value = true
    submitError.value = null

    try {
        const { updateRombel } = await import('~/services/rombel')
        const requestBody = {
            id: props.rombelData.id,
            name: form.value.name.trim(),
            status: form.value.status,
            kelas_id: form.value.kelas_id
        }

        console.log('Updating rombel with request body:', requestBody)
        await updateRombel(requestBody)

        // Close modal
        emit('update:modelValue', false)
        emit('success', 'Rombel berhasil diperbarui')

        resetForm()
    } catch (err: any) {
        const errorMessage = err.data?.message || err.data?.error || err.message || 'Gagal mengupdate rombel'
        submitError.value = errorMessage
        emit('error', errorMessage)
        console.error('Error updating rombel:', err)
    } finally {
        isSubmitting.value = false
    }
}
</script>

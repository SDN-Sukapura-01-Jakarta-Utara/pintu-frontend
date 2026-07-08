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
        <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto relative overflow-hidden">
                
                <!-- Header -->
                <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-red-600">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <i class="fa-solid fa-rotate-left text-white text-lg"></i>
                        </div>
                        <div>
                            <h3 class="text-base sm:text-lg font-bold text-white">Reset Pemetaan Rombel</h3>
                            <p class="text-xs sm:text-sm text-white/90">Hapus data pemetaan rombel</p>
                        </div>
                    </div>
                    <button @click="closeModal" :disabled="isLoading"
                        class="p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer">
                        <i class="fa-solid fa-xmark text-white text-xl"></i>
                    </button>
                </div>

                <!-- Content -->
                <div class="p-4 sm:p-6">
                    <!-- Reset Type Selection -->
                    <div class="mb-6">
                        <label class="block text-sm font-semibold text-gray-900 mb-3">Pilih Jenis Reset</label>
                        <div class="grid grid-cols-2 gap-3">
                            <button @click="resetType = 'rombel'" :class="[
                                'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200',
                                resetType === 'rombel' 
                                    ? 'border-orange-600 bg-orange-50 text-orange-600' 
                                    : 'border-gray-300 bg-white text-gray-600 hover:border-orange-400'
                            ]" class="cursor-pointer">
                                <i class="fa-solid fa-users text-2xl"></i>
                                <span class="text-sm font-semibold">By Rombel</span>
                            </button>
                            <button @click="resetType = 'tahun'" :class="[
                                'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200',
                                resetType === 'tahun' 
                                    ? 'border-orange-600 bg-orange-50 text-orange-600' 
                                    : 'border-gray-300 bg-white text-gray-600 hover:border-orange-400'
                            ]" class="cursor-pointer">
                                <i class="fa-solid fa-calendar text-2xl"></i>
                                <span class="text-sm font-semibold">By Tahun Pelajaran</span>
                            </button>
                        </div>
                    </div>

                    <!-- Rombel Selection (if by rombel) -->
                    <div v-if="resetType === 'rombel'" class="mb-4">
                        <label class="block text-sm font-semibold text-gray-900 mb-2">Rombel</label>
                        <select v-model="selectedRombel" 
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-100 cursor-pointer">
                            <option value="">Pilih Rombel</option>
                            <option v-for="rombel in rombelList" :key="rombel.id" :value="rombel.id">
                                {{ rombel.name }}
                            </option>
                        </select>
                    </div>

                    <!-- Tahun Pelajaran Selection -->
                    <div class="mb-4">
                        <label class="block text-sm font-semibold text-gray-900 mb-2">Tahun Pelajaran</label>
                        <select v-model="selectedTahunPelajaran" 
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-100 cursor-pointer">
                            <option value="">Pilih Tahun Pelajaran</option>
                            <option v-for="tp in tahunPelajaranList" :key="tp.id" :value="tp.id">
                                {{ tp.tahun_pelajaran }}
                            </option>
                        </select>
                    </div>

                    <!-- Warning Message -->
                    <div class="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <i class="fa-solid fa-triangle-exclamation text-red-600 text-lg flex-shrink-0 mt-0.5"></i>
                        <div>
                            <p class="text-sm font-semibold text-red-900 mb-1">Peringatan!</p>
                            <p class="text-xs text-red-800">
                                Data pemetaan rombel yang dihapus tidak dapat dikembalikan. Pastikan Anda memilih dengan benar.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="flex gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                    <button type="button" @click="closeModal" :disabled="isLoading || isConfirming"
                        class="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        Batal
                    </button>
                    <button type="button" @click="handleReset" :disabled="!isFormValid || isLoading || isConfirming"
                        class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-orange-600 text-white font-semibold text-sm hover:bg-orange-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        <i class="fa-solid fa-rotate-left"></i>
                        Reset Data
                    </button>
                </div>
            </div>
        </div>
    </Transition>

    <!-- Confirmation Modal -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="showConfirmModal" @click="showConfirmModal = false" class="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"></div>
    </Transition>

    <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4">
        <div v-if="showConfirmModal"
            class="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div
                class="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto relative overflow-hidden">

                <!-- Icon and Title -->
                <div class="p-4 sm:p-6">
                    <div class="flex flex-col items-center text-center">
                        <!-- Warning Icon -->
                        <div
                            class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-orange-100 flex items-center justify-center mb-3 sm:mb-4">
                            <svg class="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                                </path>
                            </svg>
                        </div>

                        <!-- Title -->
                        <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-2">Konfirmasi Reset Data</h3>

                        <!-- Message -->
                        <p class="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                            Apakah Anda yakin ingin mereset pemetaan rombel ini?
                            <br>
                            <span class="text-orange-600 font-medium">Tindakan ini tidak dapat dibatalkan.</span>
                        </p>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-3">
                        <button type="button" @click="showConfirmModal = false" :disabled="isConfirming"
                            class="flex-1 px-4 py-2 sm:py-2.5 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                            Batal
                        </button>
                        <button type="button" @click="confirmReset" :disabled="isConfirming"
                            class="flex-1 flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-lg bg-orange-600 text-white font-semibold text-xs sm:text-sm hover:bg-orange-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                            <span v-if="isConfirming"
                                class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                            {{ isConfirming ? 'Mereset...' : 'Ya, Reset' }}
                        </button>
                    </div>
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
    success: []
}>()

const toastStore = useToastStore()
const config = useRuntimeConfig()
const { handle401 } = useAuthGuard()

const isLoading = ref(false)
const isConfirming = ref(false)
const resetType = ref<'rombel' | 'tahun'>('rombel')
const selectedRombel = ref('')
const selectedTahunPelajaran = ref('')
const rombelList = ref<any[]>([])
const tahunPelajaranList = ref<any[]>([])
const showConfirmModal = ref(false)

const isFormValid = computed(() => {
    if (resetType.value === 'rombel') {
        return selectedRombel.value && selectedTahunPelajaran.value
    }
    return selectedTahunPelajaran.value
})

watch(() => props.modelValue, async (newVal) => {
    if (newVal) {
        await fetchRombel()
        await fetchTahunPelajaran()
    } else {
        resetForm()
    }
})

const fetchRombel = async () => {
    try {
        const response = await $fetch<any>(`${config.public.apiBase}/api/v1/rombel/get-rombel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            credentials: 'include',
            body: {
                search: {},
                pagination: { limit: 100, page: 1 }
            }
        })
        rombelList.value = response.data || []
    } catch (err: any) {
        if (err.status === 401 || err.statusCode === 401) {
            await handle401()
        }
    }
}

const fetchTahunPelajaran = async () => {
    try {
        const response = await $fetch<any>(`${config.public.apiBase}/api/v1/tahun-pelajaran/get-tahun-pelajaran`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            credentials: 'include',
            body: {
                search: {},
                pagination: { limit: 100, page: 1 }
            }
        })
        tahunPelajaranList.value = response.data || []
    } catch (err: any) {
        if (err.status === 401 || err.statusCode === 401) {
            await handle401()
        }
    }
}

const handleReset = () => {
    if (!isFormValid.value) return
    showConfirmModal.value = true
}

const confirmReset = async () => {
    isConfirming.value = true

    try {
        const body: any = {
            tahun_pelajaran_id: Number(selectedTahunPelajaran.value)
        }

        if (resetType.value === 'rombel') {
            body.rombel_id = Number(selectedRombel.value)
        }

        const response = await $fetch<any>(`${config.public.apiBase}/api/v1/peserta-didik/reset-pemetaan-rombel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            credentials: 'include',
            body
        })

        isConfirming.value = false
        showConfirmModal.value = false
        
        const message = response.data?.message || `Berhasil menghapus ${response.data?.deleted_count || 0} pemetaan rombel`
        toastStore.success('Sukses', message)
        
        emit('update:modelValue', false)
        emit('success')
    } catch (error: any) {
        console.error('Error resetting pemetaan rombel:', error)
        isConfirming.value = false
        showConfirmModal.value = false

        if (error?.status === 401 || error?.statusCode === 401) {
            await handle401()
            return
        }

        const errorMessage = error?.data?.error || error?.data?.message || error?.message || 'Gagal mereset pemetaan rombel'
        toastStore.error('Gagal', errorMessage)
    }
}

const resetForm = () => {
    resetType.value = 'rombel'
    selectedRombel.value = ''
    selectedTahunPelajaran.value = ''
}

const closeModal = () => {
    if (!isLoading.value && !isConfirming.value) {
        emit('update:modelValue', false)
    }
}
</script>

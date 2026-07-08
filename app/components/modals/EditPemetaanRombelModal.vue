<template>
    <!-- Backdrop -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="modelValue" @click="closeModal" class="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"></div>
    </Transition>

    <!-- Modal -->
    <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4">
        <div v-if="modelValue" class="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[95vh]">
                <!-- Header -->
                <div class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex items-center justify-between gap-4">
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Edit Pemetaan Rombel</h2>
                        <p class="text-xs sm:text-sm text-red-50 mt-0.5">{{ pemetaanData?.peserta_didik?.nama }} ({{ pemetaanData?.peserta_didik?.nis }})</p>
                    </div>
                    <button type="button" @click.stop="closeModal" :title="'Tutup'"
                        class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 backdrop-blur-sm cursor-pointer">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Body -->
                <div class="p-4 sm:p-6 overflow-y-auto flex-1">
                    <div class="space-y-4">
                        <!-- Rombel -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-900 mb-2">
                                Rombel <span class="text-red-600">*</span>
                            </label>
                            <select v-model="formData.rombel_id"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                                <option value="">Pilih Rombel</option>
                                <option v-for="rombel in rombelList" :key="rombel.id" :value="rombel.id">
                                    {{ rombel.name }}
                                </option>
                            </select>
                        </div>

                        <!-- Tahun Pelajaran -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-900 mb-2">
                                Tahun Pelajaran <span class="text-red-600">*</span>
                            </label>
                            <select v-model="formData.tahun_pelajaran_id"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                                <option value="">Pilih Tahun Pelajaran</option>
                                <option v-for="tp in tahunPelajaranList" :key="tp.id" :value="tp.id">
                                    {{ tp.tahun_pelajaran }}
                                </option>
                            </select>
                        </div>

                        <!-- Status -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-900 mb-2">Status</label>
                            <div class="flex items-center gap-3">
                                <span class="text-sm font-medium text-gray-700">Nonaktif</span>
                                <button type="button" @click="formData.status = formData.status === 'active' ? 'inactive' : 'active'"
                                    :class="[
                                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer',
                                        formData.status === 'active' ? 'bg-green-600' : 'bg-gray-300'
                                    ]">
                                    <span :class="[
                                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
                                        formData.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                                    ]"></span>
                                </button>
                                <span class="text-sm font-medium text-gray-700">Aktif</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-end gap-3">
                    <button @click="closeModal" :disabled="isLoading"
                        class="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 font-semibold text-sm hover:bg-gray-300 transition-colors disabled:opacity-50 cursor-pointer">
                        Batal
                    </button>
                    <button @click="handleSubmit" :disabled="isLoading || !isFormValid"
                        class="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2">
                        <div v-if="isLoading" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>{{ isLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
                    </button>
                </div>
            </div>
        </div>
    </Transition>

    <!-- Error Modal -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="showErrorModal" class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <!-- Error Header -->
                <div class="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <i class="fa-solid fa-exclamation-circle text-white text-xl"></i>
                        </div>
                        <h3 class="text-lg font-bold text-white">Gagal Menyimpan</h3>
                    </div>
                </div>

                <!-- Error Body -->
                <div class="p-6">
                    <p class="text-gray-700 text-sm leading-relaxed">{{ errorMessage }}</p>
                </div>

                <!-- Error Footer -->
                <div class="border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-end">
                    <button @click="showErrorModal = false"
                        class="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors cursor-pointer">
                        Tutup
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
    pemetaanData: Object as () => any
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'success': []
}>()

const toastStore = useToastStore()
const config = useRuntimeConfig()
const { handle401 } = useAuthGuard()

const isLoading = ref(false)
const rombelList = ref<any[]>([])
const tahunPelajaranList = ref<any[]>([])
const showErrorModal = ref(false)
const errorMessage = ref('')

const formData = ref({
    rombel_id: '',
    tahun_pelajaran_id: '',
    status: 'active'
})

const isFormValid = computed(() => {
    return formData.value.rombel_id && formData.value.tahun_pelajaran_id
})

watch(() => props.modelValue, async (newVal) => {
    if (newVal) {
        await fetchRombel()
        await fetchTahunPelajaran()
        
        if (props.pemetaanData) {
            formData.value = {
                rombel_id: props.pemetaanData.rombel_id || '',
                tahun_pelajaran_id: props.pemetaanData.tahun_pelajaran_id || '',
                status: props.pemetaanData.status || 'active'
            }
        }
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
                search: { status: 'active' },
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

const handleSubmit = async () => {
    if (!isFormValid.value || !props.pemetaanData) return

    isLoading.value = true

    try {
        await $fetch(`${config.public.apiBase}/api/v1/peserta-didik/edit-pemetaan-rombel-by-id`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            credentials: 'include',
            body: {
                id: props.pemetaanData.id,
                rombel_id: Number(formData.value.rombel_id),
                tahun_pelajaran_id: Number(formData.value.tahun_pelajaran_id),
                status: formData.value.status
            }
        })

        isLoading.value = false
        emit('update:modelValue', false)
        
        await nextTick()
        toastStore.success('Berhasil', 'Data pemetaan rombel berhasil diperbarui')
        emit('success')
    } catch (err: any) {
        isLoading.value = false
        
        if (err.status === 401 || err.statusCode === 401) {
            await handle401()
            return
        }

        errorMessage.value = err.data?.error || err.data?.message || 'Gagal memperbarui data pemetaan rombel'
        showErrorModal.value = true
    }
}

const resetForm = () => {
    formData.value = {
        rombel_id: '',
        tahun_pelajaran_id: '',
        status: 'active'
    }
    showErrorModal.value = false
    errorMessage.value = ''
}

const closeModal = () => {
    if (!isLoading.value) {
        emit('update:modelValue', false)
    }
}
</script>

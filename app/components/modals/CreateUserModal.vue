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
                        <h2 class="text-lg sm:text-xl font-bold text-white">Tambah User</h2>
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
                        <!-- Nama Input -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                Nama
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <input v-model="form.nama" type="text" placeholder="Nama lengkap user" required
                                :disabled="isSubmitting"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>

                        <!-- Username Input -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                Username
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <input v-model="form.username" type="text" placeholder="Username unik" required
                                :disabled="isSubmitting"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>

                        <!-- Password Input -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                Password
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <div class="relative flex items-center">
                                <input v-model="form.password" :type="showPassword ? 'text' : 'password'"
                                    placeholder="Minimum 6 karakter" required :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 pr-10 sm:pr-12 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                                <button type="button" @click="showPassword = !showPassword"
                                    :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
                                    :disabled="isSubmitting"
                                    class="absolute right-4 flex items-center justify-center text-gray-600 transition-colors duration-300 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    <svg v-if="!showPassword" class="h-4 w-4 sm:h-5 sm:w-5"
                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                    <svg v-else class="h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path
                                            d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24">
                                        </path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Konfirmasi Password Input -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                Konfirmasi Password
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <div class="relative flex items-center">
                                <input v-model="form.password_confirm" :type="showPasswordConfirm ? 'text' : 'password'"
                                    placeholder="Ulangi password" required :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 pr-10 sm:pr-12 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                                <button type="button" @click="showPasswordConfirm = !showPasswordConfirm"
                                    :aria-label="showPasswordConfirm ? 'Sembunyikan password' : 'Tampilkan password'"
                                    :disabled="isSubmitting"
                                    class="absolute right-4 flex items-center justify-center text-gray-600 transition-colors duration-300 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    <svg v-if="!showPasswordConfirm" class="h-4 w-4 sm:h-5 sm:w-5"
                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                    <svg v-else class="h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path
                                            d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24">
                                        </path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                </button>
                            </div>
                            <p v-if="form.password && form.password !== form.password_confirm"
                                class="mt-2 text-xs text-red-600 font-medium">
                                Password tidak cocok
                            </p>
                        </div>

                        <!-- Role Grouped by System -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                Role
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <div v-if="rolesLoading" class="flex items-center gap-2 text-gray-600">
                                <div
                                    class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-600">
                                </div>
                                <span class="text-xs sm:text-sm">Memuat role...</span>
                            </div>
                            <div v-else-if="Object.keys(rolesBySystem).length === 0"
                                class="text-xs sm:text-sm text-gray-600">
                                Belum ada role yang tersedia
                            </div>
                            <div v-else class="space-y-4">
                                <div v-for="(roleGroup, systemId) in rolesBySystem" :key="systemId"
                                    class="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <!-- System Header -->
                                    <div class="flex items-center justify-between mb-3">
                                        <h4 class="text-xs sm:text-sm font-semibold text-gray-900">{{
                                            getSystemNameById(Number(systemId)) }}</h4>
                                        <button type="button" @click="resetRoleGroup(Number(systemId))"
                                            :disabled="isSubmitting"
                                            class="px-2 py-1 text-xs font-medium bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                            Reset
                                        </button>
                                    </div>

                                    <!-- Roles Radio Group -->
                                    <div class="space-y-2">
                                        <label v-for="role in roleGroup" :key="role.id"
                                            class="flex items-center gap-3 cursor-pointer">
                                            <input :value="role.id"
                                                v-model.number="form.role_by_system[Number(systemId)]" type="radio"
                                                :name="`role-system-${systemId}`" :disabled="isSubmitting"
                                                class="w-4 h-4 rounded-full border-2 border-gray-300 text-red-600 focus:ring-2 focus:ring-red-500 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" />
                                            <div class="flex-1">
                                                <span class="text-xs sm:text-sm font-medium text-gray-700 block">{{
                                                    role.name }}</span>
                                                <span class="text-xs text-gray-500">{{ role.description }}</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
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
                            <button type="submit" :disabled="isSubmitting || form.password !== form.password_confirm"
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
import { ref, onMounted, computed, watch } from 'vue'
import type { Role, CreateUserRequest, SystemData } from '~/types/UserType'
import { getRoleList, createUser } from '~/services/user'
import { useUserStore } from '~/stores/UserStore'
import { useRoleStore } from '~/stores/RoleStore'

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'success': [message: string]
    'error': [message: string]
}>()

const props = defineProps<{
    modelValue: boolean
}>()

const userStore = useUserStore()
const roleStore = useRoleStore()

// Form state
const form = ref<CreateUserRequest & { password_confirm: string }>({
    nama: '',
    username: '',
    password: '',
    password_confirm: '',
    role_by_system: {} as Record<number, number>,
    status: 'active'
})

const roles = ref<Role[]>([])
const rolesLoading = ref(false)
const isSubmitting = ref(false)
const submitError = ref<string | null>(null)
const showPassword = ref(false)
const showPasswordConfirm = ref(false)

// Computed: Group roles by system_id (only active roles)
const rolesBySystem = computed(() => {
    const grouped: Record<number, Role[]> = {}

    roles.value.forEach(role => {
        // Filter hanya role yang status-nya active
        if (role.status === 'active') {
            if (!grouped[role.system_id]) {
                grouped[role.system_id] = []
            }
            grouped[role.system_id].push(role)
        }
    })

    return grouped
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
        nama: '',
        username: '',
        password: '',
        password_confirm: '',
        role_by_system: {},
        status: 'active'
    }
    submitError.value = null
}

// Fetch roles
const fetchRoles = async () => {
    rolesLoading.value = true
    try {
        const response = await getRoleList()
        roles.value = response.data || []
    } catch (err: any) {
        console.error('Error fetching roles:', err)
    } finally {
        rolesLoading.value = false
    }
}

// Get system name by ID
const getSystemNameById = (systemId: number): string => {
    const roleWithSystem = roles.value.find(r => r.system_id === systemId)
    if (roleWithSystem && roleWithSystem.system) {
        return roleWithSystem.system.nama
    }
    return `System ${systemId}`
}

// Reset specific role group
const resetRoleGroup = (systemId: number) => {
    delete form.value.role_by_system[systemId]
}

// Handle submit
const handleSubmit = async () => {
    // Validate form
    if (!form.value.nama || !form.value.username || !form.value.password) {
        submitError.value = 'Nama, username, dan password wajib diisi'
        return
    }

    if (Object.keys(form.value.role_by_system).length === 0) {
        submitError.value = 'Pilih minimal satu role untuk setiap sistem'
        return
    }

    if (form.value.password !== form.value.password_confirm) {
        submitError.value = 'Password tidak cocok'
        return
    }

    if (form.value.password.length < 6) {
        submitError.value = 'Password minimal 6 karakter'
        return
    }

    isSubmitting.value = true
    submitError.value = null

    try {
        // Prepare request body
        const role_ids = Object.values(form.value.role_by_system)
        const requestBody: any = {
            nama: form.value.nama,
            username: form.value.username,
            password: form.value.password,
            role_ids: role_ids,
            status: form.value.status
        }

        console.log('Creating user with request body:', requestBody)
        await createUser(requestBody)

        // Refresh data
        await userStore.fetchUsers()

        // Close modal
        emit('update:modelValue', false)
        emit('success', 'User berhasil ditambahkan')

        resetForm()
    } catch (err: any) {
        const errorMessage = err.data?.message || err.data?.error || err.message || 'Gagal menambahkan user'
        submitError.value = errorMessage
        emit('error', errorMessage)
        console.error('Error creating user:', err)
    } finally {
        isSubmitting.value = false
    }
}

// Watch modal open state - fetch roles when modal opens
watch(
    () => props.modelValue,
    async (newVal) => {
        if (newVal) {
            await fetchRoles()
        } else {
            resetForm()
        }
    }
)

// Watch roleStore changes - auto reload roles when role data changes
watch(
    () => roleStore.roles,
    async () => {
        if (props.modelValue) {
            // Only refresh if modal is currently open
            await fetchRoles()
        }
    },
    { deep: true }
)

// Lifecycle
onMounted(() => {
    fetchRoles()
})
</script>

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
              class="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-2xl w-full max-w-2xl lg:max-w-6xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">

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
                        <h2 class="text-lg sm:text-xl font-bold text-white">Tambah Role</h2>
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
                        <!-- Nama Role Input -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                Nama Role
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <input v-model="form.name" type="text" placeholder="Contoh: Administrator PINTU" required
                                :disabled="isSubmitting"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>

                        <!-- Deskripsi Input -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                Deskripsi
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <textarea v-model="form.description" placeholder="Deskripsikan role ini..." required
                                :disabled="isSubmitting"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                                rows="3"></textarea>
                        </div>

                        <!-- Sistem Dropdown & Status Toggle -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <!-- Sistem Dropdown -->
                            <div>
                                <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                    Sistem
                                    <span class="text-red-600 ml-1">*</span>
                                </label>
                                <div v-if="systemsLoading" class="flex items-center gap-2 text-gray-600">
                                    <div
                                        class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-600">
                                    </div>
                                    <span class="text-xs sm:text-sm">Memuat sistem...</span>
                                </div>
                                <select v-else v-model.number="form.system_id" @change="handleSystemChange" required
                                    :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    <option :value="0" disabled>Pilih Sistem</option>
                                    <option v-for="system in systems" :key="system.id" :value="system.id">
                                        {{ system.nama }}
                                    </option>
                                </select>
                            </div>

                            <!-- Status Toggle -->
                            <div class="flex flex-col">
                                <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                    Status
                                </label>
                                <div class="flex items-center gap-3 h-10 sm:h-11">
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
                        </div>

                        <!-- Permissions Section -->
                        <div v-if="form.system_id !== 0"
                            class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 p-4 sm:p-6">
                            <div class="flex items-center gap-2 mb-4 sm:mb-6">
                                <svg class="w-4 sm:w-5 h-4 sm:h-5 text-red-600 flex-shrink-0" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12l2 2 4-4m7.538-4.854a.5.5 0 00-.847-.5l-4.096 6.763-1.864-1.991a.5.5 0 00-.745.746l2.592 2.791a.5.5 0 00.747-.013l4.213-6.996zM21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                                    </path>
                                </svg>
                                <h3 class="text-sm sm:text-base font-bold text-gray-900">Izin (Permissions)</h3>
                            </div>

                            <!-- Loading Permissions -->
                            <div v-if="permissionsLoading" class="flex items-center justify-center py-8">
                                <div class="flex flex-col items-center gap-3">
                                    <div
                                        class="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600">
                                    </div>
                                    <p class="text-xs sm:text-sm text-gray-600 font-medium">Memuat permissions...</p>
                                </div>
                            </div>

                            <!-- Permission Groups Grid with Horizontal Scroll -->
                            <div v-else class="overflow-x-auto pb-2">
                                <div
                                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-none lg:flex lg:flex-wrap gap-3 sm:gap-6 lg:gap-6">
                                    <div v-for="(permissions, groupName) in groupedPermissions" :key="groupName"
                                        class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-3 sm:p-4 w-full sm:w-auto lg:w-80 flex-shrink-0">
                                        <!-- Group Header -->
                                        <div class="flex items-center gap-2 mb-3">
                                            <div
                                                class="flex-shrink-0 w-6 sm:w-7 h-6 sm:h-7 rounded-md bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                                                <svg class="w-3 sm:w-4 h-3 sm:h-4 text-white" fill="currentColor"
                                                    viewBox="0 0 20 20">
                                                    <path
                                                        d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM15.657 14.243a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM11 17a1 1 0 102 0v-1a1 1 0 10-2 0v1zM5.757 15.657a1 1 0 00-1.414-1.414l-.707.707a1 1 0 101.414 1.414l.707-.707zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zM5.757 4.343a1 1 0 00-1.414 1.414l.707.707a1 1 0 101.414-1.414l-.707-.707z">
                                                    </path>
                                                </svg>
                                            </div>
                                            <div class="min-w-0 flex-1">
                                                <h4 class="text-xs sm:text-sm font-bold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">{{
                                                    formatGroupName(groupName)
                                                    }}</h4>
                                                <p class="text-[10px] sm:text-xs text-gray-600">{{ permissions.length }}
                                                    izin</p>
                                            </div>
                                        </div>

                                        <!-- Permissions Checkboxes -->
                                         <div class="space-y-2 max-h-96 overflow-y-auto">
                                             <label v-for="permission in permissions" :key="permission.id"
                                                 :class="[
                                                     'flex items-start gap-2 p-2 rounded-md transition-colors',
                                                     permission.status === 'inactive'
                                                         ? 'bg-gray-100 opacity-60 cursor-not-allowed'
                                                         : 'hover:bg-blue-100/50 cursor-pointer group'
                                                 ]">
                                                 <input type="checkbox" :value="permission.id"
                                                     v-model.number="form.permission_ids"
                                                     :disabled="isSubmitting || permission.status === 'inactive'"
                                                     class="mt-0.5 h-4 w-4 rounded border-2 border-blue-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0" />
                                                 <div class="flex-1 min-w-0">
                                                     <div class="flex items-center gap-1.5">
                                                         <p
                                                             class="text-xs sm:text-xs font-semibold whitespace-nowrap overflow-hidden text-ellipsis"
                                                             :class="permission.status === 'inactive' ? 'text-gray-600' : 'text-gray-900 group-hover:text-blue-700'">
                                                             {{
                                                             permission.name }}</p>
                                                         <span v-if="permission.status === 'inactive'"
                                                             class="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-semibold flex-shrink-0">
                                                             Nonaktif
                                                         </span>
                                                     </div>
                                                     <p class="text-[10px] sm:text-[11px] line-clamp-2"
                                                         :class="permission.status === 'inactive' ? 'text-gray-500' : 'text-gray-600'">{{
                                                         permission.description
                                                         }}</p>
                                                 </div>
                                             </label>
                                         </div>
                                    </div>
                                </div>
                            </div>

                            <!-- No Permissions Message -->
                            <div v-if="!permissionsLoading && Object.keys(groupedPermissions).length === 0"
                                class="py-8 text-center">
                                <p class="text-xs sm:text-sm text-gray-600">Tidak ada permissions untuk sistem ini</p>
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
import { ref, onMounted, computed } from 'vue'
import type { SystemData, CreateRoleRequest, PermissionData } from '~/types/RoleType'
import { createRole } from '~/services/role'
import { getSystemList } from '~/services/user'
import { getPermissionsBySystem } from '~/services/permission'
import { useRoleStore } from '~/stores/RoleStore'

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'success': [message: string]
    'error': [message: string]
}>()

const props = defineProps<{
    modelValue: boolean
}>()

const roleStore = useRoleStore()

// Form state
const form = ref<CreateRoleRequest & { permission_ids: number[] }>({
    name: '',
    description: '',
    system_id: 0,
    status: 'active',
    permission_ids: []
})

const systems = ref<SystemData[]>([])
const permissions = ref<PermissionData[]>([])
const systemsLoading = ref(false)
const permissionsLoading = ref(false)
const isSubmitting = ref(false)
const submitError = ref<string | null>(null)

// Group permissions by group_name
const groupedPermissions = computed(() => {
    const grouped: Record<string, PermissionData[]> = {}

    permissions.value.forEach(permission => {
        const groupName = permission.group_name
        if (!grouped[groupName]) {
            grouped[groupName] = []
        }
        grouped[groupName].push(permission)
    })

    return grouped
})

// Format group name from snake_case to Title Case
const formatGroupName = (groupName: string): string => {
    return groupName
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
}

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
        description: '',
        system_id: 0,
        status: 'active',
        permission_ids: []
    }
    permissions.value = []
    submitError.value = null
}

// Fetch systems
const fetchSystems = async () => {
    systemsLoading.value = true
    try {
        const response = await getSystemList(1, 100, { status: 'active' })
        systems.value = response.data || []
    } catch (err: any) {
        console.error('Error fetching systems:', err)
    } finally {
        systemsLoading.value = false
    }
}

// Handle system change
const handleSystemChange = async () => {
    if (form.value.system_id === 0) {
        permissions.value = []
        form.value.permission_ids = []
        return
    }

    permissionsLoading.value = true
    submitError.value = null
    form.value.permission_ids = []

    try {
        const response = await getPermissionsBySystem(form.value.system_id)
        permissions.value = response.data || []
    } catch (err: any) {
        const errorMessage = err.data?.message || err.data?.error || err.message || 'Gagal memuat permissions'
        submitError.value = errorMessage
        console.error('Error fetching permissions:', err)
        permissions.value = []
    } finally {
        permissionsLoading.value = false
    }
}

// Handle submit
const handleSubmit = async () => {
    // Validate form
    if (!form.value.name || !form.value.description) {
        submitError.value = 'Nama role dan deskripsi wajib diisi'
        return
    }

    if (form.value.system_id === 0) {
        submitError.value = 'Pilih sistem'
        return
    }

    isSubmitting.value = true
    submitError.value = null

    try {
        const requestBody: CreateRoleRequest & { permission_ids?: number[] } = {
            name: form.value.name,
            description: form.value.description,
            system_id: form.value.system_id,
            status: form.value.status
        }

        // Add permission_ids only if there are selected permissions
        if (form.value.permission_ids && form.value.permission_ids.length > 0) {
            requestBody.permission_ids = form.value.permission_ids
        }

        console.log('Creating role with request body:', requestBody)
        await createRole(requestBody)

        // Refresh data
        await roleStore.fetchRoles()

        // Close modal
        emit('update:modelValue', false)
        emit('success', 'Role berhasil ditambahkan')

        resetForm()
    } catch (err: any) {
        const errorMessage = err.data?.message || err.data?.error || err.message || 'Gagal menambahkan role'
        submitError.value = errorMessage
        emit('error', errorMessage)
        console.error('Error creating role:', err)
    } finally {
        isSubmitting.value = false
    }
}

// Lifecycle
onMounted(() => {
    fetchSystems()
})
</script>

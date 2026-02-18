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
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pointer-events-none">
      <div
        class="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-lg md:max-w-2xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] md:max-h-[85vh]">

        <!-- Header with Red Gradient Background -->
        <div
          class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0">
          <!-- Animated gradient blobs -->
          <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
          <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

          <!-- Close Button -->
          <button type="button" @click.stop="closeModal"
            class="absolute top-0.5 right-1.5 sm:right-4 z-10 p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 backdrop-blur-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white pointer-events-none flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- Header Content -->
          <div class="relative z-10">
            <h2 class="text-base sm:text-lg md:text-xl font-bold text-white">Detail User</h2>
          </div>
        </div>

        <!-- Body with padding and scrollbar -->
        <div class="p-3 sm:p-5 md:p-8 relative z-10 overflow-y-auto flex-1">
          <!-- Loading State -->
          <div v-if="isLoading" class="flex items-center justify-center py-12">
            <div class="flex flex-col items-center gap-4">
              <div class="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
              <p class="text-sm text-gray-600 font-medium">Memuat detail user...</p>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="rounded-lg sm:rounded-xl border-2 border-red-200 bg-red-50 p-3 sm:p-4 md:p-6">
            <div class="flex items-start gap-3 sm:gap-4">
              <div class="flex-shrink-0">
                <svg class="h-5 sm:h-6 w-5 sm:w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd" />
                </svg>
              </div>
              <div class="min-w-0">
                <h3 class="text-base sm:text-lg font-semibold text-red-900">Gagal memuat data</h3>
                <p class="mt-1 text-xs sm:text-sm text-red-800 break-words">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div v-else-if="userDetail" class="space-y-6">
            <!-- User Basic Info Card -->
            <div class="bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg sm:rounded-xl border-2 border-violet-200 p-3 sm:p-4 md:p-6">
              <div class="flex items-start justify-between gap-3 mb-3 sm:mb-4">
                <div class="min-w-0">
                  <h3 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">{{ userDetail.nama }}</h3>
                  <p class="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 truncate">@{{ userDetail.username }}</p>
                </div>
                <div :class="[
                  'px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0',
                  userDetail.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                ]">
                  {{ userDetail.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                </div>
              </div>

              <!-- User Meta Info -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
                <div class="flex items-center gap-2 sm:gap-3">
                  <div class="flex-shrink-0 w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-pink-200 flex items-center justify-center">
                    <svg class="w-4 sm:w-5 h-4 sm:h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs text-gray-600">Dibuat Pada</p>
                    <p class="text-xs sm:text-sm font-semibold text-gray-900 truncate">{{ formatDate(userDetail.created_at) }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-2 sm:gap-3">
                  <div class="flex-shrink-0 w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-amber-200 flex items-center justify-center">
                    <svg class="w-4 sm:w-5 h-4 sm:h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs text-gray-600">Diperbarui</p>
                    <p class="text-xs sm:text-sm font-semibold text-gray-900 truncate">{{ formatDate(userDetail.updated_at) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Roles by System Section -->
            <div v-if="userDetail.roles && userDetail.roles.length > 0" class="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
              <div class="border-b border-gray-200 px-3 sm:px-5 md:px-6 py-3 sm:py-4">
                <h3 class="text-base sm:text-lg md:text-lg font-bold text-gray-900 flex items-center gap-2">
                  <svg class="w-4 sm:w-5 h-4 sm:h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="truncate">Role & Sistem</span>
                </h3>
              </div>

              <!-- Group roles by system -->
              <div class="divide-y divide-gray-200">
                <div v-for="(roleGroup, systemName) in groupRolesBySystem" :key="systemName" class="p-3 sm:p-4 md:p-6 hover:bg-gray-50 transition-colors">
                  <!-- System Header -->
                  <div class="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div class="flex-shrink-0 w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                      <svg class="w-4 sm:w-5 h-4 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                      </svg>
                    </div>
                    <div class="min-w-0">
                      <h4 class="text-sm sm:text-base font-bold text-gray-900 truncate">{{ systemName }}</h4>
                      <p class="text-xs text-gray-500">Sistem Informasi</p>
                    </div>
                  </div>

                  <!-- Roles List -->
                  <div class="ml-11 sm:ml-13 space-y-2 sm:space-y-3">
                    <div v-for="role in roleGroup" :key="role.id" class="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <div class="flex-shrink-0 w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-green-200 flex items-center justify-center mt-0.5">
                        <svg class="w-3 sm:w-3.5 h-3 sm:h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-xs sm:text-sm font-semibold text-gray-900 truncate">{{ role.name }}</p>
                        <p class="text-xs text-gray-600 mt-0.5 line-clamp-2">{{ role.description }}</p>
                        <div class="flex items-center gap-2 mt-1 sm:mt-2 flex-wrap">
                          <span v-if="role.status" :class="[
                            'inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold',
                            role.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          ]">
                            {{ role.status === 'active' ? '✓ Aktif' : '⊘ Nonaktif' }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Roles State -->
            <div v-else class="bg-yellow-50 rounded-lg sm:rounded-xl border-2 border-yellow-200 p-3 sm:p-4 md:p-6">
              <div class="flex items-start gap-3 sm:gap-4">
                <div class="flex-shrink-0">
                  <svg class="h-5 sm:h-6 w-5 sm:w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-sm sm:text-base font-semibold text-yellow-900">Tidak ada role</h3>
                  <p class="mt-1 text-xs sm:text-sm text-yellow-800">User ini belum memiliki role yang ditugaskan</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-200 px-3 sm:px-5 md:px-8 py-2 sm:py-3 md:py-4 flex-shrink-0 flex gap-3">
          <button @click="closeModal"
            class="flex-1 px-3 sm:px-4 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold text-xs sm:text-sm hover:shadow-lg transition-all duration-200 cursor-pointer">
            Tutup
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { getUserById } from '~/services/user'

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const props = defineProps<{
  modelValue: boolean
  userId: number | null
}>()

// State
const isLoading = ref(false)
const error = ref<string | null>(null)
const userDetail = ref<any>(null)

// Close modal
const closeModal = () => {
  emit('update:modelValue', false)
}

// Format date
const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateString
  }
}

// Group roles by system
const groupRolesBySystem = computed(() => {
  if (!userDetail.value?.roles) return {}

  const grouped: Record<string, any[]> = {}
  userDetail.value.roles.forEach((role: any) => {
    const systemName = role.system?.nama || 'Unknown System'
    if (!grouped[systemName]) {
      grouped[systemName] = []
    }
    grouped[systemName].push(role)
  })

  return grouped
})

// Fetch user detail
const fetchUserDetail = async (userId: number) => {
  if (!userId) return

  isLoading.value = true
  error.value = null
  userDetail.value = null

  try {
    const response = await getUserById(userId)
    userDetail.value = response.data || null
  } catch (err: any) {
    const errorMessage = err.data?.message || err.data?.error || err.message || 'Gagal memuat detail user'
    error.value = errorMessage
    console.error('Error fetching user detail:', err)
  } finally {
    isLoading.value = false
  }
}

// Watch for modal open/close
watch(
  () => props.modelValue,
  async (newVal) => {
    if (newVal && props.userId) {
      await fetchUserDetail(props.userId)
    } else {
      userDetail.value = null
      error.value = null
    }
  }
)
</script>

<style scoped>
.ml-11 {
  margin-left: 2.75rem;
}

.ml-13 {
  margin-left: 3.25rem;
}
</style>

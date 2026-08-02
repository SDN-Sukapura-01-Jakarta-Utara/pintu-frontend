<template>
  <nav class="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
    <div class="flex items-center justify-between h-16 px-6">
      <!-- Left: Hamburger & Title -->
      <div class="flex items-center gap-4">
        <button
          @click="$emit('toggle-sidebar')"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <i class="fa-solid fa-bars w-6 h-6 text-gray-700"></i>
        </button>
        <h1 class="text-xl font-bold text-gray-900">{{ pageTitle }}</h1>
      </div>

      <!-- Right: User Info & Logout (Desktop Only) -->
      <div class="hidden md:flex items-center gap-4">
        <!-- User Info Container with Photo -->
        <div class="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-2">
          <!-- Student Photo -->
          <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0 bg-gradient-to-br from-red-400 to-red-600">
            <img
              v-if="studentDetail?.photo"
              :src="studentDetail.photo"
              :alt="studentDetail?.nama"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <i class="fa-solid fa-user-graduate text-white text-lg"></i>
            </div>
          </div>
          
          <!-- Student Info -->
          <div>
            <p class="text-sm font-semibold text-gray-900">{{ studentDetail?.nama || student?.nama }}</p>
            <p class="text-xs text-gray-600">Kelas {{ student?.rombel?.[0]?.rombel_name || '-' }}</p>
          </div>
        </div>

        <!-- Logout Button -->
        <button
          @click="$emit('logout')"
          :disabled="isLoading"
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i v-if="isLoading" class="fa-solid fa-spinner w-4 h-4 animate-spin"></i>
          <i v-else class="fa-solid fa-sign-out-alt w-4 h-4"></i>
          <span>{{ isLoading ? 'Keluar...' : 'Keluar' }}</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  student: any
  isLoading: boolean
  pageTitle: string
}>()

defineEmits<{
  'toggle-sidebar': []
  'logout': []
}>()

const config = useRuntimeConfig()
const studentDetail = ref<any>(null)

const loadStudentDetail = async () => {
  if (!props.student?.id) return
  
  const token = localStorage.getItem('student_token')
  if (!token) return
  
  try {
    const response: any = await $fetch(
      `${config.public.apiBase}/api/v1/peserta-didik/get-peserta-didik-by-id`,
      {
        method: 'POST',
        body: { id: props.student.id },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      }
    )
    studentDetail.value = response.data
  } catch (error) {
    console.error('Error fetching student detail:', error)
    // Fallback to props student data
    studentDetail.value = props.student
  }
}

// Load on mount
onMounted(() => {
  loadStudentDetail()
})

// Reload when student changes
watch(() => props.student?.id, () => {
  loadStudentDetail()
})
</script>

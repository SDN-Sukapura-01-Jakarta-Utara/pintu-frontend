<template>
  <div>
    <!-- Alert notification -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="-translate-y-full opacity-0 translate-x-full"
        enter-to-class="translate-y-0 opacity-100 translate-x-0"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="translate-y-0 opacity-100 translate-x-0"
        leave-to-class="-translate-y-full opacity-0 translate-x-full"
      >
        <div v-if="alertState" class="fixed top-6 right-4 lg:right-8 z-50 w-full max-w-xs lg:max-w-sm px-4 lg:px-0">
          <div
            :class="[
              'rounded-xl px-4 py-3 sm:px-5 sm:py-4 shadow-xl flex items-start gap-3',
              alertState.type === 'success'
                ? 'bg-green-50 border-2 border-green-200'
                : 'bg-red-50 border-2 border-red-200',
            ]"
          >
            <div class="flex-shrink-0 pt-0.5" :class="alertState.type === 'success' ? 'text-green-600' : 'text-red-600'">
              <svg v-if="alertState.type === 'success'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p :class="[
                'font-semibold text-sm sm:text-base',
                alertState.type === 'success' ? 'text-green-900' : 'text-red-900',
              ]">
                {{ alertState.title }}
              </p>
              <p v-if="alertState.message" :class="[
                'text-xs sm:text-sm mt-1 line-clamp-2',
                alertState.type === 'success' ? 'text-green-700' : 'text-red-700',
              ]">
                {{ alertState.message }}
              </p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Login form -->
    <form @submit.prevent="handleSubmit" class="w-full max-w-md rounded-2xl bg-white p-8 sm:p-10 md:p-12 shadow-2xl animate-slide-up mx-auto">
    <!-- Logo -->
    <div class="mb-8 flex justify-center">
      <img src="~/assets/images/logo-sekolah.jpg" alt="Logo SDN Sukapura 01" class="h-28 w-28 rounded-full object-cover shadow-lg animate-float" />
    </div>

    <!-- Header Text -->
    <div class="mb-8 sm:mb-10 text-center">
      <h1 class="mb-1 sm:mb-2 text-2xl sm:text-3xl font-black text-red-600 title-bold">PINTU SDN Sukapura 01</h1>
      <p class="text-xs sm:text-sm font-medium text-pink-500">Portal Informasi Terpadu - Backoffice</p>
    </div>

    <!-- Form Inputs -->
    <div class="mb-8 space-y-5">
      <!-- Username Input -->
      <div class="flex flex-col gap-2">
        <label for="username" class="text-xs sm:text-sm font-semibold text-gray-800">Username</label>
        <div class="relative flex items-center">
          <svg class="absolute left-4 h-4 w-4 text-red-600 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <input
            id="username"
            v-model="form.username"
            type="text"
            placeholder="Masukkan username Anda"
            required
            :disabled="isSubmitting"
            class="w-full rounded-xl sm:rounded-2xl border-2 border-gray-200 bg-gray-50 py-2 sm:py-3 pl-10 sm:pl-12 pr-4 text-xs sm:text-sm font-medium transition-all duration-300 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <!-- Password Input -->
      <div class="flex flex-col gap-2">
        <label for="password" class="text-xs sm:text-sm font-semibold text-gray-800">Password</label>
        <div class="relative flex items-center">
          <svg class="absolute left-4 h-4 w-4 text-red-600 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Masukkan password Anda"
            required
            :disabled="isSubmitting"
            class="w-full rounded-xl sm:rounded-2xl border-2 border-gray-200 bg-gray-50 py-2 sm:py-3 pl-10 sm:pl-12 pr-10 sm:pr-12 text-xs sm:text-sm font-medium transition-all duration-300 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
            :disabled="isSubmitting"
            class="absolute right-4 flex items-center justify-center text-gray-600 transition-colors duration-300 hover:text-red-600 disabled:opacity-50"
          >
            <svg v-if="!showPassword" class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <svg v-else class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      :disabled="isSubmitting"
      class="flex w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-600 to-pink-500 px-4 sm:px-6 py-2.5 sm:py-3 font-semibold text-sm sm:text-base text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-80"
    >
      <span v-if="isSubmitting" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
      <span>{{ isSubmitting ? 'Memproses...' : 'Masuk Sekarang' }}</span>
      <svg v-if="!isSubmitting" class="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </button>

      <!-- Footer -->
      <p class="mt-4 sm:mt-6 text-center text-xs text-gray-500">
        Sistem Informasi Terintegrasi SDN Sukapura 01
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { LoginCredentials } from '~/types/AuthType'
import { useAuth } from '~/composables/useAuth'

const { performLogin } = useAuth()

const form = ref<LoginCredentials>({
  username: '',
  password: ''
})

const showPassword = ref(false)
const isSubmitting = ref(false)
const alertState = ref<{
  show: boolean
  type: 'success' | 'error'
  title: string
  message?: string
} | null>(null)

let alertTimeout: NodeJS.Timeout

const showAlert = (type: 'success' | 'error', title: string, message?: string) => {
  // Clear previous timeout
  if (alertTimeout) clearTimeout(alertTimeout)
  
  alertState.value = {
    show: true,
    type,
    title,
    message,
  }
  
  // Auto dismiss setelah 5 detik
  alertTimeout = setTimeout(() => {
    alertState.value = null
  }, 5000)
}

const handleSubmit = async () => {
  if (isSubmitting.value) return
  
  const router = useRouter()
  isSubmitting.value = true
  try {
    const result = await performLogin(form.value)
    
    if (result.success) {
      showAlert('success', 'Login Berhasil', 'Selamat datang di PINTU SDN Sukapura 01')
      
      // Redirect ke dashboard setelah 2 detik (replace history untuk hindari back ke login)
      setTimeout(() => {
        router.replace('/backoffice')
      }, 2000)
    } else {
      showAlert('error', 'Login Gagal', result.message || 'Username atau password salah')
    }
  } catch (error: any) {
    showAlert('error', 'Login Gagal', error.message || 'Terjadi kesalahan saat login')
    console.error('Login error:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.title-bold {
  font-weight: 900;
  letter-spacing: -1px;
  text-shadow: 0 1px 2px rgba(200, 35, 51, 0.1);
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
